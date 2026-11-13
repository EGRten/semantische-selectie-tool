import {metGeometrie} from '../helpers/geometriediagnostiek.mjs';
import {controleerSysteemkleurAanpassing} from '../helpers/systeemkleur.mjs';
import {test,expect,chromium} from '@playwright/test';
import {mkdtemp,rm} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';
const aantallen={'1996-2012':494,'2017':305,'2020':346,concordans:716};
async function open(page,id){await page.goto('./'+(id==='concordans'?'#concordans':`#lijst=${id}`));const root=id==='concordans'?'.concordans-viewer':'.lijsten-viewer';await expect(page.locator(`${root} tbody tr`)).toHaveCount(aantallen[id]);return page.locator(root);}
test('UI-05/10: beperkte tokenschaal en dezelfde systeemletter voor formulieren',async({page})=>{
 const root=await open(page,'2020');const meting=await root.evaluate(e=>{const input=e.querySelector('input'),button=e.querySelector('.viewer-bediening button'),select=e.querySelector('select');return {basis:getComputedStyle(document.documentElement).fontSize,fonts:[input,button,select].map(n=>({font:getComputedStyle(n).fontFamily,maat:getComputedStyle(n).fontSize,hoogte:n.getBoundingClientRect().height})),decoratief:getComputedStyle(e.querySelector('td')).borderTopColor,functioneel:getComputedStyle(input).borderColor};});
 expect(meting.basis).toBe('16px');expect(new Set(meting.fonts.map(f=>f.font)).size).toBe(1);expect(meting.fonts.every(f=>f.maat==='16px'&&f.hoogte>=44)).toBeTruthy();expect(meting.decoratief).not.toBe(meting.functioneel);
});
for(const [w,h]of [[320,640],[768,1024],[1440,1000]])test(`UI-06/12: vier volledige tabellen, scrolluitleg en passende kolommen op ${w}px`,async({page})=>{
 await page.setViewportSize({width:w,height:h});for(const id of Object.keys(aantallen)){const root=await open(page,id),gebied=root.locator('.viewer-tabelgebied');const beschrijving=await gebied.getAttribute('aria-describedby');await expect(page.locator('#'+beschrijving)).toContainText('pijltjestoetsen');await gebied.focus();await expect(gebied).toBeFocused();await page.keyboard.press('ArrowRight');await metGeometrie(page,()=>expect.poll(()=>gebied.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0));
 const maten=await root.locator('table').evaluate(t=>({code:t.querySelector('thead th').getBoundingClientRect().width,omschrijving:t.querySelector('col.kolom-omschrijving').getBoundingClientRect().width,maxhoogte:t.parentElement.getBoundingClientRect().height,viewport:innerHeight,overloop:document.documentElement.scrollWidth>innerWidth}));expect(maten.omschrijving).toBeGreaterThan(maten.code);expect(maten.maxhoogte).toBeLessThanOrEqual(h*.65+3);expect(maten.overloop).toBe(false);expect(await root.getByRole('button',{name:/Volgende pagina|Vorige pagina/}).count()).toBe(0);
 }
});
test('UI-07: waardering, volledige termijn en voorwaarden gaan vóór aanvullende context',async({page})=>{
 await page.goto('./#selectie=2020%3A19.1.19');await expect(page.locator('#detailtitel')).toBeVisible();
 await expect(page.locator('.gegevens dt').nth(0)).toHaveText('Waardering');await expect(page.locator('.gegevens dt').nth(1)).toHaveText('Bewaartermijn');
 const volgorde=await page.locator('#details').evaluate(e=>{const a=[...e.children];const voorwaarden=a.findIndex(n=>n.tagName==='SECTION'&&n.querySelector('h3')?.textContent==='Voorwaarden en context');return {data:a.indexOf(e.querySelector('.gegevens')),voorwaarden,vergelijking:a.indexOf(e.querySelector('.historische-relaties')),annotaties:a.indexOf(e.querySelector('.annotaties')),versie:a.indexOf(e.querySelector(':scope > details.broncontext'))};});
 expect(volgorde.voorwaarden).toBeGreaterThan(volgorde.data);expect(volgorde.vergelijking).toBeGreaterThan(volgorde.voorwaarden);expect(volgorde.versie).toBeGreaterThan(volgorde.voorwaarden);expect(volgorde.annotaties).toBeGreaterThan(volgorde.voorwaarden);
 await expect(page.locator('.annotaties')).toContainText('officiële rectificatie');await expect(page.locator('.gegevens')).toContainText('Na kennisgeving');
});
test('UI-08: systeemkleuren behouden geselecteerde boom- en tabelranden zonder schaduw',async({page})=>{
 await page.emulateMedia({forcedColors:'active'});await page.goto('./#selectie=2020%3A19.1.19');await expect(page.locator('#detailtitel')).toBeVisible();
 const boom=page.locator('.boom [aria-selected=true]>.boomrij');await expect(boom).toHaveCSS('border-inline-start-style','double');await expect(boom).toHaveCSS('border-inline-start-width','6px');await controleerSysteemkleurAanpassing(boom);
 for(const id of ['1996-2012','2017','2020']){await open(page,id);await page.locator('.lijsten-viewer tbody th a').first().click();await expect(page.locator('#detailtitel')).toBeVisible();await page.getByRole('link',{name:'Terug naar tabelrij',exact:true}).click();await expect(page.locator('.lijsten-viewer tr[aria-current=true]>th')).toHaveCSS('border-inline-start-style','double');await expect(page.locator('.lijsten-viewer tr[aria-current=true]>th a')).toHaveCSS('text-decoration-style','double');}
 await page.goto('./#concordans=21');await expect(page.locator('.viewer-rijdetail h3')).toBeVisible();await expect(page.locator('[data-viewerrij="21"]>th')).toHaveCSS('border-inline-start-style','double');
});
test('UI-05: echte browserlettervoorkeur 32px vergroot tekst én invoervelden',async({baseURL})=>{
 const dir=await mkdtemp(join(tmpdir(),'sst-lettervoorkeur-'));const c=await chromium.launchPersistentContext(dir,{executablePath:process.env.CHROMIUM_PATH??chromium.executablePath(),headless:true,viewport:{width:1280,height:1024}});
 try{const settings=await c.newPage();await settings.goto('chrome://settings/appearance');await settings.evaluate(()=>chrome.settingsPrivate.setPref('webkit.webprefs.default_font_size',32));const page=await c.newPage();await page.goto(baseURL+'#lijst=2020');await expect(page.locator('.lijsten-viewer tbody tr')).toHaveCount(346);await expect(page.locator('html')).toHaveCSS('font-size','32px');await expect(page.locator('#lijst-tabelzoek')).toHaveCSS('font-size','32px');await expect(page.locator('.viewer-tabel')).toHaveCSS('font-size','30px');await page.setViewportSize({width:320,height:640});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }finally{await c.close();await rm(dir,{recursive:true,force:true});}
});
