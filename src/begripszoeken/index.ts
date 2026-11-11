import type { Dataset, Zoekterm, Betekenisrelatie, Zoekverrijking } from '../gegevenslaag/index.js';
import { BREDE_TERMEN, NEGATIES, analyseerVraag, pastPolariteit } from '../zoeken/vraag.js';
import { maakZoekindex, normaliseer } from '../zoeken/index.js';
import type { Zoekresultaat } from '../zoeken/index.js';

export interface Verklaring {
  readonly soort: 'officiele_tekst' | 'lexicon';
  readonly reden: string;
  readonly prioriteit: number;
  readonly onbevestigd: boolean;
  readonly term?: Zoekterm;
  readonly relatie?: Betekenisrelatie;
}
export interface Begripsresultaat extends Zoekresultaat {
  readonly begripsrang: number;
  readonly verklaringen: readonly Verklaring[];
  readonly onbevestigd: boolean;
}
const STOPWOORDEN = new Set('de het een en of van voor met in op aan bij om te is zijn ik we waar hoe welke wat'.split(' '));
const LABELS: Readonly<Record<string, string>> = Object.freeze({
  officiele_benaming: 'Officiële benaming', letterlijk_fragment: 'Letterlijk officieel tekstfragment',
  afkorting: 'Afkorting', afkorting_voluit: 'Voluit geschreven afkorting',
  historische_benaming: 'Historische benaming', spellingvariant: 'Schrijfvariant',
  verwant_begrip: 'Brononderbouwd verwant begrip', praktijkformulering: 'Beoordeelde AI-zoekrichting',
  verwant_begrip_voorstel: 'Onbevestigde AI-zoekterm',
});
/** Toelating is een expliciete combinatie van herkomst, type én beoordelingsstatus. */
export function toelating(herkomst: string, status: string, type: string, onbevestigd: boolean): number | undefined {
  if (herkomst === 'officieel' && status === 'brongetoetst' && ['officiele_benaming', 'letterlijk_fragment'].includes(type)) return 1;
  if (herkomst === 'brononderbouwd_alternatief' && status === 'brononderbouwd_gecontroleerd') {
    if (type === 'historische_benaming') return 2;
    if (['afkorting', 'afkorting_voluit'].includes(type)) return 3;
    if (type === 'verwant_begrip') return 5;
  }
  if (herkomst === 'taalkundige_variant' && status === 'mechanisch_gecontroleerd' && type === 'spellingvariant') return 3;
  if (herkomst === 'ai_voorgesteld') {
    if (status === 'voorstel_inhoudelijk_beoordeeld_zoekrichting' && type === 'praktijkformulering') return 5;
    if (onbevestigd && status === 'voorstel_niet_activeren' && type === 'verwant_begrip_voorstel') return 6;
  }
  return undefined; // Onbekende statussen/types nooit op basis van een score toelaten.
}

export function maakBegripsindex(dataset: Dataset, verrijking: Zoekverrijking) {
  if (dataset.id !== verrijking.selectielijst) throw new Error('Zoekverrijking behoort tot een andere selectielijst.');
  const bestaat = (id: string) => id.startsWith(`${dataset.id}:`) && !!(dataset.structuuronderdeel(id) || dataset.selectiegegeven(id));
  const termen = new Map(verrijking.zoeklexicon.map(t => [t.id, t]));
  if (termen.size !== verrijking.zoeklexicon.length) throw new Error('Dubbele zoekterm-ID.');
  for (const t of termen.values()) if (!t.id.startsWith(`${dataset.id}:`) || !bestaat(t.onderdeel_id)) throw new Error('Ongeldige zoektermverwijzing.');
  const verbindingen = verrijking.relaties.map(r => {
    if (!r.id.startsWith(`${dataset.id}:`) || !bestaat(r.naar)) throw new Error('Ongeldige betekenisverwijzing.');
    if (r.van_type === 'onderdeel' && !bestaat(r.van)) throw new Error('Ongeldige structurele verwijzing.');
    if (r.van_type === 'zoekterm' && !termen.has(r.van)) throw new Error('Vertrekkende zoekterm ontbreekt.');
    const t = termen.get(r.van);
    return { relatie: r, term: t, normaal: t ? normaliseer(t.zoekterm) : '' };
  });
  const klassiek = maakZoekindex(dataset);
  const volgorde = new Map<string, number>();
  function bezoek(id: string) {
    volgorde.set(id, volgorde.size);
    for (const kind of dataset.kinderen(id)) bezoek(kind.id);
    for (const regel of dataset.selectiegegevensBij(id)) if (!dataset.structuuronderdeel(regel.id)) volgorde.set(regel.id, volgorde.size);
  }
  for (const root of dataset.hoofdonderdelen()) bezoek(root.id);
  function basis(id: string): Zoekresultaat {
    const node = dataset.structuuronderdeel(id); const regel = dataset.selectiegegeven(id);
    const context = dataset.padNaar(id)!.slice(0, -1).map(s => `${s.gegevens.code} ${s.soort === 'structuur' ? s.gegevens.benaming : s.gegevens.officiele_benaming}`).join(' / ');
    return { id, selectielijst: dataset.id, code: regel?.code ?? node!.code, benaming: regel?.officiele_benaming ?? node!.benaming,
      type: node?.type ?? 'voorschrift', context, vervallen: regel?.status === 'vervallen', rang: 5,
      reden: '', overeenkomstvelden: [], fragment: undefined };
  }
  return Object.freeze({
    selectielijst: dataset.id,
    zoek(vraag: string, opties: { onbevestigdeAi?: boolean; vervallenMeenemen?: boolean; beoordeeldeAi?: boolean } = {}): readonly Begripsresultaat[] {
      const vraagAnalyse = analyseerVraag(vraag);
      const query = vraagAnalyse.normaal;
      const vraagMetGrenzen = ` ${query} `;
      if (!query) return [];
      const dekking = (tekst: string) => new Set(normaliseer(tekst).split(' ').filter(w => w && !STOPWOORDEN.has(w))).size;
      const gevonden = new Map<string, { basis: Zoekresultaat; verklaringen: Verklaring[]; specificiteit: number; dekking: number; klassiek: number }>();
      const direct = klassiek.zoek(vraag, { vervallenMeenemen: opties.vervallenMeenemen ?? false });
      direct.forEach((r, i) => gevonden.set(r.id, { basis: r, specificiteit: 0, dekking: vraagAnalyse.woorden.filter(w=>!STOPWOORDEN.has(w)).length, klassiek: i, verklaringen: [{
        soort: 'officiele_tekst', reden: r.reden, prioriteit: r.rang <= 2 ? 1 : r.rang === 3 ? 3 : 5, onbevestigd: false,
      }] }));
      for (const { term, relatie, normaal } of verbindingen) {
        // Één gerichte stap. Structurele ouders, omgekeerde kanten en relatieketens zijn uitgesloten.
        if (!term || relatie.van_type !== 'zoekterm' || relatie.naar_type !== 'onderdeel' ||
            relatie.richting !== 'zoekterm_naar_onderdeel' || relatie.naar !== term.onderdeel_id ||
            relatie.type !== term.relatietype || relatie.herkomsttype !== term.herkomsttype ||
            relatie.juridische_gelijkwaardigheid !== false || term.juridische_gelijkwaardigheid !== false) continue;
        if (!normaal || !vraagMetGrenzen.includes(` ${normaal} `)) continue;
        if (normaal.replace(/\s/g, '').length < 3 && !['afkorting', 'afkorting_voluit'].includes(relatie.type)) continue;
        if (normaal.split(' ').every(w => STOPWOORDEN.has(w))) continue;
        if (NEGATIES.has(normaal)) continue;
        if (BREDE_TERMEN.has(normaal) && query !== normaal) continue;
        // Bij een ontkennende vraag mag een losse positieve term de negatie niet wegdrukken.
        if (vraagAnalyse.negaties.some(w=>!normaal.split(' ').includes(w)))continue;
        const doel=dataset.selectiegegeven(relatie.naar),node=dataset.structuuronderdeel(relatie.naar);
        if(!pastPolariteit(vraag,[doel?.officiele_benaming??node?.benaming??'',doel?.resultaattype??'']))continue;
        if(opties.beoordeeldeAi===false&&term.herkomsttype==='ai_voorgesteld'&&term.beoordelingsstatus==='voorstel_inhoudelijk_beoordeeld_zoekrichting')continue;
        const a = toelating(term.herkomsttype, term.beoordelingsstatus, term.relatietype, opties.onbevestigdeAi ?? false);
        const b = toelating(relatie.herkomsttype, relatie.status, relatie.type, opties.onbevestigdeAi ?? false);
        if (a === undefined || b === undefined) continue;
        const ongetoetst = a === 6 || b === 6;
        let prioriteit = Math.max(a, b);
        // Een ingebed officieel fragment is minder specifiek dan een exacte benaming.
        if (prioriteit === 1 && normaal !== query) prioriteit = 3;
        const r = gevonden.get(relatie.naar) ?? { basis: basis(relatie.naar), verklaringen: [], specificiteit: 0, dekking: 0, klassiek: Number.MAX_SAFE_INTEGER };
        if (r.basis.vervallen && !opties.vervallenMeenemen) continue;
        const beste = r.verklaringen.length ? Math.min(...r.verklaringen.map(v => v.prioriteit)) : Infinity;
        r.verklaringen.push({ soort: 'lexicon', term, relatie, prioriteit, onbevestigd: ongetoetst,
          reden: `${LABELS[relatie.type]}: “${term.zoekterm}”` });
        if (prioriteit < beste) { r.specificiteit = normaal.length; r.dekking = dekking(normaal); }
        else if (prioriteit === beste) {
          r.specificiteit = Math.max(r.specificiteit, normaal.length);
          r.dekking = Math.max(r.dekking, dekking(normaal));
        }
        gevonden.set(relatie.naar, r);
      }
      const items = Array.from(gevonden.values()).map(r => {
        r.verklaringen.sort((a, b) => a.prioriteit - b.prioriteit);
        const eerste = r.verklaringen[0]!;
        const lex = r.verklaringen.find(v => v.term)?.term;
        const resultaat: Begripsresultaat = Object.freeze({ ...r.basis, reden: eerste.reden, begripsrang: eerste.prioriteit,
          verklaringen: Object.freeze(r.verklaringen.map(v => Object.freeze(v))),
          onbevestigd: r.verklaringen.some(v => v.onbevestigd),
          fragment: r.basis.fragment ?? (lex ? { veld: 'Gevonden zoekterm', tekst: lex.zoekterm } : undefined),
        });
        return { resultaat, specificiteit: r.specificiteit, dekking: r.dekking, klassiek: r.klassiek };
      });
      items.sort((a, b) => a.resultaat.begripsrang - b.resultaat.begripsrang || b.dekking - a.dekking || b.specificiteit - a.specificiteit ||
        a.klassiek - b.klassiek || volgorde.get(a.resultaat.id)! - volgorde.get(b.resultaat.id)!);
      return Object.freeze(items.map(i => i.resultaat));
    },
  });
}
