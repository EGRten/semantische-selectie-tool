// Echte acceptatie van de gewone statische build, zonder bronalias of mocks.
import {spawn,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {chromium} from 'playwright';
import {controleerPublicatie} from '../dist/publicatie/index.js';
import {NASLAGWERKEN,controleerDownload,hardeAcceptatie} from './publieke-downloadcontrole.mjs';
const root=new URL('../',import.meta.url);
const uitvoer=process.argv.includes('--output')?process.argv[process.argv.indexOf('--output')+1]:'/tmp/publieke-downloadacceptatie.json';
const env={...process.env};delete env.CONCORDANS_BRON_JSON;
const server=spawn(process.execPath,['scripts/serve.mjs','--port','4217','--base','/semantische-selectie-tool/'],{cwd:root,env,stdio:['ignore','pipe','pipe']});
const dir=await mkdtemp(join(tmpdir(),'publieke-downloads-'));
const rapport={harde_acceptatie:false,voorziening:'Gewone productiebuild, geen concordansalias, mocks of privébron',resultaten:[]};
let browser;
try{
  await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('exit',()=>reject(Error('Statische server start niet')));server.once('error',reject);});
  browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true});
  const page=await browser.newPage();
  const basis='http://127.0.0.1:4217/semantische-selectie-tool/';
  for(const werk of NASLAGWERKEN){
    try{
      const response=await page.request.get(`${basis}publicatie/${werk.id}.json`);
      if(!response.ok()){
        await page.goto(basis+(werk.id==='concordans'?'#concordans':`#lijst=${werk.id}`));
        const alert=page.locator(werk.id==='concordans'?'.concordans-viewer [role=alert]':'.lijsten-viewer [role=alert]');
        await alert.waitFor({timeout:10000});
        rapport.resultaten.push({id:werk.id,geslaagd:false,json_beschikbaar:false,http_status:response.status(),rijen:0,downloads:0,reden:await alert.innerText()});
        continue;
      }
      const p=await response.json();controleerPublicatie(p,werk.id);
      await page.goto(basis+(werk.id==='concordans'?'#concordans':`#lijst=${werk.id}`));
      const status=page.locator(werk.id==='concordans'?'.viewer-status':'.lijst-status');
      await status.filter({hasText:`${werk.aantal} van ${werk.aantal}`}).waitFor();
      const tabelRijen=await page.locator(werk.id==='concordans'?'.concordans-viewer tbody tr':'.lijsten-viewer tbody tr').count();
      const [d]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:`Download ${werk.naam.replace('.xlsx','')} (.xlsx)`,exact:true}).click()]);
      const pad=join(dir,werk.id+'.xlsx');await d.saveAs(pad);
      const {stdout}=await promisify(execFile)('python',['tests/helpers/lees-concordans-xlsx.py',pad],{cwd:root,maxBuffer:24*1024*1024});
      const excel=JSON.parse(stdout),controle=controleerDownload(werk,p,d.suggestedFilename(),excel);
      rapport.resultaten.push({id:werk.id,...controle,geslaagd:controle.geslaagd&&tabelRijen===werk.aantal,json_beschikbaar:true,rijen:tabelRijen,downloads:1,bestandsnaam:d.suggestedFilename(),werkbladen:excel.werkbladen.map(s=>s.naam)});
    }catch(error){rapport.resultaten.push({id:werk.id,geslaagd:false,reden:error.message});}
  }
  rapport.harde_acceptatie=hardeAcceptatie(rapport.resultaten);
}catch(error){rapport.fout=error.message;}
finally{
  await browser?.close();server.kill();await rm(dir,{recursive:true,force:true});
  await writeFile(uitvoer,JSON.stringify(rapport,null,2)+'\n');console.log(JSON.stringify(rapport));process.exitCode=rapport.harde_acceptatie?0:1;
}
