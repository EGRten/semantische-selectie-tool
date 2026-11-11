# Statische gegevenslaag

## Selectielijsten raadplegen en downloaden — opdracht 16

De hoofdnavigatie bestaat nu uit **Zoeken en verkennen**, **Selectielijsten raadplegen** en **Concordans raadplegen**. De nieuwe raadpleegfunctie biedt één doorlopende tabel per officiële lijst: 494 / 305 / 346 voorschriften, eenvoudig tabelzoeken, links naar dezelfde details en terug naar de exacte rij. Alleen de gekozen dataset wordt geladen, met hergebruik van de bestaande cache.

De drie downloads heten exact `Selectielijst 1996-2012.xlsx`, `Selectielijst 2017.xlsx` en `Selectielijst 2020.xlsx`, met werkbladen `Selectiegegevens` en `Bronvermelding`. Zij bevatten alle voorschriften ongeacht zoekfilters, uitgebreide officiële gegevens, afzonderlijke annotaties/statussen, volledige controle-JSON en broncontext. De bestaande tekstuele publicatiegrondslag geldt binnen dezelfde afbakening; oorspronkelijke documenten en concordansdata worden niet toegevoegd. Zie [selectielijsten-raadplegen.md](selectielijsten-raadplegen.md) voor veldherkomst, rechten, links en tests.


De TypeScript-module in `src/gegevenslaag/` ontsluit de bestaande datasets afzonderlijk, zonder gebruikersinterface, zoekmachine, backend of externe API. Datasetwaarden worden niet aangepast of gekopieerd naar een afgeleid gegevensbestand.

## Technische structuur en bouwen

- `index.ts`: laden, sessiecache, technische validatie, indexen en opvraagfuncties.
- `typen.ts`: readonly TypeScript-typen afgeleid van de bestaande structuur-, selectiegegevens- en manifestschema's, inclusief optionaliteit en nullable waarden. De schema's blijven leidend; bij toekomstige schemawijzigingen moeten de typen worden bijgewerkt. Open schemavelden hebben het type `JsonValue`.
- `validatie.d.ts`: typecontract voor de uit de schema's gegenereerde validators.
- `scripts/bouw-gegevenslaag.mjs`: genereert met Ajv JSON Schema 2020-12-validators uit de drie bestaande schema's en bundelt ze met de gegevenslaag via esbuild.
- `tests/gegevenslaag.test.mjs`: Node-tests met werkelijke datasets, gecontroleerd defecte kopieën in geheugen en een lokale HTTP-test.

Vereist voor ontwikkeling: Node.js 22 of nieuwer en npm. Uitgevoerd met Node.js 24.22.1. Installeer met `npm ci`; `package-lock.json` legt de dependencies vast. Er zijn uitsluitend ontwikkeldependencies: TypeScript 5.9.3, esbuild 0.28.2 en Ajv 8.20.0. Geen framework of afzonderlijke testrunner.

```sh
npm run typecheck
npm run build
npm test
python scripts/valideer_publicatie.py
```

De build controleert de typen en schrijft `dist/gegevenslaag/index.js`, `index.d.ts` en `typen.d.ts`. `dist/` en `node_modules/` zijn uitgesloten van Git. De browsermodule bevat alle benodigde validatiecode en heeft geen npm-runtime of schemafetches nodig. Validators zijn vooraf gegenereerd: er wordt geen `eval` of `new Function` in de browser gebruikt. De volledige schema's worden gecontroleerd zonder typecoercion, standaardwaarden of verwijderen van velden.

## Laden vanuit een toekomstige browserinterface

Plaats bij latere statische hosting de gebouwde module en de bestaande datasetmappen binnen dezelfde publicatiemap. Dit voorbeeld veronderstelt dat de pagina in de hoofdmap van die publicatie staat; de aanroeper bepaalt de basis-URL expliciet.

```js
import { maakGegevenslaag, Gegevensfout, SELECTIELIJSTEN }
  from './dist/gegevenslaag/index.js';

const gegevenslaag = maakGegevenslaag({
  datasetsUrl: new URL('./datasets/', document.baseURI),
});

try {
  const dataset = await gegevenslaag.laadDataset('1996-2012');
  const rubriek = dataset.structuuronderdeel('1996-2012:3.6.2');
  const voorschriften = dataset.selectiegegevensBij(rubriek.id);
  const pad = dataset.padNaar(voorschriften[0].id);
  // Een toekomstige interface kan hier de ongewijzigde gegevens gebruiken.
} catch (error) {
  if (error instanceof Gegevensfout) console.error(error.code, error.message);
  else throw error;
}
```

Dit is gebruiksdocumentatie, geen geïmplementeerde interface. `SELECTIELIJSTEN` bevat uitsluitend `1996-2012`, `2017` en `2020`. De URL moet een map zijn, eindigen op `/` en geen query of fragment bevatten. Er is geen hardgecodeerd domein of rootpad. Voor een publicatie onder `/project/` werkt bijvoorbeeld `new URL('./datasets/', document.baseURI)` wanneer de pagina onder `/project/` staat. Gebruik HTTP(S); browsers ondersteunen het laden van lokale `file:`-JSON niet algemeen. Een optionele `ophalen`-functie kan fetch vervangen, zoals in de tests.

`laadDataset(id)` haalt uitsluitend `manifest.json`, `structuur.json` en `selectiegegevens.json` van de gekozen lijst op. De drie verzoeken mogen parallel lopen. `laadManifest(id)` haalt alleen het manifest op. De module haalt geen zoeklexicons, concordans, externe bronbestanden of andere lijsten op.

De cache hoort bij één `maakGegevenslaag`-instantie. Deel die instantie tijdens de browsersessie. Gelijktijdige aanvragen voor dezelfde lijst delen dezelfde promise; geladen records en het manifest worden hergebruikt. Mislukte aanvragen blijven niet in de datasetcache staan; een expliciete volgende aanvraag probeert opnieuw. Een reeds geldig geladen manifest blijft beschikbaar. Er is geen persistent opslagmechanisme of automatische vernieuwing; maak voor een nieuwe datasetversie een nieuwe instantie.

## Beschikbare functies

Een geladen `Dataset` bevat `id`, `manifest`, de oorspronkelijke `structuur` en `selectiegegevens`. Alle bronrecords en geneste waarden zijn readonly en diep bevroren om wijzigingen via de gedeelde cache te voorkomen. De interne Maps worden niet ontsloten.

| Functie | Verantwoordelijkheid |
| --- | --- |
| `structuuronderdeel(id)` | Oorspronkelijk structuurrecord op technische ID ophalen. |
| `hoofdonderdelen()` | Structuuronderdelen met `parent_id=null` in officiële volgorde ophalen. |
| `kinderen(id)` | Directe structuurkinderen op basis van `parent_id` en `volgorde` ophalen. |
| `ouder(id)` | Ouder van een structuuronderdeel ophalen; voor een losse technische voorschriftregel diens `structuur_id`. Een hoofdonderdeel heeft `null` als ouder. |
| `padNaar(id)` | Volledig pad vanaf het hoofdonderdeel, inclusief het gevraagde onderdeel. Een losse voorschriftregel wordt als laatste stap toegevoegd. Iedere stap bevat `soort` (`structuur` of `voorschrift`) en het oorspronkelijke record in `gegevens`. |
| `selectiegegeven(id)` | De volledige oorspronkelijke selectieregel ophalen. |
| `selectiegegevensBij(structuurId)` | Alle aan dit structuuronderdeel gekoppelde selectieregels, in volgorde van het oorspronkelijke selectiegegevensbestand. Alleen directe koppelingen; geen automatische overerving of recursieve verzameling. |
| `structuurBijSelectiegegeven(id)` | Het via `structuur_id` gekoppelde structuuronderdeel ophalen. |
| `bronannotatiesBij(selectieId)` | De annotaties uit `verificatie.bronannotaties` van de selectieregel ophalen. |

Onbekende IDs leveren voor enkelvoudige opvragen en paden `undefined` op; lijstfuncties leveren een lege readonly lijst. Een ID uit een andere lijst levert nooit gegevens uit die andere lijst op. `ouder()` onderscheidt een onbekend onderdeel (`undefined`) van een hoofdonderdeel (`null`).

Bronverwijzingen blijven in onder meer `bron`, `aanvullende_bronnen`, `procestermijn.bron`, `aanvangsmoment.bron` en `verificatie.bronannotaties` beschikbaar. Het manifest bevat het bronnenregister. Bronbeschrijvingsbestanden zijn metadata, geen meegeleverde PDF's. Verwijzingen naar bepalingen en rubriekcontext blijven behouden; de tekstbestanden zelf worden in deze stap niet aanvullend geladen.

## Indexen en verschillen tussen de lijsten

Er zijn aparte Maps voor structuur-ID's en selectie-ID's. Hetzelfde canonieke ID mag in beide bestanden voorkomen: dit beschrijft dezelfde entiteit. Binnen elk bestand zijn dubbele IDs blokkerend. Verder zijn er Maps van `parent_id` naar structuurkinderen en van `structuur_id` naar selectieregels. De kindindex sorteert op het numerieke veld `volgorde`, met oorspronkelijke bestandsvolgorde bij gelijke waarden. De oorspronkelijke arrays worden niet gesorteerd of aangepast.

1996/2012 bevat 108 structuuronderdelen: twee hoofdstukken, zestien taakvelden en negentig rubrieken. Sommige rubrieken vallen rechtstreeks onder een hoofdstuk. De 494 technische voorschriftregels staan afzonderlijk in `selectiegegevens.json`; `kinderen()` verzint daarvoor geen extra structuurrecords. Gebruik `selectiegegevensBij()` naast de structuurkinderen. Rubriek `3.6.2` heeft bijvoorbeeld 36 voorschriftregels. Hun IDs met `::001` enzovoort zijn technische verwijzingen. Voor weergave van de officiële code moet de aanroeper het oorspronkelijke veld `code` gebruiken; suffixen zijn geen officiële selectiecodes.

2017 heeft 334 structuuronderdelen en 305 selectieregels; 2020 heeft 375 structuuronderdelen en 346 selectieregels. Beide bevatten 29 procestypen met generieke en specifieke resultaten. `resultaattype` is een veld van de selectieregel en wordt geen nieuw hiërarchisch niveau. `padNaar()` dupliceert een resultaat niet wanneer het als structuuronderdeel én selectieregel dezelfde canonieke ID heeft. De gegevenslaag leidt geen ouderrelaties uit codes af.

## Validatie en foutafhandeling

Schema- en indexvalidatie gebeuren voordat een dataset beschikbaar wordt. De controles zijn technisch en geven geen oordeel over de juridische juistheid of toepasselijkheid van selectiegegevens.

| Foutcode | Betekenis |
| --- | --- |
| `ONBEKENDE_LIJST` | Niet-ondersteunde lijst; synchroon afgewezen vóór een netwerkverzoek. |
| `LADEN_MISLUKT` | Netwerkfout of HTTP-fout; de bestands-URL en waar beschikbaar status/cause zijn opgenomen. |
| `ONGELDIGE_JSON` | Response kan niet als JSON worden gelezen. |
| `SCHEMAFOUT` | Verplicht veld ontbreekt of een bestand voldoet niet aan het meegeleverde schema; maximaal vijf foutlocaties in de melding. |
| `DUBBELE_ID` | Technische ID komt dubbel voor binnen structuur of selectiegegevens. |
| `ONGELDIGE_VERWIJZING` | Verkeerde lijstprefix, ontbrekende ouder, ontbrekend structuuronderdeel, verkeerde gedeelde ID-koppeling, ontbrekend generiek resultaat of een annotatie die naar een andere lijst/regel verwijst. |
| `CYCLUS` | Ouderketen bevat een cyclus, inclusief een verwijzing naar zichzelf. |
| `MANIFESTFOUT` | Verkeerde lijstidentificatie of afwijkende aantallen structuuronderdelen/selectieregels. |

Een fout laat de laadpromise afwijzen en levert geen gedeeltelijk bruikbare dataset op. Een onjuiste basis-URL geeft een `TypeError`. Schema-validatie staat geldige nullable bronvelden toe: `null` met de bestaande status is geen technische fout. De gegevenslaag vult geen tekst of termijn aan. Samengestelde waarderingen, volledige toelichtingen, bronannotaties, vervallen regels en statusvelden blijven intact. Er worden geen vernietigingsdatums berekend.

## Uitgevoerde controles en beperkingen

Op 10 november 2026:

- `npm test`: alle 36 tests geslaagd, inclusief TypeScript-build en tests met uitgeschakelde dynamische codegeneratie. Alle twaalf gevraagde testonderwerpen zijn afgedekt, aangevuld met caching, mutatiebescherming, manifestafwijkingen, cyclusdetectie en een HTTP-subpadtest met native fetch.
- `python scripts/valideer_publicatie.py`: geslaagd voor de drie volledige pakketten, inclusief de integriteitsvingerafdrukken. Aantallen 494/1.005/55, 305/1.342/54 en 346/1.746/55 behouden.
- `npm audit --omit=optional --audit-level=moderate`: geen bekende kwetsbaarheden gemeld voor de gecontroleerde dependencies.
- Git-controle: datasets, hoofd-README en `AGENTS.md` ongewijzigd. Geen buildresultaten of lokale dependencies in de commit.

Er is geen test in een grafische browser uitgevoerd. De browserbundle is met `platform=browser` gebouwd en zonder dynamische codegeneratie via native fetch tegen een lokale HTTP-server getest. De oorspronkelijke bron-PDF's zijn niet opnieuw inhoudelijk gecontroleerd. De runtime controleert de drie geladen bestanden en hun relevante verwijzingen; volledige pakketmanifesthashes, overige bestanden en inhoudelijke bronintegriteit blijven onder de bestaande Python-publicatievalidatie vallen. Testvragen uit het pakket zijn geen tests van een toekomstige zoekmachine.

De gegevenslaag bevat geen zoekverrijking, concordansfunctie, frontend, opslaglaag, externe API-koppeling of ChatGPT Sites-integratie. De bestaande rechten-, privacy- en bronvoorbehouden blijven gelden.
