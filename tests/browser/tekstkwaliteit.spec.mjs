import {test,expect} from '@playwright/test';
for(const begrip of [false,true])test(`tekstkwaliteit: intacte woordvorm via ${begrip?'begripszoeken':'trefwoordzoeken'}, boom en details`,async({page})=>{
 await page.goto('./');await page.getByLabel('Selectielijst',{exact:true}).selectOption('2020');await expect(page.locator('.laadstatus')).toContainText('geladen.');
 if(begrip)await page.getByRole('tab',{name:'Begripsgericht zoeken',exact:true}).click();
 const paneel=begrip?'.begripspaneel':'.zoekpaneel';const input=page.locator(begrip?'#begripsopdracht':'#zoekopdracht');await input.fill('Gehandicaptenparkeerkaart');await input.press('Enter');
 const knop=page.locator(`${paneel} [data-zoekresultaat="2020:8.1.14"] button`);await expect(knop).toContainText('Gehandicaptenparkeerkaart');await knop.click();
 await expect(page.locator('#detailtitel')).toContainText('Gehandicaptenparkeerkaart');await expect(page.locator('[data-onderdeel="2020:8.1.14"]')).toHaveAttribute('aria-selected','true');
 await expect(page.locator('#details')).not.toContainText('Gehandicaptenpar- keerkaart');
});
test('tekstkwaliteit: publieke tabel gebruikt dezelfde broncorrectie en behoudt de recordkoppeling',async({page})=>{
 await page.goto('./#lijst=2020');await expect(page.locator('.lijsten-viewer tbody tr')).toHaveCount(346);
 await page.getByLabel('Zoek in deze tabel',{exact:true}).fill('Gehandicaptenparkeerkaart');await page.getByRole('button',{name:'Zoeken in tabel',exact:true}).click();
 const rij=page.locator('[data-selectierij="2020:8.1.14"]');await expect(rij).toContainText('Gehandicaptenparkeerkaart');await rij.getByRole('link').click();await expect(page.locator('.officiele-code')).toContainText('8.1.14');
});
