/* Native anchors and details work without this optional enhancement. */
(()=>{document.querySelectorAll('[data-parameter-link]').forEach(link=>link.addEventListener('click',()=>{const row=document.getElementById('parameter-'+link.dataset.parameterLink);if(row){row.tabIndex=-1;requestAnimationFrame(()=>row.focus({preventScroll:true}));}}));})();
