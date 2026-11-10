import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { maakGegevenslaag } from '../dist/gegevenslaag/index.js';
import { maakZoekindex, normaliseer, markeerbereiken, RANGREDENEN } from '../dist/zoeken/index.js';
const root = new URL('../datasets/',import.meta.url);
const laag = maakGegevenslaag({ datasetsUrl: root, ophalen: async url=>new Response(await readFile(url,'utf8')) });
const datasets = Object.fromEntries(await Promise.all(['1996-2012','2017','2020'].map(async id=>[id,await laag.laadDataset(id)])));
const indexen = Object.fromEntries(Object.entries(datasets).map(([id,d])=>[id,maakZoekindex(d)]));
const bevat = (resultaten,id)=>resultaten.some(r=>r.id===id);

test('officiële codes exact vóór onderliggende codes; geen technische suffixen als code',()=>{
  const rs=indexen['2020'].zoek(' １．１ ');
  assert.equal(rs[0].id,'2020:1.1');assert.equal(rs[0].rang,1);
  assert.ok(rs.slice(1).every(r=>r.rang===5 && r.code.startsWith('1.1.')));
  assert.ok(indexen['1996-2012'].zoek('2.1').filter(r=>r.rang===1).length>1);
  assert.ok(indexen['1996-2012'].zoek('2.1').every(r=>!r.code.includes('::')));
});
test('exacte naam, hoofdletters, diakritiek, brede Unicode en gedeeltelijke tekst',()=>{
  for(const q of ['Gemeentewapen','GEMEENTEWAPEN','Ｇｅｍｅｅｎｔｅｗａｐｅｎ','🗃 Gemeentewapen']) {
    const rs=indexen['2020'].zoek(q);assert.equal(rs[0].id,'2020:1.1.2');assert.equal(rs[0].rang,2);
  }
  assert.ok(bevat(indexen['1996-2012'].zoek('FINANCIELE CONTROLE'),'1996-2012:2.3::002'));
  assert.equal(indexen['2020'].zoek('gemeentewap')[0].rang,5);
});
test('interpunctie, Unicode-witruimte en accentcompositie normaliseren gelijk',()=>{
  assert.equal(normaliseer('  FINANCIËLE—controle…\u00a0 '),'financiele controle');
  assert.equal(normaliseer('clie\u0308nt'),'client');
  assert.equal(normaliseer('jeugd-\r\nhulp'),'jeugdhulp');
  assert.equal(normaliseer('jeugd\u2010\u2028hulp'),'jeugdhulp');
  assert.equal(normaliseer('jeugd\u00adhulp'),'jeugdhulp');
  assert.equal(normaliseer('wet- en regelgeving'),'wet en regelgeving');
  assert.ok(bevat(indexen['2020'].zoek('jeugdhulp client'),'2020:3.1.4'));
  assert.ok(bevat(indexen['2020'].zoek('archiefvernietiging'),'2020:19.1.19'));
});
test('meerdere unieke zoekwoorden vereisen EN, woordvolgorde mag verschillen',()=>{
  const a=indexen['2020'].zoek('plan aanpak client');const b=indexen['2020'].zoek('client plan aanpak plan');
  assert.deepEqual(a.map(r=>r.id),b.map(r=>r.id));
  assert.ok(bevat(a,'2020:3.1.4'));assert.ok(bevat(a,'2020:3.1.5'));
  assert.ok(!bevat(a,'2020:1.1.2'));
  assert.equal(indexen['2020'].zoek('plan onbestaanbaarzoekwoord').length,0);
});
test('controleerbare rangschikking: exact, belangrijke woorden, toelichting en deelwoorden',()=>{
  for(const q of ['Gemeentewapen','plan','vergader','jeugdhulp','organisatie']) {
    const rs=indexen['2020'].zoek(q);
    assert.ok(rs.every((r,i)=>i===0||rs[i-1].rang<=r.rang));
    assert.ok(rs.every(r=>r.reden===RANGREDENEN[r.rang]));
    assert.deepEqual(rs,indexen['2020'].zoek(q));
  }
  assert.equal(indexen['2020'].zoek('Gemeentewapen')[0].rang,2);
  const woord=indexen['2020'].zoek('plan');assert.ok(woord.some(r=>r.rang===3));assert.ok(woord.some(r=>r.rang===4));assert.ok(woord.some(r=>r.rang===5));
});
test('1996: alle voorschriftregels met één code afzonderlijk en in bronvolgorde bereikbaar',()=>{
  const origineel=datasets['1996-2012'].selectiegegevensBij('1996-2012:3.6.2');
  const rs=indexen['1996-2012'].zoek('3.6.2').filter(r=>r.type==='voorschrift');
  assert.equal(rs.length,36);assert.deepEqual(rs.map(r=>r.id),origineel.map(r=>r.id));
  assert.ok(rs.every(r=>r.code==='3.6.2'&&r.context.includes('3.6.2')));
});
for(const id of ['2017','2020']) {
  test(`${id}: generieke/specifieke resultaten zonder dubbele canonieke ID`,()=>{
    const rs=indexen[id].zoek('1.1');
    assert.equal(rs.filter(r=>r.id===`${id}:1.1`).length,1);
    assert.equal(rs.find(r=>r.id===`${id}:1.1`).type,'generiek_resultaat');
    assert.equal(rs.find(r=>r.id===`${id}:1.1.1`).type,'specifiek_resultaat');
  });
}
test('vervallen uitsluitend via status, standaard uit en expliciet in',()=>{
  for(const id of ['2020:7.1.20','2020:19.1.13']) {
    const r=datasets['2020'].selectiegegeven(id);
    assert.equal(r.status,'vervallen');
    assert.ok(!bevat(indexen['2020'].zoek(r.code),id));
    assert.ok(bevat(indexen['2020'].zoek(r.code,{vervallenMeenemen:true}),id));
  }
  assert.ok(indexen['2020'].zoek('vervallen').every(r=>!r.vervallen));
  assert.ok(indexen['2020'].zoek('vervallen',{vervallenMeenemen:true}).some(r=>r.id==='2020:19.1.13'));
});
test('algemene procestekst wordt niet als geërfde zoektekst op alle resultaten gezet',()=>{
  const rs=indexen['2020'].zoek('aangifte bepaald feit');
  assert.ok(bevat(rs,'2020:7'));
  assert.ok(!bevat(rs,'2020:7.1.1'));
});
test('indexen en resultaten blijven uitsluitend binnen de eigen lijst',()=>{
  for(const id of Object.keys(indexen)) {
    const rs=indexen[id].zoek('2.1');
    assert.ok(rs.length);assert.ok(rs.every(r=>r.selectielijst===id&&r.id.startsWith(`${id}:`)));
    assert.equal(indexen[id].selectielijst,id);
  }
});
test('lege, louter interpunctie en onbekende opdrachten geven geen resultaten',()=>{
  for(const q of ['','  ','…—?!','🗃','onbestaanbaarzoekwoord'])assert.deepEqual(indexen['2020'].zoek(q),[]);
});
test('markering behoudt bronbytes, Unicode-posities en afgebroken woorden',()=>{
  for(const [tekst,q] of [['Financiële controle','financiele'],['clie\u0308nt','client'],['jeugd-\nhulp','jeugdhulp'],['𝔊emeentewapen','gemeentewapen']]) {
    const b=markeerbereiken(tekst,q);assert.equal(b.length,1);
    assert.equal(normaliseer(tekst.slice(b[0].begin,b[0].einde)),normaliseer(q));
  }
  assert.deepEqual(markeerbereiken('Gemeentewapen','x'),[]);
});
test('geschikte bestaande testvragen: officiële bronfragmenten blijven vindbaar',async()=>{
  const voorbeelden=[['1996-2012',0],['2017',0],['2020',0]];
  for(const [id,n] of voorbeelden) {
    const vragen=JSON.parse(await readFile(new URL(`${id}/testvragen.json`,root),'utf8'));const q=vragen[n];
    const rs=indexen[id].zoek(q.controleerbaar_bronfragment);
    assert.ok(q.verwachte_relevante_categorieen.some(id=>bevat(rs,id)),`${q.id}: ${q.controleerbaar_bronfragment}`);
  }
});

test('alle bestaande bronfragmenten vinden een verwachte categorie of een voorschrift daarbinnen',async()=>{
  for(const id of Object.keys(indexen)) {
    const vragen=JSON.parse(await readFile(new URL(`${id}/testvragen.json`,root),'utf8'));
    for(const q of vragen) {
      const verwacht=[...q.verwachte_relevante_categorieen,...q.alternatieve_relevante_categorieen];
      const rs=indexen[id].zoek(q.controleerbaar_bronfragment);
      assert.ok(rs.some(r=>datasets[id].padNaar(r.id).some(s=>verwacht.includes(s.gegevens.id))),q.id);
    }
  }
});
