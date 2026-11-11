import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {maakGegevenslaag} from '../dist/gegevenslaag/index.js';
import {selectieTekst} from '../dist/interface/kopieer.js';
const laag=maakGegevenslaag({datasetsUrl:new URL('../datasets/',import.meta.url),ophalen:async url=>new Response(await readFile(url,'utf8'))});
for(const lijst of ['1996-2012','2017','2020'])test(`${lijst}: alle kopieerteksten behouden beschikbare officiële waarden zonder technische suffix of null`,async()=>{
 const ds=await laag.laadDataset(lijst);
 for(const r of ds.selectiegegevens){const tekst=selectieTekst(ds,r);assert.ok(tekst.includes(`Officiële code: ${r.code}`));assert.ok(tekst.includes(r.officiele_benaming));assert.ok(tekst.includes(ds.manifest.officiele_titel));assert.ok(!tekst.includes('::'));assert.ok(!tekst.includes('null'));
 for(const w of [r.bewaartermijn.officiele_tekst,r.waardering.officiele_tekst,r.aanvangsmoment.officiele_tekst,r.procestermijn.officiele_tekst,r.toelichting,r.uitzonderingen_en_verwijzingen.officiele_tekst])if(w?.trim())assert.ok(tekst.includes(w),r.id);
 for(const a of ds.bronannotatiesBij(r.id)){assert.ok(tekst.includes(a.bevinding));assert.ok(tekst.includes(a.verwerking));}
 }
});
test('ontbrekende termijnen worden niet als bronwaarden verzonnen',async()=>{const ds=await laag.laadDataset('2020');const r=ds.selectiegegeven('2020:22.1.3');assert.equal(r.bewaartermijn.officiele_tekst,null);const tekst=selectieTekst(ds,r);assert.ok(!tekst.includes('Bewaartermijn:'));assert.ok(tekst.includes(r.toelichting));assert.ok(tekst.includes('Documentbrede bronlink: https:'));});

test('1996 vernietiging zonder afzonderlijke waarderingsletter behoudt de bronlegenda-duiding',async()=>{const ds=await laag.laadDataset('1996-2012');const r=ds.selectiegegeven('1996-2012:2.1::002');assert.equal(r.waardering.officiele_tekst,null);assert.equal(r.waardering.type,'vernietigen');assert.ok(selectieTekst(ds,r).includes('Waardering volgens bronlegenda (geen afzonderlijke waarderingsletter): Vernietigen'));});
