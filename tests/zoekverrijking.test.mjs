import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import {maakGegevenslaag,Gegevensfout} from '../dist/gegevenslaag/index.js';
const basis=new URL('../datasets/',import.meta.url);
function omgeving(wijzig=()=>{}){const urls=[];return {urls,laag:maakGegevenslaag({datasetsUrl:basis,ophalen:async u=>{urls.push(u.href);const data=JSON.parse(await readFile(u,'utf8'));wijzig(data,u);return new Response(JSON.stringify(data));}})};}
for(const [id,termen,relaties]of[['1996-2012',1005,1111],['2017',1342,1647],['2020',1746,2092]])test(`${id}: lexicons alleen op aanvraag, validatie, gezamenlijke cache en readonly`,async()=>{
 const {laag,urls}=omgeving();await laag.laadDataset(id);assert.equal(urls.length,3);
 const [a,b]=await Promise.all([laag.laadZoekverrijking(id),laag.laadZoekverrijking(id)]);
 assert.strictEqual(a,b);assert.equal(a.zoeklexicon.length,termen);assert.equal(a.relaties.length,relaties);assert.equal(urls.length,5);assert.ok(urls.every(u=>u.includes(`/${id}/`)));
 await laag.laadZoekverrijking(id);assert.equal(urls.length,5);assert.throws(()=>a.zoeklexicon.pop(),TypeError);
});
for(const [naam,wijzig,code]of[
 ['dubbele term',(d,u)=>{if(u.pathname.endsWith('zoeklexicon.json'))d.push(d[0]);},'DUBBELE_ID'],
 ['verkeerde lijst',(d,u)=>{if(u.pathname.endsWith('zoeklexicon.json'))d[0].onderdeel_id='2017:1';},'ONGELDIGE_VERWIJZING'],
 ['verkeerde bronterm',(d,u)=>{if(u.pathname.endsWith('relaties.json'))d[0].van='2020:term:ontbreekt';},'ONGELDIGE_VERWIJZING'],
 ['ongeldig schema',(d,u)=>{if(u.pathname.endsWith('zoeklexicon.json'))delete d[0].beoordelingsstatus;},'SCHEMAFOUT'],
 ['afwijkend manifest',(d,u)=>{if(u.pathname.endsWith('manifest.json'))d.aantallen.zoektermrelaties++;},'MANIFESTFOUT'],
])test(`zoekverrijking blokkeert ${naam}`,async()=>{const {laag}=omgeving(wijzig);await assert.rejects(laag.laadZoekverrijking('2020'),e=>e instanceof Gegevensfout&&e.code===code);});
test('ontbrekend lexicon geeft laadfout en kan bij opnieuw aanvragen herstellen',async()=>{
 let faalt=true;const laag=maakGegevenslaag({datasetsUrl:basis,ophalen:async u=>faalt&&u.pathname.endsWith('zoeklexicon.json')?new Response('',{status:404}):new Response(await readFile(u,'utf8'))});
 await assert.rejects(laag.laadZoekverrijking('2020'),e=>e.code==='LADEN_MISLUKT');faalt=false;assert.equal((await laag.laadZoekverrijking('2020')).selectielijst,'2020');
});
