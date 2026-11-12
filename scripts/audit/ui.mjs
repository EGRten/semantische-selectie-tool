// Niet-productiewijzigende audit. Vereist bestaande build/server en een externe axe-core.
// Voorbeeld: AXE_SOURCE=/tmp/axe/package/axe.min.js node scripts/audit/ui.mjs
import {chromium} from 'playwright';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const basis=process.env.AUDIT_URL??'http://127.0.0.1:4229/semantische-selectie-tool/';
const uit=resolve(process.env.AUDIT_OUTPUT??'/tmp/semantische-ui-audit');
if(!process.env.AXE_SOURCE)throw Error('AXE_SOURCE moet naar een afzonderlijk geïnstalleerde axe.min.js verwijzen');
await mkdir(uit,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH??'/usr/bin/chromium',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const rapport={browser:browser.version(),basis,axe:null,schermen:[],metingen:[],fouten:[]};
page.on('pageerror',e=>rapport.fouten.push(e.message));
async function capture(naam,scan=true){
 await page.screenshot({path:resolve(uit,naam+'.png')});
 const structuur=await page.evaluate(()=>({url:location.hash,titel:document.title,koppen:[...document.querySelectorAll('h1,h2,h3,h4,h5')].filter(e=>e.getBoundingClientRect().height).map(e=>({niveau:e.tagName,tekst:e.textContent.slice(0,100)})),landmarks:[...document.querySelectorAll('main,[role=main]')].filter(e=>e.getBoundingClientRect().height).map(e=>({tag:e.tagName,id:e.id,rol:e.getAttribute('role')})),focus:{tag:document.activeElement.tagName,id:document.activeElement.id},viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},overloop:document.documentElement.scrollWidth>innerWidth}));
 let a;if(scan){await page.addScriptTag({path:process.env.AXE_SOURCE});a=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}});return {versie:axe.version,violations:r.violations.map(v=>({id:v.id,impact:v.impact,tags:v.tags,beschrijving:v.description,nodes:v.nodes.map(n=>({target:n.target,samenvatting:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.length})),passes:r.passes.length,inapplicable:r.inapplicable.length};});rapport.axe=a.versie;}
 rapport.schermen.push({naam,...structuur,axe:a});await writeFile(resolve(uit,'rapport.json'),JSON.stringify(rapport,null,2));console.log(naam,a?.violations.map(v=>v.id+':'+v.nodes.length).join(', ')??'handmatige controle');
}
async function goto(hash){await page.goto(basis+hash);await page.reload();await page.locator('.hoofdnavigatie').waitFor();}
async function lijst(id){await goto('#lijst='+id);await page.locator('.lijst-status').filter({hasText:'van'}).waitFor();}
async function zoek(tekst,begrip=false){await goto('');await page.getByLabel('Selectielijst',{exact:true}).selectOption('2020');await page.locator('.laadstatus').filter({hasText:'geladen.'}).waitFor();if(begrip){await page.getByRole('tab',{name:'Begripsgericht zoeken',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#begripsopdracht')?.matches(':enabled'));}const input=page.locator(begrip?'#begripsopdracht':'#zoekopdracht');await input.fill(tekst);await input.press('Enter');await page.waitForTimeout(200);}
try{
 await goto('');await capture('01-start');
 await zoek('19.1.19');await capture('02-codezoeken');
 await page.locator('[data-zoekresultaat="2020:19.1.19"] .zoekresultaatknop').click();await page.locator('#detailtitel').waitFor();await capture('03-details');
 await page.locator('.historische-relaties > summary').click();await page.locator('.concordans-relatie').first().waitFor();await capture('04-relaties');
 await page.getByRole('button',{name:'Vergelijk officiële gegevens',exact:true}).first().click();await page.locator('.vergelijkingstabel').waitFor();await capture('05-vergelijking');
 await zoek('bodemonderzoek',true);await capture('06-begripszoeken');
 for(const id of ['1996-2012','2017','2020']){await lijst(id);await capture('07-tabel-'+id);}
 await goto('#concordans=21');await page.locator('.viewer-rijdetail h3').waitFor();await page.evaluate(()=>scrollTo(0,0));await capture('08-concordans');
 const cdp=await page.context().newCDPSession(page);await cdp.send('Performance.enable');rapport.metingen.push({soort:'concordans-dom-en-geheugen',...await page.evaluate(()=>({dom:document.querySelectorAll('*').length,rijen:document.querySelectorAll('[data-viewerrij]').length})),metrics:(await cdp.send('Performance.getMetrics')).metrics.filter(m=>['JSHeapUsedSize','Nodes','LayoutDuration','ScriptDuration'].includes(m.name))});
 for(const [w,h]of [[320,640],[390,844],[768,1024],[844,390],[1920,1080]]){await page.setViewportSize({width:w,height:h});await lijst('2020');await capture('09-formaat-'+w+'x'+h,false);}
 await page.setViewportSize({width:390,height:844});await goto('#selectie='+encodeURIComponent('2020:19.1.19'));await page.locator('#detailtitel').waitFor();await capture('10-mobiel-details',false);
 await page.setViewportSize({width:1440,height:1000});await lijst('2020');await page.addStyleTag({content:'* {line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important} p {margin-bottom:2em!important}'});await capture('11-tekstafstand',false);
 await lijst('2020');await page.addStyleTag({content:'html {font-size:32px!important}'});await capture('12-standaardletter-32px',false);
 await page.emulateMedia({colorScheme:'dark'});await lijst('2020');await capture('13-systeem-donker',false);
 await page.emulateMedia({forcedColors:'active'});await capture('14-forced-colors',true);
 await page.emulateMedia({forcedColors:'none',colorScheme:'light'});
 const context=await browser.newContext();const traag=await context.newPage();await traag.route('**/publicatie/2017.json',r=>r.fulfill({status:404}));await traag.goto(basis+'#lijst=2017');await traag.locator('.lijsten-viewer [role=alert]').waitFor();await traag.screenshot({path:resolve(uit,'15-fout.png')});rapport.metingen.push({soort:'netwerkfout',melding:await traag.locator('.lijsten-viewer [role=alert]').innerText()});await context.close();
 await writeFile(resolve(uit,'rapport.json'),JSON.stringify(rapport,null,2));
}finally{await browser.close();}
