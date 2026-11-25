import {test,expect} from '@playwright/test';
test('brongebonden afbreking is in de 2020-details leesbaar',async({page})=>{
 await page.goto('./#selectie=2020%3A3.1');
 await expect(page.locator('#details')).toContainText('gladheidsbestrijdingsplan');
 await expect(page.locator('#details')).not.toContainText('glad- heidsbestrijdingsplan');
});
