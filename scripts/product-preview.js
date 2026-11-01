/* Native anchors and details work without this optional enhancement. */
(()=>{
 document.querySelectorAll('[data-parameter-link]').forEach(link=>link.addEventListener('click',()=>{
  const row=document.getElementById('parameter-'+link.dataset.parameterLink);
  if(row){row.tabIndex=-1;requestAnimationFrame(()=>row.focus({preventScroll:true}));}
 }));
 document.querySelectorAll('.of-demo--10 .of-demo__nav').forEach(nav=>{
  const links=[...nav.querySelectorAll('a')],sections=links.map(a=>document.querySelector(a.getAttribute('href')));
  let pending=false;
  const update=()=>{
   const limit=nav.getBoundingClientRect().height+40;let current=-1;
   sections.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<=limit)current=i;});
   links.forEach((a,i)=>{if(i===current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
   pending=false;
  };
  addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update);}},{passive:true});
  addEventListener('resize',update);update();
 });
})();
