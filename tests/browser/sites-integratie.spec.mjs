import {test,expect} from '@playwright/test';
for(const breedte of [1440,390])test(`Sites-indeling en boomlink met toetsenbord op ${breedte}px`,async({page})=>{
 await page.setViewportSize({width:breedte,height:1000});await page.goto('./');
 await expect(page.getByRole('heading',{name:'Van vraag naar voorschrift'})).toBeVisible();
 await page.getByLabel('Selectielijst',{exact:true}).selectOption('2020');await expect(page.locator('.laadstatus')).toContainText('geladen.');
 const maten=await page.evaluate(()=>{const boom=document.querySelector('.zijbalk').getBoundingClientRect(),zoek=document.querySelector('.zoekgebied').getBoundingClientRect(),details=document.querySelector('#details').getBoundingClientRect();return {boom:{left:boom.left,right:boom.right,top:boom.top,bottom:boom.bottom},zoek:{left:zoek.left,top:zoek.top,bottom:zoek.bottom},detailTop:details.top,overloop:document.documentElement.scrollWidth>innerWidth};});
 expect(maten.overloop).toBe(false);expect(maten.detailTop).toBeGreaterThanOrEqual(maten.zoek.bottom);
 if(breedte>720)expect(maten.zoek.left).toBeGreaterThanOrEqual(maten.boom.right);else expect(maten.zoek.top).toBeGreaterThanOrEqual(maten.boom.bottom);
 const link=page.getByRole('link',{name:'Blader door de boomstructuur'});await link.focus();await page.keyboard.press('Enter');await expect(page.getByRole('treeitem').first()).toBeFocused();
 await page.keyboard.press('ArrowRight');await expect(page.getByRole('treeitem').first()).toHaveAttribute('aria-expanded','true');
});
for(const begrip of [false,true])test(`Sites: ${begrip?'begrips-':'trefwoord'}resultaat houdt actieve boomrij zichtbaar en focust details`,async({page})=>{
 await page.goto('./');await page.getByLabel('Selectielijst',{exact:true}).selectOption('2020');await expect(page.locator('.laadstatus')).toContainText('geladen.');
 if(begrip)await page.getByRole('tab',{name:'Begripsgericht zoeken',exact:true}).click();
 const input=page.locator(begrip?'#begripsopdracht':'#zoekopdracht');await expect(input).toBeEnabled();await input.fill('19.1.19');await input.press('Enter');
 await page.locator(`${begrip?'.begripspaneel':'.zoekpaneel'} [data-zoekresultaat="2020:19.1.19"] button`).click();
 await expect(page.locator('#detailtitel')).toBeFocused();await expect(page.locator('.actieve-lijst')).toContainText('2020');await expect(page.locator('.context')).toContainText('Selectielijst 2020');
 const geselecteerd=page.locator('[data-onderdeel="2020:19.1.19"]');await expect(geselecteerd).toHaveAttribute('aria-selected','true');
 await expect.poll(()=>geselecteerd.evaluate(e=>{const r=e.firstElementChild.getBoundingClientRect(),g=e.closest('.boomgebied').getBoundingClientRect(),z=e.closest('.zijbalk').getBoundingClientRect();return r.top>=Math.max(g.top,z.top,0)-1&&r.bottom<=Math.min(g.bottom,z.bottom,innerHeight)+1;})).toBe(true);
 await expect(page.locator('.broodkruimels [aria-current=page]')).toHaveText('19.1.19 Gegevens over personen bij wie een reisdocument moet worden geweigerd of ingehouden');
 await expect(page.locator('.kerngegevens dt')).toHaveText(['Waardering','Bewaartermijn']);await expect(page.locator('.kerngegevens')).toContainText('Na kennisgeving');
 await page.getByRole('link',{name:'Blader door de boomstructuur'}).focus();await page.keyboard.press('Enter');await expect(geselecteerd).toBeFocused();
});
test('Sites: zoekcontext volgt lijstwissel en wissen zonder verouderde lijstnaam',async({page})=>{
 await page.goto('./');const keuze=page.getByLabel('Selectielijst',{exact:true});
 for(const id of ['1996-2012','2017','2020']){await keuze.selectOption(id);await expect(page.locator('.laadstatus')).toContainText('geladen.');await expect(page.locator('.actieve-lijst')).toContainText(id==='1996-2012'?'1996, actualisatie 2012':id);}
 await keuze.selectOption('');await expect(page.locator('.actieve-lijst')).toHaveText('Kies links een selectielijst om te zoeken.');await expect(page.getByRole('searchbox')).toBeDisabled();
});
