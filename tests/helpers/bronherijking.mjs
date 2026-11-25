// De historische woordafbrekingscontrole blijft geldig ná expliciete bronmetadatawijzigingen.
import assert from 'node:assert/strict';
import {voorTekstkwaliteit,bestandNaTekstkwaliteit} from './tekstkwaliteit.mjs';
import {readFile} from 'node:fs/promises';
const read=async name=>JSON.parse(await readFile(`documentatie/bronherijking/${name}.json`,'utf8'));
export async function voorBronherijking(bestand,data){
 data=await voorTekstkwaliteit(bestand,data);
 const mutaties=await read('veldmutaties');
 for(const m of (mutaties[bestand]??[]).toReversed()){
  let ouder=(Array.isArray(data)?data:data.rijen).find(r=>r.id===m.record_id);assert.ok(ouder,m.record_id);
  const pad=m.veld.split('.');for(const key of pad.slice(0,-1))ouder=ouder[key];
  const key=pad.at(-1);assert.deepEqual(ouder[key],m.na,`${bestand}: ${m.record_id} ${m.veld}`);ouder[key]=structuredClone(m.voor);
 }
 return data;
}
export async function manifestVoorBronherijking(id,data){
 const m=(await read('manifestmetadata'))[id];const actueel=structuredClone(data);delete actueel.sha256;
 assert.deepEqual(actueel,m.na,`${id}: alleen expliciet geregistreerde manifestwijzigingen`);
 return structuredClone(m.voor);
}
export async function bestandNaBronherijking(pad,oud){
 const m=(await read('bestandsmutaties'))[pad];if(!m)return bestandNaTekstkwaliteit(pad,oud);
 assert.equal(m.voor_sha256,oud,`${pad}: oorspronkelijke historische hash behouden`);return bestandNaTekstkwaliteit(pad,m.na_sha256);
}
