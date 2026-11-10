import { manifest as manifestvalidatie, structuur as structuurvalidatie, selectiegegevens as selectievalidatie } from '#dataset-validatie';
import type { Validatie } from './validatie.js';
import type { Datasetmanifest, Selectiegegeven, SelectielijstId, Structuuronderdeel } from './typen.js';
export type * from './typen.js';

export const SELECTIELIJSTEN = Object.freeze(['1996-2012', '2017', '2020'] as const);
export type Foutcode = 'ONBEKENDE_LIJST' | 'LADEN_MISLUKT' | 'ONGELDIGE_JSON' |
  'SCHEMAFOUT' | 'DUBBELE_ID' | 'ONGELDIGE_VERWIJZING' | 'CYCLUS' | 'MANIFESTFOUT';

export class Gegevensfout extends Error {
  constructor(public readonly code: Foutcode, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'Gegevensfout';
  }
}

// Alleen de benodigde Response-eigenschappen; tests kunnen lokale JSON aanbieden.
export type Ophalen = (url: URL) => Promise<Pick<Response, 'ok' | 'status' | 'json'>>;
export type Bronannotatie = NonNullable<Selectiegegeven['verificatie']['bronannotaties']>[number];
export type Padonderdeel =
  | { readonly soort: 'structuur'; readonly gegevens: Structuuronderdeel }
  | { readonly soort: 'voorschrift'; readonly gegevens: Selectiegegeven };

function lijstId(id: string): asserts id is SelectielijstId {
  if (!(SELECTIELIJSTEN as readonly string[]).includes(id)) {
    throw new Gegevensfout('ONBEKENDE_LIJST', `Onbekende selectielijst: ${id}`);
  }
}

function valideer<T>(controle: Validatie<T>, data: unknown, bestand: string): T {
  if (!controle(data)) {
    const fouten = controle.errors?.slice(0, 5).map(e => `${e.instancePath || '/'} ${e.message}`).join('; ');
    throw new Gegevensfout('SCHEMAFOUT', `${bestand}: ${fouten}`);
  }
  return data;
}

function bevries<T>(data: T): T {
  if (data !== null && typeof data === 'object' && !Object.isFrozen(data)) {
    for (const value of Object.values(data)) bevries(value);
    Object.freeze(data);
  }
  return data;
}

function verwijzing(id: string, lijst: SelectielijstId): void {
  if (!id.startsWith(`${lijst}:`) || id.length === lijst.length + 1) {
    throw new Gegevensfout('ONGELDIGE_VERWIJZING', `ID ${id} behoort niet tot ${lijst}`);
  }
}
function indexeer<T extends { readonly id: string }>(regels: readonly T[], lijst: SelectielijstId): Map<string, T> {
  const index = new Map<string, T>();
  for (const regel of regels) {
    verwijzing(regel.id, lijst);
    if (index.has(regel.id)) throw new Gegevensfout('DUBBELE_ID', `Dubbele ID: ${regel.id}`);
    index.set(regel.id, regel);
  }
  return index;
}

/** Indexen verwijzen naar ongewijzigde, diep bevroren JSON-records. */
class Dataset {
  readonly #structuur: Map<string, Structuuronderdeel>;
  readonly #selectie: Map<string, Selectiegegeven>;
  readonly #kinderen = new Map<string | null, readonly Structuuronderdeel[]>();
  readonly #regels = new Map<string, readonly Selectiegegeven[]>();

  // Gebruik maakGegevenslaag().laadDataset(): deze constructor verwacht gevalideerde schema's.
  constructor(
    public readonly id: SelectielijstId,
    public readonly manifest: Datasetmanifest,
    public readonly structuur: readonly Structuuronderdeel[],
    public readonly selectiegegevens: readonly Selectiegegeven[],
  ) {
    this.#structuur = indexeer(structuur, id);
    this.#selectie = indexeer(selectiegegevens, id);
    for (const node of structuur) {
      if (node.parent_id !== null) this.#vereisStructuur(node.parent_id);
    }
    // Iteratief: ook zeer diepe of cyclische invoer veroorzaakt geen recursie-overloop.
    const afgerond = new Set<string>();
    for (const node of structuur) {
      const keten = new Set<string>();
      let huidig: Structuuronderdeel | undefined = node;
      while (huidig && !afgerond.has(huidig.id)) {
        if (keten.has(huidig.id)) throw new Gegevensfout('CYCLUS', `Cyclische ouderketen bij ${huidig.id}`);
        keten.add(huidig.id);
        huidig = huidig.parent_id === null ? undefined : this.#structuur.get(huidig.parent_id);
      }
      for (const onderdeel of keten) afgerond.add(onderdeel);
    }
    // Sorteer alleen indexlijsten; wijzig nooit de volgorde van het bronbestand.
    for (const node of [...structuur].sort((a, b) => a.volgorde - b.volgorde)) {
      this.#kinderen.set(node.parent_id, [...(this.#kinderen.get(node.parent_id) ?? []), node]);
    }
    for (const regel of selectiegegevens) {
      const node = this.#vereisStructuur(regel.structuur_id);
      if (this.#structuur.has(regel.id) && regel.id !== node.id) {
        throw new Gegevensfout('ONGELDIGE_VERWIJZING', `Gedeelde ID ${regel.id} verwijst naar een ander onderdeel`);
      }
      const generiek = regel.procestermijn.generiek_resultaat_id;
      if (generiek !== undefined) this.#vereisStructuur(generiek);
      for (const annotatie of regel.verificatie.bronannotaties ?? []) {
        verwijzing(annotatie.id, id);
        if (annotatie.lijst !== id || annotatie.onderdeel_id !== regel.id) {
          throw new Gegevensfout('ONGELDIGE_VERWIJZING', `Bronannotatie bij ${regel.id} verwijst naar een ander onderdeel`);
        }
      }
      this.#regels.set(node.id, [...(this.#regels.get(node.id) ?? []), regel]);
    }
    if (manifest.selectielijst_id !== id || manifest.aantallen.structuuronderdelen !== structuur.length ||
        manifest.aantallen.selectievoorschriften_of_resultaatregels !== selectiegegevens.length) {
      throw new Gegevensfout('MANIFESTFOUT', `Manifest en geladen bestanden voor ${id} komen niet overeen`);
    }
    bevries(manifest);
    bevries(structuur);
    bevries(selectiegegevens);
    for (const lijst of this.#kinderen.values()) Object.freeze(lijst);
    for (const lijst of this.#regels.values()) Object.freeze(lijst);
    Object.freeze(this);
  }

  #vereisStructuur(id: string): Structuuronderdeel {
    verwijzing(id, this.id);
    const node = this.#structuur.get(id);
    if (!node) throw new Gegevensfout('ONGELDIGE_VERWIJZING', `Structuuronderdeel ontbreekt: ${id}`);
    return node;
  }

  structuuronderdeel(id: string): Structuuronderdeel | undefined { return this.#structuur.get(id); }
  selectiegegeven(id: string): Selectiegegeven | undefined { return this.#selectie.get(id); }
  hoofdonderdelen(): readonly Structuuronderdeel[] { return this.#kinderen.get(null) ?? LEEG; }
  kinderen(id: string): readonly Structuuronderdeel[] { return this.#kinderen.get(id) ?? LEEG; }
  selectiegegevensBij(id: string): readonly Selectiegegeven[] { return this.#regels.get(id) ?? LEEG; }
  structuurBijSelectiegegeven(id: string): Structuuronderdeel | undefined {
    const regel = this.#selectie.get(id);
    return regel ? this.#structuur.get(regel.structuur_id) : undefined;
  }
  bronannotatiesBij(id: string): readonly Bronannotatie[] {
    return this.#selectie.get(id)?.verificatie.bronannotaties ?? LEEG;
  }
  ouder(id: string): Structuuronderdeel | null | undefined {
    const node = this.#structuur.get(id);
    if (node) return node.parent_id === null ? null : this.#structuur.get(node.parent_id);
    return this.structuurBijSelectiegegeven(id);
  }
  padNaar(id: string): readonly Padonderdeel[] | undefined {
    const node = this.#structuur.get(id);
    const regel = this.#selectie.get(id);
    if (!node && !regel) return undefined;
    const pad: Padonderdeel[] = [];
    if (!node && regel) pad.push({ soort: 'voorschrift', gegevens: regel });
    let huidig = node ?? (regel ? this.#structuur.get(regel.structuur_id) : undefined);
    while (huidig) {
      pad.push({ soort: 'structuur', gegevens: huidig });
      huidig = huidig.parent_id === null ? undefined : this.#structuur.get(huidig.parent_id);
    }
    return bevries(pad.reverse());
  }
}
export type { Dataset };
const LEEG: readonly never[] = Object.freeze([]);

/** Maak één instantie per browsersessie en geef de URL van de bestaande datasets/-map. */
export function maakGegevenslaag(options: { datasetsUrl: URL; ophalen?: Ophalen }) {
  const basis = new URL(options.datasetsUrl.href);
  if (!basis.pathname.endsWith('/') || basis.search || basis.hash) {
    throw new TypeError('datasetsUrl moet een map-URL zonder query of fragment zijn en eindigen op /');
  }
  const ophalen = options.ophalen ?? ((url: URL) => globalThis.fetch(url));
  const manifesten = new Map<SelectielijstId, Promise<Datasetmanifest>>();
  const datasets = new Map<SelectielijstId, Promise<Dataset>>();
  async function lees(id: SelectielijstId, bestand: string): Promise<unknown> {
    const url = new URL(`${id}/${bestand}.json`, basis);
    let response: Awaited<ReturnType<Ophalen>>;
    try { response = await ophalen(url); }
    catch (cause) { throw new Gegevensfout('LADEN_MISLUKT', `Ophalen mislukt: ${url.href}`, { cause }); }
    if (!response.ok) throw new Gegevensfout('LADEN_MISLUKT', `HTTP ${response.status}: ${url.href}`);
    try { return await response.json(); }
    catch (cause) { throw new Gegevensfout('ONGELDIGE_JSON', `Ongeldige JSON: ${url.href}`, { cause }); }
  }
  function laadManifest(id: SelectielijstId): Promise<Datasetmanifest> {
    lijstId(id);
    const bestaand = manifesten.get(id);
    if (bestaand) return bestaand;
    const taak = (async () => {
      const manifest = valideer(manifestvalidatie, await lees(id, 'manifest'), `${id}/manifest.json`);
      if (manifest.selectielijst_id !== id) throw new Gegevensfout('MANIFESTFOUT', `Verkeerd manifest voor ${id}`);
      return bevries(manifest);
    })();
    manifesten.set(id, taak);
    void taak.catch(() => { if (manifesten.get(id) === taak) manifesten.delete(id); });
    return taak;
  }
  function laadDataset(id: SelectielijstId): Promise<Dataset> {
    lijstId(id);
    const bestaand = datasets.get(id);
    if (bestaand) return bestaand;
    const taak = (async () => {
      const [manifest, structuur, selectie] = await Promise.all([
        laadManifest(id), lees(id, 'structuur'), lees(id, 'selectiegegevens'),
      ]);
      return new Dataset(id, manifest,
        valideer(structuurvalidatie, structuur, `${id}/structuur.json`),
        valideer(selectievalidatie, selectie, `${id}/selectiegegevens.json`));
    })();
    datasets.set(id, taak);
    // Fouten blijven zichtbaar; een volgende expliciete aanvraag kan opnieuw proberen.
    void taak.catch(() => { if (datasets.get(id) === taak) datasets.delete(id); });
    return taak;
  }
  return Object.freeze({ laadDataset, laadManifest });
}
