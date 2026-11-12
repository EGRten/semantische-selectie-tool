// Vergelijk iedere primaire Excel-cel met de publicatie die ook de viewer gebruikt.
import {publicatieCel} from '../dist/publicatie/index.js';
export const NASLAGWERKEN = [
  {id:'concordans',aantal:716,naam:'Concordans 1996-2020.xlsx',bladen:['Concordans 1996-2020','Bronvermelding']},
  ...[['1996-2012',494],['2017',305],['2020',346]].map(([id,aantal])=>({id,aantal,naam:`Selectielijst ${id}.xlsx`,bladen:['Selectiegegevens','Toelichtingen','Bronvermelding']})),
];
export function controleerDownload(werk,publicatie,bestandsnaam,excel){
  const concordans=werk.id==='concordans';
  const verwacht=[...(concordans?['Bronrij']:[]),...publicatie.kolommen];
  const waarden=[verwacht,...publicatie.rijen.map(r=>[...(concordans?[String(r.bronrij)]:[]),...publicatie.kolommen.map((_,i)=>publicatieCel(publicatie,r,i))])];
  const controles={
    bestandsnaam:bestandsnaam===werk.naam,
    werkbladen:JSON.stringify(excel.werkbladen.map(s=>s.naam))===JSON.stringify(werk.bladen),
    aantal:publicatie.id===werk.id&&publicatie.rijen.length===werk.aantal&&excel.werkbladen[0]?.rijen.length===werk.aantal+1,
    primaire_bronwaarden:JSON.stringify(excel.werkbladen[0]?.rijen)===JSON.stringify(waarden),
    aanvullende_informatie:excel.werkbladen.slice(1).every(s=>s.rijen.length>1),
    geen_macros_of_externe_links:excel.macros===false&&excel.externe_links===false,
  };
  return {geslaagd:Object.values(controles).every(Boolean),controles};
}
export function hardeAcceptatie(resultaten){return NASLAGWERKEN.every(w=>resultaten.filter(r=>r.id===w.id).length===1&&resultaten.find(r=>r.id===w.id)?.geslaagd===true);}
