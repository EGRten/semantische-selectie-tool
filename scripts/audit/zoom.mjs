// Werkelijke Chromium-paginazoom via de lokale browserinstelling, geen pinchzoom.
import {chromium} from 'playwright';import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';import {tmpdir} from 'node:os';import {resolve,join} from 'node:path';
const uit=resolve(process.env.AUDIT_OUTPUT??'/tmp/semantische-ui-audit');await mkdir(uit,{recursive:true});
const profiel=await mkdtemp(join(tmpdir(),'ui-audit-zoom-'));
const c=await chromium.launchPersistentContext(profiel,{executablePath:'/usr/bin/chromium',headless:true,viewport:{width:1280,height:1024}});
try{
 const instellingen=await c.newPage();await instellingen.goto('chrome://settings/appearance');
 const page=await c.newPage();const rs=[];const basis=process.env.AUDIT_URL??'http://127.0.0.1:4229/semantische-selectie-tool/';
 for(const factor of [1,2,4]){
  await instellingen.evaluate(f=>chrome.settingsPrivate.setDefaultZoom(f),factor);
  await page.goto(basis+'#lijst=2020');await page.reload();await page.locator('.lijst-status').filter({hasText:'346 van 346'}).waitFor();
  await page.screenshot({path:resolve(uit,`zoom-${factor*100}.png`)});
  const meting={soort:'werkelijke-paginazoom',zoom:await instellingen.evaluate(()=>chrome.settingsPrivate.getDefaultZoom()),...await page.evaluate(()=>({innerWidth,dpr:devicePixelRatio,overloop:document.documentElement.scrollWidth>innerWidth}))};
  await page.locator('#lijst-tabelzoek').fill('19.1.19');await page.locator('#lijst-tabelzoek').press('Enter');
  meting.gefilterde_rijen=await page.locator('.lijsten-viewer [data-selectierij]').count();
  await page.locator('[data-selectierij="2020:19.1.19"] a').focus();await page.keyboard.press('Enter');await page.locator('#detailtitel').waitFor();
  meting.detail=await page.evaluate(()=>({focus:document.activeElement.id,overloop:document.documentElement.scrollWidth>innerWidth}));rs.push(meting);
 }
 await instellingen.evaluate(()=>chrome.settingsPrivate.setDefaultZoom(1));
 const font=await instellingen.evaluate(async()=>{const pref=await chrome.settingsPrivate.getPref('webkit.webprefs.default_font_size');await chrome.settingsPrivate.setPref('webkit.webprefs.default_font_size',32);return {was:pref.value,nu:(await chrome.settingsPrivate.getPref('webkit.webprefs.default_font_size')).value};});
 await page.goto(basis);await page.reload();await page.locator('.hoofdnavigatie').waitFor();rs.push({soort:'standaardletter-browser',...font,...await page.evaluate(()=>({html:getComputedStyle(document.documentElement).fontSize,body:getComputedStyle(document.body).fontSize,h1:getComputedStyle(document.querySelector('h1')).fontSize}))});
 await writeFile(resolve(uit,'zoom.json'),JSON.stringify(rs,null,2));console.log(JSON.stringify(rs));
}finally{await c.close();await rm(profiel,{recursive:true,force:true});}
