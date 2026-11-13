import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const root = new URL('../../',import.meta.url);
async function bron(lijst,bestand='selectiegegevens') { return JSON.parse(await readFile(new URL(`datasets/${lijst}/${bestand}.json`,root),'utf8')); }
const item = (page,id) => page.locator(`[data-onderdeel="${id}"]`);
async function open(page,id) { await item(page,id).locator(':scope > .boomrij > .pijl').click(); }
async function kies(page,id) {
  await page.getByLabel('Selectielijst',{exact:true}).selectOption(id);
  await expect(page.getByRole('status')).toHaveText(`Selectielijst ${id==='1996-2012'?'1996, actualisatie 2012':id} geladen.`);
}
async function selecteer(page,id) { await item(page,id).locator(':scope > .boomrij').click(); }
async function resultaat(page,lijst,proces,generiek,specifiek) {
  await kies(page,lijst);await open(page,`${lijst}:${proces}`);await open(page,`${lijst}:${generiek}`);await selecteer(page,`${lijst}:${specifiek}`);
}
test.beforeEach(async({page})=>{ await page.goto('./'); });

test('initialisatie: Nederlands, lege toestand, geen datasetverzoeken en uitgeschakeld zoekveld',async({page})=>{
  const requests=[];page.on('request',r=>{if(r.url().includes('/datasets/'))requests.push(r.url());});
  await page.reload();
  await expect(page).toHaveTitle('Semantische Selectie Tool');
  await expect(page.locator('html')).toHaveAttribute('lang','nl');
  await expect(page.getByRole('heading',{name:'Nog geen onderdeel geselecteerd'})).toBeVisible();
  await expect(page.getByLabel('Selectielijst',{exact:true})).toHaveValue('');
  await expect(page.getByRole('button',{name:'Alles inklappen'})).toBeDisabled();
  expect(requests).toEqual([]);
  await expect(page.getByRole('searchbox')).toBeDisabled();
});
for(const [lijst,aantal] of [['1996-2012',2],['2017',29],['2020',29]]) {
  test(`${lijst}: uitsluitend gekozen lijst en officiële hoofdvolgorde`,async({page})=>{
    const requests=[];page.on('request',r=>{if(r.url().includes('/datasets/'))requests.push(r.url());});
    await kies(page,lijst);
    const data=await bron(lijst,'structuur');
    const roots=data.filter(n=>n.parent_id===null).sort((a,b)=>a.volgorde-b.volgorde);
    await expect(page.getByRole('treeitem')).toHaveCount(aantal);
    const namen=await page.getByRole('treeitem').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('aria-label')));
    expect(namen).toEqual(roots.map(n=>`${n.code} ${n.benaming}`));
    expect(requests).toHaveLength(3);expect(requests.every(u=>u.includes(`/datasets/${lijst}/`))).toBeTruthy();
  });
}
test('uitklappen, actieve selectie, broodkruimels, ouder en alles inklappen',async({page})=>{
  await resultaat(page,'2020','1','1.1','1.1.1');
  await expect(item(page,'2020:1')).toHaveAttribute('aria-expanded','true');
  await expect(item(page,'2020:1.1.1')).toHaveAttribute('aria-selected','true');
  await expect(page.getByRole('navigation',{name:'Broodkruimelpad'})).toContainText('1.1 Ingericht');
  await page.getByRole('button',{name:'Naar bovenliggend onderdeel: 1.1 Ingericht',exact:true}).click();
  await expect(item(page,'2020:1.1')).toHaveAttribute('aria-selected','true');
  await page.getByRole('navigation',{name:'Broodkruimelpad'}).getByRole('button').first().click();
  await expect(item(page,'2020:1')).toHaveAttribute('aria-selected','true');
  await page.getByRole('button',{name:'Alles inklappen'}).click();
  await expect(page.getByRole('treeitem')).toHaveCount(29);
  await expect(item(page,'2020:1')).toHaveAttribute('aria-expanded','false');
});
test('details tonen ongewijzigde officiële gegevens en geen selectievelden op procestype',async({page})=>{
  await kies(page,'2017');await selecteer(page,'2017:1');
  await expect(page.locator('#details')).toContainText('Dit is een structuurniveau.');
  await expect(page.locator('#details dt').filter({hasText:'Bewaartermijn'})).toHaveCount(0);
  await open(page,'2017:1');await selecteer(page,'2017:1.1');
  const origineel=(await bron('2017')).find(r=>r.id==='2017:1.1');
  await expect(page.locator('#detailtitel')).toHaveText(origineel.officiele_benaming);
  await expect(page.locator('dt').filter({hasText:/^Bewaartermijn$/}).locator('+dd')).toHaveText(origineel.bewaartermijn.officiele_tekst);
  await expect(page.locator('dt').filter({hasText:/^Waardering$/}).locator('+dd')).toHaveText(origineel.waardering.officiele_tekst);
  await expect(page.locator('#details')).not.toContainText('null');
  await expect(page.getByRole('link',{name:'Bron raadplegen'}).first()).toHaveAttribute('href',/^https:/);
});
test('generieke en specifieke resultaten gebruiken de bestaande hiërarchie',async({page})=>{
  await resultaat(page,'2020','1','1.1','1.1.1');
  await expect(page.locator('.context')).toHaveText('Selectielijst 2020 · Specifiek resultaat');
  await expect(page.getByRole('navigation',{name:'Broodkruimelpad'}).locator('li')).toHaveCount(3);
  await selecteer(page,'2020:1.1');
  await expect(page.locator('.context')).toHaveText('Selectielijst 2020 · Generiek resultaat');
});
test('1996: 36 afzonderlijke voorschriften onder rubriek, zonder technische suffix als code',async({page})=>{
  await kies(page,'1996-2012');await open(page,'1996-2012:3');await open(page,'1996-2012:3.6');await open(page,'1996-2012:3.6.2');
  const regels=(await bron('1996-2012')).filter(r=>r.structuur_id==='1996-2012:3.6.2');
  const bladeren=item(page,'1996-2012:3.6.2').locator(':scope > [role=group] > [role=treeitem]');
  await expect(bladeren).toHaveCount(36);
  expect(await bladeren.evaluateAll(ns=>ns.map(n=>n.dataset.onderdeel))).toEqual(regels.map(r=>r.id));
  for(const r of [regels[0],regels.at(-1)]) {
    await selecteer(page,r.id);
    await expect(page.locator('#detailtitel')).toHaveText(r.officiele_benaming);
    await expect(page.locator('.officiele-code')).toHaveText('Officiële code 3.6.2');
    await expect(page.getByRole('navigation',{name:'Broodkruimelpad'}).locator('li')).toHaveCount(4);
  }
  expect(await page.locator('body').innerText()).not.toContain('::');
});
test('lijstwissel wist selectie en hergebruikt uitsluitend eigen cache',async({page})=>{
  const requests=[];page.on('request',r=>{if(r.url().includes('/datasets/'))requests.push(r.url());});
  await resultaat(page,'2020','1','1.1','1.1.1');
  await kies(page,'2017');
  await expect(page.getByRole('heading',{name:'Nog geen onderdeel geselecteerd'})).toBeVisible();
  await expect(page.locator('[role=treeitem][aria-selected=true]')).toHaveCount(0);
  expect(await page.getByRole('treeitem').evaluateAll(ns=>ns.every(n=>n.dataset.onderdeel.startsWith('2017:')))).toBeTruthy();
  await kies(page,'2020');await expect(item(page,'2020:1')).toHaveAttribute('aria-expanded','false');
  expect(requests).toHaveLength(6);
});
test('snelle lijstwissel laat een trage vorige aanvraag geen nieuwe lijst overschrijven',async({page})=>{
  let release;const wachten=new Promise(r=>{release=r;});
  await page.route('**/datasets/2017/*.json',async route=>{await wachten;await route.continue();});
  await page.getByLabel('Selectielijst',{exact:true}).selectOption('2017');
  await expect(page.getByRole('status')).toHaveText('Selectielijst 2017 laden…');
  await kies(page,'2020');release();
  await expect(page.getByRole('status')).toHaveText('Selectielijst 2020 geladen.');
  await expect(item(page,'2020:1')).toBeVisible();await expect(item(page,'2017:1')).toHaveCount(0);
});
test('samengestelde waardering en volledige toelichting blijven behouden',async({page})=>{
  await resultaat(page,'2020','22','22.1','22.1.2');
  const r=(await bron('2020')).find(r=>r.id==='2020:22.1.2');
  await expect(page.locator('dt').filter({hasText:/^Waardering$/}).locator('+dd')).toHaveText(r.waardering.officiele_tekst);
  await expect(page.locator('dt').filter({hasText:/^Toelichting$/}).locator('+dd')).toHaveText(r.toelichting);
  await expect(page.locator('dt').filter({hasText:/^Bewaartermijn$/}).locator('+dd')).toHaveText('Niet afzonderlijk ingevuld in de bron.');
});
test('bronannotaties, afgebroken tekst en afwijkende bronlabels zichtbaar',async({page})=>{
  await resultaat(page,'2020','22','22.1','22.1.3');
  const r=(await bron('2020')).find(r=>r.id==='2020:22.1.3');
  await expect(page.locator('dt').filter({hasText:/^Toelichting$/}).locator('+dd')).toHaveText(r.toelichting);
  await expect(page.getByRole('heading',{name:'Bronannotaties',exact:true})).toBeVisible();
  await expect(page.locator('.annotaties')).toContainText('geldige of onbruikbaar');
  await open(page,'2020:19');await open(page,'2020:19.1');await selecteer(page,'2020:19.1.19');
  await expect(page.locator('dt').filter({hasText:/^Resultaattype$/}).locator('+dd')).toHaveText('Archiefvernie- tiging');
});
test('toetsenbord: tabstop, pijlen, enter, spatie, home/end en zichtbare focus',async({page})=>{
  await kies(page,'2020');
  await page.getByLabel('Selectielijst',{exact:true}).focus();await page.keyboard.press('Tab');
  await expect(page.getByRole('tab',{name:'Trefwoordzoeken',exact:true})).toBeFocused();
  await page.keyboard.press('Tab');await expect(page.getByRole('searchbox')).toBeFocused();
  await page.getByRole('button',{name:'Alles inklappen'}).focus();
  await page.keyboard.press('Tab');await expect(item(page,'2020:1')).toBeFocused();
  await page.keyboard.press('ArrowRight');await expect(item(page,'2020:1')).toHaveAttribute('aria-expanded','true');
  await page.keyboard.press('ArrowRight');await expect(item(page,'2020:1.1')).toBeFocused();
  await page.keyboard.press('Enter');await expect(item(page,'2020:1.1')).toHaveAttribute('aria-selected','true');
  await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowDown');await page.keyboard.press('Space');
  await expect(item(page,'2020:1.1.1')).toHaveAttribute('aria-selected','true');
  expect(await item(page,'2020:1.1.1').locator(':scope > .boomrij').evaluate(n=>getComputedStyle(n).outlineStyle)).toBe('solid');
  await page.keyboard.press('ArrowLeft');await expect(item(page,'2020:1.1')).toBeFocused();
  await page.keyboard.press('Home');await expect(item(page,'2020:1')).toBeFocused();
  await page.keyboard.press('End');await expect(item(page,'2020:29')).toBeFocused();
});
test('ontbrekend bestand: foutmelding en herstel met opnieuw proberen',async({page})=>{
  await page.route('**/datasets/2020/structuur.json',r=>r.fulfill({status:404,body:'ontbreekt'}));
  await page.getByLabel('Selectielijst',{exact:true}).selectOption('2020');
  await expect(page.getByRole('alert')).toContainText('Een bestand ontbreekt');
  await expect(page.getByRole('treeitem')).toHaveCount(0);
  await page.unroute('**/datasets/2020/structuur.json');
  await page.getByRole('button',{name:'Opnieuw proberen'}).click();
  await expect(page.getByRole('status')).toHaveText('Selectielijst 2020 geladen.');
});
test('ongeldige ouderverwijzing wordt als blokkerende fout getoond',async({page})=>{
  const nodes=await bron('2020','structuur');nodes[0].parent_id='2017:1';
  await page.route('**/datasets/2020/structuur.json',r=>r.fulfill({json:nodes}));
  await page.getByLabel('Selectielijst',{exact:true}).selectOption('2020');
  await expect(page.getByRole('alert')).toContainText('ongeldige verwijzing');
  await expect(page.getByRole('treeitem')).toHaveCount(0);
});
test('ontbrekende selectieregel wordt niet vervangen door fictieve waarden',async({page})=>{
  const regels=(await bron('2020')).filter(r=>r.id!=='2020:1.1');
  const manifest=await bron('2020','manifest');manifest.aantallen.selectievoorschriften_of_resultaatregels--;
  await page.route('**/datasets/2020/selectiegegevens.json',r=>r.fulfill({json:regels}));
  await page.route('**/datasets/2020/manifest.json',r=>r.fulfill({json:manifest}));
  await kies(page,'2020');await open(page,'2020:1');await selecteer(page,'2020:1.1');
  await expect(page.getByRole('alert')).toContainText('ontbreken selectiegegevens');
  await expect(page.locator('dt').filter({hasText:/^Bewaartermijn$/})).toHaveCount(0);
});
test('onverwachte netwerkrespons blijft een begrijpelijke fout, geen blanco pagina',async({page})=>{
  await page.route('**/datasets/2020/manifest.json',r=>r.fulfill({body:'geen json',contentType:'application/json'}));
  await page.getByLabel('Selectielijst',{exact:true}).selectOption('2020');
  await expect(page.getByRole('alert')).toContainText('ongeldig of onvolledig');
  await expect(page.getByRole('heading',{name:'Semantische Selectie Tool',exact:true})).toBeVisible();
});
test('mobiele weergave zonder horizontale overflow, boom en details bereikbaar',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await resultaat(page,'1996-2012','3','3.6','3.6.2');
  await open(page,'1996-2012:3.6.2');await selecteer(page,'1996-2012:3.6.2::001');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
  await expect(page.locator('#detailtitel')).toBeVisible();
  await expect(page.getByRole('button',{name:'Alles inklappen'})).toBeEnabled();
});
test('productie onder subpad: juiste pagina, echte interactie en geen console-/runtimefouten',async({page,baseURL})=>{
  const fouten=[];page.on('pageerror',e=>fouten.push(e.message));page.on('console',m=>{if(['error','warning'].includes(m.type()))fouten.push(m.text());});
  await page.reload();await resultaat(page,'2017','1','1.1','1.1.1');
  expect(new URL(page.url()).pathname).toBe(new URL(baseURL).pathname);expect(new URL(page.url()).hash).toBe('#selectie=2017%3A1.1.1');await expect(page.locator('#detailtitel')).not.toBeEmpty();
  expect(fouten).toEqual([]);
});

 test('voorwaardelijke bewaartermijn uit 1996 blijft volledig brongetrouw',async({page})=>{
  await kies(page,'1996-2012');await open(page,'1996-2012:2');await open(page,'1996-2012:2.1');
  await selecteer(page,'1996-2012:2.1::002');
  const origineel=(await bron('1996-2012')).find(r=>r.id==='1996-2012:2.1::002');
  expect(origineel.bewaartermijn.officiele_tekst).toBe('1 jaar na het verstrijken van de termijn waarvoor de benoeming/aanwijzing is geschied');
  await expect(page.locator('dt').filter({hasText:/^Bewaartermijn$/}).locator('+dd')).toHaveText(origineel.bewaartermijn.officiele_tekst);
});

test('toetsenbord: inklappen houdt een zichtbare tabstop en skiplink focust details',async({page})=>{
  await resultaat(page,'2020','1','1.1','1.1.1');
  await page.getByRole('button',{name:'Alles inklappen'}).click();await page.keyboard.press('Tab');
  await expect(item(page,'2020:1')).toBeFocused();
  await page.getByRole('link',{name:'Naar de details',exact:true}).focus();await page.keyboard.press('Enter');
  await expect(page.locator('#details')).toBeFocused();
});
