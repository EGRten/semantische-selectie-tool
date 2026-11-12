import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {NASLAGWERKEN,controleerDownload,hardeAcceptatie} from '../scripts/publieke-downloadcontrole.mjs';
import {publicatieCel} from '../dist/publicatie/index.js';
const werk=NASLAGWERKEN.find(w=>w.id==='2017');
const p=JSON.parse(await readFile(new URL('../publicatie/2017.json',import.meta.url)));
function teruggelezen(){return {werkbladen:[{naam:'Selectiegegevens',rijen:[p.kolommen,...p.rijen.map(r=>p.kolommen.map((_,i)=>publicatieCel(p,r,i)))]},{naam:'Toelichtingen',rijen:[['Onderwerp'],['Inhoud']]},{naam:'Bronvermelding',rijen:[['Bron'],['Titel']]}],macros:false,externe_links:false};}
test('downloadcontrole verifieert iedere primaire bronwaarde, niet alleen aantallen',()=>{
 const x=teruggelezen();assert.equal(controleerDownload(werk,p,werk.naam,x).geslaagd,true);
 x.werkbladen[0].rijen[1][0]='Gewijzigde code';
 assert.equal(controleerDownload(werk,p,werk.naam,x).controles.primaire_bronwaarden,false);
});
test('downloadcontrole weigert verkeerde naam, werkblad of ontbrekende regel',()=>{
 assert.equal(controleerDownload(werk,p,'Anders.xlsx',teruggelezen()).geslaagd,false);
 const x=teruggelezen();x.werkbladen.pop();assert.equal(controleerDownload(werk,p,werk.naam,x).geslaagd,false);
 const y=teruggelezen();y.werkbladen[0].rijen.pop();assert.equal(controleerDownload(werk,p,werk.naam,y).controles.aantal,false);
});
test('acceptatie vereist exact vier verschillende geslaagde naslagwerken',()=>{
 // Uitsluitend toets van rapportlogica; geen fictieve concordansbron of publicatieclaim.
 const rs=NASLAGWERKEN.map(w=>({id:w.id,geslaagd:true}));assert.equal(hardeAcceptatie(rs),true);
 assert.equal(hardeAcceptatie(rs.slice(1)),false);
 assert.equal(hardeAcceptatie([...rs,rs[0]]),false);
 assert.equal(hardeAcceptatie(rs.map(r=>r.id==='concordans'?{...r,geslaagd:false}:r)),false);
});
test('vierde downloadcontrole verwerkt iedere cel van de echte concordans',{skip:!process.env.CONCORDANS_BRON_JSON},async()=>{
 const {mkdtemp,writeFile,rm}=await import('node:fs/promises');
 const {tmpdir}=await import('node:os');const {join}=await import('node:path');
 const {execFile}=await import('node:child_process');const {promisify}=await import('node:util');
 const {build}=await import('esbuild');
 const moduleDir=await mkdtemp(new URL('../node_modules/.download-test-',import.meta.url).pathname);
 await build({entryPoints:[new URL('../src/publicatie/excel.ts',import.meta.url).pathname],outfile:join(moduleDir,'excel.mjs'),bundle:true,format:'esm',platform:'node',packages:'external'});
 const {maakPublicatieExcel}=await import('file://'+join(moduleDir,'excel.mjs'));
 const d=await mkdtemp(join(tmpdir(),'downloadcontrole-bron-'));const run=promisify(execFile);
 try{
  await run(process.execPath,['scripts/genereer-publicaties.mjs','--concordans',process.env.CONCORDANS_BRON_JSON,'--output',d]);
  const publicatie=JSON.parse(await readFile(join(d,'concordans.json')));
  const blob=await maakPublicatieExcel(publicatie);const pad=join(d,'concordans.xlsx');
  await writeFile(pad,new Uint8Array(await blob.arrayBuffer()));
  const {stdout}=await run('python',['tests/helpers/lees-concordans-xlsx.py',pad],{maxBuffer:24*1024*1024});
  const x=JSON.parse(stdout),w=NASLAGWERKEN[0];
  assert.equal(controleerDownload(w,publicatie,w.naam,x).geslaagd,true);
  assert.equal(x.werkbladen[0].rijen[0].length,12);
  x.werkbladen[0].rijen[20][6]='Onbedoeld aangepaste broncode';
  assert.equal(controleerDownload(w,publicatie,w.naam,x).geslaagd,false);
 }finally{await rm(d,{recursive:true,force:true});await rm(moduleDir,{recursive:true,force:true});}
});
