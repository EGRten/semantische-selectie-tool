import valideer from '#publicatie-validatie';
import type { Publicatie,Publicatierij } from './projectie.js';
export type {Publicatie,Publicatierij,Bron,Notitie} from './projectie.js';
export { publicatieCel,filterPublicatie,publicatieBron } from './weergave.js';
/** Gesloten publicatiecontract, bovenop de build-time JSON-schemavalidatie. */
export function controleerPublicatie(x:unknown,id:string):asserts x is Publicatie{
 if(!valideer(x))throw Error('Publicatie voldoet niet aan het schema');const p=x as Publicatie;const n:Record<string,number>={'1996-2012':494,'2017':305,'2020':346,concordans:716};
 if(!p||p.versie!==1||p.id!==id||!n[id]||Object.keys(p).some(k=>!['versie','id','titel','kolommen','rijen','achtergrond','bronnen','hergebruik'].includes(k))||typeof p.titel!=='string'||typeof p.hergebruik!=='string'||!Array.isArray(p.kolommen)||p.kolommen.length!==(id==='1996-2012'?9:11)||p.kolommen.some(k=>typeof k!=='string')||!Array.isArray(p.rijen)||p.rijen.length!==n[id]||!Array.isArray(p.bronnen)||!Array.isArray(p.achtergrond))throw Error('Ongeldige publicatie');
 const bronIds=new Set(p.bronnen.map(b=>b.id));if(bronIds.size!==p.bronnen.length)throw Error('Dubbele bronregistratie');for(const n of [...p.achtergrond,...p.rijen.flatMap(r=>r.notities)])if(n.bron&&typeof n.bron==='string'&&!bronIds.has(n.bron))throw Error('Ontbrekende bronregistratie');
 if(id==='concordans'&&p.rijen.some((r,i)=>r.bronrij!==i+3||r.id!==`concordans:rij:${r.bronrij}`))throw Error('Concordansbronvolgorde onjuist');
 const ids=new Set();for(const r of p.rijen){if(typeof r.id!=='string'||!r.id.startsWith(id==='concordans'?'concordans:rij:':id+':')||ids.has(r.id)||!Array.isArray(r.waarden)||r.waarden.length!==p.kolommen.length||r.waarden.some(v=>v!==null&&typeof v!=='string')||!Array.isArray(r.notities)||!Array.isArray(r.bronnen))throw Error('Ongeldige publicatierij');ids.add(r.id);if(r.bronnen.some(b=>typeof b!=='string'||!bronIds.has(b)))throw Error('Ontbrekende bronregistratie');for(const id of r.verwijzingen??[])if(!p.achtergrond.some(n=>n.id===id))throw Error('Ontbrekende toelichtingsverwijzing');}
}
export function maakPublicatielaag(base=new URL('./publicatie/',document.baseURI)){
 const cache=new Map<string,Promise<Publicatie>>();return {laad(id:string){if(!['1996-2012','2017','2020','concordans'].includes(id))return Promise.reject(Error('Onbekend naslagwerk'));if(!cache.has(id)){const taak=(async()=>{const r=await fetch(new URL(`${id}.json`,base));if(!r.ok)throw Error('Publicatie niet beschikbaar');const p:unknown=await r.json();controleerPublicatie(p,id);return p;})();cache.set(id,taak);void taak.catch(()=>cache.delete(id));}return cache.get(id)!;}};
}
