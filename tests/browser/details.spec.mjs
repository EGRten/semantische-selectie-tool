import { test, expect } from '@playwright/test';
import {readFile} from 'node:fs/promises';
const bron=async(lijst,naam='selectiegegevens')=>JSON.parse(await readFile(new URL(`../../datasets/${lijst}/${naam}.json`,import.meta.url),'utf8'));
async function kies(page,lijst){await page.getByLabel('Selectielijst',{exact:true}).selectOption(lijst);await expect(page.locator('.laadstatus')).toContainText('geladen.');}
async function vind(page,code,lijst='2020'){await kies(page,lijst);await page.getByRole('searchbox').fill(code);await page.getByRole('searchbox').press('Enter');await page.locator('.zoekresultaatknop').first().click();}
async function selecteer(page,id,lijst){await kies(page,lijst);const nodes=await bron(lijst,'structuur');const regels=await bron(lijst);let node=nodes.find(n=>n.id===id)||nodes.find(n=>n.id===regels.find(r=>r.id===id).structuur_id);const pad=[];while(node){pad.unshift(node.id);node=nodes.find(n=>n.id===node.parent_id);}
for(const parent of pad){if(parent===id)break;const item=page.locator(`[data-onderdeel="${parent}"]`);if(await item.getAttribute('aria-expanded')==='false')await item.locator(':scope > .boomrij > .pijl').click();}
await page.locator(`[data-onderdeel="${id}"] > .boomrij`).click();}
test.beforeEach(async({page})=>{await page.goto('./');});
for(const lijst of ['1996-2012','2017','2020'])test(`${lijst}: volledige brongetrouwe kopie en lazy algemene bepalingen`,async({page})=>{
const regel=(await bron(lijst))[0];await selecteer(page,regel.id,lijst);
await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async tekst=>{window.kopie=tekst;}}});});
await page.getByRole('button',{name:'Kopieer selectiegegevens',exact:true}).focus();await page.keyboard.press('Enter');
await expect(page.locator('.kopieerstatus')).toHaveText('Selectiegegevens gekopieerd.');await expect(page.getByRole('button',{name:'Kopieer selectiegegevens',exact:true})).toBeFocused();
const tekst=await page.evaluate(()=>window.kopie);expect(tekst).toContain(`Officiële code: ${regel.code}`);expect(tekst).toContain(regel.bewaartermijn.officiele_tekst);expect(tekst).not.toContain('::');expect(tekst).not.toContain('null');
await page.getByText('Algemene bepalingen raadplegen',{exact:true}).click();await expect(page.locator('#details .broncontext').filter({hasText:'Algemene bepalingen raadplegen'}).locator('summary').filter({hasText:/^Pagina 1$/})).toBeVisible();
await page.locator('summary').filter({hasText:/^Pagina 1$/}).click();await expect(page.getByText('Brontekst · pagina 1',{exact:true})).toBeVisible();
await page.getByText('Selectielijst, versie en vaststelling',{exact:true}).click();await expect(page.locator('#details')).toContainText((await bron(lijst,'manifest')).vaststellingsgegevens.publicatie);
});
test('kopieerfout is toegankelijk en herstelt bediening',async({page})=>{await vind(page,'1.1.2');await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('Geen toestemming');}}}));await page.getByRole('button',{name:'Kopieer selectiegegevens'}).click();await expect(page.locator('.kopieerstatus')).toContainText('Kopiëren is niet gelukt');await expect(page.getByRole('button',{name:'Kopieer selectiegegevens'})).toBeEnabled();});
test('1996 rubriekcontext en verschillende voorschriften behouden volledige bronwaarden',async({page})=>{
for(const id of ['1996-2012:2.1::001','1996-2012:2.1::002']){await selecteer(page,id,'1996-2012');const r=(await bron('1996-2012')).find(r=>r.id===id);await expect(page.locator('dt').filter({hasText:/^Bewaartermijn$/}).locator('+dd')).toHaveText(r.bewaartermijn.officiele_tekst);await page.getByText('Volledige rubriekcontext raadplegen',{exact:true}).click();await expect(page.getByText('Officieel rubriekfragment',{exact:true}).first()).toBeVisible();await expect(page.locator('#details')).toContainText('Leesbare paginakopie');expect(await page.locator('#details').innerText()).not.toContain('::');}
});
test('alle elf annotaties op het juiste record, geen officiële rectificatie gesuggereerd',async({page})=>{
let aantal=0;for(const lijst of ['2017','2020'])for(const r of await bron(lijst)){const aa=r.verificatie.bronannotaties||[];if(!aa.length)continue;await selecteer(page,r.id,lijst);for(const a of aa){await expect(page.locator('.annotaties')).toContainText(a.bevinding);await expect(page.locator('.annotaties')).toContainText(a.verwerking);aantal++;}await expect(page.locator('.annotaties')).toContainText('geen officiële rectificatie');if(lijst==='2017')await expect(page.locator('dt').filter({hasText:/^Procestermijn$/}).locator('+dd')).toHaveText('Nihil');}expect(aantal).toBe(11);
});
test('contextfout en opnieuw proberen zonder vervuiling van andere lijst',async({page})=>{
await page.route('**/datasets/2020/bepalingen.json',r=>r.fulfill({status:404}));await vind(page,'1.1.2');const knop=page.getByText('Algemene bepalingen raadplegen',{exact:true});await knop.click();await expect(page.getByRole('alert')).toContainText('broncontext kan niet');await page.unroute('**/datasets/2020/bepalingen.json');await knop.click();await knop.click();await expect(page.locator('summary').filter({hasText:/^Pagina 1$/})).toBeVisible();await kies(page,'2017');await expect(page.getByRole('button',{name:'Kopieer selectiegegevens'})).toHaveCount(0);
});
test('bronlinks documentbreed, hogere niveaus en beide zoekmodi met hetzelfde detailrecord',async({page})=>{
for(const mode of ['Trefwoordzoeken','Begripsgericht zoeken']){await kies(page,'2020');await page.getByRole('tab',{name:mode,exact:true}).click();await page.getByRole('searchbox').fill('22.1.3');await page.getByRole('searchbox').press('Enter');await page.locator('.zoekresultaatknop').first().click();await expect(page.locator('[data-onderdeel="2020:22.1.3"]')).toHaveAttribute('aria-selected','true');await expect(page.locator('.annotaties')).toContainText('afgebroken');await expect(page.getByRole('navigation',{name:'Broodkruimelpad'})).toContainText('22.1.3');}
await expect(page.locator('#details')).toContainText('Documentbrede bronlink');await expect(page.getByRole('link',{name:'Bron raadplegen'}).first()).toHaveAttribute('href',/^https:/);
await selecteer(page,'2020:1','2020');await expect(page.getByRole('button',{name:'Kopieer selectiegegevens'})).toHaveCount(0);await expect(page.locator('#details dt').filter({hasText:/^Bewaartermijn$/})).toHaveCount(0);
});
test('vervallen resultaat herkenbaar en ontbrekende waarden nooit null',async({page})=>{const r=(await bron('2020')).find(r=>r.status==='vervallen');await selecteer(page,r.id,'2020');await expect(page.locator('#details')).toContainText('Dit resultaat is vervallen');await expect(page.locator('#details')).toContainText('Niet van toepassing: vervallen resultaat.');expect(await page.locator('#details').innerText()).not.toContain('null');});
test('echt Chromium-klembord ontvangt geselecteerde bronwaarden',async({page,context})=>{
await context.grantPermissions(['clipboard-read','clipboard-write']);await vind(page,'22.1.2');await page.getByRole('button',{name:'Kopieer selectiegegevens'}).click();await expect(page.locator('.kopieerstatus')).toHaveText('Selectiegegevens gekopieerd.');const tekst=await page.evaluate(()=>navigator.clipboard.readText());expect(tekst).toContain('Officiële code: 22.1.2');expect(tekst).toContain((await bron('2020')).find(r=>r.id==='2020:22.1.2').toelichting);
});
test('late broncontext schrijft niet in nieuwe lijst; ongeldige context krijgt fout',async({page})=>{
let vrij;const wacht=new Promise(r=>vrij=r);await page.route('**/datasets/2020/bepalingen.json',async route=>{await wacht;await route.continue();});await vind(page,'1.1.2');await page.getByText('Algemene bepalingen raadplegen',{exact:true}).click();await expect(page.locator('#details')).toContainText('Brontekst laden');await kies(page,'2017');vrij();await expect(page.locator('#details')).not.toContainText('Brontekst laden');await expect(page.getByText('Pagina 1',{exact:true})).toHaveCount(0);
await page.route('**/datasets/2017/bepalingen.json',r=>r.fulfill({json:[{id:'2020:bronpagina:1',tekst:'verkeerde lijst',bron:{bron_id:'2020-officieel',pdf_pagina:1}}]}));await selecteer(page,'2017:1.1','2017');await page.getByText('Algemene bepalingen raadplegen',{exact:true}).click();await expect(page.getByRole('alert')).toContainText('ongeldige verwijzing');await expect(page.locator('#details')).not.toContainText('verkeerde lijst');
});

// Vertrouwde knopactivering zonder Chromium-specifieke permissies of clipboard-read.
test('native kopieerfunctie onderscheidt echt schrijven van expliciete browserweigering',async({page},testInfo)=>{
 await vind(page,'22.1.2');await page.bringToFront();
 const permissie=await page.evaluate(async()=>{try{return (await navigator.permissions.query({name:'clipboard-write'})).state;}catch{return 'niet_opvraagbaar';}});
 await page.evaluate(()=>{const origineel=navigator.clipboard.writeText;navigator.clipboard.writeText=async function(tekst){const r=window.__nativeKopie={actief:navigator.userActivation.isActive,focus:document.hasFocus(),tekstAanwezig:typeof tekst==='string'&&tekst.length>0};try{await origineel.call(this,tekst);r.status='geschreven';}catch(e){r.status='geweigerd';r.fout=e.name;throw e;}};});
 await page.getByRole('button',{name:'Kopieer selectiegegevens',exact:true}).click();await expect.poll(()=>page.evaluate(()=>window.__nativeKopie?.status)).toMatch(/geschreven|geweigerd/);
 const r=await page.evaluate(()=>window.__nativeKopie);console.log('Native klembord '+JSON.stringify({engine:testInfo.project.name,permissie,...r}));expect(r.actief).toBe(true);expect(r.focus).toBe(true);expect(r.tekstAanwezig).toBe(true);
 if(r.status==='geschreven')await expect(page.locator('.kopieerstatus')).toHaveText('Selectiegegevens gekopieerd.');
 else {expect(permissie,'Verleende toestemming mag niet stilzwijgend als weigering worden behandeld').not.toBe('granted');expect(r.fout).toBe('NotAllowedError');await expect(page.locator('.kopieerstatus')).toContainText('Controleer de klembordtoestemming');await expect(page.locator('.kopieerstatus')).toContainText('selecteer en kopieer de tekst handmatig');await expect(page.getByRole('button',{name:'Kopieer selectiegegevens',exact:true})).toBeEnabled();await expect(page.locator('#details')).not.toBeEmpty();}
});
