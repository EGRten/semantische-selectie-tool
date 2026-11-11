import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {createHash} from 'node:crypto';
import {maakGegevenslaag} from '../dist/gegevenslaag/index.js';import {maakZoekindex as maakA} from '../dist/zoeken/oorspronkelijk.js';import {maakZoekindex,analyseerVraag,pastPolariteit} from '../dist/zoeken/index.js';import {maakBegripsindex} from '../dist/begripszoeken/index.js';
const root=new URL('../',import.meta.url);const data=new URL('datasets/',root);const laag=maakGegevenslaag({datasetsUrl:data,ophalen:async u=>new Response(await readFile(u,'utf8'))});
const sets={};for(const id of ['1996-2012','2017','2020']){const dataset=await laag.laadDataset(id);sets[id]={dataset,A:maakA(dataset),B:maakZoekindex(dataset),C:maakBegripsindex(dataset,await laag.laadZoekverrijking(id))};}

test('variant A en normalisatie zijn byte-identiek aan de vastgelegde uitgangsversie',async()=>{
 const ref=JSON.parse(await readFile(new URL('tests/data/zoekkwaliteit-uitgangsversie.json',root),'utf8'));const hash=b=>createHash('sha256').update(b).digest('hex');
 assert.equal(hash(await readFile(new URL('src/zoeken/oorspronkelijk.ts',root))),ref.klassieke_module_sha256);
 assert.equal(hash(await readFile(new URL('src/zoeken/normalisatie.ts',root))),ref.normalisatie_sha256);
});
test('volledige natuurlijke vragen: vraagkader verwijderd, onbekende inhoudelijke term niet genegeerd',()=>{
 const q='Waar zoek ik stukken over een referendum?';assert.equal(sets['2020'].A.zoek(q).length,0);assert.ok(sets['2020'].B.zoek(q).some(r=>r.id==='2020:22.1.3'));
 assert.deepEqual(analyseerVraag(q).woorden,['referendum']);assert.equal(sets['2020'].B.zoek('plan onbestaanbaarzoekwoord').length,0);
});
test('negaties behouden; toegekend en niet toegekend worden niet gelijkgesteld',()=>{
 assert.ok(analyseerVraag('Waar vind ik niet toegekend?').woorden.includes('niet'));
 for(const id of ['2017','2020']){
  const positief=sets[id].B.zoek('Toegekend');assert.ok(positief.length);assert.ok(!positief.some(r=>r.id===`${id}:9.2`));
  const negatief=sets[id].B.zoek('Niet toegekend');assert.ok(negatief.some(r=>r.id===`${id}:9.2`));assert.ok(!negatief.some(r=>r.id===`${id}:9.1`));
 }
 assert.equal(pastPolariteit('niet toegekend',['Toegekend']),false);
});
test('negatie in een eigen procesomschrijving blijft vindbaar zonder negatieve resultaatnaam',()=>{
 assert.ok(sets['2020'].B.zoek('verwerken zonder inhoudelijke toets').some(r=>r.id==='2020:19'));
});
test('los niet activeert geen AI-betekenisuitbreiding, officiële negatieve frase blijft beschikbaar',()=>{
 for(const id of Object.keys(sets)){assert.equal(sets[id].C.zoek('niet',{onbevestigdeAi:true}).length,0);}
 assert.ok(sets['2020'].C.zoek('Niet toegekend').some(r=>r.id==='2020:9.2'));
});
test('brede ingebedde lexiconterm wordt niet naar vele andere voorschriften uitgebreid',()=>{
 const rs=sets['1996-2012'].C.zoek('ingetrokken vergunning woning',{onbevestigdeAi:true});
 assert.ok(rs.every(r=>r.verklaringen.every(v=>v.term?.zoekterm!=='vergunning')));
});
test('exacte codes, namen, gedeelde rubrieken en typen blijven intact',()=>{
 assert.equal(sets['2020'].B.zoek('1.1.2')[0].id,'2020:1.1.2');assert.equal(sets['2020'].B.zoek('Gemeentewapen')[0].rang,2);
 assert.equal(sets['1996-2012'].B.zoek('3.6.2').filter(r=>r.type==='voorschrift').length,36);
 assert.ok(sets['2020'].B.zoek('1.1').some(r=>r.type==='generiek_resultaat'));assert.ok(sets['2020'].B.zoek('1.1').some(r=>r.type==='specifiek_resultaat'));
});
test('samengestelde woorden en beperkte vormen gebruiken uitsluitend werkelijk aanwezige tekst',()=>{
 assert.ok(sets['2020'].B.zoek('jeugdhulp client').some(r=>r.id==='2020:3.1.4'));
 assert.ok(sets['1996-2012'].B.zoek('presentielijsten vergaderingen').length);
 assert.ok(sets['2020'].B.zoek('gemeentelijke belastingen').length);
});
test('vier varianten en afzonderlijke groep plausibiliteitsbeoordeelde AI zijn reproduceerbaar',()=>{
 const s=sets['1996-2012'];const q='Waar vind ik WABO vergunningen?';assert.deepEqual(s.A.zoek(q),s.A.zoek(q));assert.deepEqual(s.B.zoek(q),s.B.zoek(q));
 const c=s.C.zoek(q),d=s.C.zoek(q,{onbevestigdeAi:true});assert.deepEqual(d.slice(0,c.length).map(r=>r.id),c.map(r=>r.id));
 const zonder=s.C.zoek('notulen',{beoordeeldeAi:false});assert.ok(zonder.every(r=>r.verklaringen.every(v=>v.term?.beoordelingsstatus!=='voorstel_inhoudelijk_beoordeeld_zoekrichting')));
 assert.ok(c.every(r=>r.verklaringen.every(v=>!v.onbevestigd)));
});
test('strikte lijstisolatie en vervallenfilter',()=>{
 for(const id of Object.keys(sets))for(const engine of [sets[id].A,sets[id].B,sets[id].C])assert.ok(engine.zoek('1.1').every(r=>r.id.startsWith(id+':')));
 assert.ok(!sets['2020'].B.zoek('7.1.20').some(r=>r.vervallen));assert.ok(sets['2020'].B.zoek('7.1.20',{vervallenMeenemen:true}).some(r=>r.vervallen));
});
test('45 voorgestelde vragen, 15 per lijst, alle oordelen te beoordelen en geen fictieve IDs',async()=>{
 const rows=JSON.parse(await readFile(new URL('tests/data/zoekkwaliteit-beoordelingsset.json',root),'utf8'));assert.equal(rows.length,45);assert.equal(new Set(rows.map(r=>r.vraag_id)).size,45);
 for(const id of Object.keys(sets))assert.equal(rows.filter(r=>r.selectielijst===id).length,15);
 for(const row of rows){assert.equal(row.beoordelingsstatus,'te beoordelen');assert.equal(row.onafhankelijk_gevalideerd,false);assert.ok(row.onzekerheden.length);
  for(const r of [...row.mogelijke_relevante_resultaten,...row.expliciet_niet_relevante_resultaten]){assert.equal(r.beoordelingsstatus,'te beoordelen');assert.ok(sets[row.selectielijst].dataset.selectiegegeven(r.id)||sets[row.selectielijst].dataset.structuuronderdeel(r.id));assert.ok(r.onderbouwing);}
 }
});

test('brede vergunning blijft in herkenbare officiële samenstellingen vindbaar',()=>{
 assert.ok(sets['2020'].B.zoek('vergunning').some(r=>r.id==='2020:11.1.6'));
});
