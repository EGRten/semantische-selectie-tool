import type {Publicatie,Publicatierij,Bron} from './projectie.js';
import {filterTabel} from '../gedeeld/tekstfilter.js';
export function publicatieCel(p:Publicatie,r:Publicatierij,i:number):string{const v=r.waarden[i],c=r.context?.find(c=>c.kolom===i);const origineel=v===null?(p.id==='concordans'?'Leeg in de bron':r.ontbrekend?.find(c=>c.kolom===i)?.tekst??'Niet afzonderlijk ingevuld in de bron.'):v===''?'Lege tekst in de bron':v!;return c?`Oorspronkelijke cel: ${origineel}\nSamengevoegde context (niet de oorspronkelijke celwaarde): ${c.tekst}`:origineel;}
export const filterPublicatie=(p:Publicatie,vraag:string)=>{const exact=p.id==='concordans'?[]:p.rijen.filter(r=>r.waarden[0]===vraag.trim());return exact.length?exact:filterTabel(p.rijen,vraag,r=>[...r.waarden,...r.context?.map(c=>c.tekst)??[]].map(v=>v??'').join(' '));};

export function publicatieBron(p:Publicatie,b:Bron|string):Bron{if(typeof b!=='string')return b;const bron=p.bronnen.find(v=>v.id===b);if(!bron)throw Error('Ontbrekende bronverwijzing');return bron;}

export const bronTekst=(b:Bron)=>`${b.titel}${b.pagina===undefined?'':` · pagina ${b.pagina}`}${b.werkblad?` · ${b.werkblad}`:''}${b.rij===undefined?'':` · rij ${b.rij}`}${b.kolom?' · kolom '+b.kolom:''}${b.url?' · '+b.url:''}`;
