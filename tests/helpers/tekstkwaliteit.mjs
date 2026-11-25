import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const lees=async n=>JSON.parse(await readFile(`documentatie/tekstkwaliteit/${n}.json`,'utf8'));
/** Houd eerdere bewijsregistraties intact: keer alleen de nieuwe, expliciete tekstmutaties om. */
export async function voorTekstkwaliteit(bestand,data){
 for(const m of (await lees('mutaties')).filter(m=>m.bestand===bestand).toReversed()){
  let p=data;for(const k of m.pad.slice(0,-1))p=p[k];const k=m.pad.at(-1);
  assert.deepEqual(p[k],m.na,`${bestand} ${m.json_pointer}: geregistreerde nieuwe tekst`);p[k]=structuredClone(m.voor);
 }
 return data;
}
export async function bestandNaTekstkwaliteit(pad,oud){
 const m=(await lees('bestandsmutaties'))[pad];if(!m)return oud;
 assert.equal(m.voor_sha256,oud,`${pad}: historische hashketen`);return m.na_sha256;
}
