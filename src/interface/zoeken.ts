import type { Dataset } from '../gegevenslaag/index.js';
import { maakZoekindex, markeerbereiken, normaliseer } from '../zoeken/index.js';
import type { Zoekresultaat } from '../zoeken/index.js';
import { element, knop, typenaam } from './dom.js';

/** Markering bestaat uitsluitend uit tekstnodes en <mark>, nooit uit HTML-brondata. */
function gemarkeerd(tekst: string, vraag: string, fragment = false): DocumentFragment {
  const node = document.createDocumentFragment();
  const bereiken = markeerbereiken(tekst, vraag);
  let start = fragment ? Math.max(0, (bereiken[0]?.begin ?? 0) - 55) : 0;
  if (start > 0 && /[\uDC00-\uDFFF]/u.test(tekst[start] ?? '')) start--;
  let einde = fragment ? Math.min(tekst.length, start + 260) : tekst.length;
  // Knip nooit midden door een Unicode-surrogaatpaar of een gemarkeerd woord.
  if (einde < tekst.length && /[\uDC00-\uDFFF]/u.test(tekst[einde] ?? '')) einde++;
  for (const b of bereiken) if (b.begin < einde && b.einde > einde) einde = b.einde;
  let cursor = start;
  if (start) node.append('…');
  for (const b of bereiken) {
    if (b.einde <= start || b.begin >= einde) continue;
    node.append(tekst.slice(cursor, b.begin), element('mark', tekst.slice(b.begin, b.einde)));
    cursor = b.einde;
  }
  node.append(tekst.slice(cursor, einde));
  if (einde < tekst.length) node.append('…');
  return node;
}

export function maakZoekpaneel(selecteer: (id: string) => void) {
  const paneel = element('section', undefined, 'zoekpaneel'); paneel.setAttribute('aria-label', 'Klassiek trefwoordzoeken');
  const form = element('form'); form.setAttribute('role', 'search'); form.setAttribute('aria-label', 'Zoeken in de gekozen selectielijst');
  const velden = element('fieldset'); velden.disabled = true;
  const label = element('label', 'Trefwoordzoeken'); label.htmlFor = 'zoekopdracht';
  const invoer = element('input'); invoer.type = 'search'; invoer.id = 'zoekopdracht'; invoer.autocomplete = 'off';
  invoer.setAttribute('aria-describedby', 'zoekhulp');
  const hulp = element('p', 'Zoek op officiële code of tekst. Vraagwoorden tellen niet mee; inhoudelijke zoekwoorden worden gecombineerd.', 'zoekhulp'); hulp.id = 'zoekhulp';
  const acties = element('div', undefined, 'zoekacties');
  const submit = element('button', 'Zoeken'); submit.type = 'submit';
  const wissen = knop('Wissen', () => { invoer.value = ''; resetResultaten(); invoer.focus(); });
  acties.append(submit, wissen);
  const filterLabel = element('label', undefined, 'zoekfilter');
  const filter = element('input'); filter.type = 'checkbox';
  filterLabel.append(filter, document.createTextNode('Vervallen resultaten meenemen'));
  velden.append(label, invoer, hulp, acties, filterLabel); form.append(velden);
  const status = element('p', 'Kies eerst een selectielijst om te zoeken.', 'zoekstatus'); status.setAttribute('aria-live', 'polite');
  const fout = element('p', undefined, 'melding fout'); fout.setAttribute('role', 'alert'); fout.hidden = true;
  const resultaten = element('section', undefined, 'zoekresultaten'); resultaten.hidden = true;
  const kop = element('h2', 'Zoekresultaten'); kop.id = 'zoekresultatenkop'; resultaten.setAttribute('aria-labelledby', kop.id);
  const lijst = element('ol'); lijst.setAttribute('aria-label', 'Gevonden onderdelen');
  const meer = knop('Meer resultaten tonen', () => toonVolgende()); meer.hidden = true;
  resultaten.append(kop, lijst, meer); paneel.append(form, status, fout, resultaten);
  const cache = new WeakMap<Dataset, ReturnType<typeof maakZoekindex>>();
  let dataset: Dataset | undefined;
  let index: ReturnType<typeof maakZoekindex> | undefined;
  let gevonden: readonly Zoekresultaat[] = [];
  let getoond = 0; let vraag = '';
  function resetResultaten() {
    gevonden = []; getoond = 0; vraag = ''; lijst.replaceChildren(); resultaten.hidden = true; meer.hidden = true; fout.hidden = true;
    status.textContent = dataset ? 'Voer een officiële code of trefwoorden in.' : 'Kies eerst een selectielijst om te zoeken.';
  }
  function toonVolgende() {
    for (const r of gevonden.slice(getoond, getoond + 25)) {
      const li = element('li'); li.dataset.zoekresultaat = r.id;
      const button = knop('', () => selecteer(r.id), 'zoekresultaatknop');
      const code = element('span', undefined, 'resultaatcode'); code.append(gemarkeerd(r.code, vraag));
      const naam = element('span'); naam.append(gemarkeerd(r.benaming, vraag)); button.append(code, document.createTextNode(' '), naam);
      li.append(button, element('p', `${typenaam(r.type)}${r.vervallen ? ' · Vervallen' : ''}`, 'resultaattype'));
      if (r.context) li.append(element('p', r.context, 'resultaatcontext'));
      if (r.fragment && r.fragment.tekst !== r.benaming) {
        const snippet = element('p', undefined, 'resultaatfragment'); snippet.append(gemarkeerd(r.fragment.tekst, vraag, true)); li.append(snippet);
      }
      li.append(element('p', r.reden, 'resultaatreden')); lijst.append(li);
    }
    getoond = Math.min(gevonden.length, getoond + 25);
    meer.hidden = getoond >= gevonden.length;
    meer.textContent = `Meer resultaten tonen (${getoond} van ${gevonden.length} getoond)`;
  }
  function zoek() {
    if (!dataset) return;
    fout.hidden = true; lijst.replaceChildren(); resultaten.hidden = true; meer.hidden = true;
    vraag = invoer.value; getoond = 0;
    try {
      if (!normaliseer(vraag)) { resetResultaten(); return; }
      index ??= maakZoekindex(dataset); cache.set(dataset, index);
      gevonden = index.zoek(vraag, { vervallenMeenemen: filter.checked });
      const aantal = gevonden.length;
      status.textContent = `${aantal} ${aantal === 1 ? 'resultaat' : 'resultaten'} voor “${vraag.trim()}”. ${filter.checked ? 'Vervallen resultaten inbegrepen.' : 'Vervallen resultaten uitgesloten.'}${aantal ? '' : ' Probeer een andere officiële code of andere trefwoorden.'}`;
      resultaten.hidden = aantal === 0; toonVolgende();
    } catch {
      gevonden = []; status.textContent = 'Zoeken is niet gelukt.';
      fout.textContent = 'Er is een technische fout opgetreden tijdens het zoeken. Probeer opnieuw of gebruik de boomstructuur.'; fout.hidden = false;
    }
  }
  form.addEventListener('submit', event => { event.preventDefault(); zoek(); });
  filter.addEventListener('change', () => { if (invoer.value.trim()) zoek(); });
  // Verberg verouderde resultaten zodra de zichtbare opdracht verandert; geen impliciet live zoeken.
  invoer.addEventListener('input', resetResultaten);
  return {
    element: paneel,
    koppel(nieuw: Dataset | undefined) {
      dataset = nieuw; index = nieuw ? cache.get(nieuw) : undefined;
      invoer.value = ''; filter.checked = false; velden.disabled = !nieuw; resetResultaten();
    },
  };
}
