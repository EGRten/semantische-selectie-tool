import {test,expect} from '@playwright/test';
for(const begrip of [false,true])test(`productietekst: Geschillen behandelen via ${begrip?'begripszoeken':'trefwoordzoeken'} en details`,async({page})=>{
 await page.goto('./');await page.getByLabel('Selectielijst',{exact:true}).selectOption('2020');
 await expect(page.locator('.laadstatus')).toContainText('geladen.');
 if(begrip)await page.getByRole('tab',{name:'Begripsgericht zoeken',exact:true}).click();
 const input=page.locator(begrip?'#begripsopdracht':'#zoekopdracht');await expect(input).toBeEnabled();
 await input.fill('Geschillen behandelen');await input.press('Enter');
 const resultaat=page.locator(`${begrip?'.begripspaneel':'.zoekpaneel'} [data-zoekresultaat="2020:13"] button`);
 await expect(resultaat).toContainText('Geschillen behandelen');await resultaat.click();
 await expect(page.locator('#detailtitel')).toHaveText('Geschillen behandelen');
 await expect(page.locator('[data-onderdeel="2020:13"]')).toHaveAttribute('aria-selected','true');
});
test('productietekst: tabel filtert op intacte woordvorm en navigeert naar hetzelfde voorschrift',async({page})=>{
 await page.goto('./#lijst=2020');await expect(page.locator('.lijsten-viewer tbody tr')).toHaveCount(346);
 const data=await(await page.request.get('./publicatie/2020.json')).json();
 const rij=data.rijen.find(r=>r.id==='2020:13.1.1');expect(JSON.stringify(rij)).toContain('Geschillen behandelen');
 expect(JSON.stringify(rij.waarden)).not.toContain('behan- delen');
 await page.getByLabel('Zoek in deze tabel',{exact:true}).fill('Geschillen behandelen');
 await page.getByRole('button',{name:'Zoeken in tabel',exact:true}).click();
 const resultaat=page.locator('[data-selectierij="2020:13.1.1"]');await expect(resultaat).toBeVisible();await expect(resultaat).toContainText('Geschillen behandelen');
 await resultaat.getByRole('link').click();await expect(page.locator('.officiele-code')).toContainText('13.1.1');
});
