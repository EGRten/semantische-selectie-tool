import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
const root=new URL('../',import.meta.url);
test('statische productiebuild bevat alle oorspronkelijke datasetbytes en relatieve ingangspaden',async()=>{
  for(const lijst of ['1996-2012','2017','2020']) {
    const bron=new URL(`datasets/${lijst}/`,root);
    for(const naam of await readdir(bron)) {
      assert.deepEqual(await readFile(new URL(`dist/site/datasets/${lijst}/${naam}`,root)),await readFile(new URL(naam,bron)),`${lijst}/${naam}`);
    }
  }
  const html=await readFile(new URL('dist/site/index.html',root),'utf8');
  assert.match(html,/src="\.\/interface\/app\.js"/);
  assert.match(html,/href="\.\/interface\/style\.css"/);
  const code=await readFile(new URL('dist/site/interface/app.js',root),'utf8');
  assert.match(code,/\.\.\/gegevenslaag\/index\.js/);
});
