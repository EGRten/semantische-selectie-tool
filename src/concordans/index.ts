import type { Dataset, SelectielijstId, Ophalen } from '../gegevenslaag/index.js';

export type Verwijzing = { readonly selectielijst: SelectielijstId; readonly code: string; readonly omschrijving: string | null };
export type OorspronkelijkeRelatie = {
  readonly id: string; readonly bron: Verwijzing; readonly doel: Verwijzing;
  readonly toelichting: string | null; readonly herkomst_id: string; readonly bronlocatie: string | null;
  /** Alleen een letterlijk door de bron onderbouwde kwalificatie; anders null. */
  readonly relatietype: string | null; readonly verificatiestatus: string; readonly onzekerheden: readonly string[];
};
export type TechnischeKoppeling = {
  readonly relatie_id: string; readonly zijde: 'bron' | 'doel';
  readonly soort: 'selectiegegeven' | 'structuur'; readonly record_id: string;
  readonly status: 'technisch_gecontroleerd' | 'te_beoordelen'; readonly onderbouwing: string;
};
export type InhoudelijkeBeoordeling = {
  readonly relatie_id: string; readonly status: 'goedgekeurd' | 'afgewezen' | 'te_beoordelen';
  readonly beoordelaar: string | null; readonly datum: string | null; readonly toelichting: string;
};
export type Concordansbestand = {
  readonly versie: 1;
  readonly bronnen: readonly { readonly id: string; readonly titel: string; readonly organisatie: string | null;
    readonly url: string | null; readonly hergebruik: string; readonly verificatiestatus: string }[];
  readonly relaties: readonly OorspronkelijkeRelatie[];
  readonly koppelingen: readonly TechnischeKoppeling[];
  readonly beoordelingen: readonly InhoudelijkeBeoordeling[];
};
export type Koppelresultaat = {
  readonly verwijzing: Verwijzing;
  readonly status: 'exact' | 'structuurniveau' | 'meerdere_kandidaten' | 'ontbreekt' | 'onzeker';
  readonly record: { readonly selectielijst: SelectielijstId; readonly id: string; readonly soort: 'selectiegegeven' | 'structuur' } | null;
  readonly kandidaten: readonly string[]; readonly toelichting: string;
  readonly expliciete_koppeling: TechnischeKoppeling | null;
};
export type Concordansrelatie = {
  readonly oorspronkelijk: OorspronkelijkeRelatie; readonly bron: Koppelresultaat; readonly doel: Koppelresultaat;
  readonly inhoudelijke_beoordeling: InhoudelijkeBeoordeling | null;
};
export class Concordansfout extends Error {
  constructor(public readonly code: 'LADEN_MISLUKT'|'ONGELDIGE_JSON'|'ONGELDIG_BESTAND'|'DUBBELE_ID'|'ONGELDIGE_KOPPELING'|'ONBEKEND_RECORD', message: string, options?: ErrorOptions) { super(message,options);this.name='Concordansfout'; }
}
type Objectwaarde = Record<string,unknown>;
function object(x: unknown): asserts x is Objectwaarde { if(!x||typeof x!=='object'||Array.isArray(x))ongeldig('Object verwacht'); }
function ongeldig(tekst:string): never {throw new Concordansfout('ONGELDIG_BESTAND',tekst);}
function tekst(x:unknown): asserts x is string {if(typeof x!=='string'||!x.trim())ongeldig('Niet-lege tekst verwacht');}
function optioneel(x:unknown) {if(x!==null)tekst(x);}
function lijst(x:unknown): asserts x is SelectielijstId {if(!['1996-2012','2017','2020'].includes(String(x))||typeof x!=='string')ongeldig('Onbekende selectielijst');}
function keuze(x:unknown,waarden:readonly string[]) {if(typeof x!=='string'||!waarden.includes(x))ongeldig('Ongeldige keuze');}
function velden(x:Objectwaarde,namen:readonly string[]) {if(Object.keys(x).some(k=>!namen.includes(k))||namen.some(k=>!(k in x)))ongeldig('Onbekend of ontbrekend veld');}
function uniek(id:string,set:Set<string>){if(set.has(id))throw new Concordansfout('DUBBELE_ID',`Dubbele identificatie: ${id}`);set.add(id);}
function bevries<T>(x:T):T {if(x&&typeof x==='object'&&!Object.isFrozen(x)){Object.values(x).forEach(bevries);Object.freeze(x);}return x;}

/** Gesloten invoercontract; geen coercion, reparatie, semantische classificatie of defaults. */
export function valideerConcordans(json:unknown): Concordansbestand {
  object(json);velden(json,['versie','bronnen','relaties','koppelingen','beoordelingen']);
  if(json.versie!==1)ongeldig('Niet-ondersteunde concordansversie');
  for(const key of ['bronnen','relaties','koppelingen','beoordelingen'])if(!Array.isArray(json[key]))ongeldig('Array verwacht');
  const bronnen=new Set<string>(), relaties=new Map<string,Objectwaarde>();
  for(const b of json.bronnen as unknown[]){object(b);velden(b,['id','titel','organisatie','url','hergebruik','verificatiestatus']);tekst(b.id);tekst(b.titel);tekst(b.hergebruik);tekst(b.verificatiestatus);optioneel(b.organisatie);optioneel(b.url);
    if(b.url!==null){try{if(!['https:','http:'].includes(new URL(b.url as string).protocol))ongeldig('Ongeldige bron-URL');}catch{ongeldig('Ongeldige bron-URL');}}uniek(b.id,bronnen);}
  for(const r of json.relaties as unknown[]){object(r);velden(r,['id','bron','doel','toelichting','herkomst_id','bronlocatie','relatietype','verificatiestatus','onzekerheden']);tekst(r.id);tekst(r.herkomst_id);tekst(r.verificatiestatus);optioneel(r.toelichting);optioneel(r.bronlocatie);optioneel(r.relatietype);
    if(relaties.has(r.id))throw new Concordansfout('DUBBELE_ID',`Dubbele relatie: ${r.id}`);
    if(!bronnen.has(r.herkomst_id))ongeldig('Ontbrekende concordansherkomst');
    if(!Array.isArray(r.onzekerheden))ongeldig('Onzekerheden moeten een lijst zijn');r.onzekerheden.forEach(tekst);
    for(const zijde of ['bron','doel']){const v=r[zijde];object(v);velden(v,['selectielijst','code','omschrijving']);lijst(v.selectielijst);tekst(v.code);optioneel(v.omschrijving);}
    if((r.bron as Objectwaarde).selectielijst===(r.doel as Objectwaarde).selectielijst)ongeldig('Concordans verwacht verschillende selectielijsten');
    relaties.set(r.id,r);
  }
  const koppelingen=new Set<string>(), beoordelingen=new Set<string>();
  for(const k of json.koppelingen as unknown[]){object(k);velden(k,['relatie_id','zijde','soort','record_id','status','onderbouwing']);tekst(k.relatie_id);tekst(k.record_id);tekst(k.onderbouwing);
    if(!relaties.has(k.relatie_id))ongeldig('Onbekende relatie bij technische koppeling');
    keuze(k.zijde,['bron','doel']);keuze(k.soort,['structuur','selectiegegeven']);keuze(k.status,['technisch_gecontroleerd','te_beoordelen']);
    uniek(JSON.stringify([k.relatie_id,k.zijde]),koppelingen);
    const ref=relaties.get(k.relatie_id)![k.zijde as string] as Objectwaarde;
    if(!k.record_id.startsWith(ref.selectielijst+':'))throw new Concordansfout('ONGELDIGE_KOPPELING','Technische koppeling wijst naar een andere selectielijst');
  }
  for(const b of json.beoordelingen as unknown[]){object(b);velden(b,['relatie_id','status','beoordelaar','datum','toelichting']);tekst(b.relatie_id);tekst(b.toelichting);optioneel(b.beoordelaar);optioneel(b.datum);
    if(!relaties.has(b.relatie_id))ongeldig('Onbekende relatie bij inhoudelijke beoordeling');keuze(b.status,['goedgekeurd','afgewezen','te_beoordelen']);
    if(b.status!=='te_beoordelen'&&(b.beoordelaar===null||b.datum===null))ongeldig('Beoordelaar en datum ontbreken');uniek(b.relatie_id,beoordelingen);
  }
  return bevries(json as unknown as Concordansbestand);
}

function koppel(dataset:Dataset, v:Verwijzing, expliciet:TechnischeKoppeling|undefined): Koppelresultaat {
  const resultaat=(status:Koppelresultaat['status'],record:Koppelresultaat['record'],kandidaten:readonly string[],toelichting:string):Koppelresultaat=>({verwijzing:v,status,record,kandidaten,toelichting,expliciete_koppeling:expliciet??null});
  const ref=(id:string,soort:'structuur'|'selectiegegeven')=>({selectielijst:dataset.id,id,soort});
  if(expliciet){
    const r=expliciet.soort==='structuur'?dataset.structuuronderdeel(expliciet.record_id):dataset.selectiegegeven(expliciet.record_id);
    if(!r)return resultaat('ontbreekt',null,[],'Expliciet gekoppeld record ontbreekt.');
    if(expliciet.status==='te_beoordelen'||r.code!==v.code)return resultaat('onzeker',null,[r.id],'Koppeling vereist beoordeling; geen automatische toekenning bij afwijkende broncode.');
    return resultaat(expliciet.soort==='structuur'?'structuurniveau':'exact',ref(r.id,expliciet.soort),[],'Expliciete technische koppeling; geen inhoudelijk oordeel.');
  }
  const regels=dataset.selectiegegevens.filter(r=>r.code===v.code), nodes=dataset.structuur.filter(n=>n.code===v.code);
  if(nodes.length===1 && nodes[0]!.type==='rubriek')return resultaat('structuurniveau',ref(nodes[0]!.id,'structuur'),[],'Historische rubriek; niet aan afzonderlijke voorschriften toegekend.');
  if(regels.length===1)return resultaat('exact',ref(regels[0]!.id,'selectiegegeven'),[],'Exacte code binnen de aangegeven selectielijst.');
  if(nodes.length===1)return resultaat('structuurniveau',ref(nodes[0]!.id,'structuur'),[],'Uitsluitend het structuuronderdeel; niet doorgegeven aan onderliggende voorschriften.');
  const kandidaten=[...new Set([...regels,...nodes].map(r=>r.id))];
  return resultaat(kandidaten.length?'meerdere_kandidaten':'ontbreekt',null,kandidaten,kandidaten.length?'Meerdere records; geen automatische keuze.':'Geen exacte code; bronwaarde ongewijzigd behouden.');
}

export async function indexeerConcordans(bestand:Concordansbestand, gegevenslaag:{laadDataset:(id:SelectielijstId)=>Promise<Dataset>}) {
  const bronbestand=valideerConcordans(bestand);
  const ids=[...new Set(bronbestand.relaties.flatMap(r=>[r.bron.selectielijst,r.doel.selectielijst]))];
  const datasets=new Map(await Promise.all(ids.map(async id=>{
    const dataset=await gegevenslaag.laadDataset(id);
    if(dataset.id!==id)throw new Concordansfout('ONGELDIGE_KOPPELING','Gegevenslaag retourneert een andere selectielijst');
    return [id,dataset] as const;
  })));
  const expliciet=new Map(bronbestand.koppelingen.map(k=>[JSON.stringify([k.relatie_id,k.zijde]),k]));
  const beoordelingen=new Map(bronbestand.beoordelingen.map(b=>[b.relatie_id,b]));
  const relaties: readonly Concordansrelatie[]=bevries(bronbestand.relaties.map(r=>({oorspronkelijk:r,
    bron:koppel(datasets.get(r.bron.selectielijst)!,r.bron,expliciet.get(JSON.stringify([r.id,'bron']))),
    doel:koppel(datasets.get(r.doel.selectielijst)!,r.doel,expliciet.get(JSON.stringify([r.id,'doel']))),
    inhoudelijke_beoordeling:beoordelingen.get(r.id)??null})));
  const uitgaand=new Map<string,Concordansrelatie[]>(), inkomend=new Map<string,Concordansrelatie[]>();
  for(const r of relaties)for(const [zijde,index] of [['bron',uitgaand],['doel',inkomend]] as const){const ref=r[zijde].record;if(ref){const sleutel=JSON.stringify([ref.selectielijst,ref.id]);index.set(sleutel,[...(index.get(sleutel)??[]),r]);}}
  const leeg=Object.freeze([]) as readonly Concordansrelatie[];
  for(const index of [uitgaand,inkomend])for(const rs of index.values())Object.freeze(rs);
  function zoek(lijst:SelectielijstId,id:string,soort:'structuur'|'selectiegegeven',richting:'uitgaand'|'inkomend'='uitgaand'):readonly Concordansrelatie[]{
    if(!['1996-2012','2017','2020'].includes(lijst)||typeof id!=='string'||!['uitgaand','inkomend'].includes(richting))throw new Concordansfout('ONBEKEND_RECORD','Ongeldige lijst, record-ID of opzoekrichting');
    const ds=datasets.get(lijst);
    if(!id.startsWith(lijst+':'))throw new Concordansfout('ONBEKEND_RECORD','Record behoort tot een andere lijst');
    // Niet bij de concordans betrokken lijsten worden niet ongemerkt alsnog geladen.
    if(!ds)return leeg;
    if(!(soort==='structuur'?ds.structuuronderdeel(id):ds.selectiegegeven(id)))throw new Concordansfout('ONBEKEND_RECORD','Record ontbreekt in deze selectielijst');
    const rs=(richting==='uitgaand'?uitgaand:inkomend).get(JSON.stringify([lijst,id]))??leeg;
    return Object.freeze(rs.filter(r=>{const ref=r[richting==='uitgaand'?'bron':'doel'].record!;return ref.soort===soort || (soort==='structuur' && ref.id===ds.structuuronderdeel(id)?.id);}));
  }
  return Object.freeze({bestand:bronbestand,relaties,
    vanuitSelectiegegeven:(lijst:SelectielijstId,id:string,richting:'uitgaand'|'inkomend'='uitgaand')=>zoek(lijst,id,'selectiegegeven',richting),
    vanuitStructuur:(lijst:SelectielijstId,id:string,richting:'uitgaand'|'inkomend'='uitgaand')=>zoek(lijst,id,'structuur',richting),
    onopgelost:()=>Object.freeze(relaties.filter(r=>!r.bron.record||!r.doel.record)),
    metOnzekerheden:()=>Object.freeze(relaties.filter(r=>!r.bron.record||!r.doel.record||r.oorspronkelijk.onzekerheden.length>0||r.inhoudelijke_beoordeling?.status==='te_beoordelen')),
  });
}

/** Geen standaard-URL en geen automatische UI-activatie: de aanroeper kiest expliciet het statische bestand. */
export function maakConcordanslaag(options:{bestandUrl:URL;gegevenslaag:{laadDataset:(id:SelectielijstId)=>Promise<Dataset>};ophalen?:Ophalen}) {
  const url=new URL(options.bestandUrl.href);const ophalen=options.ophalen??((u:URL)=>fetch(u));
  let cache:ReturnType<typeof indexeerConcordans>|undefined;
  function laad(){
    if(cache)return cache;
    const taak=(async()=>{let r:Awaited<ReturnType<Ophalen>>;
      try{r=await ophalen(url);}catch(cause){throw new Concordansfout('LADEN_MISLUKT','Concordansbestand niet bereikbaar',{cause});}
      if(!r.ok)throw new Concordansfout('LADEN_MISLUKT',`Concordansbestand: HTTP ${r.status}`);
      let json:unknown;try{json=await r.json();}catch(cause){throw new Concordansfout('ONGELDIGE_JSON','Ongeldige concordans-JSON',{cause});}
      return indexeerConcordans(valideerConcordans(json),options.gegevenslaag);
    })();cache=taak;void taak.catch(()=>{if(cache===taak)cache=undefined;});return taak;
  }
  return Object.freeze({laad});
}
