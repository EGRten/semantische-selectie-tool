// Letterlijke vragen en bronfragmenten; geen lexicon, query-expansie of gewijzigde verwachtingen.
import { readFile, writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { maakGegevenslaag } from '../dist/gegevenslaag/index.js';
import { maakZoekindex, zoekwoorden } from '../dist/zoeken/oorspronkelijk.js';
const { values } = parseArgs({ options: { output: { type: 'string' } } });
const root = new URL('../datasets/',import.meta.url);
const laag = maakGegevenslaag({ datasetsUrl:root, ophalen:async url=>new Response(await readFile(url,'utf8')) });
const md = s=>String(s).replace(/\|/g,'\\|').replace(/\s+/g,' ').trim();
const regels=[];const samenvatting=[];
for(const lijst of ['1996-2012','2017','2020']) {
  const dataset=await laag.laadDataset(lijst);const index=maakZoekindex(dataset);
  const vragen=JSON.parse(await readFile(new URL(`${lijst}/testvragen.json`,root),'utf8'));
  const woordcache=new Map();
  let gevonden=0,fragmenten=0,lexicaal=0,fragmentScope=0,vraagScope=0;
  for(const vraag of vragen) {
    const verwacht=[...vraag.verwachte_relevante_categorieen,...vraag.alternatieve_relevante_categorieen];
    const resultaten=index.zoek(vraag.zoekvraag);
    const hit=resultaten.filter(r=>verwacht.includes(r.id));
    const controle=index.zoek(vraag.controleerbaar_bronfragment);
    const fragmenthit=controle.some(r=>verwacht.includes(r.id));
    const binnenScope=r=>dataset.padNaar(r.id)?.some(s=>verwacht.includes(s.gegevens.id));
    const fragmentScopeHit=controle.some(binnenScope);
    if(fragmentScopeHit)fragmentScope++;if(resultaten.some(binnenScope))vraagScope++;
    const afwezig=zoekwoorden(vraag.zoekvraag).filter(w=>{
      if(!woordcache.has(w))woordcache.set(w,index.zoek(w,{vervallenMeenemen:true}).length===0);
      return woordcache.get(w);
    });
    if(hit.length)gevonden++;if(fragmenthit)fragmenten++;if(!hit.length&&afwezig.length)lexicaal++;
    const status=hit.length?'Verwachte categorie gevonden':resultaten.some(binnenScope)?'Voorschrift binnen verwachte categorie':afwezig.length?'Woorden ontbreken in zoekbereik':resultaten.length?'Andere onderdelen gevonden':'Woorden komen niet samen voor';
    regels.push(`| ${md(vraag.id)} | ${md(vraag.zoekvraag)} | ${resultaten.length} | ${hit.length?'ja':'nee'} | ${md(afwezig.join(', ')||'—')} | ${status} | ${fragmenthit?'ja':'nee'} | ${fragmentScopeHit?'ja':'nee'} |`);
  }
  samenvatting.push({lijst,vragen:vragen.length,letterlijk:gevonden,bronfragment:fragmenten,lexicaleMissers:lexicaal,fragmentBinnenCategorie:fragmentScope,vraagBinnenCategorie:vraagScope});
}
const tekst=`# Nulmeting klassiek trefwoordzoeken\n\nReproduceerbaar met \`npm run nulmeting -- --output docs/trefwoordzoeken-nulmeting.md\` na \`npm run build\`. Alle 164 bestaande testvragen en verwachte categorieën zijn ongewijzigd gebruikt. Deze meting gebruikt uitsluitend officiële teksten, niet de semantische zoeklexicons.\n\nDe volledige vraag wordt letterlijk met EN tussen alle woorden gezocht, zonder verwijdering van vraagwoorden of betekenisinterpretatie. Een tweede controle gebruikt uitsluitend het bestaande \`controleerbaar_bronfragment\`. Een treffer betekent hier dat een vooraf genoemde relevante of alternatieve categorie als exact technisch ID in de resultaten staat; er is geen uitbreiding van zoekresultaten naar ouders of kinderen. De aanvullende scopecontrole kijkt alleen voor de evaluatie of een gevonden voorschrift via het bestaande ouderpad binnen een verwachte rubriek valt. Dit wijzigt geen verwachtingen en voegt geen zoekresultaten toe. De standaarduitsluiting van vervallen resultaten geldt. Dit is een vindbaarheidsmeting, geen toepasselijkheidsbeoordeling.\n\n| Lijst | Vragen | Letterlijke vraag vindt verwachte categorie | Bronfragment vindt verwachte categorie | Missers met afwezige woorden | Bronfragment binnen verwachte categorie | Letterlijke vraag binnen categorie |\n| --- | ---: | ---: | ---: | ---: | ---: | ---: |\n${samenvatting.map(r=>`| ${r.lijst} | ${r.vragen} | ${r.letterlijk} | ${r.bronfragment} | ${r.lexicaleMissers} | ${r.fragmentBinnenCategorie} | ${r.vraagBinnenCategorie} |`).join('\n')}\n\nEen afwezig woord is ook bij gedeeltelijk tekstzoeken nergens in de gedocumenteerde officiële zoekvelden gevonden (gecontroleerd inclusief vervallen). Dat kan een andere formulering zijn, maar ook een vraagwoord, ontbrekend bronveld of een niet-herstelde woordafbreking; deze controle bewijst geen semantisch verschil. Woorden die ieder afzonderlijk voorkomen hoeven niet samen in hetzelfde onderdeel te staan. De resultaten hieronder zijn een nulmeting, geen aangepaste verwachte testuitkomsten.\n\n| Vraag-ID | Ongewijzigde vraag | Resultaten | Verwachte categorie gevonden | Afwezige zoekwoorden | Diagnose | Bronfragment vindt categorie | Bronfragment binnen categorie |\n| --- | --- | ---: | --- | --- | --- | --- | --- |\n${regels.join('\n')}\n`;
if(values.output)await writeFile(values.output,tekst);else process.stdout.write(tekst);
console.error(JSON.stringify(samenvatting,null,2));
