import type { SelectielijstId, Dataset } from '../gegevenslaag/index.js';
import type { indexeerBronconcordans, Bronrij } from '../concordans/index.js';
import { CONCORDANS_KOLOMMEN, CONCORDANS_IDENTITEIT as bron, concordanscel, zoekConcordansrijen, concordansRijHash, selectieHash } from '../concordans/raadplegen.js';
import { element, knop, lijstnamen } from './dom.js';
import { toonBesluit } from './concordans.js';
type Controle=Awaited<ReturnType<typeof indexeerBronconcordans>>;
type Opties={laad:()=>Promise<Controle>;laadDataset:(id:SelectielijstId)=>Promise<Dataset>};
export function maakConcordansviewer(opties:Opties){
 const sectie=element('section',undefined,'concordans-viewer');sectie.id='concordans-viewer';sectie.hidden=true;sectie.setAttribute('role','main');sectie.setAttribute('aria-labelledby','concordans-viewertitel');
 const titel=element('h2','Concordans raadplegen');titel.id='concordans-viewertitel';titel.tabIndex=-1;
 const uitleg=element('p','Oorspronkelijke concordans 1996–2020. Deze historische bron stelt geen juridische of inhoudelijke gelijkwaardigheid vast.');
 const metadata=element('details',undefined,'viewer-bron');metadata.append(element('summary','Bronidentiteit, herkomst en hergebruik'));
 const dl=element('dl');for(const [k,v] of [['Document',bron.titel],['Excel SHA-256',bron.excelSha256],['JSON SHA-256',bron.jsonSha256],['Herkomst','Aangeleverde werkmap. Maker, oorspronkelijke publicerende organisatie en rechthebbende zijn niet vastgesteld.'],['Hergebruik','Een voldoende onderbouwde grondslag voor integrale openbare distributie is nog niet vastgesteld. De concordansdata zijn daarom niet opgenomen in de publieke build.']])dl.append(element('dt',k),element('dd',v));
 const bronlink=element('a','Vindplaatscontext: VHIC FAQ (geen bewezen downloadlocatie van deze werkmap)');bronlink.href=bron.contextUrl;bronlink.target='_blank';bronlink.rel='noopener noreferrer';
 const voorwaarden=element('a','Bronvermelding en hergebruikafweging');voorwaarden.href=new URL('./concordans-bronvermelding.md',document.baseURI).href;metadata.append(dl,bronlink,element('p'),voorwaarden);
 const status=element('p',undefined,'viewer-status');status.setAttribute('role','status');
 const inhoud=element('div');sectie.append(titel,uitleg,metadata,status,inhoud);
 let controle:Controle|undefined,versie=0,pagina=0,vraag='',actieveRij:number|undefined;const grootte=20;
 let zoekveld:HTMLInputElement;let resultaten:HTMLElement;let detail:HTMLElement;
 function cel(r:Bronrij,i:number){const v=concordanscel(r,i),blok=element('div');blok.append(element('span',v.origineel===null||v.origineel===''?v.leeg!:v.origineel,'brontekst'));if(v.context!==null)blok.append(element('small',`Samengevoegde context (niet de oorspronkelijke celwaarde): ${v.context}`,'mergecontext'));return blok;}
 async function toonRij(rij:number,focus=true){
  if(!controle)return;const ticket=++versie;actieveRij=rij;
  const r=controle.bronrijen.find(r=>r.bron.rij===rij);detail.replaceChildren();
  if(!r){const p=element('p',`Concordansrij ${rij} bestaat niet in deze bron.`,'melding fout');p.setAttribute('role','alert');detail.append(p);return;}
  const h=element('h3',`Concordansrij ${rij} — ${r.bron.werkblad}`);h.tabIndex=-1;detail.append(h);
  const permalink=element('a',`Rechtstreekse link naar concordansrij ${rij}`);permalink.href=concordansRijHash(rij);detail.append(permalink);
  const waarden=element('dl',undefined,'viewer-cellen');CONCORDANS_KOLOMMEN.forEach((kolom,i)=>{const dd=element('dd');dd.append(cel(r,i));waarden.append(element('dt',kolom),dd);});detail.append(element('h4','Oorspronkelijke broncellen A–K'),waarden);
  const technisch=element('section',undefined,'viewer-techniek');technisch.append(element('h4','Afzonderlijke technische koppelingen en beoordelingen'));
  const analyse=controle.rijen.find(v=>v.bronrij_id===r.id)!;
  if(analyse.beoordelingsbesluit)technisch.append(toonBesluit(analyse.beoordelingsbesluit));
  if(analyse.beoordeling)technisch.append(element('p',`Oorspronkelijk technisch onderzoek (${analyse.beoordeling.categorie}): ${analyse.beoordeling.onderbouwing}`));
  for(const k of analyse.doel2020.koppelingen.filter(k=>k.status.startsWith('technisch_gecorrigeerd')))technisch.append(element('p',`Technische correctie: bronwaarde ${k.code} blijft behouden; afzonderlijk doel ${k.record_id?.replace('2020:','')}. ${rij===716?'Nieuw in 2020, geen historische relatie.':'Interpretatie op expliciet besluit; oorspronkelijke bedoeling niet onafhankelijk bewezen.'}`,'melding'));
  const refs=new Map<string,{id:string;lijst:SelectielijstId;kandidaat:boolean}>();
  for(const id of analyse.bron1996.record_ids)refs.set(id,{id,lijst:'1996-2012',kandidaat:false});
  for(const k of analyse.doel2020.koppelingen)if(k.record_id)refs.set(k.record_id,{id:k.record_id,lijst:'2020',kandidaat:false});
  for(const id of analyse.beoordeling?.kandidaten??[])if(!refs.has(id))refs.set(id,{id,lijst:id.split(':')[0] as SelectielijstId,kandidaat:true});
  if(!analyse.bron1996.record_ids.length&&analyse.interpretatie_ids.length)technisch.append(element('p','Geen definitieve historische koppeling. Eventuele kandidaten zijn niet vastgesteld.','melding'));
  if(!refs.size)technisch.append(element('p','Geen rechtstreeks gekoppeld officieel voorschrift bij deze bronrij.'));
  for(const ref of refs.values()){
   let ds:Dataset;try{ds=await opties.laadDataset(ref.lijst);}catch{if(ticket!==versie||sectie.hidden)return;const fout=element('p','De officiële koppelingen kunnen niet worden geladen. De oorspronkelijke broncellen blijven raadpleegbaar.','melding fout');fout.setAttribute('role','alert');technisch.append(fout);break;}if(ticket!==versie||sectie.hidden)return;
   const r=ds.selectiegegeven(ref.id),s=ds.structuuronderdeel(ref.id);const a=element('a',`${ref.kandidaat?'Kandidaat (niet vastgesteld)':'Open officieel onderdeel'}: ${lijstnamen[ref.lijst]} · ${r?.code??s?.code} ${r?.officiele_benaming??s?.benaming}`,'concordans-link');a.href=selectieHash(ref.id);technisch.append(a);
  }
  if(analyse.context2017.omschrijving||analyse.context2017.waardering)technisch.append(element('p','De opmerkingen in J/K zijn broncontext over 2017, geen vastgestelde 2017-codemapping.'));
  detail.append(technisch);resultaten.querySelectorAll('[data-viewerrij]').forEach(tr=>{if(Number((tr as HTMLElement).dataset.viewerrij)===rij)tr.setAttribute('aria-current','true');else tr.removeAttribute('aria-current');});if(focus)h.focus();
 }
 function tabel(){
  if(!controle)return;const rs=zoekConcordansrijen(controle.bronrijen,vraag);const aantal=Math.max(1,Math.ceil(rs.length/grootte));pagina=Math.min(pagina,aantal-1);
  status.textContent=`${rs.length} van ${controle.bronrijen.length} bronrijen · pagina ${pagina+1} van ${aantal}.`;
  resultaten.replaceChildren();if(!rs.length){resultaten.append(element('p','Geen concordansrijen gevonden. Wis de zoekopdracht om alle rijen te bekijken.'));return;}
  const p=element('nav',undefined,'viewer-bladeren');p.setAttribute('aria-label','Concordanspagina’s');const blader=(delta:number)=>{pagina+=delta;tabel();const richting=delta<0?'vorige':'volgende';(resultaten.querySelector<HTMLButtonElement>(`[data-blader="${richting}"]:not(:disabled)`)??resultaten.querySelector<HTMLButtonElement>('[data-blader]:not(:disabled)'))?.focus();};const vorige=knop('Vorige pagina',()=>blader(-1)),volgende=knop('Volgende pagina',()=>blader(1));vorige.dataset.blader='vorige';volgende.dataset.blader='volgende';vorige.disabled=pagina===0;volgende.disabled=pagina===aantal-1;p.append(vorige,element('span',`Pagina ${pagina+1} van ${aantal}`),volgende);resultaten.append(p);
  const scroll=element('div',undefined,'viewer-tabelgebied');scroll.tabIndex=0;scroll.setAttribute('role','region');scroll.setAttribute('aria-label','Concordanstabel A–K, horizontaal verschuifbaar');
  const table=element('table',undefined,'viewer-tabel');table.append(element('caption','Oorspronkelijke bronrijen A–K, in bronvolgorde. Selecteer een rij voor leesbare details.'));
  const head=element('thead'),tr=element('tr');for(const tekst of ['Bronrij',...CONCORDANS_KOLOMMEN]){const th=element('th',tekst);th.scope='col';tr.append(th);}head.append(tr);const body=element('tbody');
  for(const r of rs.slice(pagina*grootte,(pagina+1)*grootte)){const tr=element('tr');tr.dataset.viewerrij=String(r.bron.rij);if(r.bron.rij===actieveRij)tr.setAttribute('aria-current','true');const th=element('th');th.scope='row';const a=element('a',`Rij ${r.bron.rij}`);a.href=concordansRijHash(r.bron.rij);th.append(a);tr.append(th);CONCORDANS_KOLOMMEN.forEach((_,i)=>{const td=element('td');td.append(cel(r,i));tr.append(td);});body.append(tr);}table.append(head,body);scroll.append(table);resultaten.append(scroll);
 }
 function bediening(){
  const form=element('form',undefined,'viewer-bediening'),label=element('label','Zoek in concordans');zoekveld=element('input');zoekveld.id='concordans-zoekveld';zoekveld.type='search';label.htmlFor=zoekveld.id;zoekveld.value=vraag;const zoek=element('button','Zoeken');zoek.type='submit';form.append(label,zoekveld,zoek,knop('Zoekopdracht wissen',()=>{vraag='';zoekveld.value='';pagina=0;tabel();zoekveld.focus();}));form.addEventListener('submit',e=>{e.preventDefault();vraag=zoekveld.value;pagina=0;tabel();});
  const ga=element('form',undefined,'viewer-bediening'),rijlabel=element('label','Ga naar bronrij'),veld=element('input');veld.id='concordans-ga-rij';veld.type='number';veld.min='3';veld.max='718';veld.required=true;rijlabel.htmlFor=veld.id;const button=element('button','Open bronrij');button.type='submit';ga.append(rijlabel,veld,button);ga.addEventListener('submit',e=>{e.preventDefault();const rij=Number(veld.value);if(location.hash===concordansRijHash(rij))void toonRij(rij);else location.hash=concordansRijHash(rij);});
  resultaten=element('div');detail=element('section',undefined,'viewer-rijdetail');detail.setAttribute('aria-label','Details concordansrij');inhoud.replaceChildren(form,element('p','Zoeken combineert alle woorden, zonder betekenisuitbreiding, in broncellen en samengevoegde context. Leeg blijft leeg: context uit samengevoegde Excel-cellen wordt afzonderlijk vermeld.','hulptekst'),ga,resultaten,detail);tabel();
 }
 return {element:sectie,sluit(){sectie.hidden=true;++versie;},async open(rij?:number){sectie.hidden=false;const ticket=++versie;titel.focus();status.textContent='Concordans laden…';
  try{const c=await opties.laad();if(ticket!==versie||sectie.hidden)return;controle=c;bediening();if(rij!==undefined){let rs=zoekConcordansrijen(c.bronrijen,vraag);if(!rs.some(r=>r.bron.rij===rij)){vraag='';zoekveld.value='';rs=c.bronrijen;}const index=rs.findIndex(r=>r.bron.rij===rij);if(index>=0){pagina=Math.floor(index/grootte);tabel();}await toonRij(rij);}else detail.append(element('p','Selecteer een bronrij om de elf oorspronkelijke cellen en technische context te bekijken.'));}
  catch{if(ticket!==versie||sectie.hidden)return;status.textContent='Concordans niet beschikbaar.';const p=element('p','De concordansbron is niet beschikbaar of kon niet worden gecontroleerd. De integrale concordans is nog niet vrijgegeven voor publieke distributie. De selectielijsten en zoekfuncties blijven beschikbaar.','melding fout');p.setAttribute('role','alert');inhoud.replaceChildren(p,knop('Concordans opnieuw proberen',()=>{void this.open(rij);}));}
 }};
}
