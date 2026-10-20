(()=>{
  const api='https://uajkmfiuuljbnuawovma.supabase.co/rest/v1';
  const key='sb_publishable_gVCj4Z6JlPjWNwc7buKKmg_zaZTLU7r';
  const main=document.querySelector('main.wrap');
  if(!main||!document.querySelector('article'))return;
  const slug=location.pathname.split('/').pop().replace(/\.html$/,'');
  const storyId=main.dataset.storyId||'';
  const category=document.querySelector('.tag')?.textContent.trim()||'Dating stories';
  const title=main.querySelector('h1')?.textContent.trim()||document.title;
  const article=main.querySelector('article');
  const visitorId=getStoredUuid('almost-visitor-id');
  const sessionId=getStoredUuid('almost-session-id');
  const defaultPoll=[
    {key:'friends',label:'Keep it just a friendship'},
    {key:'explore',label:'Explore the connection'},
    {key:'end',label:'End things with partner'},
    {key:'wait',label:'Not meet in person'}
  ];
  let stories=[];

  function getStoredUuid(name){try{let value=localStorage.getItem(name);if(!value){value=crypto.randomUUID();localStorage.setItem(name,value)}return value}catch{return crypto.randomUUID()}}
  function track(type,target='',metadata={}){
    const safeMeta=Object.fromEntries(Object.entries(metadata).filter(([k,v])=>typeof v==='string'||typeof v==='number'||typeof v==='boolean').slice(0,12));
    fetch(api+'/story_interactions',{method:'POST',keepalive:true,headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({story_slug:slug,story_id:storyId||null,session_id:sessionId,event_type:type,target_id:String(target).slice(0,80)||null,metadata:safeMeta})}).catch(()=>{});
    if(typeof window.gtag==='function')window.gtag('event',type,{story_slug:slug,story_id:storyId||undefined,target_id:String(target).slice(0,80)});
  }
  async function request(path,options={}){
    const response=await fetch(api+'/'+path,{...options,headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json',Prefer:options.method==='POST'?'return=minimal':'return=representation',...(options.headers||{})}});
    if(!response.ok)throw new Error('Request failed ('+response.status+')');
    return response.status===204||options.method==='POST'?[]:response.json();
  }
  const elem=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node};

  function installLayout(){
    document.body.classList.add('story-enhanced');
    const bar=elem('header','story-sitebar');
    const brand=elem('a','story-sitebrand');brand.href='../index.html';brand.innerHTML='<b aria-hidden="true">♥</b><span>Almost<small>Dating, Unfiltered</small></span>';
    const nav=elem('nav','story-nav');nav.setAttribute('aria-label','Main navigation');
    [['Home','../index.html'],['Confessions','../confessions.html'],['Dating Advice','../index.html#featured-stories'],['Hinge Guide','../confessions.html#hinge-guide'],['Submit','../confessions.html#submit-confession']].forEach(([label,href])=>{const a=elem('a','',label);a.href=href;if(label==='Confessions')a.setAttribute('aria-current','page');nav.append(a)});
    const search=elem('form','story-search');search.setAttribute('role','search');
    const input=elem('input');input.type='search';input.placeholder='Search confessions…';input.setAttribute('aria-label','Search confessions');input.autocomplete='off';
    const results=elem('div','story-search-results');results.hidden=true;search.append(input,results);search.addEventListener('submit',e=>{e.preventDefault();const query=input.value.trim();track('search','search',{query_length:query.length,result_count:findStories(query).length});showSearch(query)});
    input.addEventListener('input',()=>showSearch(input.value.trim()));
    bar.append(brand,nav,search);
    const layout=elem('div','story-layout'),left=elem('aside','story-left'),center=elem('div','story-center'),right=elem('aside','story-right');
    left.setAttribute('aria-label','Related stories');right.setAttribute('aria-label','Story interactions');
    main.before(bar,layout);layout.append(left,center,right);center.append(main);
    const oldBrand=main.querySelector('.brand');if(oldBrand)oldBrand.remove();const back=main.querySelector('.back');if(back)back.remove();
    const h1=main.querySelector('h1');h1?.classList.add('story-title');
    const existingImage=main.querySelector('[data-story-hero],.story-hero');
    const hero=elem('figure','story-hero');
    if(existingImage){existingImage.classList.add('story-hero');main.prepend(existingImage)}
    else {const image=main.dataset.imagePath;if(image&&image.startsWith('submissions/')){const img=elem('img');img.src='https://uajkmfiuuljbnuawovma.supabase.co/storage/v1/object/public/confession-images/'+image.split('/').map(encodeURIComponent).join('/');img.alt=main.dataset.imageAlt||'';hero.append(img)}else hero.append(elem('div','story-hero-placeholder',''));main.prepend(hero)}
    const time=Math.max(1,Math.ceil((article.textContent.trim().split(/\s+/).length||1)/220));const readTime=elem('span','story-read-time','◷  '+time+' min read');main.querySelector('.story-hero')?.append(readTime);
    const tag=main.querySelector('.tag');if(tag){tag.classList.add('story-tag');const tags=elem('div','story-tags');tags.append(tag);main.querySelector('h1')?.before(tags)}
    const first=article.querySelector('p');if(first){const summary=elem('p','story-summary',main.dataset.summary||first.textContent.slice(0,190).trim()+(first.textContent.length>190?'…':''));h1?.after(summary)}
    const meta=main.querySelector('.meta');if(meta)meta.classList.add('story-byline');
    const continueLink=elem('a','story-continue','Continue reading ↓');continueLink.href='#story-body';continueLink.addEventListener('click',()=>track('continue_reading','body'));article.id='story-body';article.before(continueLink);
    const moments=elem('section','story-key-moments');moments.append(elem('h2','', 'Key moments'));
    const momentList=elem('div','story-moment-list');const paragraphs=[...article.querySelectorAll('p')];
    const interval=Math.max(1,Math.ceil(paragraphs.length/5));
    for(let i=0;i<paragraphs.length;i+=interval){const p=paragraphs[i],index=i+1,label=p.textContent.trim().slice(0,58)+(p.textContent.trim().length>58?'…':'');const button=elem('button','story-moment',label||('Story part '+(momentList.children.length+1)));button.type='button';button.append(elem('span','',`Part ${momentList.children.length+1} →`));button.addEventListener('click',()=>{track('key_moment',String(index),{paragraph_index:index});p.scrollIntoView({behavior:'smooth',block:'center'})});momentList.append(button)}
    if(momentList.children.length){moments.append(momentList);article.after(moments)}
    const reactionRow=main.querySelector('.reaction-row');const reactionStatus=main.querySelector('#reaction-status,#story-reaction-status');const shareButton=main.querySelector('#share-story');const shareStatus=main.querySelector('#share-status,#story-share-status');
    const reactionCard=card('How did this story make you feel?');
    if(reactionRow){reactionRow.classList.add('story-reaction-options');reactionRow.querySelectorAll('button').forEach(button=>{button.classList.add('story-reaction-choice');const label=button.textContent.replace(/\d+/g,'').trim();const emoji={'Relatable':'❤️','Hot':'🔥','Emotional':'😢','Surprising':'😮','Plot Twist':'😮','Green Flag':'💚','Red Flag':'🚩','Been There':'🫶'}[label]||'♡';button.prepend(elem('span','emoji',emoji));button.setAttribute('aria-label',label);button.setAttribute('aria-pressed',button.disabled?'true':'false');button.addEventListener('click',()=>{track('reaction',label,{reaction:label});button.setAttribute('aria-pressed','true')})});reactionCard.append(reactionRow)}
    if(reactionStatus){reactionStatus.classList.add('story-status');reactionCard.append(reactionStatus)}right.append(reactionCard);shareButton?.addEventListener('click',()=>track('share','share_button',{method:navigator.share?'native':'clipboard'}));
    const pollCard=card(main.dataset.pollQuestion||'What would you have done?');const pollOptions=parseJson(main.dataset.pollOptions,defaultPoll);const pollList=elem('div','story-poll-options');const pollNote=elem('p','story-card-note','Loading votes…');pollCard.append(pollList,pollNote);right.append(pollCard);loadPoll(pollOptions,pollList,pollNote);
    const discussion=card('Discussion');const commentList=elem('div','story-discussion-list');const commentsNote=elem('p','story-card-note','');const allComments=elem('button','','See all comments →');allComments.type='button';allComments.hidden=true;allComments.addEventListener('click',()=>{commentList.dataset.expanded=commentList.dataset.expanded==='true'?'false':'true';allComments.textContent=commentList.dataset.expanded==='true'?'Show fewer comments ↑':'See all comments →';renderComments(commentList.dataset.rows?JSON.parse(commentList.dataset.rows):[],commentList,allComments)});
    const commentForm=elem('form','story-comment-form');const nameInput=elem('input');nameInput.name='author_label';nameInput.maxLength=40;nameInput.placeholder='Name (optional)';nameInput.setAttribute('aria-label','Name (optional)');const commentInput=elem('textarea');commentInput.name='body';commentInput.required=true;commentInput.maxLength=1000;commentInput.minLength=3;commentInput.rows=3;commentInput.placeholder='Add to the discussion';commentInput.setAttribute('aria-label','Add to the discussion');const send=elem('button','','Post comment');send.type='submit';const commentStatus=elem('p','story-status','');commentForm.append(nameInput,commentInput,send);commentForm.addEventListener('submit',async e=>{e.preventDefault();send.disabled=true;commentStatus.textContent='Sending comment for review…';try{await request('story_comments',{method:'POST',body:JSON.stringify({story_slug:slug,story_id:storyId||null,author_label:nameInput.value.trim().slice(0,40)||'Anonymous',body:commentInput.value.trim(),status:'pending'})});track('comment_submit','discussion');commentForm.reset();commentStatus.textContent='Thanks. Your comment will appear after review.'}catch(error){commentStatus.textContent='Could not send the comment. Please try again.'}finally{send.disabled=false}});
    discussion.append(commentList,allComments,commentsNote,commentForm,commentStatus);right.append(discussion);loadComments(commentList,allComments,commentsNote);
    const guide=elem('section','story-card story-guide');guide.append(elem('div','story-guide-icon','✦'));const guideText=elem('div');guideText.append(elem('h3','', 'Hinge Glow-Up Guide'),elem('p','', 'Better prompts. More matches. Real conversations.'));const guideButton=elem('a','story-guide-button','Get the free guide →');guideButton.href='../confessions.html#submit-confession';guideButton.addEventListener('click',()=>track('guide_click','hinge-guide'));guideText.append(guideButton);guide.append(guideText);right.append(guide);
    const topicCard=card('Related topics');const topics=elem('div','story-topics');const topicNames=[category,...parseJson(main.dataset.tags,[])].filter((t,i,a)=>t&&a.indexOf(t)===i).slice(0,8);topicNames.forEach(topic=>{const link=elem('a','story-topic',topic);link.href='../confessions.html?category='+encodeURIComponent(topic);link.addEventListener('click',()=>track('topic_click',topic));topics.append(link)});topicCard.append(topics);right.append(topicCard);
    const backLink=elem('a','','← Back to Confessions');backLink.href='../confessions.html';backLink.addEventListener('click',()=>track('related_story','archive'));left.append(backLink);const relatedCard=card('More stories like this');const relatedList=elem('div','story-related-list');relatedCard.append(relatedList);left.append(relatedCard);loadStories(relatedList,category);
    document.addEventListener('click',e=>{const target=e.target.closest('[data-open-guide]');if(target)track('guide_click',target.getAttribute('aria-label')||'guide')},true);
    document.addEventListener('click',event=>{const target=event.target.closest&&event.target.closest('a,button,[role="button"]');if(!target)return;track('ui_click',target.id||target.getAttribute('aria-label')||target.tagName.toLowerCase(),{element_type:target.tagName.toLowerCase(),page_path:location.pathname})},true);
    let lastDepth=0;window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;if(max<1)return;const depth=Math.min(100,Math.floor(scrollY/max*100));for(const threshold of [25,50,75,100])if(depth>=threshold&&lastDepth<threshold)track('scroll_depth',String(threshold),{percent:threshold});lastDepth=Math.max(lastDepth,depth)},{passive:true});
    track('story_view','page_view',{category});
  }

  function card(heading){const section=elem('section','story-card');section.append(elem('h2','',heading));return section}
  function parseJson(value,fallback){try{return value?JSON.parse(value):fallback}catch{return fallback}}
  function showSearch(query){const form=document.querySelector('.story-search'),box=form?.querySelector('.story-search-results');if(!box)return;box.replaceChildren();if(!query){box.hidden=true;return}findStories(query).slice(0,8).forEach(item=>{const a=elem('a','',item.title);a.href=item.url;a.addEventListener('click',()=>track('search','search_result',{query_length:query.length}));box.append(a)});if(!box.children.length)box.append(elem('a','','No matching stories'));box.hidden=false}
  function findStories(query){const q=query.toLowerCase();return stories.filter(item=>(item.title+' '+item.desc+' '+item.cat).toLowerCase().includes(q))}
  async function loadStories(container,currentCategory){try{const response=await fetch('../confessions.html',{cache:'no-cache'});const html=await response.text();const match=html.match(/const stories=(\[[\s\S]*?\]);\s*const categories=/);if(!match)return;stories=JSON.parse(match[1]);const candidates=stories.filter(item=>item.url&&item.url!==('confessions/'+slug+'.html'));candidates.sort((a,b)=>(a.cat===currentCategory?-1:0)-(b.cat===currentCategory?-1:0));candidates.slice(0,5).forEach(item=>{const a=elem('a','story-related-item');a.href='../'+item.url;a.addEventListener('click',()=>track('related_story',item.url,{category:item.cat}));if(item.image_path){const img=elem('img');img.src='https://uajkmfiuuljbnuawovma.supabase.co/storage/v1/object/public/confession-images/'+item.image_path.split('/').map(encodeURIComponent).join('/');img.alt='';a.append(img)}else a.append(elem('span','story-related-thumb',''));const text=elem('span','',item.title);a.append(text);const save=elem('button','story-related-save','♡');save.type='button';save.setAttribute('aria-label','Save story');save.setAttribute('aria-pressed',localStorage.getItem('almost-favorite-'+item.url)==='1'?'true':'false');save.textContent=save.getAttribute('aria-pressed')==='true'?'♥':'♡';save.addEventListener('click',async e=>{e.preventDefault();e.stopPropagation();if(save.getAttribute('aria-pressed')==='true')return;save.disabled=true;try{await request('story_page_favorites',{method:'POST',body:JSON.stringify({story_slug:item.url.split('/').pop().replace(/\.html$/,''),visitor_id:visitorId})});save.setAttribute('aria-pressed','true');save.textContent='♥';localStorage.setItem('almost-favorite-'+item.url,'1');track('favorite',item.url)}catch(error){save.disabled=false;console.warn(error)}});a.append(save);container.append(a)})}catch(error){console.warn('Related stories unavailable',error)}}
  async function loadPoll(options,list,note){
    if(!Array.isArray(options)||!options.length)options=defaultPoll;
    try{if(!storyId){const config=await request('story_page_polls?select=question,options&story_slug=eq.'+encodeURIComponent(slug));if(config[0]){options=config[0].options;const heading=list.closest('.story-card')?.querySelector('h2');if(heading)heading.textContent=config[0].question}}const votes=await request('story_poll_votes?select=option_key&story_slug=eq.'+encodeURIComponent(slug));const totals={};votes.forEach(v=>totals[v.option_key]=(totals[v.option_key]||0)+1);const total=Object.values(totals).reduce((a,b)=>a+b,0);const already=localStorage.getItem('almost-poll-'+slug);list.replaceChildren();options.forEach(option=>{const b=elem('button','story-poll-option');b.type='button';b.setAttribute('aria-pressed',already===option.key?'true':'false');const label=elem('span','',option.label);const count=elem('span','',total?Math.round((totals[option.key]||0)*100/total)+'%':'0%');b.append(label,count);b.style.setProperty('--vote-share',(total?(totals[option.key]||0)*100/total:0)+'%');b.addEventListener('click',async()=>{if(localStorage.getItem('almost-poll-'+slug))return;try{await request('story_poll_votes',{method:'POST',body:JSON.stringify({story_id:storyId||null,story_slug:slug,option_key:option.key,visitor_id:visitorId})});localStorage.setItem('almost-poll-'+slug,option.key);track('poll_vote',option.key);await loadPoll(options,list,note)}catch(error){note.textContent='Could not save your vote. Please try again.'}});list.append(b)});note.textContent=total?total.toLocaleString()+' people voted':'Be the first to vote'}catch(error){note.textContent='Poll results are unavailable right now.'}
  }
  async function loadComments(list,allButton,note){
    try{const rows=await request('story_comments?select=id,author_label,body,created_at,status&status=eq.approved&story_slug=eq.'+encodeURIComponent(slug)+'&order=created_at.desc&limit=100');list.dataset.rows=JSON.stringify(rows);allButton.hidden=rows.length<=3;renderComments(rows,list,allButton);note.textContent=rows.length?rows.length+' approved comments':'Start the discussion'}catch(error){note.textContent='Discussion is unavailable right now.'}
  }
  async function renderComments(rows,list,allButton){
    const expanded=list.dataset.expanded==='true',shown=expanded?rows:rows.slice(0,3);list.replaceChildren();if(!rows.length){list.append(elem('p','story-card-note','No approved comments yet.'));return}
    let likes=[];try{likes=await request('story_comment_likes?select=comment_id&comment_id=in.('+shown.map(r=>r.id).join(',')+')')}catch{}
    const totals={};likes.forEach(row=>totals[row.comment_id]=(totals[row.comment_id]||0)+1);
    shown.forEach(row=>{const item=elem('article','story-comment');item.append(elem('strong','',row.author_label||'Anonymous'),elem('p','',row.body));const like=elem('button','',`♡ ${totals[row.id]||0}`);like.type='button';like.setAttribute('aria-label','Like comment');like.addEventListener('click',async()=>{like.disabled=true;try{await request('story_comment_likes',{method:'POST',body:JSON.stringify({comment_id:row.id,visitor_id:visitorId})});like.textContent='♥ '+((totals[row.id]||0)+1);track('comment_like',row.id)}catch{like.disabled=false}});item.append(like);list.append(item)});
    allButton.hidden=rows.length<=3;
  }
  installLayout();
})();
