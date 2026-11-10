import { Gegevensfout, maakGegevenslaag, SELECTIELIJSTEN } from '../gegevenslaag/index.js';
import type { Dataset, SelectielijstId } from '../gegevenslaag/index.js';
import { element, knop, lijstnamen } from './dom.js';
import { maakBoom } from './boom.js';
import { toonDetails } from './details.js';
import { maakZoekmodi } from './zoekmodi.js';

export function startApplicatie(root: HTMLElement, laag = maakGegevenslaag({ datasetsUrl: new URL('./datasets/', document.baseURI) })) {
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
  aside.append(label,keuze,status,fout,retry,zoekpaneel.element,tools,navigatie);
  const detail = element('section',undefined,'details');detail.id='details';detail.tabIndex=-1;detail.setAttribute('aria-label','Geselecteerd onderdeel');
  function legeDetails(tekst='Kies een onderdeel in de boomstructuur om de officiële gegevens te bekijken.') {
    detail.replaceChildren(element('h2','Nog geen onderdeel geselecteerd'),element('p',tekst,'hulptekst'));
  }
  legeDetails();root.replaceChildren(aside,detail);
  let dataset: Dataset | undefined;
  let boom: ReturnType<typeof maakBoom> | undefined;
  let aanvraag=0;
  function selecteer(id: string, vanuitBoom = false) {
    if (!dataset) { legeDetails('Kies eerst een selectielijst.');return; }
    try {
      if (toonDetails(detail,dataset,id,(doel)=>selecteer(doel))) {
        boom?.activeer(id,!vanuitBoom);
        detail.scrollTop=0;
      }
    } catch (error) {
      const melding=element('p',fouttekst(error),'melding fout');melding.setAttribute('role','alert');detail.replaceChildren(melding);
    }
  }
  async function laad(id: SelectielijstId) {
    const huidig=++aanvraag;
    dataset=undefined;boom=undefined;zoekpaneel.koppel(undefined);alles.disabled=true;fout.hidden=true;retry.hidden=true;
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
  keuze.addEventListener('change',()=> {
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
