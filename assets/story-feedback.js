(()=>{
  const main=document.querySelector('main.wrap');
  const actions=main?.querySelector('.story-actions');
  if(!main||!actions)return;
  const api='https://uajkmfiuuljbnuawovma.supabase.co/rest/v1';
  const key='sb_publishable_gVCj4Z6JlPjWNwc7buKKmg_zaZTLU7r';
  const slug=main.dataset.storySlug||location.pathname.split('/').pop().replace(/\.html$/,'');
  const storyId=main.dataset.storyId||'';
  const headers={apikey:key,'Content-Type':'application/json'};
  const make=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node};
  const reactionRow=actions.querySelector('.reaction-row');
  if(reactionRow){
    reactionRow.classList.add('story-feedback');
    const heading=make('h2','story-feedback-title','How did this story make you feel?');
    reactionRow.before(heading);
    reactionRow.querySelectorAll('[data-story-reaction],[data-reaction]').forEach(button=>{
      const label=button.dataset.storyReaction||button.dataset.reaction;
      const emoji={Relatable:'❤️',Hot:'🔥',Emotional:'😢',Surprising:'😮'}[label];
      if(emoji&&!button.dataset.emojiAdded){button.prepend(document.createTextNode(emoji+' '));button.dataset.emojiAdded='true';button.setAttribute('aria-label',label)}
      button.addEventListener('click',()=>record('reaction',label,{reaction:label}));
    });
  }
  const panel=make('section','story-comments');panel.setAttribute('aria-labelledby','story-comments-title');
  panel.append(make('h2','','Discussion'));
  panel.querySelector('h2').id='story-comments-title';
  const list=make('div','story-comments-list');const note=make('p','story-comment-note','Loading comments…');
  const form=make('form','story-comment-form');
  const name=make('input');name.name='author_label';name.maxLength=40;name.placeholder='Name (optional)';name.setAttribute('aria-label','Name (optional)');
  const body=make('textarea');body.name='body';body.required=true;body.minLength=3;body.maxLength=1000;body.rows=3;body.placeholder='Add to the discussion';body.setAttribute('aria-label','Add to the discussion');
  const submit=make('button','','Post comment');submit.type='submit';
  const status=make('p','story-comment-status','');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  form.append(name,body,submit);panel.append(list,note,form,status);actions.after(panel);
  async function request(path,options={}){const response=await fetch(api+'/'+path,{...options,headers:{...headers,...(options.headers||{})}});if(!response.ok)throw new Error('Request failed ('+response.status+')');return options.method==='POST'||response.status===204?[]:response.json()}
  function record(type,target,metadata={}){try{const session=localStorage.getItem('almost-session-id')||crypto.randomUUID();localStorage.setItem('almost-session-id',session);fetch(api+'/story_interactions',{method:'POST',keepalive:true,headers:{...headers,Prefer:'return=minimal'},body:JSON.stringify({story_slug:slug,story_id:storyId||null,session_id:session,event_type:type,target_id:String(target||'').slice(0,80)||null,metadata})}).catch(()=>{})}catch{}}
  async function loadComments(){try{const query='story_comments?select=id,author_label,body,created_at&status=eq.approved&story_slug=eq.'+encodeURIComponent(slug)+'&order=created_at.desc&limit=50';const rows=await request(query);list.replaceChildren();if(!rows.length){note.textContent='No comments yet. Start the discussion.';return}note.textContent=rows.length+' '+(rows.length===1?'comment':'comments');rows.forEach(row=>{const item=make('article','story-comment');item.append(make('strong','',row.author_label||'Anonymous'),make('p','',row.body));list.append(item)})}catch{note.textContent='Comments are unavailable right now.'}}
  form.addEventListener('submit',async event=>{event.preventDefault();const comment=body.value.trim();if(comment.length<3)return;submit.disabled=true;status.textContent='Sending comment for review…';try{await request('story_comments',{method:'POST',body:JSON.stringify({story_id:storyId||null,story_slug:slug,author_label:name.value.trim().slice(0,40)||'Anonymous',body:comment,status:'pending'})});record('comment_submit','discussion');if(typeof gtag==='function')gtag('event','comment_submit',{story_slug:slug});form.reset();status.textContent='Thanks. Your comment will appear after review.'}catch(error){status.textContent='Could not send the comment. Please try again.'}finally{submit.disabled=false}});
  record('story_view','page_view');
  loadComments();
})();
