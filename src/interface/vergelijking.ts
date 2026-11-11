import type { Dataset } from '../gegevenslaag/index.js';
export type Vergelijkveld = {label:string;links:string|null;rechts:string|null;linksStatus?:string|undefined;rechtsStatus?:string|undefined};
const labels:Record<string,string>={officiele_omschrijving:'omschrijving',procesomschrijving:'procesomschrijving',toelichting:'toelichting',broncontext:'rubriekcontext',algemene_bepalingen:'algemene bepalingen'};
export function vergelijkvelden(links:Dataset,linksId:string,rechts:Dataset,rechtsId:string):readonly Vergelijkveld[]{
  const lees=(ds:Dataset,id:string)=>{const r=ds.selectiegegeven(id),n=ds.structuuronderdeel(id);if(!r&&!n)throw Error('Onderdeel ontbreekt');return {r,n};};
  const a=lees(links,linksId),b=lees(rechts,rechtsId);
  const veld=(label:string,l:string|null|undefined,r:string|null|undefined,ls?:string,rs?:string):Vergelijkveld=>({label,links:l??null,rechts:r??null,linksStatus:a.r?ls:'structuurniveau',rechtsStatus:b.r?rs:'structuurniveau'});
  const pad=(d:Dataset,id:string)=>d.padNaar(id)?.map(p=>`${p.gegevens.code} ${'benaming' in p.gegevens?p.gegevens.benaming:p.gegevens.officiele_benaming}`).join(' / ');
  const uit:Vergelijkveld[]=[veld('Selectielijst',links.manifest.officiele_titel,rechts.manifest.officiele_titel),veld('Vaststelling',links.manifest.vaststellingsgegevens.publicatie,rechts.manifest.vaststellingsgegevens.publicatie),
    veld('Officiële code',a.r?.code??a.n?.code,b.r?.code??b.n?.code),veld('Officiële benaming',a.r?.officiele_benaming??a.n?.benaming,b.r?.officiele_benaming??b.n?.benaming),veld('Context',pad(links,linksId),pad(rechts,rechtsId))];
  if(a.r||b.r){
    uit.push(veld('Omschrijving',a.r?.officiele_omschrijving,b.r?.officiele_omschrijving),veld('Waardering',a.r?.waardering.officiele_tekst,b.r?.waardering.officiele_tekst),
      veld('Bronlegenda waardering',a.r?.waardering.afleiding,b.r?.waardering.afleiding),
      veld('Bewaartermijn',a.r?.bewaartermijn.officiele_tekst,b.r?.bewaartermijn.officiele_tekst,a.r?.bewaartermijn.status,b.r?.bewaartermijn.status),
      veld('Procestermijn',a.r?.procestermijn.officiele_tekst,b.r?.procestermijn.officiele_tekst,a.r?.procestermijn.status,b.r?.procestermijn.status),
      veld('Aanvangsmoment',a.r?.aanvangsmoment.officiele_tekst,b.r?.aanvangsmoment.officiele_tekst,a.r?.aanvangsmoment.status,b.r?.aanvangsmoment.status),
      veld('Voorwaarden raadplegen in',a.r?.toepassingsvoorwaarden.bronvelden.map(v=>labels[v]??v).join(', '),b.r?.toepassingsvoorwaarden.bronvelden.map(v=>labels[v]??v).join(', ')),
      veld('Uitzonderingen en verwijzingen',a.r?.uitzonderingen_en_verwijzingen.officiele_tekst,b.r?.uitzonderingen_en_verwijzingen.officiele_tekst),
      veld('Toelichting',a.r?.toelichting??a.n?.toelichting,b.r?.toelichting??b.n?.toelichting));
  }
  return Object.freeze(uit.filter(v=>v.links?.trim()||v.rechts?.trim()||['Bewaartermijn','Procestermijn','Aanvangsmoment','Waardering'].includes(v.label)));
}
