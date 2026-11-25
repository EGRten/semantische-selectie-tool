# Tekstkwaliteit JSON — 25 november 2026

Dit register hoort bij `tekstkwaliteit/integrale-controle`, vanaf actuele main `59add247289e3328a2f433ac6c26262d3db0f468` (inclusief PR #47). Het corrigeert uitsluitend visueel gecontroleerde PDF-regelafbrekingen en hun rechtstreeks afgeleide weergaven. Het stelt geen nieuwe officiële formuleringen, selectievoorschriften, synoniemen of historische relaties vast.

## Bronnen en afbakening

De drie externe PDF-bestanden zijn byte-identiek aan `bronnen/semantische-selectie-tool-bronset-2026-11-25.json`. Bestandsnamen, berekende SHA-256 en pagina-aantallen staan in `bronverificatie.json`. De PDF's zijn niet gewijzigd en niet opnieuw aan de repository toegevoegd. De bronregistraties en alle bestanden van `documentatie/bronherijking/` blijven byte-identiek.

Alle **119 JSON-bestanden van de basiscommit** zijn geïnventariseerd, inclusief lege bestanden zonder tekstwaarden. Het register bevat 3.128 veldgroepen met wildcard-JSON-pointers. Er zijn 82.376 tekstwaarden mechanisch onderzocht. De nieuw gemaakte controle-JSON's zijn controle-uitvoer, niet nogmaals hun eigen invoer; ze worden wel geparseerd en gevalideerd. De categorieën onderscheiden primaire gegevens, gegenereerde projecties, aanvullende zoekgegevens, technische metadata/configuratie en historisch bewijs. Technische waarden, termijnen, ruwe extracties en bevroren bewijsregistraties worden geteld maar niet herschreven.

De controle zoekt naar afbrekingen, koppeltekens binnen woorden, U+00AD, bijzondere Unicode-spaties, meervoudige/randspaties, spaties voor en na leestekens, regeleinden en herhaalde woorden. Een patroonmelding bewijst geen fout. Regeleinden, opsommingen, kolommen, broncitaten, historische spelling en betekenisvolle koppeltekens worden niet algemeen genormaliseerd. De taalcontrole is signalerend en omvat twee concreet aangetroffen bronformuleringen, op vier PDF-locaties. Er is **geen volledige handmatige grammaticale beoordeling of certificering van ieder Nederlands tekstveld** uitgevoerd; overige mogelijke taalproblemen blijven ter beoordeling staan.

## Beslisregels en bewijs

- **A**: brongebonden technische regelafbreking. De 36 toegestane woordparen staan expliciet in `scripts/controleer-tekstkwaliteit.py`; ze zijn geen algemene normalisatieregel. Een vervanging vereist tevens dat exact dezelfde splitsing voorkomt in het PDF-bronvenster van het record.
- **B**: `BRP- gegevens`/`BRP-\ngegevens` wordt `BRP-gegevens`, met behoud van het betekenisvolle koppelteken. Overige witruimte wordt gesignaleerd, niet blind aangepast.
- **C**: de bron zelf bevat `voorvoor` of `verstekken`. Vier bronlocaties staan in het taalvoorstellenregister; de officiële formuleringen blijven behouden.
- **D/E**: mogelijke betekeniswijziging of onvoldoende zekerheid betekent niet wijzigen. Onder andere `Basisregistratie-\npersonen` en door elkaar gelezen taakveldkolommen blijven onzeker. Er zijn geen inhoudelijke D-besluiten genomen; dergelijke mogelijke risico's blijven onder E voor menselijke beoordeling.

`bewijs/broncontrole-1.png` t/m `-4.png` en `broncontrole-extra.png` bevatten 40 daadwerkelijk visueel gecontroleerde vensters met code/pagina. De bronnenregisters koppelen die beelden aan de PDF-hashes. De beelden tonen de gekozen woordparen; herhaalde voorkomens worden bovendien per bronpagina/recordvenster technisch geverifieerd. Niet alle 334 PDF-pagina's zijn in deze taak opnieuw visueel beoordeeld.

`tekstkwaliteit-correcties.csv` en `mutaties.json` bevatten dezelfde 371 mutaties, met volledige oude/nieuwe waarde, record-ID, JSON-pointer, classificatie, PDF-bestand/hash/pagina/bbox en motivering. Daarvan zijn 359 stringwaarden en 12 wijzigingen van gegenereerde notitiearrays. Bij die laatste bevat het register de volledige oude/nieuwe array: de bestaande generator laat een dubbele benoemingsnotitie vervallen zodra de gecorrigeerde naam gelijk is aan de getoonde omschrijving. Dit verwijdert geen aanvullende voorschrifttekst.

De primaire bestanden zijn `structuur.json`, `selectiegegevens.json` en de gecontroleerde `tekst`/`tekst_leesbaar` in `bepalingen.json`. `ruwe_extractie` en `officiele_bronrij` blijven exact behouden. Alleen officiële letterlijk afgeleide zoektermen volgen de gecorrigeerde naam; AI-termen, onderbouwingen en relatie-identiteiten blijven staan. CSV's worden uit die JSON's geschreven en publieke projecties met de bestaande generator gemaakt. Concordanscellen worden nooit als correctiebron gebruikt. Alleen 49 reeds bestaande verwijzingslabels volgen hun eigen gecorrigeerde doelrecord.

## Registers lezen

CSV: UTF-8 BOM, puntkomma, CRLF; importeer in Excel de kolommen als **Tekst**. Geneste waarden en posities zijn JSON-gecodeerd. CSV en mutatieregister zijn onafhankelijk teruggelezen; alle cellen blijven binnen de Excel-lengtegrens. Er is geen Excel-desktopimportproef uitgevoerd.

`tekstkwaliteit-bevindingen.csv` bevat 31.844 gegroepeerde patroonmeldingen, met alle posities per identiek patroon/veld en een contextfragment. Dit vertegenwoordigt 200.149 patroonvoorkomens, grotendeels betekenisvolle witruimte en duplicaten in projecties/historisch bewijs. Het is geen telling van fouten. De volledige oorspronkelijke waarde is via basiscommit en JSON-pointer terug te vinden.

`tekstkwaliteit-onzekerheden.csv` bevat 4.991 nog niet besliste signaalgroepen in 1513 verschillende velden van 18 actieve primaire/zoekbestanden. Ook dit zijn geen 4.991 bewezen fouten. Structurele witruimte, gegenereerde herhalingen en bevroren historische meldingen blijven in het volledige bevindingenregister; ze zijn niet als zelfstandige redactionele dossiers gedupliceerd. Bronlocaties van gekoppelde datasetrecords staan in het register; waar geen eigen bron bestaat, blijft die locatie leeg.

De ruwe `procestoelichting` wordt door bestaande details/exporten ook als bronweergave gebruikt. Die onveranderlijke kopie kan afbrekingen behouden. Deze taak voegt daarvoor geen nieuwe interpretatie of alternatieve brontekst toe. De afzonderlijke gecontroleerde toelichtingen zijn wel gecorrigeerd waar het bronbewijs sluitend is. Er wordt daarom niet beweerd dat alle zichtbare broncitaten artefactvrij zijn.

## Gegevensstromen

| Bestanden | Rol in deze controle |
| --- | --- |
| `scripts/herijk-bronnen.py`, `scripts/bronopbouw/extract_tables.py`, `scripts/bronherijking_pdf.py` | Bestaande PDF-extractie/bronherijking; historische uitvoer niet opnieuw overschreven. |
| `scripts/controleer-tekstkwaliteit.py` | Inventarisatie, expliciet toegestane primaire correcties, CSV's en actuele bestandshashes. |
| `scripts/genereer-publicaties.mjs`, `src/publicatie/projectie.ts` | Bestaande publieke JSON-projecties en verwijzingslabels. |
| `scripts/reproduce.py` | Alle 15 dataset-CSV's onafhankelijk herhalen. |
| `scripts/bouw-interface.mjs` | Bestaande begrensde kopie naar `dist/site`; onderzoeksregisters worden niet gepubliceerd. |
| `src/zoeken/`, `src/begripszoeken/`, `src/interface/boom.ts`, `src/interface/details.ts` | Bestaande lezers van gecontroleerde tekst; geen nieuwe zoeklogica of relaties. |
| `src/publicatie/excel.ts`, `src/raadplegen/excel.ts` | Bestaande Excel-generatie uit dezelfde gecorrigeerde gegevens. |

## Reproductie

Gebruik Node 24, vastgelegde npm-afhankelijkheden en `requirements.txt`. De visuele bewijsbladen gebruiken aanvullend de reeds beschikbare Pillow 13.0.0; dit is geen nieuwe applicatieafhankelijkheid. Werk bij `--apply` uitsluitend in een afzonderlijke checkout van de vastgelegde basiscommit. Het script leest die basis met `git show`, zonder reset, en is geen algemene updater voor toekomstige datasets.

```sh
npm ci
python -m pip install -r requirements.txt
# Externe map met precies de drie geregistreerde PDF's:
python scripts/controleer-tekstkwaliteit.py --bronmap /pad/naar/pdfs --output /tmp/tekstkwaliteit-a --apply
npm run typecheck
npm run build
python scripts/controleer-tekstkwaliteit.py --bronmap /pad/naar/pdfs --output /tmp/tekstkwaliteit-a --controleer-projecties
python scripts/controleer-tekstkwaliteit.py --bronmap /pad/naar/pdfs --output /tmp/tekstkwaliteit-b --controleer-projecties
```

Vergelijk de bestandensets en alle bestandshashes van beide uitvoermappen. `reproductie.json` bevat de daadwerkelijk gecontroleerde twee gelijke runs (13 rapportbestanden). De publieke generator wordt daarbij ook onafhankelijk naar een tijdelijke map uitgevoerd en bytegelijk met de checkout vergeleken. Gebruik voor een controle van de opgeleverde branch alleen de opdrachten zonder `--apply`; kopieer de historische nulmeting of mutatieregisters niet opnieuw over bestaande latere auditresultaten.

```sh
python scripts/tekstkwaliteit-bronbeelden.py --bronmap /pad/naar/pdfs --output /tmp/tekstkwaliteit-beelden
python scripts/valideer-tekstkwaliteit.py
python scripts/valideer_publicatie.py
python scripts/reproduce.py --output /tmp/tekstkwaliteit-csv
node scripts/genereer-publicaties.mjs --check
npm run test:unit
CHROMIUM_PATH=/pad/naar/chromium AXE_SOURCE=/pad/naar/axe.min.js npx playwright test -c playwright.compat.config.mjs --project=chromium
```

`inhoud-voor.json` gebruikt expliciet JavaScript-canonisering voor de Node-tests; de actuele publicatievalidator behoudt zijn bestaande Python-canonisering. De oorspronkelijke referentie staat apart in `integriteitsreferentie-voor.json`. De helpers draaien alleen de nieuwe geregistreerde mutaties terug alvorens eerdere bewijschecks toe te passen. Eerdere bewijzen en verwachte bronwaarden zijn niet herschreven om de tests groen te maken.

Zie `tekstkwaliteit-validatie.md` voor feitelijke resultaten en resterende beperkingen. Er is geen pull request samengevoegd of GitHub Pages-deployment gestart.
