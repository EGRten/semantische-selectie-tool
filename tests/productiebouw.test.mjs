import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
const root=new URL('../',import.meta.url);
test('statische productiebuild bevat uitsluitend noodzakelijke datasetbestanden, bytegelijk en met relatieve ingangspaden',async()=>{
  const datasetmap=new URL('dist/site/datasets/',root);
  assert.deepEqual((await readdir(datasetmap)).sort(),['1996-2012','2017','2020']);
  for(const lijst of ['1996-2012','2017','2020']) {
    const bron=new URL(`datasets/${lijst}/`,root);
    const verwacht=['manifest.json','structuur.json','selectiegegevens.json','zoeklexicon.json','relaties.json','bepalingen.json'];
    if(lijst==='1996-2012')verwacht.push('rubriekcontext.json');
    // Exacte set: ook toekomstige onbekende bestanden en submappen mogen niet meekomen.
    assert.deepEqual((await readdir(new URL(`${lijst}/`,datasetmap),{recursive:true})).sort(),verwacht.sort(),lijst);
    for(const naam of verwacht) {
      assert.deepEqual(await readFile(new URL(`dist/site/datasets/${lijst}/${naam}`,root)),await readFile(new URL(naam,bron)),`${lijst}/${naam}`);
    }
  }
  const html=await readFile(new URL('dist/site/index.html',root),'utf8');
  assert.match(html,/src="\.\/interface\/app\.js"/);
  assert.match(html,/href="\.\/interface\/style\.css"/);
  const code=await readFile(new URL('dist/site/interface/app.js',root),'utf8');
  assert.match(code,/\.\.\/gegevenslaag\/index\.js/);
});

test('site-artifact sluit repository-, privé- en controlemappen uit en behoudt publieke projecties/documenten',async()=>{
  const site=new URL('dist/site/',root);
  assert.deepEqual((await readdir(site)).sort(),[
    'HERGEBRUIK.md','LICENCE-CC-BY-4.0.md','LICENCE.md','bronnen','concordans',
    'concordans-bronvermelding.md','concordans-excel-licenties.txt','datasets','docs',
    'gedeeld','gegevenslaag','index.html','interface','privacy-publicatie.md','publicatie','raadplegen',
  ].sort());
  assert.deepEqual(await readdir(new URL('docs/',site)),['concordans-hergebruik.md']);
  for(const [id,aantal] of [['1996-2012',494],['2017',305],['2020',346],['concordans',716]]){
    const bestand=`publicatie/${id}.json`;
    const bytes=await readFile(new URL(bestand,site));
    assert.deepEqual(bytes,await readFile(new URL(bestand,root)));
    assert.equal(JSON.parse(bytes).rijen.length,aantal);
  }
});
