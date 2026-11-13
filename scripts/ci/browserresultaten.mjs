// Publiceer alleen uitkomstmetadata; geen assertionwaarden, DOM, bijlagen of ruwe broninhoud.
import {readFile,mkdir,writeFile,appendFile} from 'node:fs/promises';
import {join,relative,basename,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
export function compact(raw,engine){
 const testen=[];
 function bezoek(suite){
  for(const spec of suite.specs??[])for(const t of spec.tests??[]){
   const bestand=relative(process.cwd(),resolve(raw.config?.rootDir??process.cwd(),spec.file??suite.file??''));
   testen.push({titel:spec.title,bestand:bestand.startsWith('..')?basename(bestand):bestand,regel:spec.line,
    browser:t.projectName,status:t.status,verwacht:t.expectedStatus,
    pogingen:(t.results??[]).map(r=>({status:r.status,duurMs:r.duration,retry:r.retry}))});
  }
  for(const child of suite.suites??[])bezoek(child);
 }
 for(const s of raw.suites??[])bezoek(s);
 const aantallen={geslaagd:0,mislukt:0,flaky:0,overgeslagen:0};
 for(const t of testen){if(t.status==='expected'&&t.verwacht==='passed')aantallen.geslaagd++;else if(t.status==='flaky')aantallen.flaky++;else if(t.status==='skipped')aantallen.overgeslagen++;else aantallen.mislukt++;}
 return {browser:engine,status:testen.length>0&&testen.every(t=>t.browser===engine)&&aantallen.geslaagd===testen.length&&!(raw.errors??[]).length?'geslaagd':'niet_geslaagd',aantallen,globaleFouten:(raw.errors??[]).length,testen};
}
export async function rapporteer(env=process.env){
 const out=env.COMPAT_PUBLIC_REPORT_DIR;
 if(!out||!env.COMPAT_RAW_REPORT_DIR)throw Error('Rapportmappen ontbreken');
 await mkdir(out,{recursive:true});const regels=['## Browsercompatibiliteit','','| Engine | Installatie | Teststap | Uitkomst | Geslaagd | Mislukt | Flaky | Overgeslagen |','| --- | --- | --- | --- | ---: | ---: | ---: | ---: |'];let geslaagd=true;
 for(const engine of ['chromium','firefox','webkit']){
  let r;try{r=compact(JSON.parse(await readFile(join(env.COMPAT_RAW_REPORT_DIR,engine+'.json'),'utf8')),engine);}catch{r={browser:engine,status:'geen_geldig_uitvoeringsrapport',aantallen:{geslaagd:0,mislukt:0,flaky:0,overgeslagen:0},testen:[]};}
  r.commit=env.GITHUB_SHA;r.runId=env.GITHUB_RUN_ID;r.poging=env.GITHUB_RUN_ATTEMPT;
  if(env.GITHUB_RUN_ID&&env.GITHUB_SERVER_URL&&env.GITHUB_REPOSITORY)r.runUrl=`${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}`;
  r.installatie=env.COMPAT_INSTALL_OUTCOME??'onbekend';r.teststap=env['COMPAT_'+engine.toUpperCase()+'_OUTCOME']??'onbekend';
  if(r.installatie!=='success'||r.teststap!=='success'||r.status!=='geslaagd'){geslaagd=false;if(r.status==='geslaagd')r.status='stap_niet_geslaagd';}
  await writeFile(join(out,engine+'.json'),JSON.stringify(r,null,2)+'\n');const a=r.aantallen;
  regels.push(`| ${engine} | ${r.installatie} | ${r.teststap} | ${r.status} | ${a.geslaagd} | ${a.mislukt} | ${a.flaky} | ${a.overgeslagen} |`);
 }
 regels.push('','Een ontbrekend, overgeslagen of flaky resultaat is geen groene browservalidatie. Artifacts bevatten uitsluitend compacte uitkomsten; ruwe reports, exports en traces blijven buiten de upload.','');
 if(env.GITHUB_STEP_SUMMARY)await appendFile(env.GITHUB_STEP_SUMMARY,regels.join('\n'));
 console.log(regels.join('\n'));return geslaagd;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)process.exitCode=await rapporteer()?0:1;
