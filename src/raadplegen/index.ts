import type { Dataset, Selectiegegeven, SelectielijstId, Structuuronderdeel } from '../gegevenslaag/index.js';
import { filterTabel } from '../gedeeld/tekstfilter.js';
export type Tabelrij={readonly id:string;readonly record:Selectiegegeven;readonly context:readonly Structuuronderdeel[];readonly waarden:readonly (string|null)[]};
export function tabelKolommen(lijst:SelectielijstId):readonly string[]{return lijst==='1996-2012'?['Officiële code','Hoofdstuk','Taakveld','Rubriek','Omschrijving selectievoorschrift','Waardering','Bewaartermijn','Toelichting','Status']:['Resultaatcode','Procestype','Procesomschrijving','Resultaattype','Resultaatomschrijving','Generiek / specifiek','Waardering','Bewaartermijn','Procestermijn','Aanvangsmoment','Toelichting','Status'];}
export function tabelRijen(ds:Dataset):readonly Tabelrij[]{return ds.selectiegegevens.map(r=>{
 const context=ds.padNaar(r.id)!.filter(p=>p.soort==='structuur').map(p=>p.gegevens as Structuuronderdeel);
 const naam=(type:string)=>{const n=context.find(n=>n.type===type);return n?`${n.code} ${n.benaming}`:null;};
 const waarden=ds.id==='1996-2012'?[r.code,naam('hoofdstuk'),naam('taakveld'),naam('rubriek'),r.officiele_omschrijving,r.waardering.officiele_tekst,r.bewaartermijn.officiele_tekst,r.toelichting,r.status]:[r.code,naam('procestype'),r.procesomschrijving,r.resultaattype,r.officiele_omschrijving,r.generiek_specifiek,r.waardering.officiele_tekst,r.bewaartermijn.officiele_tekst,r.procestermijn.officiele_tekst,r.aanvangsmoment.officiele_tekst,r.toelichting,r.status];
 return {id:r.id,record:r,context,waarden};
});}
export function filterSelectietabel(rijen:readonly Tabelrij[],vraag:string):readonly Tabelrij[]{const code=rijen.filter(r=>r.record.code===vraag.trim());return code.length?code:filterTabel(rijen,vraag,r=>r.waarden.map(v=>v??'').join(' '));}
export const lijstHash=(id:SelectielijstId|string)=>`#lijst=${encodeURIComponent(id)}`;
export const selectieExcelNaam=(id:SelectielijstId)=>`Selectielijst ${id}.xlsx`;
export const selectieExcelKnop=(id:SelectielijstId)=>`Download Selectielijst ${id} (.xlsx)`;
