import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const lees=async n=>JSON.parse(await readFile(`documentatie/tekstkwaliteit/${n}.json`,'utf8'));
const vervolg=async n=>JSON.parse(await readFile(`documentatie/tekstkwaliteit/vervolgcontrole/${n}.json`,'utf8'));
export async function voorVervolgcontrole(bestand,data){
 for(const m of (await vervolg('mutaties')).filter(m=>m.bestand===bestand).toReversed()){
  const pad=m.json_pointer.split('/').slice(1).map(x=>/^\d+$/.test(x)?Number(x):x);let p=data;for(const k of pad.slice(0,-1))p=p[k];const k=pad.at(-1);assert.equal(p[k],m.nieuw);p[k]=m.oud;
 }return data;
}
export async function bestandNaVervolgcontrole(pad,oud){const m=(await vervolg('bestandsmutaties'))[pad];if(!m)return oud;assert.equal(m.voor_sha256,oud);return m.na_sha256;}
/** Houd eerdere bewijsregistraties intact: keer alleen de nieuwe, expliciete tekstmutaties om. */
export async function voorTekstkwaliteit(bestand,data){
 data=await voorVervolgcontrole(bestand,data);
 for(const m of (await lees('mutaties')).filter(m=>m.bestand===bestand).toReversed()){
  let p=data;for(const k of m.pad.slice(0,-1))p=p[k];const k=m.pad.at(-1);
  assert.deepEqual(p[k],m.na,`${bestand} ${m.json_pointer}: geregistreerde nieuwe tekst`);p[k]=structuredClone(m.voor);
 }
 return data;
}
export async function bestandNaTekstkwaliteit(pad,oud){
 const m=(await lees('bestandsmutaties'))[pad];if(!m)return bestandNaVervolgcontrole(pad,oud);
 assert.equal(m.voor_sha256,oud,`${pad}: historische hashketen`);return bestandNaVervolgcontrole(pad,m.na_sha256);
}
