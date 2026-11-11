import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,relative,isAbsolute,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {maakGegevenslaag} from '../dist/gegevenslaag/index.js';
import {indexeerBronconcordans} from '../dist/concordans/index.js';
const args=process.argv.slice(2);function optie(naam){const i=args.indexOf(naam);if(i<0||!args[i+1])throw Error(`Vereist: ${naam}`);return args[i+1];}
const bron=resolve(optie('--bron')),output=resolve(optie('--output'));
const root=fileURLToPath(new URL('../',import.meta.url));
const binnen=(map,pad)=>{const r=relative(map,pad);return r===''||(!r.startsWith('..')&&!isAbsolute(r));};
if(binnen(root,output)&&!binnen(join(root,'.private-inputs'),output))throw Error('Uitvoer uitsluitend buiten de repository of in .private-inputs; geen publieke bronspiegel');
const bytes=await readFile(bron);const sha=createHash('sha256').update(bytes).digest('hex');
const laag=maakGegevenslaag({datasetsUrl:new URL('../datasets/',import.meta.url),ophalen:async u=>new Response(await readFile(u,'utf8'))});
const controle=await indexeerBronconcordans(JSON.parse(bytes.toString('utf8')),laag);
const tel=xs=>xs.reduce((a,k)=>(a[k]=(a[k]??0)+1,a),{});
const rs=controle.concordans.relaties;
const opgelost=rs.filter(r=>r.bron.record&&r.doel.record);
const bronNaarDoel=new Map(),doelNaarBron=new Map();
for(const r of opgelost){const b=r.bron.record.id,d=r.doel.record.id;if(!bronNaarDoel.has(b))bronNaarDoel.set(b,new Set());bronNaarDoel.get(b).add(d);if(!doelNaarBron.has(d))doelNaarBron.set(d,new Set());doelNaarBron.get(d).add(b);}
const samenvatting={beoordelingen_10a:tel(controle.rijen.filter(r=>r.beoordeling).map(r=>r.beoordeling.categorie)),bronrijen:controle.bronrijen.length,bron1996:tel(controle.rijen.map(r=>r.bron1996.status)),doelverwijzingen:tel(controle.rijen.map(r=>r.doel2020.status)),
 doel_eindpunten:tel(controle.rijen.flatMap(r=>r.doel2020.koppelingen.map(k=>k.status))),context2017:tel(controle.rijen.map(r=>r.context2017.status)),
 bron1996_tekstvergelijking:tel(controle.rijen.filter(r=>r.bron1996.vergelijking).map(r=>r.bron1996.vergelijking.omschrijving)),
 rijen_met_2017_tekstmatch:controle.rijen.filter(r=>r.context2017.kandidaat_ids.length).length,
 technische_interpretaties:rs.length,volledig_gekoppelde_interpretaties:opgelost.length,onopgeloste_interpretaties:controle.concordans.onopgelost().length,
 interpretaties_met_onzekerheden:controle.concordans.metOnzekerheden().length,
 bronkoppelingen:tel(rs.map(r=>r.bron.status)),doelkoppelingen:tel(rs.map(r=>r.doel.status)),
 unieke_gekoppelde_paren:[...bronNaarDoel.values()].reduce((a,s)=>a+s.size,0),
 bronrecords_een_doel:[...bronNaarDoel.values()].filter(s=>s.size===1).length,bronrecords_meerdere_doelen:[...bronNaarDoel.values()].filter(s=>s.size>1).length,
 doelrecords_een_bron:[...doelNaarBron.values()].filter(s=>s.size===1).length,doelrecords_meerdere_bronnen:[...doelNaarBron.values()].filter(s=>s.size>1).length};
const afwijkingen=await Promise.all(controle.rijen.filter(r=>r.beoordeling).map(async r=>({
 bronrij_id:r.bronrij_id,beoordeling:r.beoordeling,
 oorspronkelijke_bronrij:controle.bronrijen.find(b=>b.id===r.bronrij_id),
 kandidaten:await Promise.all(r.beoordeling.kandidaten.map(async id=>{const ds=await laag.laadDataset(id.split(':')[0]);return {id,selectiegegeven:ds.selectiegegeven(id)??null,structuuronderdeel:ds.structuuronderdeel(id)??null};})),
})));
const rapport={afwijkingen_10a:afwijkingen,bron_json_sha256:sha,definitie:'Technische koppelingen uit werkelijke bron; geen inhoudelijke gelijkwaardigheid of toestemming tot herpublicatie.',samenvatting,
 rijen:controle.rijen,relaties:rs,onopgelost:controle.concordans.onopgelost().map(r=>r.oorspronkelijk.id)};
await mkdir(output,{recursive:true});await writeFile(join(output,'koppelingen.json'),JSON.stringify(rapport,null,2)+'\n');
await writeFile(join(output,'samenvatting.json'),JSON.stringify(samenvatting,null,2)+'\n');
console.log(JSON.stringify(samenvatting,null,2));
