import { test, expect } from '@playwright/test';
async function kies(page,id='2020') {
  await page.getByRole('combobox').selectOption(id);
  await expect(page.getByRole('status')).toContainText('geladen.');
}
async function zoek(page,vraag) { await page.getByRole('searchbox').fill(vraag);await page.getByRole('searchbox').press('Enter'); }
const resultaten=page=>page.getByRole('region',{name:'Zoekresultaten',exact:true});
test.beforeEach(async({page})=>{await page.goto('./');});

test('zoekveld boven boom, alleen gekozen lijst, Enter en resultaat naar boom en details',async({page})=>{
  const requests=[];page.on('request',r=>{if(r.url().includes('/datasets/'))requests.push(r.url());});
  await expect(page.getByRole('searchbox')).toBeDisabled();
  await kies(page);await zoek(page,'Gemeentewapen');
  await expect(page.locator('.zoekstatus')).toContainText('resulta');
  const knop=resultaten(page).getByRole('button').first();await expect(knop).toHaveText('1.1.2 Gemeentewapen');
  await expect(knop.locator('mark')).toHaveText('Gemeentewapen');await knop.click();
  await expect(page.locator('#detailtitel')).toHaveText('Gemeentewapen');
  await expect(page.locator('[data-onderdeel="2020:1.1.2"]')).toHaveAttribute('aria-selected','true');
  await expect(page.locator('[data-onderdeel="2020:1"]')).toHaveAttribute('aria-expanded','true');
  await expect(page.locator('[data-onderdeel="2020:1.1"]')).toHaveAttribute('aria-expanded','true');
  expect(requests).toHaveLength(3);expect(requests.every(u=>u.includes('/datasets/2020/'))).toBeTruthy();
});
test('zoeken-knop, normalisatie en veilig markeren van tekst',async({page})=>{
  await kies(page,'1996-2012');await page.getByRole('searchbox').fill('FINANCIELE—controle');
  await page.getByRole('button',{name:'Zoeken',exact:true}).click();
  await expect(page.locator('[data-zoekresultaat="1996-2012:2.3::002"]')).toBeVisible();
  await expect(page.locator('[data-zoekresultaat="1996-2012:2.3::002"] mark').first()).toHaveText('financiële');
  await zoek(page,'<img src=x onerror=alert(1)>');
  await expect(page.locator('.zoekstatus')).toContainText('0 resultaten');
  await expect(page.locator('.zoekpaneel img')).toHaveCount(0);
});
test('1996: 36 voorschriften met gedeelde code, paginering en afzonderlijke selectie',async({page})=>{
  await kies(page,'1996-2012');await zoek(page,'3.6.2');
  await expect(page.locator('.zoekstatus')).toContainText('37 resultaten');
  await expect(resultaten(page).locator('[data-zoekresultaat]')).toHaveCount(25);
  await page.getByRole('button',{name:/Meer resultaten tonen/}).click();
  await expect(resultaten(page).locator('[data-zoekresultaat]')).toHaveCount(37);
  const laatste=page.locator('[data-zoekresultaat="1996-2012:3.6.2::036"]');await laatste.getByRole('button').click();
  await expect(page.locator('.officiele-code')).toHaveText('Officiële code 3.6.2');
  await expect(page.locator('[data-onderdeel="1996-2012:3.6.2::036"]')).toHaveAttribute('aria-selected','true');
  expect(await resultaten(page).innerText()).not.toContain('::');
});
test('vervallen standaard uit, optioneel aan, filterstatus herkenbaar',async({page})=>{
  await kies(page);await zoek(page,'7.1.20');
  await expect(page.locator('.zoekstatus')).toContainText('0 resultaten');
  await expect(page.locator('.zoekstatus')).toContainText('uitgesloten');
  await page.getByRole('checkbox',{name:'Vervallen resultaten meenemen'}).check();
  await expect(page.locator('.zoekstatus')).toContainText('1 resultaat');
  await expect(resultaten(page)).toContainText('Vervallen');
  await resultaten(page).getByRole('button').first().click();
  await expect(page.locator('#details')).toContainText('Dit resultaat is vervallen');
});
test('wisselen wist opdracht, resultaten en filters voordat de nieuwe lijst arriveert',async({page})=>{
  await kies(page);await zoek(page,'1.1');await page.getByRole('checkbox').check();
  let vrij;const wacht=new Promise(r=>{vrij=r;});
  await page.route('**/datasets/2017/*.json',async route=>{await wacht;await route.continue();});
  await page.getByRole('combobox').selectOption('2017');
  await expect(page.getByRole('searchbox')).toBeDisabled();await expect(page.getByRole('searchbox')).toHaveValue('');
  await expect(page.getByRole('checkbox')).not.toBeChecked();await expect(resultaten(page)).toBeHidden();
  vrij();await expect(page.getByRole('status')).toContainText('geladen.');await zoek(page,'1.1');
  expect(await resultaten(page).locator('[data-zoekresultaat]').evaluateAll(ns=>ns.every(n=>n.dataset.zoekresultaat.startsWith('2017:')))).toBeTruthy();
});
test('wissen en lege opdrachten verschillen van geen resultaten; boom blijft beschikbaar',async({page})=>{
  await kies(page);await zoek(page,'Gemeentewapen');await page.getByRole('button',{name:'Wissen',exact:true}).click();
  await expect(page.getByRole('searchbox')).toHaveValue('');await expect(resultaten(page)).toBeHidden();
  await expect(page.getByRole('searchbox')).toBeFocused();
  await zoek(page,'   …  ');await expect(page.locator('.zoekstatus')).toHaveText('Voer een officiële code of trefwoorden in.');
  await zoek(page,'onbestaanbaarzoekwoord');await expect(page.locator('.zoekstatus')).toContainText('0 resultaten');
  await expect(page.getByRole('treeitem')).toHaveCount(29);
  await expect(page.getByRole('alert')).toBeHidden();
});
test('wijzigen van invoer verbergt verouderde resultaten tot opnieuw zoeken',async({page})=>{
  await kies(page);await zoek(page,'Gemeentewapen');await page.getByRole('searchbox').fill('plan');
  await expect(resultaten(page)).toBeHidden();await page.getByRole('searchbox').press('Enter');await expect(resultaten(page)).toBeVisible();
});
test('toetsenbordbediening en zichtbare focus op resultaat, generiek/specifiek herkenbaar',async({page})=>{
  await kies(page);await zoek(page,'1.1');
  await expect(resultaten(page)).toContainText('Generiek resultaat');await expect(resultaten(page)).toContainText('Specifiek resultaat');
  await page.getByRole('checkbox').focus();await page.keyboard.press('Tab');
  const eerste=resultaten(page).getByRole('button').first();await expect(eerste).toBeFocused();
  expect(await eerste.evaluate(n=>getComputedStyle(n).outlineStyle)).toBe('solid');
  await page.keyboard.press('Enter');await expect(page.locator('#detailtitel')).toHaveText('Ingericht');
  await expect(page.locator('#detailtitel')).toBeFocused();
  await expect(page).toHaveURL(/#selectie=2020%3A1\.1$/);
});
test('technische zoekfout geeft foutmelding en wordt geen nul resultaten',async({page})=>{
  await kies(page);
  // Foutinvoer op de normalisatiegrens; geen dataset of modulecode gewijzigd.
  await page.evaluate(()=>{const normaal=String.prototype.normalize;String.prototype.normalize=function(...args){if(String(this)==='technischetestfout')throw new Error('geïnjecteerde zoekfout');return normaal.apply(this,args);};});
  await zoek(page,'technischetestfout');
  await expect(page.getByRole('alert')).toContainText('technische fout');
  await expect(page.locator('.zoekstatus')).toHaveText('Zoeken is niet gelukt.');
  await expect(page.getByRole('treeitem')).toHaveCount(29);
});
test('mobiele resultaten leesbaar zonder overflow; geen consolefouten',async({page})=>{
  const fouten=[];page.on('pageerror',e=>fouten.push(e.message));page.on('console',m=>{if(m.type()==='error')fouten.push(m.text());});
  await page.setViewportSize({width:390,height:844});await kies(page);await zoek(page,'jeugdhulp client');
  await expect(resultaten(page)).toBeVisible();
  await page.locator('[data-zoekresultaat="2020:3.1.4"]').getByRole('button').click();
  await expect(page.locator('#detailtitel')).toHaveText('Plan van aanpak jeugd- hulp cliënt');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();expect(fouten).toEqual([]);
});
