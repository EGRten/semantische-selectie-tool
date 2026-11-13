# Browsercompatibiliteit en aanvullende toegankelijkheid

12 november 2026. Baseline: **`586b474`**, actuele main inclusief PR #27. Gerichte aanvulling op de [releasevalidatie](release-acceptatie.md), geen nieuwe algemene audit. Publicatierechten, licenties en publicatiekeuze zijn niet gewijzigd.

## A. Omgeving en bewijs

| Onderdeel | Werkelijk beschikbaar / gebruikt |
| --- | --- |
| Omgeving | Debian GNU/Linux 13 (Linux), Node 24.22.1; headless browsers |
| Chromium | **156.0.8078.79**, systeeminstallatie `/usr/bin/chromium` |
| Firefox | **Niet uitgevoerd**. Officiële installatie van Firefox 159.0 / Playwright-build 1572 mislukt; ook geen lokaal uitvoerbaar bestand |
| WebKit | **Niet uitgevoerd**. Officiële installatie van WebKit 27.2 / Playwright-build 2388 mislukt; ook geen lokaal uitvoerbaar bestand |
| Hulpmiddelen | Bestaande Playwright 1.65.0, axe-core 4.11.0 buiten projectdependencies, bestaande Python ZIP/OOXML-lezer en exportvergelijker |
| Publicatieroute | Gewone productiebuild op `http://127.0.0.1:4188/semantische-selectie-tool/`, zonder bronalias of externe dienst |
| Niet beschikbaar | Echte Safari/iOS, NVDA/VoiceOver/andere schermlezer, Windows Contrast Themes en Office/LibreOffice met ondersteunende technologie |

Beide browserinstallaties zijn via de officiële Playwright-CDN en Microsoft-downloadhost geprobeerd. De proxy retourneert **403 `Domain forbidden`**; afzonderlijke launchproeven bevestigen ontbrekende binaries. Dit is een omgevingsbeperking, geen productdefect. Versies hierboven bij Firefox/WebKit zijn aangevraagde downloads, geen geteste browserinstallaties. WebKit zou ook bij een geslaagde Linux-test geen volledige Safari-/Apple-praktijkproef zijn.

De Browser-plugin is niet beschikbaar; de frontend-testskill is met reguliere Playwright gebruikt. Automatisch aangestuurde interacties/metingen zijn onderscheiden van visuele inspectie; geen echte schermlezertest geclaimd.

**Uitgevoerd:** **9 nieuwe tests en 23 geselecteerde bestaande Chromium-regressietests geslaagd**, geen skips; productiebuild en typecheck geslaagd. De negen nieuwe tests omvatten vier werkelijke Excel-downloads, negen axe-scans en gerichte ARIA-/focus-/doelgrootteproeven. De eerdere 163 moduletests, 122 Chromium-tests en 26 axe-scans blijven historische bewijsbasis; ze zijn niet volledig herhaald. Geen nieuwe productieafhankelijkheid.

## B. Compatibiliteitsmatrix

G = aangetoond in de genoemde Chromium-proeven (voortbouwend op opdracht 24); NT = niet uitgevoerd, niet geslaagd verklaard.

| Onderdeel | Chromium | Firefox | WebKit |
| --- | --- | --- | --- |
| Applicatie laden | G, werkelijk repositorysubpad | NT | NT |
| Navigatie | G, drie bomen, selectie en terugkeer | NT | NT |
| Exact zoeken | G, bestaande code-/trefwoordtests | NT | NT |
| Semantisch zoeken | G, lexiconresultaat en uitleg | NT | NT |
| Details | G, officiële records en focus | NT | NT |
| Concordans | G, echte historische vergelijking | NT | NT |
| Tabellen | G, alle 716/494/305/346 rijen | NT | NT |
| Excel-downloads | G, vier bestanden inhoudelijk teruggelezen | NT | NT |
| Permalinks | G, URL/focus/Back/Forward | NT | NT |
| Thema's | G, vier keuzes, herladen en systeememulatie | NT | NT |
| Toetsenbord | G, boom, skiplinks en vier sticky tabellen | NT | NT |
| Mobiel en zoom | G, 320px en echte Chromium-zoom 200/400% | NT | NT |

Browsermatrix beschikbaar in `playwright.compat.config.mjs`: Chromium, Firefox en WebKit krijgen elk hun eigen engine. Vier bestaande Chrome-instellingen-/CDP-proeven worden voor Firefox/WebKit niet uitgevoerd. De 127 overige testgevallen per engine zijn alleen geïnventariseerd, **niet gedraaid** in Firefox/WebKit. Geen Chromium-resultaten aan die engines toegeschreven.

## C. Bevindingen en herstel

| ID | Reproductie / bewijs | Ernst / resultaat |
| --- | --- | --- |
| BC-01 — boompijl | Kies een lijst; de uitklappijl was 16×24 CSS px. Klik 10px rechts van het middelpunt: de aangrenzende rijselectie wordt geactiveerd in plaats van uitklappen. De 24px-cirkel overlapt die andere actie; de afstandsuitzondering dekt dit niet. De nieuwe regressie faalt vóór herstel (`16 < 24`) | Toegankelijkheidsdefect, SC 2.5.8. Alleen `.pijl` in `style.css` aangepast: 1,5rem breed, minimaal 24px breed/hoog; SVG blijft gelijk. Na herstel werkt de randklik binnen het 24×24-vlak voor alle drie lijsten in Chromium. Geen brontekst of navigatiecontract gewijzigd. Firefox/WebKit-hertest blijft NT |
| BC-02 — engines ontbreken | Installatie én launch van Firefox/WebKit onmogelijk door bovengenoemde proxybeperking | Belangrijke verificatielacune. Voer dezelfde matrix uit in een omgeving met toegankelijke officiële binaries; geen onbewezen compatibiliteit geclaimd |

De nieuwe testhulp is gecorrigeerd voor lokale `blob:`-downloads: dat zijn geen externe netwerkafhankelijkheden. Boom-Enter houdt volgens het bestaande contract focus in de boom; activering van een zoekresultaat focust de details. De aanvullende test volgt dat bestaande onderscheid. Geen bestaande testverwachtingen gewijzigd om productfouten te verbergen.

## D. Aanvullende toegankelijkheid

- **Automatisch:** negen axe-scans in licht/donker/hoog contrast op codezoeken, echte vergelijking en 2020-tabel (eerste 30 tabelrijen; overige bediening volledig). Geen gerapporteerde overtredingen. Overige tabelrijen blijven gerenderd; dit is geen volledige inhouds-/criteriumdekking.
- **Contrast en `incomplete`:** Twee aanvullende regelgerichte scans op 2020 en concordans vinden geen overtredingen, maar 281 respectievelijk 334 onvolledige kleurchecks wegens (deels) bedekte elementen in scrollgebieden. De daadwerkelijk zichtbare eerste rijlinks zijn gemeten op **6,43:1** (groen op wit). Hun raakvlakken zijn circa 21,4×20 en 31,5×20px, met cellen van 97 en 269px hoog; vrije ruimte rond deze doelen is beoordeeld. Niet alle offscreen cellen zijn daarmee afzonderlijk beoordeeld. De resterende automatische beoordelingen zijn geen bewezen overtreding en evenmin individueel geslaagd. Eerdere token-/toestandsmetingen blijven aanvullend bewijs.
- **Skiplinks en focus:** initiële skiplink naar details en activering naar `lijstviewertitel` en `concordans-viewertitel` zijn gericht gecontroleerd. De axe-`skip-link`-melding blijft `incomplete`, dus niet als een volledig geslaagde automatische regel behandeld. Vier tabellen met Tab/Shift+Tab, horizontale scroll en variabele kophoogte, inclusief 320px en echte 200/400%-zoom; geen focusverlies achter koppen in de getoetste situaties.
- **Doelgrootte (2.5.8):** boompijl hersteld. Hoofdcontrols geometrisch getoetst. Kleine broodkruimelknoppen (circa 22,4px hoog) hebben in de onderzochte opstelling een vrije 24px-cirkel; de afstandsuitzondering is expliciet beoordeeld. Niet ieder inline bronlinkje of iedere broninhoud is integraal op alle uitzonderingen beoordeeld; geen algemene 44px-AA-eis gebruikt.
- **Taal (3.1.2):** pagina is `lang="nl"`, bediening Nederlandstalig. Gerichte signalering van doorlopende Engelse passages in de vier publicatie-JSON's leverde geen kandidaten op; dit is geen volledige taalkundige beoordeling. Afzonderlijke namen/vaktermen kunnen onder de normuitzonderingen vallen. Bronwaarden zijn niet herschreven of automatisch als anderstalig gemarkeerd.
- **Status/ARIA/leesvolgorde:** zoekstatus krijgt de actuele tekst en `aria-live="polite"`; boomrol, naam, expanded/selected en pijltjestoetsen getoetst. De mobiele vergelijking behoudt DOM-volgorde veld → geselecteerd → gerelateerd. Werkelijke uitspraak/timing van meldingen en semantische leesbaarheid met een schermlezer zijn **niet getest**.
- **Systeem en documenten:** forced-colors is uitsluitend Chromium-emulatie. Geen echte Windows-, Safari-, schermlezer- of Office-AT-proef. XLSX-inhoud is technisch teruggelezen, geen documenttoegankelijkheidsverklaring.

Gerichte screenshot van het gevonden pijldefect en de hertest staat buiten Git; geen grote meetbestanden toegevoegd. Geen onverwachte console-/runtimefouten of externe HTTP-afhankelijkheden in de nieuwe vier-downloadproeven. Opzettelijk ontbrekende bestanden en een ongeldige netwerkrespons zijn via de bestaande fout-/hersteltests getoetst. De eerste nieuwe testhulp corrigeerde twee aannamen (lokale blobdownload en boomfocus) en hield daarna rekening met de afstandsuitzondering voor kleine controls; bestaande regressieverwachtingen zijn intact.

## E. Technisch releaseadvies

**Geschikt onder expliciet beschreven beperkingen.** De gewone statische build en vier downloads werken in Chromium onder het repositorysubpad; het aangetoonde raakvlakdefect is minimaal hersteld. Firefox/WebKit-compatibiliteit en volledige WCAG 2.2 AA-conformiteit zijn nog niet vastgesteld. REL-02 blijft open voor de ontbrekende browser-, systeem-, schermlezer- en onafhankelijke beoordelingen. Dit is geen opdracht tot Pages-activering en geen nieuwe juridische publicatiebeoordeling.

## Reproduceren

```sh
npm run build
# Alleen noodzakelijke testbrowsers; geen productieafhankelijkheden:
PLAYWRIGHT_BROWSERS_PATH=/tmp/pw28 npx playwright install firefox webkit
# Bestaande regressies en aanvullende tests per beschikbare engine:
PLAYWRIGHT_BROWSERS_PATH=/tmp/pw28 AXE_SOURCE=/pad/axe.min.js \
  npx playwright test -c playwright.compat.config.mjs --project=firefox
PLAYWRIGHT_BROWSERS_PATH=/tmp/pw28 AXE_SOURCE=/pad/axe.min.js \
  npx playwright test -c playwright.compat.config.mjs --project=webkit
AXE_SOURCE=/pad/axe.min.js CHROMIUM_PATH=/usr/bin/chromium \
  npx playwright test -c playwright.compat.config.mjs --project=chromium compatibiliteit.spec.mjs
```

De 23 geselecteerde bestaande regressies zijn uitgevoerd met dezelfde matrixconfig en `--project=chromium -g 'UI-02:|UI-04:|uitsluitend gekozen lijst en officiële hoofdvolgorde|zoekveld boven boom|verklaring toont herkomst|ontbrekend bestand: foutmelding en herstel|onverwachte netwerkrespons|vier keuzes zijn met toetsenbord|Systeem is standaard|native systeemkleuren|alle paletten blijven bruikbaar'`.

Zonder `AXE_SOURCE` zijn de drie nieuwe axe-testgevallen expliciet overgeslagen, niet geslaagd. De scanbijlagen zijn beschikbaar via Playwright-reporters, bijvoorbeeld `--reporter=json` met `PLAYWRIGHT_JSON_OUTPUT_NAME=/tmp/compatibiliteit.json`. Geen testmock of lokale concordansalias vereist. Een volledige huidige matrix bevat 131 Chromium- en 127 Firefox-/WebKit-gevallen; `--list` is uitsluitend inventarisatie.

Bronintegriteit is gecontroleerd via de diff tegen `586b474`: datasets, concordans, relaties/besluiten, publieke JSON, exportmodules/-inhoud, licenties, rechtenverantwoording en Issues-inrichting zijn ongewijzigd. De nieuwe vier-downloadtests controleren namen, werkbladen, aantallen, alle primaire bronwaarden en aanvullende informatie. Geen volledige bron- of rechtencontrole herhaald.
