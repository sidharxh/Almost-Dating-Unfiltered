'use client';
import {track} from './analytics';
export function TrackedLink({href,quizId,version,event,children,className}:{href:string;quizId:string;version:number;event:'quiz_card_click'|'quiz_next_recommendation_click';children:React.ReactNode;className?:string}){return <a href={href} className={className} onClick={()=>track(event,{quiz_id:quizId,quiz_version:version,placement:event==='quiz_card_click'?'quiz_card':'result'})}>{children}</a>}
