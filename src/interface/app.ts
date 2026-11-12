import {selectieHash} from '../concordans/raadplegen.js';
import { Gegevensfout, maakGegevenslaag, SELECTIELIJSTEN } from '../gegevenslaag/index.js';
import type { Dataset, SelectielijstId } from '../gegevenslaag/index.js';
import { element, knop, lijstnamen } from './dom.js';
import { maakBoom } from './boom.js';
import { toonDetails } from './details.js';
import { indexeerPubliekeConcordans } from '../publicatie/concordans.js';
import { maakConcordanspaneel } from './concordans.js';
import { maakConcordansviewer } from './concordans-viewer.js';
import { maakSelectielijstenviewer } from './selectielijsten-viewer.js';
import { lijstHash } from '../raadplegen/index.js';
import {maakPublicatielaag} from '../publicatie/index.js';
import { maakZoekmodi } from './zoekmodi.js';

export function startApplicatie(root: HTMLElement, laag = maakGegevenslaag({ datasetsUrl: new URL('./datasets/', document.baseURI) })) {
  const publicaties=maakPublicatielaag();
  let concordanstaak:ReturnType<typeof indexeerPubliekeConcordans>|undefined;
  const concordans={laad(){if(!concordanstaak){const t=publicaties.laad('concordans').then(p=>indexeerPubliekeConcordans(p,laag));concordanstaak=t;void t.catch(()=>{if(concordanstaak===t)concordanstaak=undefined;});}return concordanstaak;}};
  const aside = element('aside',undefined,'zijbalk'); aside.setAttribute('aria-label','Selectielijst en navigatie');
  const label = element('label','Selectielijst'); label.htmlFor = 'selectielijst';
  const keuze = element('select'); keuze.id = 'selectielijst';
  const leeg = element('option','Kies een selectielijst'); leeg.value=''; keuze.append(leeg);
  for (const id of SELECTIELIJSTEN) { const optie=element('option',lijstnamen[id]);optie.value=id;keuze.append(optie); }
  const status = element('p','Kies een selectielijst om te beginnen.','laadstatus'); status.setAttribute('role','status');
  const fout = element('div',undefined,'melding fout');fout.setAttribute('role','alert');fout.hidden=true;
  const retry = knop('Opnieuw proberen',()=> { if (keuze.value) void laad(keuze.value as SelectielijstId); },'opnieuw'); retry.hidden=true;
  const tools = element('div',undefined,'boomtools');
  const alles = knop('Alles inklappen',()=>boom?.inklappen(),'inklapknop');alles.disabled=true;
  tools.append(element('h2','Structuur'),alles);
  const navigatie = element('nav',undefined,'boomgebied');navigatie.setAttribute('aria-label','Boomstructuur');
  navigatie.append(element('p','De structuur verschijnt na het kiezen van een selectielijst.','hulptekst'));
  const zoekpaneel = maakZoekmodi((id) => selecteer(id), (id) => laag.laadZoekverrijking(id));
  const boomhulp=element('p','Blader met de pijltjestoetsen door de boom. Uitgeklapte onderdelen kunnen in het boomgebied worden gescrold.','scrollhulp');boomhulp.id='boom-scrollhulp';navigatie.setAttribute('aria-describedby',boomhulp.id);
  aside.append(label,keuze,status,fout,retry,zoekpaneel.element,tools,boomhulp,navigatie);
  const detail = element('section',undefined,'details');detail.id='details';detail.tabIndex=-1;detail.setAttribute('aria-label','Geselecteerd onderdeel');
  function legeDetails(tekst='Kies een onderdeel in de boomstructuur om de officiële gegevens te bekijken.') {
    detail.replaceChildren(element('h2','Nog geen onderdeel geselecteerd'),element('p',tekst,'hulptekst'));
  }
  legeDetails();root.replaceChildren(aside,detail);
  const viewer=maakConcordansviewer({laad:()=>publicaties.laad('concordans')});
  const lijsten=maakSelectielijstenviewer(id=>publicaties.laad(id));
  const hoofdnavigatie=element('nav',undefined,'hoofdnavigatie');hoofdnavigatie.setAttribute('aria-label','Hoofdnavigatie');
  const lijstLink=element('a','Zoeken en verkennen'),tabelLink=element('a','Selectielijsten raadplegen'),viewerLink=element('a','Concordans raadplegen');lijstLink.href='#selectielijsten';lijstLink.setAttribute('aria-current','page');viewerLink.href='#concordans';tabelLink.href='#lijsten';hoofdnavigatie.append(lijstLink,tabelLink,viewerLink);root.before(hoofdnavigatie);root.after(viewer.element,lijsten.element);
  const overslaan=document.querySelector<HTMLAnchorElement>('.overslaan');overslaan?.addEventListener('click',e=>{if(!viewer.element.hidden||!lijsten.element.hidden){e.preventDefault();(!lijsten.element.hidden?lijsten.element:viewer.element).querySelector<HTMLElement>('h2')?.focus();}});
  async function route(){
    const hash=location.hash;
    if(hash==='#lijsten'||hash.startsWith('#lijst=')){++navigatieAanvraag;root.hidden=true;viewer.sluit();lijstLink.removeAttribute('aria-current');viewerLink.removeAttribute('aria-current');tabelLink.setAttribute('aria-current','page');let waarde:string|undefined;try{waarde=hash.startsWith('#lijst=')?decodeURIComponent(hash.slice(7)):undefined;}catch{waarde=undefined;}const lijst=waarde?.split(':')[0] as SelectielijstId|undefined;if(lijst&&!SELECTIELIJSTEN.includes(lijst)){await lijsten.open();return;}await lijsten.open(lijst,waarde?.includes(':')?waarde:undefined);return;}
    tabelLink.removeAttribute('aria-current');lijsten.sluit();
    const concordansMatch=/^#concordans(?:=(\d+))?$/.exec(hash);
    if(concordansMatch){root.hidden=true;lijstLink.removeAttribute('aria-current');viewerLink.setAttribute('aria-current','page');await viewer.open(concordansMatch[1]?Number(concordansMatch[1]):undefined);return;}
    if(!hash||hash==='#selectielijsten'||hash.startsWith('#selectie=')){viewer.sluit();root.hidden=false;viewerLink.removeAttribute('aria-current');lijstLink.setAttribute('aria-current','page');}
    if(hash.startsWith('#selectie=')){try{const id=decodeURIComponent(hash.slice(10)),lijst=id.split(':')[0];if(!SELECTIELIJSTEN.includes(lijst as SelectielijstId))throw Error('Onbekende lijst');await navigeer(lijst as SelectielijstId,id,false,true);}catch{legeDetails('De rechtstreekse verwijzing naar het selectievoorschrift is ongeldig.');}}
  }
  window.addEventListener('hashchange',()=>{void route();});

  let dataset: Dataset | undefined;
  let boom: ReturnType<typeof maakBoom> | undefined;
  let aanvraag=0,navigatieAanvraag=0;
  let actiefId:string|undefined;
  const geschiedenis:{lijst:SelectielijstId;id:string}[]=[];
  function selecteer(id: string, vanuitBoom = false, intern=false) {
    if(!intern){++navigatieAanvraag;geschiedenis.length=0;}
    if (!dataset) { legeDetails('Kies eerst een selectielijst.');return; }
    try {
      if (toonDetails(detail,dataset,id,(doel)=>selecteer(doel))) {
        actiefId=id;
        if(!intern && location.hash!==selectieHash(id))history.pushState(null,'',selectieHash(id));
        if(dataset.selectiegegeven(id)){const terug=element('a','Terug naar tabelrij','concordans-link');terug.href=lijstHash(id);detail.querySelector('#detailtitel')?.before(terug);}
        const paneel=maakConcordanspaneel(dataset,id,{laad:()=>concordans.laad(),laadDataset:(lijst)=>laag.laadDataset(lijst),navigeer:(lijst,doel)=>{void navigeer(lijst,doel);}});
        const anker=detail.querySelector(':scope > .annotaties,:scope > .bronlocaties-titel');if(anker)anker.before(paneel);else detail.append(paneel);
        if(geschiedenis.length)detail.querySelector('#detailtitel')?.before(knop('Terug naar oorspronkelijk voorschrift',()=>{const doel=geschiedenis.pop();if(doel)void navigeer(doel.lijst,doel.id,true);},'concordans-terug'));
        boom?.activeer(id);
        if(!vanuitBoom)detail.querySelector<HTMLElement>('#detailtitel')?.focus();
        detail.scrollTop=0;
      }
    } catch (error) {
      const melding=element('p',fouttekst(error),'melding fout');melding.setAttribute('role','alert');detail.replaceChildren(melding);
    }
  }
  async function navigeer(lijst:SelectielijstId,id:string,terug=false,viaRoute=false){
    const ticket=++navigatieAanvraag;const oorsprong=dataset&&actiefId?{lijst:dataset.id,id:actiefId}:undefined;
    if(dataset?.id!==lijst){keuze.value=lijst;await laad(lijst);}
    if(ticket!==navigatieAanvraag||dataset?.id!==lijst)return;
    if(oorsprong&&!terug&&(oorsprong.id!==id||oorsprong.lijst!==lijst))geschiedenis.push(oorsprong);
    selecteer(id,false,true);
    if(!viaRoute&&actiefId===id&&location.hash!==selectieHash(id))history.pushState(null,'',selectieHash(id));
  }
  async function laad(id: SelectielijstId) {
    const huidig=++aanvraag;
    dataset=undefined;actiefId=undefined;boom=undefined;zoekpaneel.koppel(undefined);alles.disabled=true;fout.hidden=true;retry.hidden=true;
    navigatie.replaceChildren();navigatie.setAttribute('aria-busy','true');
    legeDetails('De gekozen selectielijst wordt geladen.');
    status.textContent=`Selectielijst ${lijstnamen[id]} laden…`;
    try {
      const geladen=await laag.laadDataset(id);
      if(huidig!==aanvraag)return;
      dataset=geladen;boom=maakBoom(geladen,(doel)=>selecteer(doel,true));
      navigatie.replaceChildren(boom.element);zoekpaneel.koppel(geladen);alles.disabled=false;legeDetails();
      status.textContent=`Selectielijst ${lijstnamen[id]} geladen.`;
    } catch(error) {
      if(huidig!==aanvraag)return;
      dataset=undefined;boom=undefined;navigatie.replaceChildren();
      fout.textContent=fouttekst(error);fout.hidden=false;retry.hidden=false;
      status.textContent='Selectielijst niet geladen.';legeDetails('De gegevens zijn niet beschikbaar. Probeer de selectielijst opnieuw te laden.');
    } finally { if(huidig===aanvraag)navigatie.setAttribute('aria-busy','false'); }
  }
  void route();
  keuze.addEventListener('change',()=> {
    ++navigatieAanvraag;geschiedenis.length=0;actiefId=undefined;
    if(location.hash.startsWith('#selectie='))history.pushState(null,'','#selectielijsten');
    if (keuze.value) void laad(keuze.value as SelectielijstId);
    else { ++aanvraag;dataset=undefined;boom=undefined;zoekpaneel.koppel(undefined);navigatie.replaceChildren();navigatie.setAttribute('aria-busy','false');alles.disabled=true;fout.hidden=true;retry.hidden=true;status.textContent='Kies een selectielijst om te beginnen.';legeDetails(); }
  });
}
function fouttekst(error: unknown): string {
  if(error instanceof Gegevensfout) {
    if(error.code==='LADEN_MISLUKT')return 'De selectielijst kan niet worden geladen. Een bestand ontbreekt of is niet bereikbaar. Controleer de verbinding en probeer opnieuw.';
    if(error.code==='ONGELDIGE_VERWIJZING'||error.code==='CYCLUS')return 'De selectielijst bevat een ongeldige verwijzing of structuur. De gegevens kunnen niet veilig worden weergegeven.';
    return 'De bestanden van deze selectielijst zijn ongeldig of onvolledig. De gegevens kunnen niet veilig worden weergegeven.';
  }
  return 'Er is een onverwachte technische fout opgetreden. Probeer de selectielijst opnieuw te laden.';
}
