import type { Dataset, Selectiegegeven } from '../gegevenslaag/index.js';
import { element, knop, lijstnamen, typenaam } from './dom.js';

type Bron = { readonly bron_id: string; readonly pdf_pagina?: number; readonly eindpagina?: number;
  readonly werkblad?: number | string; readonly rij?: number; readonly kolom?: string; readonly bbox?: readonly unknown[] | null };
function legeWaarde(status?: string): string {
  if (status === 'niet_van_toepassing_vervallen') return 'Niet van toepassing: vervallen resultaat.';
  if (status === 'geen_afzonderlijke_kolom_in_bron') return 'Geen afzonderlijke kolom in deze selectielijst.';
  if (status?.startsWith('raadpleeg_') || status === 'in_termijntekst_behouden') return 'Geen afzonderlijke bronwaarde. Raadpleeg de termijntekst, toelichting en algemene bepalingen.';
  return 'Niet afzonderlijk ingevuld in de bron.';
}
function veld(lijst: HTMLDListElement, label: string, waarde: string | null | undefined, status?: string) {
  lijst.append(element('dt', label), element('dd', waarde ?? legeWaarde(status), waarde == null ? 'ontbrekend' : 'brontekst'));
}
function link(tekst: string, url: URL): HTMLAnchorElement {
  const a = element('a', tekst);
  if (['http:', 'https:'].includes(url.protocol)) { a.href = url.href; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
  return a;
}
function bronlocatie(dataset: Dataset, bron: Bron): HTMLElement {
  const blok = element('div', undefined, 'bronlocatie');
  const registratie = dataset.manifest.bronnenregister.find(b => b.id === bron.bron_id);
  blok.append(element('strong', bron.bron_id));
  const delen: string[] = [];
  if (bron.pdf_pagina !== undefined) delen.push(`Pagina ${bron.pdf_pagina}${bron.eindpagina && bron.eindpagina !== bron.pdf_pagina ? `–${bron.eindpagina}` : ''}`);
  if (bron.werkblad !== undefined) delen.push(`Werkblad ${bron.werkblad}`);
  if (bron.rij !== undefined) delen.push(`Rij ${bron.rij}`);
  if (bron.kolom !== undefined) delen.push(`Kolom ${bron.kolom}`);
  if (delen.length) blok.append(element('p', delen.join(' · ')));
  if (bron.bbox) blok.append(element('p', `Broncoördinaten: ${bron.bbox.join(', ')}`, 'broncoordinaten'));
  if (registratie) {
    if (registratie.url) blok.append(link('Bron raadplegen', new URL(registratie.url, document.baseURI)));
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
  if (regel) {
    const dl = element('dl', undefined, 'gegevens');
    veld(dl,'Omschrijving',regel.officiele_omschrijving);
    if (regel.resultaattype !== null) veld(dl,'Resultaattype',regel.resultaattype);
    if (regel.generiek_specifiek !== null) veld(dl,'Generiek / specifiek',regel.generiek_specifiek);
    veld(dl,'Waardering',regel.waardering.officiele_tekst);
    veld(dl,'Bewaartermijn',regel.bewaartermijn.officiele_tekst,regel.bewaartermijn.status);
    veld(dl,'Procestermijn',regel.procestermijn.officiele_tekst,regel.procestermijn.status);
    veld(dl,'Aanvangsmoment',regel.aanvangsmoment.officiele_tekst,regel.aanvangsmoment.status);
    if (regel.procesomschrijving !== null) veld(dl,'Procesomschrijving',regel.procesomschrijving);
    if (regel.procesobject !== null) veld(dl,'Procesobject',regel.procesobject);
    veld(dl,'Toelichting',regel.toelichting);
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
          artikel.append(element('p',variant.betekenis),element('blockquote',variant.waarde ?? 'Geen tekstwaarde in deze bron.','brontekst'));
        }
        if (a.menselijke_bevestiging) artikel.append(element('p',`${a.menselijke_bevestiging.oordeel}. ${a.menselijke_bevestiging.scope}`));
        artikel.append(bronlocatie(dataset,a.bron)); sectie.append(artikel);
      }
      container.append(sectie);
    }
  } else if (structuur) {
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
    container.append(bronlocatie(dataset,regel.bron));
    for (const b of regel.aanvullende_bronnen) container.append(bronlocatie(dataset,b));
    if (regel.procestermijn.bron) container.append(bronlocatie(dataset,regel.procestermijn.bron));
    if (regel.aanvangsmoment.bron) container.append(bronlocatie(dataset,regel.aanvangsmoment.bron));
  } else if (structuur) container.append(bronlocatie(dataset,structuur.bron));
  return true;
}
function voorwaarden(container: HTMLElement, dataset: Dataset, regel: Selectiegegeven) {
  const sectie = element('section'); sectie.append(element('h3','Voorwaarden en context'));
  const labels: Record<string,string> = { officiele_omschrijving:'omschrijving', procesomschrijving:'procesomschrijving', toelichting:'toelichting', broncontext:'rubriekcontext', algemene_bepalingen:'algemene bepalingen' };
  sectie.append(element('p',`Lees de voorwaarden in: ${regel.toepassingsvoorwaarden.bronvelden.map(f=>labels[f]??f).join(', ')}.`));
  sectie.append(bronbestand(dataset,'bepalingen.json','Algemene bepalingen (bronbestand)'));
  if (regel.broncontext) sectie.append(bronbestand(dataset,'rubriekcontext.json', 'Rubriekcontext (bronbestand)'));
  container.append(sectie);
}
