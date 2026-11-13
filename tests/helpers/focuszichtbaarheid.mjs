// AA-controle: herkenbare focus en een werkelijk onbedekt deel binnen viewport/scrollgebied.
// Geen eis dat de volledige controlerechthoek zichtbaar is (2.4.12 is AAA).
export function meetFocuszichtbaarheid(){
 const e=document.activeElement,g=e?.closest('.viewer-tabelgebied');
 if(!e||!g)return {bruikbaar:false};
 const r=e.getBoundingClientRect(),b=g.getBoundingClientRect(),s=getComputedStyle(e);
 const links=Math.max(0,b.left+g.clientLeft,r.left),rechts=Math.min(innerWidth,b.left+g.clientLeft+g.clientWidth,r.right);
 const boven=Math.max(0,b.top+g.clientTop,r.top),onder=Math.min(innerHeight,b.top+g.clientTop+g.clientHeight,r.bottom);
 let onbedekt=false;
 if(rechts>links&&onder>boven)for(const x of [.1,.5,.9])for(const y of [.1,.5,.9]){
  const hit=document.elementFromPoint(links+(rechts-links)*x,boven+(onder-boven)*y);
  if(hit===e||e.contains(hit))onbedekt=true;
 }
 const indicator=s.outlineStyle!=='none'&&parseFloat(s.outlineWidth)>0&&s.outlineColor!=='transparent'&&s.outlineColor!=='rgba(0, 0, 0, 0)';
 return {bruikbaar:onbedekt&&indicator,onbedekt,indicator,zichtbareBreedte:Math.max(0,rechts-links),zichtbareHoogte:Math.max(0,onder-boven)};
}
