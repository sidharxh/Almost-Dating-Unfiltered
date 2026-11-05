'use client';

import {useEffect, useRef, useState} from 'react';
import {usePathname} from 'next/navigation';

type EventName = 'quiz_card_click'|'quiz_landing_view'|'quiz_start'|'quiz_question_answer'|'quiz_complete'|'quiz_result_view'|'quiz_result_share_click'|'quiz_result_link_copy'|'quiz_result_card_download'|'quiz_next_recommendation_click'|'simulator_waitlist_submit'|'simulator_waitlist_success';
type EventParams = {quiz_id?:string;quiz_version?:number;question_number?:number;question_count?:number;placement?:string;share_method?:string;completion_seconds?:number};
type CookieChoice = 'accepted'|'rejected'|'unanswered'|'legacy-disabled';
declare global {interface Window {dataLayer:unknown[];gtag?:(...args:unknown[])=>void}}

export const cookieSettingsEvent = 'almost:open-cookie-settings';
const measurementId = 'G-WWJH2R0QS6';
const choiceKey = 'almost:cookie-consent';

function safePath(path:string) {return path.replace(/(\/quizzes\/[^/]+\/results)\/[^/]+/,'$1')}
function cookieChoice():CookieChoice {
  try {
    const choice=localStorage.getItem(choiceKey);
    if(choice==='accepted'||choice==='rejected')return choice;
    // Respect people who declined the previous banner, which asked about all analytics.
    const oldChoice=localStorage.getItem('almost:analytics');
    if(oldChoice==='no')return 'legacy-disabled';
    if(oldChoice==='yes')return 'accepted';
    return 'unanswered';
  } catch {return 'legacy-disabled'}
}
function allowed() {return process.env.NODE_ENV==='production'&&!location.pathname.startsWith('/auth')&&cookieChoice()!=='legacy-disabled'}
function campaign() {
  try {
    const query=new URLSearchParams(location.search);
    const fields=['source','medium','campaign','content'] as const;
    const found:Record<string,string>={};
    for(const field of fields) {
      const value=query.get('utm_'+field);
      if(value&&/^[a-zA-Z0-9_-]{1,64}$/.test(value))found['campaign_'+field]=value;
    }
    if(Object.keys(found).length)sessionStorage.setItem('almost:campaign',JSON.stringify(found));
    const saved=JSON.parse(sessionStorage.getItem('almost:campaign')||'{}');
    return Object.fromEntries(Object.entries(saved).filter(([key,value])=>fields.some(field=>key==='campaign_'+field)&&typeof value==='string'&&/^[a-zA-Z0-9_-]{1,64}$/.test(value)));
  } catch {return {}}
}
function ensure() {
  if(!allowed())return false;
  if(!window.gtag) {
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){window.dataLayer.push(arguments)};
    // This must run before the Google tag config. Rejection still allows
    // Google's measurements without analytics or advertising cookies.
    window.gtag('consent','default',{
      analytics_storage:cookieChoice()==='accepted'?'granted':'denied',
      ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',
    });
    window.gtag('js',new Date());
    window.gtag('config',measurementId,{
      send_page_view:false,allow_google_signals:false,
      allow_ad_personalization_signals:false,
      page_location:location.origin+safePath(location.pathname),
      page_referrer:'',page_title:'Almost',...campaign(),
    });
    const script=document.createElement('script');
    script.async=true;
    script.src=`https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }
  return true;
}
function clearAnalyticsCookies() {
  const domains=[location.hostname,location.hostname.replace(/^www\./,'')];
  for(const cookie of document.cookie.split(';')) {
    const name=cookie.split('=')[0]?.trim();
    if(!name||!/^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name))continue;
    document.cookie=`${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    for(const domain of domains)document.cookie=`${name}=; Max-Age=0; Path=/; Domain=${domain}; SameSite=Lax`;
  }
}

export function track(name:EventName,params:EventParams={}) {
  try {
    if(ensure())window.gtag?.('event',name,{
      ...params,page_location:location.origin+safePath(location.pathname),
      page_referrer:'',page_title:'Almost',
    });
  } catch {/* Analytics must never interrupt a quiz. */}
}
export function TrackView({event,quizId,version}:{event:'quiz_landing_view'|'quiz_result_view';quizId:string;version:number}) {
  useEffect(()=>{track(event,{quiz_id:quizId,quiz_version:version})},[event,quizId,version]);
  return null;
}
export function Analytics() {
  const pathname=usePathname();
  const [choice,setChoice]=useState<CookieChoice|null>(null);
  const [settingsOpen,setSettingsOpen]=useState(false);
  const lastPage=useRef<string|null>(null);
  useEffect(()=>{
    setChoice(cookieChoice());
    const open=()=>setSettingsOpen(true);
    window.addEventListener(cookieSettingsEvent,open);
    return ()=>window.removeEventListener(cookieSettingsEvent,open);
  },[]);
  useEffect(()=>{
    if(choice===null||choice==='legacy-disabled'||lastPage.current===pathname)return;
    if(ensure()) {
      window.gtag?.('event','page_view',{
        page_location:location.origin+safePath(pathname),
        page_path:safePath(pathname),page_referrer:'',page_title:'Almost',
      });
      lastPage.current=pathname;
    }
  },[pathname,choice]);

  function choose(value:'accepted'|'rejected') {
    try {
      localStorage.setItem(choiceKey,value);
      localStorage.removeItem('almost:analytics');
    } catch {return}
    window.gtag?.('consent','update',{analytics_storage:value==='accepted'?'granted':'denied'});
    if(value==='rejected')clearAnalyticsCookies();
    setChoice(value);
    setSettingsOpen(false);
  }
  if(process.env.NODE_ENV!=='production'||(choice!=='unanswered'&&!settingsOpen))return null;
  return <aside className="consent" aria-label="Cookie settings">
    <span>We send visits and quiz activity to Google Analytics. Optional cookies give us fuller reports. <a href="/privacy"><u>Privacy</u></a></span>
    <div><button onClick={()=>choose('rejected')}>Reject cookies</button><button onClick={()=>choose('accepted')}>Accept cookies</button></div>
  </aside>;
}
