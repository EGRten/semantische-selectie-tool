export async function metGeometrie(page,controle){try{await controle();}catch(fout){
 try{console.log('Browsergeometrie '+JSON.stringify(await page.evaluate(()=>{
  const rechthoek=e=>{if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,breedte:r.width,hoogte:r.height};};const e=document.activeElement,r=e.getBoundingClientRect();
  return {viewport:{breedte:innerWidth,hoogte:innerHeight,dpr:devicePixelRatio},focus:{tag:e.tagName,id:e.id,rect:rechthoek(e),zichtbaarOpMiddelpunt:(()=>{const h=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return h===e||e.contains(h);})()},gebieden:[...document.querySelectorAll('.viewer-tabelgebied')].filter(g=>g.getBoundingClientRect().height).map(g=>({rect:rechthoek(g),scrollLeft:g.scrollLeft,scrollTop:g.scrollTop,scrollWidth:g.scrollWidth,clientWidth:g.clientWidth,clientHeight:g.clientHeight,kophoogte:Math.max(...[...g.querySelectorAll('thead th')].map(h=>h.getBoundingClientRect().height)),laatsteKolom:rechthoek(g.querySelector('thead th:last-child'))}))};
 })));}catch{console.log('Browsergeometrie niet beschikbaar na browserfout');}
 throw fout;
}}
