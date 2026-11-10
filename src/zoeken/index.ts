import type { Dataset, SelectielijstId } from '../gegevenslaag/index.js';
import { normaliseer, zoekwoorden } from './normalisatie.js';
export { normaliseer, zoekwoorden, markeerbereiken } from './normalisatie.js';

export type Rang = 1 | 2 | 3 | 4 | 5;
export const RANGREDENEN: Readonly<Record<Rang, string>> = Object.freeze({
  1: 'Exacte officiële code', 2: 'Exacte officiële benaming',
  3: 'Woorden in benaming of omschrijving', 4: 'Woorden in toelichting',
  5: 'Overige of gedeeltelijke tekstovereenkomst',
});
interface Veld { readonly label: string; readonly tekst: string; readonly rol: 'naam' | 'omschrijving' | 'toelichting' | 'overig' }
interface GeindexeerdVeld extends Veld { readonly normaal: string; readonly woorden: ReadonlySet<string> }
export interface Zoekresultaat {
  readonly id: string;
  readonly selectielijst: SelectielijstId;
  readonly code: string;
  readonly benaming: string;
  readonly type: string;
  readonly context: string;
  readonly vervallen: boolean;
  readonly rang: Rang;
  readonly reden: string;
  readonly overeenkomstvelden: readonly string[];
  readonly fragment: { readonly veld: string; readonly tekst: string } | undefined;
}
interface Document {
  id: string; code: string; benaming: string; type: string; context: string; vervallen: boolean;
  velden: readonly GeindexeerdVeld[]; volgorde: number;
}
function codewaarde(tekst: string): string { return tekst.normalize('NFKC').trim().replace(/\s*\.\s*/gu, '.'); }
function woordtelling(velden: readonly GeindexeerdVeld[], woorden: readonly string[]): number {
  return woorden.filter(w => velden.some(v => v.woorden.has(w))).length;
}
/** Geen fetch, zoeklexicon, overerving of betekenisrelaties; uitsluitend officiële tekstvelden. */
export function maakZoekindex(dataset: Dataset) {
  const documenten: Document[] = [];
  // Algemene procesteksten worden één keer aan het werkelijke procestype gekoppeld.
  const procesteksten = new Map<string, Map<string, Veld>>();
  for (const regel of dataset.selectiegegevens) {
    const proces = dataset.padNaar(regel.id)?.find(s => s.soort === 'structuur' && s.gegevens.type === 'procestype');
    if (!proces) continue;
    const velden = procesteksten.get(proces.gegevens.id) ?? new Map<string, Veld>();
    for (const [label, tekst, rol] of [
      ['Procesomschrijving', regel.procesomschrijving, 'omschrijving'],
      ['Procesobject', regel.procesobject, 'overig'],
      ['Procesnaam (bronrij)', regel.officiele_bronrij.procesnaam, 'naam'],
    ] as const) if (tekst) velden.set(`${label}:${tekst}`, { label, tekst, rol });
    procesteksten.set(proces.gegevens.id, velden);
  }
  function toevoegen(id: string) {
    const node = dataset.structuuronderdeel(id); const regel = dataset.selectiegegeven(id);
    if (!node && !regel) throw new Error(`Zoekonderdeel ontbreekt: ${id}`);
    const benaming = regel?.officiele_benaming ?? node!.benaming;
    const velden: Veld[] = [{ label: 'Officiële benaming', tekst: benaming, rol: 'naam' }];
    function veld(label: string, tekst: string | null | undefined, rol: Veld['rol']) {
      if (tekst && !velden.some(v => v.tekst === tekst && v.rol === rol)) velden.push({ label, tekst, rol });
    }
    if (node) {
      veld('Structuurbenaming', node.benaming, 'naam');
      veld('Toelichting structuur', node.toelichting, 'toelichting');
    }
    if (regel) {
      veld('Omschrijving', regel.officiele_omschrijving, 'omschrijving');
      veld('Omschrijving (bronrij)', regel.officiele_bronrij.omschrijving, 'omschrijving');
      veld('Toelichting', regel.toelichting, 'toelichting');
      veld('Uitzonderingen en verwijzingen', regel.uitzonderingen_en_verwijzingen.officiele_tekst, 'toelichting');
      veld('Resultaattype', regel.resultaattype, 'overig');
      veld('Resultaattype (bronrij)', regel.officiele_bronrij.resultaat, 'overig');
    }
    for (const v of procesteksten.get(id)?.values() ?? []) veld(v.label, v.tekst, v.rol);
    const pad = dataset.padNaar(id);
    if (!pad) throw new Error(`Zoekpad ontbreekt: ${id}`);
    const context = pad.slice(0, -1).map(s => `${s.gegevens.code} ${s.soort === 'structuur' ? s.gegevens.benaming : s.gegevens.officiele_benaming}`).join(' / ');
    documenten.push({ id, code: regel?.code ?? node!.code, benaming, type: node?.type ?? 'voorschrift',
      context, vervallen: regel?.status === 'vervallen', volgorde: documenten.length,
      velden: velden.map(v => ({ ...v, normaal: normaliseer(v.tekst), woorden: new Set(zoekwoorden(v.tekst)) })),
    });
  }
  function bezoek(id: string) {
    toevoegen(id);
    for (const kind of dataset.kinderen(id)) bezoek(kind.id);
    for (const regel of dataset.selectiegegevensBij(id)) if (!dataset.structuuronderdeel(regel.id)) toevoegen(regel.id);
  }
  for (const root of dataset.hoofdonderdelen()) bezoek(root.id);
  return Object.freeze({
    selectielijst: dataset.id,
    zoek(vraag: string, opties: { vervallenMeenemen?: boolean } = {}): readonly Zoekresultaat[] {
      const query = normaliseer(vraag); const woorden = zoekwoorden(vraag);
      if (!query) return [];
      const code = codewaarde(vraag); const codevraag = /^\d+(?:\.\d+)*$/u.test(code);
      const gevonden: { resultaat: Zoekresultaat; naamwoorden: number; omschrijvingswoorden: number; volgorde: number }[] = [];
      for (const doc of documenten) {
        if (doc.vervallen && !opties.vervallenMeenemen) continue;
        const exactCode = code === codewaarde(doc.code);
        if (codevraag ? !exactCode && !doc.code.startsWith(`${code}.`) : !woorden.every(w => doc.velden.some(v => v.normaal.includes(w)))) continue;
        const namen = doc.velden.filter(v => v.rol === 'naam');
        const primair = doc.velden.filter(v => v.rol === 'naam' || v.rol === 'omschrijving');
        const toelichtingen = doc.velden.filter(v => v.rol === 'toelichting');
        const exactNaam = namen.some(v => v.normaal === query);
        const naamwoorden = woordtelling(namen, woorden);
        const omschrijvingswoorden = woordtelling(doc.velden.filter(v => v.rol === 'omschrijving'), woorden);
        const rang: Rang = exactCode ? 1 : exactNaam ? 2 : codevraag ? 5 :
          woordtelling(primair, woorden) === woorden.length ? 3 :
          woordtelling(doc.velden, woorden) === woorden.length && woordtelling(toelichtingen, woorden) > 0 ? 4 : 5;
        const matches = doc.velden.filter(v => woorden.some(w => v.normaal.includes(w)));
        const snippet = matches.find(v => v.rol !== 'naam') ?? matches[0];
        gevonden.push({ naamwoorden, omschrijvingswoorden, volgorde: doc.volgorde, resultaat: Object.freeze({
          id: doc.id, selectielijst: dataset.id, code: doc.code, benaming: doc.benaming, type: doc.type,
          context: doc.context, vervallen: doc.vervallen, rang, reden: RANGREDENEN[rang],
          overeenkomstvelden: Object.freeze(matches.map(v => v.label)),
          fragment: snippet ? Object.freeze({ veld: snippet.label, tekst: snippet.tekst }) : undefined,
        }) });
      }
      gevonden.sort((a, b) => a.resultaat.rang - b.resultaat.rang ||
        (codevraag ? 0 : b.naamwoorden - a.naamwoorden || b.omschrijvingswoorden - a.omschrijvingswoorden) || a.volgorde - b.volgorde);
      return Object.freeze(gevonden.map(g => g.resultaat));
    },
  });
}
