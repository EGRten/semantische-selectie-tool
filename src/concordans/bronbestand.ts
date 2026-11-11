import { Concordansfout, indexeerConcordans } from './index.js';
import type { Concordansbestand, TechnischeKoppeling, OorspronkelijkeRelatie } from './index.js';
import type { Dataset, SelectielijstId, Ophalen } from '../gegevenslaag/index.js';

export type Bronrij = {
  readonly id:string; readonly bron:{readonly bron_id:string;readonly werkblad:string;readonly rij:number};
  readonly originele_cellen:readonly (string|null)[];
  readonly samengevoegde_cellen_uitgevouwen:readonly (string|null)[];
  readonly expliciete_2020_codes:readonly string[]; readonly ongeldige_codes:readonly string[];
  readonly juridische_gelijkwaardigheid:false; readonly '2017_codes_afgeleid':false;
};
function fout(message:string):never{throw new Concordansfout('ONGELDIG_BESTAND',message);}
function bevries<T>(x:T):T{if(x&&typeof x==='object'&&!Object.isFrozen(x)){Object.values(x).forEach(bevries);Object.freeze(x);}return x;}
export function valideerBronrijen(json:unknown):readonly Bronrij[]{
  if(!Array.isArray(json))fout('Concordansbron moet een rijarray zijn');
  const ids=new Set<string>(),posities=new Set<string>();
  const velden=['id','bron','originele_cellen','samengevoegde_cellen_uitgevouwen','expliciete_2020_codes','ongeldige_codes','juridische_gelijkwaardigheid','2017_codes_afgeleid'];
  for(const r of json){
    if(!r||typeof r!=='object'||Object.keys(r).some(k=>!velden.includes(k))||velden.some(k=>!(k in r)))fout('Ongeldige bronrijvelden');
    if(typeof r.id!=='string'||!r.id.trim()||ids.has(r.id))fout('Ontbrekende of dubbele bronrij-ID');ids.add(r.id);
    const b=r.bron;
    if(!b||typeof b!=='object'||Object.keys(b).length!==3||b.bron_id!=='concordans-aangeleverd'||typeof b.werkblad!=='string'||!b.werkblad.trim()||!Number.isInteger(b.rij)||b.rij<3)fout('Ongeldige bronpositie');
    const sleutel=JSON.stringify([b.werkblad,b.rij]);if(posities.has(sleutel))fout('Dubbele werkbladrij');posities.add(sleutel);
    for(const k of ['originele_cellen','samengevoegde_cellen_uitgevouwen'])if(!Array.isArray(r[k])||r[k].length!==11||r[k].some((v:unknown)=>v!==null&&typeof v!=='string'))fout('Elf tekst-/lege cellen verwacht');
    for(let i=0;i<11;i++)if(r.originele_cellen[i]!==null && r.originele_cellen[i]!==r.samengevoegde_cellen_uitgevouwen[i])fout('Uitgevouwen cel wijzigt oorspronkelijke niet-lege waarde');
    for(const k of ['expliciete_2020_codes','ongeldige_codes'])if(!Array.isArray(r[k])||r[k].some((v:unknown)=>typeof v!=='string'||!v.trim())||new Set(r[k]).size!==r[k].length)fout('Ongeldige code-inventaris');
    if(r.juridische_gelijkwaardigheid!==false||r['2017_codes_afgeleid']!==false)fout('Onverwachte betekenis- of afleidingsclaim');
  }
  return bevries(json as Bronrij[]);
}
function sleutel(cellen:readonly (string|null)[]){return JSON.stringify(cellen.slice(0,4));}
function doelverwijzingen(r:Bronrij):{codes:string[];status:string;tekst:string|null}{
  const bronTekst=r.samengevoegde_cellen_uitgevouwen[5]??null;
  const f=bronTekst?.trim()??null;
  if(!f)return {codes:[],status:'geen_resultaatcode',tekst:bronTekst};
  if(/\bparagraaf\b/i.test(f))return {codes:[],status:'algemene_bepaling_geen_resultaatcode',tekst:bronTekst};
  if(/^\d+(?:\.\d+)+(?:\s*\/\s*\d+(?:\.\d+)+)*$/.test(f))return {codes:[...new Set(f.split(/\s*\/\s*/))],status:'expliciete_codekolom',tekst:bronTekst};
  const bereik=/(\d+(?:\.\d+)+)\s+t\/m\s+(\d+(?:\.\d+)+)/.exec(f);
  if(bereik){const a=bereik[1]!.split('.'),b=bereik[2]!.split('.'),start=Number(a.pop()),eind=Number(b.pop());
    if(a.join('.')===b.join('.')&&eind>=start&&eind-start<=100)return {codes:Array.from({length:eind-start+1},(_,i)=>`${a.join('.')}.${start+i}`),status:'expliciet_tekstbereik',tekst:bronTekst};}
  if(/^\d+(?:\.\d+)+\.$/.test(f))return {codes:[f],status:'onvolledige_code_geen_reparatie',tekst:bronTekst};
  return {codes:[],status:'tekstuele_verwijzing_te_beoordelen',tekst:bronTekst};
}
const afwezig2017=(s:string)=>/^(nieuw in 2020|ontbrak in 2017)$/i.test(s.trim());
/** De feitelijke rijbron blijft ongewijzigd naast de technische interpretaties beschikbaar. */
export async function indexeerBronconcordans(json:unknown,gegevenslaag:{laadDataset:(id:SelectielijstId)=>Promise<Dataset>}){
  const bronrijen=valideerBronrijen(json);
  const [oud,nieuw]=await Promise.all([gegevenslaag.laadDataset('1996-2012'),gegevenslaag.laadDataset('2020')]);
  if(oud.id!=='1996-2012'||nieuw.id!=='2020')fout('Verkeerde selectielijst bij bronconcordans');
  const heeft2017=bronrijen.some(r=>{const j=r.samengevoegde_cellen_uitgevouwen[9];return j&&!afwezig2017(j);});
  const ds2017=heeft2017?await gegevenslaag.laadDataset('2017'):undefined;
  if(ds2017&&ds2017.id!=='2017')fout('Verkeerde dataset voor 2017-context');
  const rijindex=new Map(bronrijen.map(r=>[JSON.stringify([r.bron.werkblad,r.bron.rij]),r]));
  const direct=new Map<string,Set<string>>(),celindex=new Map<string,Set<string>>();
  const voeg=(index:Map<string,Set<string>>,key:string,id:string)=>{if(!index.has(key))index.set(key,new Set());index.get(key)!.add(id);};
  for(const regel of oud.selectiegegevens)for(const b of regel.aanvullende_bronnen){if(b.bron_id!=='concordans-aangeleverd'||b.rij===undefined||b.werkblad===undefined)continue;
    const k=JSON.stringify([b.werkblad,b.rij]),rij=rijindex.get(k);if(!rij)fout(`Dataset verwijst naar ontbrekende bronrij: ${b.rij}`);
    voeg(direct,k,regel.id);voeg(celindex,sleutel(rij.samengevoegde_cellen_uitgevouwen),regel.id);
  }
  const relaties:OorspronkelijkeRelatie[]=[],koppelingen:TechnischeKoppeling[]=[];
  const rijen=bronrijen.map(r=>{
    const c=r.samengevoegde_cellen_uitgevouwen,k=JSON.stringify([r.bron.werkblad,r.bron.rij]);
    const directIds=[...(direct.get(k)??[])],celIds=c[2]?.trim()?[...(celindex.get(sleutel(c))??[])]:[];
    const oudIds=directIds.length?directIds:celIds;
    const geenOud=c.slice(0,4).some(v=>v==='Nieuw in Selectielijst 2020');
    const oudRegel=oudIds.length===1?oud.selectiegegeven(oudIds[0]!):undefined;
    const vergelijking=oudRegel?{omschrijving:c[2]===oudRegel.officiele_omschrijving?'identiek':c[2]===null?'ontbreekt':'afwijkend',bewaartermijn:c[3]===oudRegel.bewaartermijn.officiele_tekst?'identiek':c[3]===null?'ontbreekt':'afwijkend'}:null;
    const bronOnzekerheden:string[]=[];
    if(oudIds.length!==1)bronOnzekerheden.push('Historisch voorschrift niet uniek gekoppeld; geen ongedocumenteerde doorvulling.');
    if(vergelijking?.omschrijving!=='identiek'&&vergelijking)bronOnzekerheden.push('Concordansomschrijving ontbreekt of wijkt letterlijk af van de officiële dataset; rijreferentie is geen inhoudelijke gelijkwaardigheid.');
    if(vergelijking?.bewaartermijn!=='identiek'&&vergelijking)bronOnzekerheden.push('Concordanstermijn ontbreekt of wijkt af; geen bronwaarde gecorrigeerd.');
    const doel=doelverwijzingen(r),j=c[9]??null;
    const kandidaten2017=j&&!afwezig2017(j)?(ds2017?.selectiegegevens.filter(d=>d.officiele_benaming===j||d.officiele_omschrijving===j).map(d=>d.id)??[]):[];
    // J/K bevatten geen codes. Zelfs een unieke tekstmatch wordt geen vastgestelde 2017-relatie.
    const interpretaties:string[]=[];
    if(!geenOud)for(const code of doel.codes){
      const id=`${r.id}:1996-2020:${interpretaties.length+1}`;interpretaties.push(id);
      relaties.push({id,bron:{selectielijst:'1996-2012',code:null,omschrijving:c[2]||null},doel:{selectielijst:'2020',code,omschrijving:c[7]||c[6]||null},
        toelichting:doel.tekst,herkomst_id:'concordans-aangeleverd',bronlocatie:`${r.bron.werkblad}, rij ${r.bron.rij}, A:I`,relatietype:null,
        verificatiestatus:'technische_rijinterpretatie_geen_inhoudelijk_oordeel',onzekerheden:bronOnzekerheden});
      if(oudIds.length===1)koppelingen.push({relatie_id:id,zijde:'bron',soort:'selectiegegeven',record_id:oudIds[0]!,status:'technisch_gecontroleerd',onderbouwing:directIds.length?'Rechtstreekse werkbladrijreferentie uit bestaande dataset.':'Exacte identiteit van uitgevouwen cellen A:D met een door de dataset aangewezen bronrij; geen semantische tekstmatching.'});
    }
    return {bronrij_id:r.id,werkblad:r.bron.werkblad,rij:r.bron.rij,
      bron1996:{status:geenOud?'expliciet_geen_historische_regel':oudIds.length===1?(directIds.length?'dataset_bronrij':'identieke_uitgevouwen_cellen'):oudIds.length>1?'meerdere_kandidaten':'niet_gekoppeld',record_ids:oudIds,vergelijking},
      doel2020:{...doel,koppelingen:doel.codes.map(code=>{const regel=nieuw.selectiegegevens.find(d=>d.code===code),node=nieuw.structuur.find(d=>d.code===code);return {code,status:regel?'exact':node?'structuurniveau':'ontbreekt',record_id:regel?.id??node?.id??null};})},
      context2017:{status:!j?(c[10]?'waardering_zonder_omschrijving_te_beoordelen':'geen_aantekening'):afwezig2017(j)?'expliciet_afwezig_in_2017':'beschrijving_geen_code_te_beoordelen',kandidaat_ids:kandidaten2017,omschrijving:j,waardering:c[10]??null},
      interpretatie_ids:interpretaties};
  });
  const bestand:Concordansbestand={versie:1,bronnen:[{id:'concordans-aangeleverd',titel:'Concordans Selectielijst 1996-2020(1).xlsx',organisatie:null,url:null,
    hergebruik:'Werkelijke aangeleverde bron; publieke distributie niet vrijgegeven door deze technische verwerking.',verificatiestatus:'bronidentiteit_en_compleetheid_afzonderlijk_controleren'}],relaties,koppelingen,beoordelingen:[]};
  const concordans=await indexeerConcordans(bestand,gegevenslaag);
  return bevries(Object.freeze({bronrijen,rijen:Object.freeze(rijen),concordans}));
}
/** Op aanvraag; invoer is de oorspronkelijke rij-JSON, niet het genormaliseerde contract. */
export function laadBronconcordans(options:{bestandUrl:URL;gegevenslaag:{laadDataset:(id:SelectielijstId)=>Promise<Dataset>};ophalen?:Ophalen}){
  const url=new URL(options.bestandUrl.href);let cache:ReturnType<typeof indexeerBronconcordans>|undefined;
  return Object.freeze({laad(){if(cache)return cache;const taak=(async()=>{
    let r:Awaited<ReturnType<Ophalen>>;try{r=await (options.ophalen??fetch)(url);}catch(cause){throw new Concordansfout('LADEN_MISLUKT','Bronconcordans niet bereikbaar',{cause});}
    if(!r.ok)throw new Concordansfout('LADEN_MISLUKT',`Bronconcordans HTTP ${r.status}`);
    let json:unknown;try{json=await r.json();}catch(cause){throw new Concordansfout('ONGELDIGE_JSON','Ongeldige bronconcordans-JSON',{cause});}
    return indexeerBronconcordans(json,options.gegevenslaag);
  })();cache=taak;void taak.catch(()=>{if(cache===taak)cache=undefined;});return taak;}});
}
