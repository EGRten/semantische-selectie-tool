import type { Dataset, Zoekverrijking, SelectielijstId } from '../gegevenslaag/index.js';
import { maakBegripsindex } from '../begripszoeken/index.js';
import type { Begripsresultaat } from '../begripszoeken/index.js';
import { element, knop, lijstnamen, typenaam } from './dom.js';

export function maakBegripspaneel(selecteer: (id: string) => void, laden: (id: SelectielijstId) => Promise<Zoekverrijking>) {
  const paneel = element('section', undefined, 'begripspaneel');
  const form = element('form'); form.setAttribute('role','search'); form.setAttribute('aria-label','Begripsgericht zoeken in de gekozen selectielijst');
  const velden = element('fieldset'); velden.disabled = true;
  const label = element('label','Begripsgericht zoeken'); label.htmlFor = 'begripsopdracht';
  const invoer = element('input'); invoer.type='search';invoer.id='begripsopdracht';invoer.autocomplete='off';
  const hulp=element('p','Zoek met begrippen, afkortingen of gewone taal via vooraf samengestelde zoekrelaties.','zoekhulp');
  hulp.id='begripshulp';invoer.setAttribute('aria-describedby',hulp.id);
  const acties=element('div',undefined,'zoekacties');const submit=element('button','Zoeken');submit.type='submit';
  acties.append(submit,knop('Wissen',()=>{invoer.value='';wisResultaten();invoer.focus();}));
  const vervallen=element('input');vervallen.type='checkbox';const vervallenLabel=element('label',undefined,'zoekfilter');
  vervallenLabel.append(vervallen,document.createTextNode('Vervallen resultaten meenemen'));
  const ai=element('input');ai.type='checkbox';const aiLabel=element('label',undefined,'zoekfilter');
  aiLabel.append(ai,document.createTextNode('Ook onbevestigde AI-zoektermen gebruiken'));
  const aiHulp=element('p','Kan extra resultaten geven, maar ook minder betrouwbare betekenisrelaties introduceren.','zoekhulp');
  aiHulp.id='aihulp';ai.setAttribute('aria-describedby',aiHulp.id);
  velden.append(label,invoer,hulp,acties,vervallenLabel,aiLabel,aiHulp);form.append(velden);
  const status=element('p','Kies eerst een selectielijst.','begripsstatus');status.setAttribute('aria-live','polite');
  const fout=element('p',undefined,'melding fout');fout.setAttribute('role','alert');fout.hidden=true;
  const opnieuw=knop('Zoeklexicon opnieuw laden',()=>void activeer());opnieuw.hidden=true;
  const resultaten=element('section',undefined,'zoekresultaten');resultaten.hidden=true;
  const kop=element('h3','Begripsgerichte zoekresultaten');kop.id='begripsresultatenkop';resultaten.setAttribute('aria-labelledby',kop.id);
  const lijst=element('ol');const meer=knop('Meer resultaten tonen',()=>volgende());meer.hidden=true;
  resultaten.append(kop,lijst,meer);
  paneel.append(form,status,fout,opnieuw,element('p','Zoekrelevantie is geen archivistische toepasselijkheid of automatisch selectieadvies.','zoekhulp'),resultaten);
  let dataset: Dataset|undefined;let index: ReturnType<typeof maakBegripsindex>|undefined;let actief=false;let aanvraag=0;
  const cache=new WeakMap<Dataset,Promise<ReturnType<typeof maakBegripsindex>>>();
  let gevonden:readonly Begripsresultaat[]=[];let getoond=0;
  function wisResultaten() {
    ++aanvraag;gevonden=[];getoond=0;lijst.replaceChildren();resultaten.hidden=true;meer.hidden=true;fout.hidden=true;
    status.textContent=dataset?'Voer een begrip of afkorting in.':'Kies eerst een selectielijst.';
  }
  async function activeer() {
    if(!actief||!dataset)return;
    const context=dataset;const nummer=++aanvraag;velden.disabled=true;fout.hidden=true;opnieuw.hidden=true;
    status.textContent='Zoeklexicon en betekenisrelaties laden…';
    try {
      let taak=cache.get(context);
      if(!taak) {
        taak=laden(context.id).then(data=>maakBegripsindex(context,data));cache.set(context,taak);
        const deze=taak;void taak.catch(()=>{if(cache.get(context)===deze)cache.delete(context);});
      }
      const geladen=await taak;
      if(!actief||context!==dataset||nummer!==aanvraag)return;
      index=geladen;velden.disabled=false;status.textContent='Voer een begrip of afkorting in.';
    } catch {
      if(!actief||context!==dataset||nummer!==aanvraag)return;
      index=undefined;status.textContent='Begripsgericht zoeken niet beschikbaar.';
      fout.textContent='Het zoeklexicon of de betekenisrelaties ontbreken, zijn onbereikbaar of ongeldig. Trefwoordzoeken en de boom blijven beschikbaar.';
      fout.hidden=false;opnieuw.hidden=false;
    }
  }
  function volgende() {
    for(const r of gevonden.slice(getoond,getoond+25)) {
      const li=element('li');li.dataset.zoekresultaat=r.id;
      li.append(knop(`${r.code} ${r.benaming}`,()=>selecteer(r.id),'zoekresultaatknop'));
      li.append(element('p',`Selectielijst ${lijstnamen[r.selectielijst]} · ${typenaam(r.type)}${r.vervallen?' · Vervallen':''}`,'resultaattype'));
      if(r.context)li.append(element('p',r.context,'resultaatcontext'));
      li.append(element('p',r.reden,'resultaatreden'));
      if(r.onbevestigd)li.append(element('p','Bevat een onbevestigde AI-zoekrelatie.','ai-aanduiding'));
      const uitleg=element('details',undefined,'zoekuitleg');uitleg.append(element('summary',`Waarom gevonden? (${r.verklaringen.length} ${r.verklaringen.length===1?'verklaring':'verklaringen'})`));
      for(const v of r.verklaringen) {
        const blok=element('div');blok.append(element('strong',v.reden));
        if(v.term&&v.relatie) {
          const t=v.term,rel=v.relatie;
          const herkomst:Record<string,string>={officieel:'Officiële term',brononderbouwd_alternatief:'Brononderbouwde aanvulling',taalkundige_variant:'Taalkundig afgeleide variant',ai_voorgesteld:'AI-voorgestelde zoekterm'};
          blok.append(element('p',`Herkomst: ${herkomst[t.herkomsttype]??t.herkomsttype}.`));
          blok.append(element('p',t.onderbouwing,'brontekst'));
          if(rel.onderbouwing!==t.onderbouwing)blok.append(element('p',rel.onderbouwing,'brontekst'));
          blok.append(element('p',`Beoordelingsstatus term: ${t.beoordelingsstatus}; relatie: ${rel.status}.`));
          blok.append(element('p',`Bron: ${t.bron.bron_id}${t.bron.pdf_pagina!==undefined?`, pagina ${t.bron.pdf_pagina}`:''}.`));
          if(t.bron.fragment)blok.append(element('blockquote',t.bron.fragment,'brontekst'));
          blok.append(element('p',`Risico op verwarring: ${t.risico_op_verwarring}.`));
          if(t.herkomsttype==='ai_voorgesteld'&&!v.onbevestigd)blok.append(element('p','De zoekrichting is inhoudelijk beoordeeld; dit is geen officieel synoniem of formeel selectieoordeel.'));
        }
        uitleg.append(blok);
      }
      li.append(uitleg);lijst.append(li);
    }
    getoond=Math.min(gevonden.length,getoond+25);meer.hidden=getoond>=gevonden.length;
    meer.textContent=`Meer resultaten tonen (${getoond} van ${gevonden.length} getoond)`;
  }
  function zoek() {
    if(!dataset||!index||!actief)return;
    wisResultaten();
    try {
      gevonden=index.zoek(invoer.value,{onbevestigdeAi:ai.checked,vervallenMeenemen:vervallen.checked});
      const n=gevonden.length;
      status.textContent=`${n} ${n===1?'resultaat':'resultaten'}. ${ai.checked?'Onbevestigde AI-zoektermen inbegrepen.':'Onbevestigde AI-zoektermen uitgesloten.'} ${vervallen.checked?'Vervallen resultaten inbegrepen.':'Vervallen resultaten uitgesloten.'}${n?'':' Probeer een ander begrip of een afkorting.'}`;
      resultaten.hidden=!n;volgende();
    } catch {fout.textContent='Er is een technische fout opgetreden tijdens het begripsgericht zoeken.';fout.hidden=false;status.textContent='Zoeken is niet gelukt.';}
  }
  form.addEventListener('submit',e=>{e.preventDefault();zoek();});
  ai.addEventListener('change',()=>{if(invoer.value.trim())zoek();});vervallen.addEventListener('change',()=>{if(invoer.value.trim())zoek();});
  invoer.addEventListener('input',wisResultaten);
  return {element:paneel,koppel(nieuw:Dataset|undefined,zichtbaar:boolean){
    actief=zichtbaar;dataset=nieuw;index=undefined;invoer.value='';ai.checked=false;vervallen.checked=false;velden.disabled=true;opnieuw.hidden=true;wisResultaten();
    if(actief)void activeer();
  }};
}
