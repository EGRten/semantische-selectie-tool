import {test,expect,chromium} from '@playwright/test';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

async function controleerFooter(page){
 const footer=page.getByRole('contentinfo');
 await expect(footer).toContainText('De officiële selectielijst blijft leidend. Beoordeel zelf de toepasselijkheid.');
 await footer.scrollIntoViewIfNeeded();
 const meting=await footer.evaluate(e=>{
  const r=e.getBoundingClientRect();const rects=[];
  const walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);
  while(walker.nextNode())if(walker.currentNode.textContent.trim()){
   const range=document.createRange();range.selectNodeContents(walker.currentNode);
   rects.push(...[...range.getClientRects()].filter(r=>r.width).map(r=>({left:r.left,right:r.right,top:r.top,bottom:r.bottom})));
  }
  const inhoud=[...document.querySelectorAll('#app,.lijsten-viewer,.concordans-viewer')].filter(e=>!e.hidden).map(e=>e.getBoundingClientRect().bottom);
  const link=e.querySelector('a').getBoundingClientRect();
  return {breedte:innerWidth,overloop:document.documentElement.scrollWidth>innerWidth,
   onderInhoud:r.top>=Math.max(...inhoud)-1,
   tekstBinnen:rects.every(t=>t.left>=r.left&&t.right<=r.right+.5&&t.top>=r.top&&t.bottom<=r.bottom+.5),
   eersteTekstLinks:rects[0].left,eersteLinkLinks:link.left,
   hoofdPadding:parseFloat(getComputedStyle(document.querySelector('.kop')).paddingLeft)};
 });
 expect(meting.overloop).toBe(false);expect(meting.onderInhoud).toBe(true);expect(meting.tekstBinnen).toBe(true);
 expect(meting.eersteTekstLinks).toBeCloseTo(meting.hoofdPadding,0);
 if(meting.breedte<=720)expect(meting.eersteLinkLinks).toBeCloseTo(meting.eersteTekstLinks,0);
}
async function openRoute(page,basis,route){
 await page.goto(basis+route);
 await expect(page).toHaveTitle('Semantische Selectie Tool');
 if(route.startsWith('#lijst'))await expect(page.locator('.lijsten-viewer tbody tr')).toHaveCount(346);
 else if(route==='#concordans')await expect(page.locator('.concordans-viewer tbody tr')).toHaveCount(716);
 else if(route)await expect(page.locator('#detailtitel')).toBeVisible();
 else await expect(page.getByRole('tree')).toHaveCount(0);
 await controleerFooter(page);
}
const routes=['','#selectie=2020%3A19.1.19','#lijst=2020','#concordans'];
for(const breedte of [1440,390,320])test(`footer: volledige tekst, uitlijning en links op ${breedte}px`,async({page})=>{
 await page.setViewportSize({width:breedte,height:900});
 const fouten=[];page.on('pageerror',e=>fouten.push(e.message));
 for(const route of routes)await openRoute(page,'./',route);
 await page.screenshot({path:`/tmp/sst-footer-${breedte}.png`});
 // Shift+Tab en Tab controleren de aansluiting op de voorafgaande appbediening.
 const footer=page.getByRole('contentinfo'),hergebruik=footer.getByRole('link',{name:'Hergebruik',exact:true}),privacy=footer.getByRole('link',{name:'Privacy',exact:true});
 await hergebruik.focus();await page.keyboard.press('Shift+Tab');await expect(hergebruik).not.toBeFocused();
 await page.keyboard.press('Tab');await expect(hergebruik).toBeFocused();
 await expect(hergebruik).toHaveCSS('outline-style','solid');
 await page.keyboard.press('Tab');await expect(privacy).toBeFocused();await expect(privacy).toHaveCSS('outline-style','solid');
 for(const [link,bestand,tekst]of [[hergebruik,'HERGEBRUIK.md','VNG'],[privacy,'privacy-publicatie.md','privacy']]){
  await link.focus();await page.keyboard.press('Enter');await expect(page).toHaveURL(new RegExp('/'+bestand.replaceAll('.','\\.')+'$'));
  await expect(page.locator('body')).toContainText(new RegExp(tekst,'i'));
  await page.goBack();await expect(page.locator('.concordans-viewer tbody tr')).toHaveCount(716);
 }
 expect(fouten).toEqual([]);
});
test('footer: echte 200% en 400% Chromium-paginazoom, plus 100%',async({baseURL})=>{
 test.setTimeout(90000);const profiel=await mkdtemp(join(tmpdir(),'sst-footerzoom-'));
 const context=await chromium.launchPersistentContext(profiel,{executablePath:process.env.CHROMIUM_PATH??chromium.executablePath(),headless:true,viewport:{width:1280,height:1024}});
 try{
  const instellingen=await context.newPage();await instellingen.goto('chrome://settings/appearance');const page=await context.newPage();
  for(const factor of [1,2,4]){
   await instellingen.evaluate(f=>chrome.settingsPrivate.setDefaultZoom(f),factor);
   for(const route of routes){await openRoute(page,baseURL,route);expect(await page.evaluate(()=>innerWidth)).toBe(1280/factor);}
  }
 }finally{await context.close();await rm(profiel,{recursive:true,force:true});}
});
