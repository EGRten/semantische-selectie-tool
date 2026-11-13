import {test,expect} from '@playwright/test';
import {controleerLijstisolatie,isolatieLocators} from '../helpers/lijstisolatie.mjs';
const gevallen=[
 {naam:'alle actief',ids:['2017:1.1','2017:2.1'],geldig:true},
 {naam:'later resultaat uit vorige lijst',ids:['2017:1.1','2020:2.1'],geldig:false},
 {naam:'lege identificatie',ids:['2017:1.1',''],geldig:false},
 {naam:'verkeerde prefix',ids:['2017:1.1','20170:2.1'],geldig:false},
 {naam:'lege verzameling',ids:[],geldig:false},
];
async function vul(page,ids){await page.setContent('<section id="resultaten">'+ids.map(id=>`<li data-zoekresultaat="${id}">Testrecord</li>`).join('')+'</section>');}
// Afzonderlijke pagina/context, zonder app, netwerk, datasetverwerking of lijstwissel.
// Blijft in alle engines actief: een eventuele evaluatiecrash blijft als fout zichtbaar.
test('geïsoleerde evaluateAll: resultaatprefixen zonder applicatieverwerking',async({page,browserName})=>{
 console.log('Isolatieprobe '+JSON.stringify({engine:browserName,versie:page.context().browser().version(),methode:'evaluateAll'}));
 for(const g of gevallen){await vul(page,g.ids);const r=page.locator('[data-zoekresultaat]');const n=await r.count();console.log('Voor evaluateAll '+g.naam);const alle=await r.evaluateAll(ns=>ns.every(n=>n.dataset.zoekresultaat.startsWith('2017:')));console.log('Na evaluateAll '+g.naam);expect(n>0&&alle,g.naam).toBe(g.geldig);}
});
test('onafhankelijke DOM-attribuutcontrole valideert ook latere en lege resultaten',async({page})=>{
 for(const g of gevallen){await vul(page,g.ids);const paneel=page.locator('#resultaten'),{alle,vreemd}=isolatieLocators(paneel,'2017');expect((await alle.count())>0&&(await vreemd.count())===0,g.naam).toBe(g.geldig);
  if(g.geldig)await controleerLijstisolatie(paneel,'2017');else await expect(controleerLijstisolatie(paneel,'2017')).rejects.toThrow();
 }
});
