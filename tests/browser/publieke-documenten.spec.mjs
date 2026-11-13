import {test,expect} from '@playwright/test';
import {PUBLIEKE_DOCUMENTEN} from '../../scripts/publieke-documenten.mjs';
import {readFile} from 'node:fs/promises';
test('publieke documentwhitelist en alle lokale documentdoelen bereikbaar onder repositorysubpad',async({request,baseURL})=>{
 for(const d of PUBLIEKE_DOCUMENTEN){
  const url=new URL(d.doel,baseURL),r=await request.get(url.href);expect(r.ok(),d.doel).toBe(true);
  const tekst=await r.text(),bron=await readFile(d.bron,'utf8');
  expect(tekst).toBe(d.verplaatsteLink?bron.replace('](../HERGEBRUIK.md)','](./HERGEBRUIK.md)'):bron);
  for(const [,href]of tekst.matchAll(/\]\(([^)]+)\)/g)){
   if(/^[a-z]+:/i.test(href)||href.startsWith('#'))continue;
   const doel=new URL(href,url);expect(doel.pathname.startsWith(new URL(baseURL).pathname),href).toBe(true);
   const antwoord=await request.get(doel.href);expect(antwoord.ok(),`${d.doel} → ${href}`).toBe(true);
  }
 }
 for(const pad of ['controle/concordans-inhoudelijke-beoordeling.json','controle/Controlewerkboek.xlsx','docs/concordans-inhoudelijke-beoordeling.md'])expect((await request.get(new URL(pad,baseURL).href)).status()).toBe(404);
});
test('concordansviewer en vergelijking gebruiken de actuele publieke VNG-bronvermelding',async({page})=>{
 const p=JSON.parse(await readFile('publicatie/concordans.json','utf8'));
 await page.goto('./#concordans');await expect(page.locator('.concordans-viewer tbody tr')).toHaveCount(716);
 await page.locator('.viewer-bron summary').click();await expect(page.locator('.viewer-bron')).toContainText(p.hergebruik);
 await page.goto('./#selectie=2020%3A19.1.19');await page.locator('.historische-relaties>summary').click();await expect(page.locator('.concordans-inhoud')).toContainText('VNG');await expect(page.locator('.concordans-inhoud')).toContainText('26 mei 2020');
 await expect(page.locator('.viewer-bron')).not.toContainText('op instructie');await expect(page.locator('.concordans-inhoud')).not.toContainText('publicerende organisatie en rechthebbenden zijn niet vastgesteld');
});
