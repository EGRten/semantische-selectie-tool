import {test,expect,chromium} from '@playwright/test';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const werken=['1996-2012','2017','2020','concordans'];
test('herstel na laadfout behoudt toetsenbordfocus op de selectielijst',async({page})=>{
 await page.route('**/datasets/2020/structuur.json',r=>r.fulfill({status:404}));
 await page.goto('./');
 const keuze=page.getByLabel('Selectielijst',{exact:true});
 await keuze.selectOption('2020');
 await expect(page.getByRole('alert')).toContainText('Een bestand ontbreekt');
 await page.unroute('**/datasets/2020/structuur.json');
 const herstel=page.getByRole('button',{name:'Opnieuw proberen',exact:true});
 await herstel.focus();await page.keyboard.press('Enter');
 await expect(page.locator('.laadstatus')).toContainText('geladen.');
 await expect(keuze).toBeFocused();
 await page.keyboard.press('Tab');
 await expect(page.getByRole('button',{name:'Alles inklappen'})).toBeFocused();
});
async function openTabel(page,id,basis='./'){
 await page.goto(basis+(id==='concordans'?'#concordans':`#lijst=${id}`));
 const root=id==='concordans'?'.concordans-viewer':'.lijsten-viewer';
 await expect(page.locator(`${root} tbody tr`)).toHaveCount({'1996-2012':494,'2017':305,'2020':346,concordans:716}[id]);
 return page.locator(`${root} .viewer-tabelgebied`);
}
async function focusVrij(page){
 await expect.poll(()=>page.evaluate(()=>{
  const e=document.activeElement,gebied=e.closest('.viewer-tabelgebied');if(!gebied||e===gebied)return false;
  const r=e.getBoundingClientRect(),b=gebied.getBoundingClientRect();
  const koppen=[...gebied.querySelectorAll('thead th')].map(h=>h.getBoundingClientRect());
  const top=Math.max(0,b.top+gebied.clientTop+Math.max(...koppen.map(h=>h.height)));
  const bottom=Math.min(innerHeight,b.top+gebied.clientTop+gebied.clientHeight);
  const cx=Math.max(b.left+1,Math.min(r.left+r.width/2,b.right-1));
  const cy=Math.max(0,Math.min(r.top+r.height/2,innerHeight-1));const hit=document.elementFromPoint(cx,cy);
  return r.top>=top-.5&&r.bottom<=bottom+.5&&r.left>=b.left-.5&&r.right<=b.right+.5&&!!hit&&(hit===e||e.contains(hit));
 })).toBe(true);
}
async function tabRonde(page,gebied){
 const links=gebied.locator('tbody th a');await links.nth(25).focus();await focusVrij(page);
 for(let i=0;i<25;i++){await page.keyboard.press('Shift+Tab');await focusVrij(page);}
 for(let i=0;i<26;i++){await page.keyboard.press('Tab');await focusVrij(page);}
 await gebied.evaluate(e=>e.scrollLeft=700);await links.nth(25).focus();await focusVrij(page);
}
test('UI-01: beide soorten zoekvelden en bronrij-invoer hebben minstens 3:1 randcontrast',async({page})=>{
 for(const id of ['2020','concordans']){await openTabel(page,id);const ratios=await page.locator(id==='concordans'?'.concordans-viewer .viewer-bediening input':'.lijsten-viewer .viewer-bediening input').evaluateAll(es=>{
  const lum=c=>{const xs=c.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return xs[0]*.2126+xs[1]*.7152+xs[2]*.0722;};
  return es.map(e=>{const s=getComputedStyle(e);const a=lum(s.borderTopColor),b=lum('rgb(255,255,255)');return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);});});expect(ratios.length).toBe(id==='concordans'?2:1);for(const ratio of ratios)expect(ratio).toBeGreaterThanOrEqual(3);}
});
for(const id of werken)for(const [w,h]of [[1440,1000],[320,640]])test(`UI-02: ${id}, Tab/Shift+Tab en horizontale scroll op ${w}px`,async({page})=>{
 await page.setViewportSize({width:w,height:h});const gebied=await openTabel(page,id);await tabRonde(page,gebied);
 // De kop wordt in deze geïsoleerde proef hoger; de observer mag geen vaste hoogte aannemen.
 await gebied.locator('thead th').first().evaluate(e=>e.style.paddingBlock='35px');await gebied.locator('tbody th a').nth(12).focus();await focusVrij(page);
});
test('UI-02: alle vier tabellen bij echte 200% en 400% Chromium-paginazoom',async({baseURL})=>{
 test.setTimeout(120000);const profiel=await mkdtemp(join(tmpdir(),'sst-focuszoom-'));
 const context=await chromium.launchPersistentContext(profiel,{executablePath:process.env.CHROMIUM_PATH??chromium.executablePath(),headless:true,viewport:{width:1280,height:1024}});
 try{const instellingen=await context.newPage();await instellingen.goto('chrome://settings/appearance');const page=await context.newPage();
 for(const factor of [2,4]){await instellingen.evaluate(f=>chrome.settingsPrivate.setDefaultZoom(f),factor);
 for(const id of werken){const gebied=await openTabel(page,id,baseURL);expect(await page.evaluate(()=>innerWidth)).toBe(1280/factor);await tabRonde(page,gebied);}}
 }finally{await context.close();await rm(profiel,{recursive:true,force:true});}
});
test('UI-03: zoekkoppen en historische vergelijking hebben opeenvolgende niveaus',async({page})=>{
 await page.goto('./#selectie=2020%3A19.1.19');await expect(page.locator('#detailtitel')).toBeVisible();
 await page.locator('#zoekopdracht').fill('19.1.19');await page.locator('#zoekopdracht').press('Enter');await expect(page.locator('h2#zoekresultatenkop')).toBeVisible();await expect(page.locator('#zoekresultatenkop')).toHaveCSS('letter-spacing','normal');await expect(page.locator('#zoekresultatenkop')).toHaveCSS('font-size','18px');
 await page.locator('.historische-relaties > summary').click();await page.getByRole('button',{name:'Vergelijk officiële gegevens',exact:true}).first().click();
 await expect(page.locator('.historische-relaties > summary > h3')).toHaveText('Vergelijk met andere selectielijsten');
 await expect(page.locator('.concordans-vergelijking > h4')).toBeVisible();
 await page.getByRole('tab',{name:'Begripsgericht zoeken',exact:true}).click();await expect(page.locator('#begripsopdracht')).toBeEnabled();await page.locator('#begripsopdracht').fill('bodemonderzoek');await page.locator('#begripsopdracht').press('Enter');await expect(page.locator('h2#begripsresultatenkop')).toBeVisible();
});
for(const begrip of [false,true])test(`UI-04: ${begrip?'begrips-':'trefwoord'}resultaat behoudt context en correcte URL, focus en geschiedenis`,async({page})=>{
 await page.goto('./#selectie=2020%3A19.1');await expect(page.locator('#detailtitel')).toHaveText('Verwerkt');
 if(begrip)await page.getByRole('tab',{name:'Begripsgericht zoeken',exact:true}).click();
 const input=page.locator(begrip?'#begripsopdracht':'#zoekopdracht');await expect(input).toBeEnabled();await input.fill('19.1.19');await input.press('Enter');
 const paneel=page.locator(begrip?'.begripspaneel':'.zoekpaneel');const knop=paneel.locator('[data-zoekresultaat="2020:19.1.19"] button');await knop.focus();await page.keyboard.press('Enter');
 await expect(page).toHaveURL(/#selectie=2020%3A19\.1\.19$/);await expect(page.locator('#detailtitel')).toBeFocused();await expect(input).toHaveValue('19.1.19');await expect(knop).toBeVisible();
 await page.goBack();await expect(page.locator('#detailtitel')).toHaveText('Verwerkt');await expect(page).toHaveURL(/#selectie=2020%3A19\.1$/);await expect(input).toHaveValue('19.1.19');
 await page.goForward();await expect(page.locator('.officiele-code')).toContainText('19.1.19');await expect(page.locator('#detailtitel')).toBeFocused();
 await page.reload();await expect(page.locator('.officiele-code')).toContainText('19.1.19');
});
test('UI-04: boomverkenning behoudt pijltjestoetsen; activeren publiceert de juiste permalink',async({page})=>{
 await page.goto('./');await page.getByLabel('Selectielijst',{exact:true}).selectOption('2020');await expect(page.locator('.laadstatus')).toContainText('geladen.');
 const root=page.locator('[role=treeitem]').first();await root.focus();await page.keyboard.press('ArrowRight');await expect(root).toHaveAttribute('aria-expanded','true');await page.keyboard.press('ArrowDown');
 const id=await page.locator('[role=treeitem]:focus').getAttribute('data-onderdeel');await page.keyboard.press('Enter');await expect(page).toHaveURL(new RegExp('#selectie='+encodeURIComponent(id).replaceAll('.','\\.')+'$'));await expect(page.locator('[role=treeitem]:focus')).toHaveAttribute('data-onderdeel',id);
});
