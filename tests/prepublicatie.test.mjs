import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {createHash} from 'node:crypto';
const canoniek=v=>v&&typeof v==='object'?Array.isArray(v)?v.map(canoniek):Object.fromEntries(Object.keys(v).sort().map(k=>[k,canoniek(v[k])])):v;
test('concordansprojectie wijzigt uitsluitend de aangewezen hergebruikmetadata',async()=>{
 const p=JSON.parse(await readFile('publicatie/concordans.json','utf8'));
 assert.match(p.hergebruik,/VNG.*SelectTool/);assert.match(p.hergebruik,/26 mei 2020/);assert.match(p.hergebruik,/https:\/\/vng.nl\/proclaimer/);assert.match(p.hergebruik,/geen afzonderlijke licentie of toestemming/);
 assert.ok(!p.hergebruik.includes('instructie van de projecteigenaar'));
 delete p.hergebruik;assert.equal(createHash('sha256').update(JSON.stringify(canoniek(p))).digest('hex'),'abaa86ddbf04ecf181dfc77e314c03fa7a15579cc4b389d7a57c905bfbeeaab1');
});
