document.querySelectorAll('[data-scroll-video]').forEach(video=>{
  const button=video.parentElement.querySelector('.video-toggle');
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  let manuallyPaused=false;
  const update=()=>{if(button){button.textContent=video.paused?'Play demo':'Pause demo';button.setAttribute('aria-label',video.paused?'Play Weekly Schedule Maker demo':'Pause Weekly Schedule Maker demo');button.setAttribute('aria-pressed',String(!video.paused));}};
  video.muted=true;
  button?.addEventListener('click',()=>{if(video.paused){manuallyPaused=false;video.play().catch(update);}else{manuallyPaused=true;video.pause();}});
  video.addEventListener('play',update);video.addEventListener('pause',update);video.addEventListener('ended',update);
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting&&entry.intersectionRatio>=.45&&!manuallyPaused&&!reduceMotion.matches){video.play().catch(update);}else if(!entry.isIntersecting||entry.intersectionRatio<.15){video.pause();}}},{threshold:[0,.15,.45,.7]});observer.observe(video);}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});update();
});
document.querySelectorAll('[data-copy-email]').forEach(button=>{
  button.addEventListener('click',async()=>{
    const panel=button.closest('.contact-panel');
    const status=panel.querySelector('.copy-status');
    const email=panel.querySelector('.contact-email').textContent.trim();
    const field=document.createElement('textarea');
    field.value=email;field.readOnly=true;
    field.style.cssText='position:fixed;opacity:0;pointer-events:none';
    document.body.append(field);field.select();
    let copied=false;
    try{copied=document.execCommand('copy');}catch{}
    field.remove();button.focus();
    if(!copied){
      try{await Promise.race([navigator.clipboard.writeText(email),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Copy unavailable')),1500))]);copied=true;}catch{}
    }
    status.textContent=copied?'Email address copied.':'Select the email address above to copy it.';
    if(copied)button.textContent='Copied';
  });
});

// Reveal content once as it enters view; keep it visible without JavaScript.
(()=>{
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(preference.matches||!('IntersectionObserver' in window)||!Element.prototype.animate)return;
  const running=new Map();
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(!entry.isIntersecting)continue;
      const element=entry.target;
      observer.unobserve(element);
      if(preference.matches||element.contains(document.activeElement))continue;
      const animation=element.animate([
        {opacity:.55,translate:'0 12px'},
        {opacity:1,translate:'0 0'}
      ],{duration:420,easing:'cubic-bezier(.22,1,.36,1)'});
      running.set(element,animation);
      animation.onfinish=()=>running.delete(element);
      animation.oncancel=()=>running.delete(element);
    }
  },{threshold:.08,rootMargin:'0px 0px -24px 0px'});
  document.querySelectorAll('.hero-heading,.wide-portrait,.home-education,.section-head,.project-card,.page-intro,.case>aside,.current-work,.media-figure,.slide-preview,.work-gallery>figure,.photo-grid>figure,.home-theatre>div,.home-theatre>figure').forEach(element=>observer.observe(element));
  document.addEventListener('focusin',event=>{
    for(const [element,animation] of running){if(element.contains(event.target))animation.finish();}
  });
  preference.addEventListener('change',event=>{
    if(event.matches){observer.disconnect();for(const animation of running.values())animation.finish();}
  });
})();

// Small, smoothed photo drift on desktop; no motion on touch or reduced-motion devices.
(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const desktop=matchMedia('(min-width: 900px) and (pointer: fine)');
  const photos=[...document.querySelectorAll('.wide-portrait img,.work-gallery img,.photo-grid img')].map(image=>({image,value:0}));
  let frame=0;
  const reset=()=>{cancelAnimationFrame(frame);frame=0;photos.forEach(photo=>{photo.value=0;photo.image.style.removeProperty('--photo-drift');});};
  const move=()=>{
    frame=0;
    if(reduced.matches||!desktop.matches){reset();return;}
    let settling=false;
    const updates=photos.map(photo=>{
      const bounds=photo.image.parentElement.getBoundingClientRect();
      if(bounds.bottom<0||bounds.top>innerHeight)return null;
      const target=Math.max(-7,Math.min(7,(innerHeight/2-bounds.top-bounds.height/2)/innerHeight*14));
      photo.value+=(target-photo.value)*.12;
      if(Math.abs(target-photo.value)>.03)settling=true;
      return photo;
    });
    updates.forEach(photo=>{if(photo)photo.image.style.setProperty('--photo-drift',`${photo.value.toFixed(2)}px`);});
    if(settling)frame=requestAnimationFrame(move);
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(move);};
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  reduced.addEventListener('change',schedule);desktop.addEventListener('change',schedule);
  schedule();
})();
