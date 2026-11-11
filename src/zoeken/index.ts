import type { Dataset, SelectielijstId } from '../gegevenslaag/index.js';
import { analyseerVraag, woordstam, pastPolariteit, BREDE_TERMEN, NEGATIES } from './vraag.js';
import { normaliseer, zoekwoorden } from './normalisatie.js';
export { normaliseer, zoekwoorden } from './normalisatie.js';
export { analyseerVraag, pastPolariteit, BREDE_TERMEN } from './vraag.js';
import { markeerbereiken as bronMarkering } from './normalisatie.js';
export function markeerbereiken(tekst: string, vraag: string) { return bronMarkering(tekst, analyseerVraag(vraag).woorden.join(' ')); }

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
  velden: readonly GeindexeerdVeld[]; volgorde: number; contextNormaal: string; labels: readonly string[];
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
      context, contextNormaal: normaliseer(context), labels: [benaming, regel?.resultaattype ?? ''], vervallen: regel?.status === 'vervallen', volgorde: documenten.length,
      velden: velden.map(v => ({ ...v, normaal: normaliseer(v.tekst), woorden: new Set(zoekwoorden(v.tekst)) })),
    });
  }
  function bezoek(id: string) {
    toevoegen(id);
    for (const kind of dataset.kinderen(id)) bezoek(kind.id);
    for (const regel of dataset.selectiegegevensBij(id)) if (!dataset.structuuronderdeel(regel.id)) toevoegen(regel.id);
  }
  for (const root of dataset.hoofdonderdelen()) bezoek(root.id);
  const vocabulaire = new Set(documenten.flatMap(d => d.velden.flatMap(v => [...v.woorden])));
  const splitsingen = new Map<string, readonly [string,string][]>();
  function splits(woord: string): readonly [string,string][] {
    const oud = splitsingen.get(woord); if (oud) return oud;
    const opties: [string,string][] = [];
    if (woord.length >= 10) for (let i=4;i<=woord.length-4;i++) {
      const a=woord.slice(0,i),b=woord.slice(i);
      if(vocabulaire.has(a)&&vocabulaire.has(b))opties.push([a,b]);
    }
    splitsingen.set(woord,opties);return opties;
  }
  const tekstvormen = new Map<string,{stammen:Set<string>;aaneen:Set<string>;tokens:string[]}>();
  for(const tekst of documenten.flatMap(d=>[d.contextNormaal,...d.velden.map(v=>v.normaal)]))if(!tekstvormen.has(tekst)){
    const tokens=tekst.split(' ');tekstvormen.set(tekst,{tokens,stammen:new Set(tokens.map(woordstam)),
      aaneen:new Set(tokens.flatMap((_,i)=>[tokens.slice(i,i+2).join(''),tokens.slice(i,i+3).join('')]))});
  }
  function match(woord: string, tekst: string): boolean {
    if(tekst.includes(woord))return true;
    const vormen=tekstvormen.get(tekst)!,tokens=vormen.tokens,stam=woordstam(woord);
    if(stam.length>=4&&vormen.stammen.has(stam))return true;
    // Alleen tekstueel aangrenzende bronstukken verbinden; geen betekenisrelatie.
    if(woord.length>=8&&vormen.aaneen.has(woord))return true;
    return splits(woord).some(([a,b])=>tokens.some(t=>t.includes(a))&&tokens.some(t=>t.includes(b)));
  }
  return Object.freeze({
    selectielijst: dataset.id,
    zoek(vraag: string, opties: { vervallenMeenemen?: boolean } = {}): readonly Zoekresultaat[] {
      const analyse = analyseerVraag(vraag); const query = analyse.normaal; const woorden = analyse.woorden;
      if (!query) return [];
      if(!woorden.length||woorden.every(w=>NEGATIES.has(w)))return [];
      const code = codewaarde(vraag); const codevraag = /^\d+(?:\.\d+)*$/u.test(code);
      const gevonden: { resultaat: Zoekresultaat; naamwoorden: number; omschrijvingswoorden: number; volgorde: number }[] = [];
      for (const doc of documenten) {
        if (doc.vervallen && !opties.vervallenMeenemen) continue;
        const exactCode = code === codewaarde(doc.code);
        const exactNaamBron = doc.velden.some(v=>v.rol==='naam'&&v.normaal===query);
        const eigen = (w: string) => doc.velden.some(v=>match(w,v.normaal));
        const contextAnker = woorden.some(w=>!BREDE_TERMEN.has(w)&&!NEGATIES.has(w)&&eigen(w));
        const contextMatch = (w: string) => contextAnker&&match(w,doc.contextNormaal);
        const breedAlleen = woorden.every(w=>BREDE_TERMEN.has(w));
        if (codevraag ? !exactCode && !doc.code.startsWith(`${code}.`) :
          !exactNaamBron && !woorden.every(w=>eigen(w)||contextMatch(w))) continue;
        if(!codevraag&&!pastPolariteit(vraag,doc.labels,doc.velden.map(v=>v.tekst)))continue;
        if(!codevraag&&breedAlleen&&!doc.velden.some(v=>(v.rol==='naam'||v.rol==='omschrijving')&&woorden.every(w=>[...v.woorden].some(t=>t===w||woordstam(t)===woordstam(w)||t.endsWith(w)))))continue;
        const namen = doc.velden.filter(v => v.rol === 'naam');
        const primair = doc.velden.filter(v => v.rol === 'naam' || v.rol === 'omschrijving');
        const toelichtingen = doc.velden.filter(v => v.rol === 'toelichting');
        const exactNaam = namen.some(v => v.normaal === query);
        const naamwoorden = woordtelling(namen, woorden);
        const omschrijvingswoorden = woordtelling(doc.velden.filter(v => v.rol === 'omschrijving'), woorden);
        const rang: Rang = exactCode ? 1 : exactNaam ? 2 : codevraag ? 5 :
          woordtelling(primair, woorden) === woorden.length ? 3 :
          woordtelling(doc.velden, woorden) === woorden.length && woordtelling(toelichtingen, woorden) > 0 ? 4 : 5;
        const matches = doc.velden.filter(v => woorden.some(w => match(w,v.normaal)));
        const viaContext = !woorden.every(eigen);
        const snippet = matches.find(v => v.rol !== 'naam') ?? matches[0];
        gevonden.push({ naamwoorden, omschrijvingswoorden, volgorde: doc.volgorde, resultaat: Object.freeze({
          id: doc.id, selectielijst: dataset.id, code: doc.code, benaming: doc.benaming, type: doc.type,
          context: doc.context, vervallen: doc.vervallen, rang, reden: RANGREDENEN[rang],
          overeenkomstvelden: Object.freeze([...matches.map(v => v.label), ...(viaContext?['Bovenliggende benaming (naast eigen tekst)']:[])]),
          fragment: snippet ? Object.freeze({ veld: snippet.label, tekst: snippet.tekst }) : undefined,
        }) });
      }
      gevonden.sort((a, b) => a.resultaat.rang - b.resultaat.rang ||
        (codevraag ? 0 : b.naamwoorden - a.naamwoorden || b.omschrijvingswoorden - a.omschrijvingswoorden) || a.volgorde - b.volgorde);
      return Object.freeze(gevonden.map(g => g.resultaat));
    },
  });
}
