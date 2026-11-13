import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const lees=async p=>JSON.parse(await readFile(p,'utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
const canoniek=v=>v&&typeof v==='object'?Array.isArray(v)?v.map(canoniek):Object.fromEntries(Object.keys(v).sort().map(k=>[k,canoniek(v[k])])):v;
const log=await lees('documentatie/woordafbrekingen-correcties.json');
test('woordafbrekingen: uitsluitend vastgelegde tekstcorrecties; alle andere velden exact behouden',async()=>{
 for(const b of log.bestanden){
  const data=await lees(b.bestand);
  for(const c of b.correcties){
   assert.ok(!c.pad.includes('officiele_bronrij'));assert.ok(!c.pad.includes('verificatie'));
   let parent=data;for(const k of c.pad.slice(0,-1))parent=parent[k];const key=c.pad.at(-1);
   assert.equal(parent[key],c.na,`${b.bestand}: ${c.pad.join('.')}`);
   parent[key]=c.voor;
  }
  // Terugdraaien van uitsluitend geregistreerde tekstvelden reconstrueert de hele uitgangsdataset.
  assert.equal(hash(JSON.stringify(canoniek(data))),b.voor_sha256_canoniek,b.bestand);
 }
 for(const [id,sha]of Object.entries(log.manifestmetadata)){const m=await lees(`datasets/${id}/manifest.json`);delete m.sha256;assert.equal(hash(JSON.stringify(canoniek(m))),sha,id);}
 for(const [pad,sha]of Object.entries(log.ongewijzigde_bestanden))assert.equal(hash(await readFile(pad)),sha,pad);
});
test('woordafbrekingen: iedere toegestane woordvorm heeft bewijs in bewaarde officiële extractie',async()=>{
 for(const [id,lijst]of Object.entries(log.lijsten)){
  const paginas=await lees(`datasets/${id}/bepalingen.json`);
  for(const r of lijst.regels){
   const pagina=paginas.find(p=>p.bron.bron_id===r.bewijs.bron_id&&p.bron.pdf_pagina===r.bewijs.pdf_pagina);
   assert.ok(pagina);assert.equal(r.bewijs.bron_id,`${id}-officieel`);
   assert.match(pagina.tekst,new RegExp(`(?<!\\p{L})${r.correct}(?!\\p{L})`,'iu'));
   assert.ok(!['en','of'].includes(r.rechts));
  }
 }
 assert.equal(log.lijsten['1996-2012'].vervangingen,0);assert.equal(log.lijsten['2017'].bevestigde_woordvormen,1);
});
test('woordafbrekingen: leesbare productieteksten, intacte koppeltekens en oorspronkelijke bronrij',async()=>{
 const ns=await lees('datasets/2020/structuur.json'),ss=await lees('datasets/2020/selectiegegevens.json');
 assert.equal(ns.find(n=>n.id==='2020:13').benaming,'Geschillen behandelen');
 assert.equal(ns.find(n=>n.id==='2020:6').benaming,'Verzoeken behandelen');
 assert.ok(JSON.stringify(ss).includes('bestaans- of'));
 assert.ok(ss.some(r=>r.officiele_bronrij.procesnaam==='Geschillen behan-\ndelen'));
 for(const r of ss.filter(r=>/^2020:19\.1\.(19|2[0-4])$/.test(r.id)))assert.equal(r.resultaattype,'Archiefvernietiging');
});
