(()=>{
 const directions=window.DESIGN_DIRECTIONS;
 const frame=document.querySelector('.preview-frame'),stage=document.querySelector('.frame-stage');
 const params=new URLSearchParams(location.search);const narrow=matchMedia('(max-width:740px)').matches;
 let state={direction:Math.max(1,Math.min(10,Math.trunc(Number(params.get('direction'))||10))),family:params.get('family')==='hox'?'hox':'wkcp',shop:params.get('shop')==='fixmat_cz'?'fixmat_cz':'oramat_sk',view:params.get('view')==='mobile'||(!params.has('view')&&narrow)?'mobile':'desktop'};
 let chosen=null;try{chosen=Number(localStorage.getItem('of-design-choice-20261030'))||null;}catch{}
 const file=()=>`previews/${String(state.direction).padStart(2,'0')}-${state.family}-${state.shop==='fixmat_cz'?'cs':'sk'}.html`;
 const scaleFrame=()=>{const width=state.view==='mobile'?390:1200;const scale=Math.min(1,stage.clientWidth/width);frame.style.width=width+'px';frame.style.height=Math.max(700,stage.clientHeight/scale)+'px';frame.style.transform=`scale(${scale})`;};
 const update=()=>{
  const d=directions[state.direction-1];document.querySelector('#current-title').textContent=d.name;document.querySelector('#current-description').textContent=d.description+' '+d.signature;
  document.querySelectorAll('[data-direction]').forEach(b=>{b.setAttribute('aria-pressed',String(Number(b.dataset.direction)===state.direction));b.dataset.chosen=String(Number(b.dataset.direction)===chosen);});
  document.querySelector('#family').value=state.family;document.querySelector('#shop').value=state.shop;
  document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===state.view)));
  const choice=document.querySelector('.choose-button');choice.setAttribute('aria-pressed',String(chosen===state.direction));choice.textContent=chosen===state.direction?'Vybraté na doladenie':'Vybrať na doladenie';
  const src=file();if(frame.getAttribute('src')!==src)frame.setAttribute('src',src);
  frame.title=`Návrh ${state.direction}: ${d.name}; ${state.family.toUpperCase()}; ${state.shop==='fixmat_cz'?'Fixmat, čeština':'Oramat, slovenčina'}`;
  document.querySelector('.open-preview').href=src;
  document.querySelector('#preview-caption').textContent=`${state.direction} / 10 · ${state.family.toUpperCase()} · ${state.shop==='fixmat_cz'?'Fixmat CZ':'Oramat SK'} · ${state.view==='mobile'?'390 px':'1200 px'}`;
  const url=new URL(location.href);Object.entries(state).forEach(([k,v])=>url.searchParams.set(k,String(v)));try{history.replaceState(null,'',url);}catch{}
  scaleFrame();
 };
 document.querySelectorAll('[data-direction]').forEach(b=>b.addEventListener('click',()=>{state.direction=Number(b.dataset.direction);update();}));
 document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{state.view=b.dataset.view;update();}));
 document.querySelector('#family').addEventListener('change',e=>{state.family=e.target.value;update();});
 document.querySelector('#shop').addEventListener('change',e=>{state.shop=e.target.value;update();});
 document.querySelector('.choose-button').addEventListener('click',()=>{chosen=chosen===state.direction?null:state.direction;try{if(chosen)localStorage.setItem('of-design-choice-20261030',String(chosen));else localStorage.removeItem('of-design-choice-20261030');}catch{}update();document.querySelector('.gallery-status').textContent=chosen?`Označený smer ${chosen}: ${directions[chosen-1].name}. Výber je uložený v tomto prehliadači.`:'Označenie výberu je zrušené.';});
 document.querySelector('.copy-choice').addEventListener('click',async()=>{const d=chosen??state.direction,text=`Vyberám smer ${d}: ${directions[d-1].name}.`;try{await navigator.clipboard.writeText(text);document.querySelector('.gallery-status').textContent='Výber je skopírovaný. Môžeš ho vložiť do chatu.';}catch{document.querySelector('.gallery-status').textContent=text;}});
 frame.addEventListener('load',()=>{document.querySelector('.gallery-frame-error').classList.remove('is-visible');scaleFrame();});
 frame.addEventListener('error',()=>document.querySelector('.gallery-frame-error').classList.add('is-visible'));
 new ResizeObserver(scaleFrame).observe(stage);update();
})();
