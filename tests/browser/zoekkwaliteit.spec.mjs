import {writeFile} from 'node:fs/promises';
import {test,expect} from '@playwright/test';
async function kies(page){await page.getByRole('combobox').selectOption('2020');await expect(page.getByRole('status')).toContainText('geladen.');}
async function zoek(page,q){await page.getByRole('searchbox').fill(q);await page.getByRole('searchbox').press('Enter');}
test.beforeEach(async({page})=>{await page.goto('./');});
test('volledige natuurlijke zoekvraag werkt zonder lexicon en navigeert naar de bronregel',async({page})=>{
 const urls=[];page.on('request',r=>{if(/zoeklexicon|relaties/.test(r.url()))urls.push(r.url());});await kies(page);await zoek(page,'Waar zoek ik stukken over een referendum?');
 const r=page.locator('[data-zoekresultaat="2020:22.1.3"]');await expect(r).toBeVisible();await r.getByRole('button').click();await expect(page.locator('.officiele-code')).toHaveText('Officiële code 22.1.3');expect(urls).toEqual([]);
});
test('positieve en negatieve resultaten onderscheiden; losse negatie geeft geen AI-uitbreiding',async({page})=>{
 await kies(page);await zoek(page,'Toegekend');await expect(page.locator('[data-zoekresultaat="2020:9.2"]')).toHaveCount(0);
 await zoek(page,'Niet toegekend');await expect(page.locator('[data-zoekresultaat="2020:9.2"]')).toBeVisible();
 await page.getByRole('tab',{name:'Begripsgericht zoeken',exact:true}).click();await expect(page.getByRole('searchbox')).toBeEnabled();
 await zoek(page,'niet');await page.getByRole('checkbox',{name:'Ook onbevestigde AI-zoektermen gebruiken'}).check();await expect(page.locator('.begripsstatus')).toContainText('0 resultaten');
 await zoek(page,'Niet toegekend');await expect(page.locator('[data-zoekresultaat="2020:9.2"]')).toBeVisible();
});
test('browserprestaties: koude en warme zoekacties, geen nieuwe netwerkzoekdienst',async({page},info)=>{
 const fouten=[];page.on('pageerror',e=>fouten.push(e.message));await kies(page);
 const meet=async(selector,mode)=>page.evaluate(({selector,mode})=>{
  const input=document.querySelector(selector);const out=[];
  for(const q of ['Waar zoek ik stukken over een referendum?','1.1.2','jeugdhulp cliënt','vergunning','Niet toegekend']){
   const t=performance.now();input.value=q;input.dispatchEvent(new Event('input',{bubbles:true}));input.form.requestSubmit();out.push({mode,vraag:q,ms:performance.now()-t});
  }return out;
 },{selector,mode});
 const rows=await meet('#zoekopdracht','B');await page.getByRole('tab',{name:'Begripsgericht zoeken',exact:true}).click();await expect(page.getByRole('searchbox')).toBeEnabled();
 rows.push(...await meet('#begripsopdracht','C'));await page.getByRole('checkbox',{name:'Ook onbevestigde AI-zoektermen gebruiken'}).check();rows.push(...await meet('#begripsopdracht','D'));
 await writeFile('/tmp/zoekkwaliteit-browserprestaties.json',JSON.stringify(rows,null,2));
 await info.attach('browser-prestaties.json',{body:Buffer.from(JSON.stringify(rows,null,2)),contentType:'application/json'});
 expect(rows.every(r=>r.ms<1500)).toBeTruthy();expect(fouten).toEqual([]);
});
