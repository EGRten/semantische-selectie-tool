import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {compact,rapporteer} from '../scripts/ci/browserresultaten.mjs';
const voorbeeld=(status='expected')=>({config:{rootDir:join(process.cwd(),'tests/browser')},errors:[],suites:[{specs:[{title:'Technische voorbeeldtest',file:'voorbeeld.spec.mjs',line:7,tests:[{projectName:'chromium',expectedStatus:'passed',status,results:[{status:status==='expected'?'passed':'failed',duration:10,retry:0,error:{message:'NIET_PUBLICEREN'},attachments:[{body:'NIET_PUBLICEREN'}]}]}]}]}]});
test('compact resultaat bevat alleen uitkomstmetadata, geen broninhoud, fouten of bijlagen',()=>{
 const r=compact(voorbeeld(),'chromium');assert.equal(r.status,'geslaagd');assert.equal(r.testen[0].bestand,'tests/browser/voorbeeld.spec.mjs');assert.ok(!JSON.stringify(r).includes('NIET_PUBLICEREN'));
});
test('mislukt, flaky, skipped, leeg, verkeerde engine en globale fout blijven rood',()=>{
 for(const status of ['unexpected','flaky','skipped'])assert.equal(compact(voorbeeld(status),'chromium').status,'niet_geslaagd');
 const skip=voorbeeld();skip.suites[0].specs[0].tests[0].expectedStatus='skipped';assert.equal(compact(skip,'chromium').aantallen.overgeslagen,1);
 assert.equal(compact({suites:[]},'chromium').status,'niet_geslaagd');assert.equal(compact(voorbeeld(),'firefox').status,'niet_geslaagd');
 const raw=voorbeeld();raw.errors=[{message:'NIET_PUBLICEREN'}];assert.equal(compact(raw,'chromium').status,'niet_geslaagd');
 const flaky=voorbeeld('flaky');flaky.suites[0].specs[0].tests[0].results.push({status:'passed',duration:10,retry:1});assert.equal(compact(flaky,'chromium').status,'niet_geslaagd');
});
test('eindcontrole faalt bij installatiefout, ontbrekend rapport en falende stap ondanks groen JSON',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'sst-ci-'));try{
 const raw=join(dir,'raw'),out=join(dir,'summary');await mkdir(raw);
 const env={COMPAT_RAW_REPORT_DIR:raw,COMPAT_PUBLIC_REPORT_DIR:out,COMPAT_INSTALL_OUTCOME:'success',COMPAT_CHROMIUM_OUTCOME:'success',COMPAT_FIREFOX_OUTCOME:'success',COMPAT_WEBKIT_OUTCOME:'success'};
 for(const e of ['chromium','firefox','webkit']){const r=voorbeeld();r.suites[0].specs[0].tests[0].projectName=e;await writeFile(join(raw,e+'.json'),JSON.stringify(r));}
 assert.equal(await rapporteer(env),true);
 assert.equal(await rapporteer({...env,COMPAT_INSTALL_OUTCOME:'failure'}),false);
 assert.equal(await rapporteer({...env,COMPAT_WEBKIT_OUTCOME:'failure'}),false);
 await rm(join(raw,'firefox.json'));assert.equal(await rapporteer(env),false);
 assert.equal(JSON.parse(await readFile(join(out,'firefox.json'))).status,'geen_geldig_uitvoeringsrapport');
 }finally{await rm(dir,{recursive:true,force:true});}
});
