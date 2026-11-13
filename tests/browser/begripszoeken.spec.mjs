import {controleerLijstisolatie} from '../helpers/lijstisolatie.mjs';
import {wisseldiagnostiek} from '../helpers/wisseldiagnostiek.mjs';
import {test,expect} from '@playwright/test';
async function kies(page,id='2020'){await page.getByLabel('Selectielijst',{exact:true}).selectOption(id);await expect(page.getByRole('status')).toContainText('geladen.');}
async function begrippen(page){await page.getByRole('tab',{name:'Begripsgericht zoeken',exact:true}).click();await expect(page.getByRole('searchbox')).toBeEnabled();}
async function zoek(page,q){await page.getByRole('searchbox').fill(q);await page.getByRole('searchbox').press('Enter');}
const resultaten=page=>page.getByRole('region',{name:'Begripsgerichte zoekresultaten',exact:true});
test.beforeEach(async({page})=>{await page.goto('./');});

test('standaard trefwoordmodus laadt geen lexicon; begripsmodus uitsluitend gekozen lijst, cache hergebruikt',async({page})=>{
 const requests=[];page.on('request',r=>{if(r.url().includes('/datasets/'))requests.push(r.url());});
 await kies(page,'1996-2012');expect(requests).toHaveLength(3);
 await expect(page.getByRole('tab',{name:'Trefwoordzoeken',exact:true})).toHaveAttribute('aria-selected','true');
 await begrippen(page);expect(requests).toHaveLength(5);expect(requests.every(u=>u.includes('/1996-2012/'))).toBeTruthy();
 await zoek(page,'WABO');await expect(resultaten(page)).toContainText('2.7');
 await page.getByRole('tab',{name:'Trefwoordzoeken',exact:true}).click();await begrippen(page);expect(requests).toHaveLength(5);
});
test('verklaring toont herkomst, echte onderbouwing en status; resultaat navigeert naar boom en details',async({page})=>{
 await kies(page,'1996-2012');await begrippen(page);await zoek(page,'WABO');
 const r=page.locator('[data-zoekresultaat="1996-2012:2.7"]');await r.locator('summary').click();
 await expect(r).toContainText('brononderbouwd_gecontroleerd');await expect(r).toContainText('Herkomst: Brononderbouwde aanvulling');
 await expect(r).toContainText('Bron:');await r.getByRole('button').click();
 await expect(page.locator('[data-onderdeel="1996-2012:2.7"]')).toHaveAttribute('aria-selected','true');
 await expect(page.locator('.officiele-code')).toHaveText('Officiële code 2.7');
});
test('beoordeelde AI-zoekrichting is onderscheiden van ongetoetste voorstellen',async({page})=>{
 await kies(page);await begrippen(page);await zoek(page,'Waar vind ik notulen van vergaderingen?');
 const r=page.locator('[data-zoekresultaat="2020:19"]');await r.locator('summary').click();
 await expect(r).toContainText('Beoordeelde AI-zoekrichting');await expect(r).toContainText('geen officieel synoniem');
 await expect(page.getByRole('checkbox',{name:'Ook onbevestigde AI-zoektermen gebruiken'})).not.toBeChecked();
});
test('onbevestigde AI expliciet aan, duidelijk gemarkeerd en weer uit',async({page})=>{
 await kies(page);await begrippen(page);await zoek(page,'actueel');
 await expect(page.locator('.ai-aanduiding')).toHaveCount(0);
 const checkbox=page.getByRole('checkbox',{name:'Ook onbevestigde AI-zoektermen gebruiken'});await checkbox.check();
 await expect(page.locator('.ai-aanduiding').first()).toContainText('onbevestigde AI-zoekrelatie');
 await expect(page.locator('.begripsstatus')).toContainText('inbegrepen');await checkbox.uncheck();
 await expect(page.locator('.ai-aanduiding')).toHaveCount(0);
});
test('zoekmodi onafhankelijk; wisselen wist oude resultaten en onbevestigd filter',async({page})=>{
 await kies(page);await begrippen(page);await zoek(page,'actueel');await page.getByRole('checkbox',{name:'Ook onbevestigde AI-zoektermen gebruiken'}).check();
 await page.getByRole('tab',{name:'Trefwoordzoeken',exact:true}).click();await expect(page.getByRole('searchbox')).toHaveValue('');
 await zoek(page,'Gemeentewapen');await expect(page.getByRole('region',{name:'Zoekresultaten',exact:true})).toBeVisible();
 await begrippen(page);await expect(page.getByRole('searchbox')).toHaveValue('');await expect(resultaten(page)).toBeHidden();
 await expect(page.getByRole('checkbox',{name:'Ook onbevestigde AI-zoektermen gebruiken'})).not.toBeChecked();
});
test('lijstwissel verwijdert resultaten en gebruikt uitsluitend nieuw lexicon',async({page},testInfo)=>{
 const meet=await wisseldiagnostiek(page,testInfo);await meet('start');
 const requests=[];page.on('request',r=>{if(/zoeklexicon|relaties/.test(r.url()))requests.push(r.url());});
 await kies(page);await begrippen(page);await zoek(page,'notulen');
 await kies(page,'2017');await expect(page.getByRole('searchbox')).toBeEnabled();await expect(resultaten(page)).toBeHidden();
 await zoek(page,'notulen');await expect(resultaten(page).locator('[data-zoekresultaat]').first()).toBeVisible();await meet('voor isolatiecontrole');await controleerLijstisolatie(resultaten(page),'2017');await meet('na isolatiecontrole');
 await resultaten(page).locator('.zoekresultaatknop').first().click();await expect(page.locator('#detailtitel')).toBeFocused();expect(decodeURIComponent(new URL(page.url()).hash)).toMatch(/^#selectie=2017:/);
 expect(requests).toHaveLength(4);expect(requests.some(u=>u.includes('/1996-2012/'))).toBeFalsy();
});
test('traag oud lexicon kan na modus- en lijstwissel geen resultaten of status terugzetten',async({page})=>{
 let vrij;const wacht=new Promise(r=>{vrij=r;});await page.route('**/datasets/2020/zoeklexicon.json',async r=>{await wacht;await r.continue();});
 await kies(page);await page.getByRole('tab',{name:'Begripsgericht zoeken',exact:true}).click();
 await expect(page.locator('.begripsstatus')).toContainText('laden');
 await page.getByRole('tab',{name:'Trefwoordzoeken',exact:true}).click();await kies(page,'2017');vrij();
 await zoek(page,'Gemeentewapen');await expect(page.locator('.zoekstatus')).toContainText('1 resultaat');
 await expect(page.getByRole('tab',{name:'Trefwoordzoeken',exact:true})).toHaveAttribute('aria-selected','true');
});
test('ontbrekend lexicon: begrijpelijke fout, trefwoorden blijven werken, herstel mogelijk',async({page})=>{
 await page.route('**/datasets/2020/zoeklexicon.json',r=>r.fulfill({status:404,body:'ontbreekt'}));await kies(page);
 await page.getByRole('tab',{name:'Begripsgericht zoeken',exact:true}).click();await expect(page.getByRole('alert')).toContainText('zoeklexicon');
 await page.getByRole('tab',{name:'Trefwoordzoeken',exact:true}).click();await zoek(page,'Gemeentewapen');await expect(page.locator('.zoekstatus')).toContainText('1 resultaat');
 await page.unroute('**/datasets/2020/zoeklexicon.json');await begrippen(page);await zoek(page,'notulen');await expect(resultaten(page)).toBeVisible();
});
test('vervallen instelling blijft expliciet en wordt op lijstwissel gewist',async({page})=>{
 await kies(page);await begrippen(page);await zoek(page,'7.1.20');await expect(page.locator('.begripsstatus')).toContainText('0 resultaten');
 await page.getByRole('checkbox',{name:'Vervallen resultaten meenemen'}).check();await expect(page.locator('.begripsstatus')).toContainText('1 resultaat');
 await kies(page,'2017');await expect(page.getByRole('checkbox',{name:'Vervallen resultaten meenemen'})).not.toBeChecked();
});
test('tabs met toetsenbord, mobiele leesbaarheid en geen consolefouten',async({page})=>{
 const fouten=[];page.on('pageerror',e=>fouten.push(e.message));page.on('console',m=>{if(m.type()==='error')fouten.push(m.text());});
 await kies(page);await page.getByRole('tab',{name:'Trefwoordzoeken',exact:true}).focus();await page.keyboard.press('ArrowRight');
 await expect(page.getByRole('tab',{name:'Begripsgericht zoeken',exact:true})).toBeFocused();await expect(page.getByRole('searchbox')).toBeEnabled();
 await page.setViewportSize({width:390,height:844});await zoek(page,'notulen');
 await expect(resultaten(page)).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();expect(fouten).toEqual([]);
});
