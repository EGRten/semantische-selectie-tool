import {test,expect} from '@playwright/test';
test('brongebonden afbreking is in de 2020-details leesbaar',async({page})=>{
 await page.goto('./#selectie=2020%3A3.1');
 await expect(page.locator('#details')).toContainText('gladheidsbestrijdingsplan');
 await expect(page.locator('#details')).not.toContainText('glad- heidsbestrijdingsplan');
});
test('rubrieknaam leest met juiste kommaspatie en toont de letterlijke bronvorm',async({page})=>{
 await page.goto('./#selectie=1996-2012%3A3.4.1');
 await expect(page.locator('#detailtitel')).toContainText('leasen, huur');
 await expect(page.locator('#details')).toContainText('PDF (pagina 36)');
 await expect(page.locator('#details')).toContainText('leasen,huur');
});
