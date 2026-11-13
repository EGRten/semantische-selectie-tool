import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { maakGegevenslaag, SELECTIELIJSTEN, Gegevensfout } from '../dist/gegevenslaag/index.js';

const root = new URL('../', import.meta.url);
const basis = new URL('https://voorbeeld.invalid/project/subpad/datasets/');
async function bron(lijst, bestand) {
  return JSON.parse(await readFile(new URL(`datasets/${lijst}/${bestand}.json`, root), 'utf8'));
}
function omgeving(wijzig = () => {}, ophalen) {
  const aanvragen = [];
  const laag = maakGegevenslaag({ datasetsUrl: basis, ophalen: async url => {
    aanvragen.push(url.href);
    if (ophalen) return ophalen(url, aanvragen.length);
    assert.ok(url.href.startsWith(basis.href));
    const [lijst, naam] = url.href.slice(basis.href.length).split('/');
    const bestand = naam.replace(/\.json$/, '');
    const data = await bron(lijst, bestand);
    wijzig(data, bestand, lijst);
    return new Response(JSON.stringify(data));
  } });
  return { laag, aanvragen };
}
function isFout(code) {
  return error => error instanceof Gegevensfout && error.code === code;
}

for (const [lijst, nodes, regels, roots] of [
  ['1996-2012', 108, 494, 2], ['2017', 334, 305, 29], ['2020', 375, 346, 29],
]) {
  test(`${lijst}: alleen gekozen lijst laden, manifest, indexen en bronwaarden`, async () => {
    const { laag, aanvragen } = omgeving();
    const dataset = await laag.laadDataset(lijst);
    assert.equal(dataset.id, lijst);
    assert.equal(dataset.structuur.length, nodes);
    assert.equal(dataset.selectiegegevens.length, regels);
    assert.equal(dataset.hoofdonderdelen().length, roots);
    assert.equal(aanvragen.length, 3);
    assert.deepEqual(aanvragen.map(u => u.slice(basis.href.length)).sort(),
      ['manifest', 'selectiegegevens', 'structuur'].map(n => `${lijst}/${n}.json`).sort());
    assert.deepEqual(dataset.manifest, await bron(lijst, 'manifest'));
    assert.deepEqual(dataset.structuur, await bron(lijst, 'structuur'));
    assert.deepEqual(dataset.selectiegegevens, await bron(lijst, 'selectiegegevens'));
    for (const node of dataset.structuur) {
      assert.strictEqual(dataset.structuuronderdeel(node.id), node);
      const verwacht = dataset.structuur.filter(n => n.parent_id === node.id).sort((a,b) => a.volgorde-b.volgorde);
      assert.deepEqual(dataset.kinderen(node.id), verwacht);
      assert.equal(dataset.ouder(node.id)?.id ?? null, node.parent_id);
    }
    for (const regel of dataset.selectiegegevens) {
      assert.strictEqual(dataset.selectiegegeven(regel.id), regel);
      assert.equal(dataset.structuurBijSelectiegegeven(regel.id).id, regel.structuur_id);
      assert.ok(dataset.selectiegegevensBij(regel.structuur_id).includes(regel));
    }
  });
}

test('vaste lijst en geen fetch bij aanmaken of onbekende lijst', () => {
  const { laag, aanvragen } = omgeving();
  assert.deepEqual(SELECTIELIJSTEN, ['1996-2012', '2017', '2020']);
  assert.throws(() => SELECTIELIJSTEN.push('2025'), TypeError);
  assert.throws(() => laag.laadDataset('../2017'), isFout('ONBEKENDE_LIJST'));
  assert.throws(() => laag.laadManifest('onbekend'), isFout('ONBEKENDE_LIJST'));
  assert.equal(aanvragen.length, 0);
});

test('manifest afzonderlijk laden, parallelle aanvragen en sessiecache delen', async () => {
  const { laag, aanvragen } = omgeving();
  const [m1, m2] = await Promise.all([laag.laadManifest('2017'), laag.laadManifest('2017')]);
  assert.strictEqual(m1, m2);
  assert.equal(aanvragen.length, 1);
  const [d1, d2] = await Promise.all([laag.laadDataset('2017'), laag.laadDataset('2017')]);
  assert.strictEqual(d1, d2);
  assert.strictEqual(d1.manifest, m1);
  assert.strictEqual(await laag.laadDataset('2017'), d1);
  assert.equal(aanvragen.length, 3);
  const andere = await laag.laadDataset('2020');
  assert.notStrictEqual(andere, d1);
  assert.equal(aanvragen.length, 6);
});

test('officiële volgorde wordt via volgorde hersteld, geen lexicografische sortering', async () => {
  const { laag } = omgeving((data, bestand) => { if (bestand === 'structuur') data.reverse(); });
  const d = await laag.laadDataset('2020');
  assert.deepEqual(d.hoofdonderdelen().map(n => n.code), Array.from({ length: 29 }, (_, i) => String(i + 1)));
  assert.deepEqual(d.kinderen('2020:1.1').map(n => n.code), ['1.1.1','1.1.2','1.1.3']);
  assert.deepEqual(d.kinderen('2020:19.1').map(n => n.code), Array.from({ length: 24 }, (_, i) => `19.1.${i + 1}`));
});

test('1996: hoofdstuk, taakveld, rubriek en meerdere technische voorschriften', async () => {
  const { laag } = omgeving();
  const d = await laag.laadDataset('1996-2012');
  const regels = d.selectiegegevensBij('1996-2012:3.6.2');
  assert.equal(regels.length, 36);
  assert.deepEqual(regels, (await bron('1996-2012','selectiegegevens')).filter(r => r.structuur_id === '1996-2012:3.6.2'));
  const regel = regels[0];
  assert.equal(regel.code, '3.6.2');
  assert.match(regel.id, /::001$/);
  assert.equal(d.ouder(regel.id).id, '1996-2012:3.6.2');
  const pad = d.padNaar(regel.id);
  assert.deepEqual(pad.map(p => p.soort), ['structuur','structuur','structuur','voorschrift']);
  assert.deepEqual(pad.slice(0,3).map(p => p.gegevens.type), ['hoofdstuk','taakveld','rubriek']);
  assert.deepEqual(pad.map(p => p.gegevens.id), ['1996-2012:3','1996-2012:3.6','1996-2012:3.6.2',regel.id]);
  assert.deepEqual(d.padNaar('1996-2012:2.1').map(p => p.gegevens.id), ['1996-2012:2','1996-2012:2.1']);
});

for (const lijst of ['2017','2020']) {
  test(`${lijst}: procestype, generiek en specifiek resultaat zonder verzonnen laag`, async () => {
    const { laag } = omgeving();
    const d = await laag.laadDataset(lijst);
    assert.deepEqual(d.padNaar(`${lijst}:1.1.1`).map(p => [p.soort,p.gegevens.type]), [
      ['structuur','procestype'],['structuur','generiek_resultaat'],['structuur','specifiek_resultaat'],
    ]);
    assert.equal(d.ouder(`${lijst}:1.1.1`).id, `${lijst}:1.1`);
    assert.equal(d.ouder(`${lijst}:1`), null);
    assert.equal(d.selectiegegevensBij(`${lijst}:1.1.1`).length, 1);
  });
}

test('samengestelde waardering, termijnen, null en status ongewijzigd behouden', async () => {
  const { laag } = omgeving();
  const d = await laag.laadDataset('2020');
  const r = d.selectiegegeven('2020:22.1.2');
  const origineel = (await bron('2020','selectiegegevens')).find(s => s.id === r.id);
  assert.equal(r.waardering.type, 'samengesteld');
  assert.deepEqual(r, origineel);
  assert.equal(r.bewaartermijn.officiele_tekst, null);
  assert.equal(r.bewaartermijn.status, 'niet_ingevuld_in_bron');
  assert.ok(r.toelichting.length > 0);
  const bewaard = d.selectiegegevens.find(s => s.waardering.type === 'bewaren' && s.aanvangsmoment.officiele_tekst === null);
  assert.ok(bewaard);
  assert.notEqual(bewaard.aanvangsmoment.status, 'niet_ingevuld_in_bron');
});

test('alle gerichte bronbijzonderheden en annotaties blijven behouden', async () => {
  const { laag } = omgeving();
  const d17 = await laag.laadDataset('2017');
  for (const code of ['7.1.2','7.1.3','7.1.5','7.1.6']) {
    const r = d17.selectiegegeven(`2017:${code}`);
    assert.equal(r.procestermijn.officiele_tekst, 'Nihil');
    assert.equal(r.procestermijn.bron.bron_id, '2017-officiele-xls');
    assert.ok(d17.bronannotatiesBij(r.id).length);
  }
  const d = await laag.laadDataset('2020');
  const annotaties = await bron('2020','bronannotaties');
  for (const annotatie of annotaties) assert.deepEqual(d.bronannotatiesBij(annotatie.onderdeel_id), [annotatie]);
  for (let i = 19; i <= 24; i++) assert.equal(d.selectiegegeven(`2020:19.1.${i}`).resultaattype, 'Archiefvernietiging');
  assert.ok(d.selectiegegeven('2020:22.1.3').toelichting.endsWith('geldige of onbruikbaar'));
  assert.deepEqual(d.selectiegegevens.filter(r => r.status === 'vervallen').map(r => r.code), ['7.1.20','19.1.13']);
});

test('onbekende opvraag-ID geeft geen record of lege lijst, cache blijft onveranderlijk', async () => {
  const { laag } = omgeving();
  const d = await laag.laadDataset('2020');
  for (const id of ['onbekend','2017:1.1']) {
    assert.equal(d.structuuronderdeel(id), undefined);
    assert.equal(d.selectiegegeven(id), undefined);
    assert.equal(d.structuurBijSelectiegegeven(id), undefined);
    assert.equal(d.ouder(id), undefined);
    assert.equal(d.padNaar(id), undefined);
    assert.deepEqual(d.kinderen(id), []);
    assert.deepEqual(d.selectiegegevensBij(id), []);
    assert.deepEqual(d.bronannotatiesBij(id), []);
  }
  const r = d.selectiegegeven('2020:22.1.3');
  assert.throws(() => { r.bewaartermijn.officiele_tekst = 'veranderd'; }, TypeError);
  assert.throws(() => d.kinderen('2020:1').pop(), TypeError);
  assert.throws(() => d.bronannotatiesBij(r.id)[0].bronvarianten.pop(), TypeError);
  assert.throws(() => d.padNaar(r.id).pop(), TypeError);
  assert.strictEqual(await laag.laadDataset('2020'), d);
});

const kapotteData = [
  ['dubbele structuur-ID','DUBBELE_ID', (x,n) => { if(n==='structuur') x.push(x[0]); }],
  ['dubbele selectie-ID','DUBBELE_ID', (x,n) => { if(n==='selectiegegevens') x.push(x[0]); }],
  ['ontbrekende ouder','ONGELDIGE_VERWIJZING', (x,n) => { if(n==='structuur') x[0].parent_id='2020:ontbreekt'; }],
  ['ontbrekende structuurverwijzing','ONGELDIGE_VERWIJZING', (x,n) => { if(n==='selectiegegevens') x[0].structuur_id='2020:ontbreekt'; }],
  ['verwijzing andere lijst','ONGELDIGE_VERWIJZING', (x,n) => { if(n==='structuur') x[0].parent_id='2017:1'; }],
  ['selectie andere lijst','ONGELDIGE_VERWIJZING', (x,n) => { if(n==='selectiegegevens') x[0].id='2017:1.1'; }],
  ['structuur andere lijst','ONGELDIGE_VERWIJZING', (x,n) => { if(n==='structuur') x[0].id='2017:1'; }],
  ['cyclus','CYCLUS', (x,n) => { if(n==='structuur') x[0].parent_id=x[1].id; }],
  ['zelfcyclus','CYCLUS', (x,n) => { if(n==='structuur') x[0].parent_id=x[0].id; }],
  ['generiek resultaat ontbreekt','ONGELDIGE_VERWIJZING', (x,n) => { if(n==='selectiegegevens') x[0].procestermijn.generiek_resultaat_id='2020:ontbreekt'; }],
  ['annotatie verkeerde lijst','ONGELDIGE_VERWIJZING', (x,n) => { if(n==='selectiegegevens') x.find(r => r.verificatie.bronannotaties?.length).verificatie.bronannotaties[0].lijst='2017'; }],
  ['gedeelde ID verkeerde structuur','ONGELDIGE_VERWIJZING', (x,n) => { if(n==='selectiegegevens') x[0].structuur_id='2020:1'; }],
  ['verplicht veld ontbreekt','SCHEMAFOUT', (x,n) => { if(n==='structuur') delete x[0].parent_id; }],
  ['verkeerd datatype','SCHEMAFOUT', (x,n) => { if(n==='structuur') x[0].volgorde='1'; }],
  ['ontbrekende bronstatus','SCHEMAFOUT', (x,n) => { if(n==='selectiegegevens') delete x[0].bewaartermijn.status; }],
  ['ongeldig manifest','SCHEMAFOUT', (x,n) => { if(n==='manifest') delete x.aantallen; }],
  ['verkeerde manifestlijst','MANIFESTFOUT', (x,n) => { if(n==='manifest') x.selectielijst_id='2017'; }],
  ['verkeerde manifesttelling','MANIFESTFOUT', (x,n) => { if(n==='manifest') x.aantallen.structuuronderdelen++; }],
];
for (const [naam, code, wijzig] of kapotteData) {
  test(`blokkerende validatie: ${naam}`, async () => {
    const { laag } = omgeving(wijzig);
    await assert.rejects(laag.laadDataset('2020'), isFout(code));
  });
}

for (const bestand of ['manifest','structuur','selectiegegevens']) {
  test(`ontbrekend ${bestand}.json wordt gemeld; een volgende aanvraag kan herstellen`, async () => {
    let faalt = true;
    const { laag } = omgeving(undefined, async url => {
      const naam = url.pathname.split('/').at(-1).replace('.json','');
      if (naam === bestand && faalt) return new Response('ontbreekt', { status: 404 });
      return new Response(JSON.stringify(await bron('2020',naam)));
    });
    await assert.rejects(laag.laadDataset('2020'), e => isFout('LADEN_MISLUKT')(e) && e.message.includes(`${bestand}.json`));
    faalt = false;
    assert.equal((await laag.laadDataset('2020')).selectiegegevens.length, 346);
  });
}

test('ongeldige JSON en netwerkfouten hebben verschillende foutcodes', async () => {
  const kapot = omgeving(undefined, async () => new Response('{ongeldige json'));
  await assert.rejects(kapot.laag.laadManifest('2017'), isFout('ONGELDIGE_JSON'));
  const netwerk = omgeving(undefined, async () => { throw new Error('offline'); });
  await assert.rejects(netwerk.laag.laadManifest('2017'), e => isFout('LADEN_MISLUKT')(e) && e.cause.message === 'offline');
});

test('map-URL vereist expliciete trailing slash zonder query of fragment', () => {
  for (const u of ['https://voorbeeld.invalid/datasets','https://voorbeeld.invalid/datasets/?x=1','https://voorbeeld.invalid/datasets/#x']) {
    assert.throws(() => maakGegevenslaag({ datasetsUrl: new URL(u) }), TypeError);
  }
});

test('gebundelde browsermodule met native fetch werkt onder een HTTP-subpad', async t => {
  const requests = [];
  const server = createServer(async (req,res) => {
    requests.push(req.url);
    const match = /^\/project\/datasets\/2020\/(manifest|structuur|selectiegegevens)\.json$/.exec(req.url);
    if (!match) { res.writeHead(404).end(); return; }
    try {
      res.setHeader('Content-Type','application/json');
      res.end(await readFile(new URL(`datasets/2020/${match[1]}.json`, root)));
    } catch { res.writeHead(500).end(); }
  });
  await new Promise(resolve => server.listen(0,'127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const url = new URL(`http://127.0.0.1:${server.address().port}/project/datasets/`);
  const d = await maakGegevenslaag({ datasetsUrl: url }).laadDataset('2020');
  assert.equal(d.selectiegegevens.length, 346);
  assert.equal(requests.length, 3);
  assert.ok(requests.every(p => p.startsWith('/project/datasets/2020/')));
});
