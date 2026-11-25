import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {voorTekstkwaliteit} from './helpers/tekstkwaliteit.mjs';
const read=async p=>JSON.parse(await readFile(p,'utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
const canonical=v=>JSON.stringify(v&&typeof v==='object'?Array.isArray(v)?v.map(x=>JSON.parse(canonical(x))):Object.fromEntries(Object.keys(v).sort().map(k=>[k,JSON.parse(canonical(v[k]))])):v);
const root='documentatie/tekstkwaliteit/';
test('tekstkwaliteit: elke tekstmutatie heeft bronbewijs; terugdraaien reconstrueert alle overige velden',async()=>{
 const mut=await read(root+'mutaties.json'),ref=await read(root+'inhoud-voor.json'),sources=await read(root+'bronverificatie.json');
 assert.ok(mut.length>0);
 const protectedKeys=['id','code','parent_id','structuur_id','onderdeel_id','waardering','bewaartermijn','procestermijn','aanvangsmoment','officiele_bronrij','ruwe_extractie','verificatie'];
 for(const m of mut){
  if(m.bestand==='publicatie/concordans.json')assert.ok(!m.pad.some(k=>['waarden','context'].includes(k)));
  assert.ok(!m.pad.some(k=>protectedKeys.includes(k)),m.json_pointer);assert.ok(['A','B'].includes(m.categorie));assert.ok(typeof m.na==='string'||(m.bestand.startsWith('publicatie/')&&m.veld==='notities'&&m.status==='gegenereerde_deduplicatie'));assert.ok(m.pdf_pagina>0);assert.ok(m.motivering);assert.ok(m.regels.length>0);
  assert.equal(sources.find(s=>s.lijst===m.selectielijst)?.sha256,m.bronhash);
  for(const r of m.regels){assert.ok(!['en','of'].includes(r.rechts));if(r.links==='BRP')assert.equal(r.correct,'BRP-gegevens');}
 }
 for(const p of new Set(mut.map(m=>m.bestand))){const data=await voorTekstkwaliteit(p,await read(p));assert.equal(hash(canonical(data)),ref[p],p);}
});
test('tekstkwaliteit: historische bewijsbestanden en oorspronkelijke bronmanifesten blijven byte-identiek',async()=>{
 const nul=await read(root+'nulmeting.json');let n=0;
 for(const [p,h]of Object.entries(nul.bestanden))if(p.startsWith('documentatie/bronherijking/')||p.startsWith('bronnen/')||/documentatie\/(woordafbrekingen|concordans)/.test(p)||/datasets\/.*\/(bronannotaties|relaties|testvragen)\.json$/.test(p)){assert.equal(hash(await readFile(p)),h,p);n++;}
 assert.ok(n>50);
});
test('tekstkwaliteit: productievelden zijn hersteld; betekenisvolle en onzekere bronformuleringen blijven behouden',async()=>{
 const s=await read('datasets/2020/selectiegegevens.json'),n=await read('datasets/2020/structuur.json');
 assert.match(s.find(r=>r.id==='2020:8.1.14').officiele_omschrijving,/Gehandicaptenparkeerkaart/);
 assert.match(n.find(r=>r.id==='2020:1.4').benaming,/Niet doorgegaan/);
 assert.match(s.find(r=>r.id==='2020:9.1.6').officiele_omschrijving,/BRP-gegevens/);
 assert.ok(JSON.stringify(s).includes('Bouw- en'));assert.ok(JSON.stringify(s).includes('bestaans- of'));
 assert.ok(JSON.stringify(await read('datasets/2017/bepalingen.json')).includes('voorvoor'));
 assert.ok(JSON.stringify(s).includes('verstekken'));
 assert.match(s.find(r=>r.id==='2020:8.1.14').officiele_bronrij.omschrijving,/Gehandicaptenpar-\nkeerkaart/);
});
test('tekstkwaliteit: CSV-register en JSON-register verantwoorden hetzelfde aantal wijzigingen',async()=>{
 const m=await read(root+'mutaties.json'),t=await read(root+'tellingen.json');assert.equal(m.length,t.geregistreerde_mutaties);
 const csv=await readFile(root+'tekstkwaliteit-correcties.csv','utf8');for(const x of m)assert.ok(csv.includes(x.json_pointer));
});
test('tekstkwaliteit: inventaris verantwoordt ieder oorspronkelijk JSON-bestand, ook lege verzamelingen',async()=>{
 const nul=await read(root+'nulmeting.json'),t=await read(root+'tellingen.json');const csv=await readFile(root+'tekstkwaliteit-inventarisatie.csv','utf8');
 const bestanden=Object.keys(nul.bestanden).filter(p=>p.endsWith('.json'));assert.equal(bestanden.length,t.json_bestanden);
 for(const p of bestanden)assert.ok(csv.includes(`${p};`),p);
 assert.ok(csv.includes('(geen tekstwaarden)'));
});
