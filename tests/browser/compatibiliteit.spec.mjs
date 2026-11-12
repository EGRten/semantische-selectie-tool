import {test,expect} from '@playwright/test';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {NASLAGWERKEN,controleerDownload} from '../../scripts/publieke-downloadcontrole.mjs';

for(const werk of NASLAGWERKEN)test(`browsermatrix: volledige ${werk.id} Excel inhoudelijk teruglezen`,async({page},testInfo)=>{
 const fouten=[],extern=[];page.on('pageerror',e=>fouten.push(e.message));page.on('console',m=>{if(m.type()==='error')fouten.push(m.text());});page.on('request',r=>{if(/^https?:/.test(r.url())&&new URL(r.url()).origin!==new URL(testInfo.project.use.baseURL).origin)extern.push(r.url());});
 await page.goto(werk.id==='concordans'?'./#concordans':`./#lijst=${werk.id}`);
 const root=page.locator(werk.id==='concordans'?'.concordans-viewer':'.lijsten-viewer');await expect(root.locator('tbody tr')).toHaveCount(werk.aantal);
 const data=await (await page.request.get(`./publicatie/${werk.id}.json`)).json();
 const [download]=await Promise.all([page.waitForEvent('download'),root.getByRole('button',{name:`Download ${werk.naam.replace('.xlsx','')} (.xlsx)`,exact:true}).click()]);
 const pad=testInfo.outputPath(werk.id+'.xlsx');await download.saveAs(pad);
 const {stdout}=await promisify(execFile)('python',['tests/helpers/lees-concordans-xlsx.py',pad],{maxBuffer:24*1024*1024});
 const controle=controleerDownload(werk,data,download.suggestedFilename(),JSON.parse(stdout));expect(controle).toMatchObject({geslaagd:true});expect(fouten).toEqual([]);expect(extern).toEqual([]);
});

for(const thema of ['light','dark','high-contrast'])test(`browsermatrix: axe en beoordelingstaken in ${thema}`,async({page},testInfo)=>{
 test.skip(!process.env.AXE_SOURCE,'Afzonderlijke axe-core vereist via AXE_SOURCE; geen productieafhankelijkheid.');
 const scans=[];
 // Hergebruik de bestaande axe-bron; iedere thematoestand omvat zoeken, vergelijking en tabel.
 for(const soort of ['zoeken','vergelijking','tabel']){
  await page.goto(soort==='tabel'?'./#lijst=2020':'./#selectie=2020%3A19.1.19');
  if(soort==='tabel')await expect(page.locator('.lijsten-viewer tbody tr')).toHaveCount(346);else await expect(page.locator('#detailtitel')).toBeVisible();
  await page.getByLabel('Weergave',{exact:true}).selectOption(thema);
  if(soort==='zoeken'){await page.locator('#zoekopdracht').fill('19.1.19');await page.locator('#zoekopdracht').press('Enter');await expect(page.locator('.zoekstatus')).toContainText('1 resultaat');}
  if(soort==='vergelijking'){await page.locator('.historische-relaties>summary').click();await page.getByRole('button',{name:'Vergelijk officiële gegevens',exact:true}).first().click();await expect(page.locator('.vergelijkingstabel')).toBeVisible();}
  await page.addScriptTag({path:process.env.AXE_SOURCE});
  const scan=await page.evaluate(async()=>{const r=await axe.run({exclude:[['tbody tr:nth-child(n+31)']]},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}});return {versie:axe.version,violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,samenvatting:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))};});
  scans.push({soort,...scan});
 }
 await testInfo.attach('axe-steekproef',{body:JSON.stringify(scans),contentType:'application/json'});
 expect(scans.flatMap(s=>s.violations)).toEqual([]);
});

test('browsermatrix: skiplink, doelgroottes, status, boom en mobiele vergelijkingsvolgorde',async({page},testInfo)=>{
 await page.goto('./');await page.keyboard.press('Tab');await expect(page.locator('.overslaan')).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('#details')).toBeFocused();
 await page.getByLabel('Selectielijst',{exact:true}).selectOption('2020');await expect(page.locator('.laadstatus')).toContainText('geladen.');
 const boom=page.getByRole('tree');await expect(boom).toHaveAccessibleName('Structuur van de selectielijst');const eerste=boom.getByRole('treeitem').first();await eerste.focus();await page.keyboard.press('ArrowRight');await expect(eerste).toHaveAttribute('aria-expanded','true');await page.keyboard.press('ArrowDown');await expect(eerste).not.toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('[role=treeitem]:focus')).toHaveAttribute('aria-selected','true');await expect(page.locator('#detailtitel')).toBeVisible();
 await page.locator('#zoekopdracht').fill('19.1.19');await page.locator('#zoekopdracht').press('Enter');await expect(page.locator('.zoekstatus')).toContainText('1 resultaat');await expect(page.locator('.zoekstatus')).toHaveAttribute('aria-live','polite');
 const resultaat=page.locator('[data-zoekresultaat="2020:19.1.19"] button');await resultaat.focus();await page.keyboard.press('Enter');await expect(page.locator('#detailtitel')).toBeFocused();await expect(page).toHaveURL(/#selectie=2020%3A19\.1\.19$/);
 await page.setViewportSize({width:320,height:640});await page.locator('.historische-relaties>summary').click();await page.getByRole('button',{name:'Vergelijk officiële gegevens',exact:true}).first().click();const tabel=page.locator('.vergelijkingstabel');await expect(tabel).toBeVisible();
 const beoordeling=await page.evaluate(()=>{
  const zichtbaar=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&!e.closest('[hidden]');};
  const doelen=[...document.querySelectorAll('a,button,input,select,summary')].filter(zichtbaar).map(e=>({e,r:e.getBoundingClientRect()}));
  const knoppen=doelen.filter(({e})=>e.matches('button,input:not([type=checkbox]),select,summary')).map(({e,r})=>{
   const cx=r.x+r.width/2,cy=r.y+r.height/2;
   // SC 2.5.8: ook de afstandsuitzondering beoordelen, geen algemene 24px-eis verzinnen.
   const vrijeCirkel=doelen.every(o=>{if(o.e===e||e.contains(o.e)||o.e.contains(e))return true;const t=o.r;
    if(t.width<24||t.height<24)return Math.hypot(cx-(t.x+t.width/2),cy-(t.y+t.height/2))>=24;
    return Math.hypot(Math.max(t.left-cx,0,cx-t.right),Math.max(t.top-cy,0,cy-t.bottom))>=12;
   });return {tag:e.tagName,naam:e.getAttribute('aria-label')||e.textContent?.trim().slice(0,80),breedte:r.width,hoogte:r.height,voldoende:(r.width>=24&&r.height>=24)||vrijeCirkel,afstandUitzondering:!(r.width>=24&&r.height>=24)&&vrijeCirkel};
  });
  return {taal:document.documentElement.lang,andereTalen:[...document.querySelectorAll('[lang]')].map(e=>({tag:e.tagName,taal:e.lang})),knoppen,volgorde:[...document.querySelectorAll('.vergelijkingstabel tbody tr')].slice(0,4).map(e=>[...e.children].map(c=>c.textContent)),overloop:document.documentElement.scrollWidth>innerWidth};
 });
 await testInfo.attach('handmatig-te-beoordelen',{body:JSON.stringify(beoordeling),contentType:'application/json'});expect(beoordeling.taal).toBe('nl');expect(beoordeling.overloop).toBe(false);
 for(const k of beoordeling.knoppen)expect(k.voldoende,JSON.stringify(k)).toBe(true);
 expect(beoordeling.volgorde[0]).toHaveLength(3);
});

// De pijl heeft een eigen actie naast selectie van de rest van de boomrij.
test('browsermatrix: boompijl heeft een eigen raakvlak van minstens 24 bij 24 pixels',async({page})=>{
 await page.goto('./');for(const id of ['1996-2012','2017','2020']){await page.getByLabel('Selectielijst',{exact:true}).selectOption(id);await expect(page.locator('.laadstatus')).toContainText('geladen.');const item=page.getByRole('treeitem').first();const pijl=item.locator(':scope>.boomrij>.pijl');await pijl.scrollIntoViewIfNeeded();const r=await pijl.boundingBox();expect(r.width).toBeGreaterThanOrEqual(24);expect(r.height).toBeGreaterThanOrEqual(24);await page.mouse.click(r.x+r.width/2+10,r.y+r.height/2);await expect(item).toHaveAttribute('aria-expanded','true');}
});
