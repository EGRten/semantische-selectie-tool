import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {maakGegevenslaag} from '../dist/gegevenslaag/index.js';
import {indexeerBronconcordans} from '../dist/concordans/index.js';
import {indexeerPubliekeConcordans} from '../dist/publicatie/concordans.js';
const p=JSON.parse(await readFile(new URL('../publicatie/concordans.json',import.meta.url)));
const laag=()=>maakGegevenslaag({datasetsUrl:new URL('../datasets/',import.meta.url),ophalen:async u=>new Response(await readFile(u,'utf8'))});
let cache;const publiek=()=>cache??=indexeerPubliekeConcordans(p,laag());
test('publieke projectie levert alle 612 interpretaties en behoudt de dekking 606/6',async()=>{
 const c=await publiek();assert.equal(c.bronrijen.length,716);assert.equal(c.concordans.relaties.length,612);assert.equal(c.concordans.onopgelost().length,6);
 assert.equal(c.concordans.relaties.filter(r=>r.bron.record&&r.doel.record).length,606);
 const rij=n=>c.rijen.find(r=>r.rij===n);
 assert.equal(rij(21).doel2020.koppelingen[0].record_id,'2020:19.1');
 assert.equal(c.bronrijen.find(r=>r.bron.rij===21).originele_cellen[5],'19.1.');
 assert.equal(rij(716).doel2020.koppelingen[0].record_id,'2020:19.2.1');
 assert.equal(rij(716).interpretatie_ids.length,0);
 for(const n of [6,89,90,293,434,442])assert.ok(c.concordans.onopgelost().some(r=>r.oorspronkelijk.id.startsWith(`concordans:rij:${n}:`)));
});
test('publieke vergelijking behoudt oorspronkelijke broncellen, alle technische koppelingen en besluiten',{skip:!process.env.CONCORDANS_BRON_JSON},async()=>{
 const bron=JSON.parse(await readFile(process.env.CONCORDANS_BRON_JSON));
 const origineel=await indexeerBronconcordans(bron,laag()),c=await publiek();
 for(let i=0;i<716;i++){
  assert.deepEqual(c.bronrijen[i].originele_cellen,bron[i].originele_cellen);
  assert.deepEqual(c.bronrijen[i].samengevoegde_cellen_uitgevouwen,bron[i].samengevoegde_cellen_uitgevouwen);
 }
 assert.deepEqual(c.rijen,origineel.rijen);
 assert.deepEqual(c.concordans.relaties,origineel.concordans.relaties);
});
