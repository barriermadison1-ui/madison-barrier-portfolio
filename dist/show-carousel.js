// Manual galleries keep the visitor in control and avoid distracting motion.
document.querySelectorAll('.show-carousel').forEach(carousel=>{
 const slides=[...carousel.querySelectorAll('.show-slide')];
 const count=carousel.querySelector('.slide-count');let index=0;
 const render=()=>{slides.forEach((slide,i)=>{slide.hidden=i!==index});count.textContent=`${index+1} / ${slides.length}`};
 const move=delta=>{index=(index+delta+slides.length)%slides.length;render()};
 carousel.querySelector('[data-slide-prev]').addEventListener('click',()=>move(-1));
 carousel.querySelector('[data-slide-next]').addEventListener('click',()=>move(1));
 carousel.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();move(event.key==='ArrowRight'?1:-1)}});
 render();
});
