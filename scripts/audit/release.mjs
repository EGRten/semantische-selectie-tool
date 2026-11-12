// Aanvullende releaseproeven: bestaande gewone productiebuild, geen bronalias.
// AUDIT_RUNTIME_ONLY=1 slaat de scans over voor een koude runtime-/netwerkproef.
// AXE_SOURCE=/tmp/ui-audit-tools/package/axe.min.js node scripts/audit/release.mjs
import {chromium} from 'playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
const basis=process.env.AUDIT_URL??'http://127.0.0.1:4229/semantische-selectie-tool/';
const uit=resolve(process.env.AUDIT_OUTPUT??'/tmp/releasevalidatie');
if(!process.env.AXE_SOURCE)throw Error('AXE_SOURCE ontbreekt');
await mkdir(uit,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH??'/usr/bin/chromium',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const rapport={browser:browser.version(),basis,scanOmvang:'Volledige bediening/details; axe-tabelsteekproef eerste 30 gegevensrijen per tabel. Alle records blijven gerenderd.',axeSha256:createHash('sha256').update(await readFile(process.env.AXE_SOURCE)).digest('hex'),scans:[],runtime:[],console:[],extern:[],traag:null};
page.on('pageerror',e=>rapport.runtime.push(e.message));
page.on('console',m=>{if(['error','warning'].includes(m.type()))rapport.console.push(m.text());});
page.on('request',r=>{if(!r.url().startsWith(new URL(basis).origin)&&!r.url().startsWith('data:'))rapport.extern.push(r.url());});
try{
 if(process.env.AUDIT_RUNTIME_ONLY!=='1')for(const thema of ['light','dark','high-contrast'])for(const route of ['#lijst=1996-2012','#lijst=2017','#lijst=2020','#concordans=21','#selectie=2020%3A19.1.19']){
  await page.goto(basis+route);await page.locator('.hoofdnavigatie').waitFor();
  await page.getByLabel('Weergave',{exact:true}).selectOption(thema);
  await page.locator(route.startsWith('#lijst')?'.lijst-status':route.startsWith('#concordans')?'.viewer-rijdetail h3':'#detailtitel').waitFor();
  if(route.startsWith('#lijst'))await page.waitForFunction(()=>document.querySelectorAll('[data-selectierij]').length>0);
  await page.addScriptTag({path:process.env.AXE_SOURCE});
  const scan=await page.evaluate(async()=>{const r=await axe.run({exclude:[['tbody tr:nth-child(n+31)']]},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}});return {versie:axe.version,violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.length}))};});
  const pagina=await page.evaluate(()=>({titel:document.title,taal:document.documentElement.lang,hoofdinhoud:document.querySelector('main')?.textContent.length??0,koppen:[...document.querySelectorAll('h1,h2,h3,h4')].filter(e=>e.getBoundingClientRect().height).map(e=>[e.tagName,e.textContent.slice(0,80)])}));
  rapport.scans.push({thema,route,pagina,...scan});
  if(route.startsWith('#selectie'))await page.screenshot({path:resolve(uit,thema+'.png')});
 }
 const cdp=await page.context().newCDPSession(page);await cdp.send('Performance.enable');
 await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:100000});await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 const start=Date.now();await page.goto(basis+'#lijst=2020');await page.locator('[data-selectierij]').last().waitFor({timeout:60000});
 rapport.traag={model:'CDP: CPU 4×, latency 150ms, download 200000 B/s; geen echt langzaam apparaat',ladenMs:Date.now()-start,rijen:await page.locator('[data-selectierij]').count()};
 await page.locator('#lijst-tabelzoek').fill('19.1.19');await page.locator('#lijst-tabelzoek').press('Enter');await page.locator('[data-selectierij="2020:19.1.19"]').waitFor();
 rapport.traag.gefilterd=await page.locator('[data-selectierij]').count();
 await page.getByLabel('Weergave',{exact:true}).selectOption('dark');rapport.traag.filterBehoud=await page.locator('#lijst-tabelzoek').inputValue();
 await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});await cdp.send('Emulation.setCPUThrottlingRate',{rate:1});
 await page.setViewportSize({width:320,height:640});await page.screenshot({path:resolve(uit,'mobiel.png')});
 rapport.traag.mobieleOverloop=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
}finally{await writeFile(resolve(uit,'aanvullend.json'),JSON.stringify(rapport,null,2)+'\n');await browser.close();}
console.log(JSON.stringify(rapport));
if(rapport.scans.some(s=>s.violations.length)||rapport.runtime.length||rapport.console.length||rapport.extern.length||rapport.traag?.rijen!==346||rapport.traag?.gefilterd!==1||rapport.traag?.filterBehoud!=='19.1.19'||rapport.traag?.mobieleOverloop)process.exitCode=1;
