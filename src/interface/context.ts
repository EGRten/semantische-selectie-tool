import { element } from './dom.js';
import type { Dataset } from '../gegevenslaag/index.js';

type Bron = { bron_id: string; pdf_pagina?: number };
type Fragment = { tekst: string; bron: Bron };
type Pagina = Fragment & { id: string; tekstcodering?: string; leesbare_paginakopie?: {bron_id:string;pdf_pagina:number;tekst:string}|null };
type Rubriek = {code:string; primaire_fragmenten: Fragment[]; leesbare_paginakopie: (Fragment & {functie?:string})[]; opmerking?:string};
const cache = new Map<string, Promise<unknown>>();
export async function leesBroncontext(dataset: Dataset, bestand: string) {
  const url = new URL(`./datasets/${dataset.id}/${bestand}`, document.baseURI).href;
  if (!cache.has(url)) {
    const taak = (async()=>{const r=await fetch(url);if(!r.ok)throw Error('Bestand niet bereikbaar');return r.json();})();
    cache.set(url,taak);void taak.catch(()=>cache.delete(url));
  }
  return cache.get(url)!;
}
function fragment(x: unknown): x is Fragment {
  if (!x || typeof x!=='object')return false;
  const r=x as Fragment;return typeof r.tekst==='string' && typeof r.bron?.bron_id==='string' && (r.bron.pdf_pagina===undefined||typeof r.bron.pdf_pagina==='number');
}
/** Lazily loaded source text stays in the disclosure that requested it, including after navigation. */
export function bronContext(dataset: Dataset, bestand: 'bepalingen.json'|'rubriekcontext.json', code: string | undefined, bronlocatie:(bron:Bron)=>HTMLElement): HTMLDetailsElement {
  const details=element('details',undefined,'broncontext');
  details.append(element('summary',bestand==='bepalingen.json'?'Algemene bepalingen raadplegen':'Volledige rubriekcontext raadplegen'));
  let geladen=false;
  details.addEventListener('toggle',async()=>{
    if(!details.open||geladen)return;geladen=true;
    details.querySelector(':scope > div')?.remove();
    const inhoud=element('div');details.append(inhoud);inhoud.textContent='Brontekst laden…';
    try {
      const json=await leesBroncontext(dataset,bestand);if(!Array.isArray(json))throw Error('Ongeldige broncontext');
      inhoud.replaceChildren();
      const toon=(f:Fragment,label:string,doel:HTMLElement=inhoud)=>{if(!fragment(f)||!dataset.manifest.bronnenregister.some(b=>b.id===f.bron.bron_id))throw Error('Ongeldige bronverwijzing');doel.append(element('h4',label),element('p',f.tekst,'brontekst'),bronlocatie(f.bron));};
      if(bestand==='bepalingen.json') {
        for(const p of json as Pagina[]) {
          if(!fragment(p)||!p.id.startsWith(dataset.id+':'))throw Error('Ongeldige bronpagina');
          const pagina=element('details');pagina.append(element('summary',`Pagina ${p.bron.pdf_pagina}`));inhoud.append(pagina);
          const blok=element('div');pagina.append(blok);
          toon(p,`Brontekst · pagina ${p.bron.pdf_pagina}`,blok);
          if(p.tekstcodering)blok.prepend(element('p',`Tekstcodering: ${p.tekstcodering}`,'hulptekst'));
          if(p.leesbare_paginakopie){const k=p.leesbare_paginakopie;toon({tekst:k.tekst,bron:k},'Leesbare paginakopie uit aangeleverd document; geen vervanging van de officiële bron',blok);}
        }
      } else {
        const r=(json as Rubriek[]).find(r=>r.code===code);if(!r)throw Error('Rubriekcontext ontbreekt');
        if(r.opmerking)inhoud.append(element('p',r.opmerking,'hulptekst'));
        for(const f of r.primaire_fragmenten)toon(f,'Officieel rubriekfragment');
        for(const f of r.leesbare_paginakopie)toon(f,'Leesbare paginakopie uit aangeleverd document; kan andere rubrieken bevatten');
      }
    } catch { cache.delete(new URL(`./datasets/${dataset.id}/${bestand}`,document.baseURI).href);inhoud.replaceChildren(element('p','De broncontext kan niet worden geladen of bevat een ongeldige verwijzing. Sluit dit onderdeel en open het opnieuw om nogmaals te proberen.','melding fout'));inhoud.setAttribute('role','alert');geladen=false; }
  });
  return details;
}
