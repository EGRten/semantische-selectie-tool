import {test,expect} from '@playwright/test';
for(const [id,fragment]of [['1996-2012:2.11::003','(metadata)'],['1996-2012:3.1.2::001','(zie ook 2.10)']]){
 test(`bronherijking: broncorrectie ${id} in details en volledige tabel`,async({page})=>{
  await page.goto(`./#selectie=${encodeURIComponent(id)}`);await expect(page.locator('#detailtitel')).toBeVisible();await expect(page.locator('#details')).toContainText(fragment);
  const bron=await(await page.request.get('./datasets/1996-2012/selectiegegevens.json')).json();const record=bron.find(r=>r.id===id);expect(record.officiele_omschrijving).toContain(fragment);
  await page.goto(`./#lijst=${encodeURIComponent(id)}`);await expect(page.locator('.lijsten-viewer tbody tr')).toHaveCount(494);await expect(page.locator('.lijsten-viewer')).toContainText(fragment);
 });
}
test('bronherijking: eerdere Nihil-keuze blijft met afzonderlijke nieuwe brononzekerheid zichtbaar',async({page})=>{
 await page.goto('./#selectie=2017%3A7.1.2');await expect(page.locator('#detailtitel')).toBeVisible();await expect(page.locator('#details')).toContainText('Nihil');await expect(page.locator('.annotaties')).toContainText('niet opnieuw uit de leidende PDF bevestigd');
});
