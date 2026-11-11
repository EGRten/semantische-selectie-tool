import type { Bronrij } from './bronbestand.js';
export const CONCORDANS_KOLOMMEN = [
 'A — Historisch onderdeel', 'B — Historische subletter (geen officiële code)',
 'C — Historische omschrijving', 'D — Historische termijn', 'E — Proces 2020',
 'F — Doelverwijzing 2020', 'G — Resultaat 2020', 'H — Omschrijving 2020',
 'I — Waardering / termijn 2020', 'J — Opmerking 2017', 'K — Waardering 2017',
] as const;
export const CONCORDANS_IDENTITEIT = {
 titel:'Concordans Selectielijst 1996-2020(1).xlsx',
 excelSha256:'7dfda792ce61c1a6fa28c5c116155a429560153178c6c58987eabbbe6cdf708c',
 jsonSha256:'b01cff07c7bfeeb6f562d467373615f5a18cfc7ab9777f11fcd5cb1ed7de73dd',
 contextUrl:'https://www.vhic.nl/faq/selectielijsten-2017-en-2020/',
} as const;
const normaal=(s:string)=>s.normalize('NFD').replace(/\p{M}/gu,'').toLocaleLowerCase('nl').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
/** Alle woorden moeten voorkomen in originele cellen of expliciet onderscheiden mergecontext. Geen semantische uitbreiding. */
export function zoekConcordansrijen(rijen:readonly Bronrij[],vraag:string):readonly Bronrij[]{
 const woorden=normaal(vraag).split(/\s+/).filter(Boolean);
 return woorden.length?rijen.filter(r=>{const tekst=normaal([...r.originele_cellen,...r.samengevoegde_cellen_uitgevouwen].map(v=>v??'').join(' '));return woorden.every(w=>tekst.includes(w));}):rijen;
}
/** Een lege broncel wordt nooit vervangen door de waarde van het samengevoegde bereik. */
export function concordanscel(r:Bronrij,i:number){
 if(!Number.isInteger(i)||i<0||i>10)throw new RangeError('Kolom A–K verwacht');
 const origineel=r.originele_cellen[i]??null,uitgevouwen=r.samengevoegde_cellen_uitgevouwen[i]??null;
 return {origineel,context:origineel!==uitgevouwen?uitgevouwen:null,leeg:origineel===null?'Leeg in de bron':origineel===''?'Lege tekst in de bron':null};
}
export const concordansRijHash=(rij:number)=>`#concordans=${rij}`;
export const selectieHash=(id:string)=>`#selectie=${encodeURIComponent(id)}`;
