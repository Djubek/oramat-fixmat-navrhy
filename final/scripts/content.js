/* Atlas3.2: native switches, same-origin preference and compact sticky navigation. */
(()=>{
 const key='of-atlas-dimension-display-v1';let preference=false;
 try{preference=localStorage.getItem(key)==='values';}catch{}
 const roots=[...document.querySelectorAll('.of-atlas[data-of-template="technical@3.4.0"]')];
 const setMode=(root,value)=>root.querySelectorAll('.o44').forEach(input=>{input.checked=value;});
 roots.forEach(root=>{
  setMode(root,preference);
  root.addEventListener('change',event=>{if(event.target.matches('.o44')){preference=event.target.checked;try{localStorage.setItem(key,preference?'values':'symbols');}catch{}roots.forEach(r=>setMode(r,preference));}});
  root.querySelectorAll('[data-parameter-control]').forEach(cell=>{const button=document.createElement('button');button.type='button';button.className='o47';button.dataset.parameterLink=cell.dataset.parameterControl;button.setAttribute('aria-pressed','false');button.setAttribute('aria-label',cell.closest('tr').querySelector('th').textContent.trim()+': '+cell.textContent.trim());button.textContent=cell.textContent;cell.replaceChildren(button);cell.classList.add('has-control');});
  root.classList.add('has-atlas-interactivity');
  const marks=[...root.querySelectorAll('.o10 a[data-parameter-link]')],controls=[...root.querySelectorAll('[data-parameter-link]')],rows=[...root.querySelectorAll('[data-parameter-row]')];let pinned=null,hover=null,focused=null;
  const paint=()=>{const preview=hover||focused;rows.forEach(row=>{row.classList.toggle('is-preview',row.dataset.parameterRow===preview);row.classList.toggle('is-pinned',row.dataset.parameterRow===pinned);});controls.forEach(a=>{a.setAttribute('aria-pressed',String(a.dataset.parameterLink===pinned));a.classList.toggle('is-preview',a.dataset.parameterLink===preview);});root.querySelectorAll('.o52').forEach(status=>{const id=preview||pinned,row=rows.find(r=>r.dataset.parameterRow===id);status.hidden=!row;status.textContent=row?row.querySelector('td').textContent+' · '+row.querySelector('th').textContent:'';});};
  const choose=a=>{pinned=a.dataset.parameterLink;paint();};
  controls.forEach(a=>{a.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'){hover=a.dataset.parameterLink;paint();}});a.addEventListener('pointerleave',()=>{hover=null;paint();});a.addEventListener('pointercancel',()=>{hover=null;paint();});a.addEventListener('focus',()=>{focused=a.dataset.parameterLink;paint();});a.addEventListener('blur',()=>{focused=null;paint();});a.addEventListener('click',event=>{if(event.metaKey||event.ctrlKey||event.altKey||event.shiftKey)return;event.preventDefault();event.stopPropagation();choose(a);});a.addEventListener('keydown',event=>{if(event.key===' '||event.key==='Enter'){event.preventDefault();choose(a);}else if(event.key==='Escape'){pinned=null;hover=null;focused=null;paint();}});});
  const fitLabels=()=>marks.forEach(a=>{const box=a.querySelector('rect'),width=Number(box.getAttribute('width'))-8,height=Number(box.getAttribute('height'))-6;a.querySelectorAll('text').forEach(label=>{if(getComputedStyle(label).display==='none')return;label.setAttribute('x','0');label.setAttribute('y','0');let bounds=label.getBBox();const factor=Math.min(1,width/Math.max(bounds.width,1),height/Math.max(bounds.height,1));if(factor<1){a.setAttribute('font-size',String(Number(a.getAttribute('font-size'))*factor));bounds=label.getBBox();}label.setAttribute('x',String(-(bounds.x+bounds.width/2)));label.setAttribute('y',String(-(bounds.y+bounds.height/2)));});});
  root.addEventListener('change',event=>{if(event.target.matches('.o44'))requestAnimationFrame(fitLabels);});
  document.fonts.ready.then(fitLabels);paint();
  const nav=root.querySelector('.o45');if(!nav)return;
  const links=[...nav.querySelectorAll('a')],sections=links.map(a=>document.getElementById(a.hash.slice(1)));let pending=false,transitionUntil=0,anchorTarget=null,anchorUntil=0;
  const css=(name,value)=>{const next=Math.ceil(value)+'px';if(root.style.getPropertyValue(name)!==next)root.style.setProperty(name,next);};
  const update=()=>{
   const candidates=new Set(document.querySelectorAll('header,nav,.top-navigation-bar,#header,.navigation-wrapper,.navigation-in'));
   [...candidates].forEach(e=>{for(let i=0,p=e.parentElement;p&&i<3;i++,p=p.parentElement)candidates.add(p);});
   let top=0;candidates.forEach(e=>{if(root.contains(e))return;const style=getComputedStyle(e),r=e.getBoundingClientRect(),cssTop=parseFloat(style.top)||0;if(r.width<=innerWidth/2||r.height<=0||r.height>=innerHeight/2||r.bottom<=0)return;if(style.position==='fixed'&&r.top<innerHeight/2)top=Math.max(top,r.bottom);else if(style.position==='sticky'&&r.top<=Math.max(0,cssTop)+1)top=Math.max(top,r.bottom);});
   css('--atlas-sticky-top',top);css('--atlas-nav-height',nav.getBoundingClientRect().height);
   const photo=root.querySelector('.o34');if(photo)css('--atlas-installation-height',photo.getBoundingClientRect().height);
   const limit=top+nav.getBoundingClientRect().height+24;let current=-1;sections.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<=limit)current=i;});links.forEach((a,i)=>{if(i===current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
   if(anchorTarget&&performance.now()<anchorUntil){const rect=anchorTarget.getBoundingClientRect(),delta=rect.top-limit;if(delta< -1&&rect.bottom>limit)scrollBy({top:delta,behavior:'instant'});}
   pending=false;if(performance.now()<Math.max(transitionUntil,anchorUntil))schedule();
  };
  const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(update);}};
  nav.addEventListener('click',event=>{const a=event.target.closest('a');if(!a||!nav.contains(a)||event.defaultPrevented||event.button||event.metaKey||event.ctrlKey||event.altKey||event.shiftKey)return;const section=document.getElementById(a.hash.slice(1));if(!section)return;event.preventDefault();event.stopPropagation();if(location.hash!==a.hash)history.pushState(null,'',a.hash);anchorTarget=section;anchorUntil=performance.now()+1500;section.scrollIntoView({block:'start',behavior:'instant'});schedule();});
  addEventListener('wheel',()=>{anchorTarget=null;},{passive:true});root.addEventListener('touchstart',event=>{if(!nav.contains(event.target))anchorTarget=null;},{passive:true});
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);root.addEventListener('load',schedule,true);document.addEventListener('transitionend',schedule,true);document.addEventListener('animationend',schedule,true);
  document.addEventListener('transitionrun',event=>{if(!root.contains(event.target)){transitionUntil=performance.now()+1200;schedule();}},true);
  new MutationObserver(schedule).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});new ResizeObserver(schedule).observe(root);update();
 });
 addEventListener('storage',event=>{if(event.key===key){preference=event.newValue==='values';roots.forEach(r=>setMode(r,preference));}});
})();
