import test from 'node:test';
import {bestandNaBronherijking} from './helpers/bronherijking.mjs';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const read=async p=>JSON.parse(await readFile(p,'utf8'));
const dir='documentatie/bronherijking/';
const hash=x=>createHash('sha256').update(x).digest('hex');
test('bronherijking: drie aangewezen bronidentiteiten, oorspronkelijke IDs en codes behouden',async()=>{
 const manifest=await read('bronnen/semantische-selectie-tool-bronset-2026-11-25.json');const v=await read(dir+'bronverificatie.json');const nul=await read(dir+'nulmeting.json');
 assert.equal(v.length,3);
 for(const s of manifest.bronnen){
  const r=v.find(r=>r.lijst===s.lijst);assert.equal(r.sha256_berekend,s.sha256);assert.equal(r.identiteit_bevestigd,true);assert.equal(r.bytes,s.bytes);assert.equal(r.pdf_paginas,s.pdf_paginas);
  for(const name of ['structuur','selectiegegevens','zoeklexicon','relaties']){
   const data=await read(`datasets/${s.lijst}/${name}.json`);assert.deepEqual(data.map(r=>r.id),nul.identificaties[s.lijst][name]);assert.equal(new Set(data.map(r=>r.id)).size,data.length);
  }
  const ds=await read(`datasets/${s.lijst}/manifest.json`);const lead=ds.bronnenregister.find(r=>r.status==='leidend_voor_herijking_opdracht_2026-11-25');assert.ok(lead);assert.equal(lead.oorspronkelijke_sha256,s.sha256);
  const bron=await read(`bronnen/${lead.id}.bron.json`);assert.equal(bron.inhoud_meegeleverd,false);assert.equal(bron.oorspronkelijke_sha256,s.sha256);assert.equal(hash(await readFile(`bronnen/${lead.id}.bron.json`)),lead.sha256);
 }
 const telling=await read(dir+'bronherijking-tellingen.json');assert.deepEqual(telling.resultaatcodes,{'1996-2012':494,'2017':305,'2020':346});assert.equal(telling.volledige_pdf_paginas,334);assert.equal(telling.gewijzigde_normatieve_selectieveldwaarden,4);assert.equal(telling.inhoudelijke_of_juridische_besluiten_genomen,0);
});
test('bronherijking: lege 2017-PDF-cellen worden geen nieuwe termijnbeslissing',async()=>{
 const r=await read('datasets/2017/selectiegegevens.json');
 for(const code of ['7.1.2','7.1.3','7.1.5','7.1.6']){
  const d=r.find(d=>d.code===code);assert.equal(d.procestermijn.officiele_tekst,'Nihil');assert.equal(d.procestermijn.bron.bron_id,'2017-officiele-xls');assert.equal(d.procestermijn.oorspronkelijke_pdf_cel,null);assert.equal(d.procestermijn.status,'niet_opnieuw_bevestigd_uit_leidende_pdf');assert.ok(d.verificatie.bevindingen.some(s=>s.includes('Eerdere expliciete XLS-bronkeuze')));assert.ok(d.verificatie.bronannotaties.length);
 }
});
test('bronherijking: zelfstandige 2012-bronankers verantwoorden 494 bestaande regels',async()=>{
 const anchors=await read(dir+'onafhankelijke-waarderingsankers-1996-2012.json');const ids=new Set(anchors.flatMap(r=>r.bestaande_record_ids_op_dezelfde_bronlocatie));assert.equal(anchors.length,489);assert.equal(ids.size,494);const records=await read('datasets/1996-2012/selectiegegevens.json');for(const r of records)assert.ok(ids.has(r.id));
 const pixels=await read(dir+'glyph-rendercontrole.json');assert.equal(pixels.alle_120_paginas_identiek,true);assert.equal(pixels.paginas.length,120);for(const p of pixels.paginas)assert.equal(p.rendering_voor_sha256,p.rendering_na_sha256);
});
test('bronherijking: volledige leidende pagina’s, leesbare voetnoten en afzonderlijke bijlage 8',async()=>{
 const expected={'1996-2012':[120,'1996-2012-leidend-2026-11-25'],'2017':[101,'2017-opgemaakt'],'2020':[113,'2020-officieel']};
 for(const [id,[n,source]]of Object.entries(expected)){
  const pages=await read(`datasets/${id}/bepalingen.json`);assert.equal(pages.length,n);assert.deepEqual(pages.map(p=>p.bron.pdf_pagina),Array.from({length:n},(_,i)=>i+1));for(const p of pages){assert.equal(p.bron.bron_id,source);assert.equal(p.interpretatie,false);assert.equal(p.tekst,p.tekst_leesbaar);}
 }
 const ss=await read('datasets/1996-2012/selectiegegevens.json');assert.match(ss.find(r=>r.id==='1996-2012:2.11::003').officiele_omschrijving,/\(metadata\)/);assert.match(ss.find(r=>r.id==='1996-2012:3.1.2::001').officiele_omschrijving,/\(zie ook 2\.10\)$/);
 const a=await read('datasets/1996-2012/bepalingen.json');assert.match(a[17].tekst,/Toelichting:/);assert.match(a[17].tekst,/raadspresidium/);
 const b=await read('datasets/2020/wijzigingen.json');assert.equal(b[0].bron.pdf_pagina,88);assert.ok(b.every(p=>p.type==='bijlage_8_officieel_wijzigingsoverzicht'));
});
test('bronherijking: alle 7876 concordanscellen en bestaande zoekrelaties onveranderd',async()=>{
 const ref=await read(dir+'concordans-integriteit.json');const bytes=await readFile('publicatie/concordans.json');assert.equal(hash(bytes),ref.sha256_bestand_na);const c=JSON.parse(bytes);assert.equal(c.rijen.length,716);assert.ok(c.rijen.every(r=>r.waarden.length===11));assert.equal(ref['517_kandidaten_niet_toegevoegd'],true);
 const nul=await read(dir+'nulmeting.json');
 for(const id of ['1996-2012','2017','2020']){const before=nul.bestaande_bronannotaties[id];const now=await read(`datasets/${id}/bronannotaties.json`);assert.deepEqual(now.slice(0,before.length),before);}
 for(const id of ['1996-2012','2017','2020'])for(const n of ['zoeklexicon','relaties','testvragen']){const path=`datasets/${id}/${n}.json`;assert.equal(hash(await readFile(path)),await bestandNaBronherijking(path,nul.bestandshashes[path]),path);}
});
