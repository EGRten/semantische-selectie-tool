import type { Dataset, Selectiegegeven } from '../gegevenslaag/index.js';
import { selectieTekst } from './kopieer.js';
import { bronContext } from './context.js';
import { element, knop, lijstnamen, typenaam } from './dom.js';

type Bron = { readonly bron_id: string; readonly pdf_pagina?: number; readonly eindpagina?: number;
  readonly werkblad?: number | string; readonly rij?: number; readonly kolom?: string; readonly kolommen?: readonly string[]; readonly functie?: string; readonly bbox?: readonly unknown[] | null };
export function legeWaarde(status?: string): string {
  if (status === 'structuurniveau') return 'Niet van toepassing: structuurniveau zonder eigen selectiegegevens.';
  if (status === 'niet_van_toepassing_vervallen') return 'Niet van toepassing: vervallen resultaat.';
  if (status === 'geen_afzonderlijke_kolom_in_bron') return 'Geen afzonderlijke kolom in deze selectielijst.';
  if (status?.startsWith('raadpleeg_') || status === 'in_termijntekst_behouden') return 'Geen afzonderlijke bronwaarde. Raadpleeg de termijntekst, toelichting en algemene bepalingen.';
  if(status === 'onbekend' || status?.includes('te_beoordelen')) return 'Onbekend of nog te beoordelen.';
  return 'Niet afzonderlijk ingevuld in de bron.';
}
function veld(lijst: HTMLDListElement, label: string, waarde: string | null | undefined, status?: string) {
  lijst.append(element('dt', label), element('dd', waarde?.trim() ? waarde : legeWaarde(status), waarde == null ? 'ontbrekend' : 'brontekst'));
}
function link(tekst: string, url: URL): HTMLAnchorElement {
  const a = element('a', tekst);
  if (['http:', 'https:'].includes(url.protocol)) { a.href = url.href; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
  return a;
}
export function bronlocatie(dataset: Dataset, bron: Bron): HTMLElement {
  const blok = element('div', undefined, 'bronlocatie');
  const registratie = dataset.manifest.bronnenregister.find(b => b.id === bron.bron_id);
  blok.append(element('strong', bron.bron_id));
  const delen: string[] = [];
  if (bron.pdf_pagina !== undefined) delen.push(`Pagina ${bron.pdf_pagina}${bron.eindpagina && bron.eindpagina !== bron.pdf_pagina ? `–${bron.eindpagina}` : ''}`);
  if (bron.werkblad !== undefined) delen.push(`Werkblad ${bron.werkblad}`);
  if (bron.rij !== undefined) delen.push(`Rij ${bron.rij}`);
  if (bron.kolom !== undefined) delen.push(`Kolom ${bron.kolom}`);
  if (bron.kolommen?.length) delen.push(`Kolommen ${bron.kolommen.join(', ')}`);
  if (bron.functie) blok.append(element('p',`Bronfunctie: ${bron.functie}`));
  if (delen.length) blok.append(element('p', delen.join(' · ')));
  if (bron.bbox) blok.append(element('p', `Broncoördinaten: ${bron.bbox.join(', ')}`, 'broncoordinaten'));
  if (registratie) {
    if (bron.bron_id.endsWith('-officieel')) blok.prepend(element('p',dataset.manifest.officiele_titel));
    blok.append(element('p',`Bronregistratie: ${registratie.status}`,'hulptekst'));
    if (registratie.url) { blok.append(link('Bron raadplegen', new URL(registratie.url, document.baseURI)),element('p','Documentbrede bronlink; opent niet gegarandeerd de genoemde pagina.','hulptekst')); }
    else blok.append(element('p','Geen openbare documentlink geregistreerd; alleen bronmetadata beschikbaar.','hulptekst'));
    const manifestUrl = new URL(`./datasets/${dataset.id}/manifest.json`, document.baseURI);
    blok.append(link('Bronbeschrijving (metadata)', new URL(registratie.bestand, manifestUrl)));
  } else blok.append(element('p', 'Deze bronverwijzing ontbreekt in het bronnenregister.', 'melding fout'));
  return blok;
}
function bronbestand(dataset: Dataset, naam: string, tekst: string): HTMLAnchorElement {
  // Alleen vaste datasetbestanden, zonder een externe bron automatisch te downloaden.
  return link(tekst, new URL(`./datasets/${dataset.id}/${naam}`, document.baseURI));
}
export function toonDetails(container: HTMLElement, dataset: Dataset, id: string, selecteer: (id: string) => void): boolean {
  const structuur = dataset.structuuronderdeel(id);
  const regel = dataset.selectiegegeven(id);
  const pad = dataset.padNaar(id);
  container.replaceChildren();
  if ((!structuur && !regel) || !pad) {
    const fout = element('p', 'Dit onderdeel is niet gevonden in de gekozen selectielijst. Kies opnieuw een onderdeel.', 'melding fout');
    fout.setAttribute('role','alert'); container.append(fout); return false;
  }
  const nav = element('nav', undefined, 'broodkruimels'); nav.setAttribute('aria-label','Broodkruimelpad');
  const ol = element('ol');
  pad.forEach((stap,i) => {
    const n = stap.gegevens; const naam = 'benaming' in n ? n.benaming : n.officiele_benaming;
    const li = element('li');
    if (i === pad.length - 1) { li.textContent = n.code; li.setAttribute('aria-current','page'); }
    else li.append(knop(`${n.code} ${naam}`, () => selecteer(n.id)));
    ol.append(li);
  });
  nav.append(ol); container.append(nav);
  const type = structuur?.type ?? 'voorschrift';
  container.append(element('p', `Selectielijst ${lijstnamen[dataset.id]} · ${typenaam(type)}`, 'context'));
  const titel = element('h2', regel?.officiele_benaming ?? structuur?.benaming, 'detailtitel');
  titel.id = 'detailtitel'; titel.tabIndex = -1; container.append(titel);
  const code = element('p', undefined, 'officiele-code'); code.append(element('strong','Officiële code'), document.createTextNode(` ${regel?.code ?? structuur?.code}`));
  container.append(code);
  const ouder = dataset.ouder(id);
  if (ouder) container.append(knop(`Naar bovenliggend onderdeel: ${ouder.code} ${ouder.benaming}`, () => selecteer(ouder.id), 'bovenliggend'));
  const versie=element('details',undefined,'broncontext');versie.append(element('summary','Selectielijst, versie en vaststelling'),element('p',dataset.manifest.officiele_titel),element('p',`Vaststelling: ${dataset.manifest.vaststellingsgegevens.publicatie} · ${dataset.manifest.vaststellingsgegevens.datum} · ${dataset.manifest.vaststellingsgegevens.kenmerk}`),element('p',`Datasetversie: ${dataset.manifest.datasetversie}`));container.append(versie);
  if (regel) {
    kopieerknop(container,dataset,regel);
    if(regel.id!==regel.structuur_id){const regels=dataset.selectiegegevensBij(regel.structuur_id);container.append(element('p',`Afzonderlijk voorschrift ${regels.findIndex(r=>r.id===regel.id)+1} van ${regels.length} binnen rubriek ${regel.code}. Gedeelde broncellen en opsommingscontext blijven bepalend.`,'hulptekst'));}
    const dl = element('dl', undefined, 'gegevens');
    if(regel.officiele_omschrijving?.trim()) veld(dl,'Omschrijving',regel.officiele_omschrijving);
    if (regel.resultaattype !== null) veld(dl,'Resultaattype',regel.resultaattype);
    if (regel.generiek_specifiek !== null) veld(dl,'Generiek / specifiek',regel.generiek_specifiek);
    const duiding=regel.waardering.type==='vernietigen'?'Vernietigen':regel.waardering.type==='bewaren'?'Bewaren':undefined;
    veld(dl,'Waardering',regel.waardering.officiele_tekst ?? (duiding ? `${duiding} (volgens bronlegenda; geen afzonderlijke waarderingsletter in de bron).` : null));
    veld(dl,'Bewaartermijn',regel.bewaartermijn.officiele_tekst,regel.bewaartermijn.status);
    veld(dl,'Procestermijn',regel.procestermijn.officiele_tekst,regel.procestermijn.status);
    veld(dl,'Aanvangsmoment',regel.aanvangsmoment.officiele_tekst,regel.aanvangsmoment.status);
    if (regel.procesomschrijving !== null) veld(dl,'Procesomschrijving',regel.procesomschrijving);
    if (regel.procesobject !== null) veld(dl,'Procesobject',regel.procesobject);
    if(regel.toelichting?.trim()) veld(dl,'Toelichting',regel.toelichting);
    if(regel.herkomst_waardering) veld(dl,'Herkomst waardering',regel.herkomst_waardering);
    if(regel.taakvelden_brontekst) veld(dl,'Taakvelden',regel.taakvelden_brontekst);
    if(regel.officiele_bronrij.procestoelichting) veld(dl,'Procestoelichting',regel.officiele_bronrij.procestoelichting);
    if(regel.procestermijn.onderbouwing) veld(dl,'Onderbouwing procestermijn',regel.procestermijn.onderbouwing);
    if(regel.waardering.afleiding) veld(dl,'Duiding waardering volgens bronlegenda',regel.waardering.afleiding);
    veld(dl,'Uitzonderingen en verwijzingen',regel.uitzonderingen_en_verwijzingen.officiele_tekst,regel.uitzonderingen_en_verwijzingen.status);
    container.append(dl);
    if (regel.status === 'vervallen') container.append(element('p','Dit resultaat is vervallen volgens de dataset.','melding'));
    voorwaarden(container,dataset,regel);
    const annotaties = dataset.bronannotatiesBij(id);
    if (annotaties.length) {
      const sectie = element('section', undefined, 'annotaties'); sectie.append(element('h3','Bronannotaties'));
      for (const a of annotaties) {
        const artikel = element('article'); artikel.append(element('h4',`Bronannotatie bij ${a.code}`),element('p',a.bevinding,'brontekst'),element('p',a.verwerking,'brontekst'));
        for (const variant of a.bronvarianten) {
          artikel.append(element('p',`${variant.bron_id} · ${variant.betekenis}`),element('blockquote',variant.waarde ?? 'Geen tekstwaarde in deze bron.','brontekst'));
        }
        if (a.menselijke_bevestiging) artikel.append(element('p',`Menselijke bevestiging (${a.menselijke_bevestiging.datum}): ${a.menselijke_bevestiging.oordeel}. ${a.menselijke_bevestiging.scope}`));
        artikel.append(element('p','Een gecontroleerde transcriptie of menselijke bevestiging is geen officiële rectificatie.','hulptekst'));
        for(const b of a.aanvullende_bronnen)artikel.append(bronlocatie(dataset,b));
        artikel.append(bronlocatie(dataset,a.bron)); sectie.append(artikel);
      }
      container.append(sectie);
    }
  } else if (structuur) {
    container.append(bronContext(dataset,'bepalingen.json',undefined,b=>bronlocatie(dataset,b)));
    if(dataset.id==='1996-2012' && structuur.type==='rubriek')container.append(bronContext(dataset,'rubriekcontext.json',structuur.code,b=>bronlocatie(dataset,b)));
    if (structuur.toelichting) { const dl = element('dl',undefined,'gegevens'); veld(dl,'Toelichting',structuur.toelichting); container.append(dl); }
    const regels = dataset.selectiegegevensBij(id);
    if (regels.length) {
      container.append(element('h3','Afzonderlijke selectievoorschriften'),element('p','Kies een voorschrift om de bijbehorende selectiegegevens te raadplegen.'));
      const lijst = element('ul',undefined,'voorschriften');
      for (const r of regels) { const li=element('li'); li.append(knop(`${r.code} ${r.officiele_benaming}`,()=>selecteer(r.id)));lijst.append(li); }
      container.append(lijst);
    } else if (['rubriek','generiek_resultaat','specifiek_resultaat'].includes(structuur.type)) {
      const fout = element('p','Bij dit onderdeel ontbreken selectiegegevens. Raadpleeg de bron.','melding fout');fout.setAttribute('role','alert');container.append(fout);
    } else container.append(element('p','Dit is een structuurniveau. Kies een onderliggend onderdeel om selectiegegevens te raadplegen.','hulptekst'));
  }
  container.append(element('h3','Bronlocaties'));
  if (regel) {
    container.append(element('h4','Bron van de selectiegegevens'),bronlocatie(dataset,regel.bron));
    if(regel.aanvullende_bronnen.length)container.append(element('h4','Aanvullende bronnen'));
    for (const b of regel.aanvullende_bronnen) container.append(bronlocatie(dataset,b));
    if (regel.procestermijn.bron) container.append(element('h4','Bron procestermijn'),bronlocatie(dataset,regel.procestermijn.bron));
    if (regel.aanvangsmoment.bron) container.append(element('h4','Bron aanvangsmoment'),bronlocatie(dataset,regel.aanvangsmoment.bron));
  } else if (structuur) container.append(bronlocatie(dataset,structuur.bron));
  return true;
}
function voorwaarden(container: HTMLElement, dataset: Dataset, regel: Selectiegegeven) {
  const sectie = element('section'); sectie.append(element('h3','Voorwaarden en context'));
  const labels: Record<string,string> = { officiele_omschrijving:'omschrijving', procesomschrijving:'procesomschrijving', toelichting:'toelichting', broncontext:'rubriekcontext', algemene_bepalingen:'algemene bepalingen' };
  sectie.append(element('p',`Lees de voorwaarden in: ${regel.toepassingsvoorwaarden.bronvelden.map(f=>labels[f]??f).join(', ')}.`));
  sectie.append(bronContext(dataset,'bepalingen.json',undefined,b=>bronlocatie(dataset,b)));
  sectie.append(bronbestand(dataset,'bepalingen.json','Algemene bepalingen (bronbestand)'));
  if (regel.broncontext) sectie.append(bronContext(dataset,'rubriekcontext.json',regel.code,b=>bronlocatie(dataset,b)),bronbestand(dataset,'rubriekcontext.json', 'Rubriekcontext (bronbestand)'));
  if(regel.generiek_specifiek)sectie.append(element('p','Een specifiek resultaat is niet automatisch toepasselijk door verwantschap met een generiek resultaat. Beoordeel de officiële voorwaarden.','hulptekst'));
  container.append(sectie);
}

function kopieerknop(container: HTMLElement, dataset: Dataset, regel: Selectiegegeven) {
  const status=element('p',undefined,'kopieerstatus');status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true');
  const knopje=knop('Kopieer selectiegegevens',()=>{void kopieer();},'kopieerknop');
  let bezig=false;
  async function kopieer() {
    if(bezig)return;bezig=true;knopje.setAttribute('aria-disabled','true');status.textContent='Selectiegegevens kopiëren…';
    try { if(!navigator.clipboard?.writeText)throw Error('Geen klembord');await navigator.clipboard.writeText(selectieTekst(dataset,regel));status.textContent='Selectiegegevens gekopieerd.'; }
    catch { status.textContent='Kopiëren is niet gelukt. Controleer de klembordtoestemming van uw browser of selecteer en kopieer de tekst handmatig.'; }
    finally {bezig=false;knopje.removeAttribute('aria-disabled');}
  }
  container.append(knopje,status);
}
