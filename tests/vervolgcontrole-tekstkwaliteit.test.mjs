import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=async p=>JSON.parse(await readFile(p,'utf8'));
test('vervolgcontrole: geneste leesbare uitzonderingen zijn hersteld en ruwe bronrijen blijven letterlijk',async()=>{
 const records=await read('datasets/2020/selectiegegevens.json');
 const r=records.find(x=>x.id==='2020:3.1');
 assert.match(r.uitzonderingen_en_verwijzingen.officiele_tekst,/gladheidsbestrijdingsplan/);
 assert.doesNotMatch(r.uitzonderingen_en_verwijzingen.officiele_tekst,/glad-\s+heidsbestrijdingsplan/);
 assert.match(JSON.stringify(r.officiele_bronrij),/glad-\\nheidsbestrijdingsplan/);
 const pub=await read('publicatie/2020.json');
 assert.match(JSON.stringify(pub.rijen.find(x=>x.id==='2020:3.1')),/gladheidsbestrijdingsplan/);
});
test('vervolgcontrole: bron-eigen spatiefout heeft leesbare rubrieknaam en letterlijke bronnote',async()=>{
 const structure=await read('datasets/1996-2012/structuur.json');
 const item=structure.find(x=>x.id==='1996-2012:3.4.1');
 assert.equal(item.benaming,'Aanschaf, leasen, huur, verhuur en ingebruikgeving');
 assert.match(item.toelichting,/PDF.*leasen,huur/);
 const source=await read('datasets/1996-2012/bepalingen.json');
 assert.match(source[35].tekst,/leasen,huur/);
});
