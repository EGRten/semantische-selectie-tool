# Browsercompatibiliteit en aanvullende toegankelijkheid

12 november 2026. Baseline: **`586b474`**, actuele main inclusief PR #27. Gerichte aanvulling op de [releasevalidatie](release-acceptatie.md), geen nieuwe algemene audit. Publicatierechten, licenties en publicatiekeuze zijn niet gewijzigd.

## Gerichte herstelanalyse — opdracht 31 (gedeeltelijk)

Bron: [run 43380415462](https://github.com/EGRten/semantische-selectie-tool/actions/runs/43380415462). De openbare samenvatting is gelezen en toont Failure, één artifact en vier foutannotaties. Detailpagina: [job 131736624164](https://github.com/EGRten/semantische-selectie-tool/actions/runs/43380415462/job/131736624164). GitHub vraagt aanmelding voor logs; API-opvragen van logs/artifacts wordt geweigerd met `Forbidden`. De gemelde 22 regressies zijn daardoor **nog niet afzonderlijk op logbewijs geclassificeerd**. Er is geen nieuwe gecontroleerde Actions-run.

| Onderdeel | Classificatie / concrete bevinding | Verwerking |
| --- | --- | --- |
| A — subpad | Onjuiste testaanname: `/testpad/` was hardgecodeerd terwijl de matrix een ander subpad configureert | Verwachting gebruikt nu de werkelijke `baseURL`; applicatie ongewijzigd. Lokaal geslaagd met beide configuraties |
| B — klembord | Chromium-specifieke testaanname: `clipboard-read`/`clipboard-write`-permissies werden voor iedere engine aangevraagd | Alleen die Chromium-uitleestest wordt in andere matrixprojecten uitgesloten. Bestaande content-/fouttests blijven actief; nieuwe native schrijfactivering zonder speciale permissies is voor alle engines opgenomen. Lokaal in Chromium geslaagd; Firefox/WebKit nog niet uitgevoerd |
| C — WebKit-bestandsnamen | Nog niet vastgestelde oorzaak op primair logbewijs; gemelde underscoreconversie nog niet onafhankelijk onderzocht | Geen normalisatie of versoepeling toegepast; bedoelde naam, browsernaam en XLSX-inhoud moeten afzonderlijk worden vergeleken |
| D — WebKit-scroll | Nog niet vastgesteld of interactie werkelijk faalt of de testaanname onjuist is | Alle drie scrolltests behouden |
| E — WebKit-systeemcontrast | Ondersteunings-/presentatieverschil nog niet vastgesteld | Geen CSS-waarde-expectatie verwijderd; emulatie blijft geen echte Windows-proef |
| F — Firefox-crashes | Nog niet vastgesteld; crash-/geheugen-/render-/isolatiedetails ontbreken | Geen time-outs of retries verhoogd, geen applicatiecode aangepast |
| G — Chromium-zoom | Werkelijk focusdefect versus geometrische aanname nog niet vastgesteld | Bestaande zichtbaarheidseis behouden |

Lokaal: drie gerichte tests slagen onder de gewone configuratie en dezelfde drie onder de compatibiliteitsconfiguratie (Chromium). Dit bewijst geen herstel van alle 22 CI-fouten. De nieuwe native kopieertest controleert succesvolle terugmelding na de echte schrijfactie; alleen de Chromium-test leest ook het systeemklembord terug. De overige engines moeten dit nog werkelijk uitvoeren. De matrix heeft nu 132 Chromium- en 127 gevallen per andere engine; vier CDP/Chrome-instellingenproeven plus één Chromium-permissietest zijn in de andere engines uitgesloten.

Voor vervolg zijn de volledige logs van de drie browserstappen en artifact `browserresultaten-43380415462-1` nodig. De compacte artifacts bevatten tellingen, geen foutdetails; alleen die bestanden volstaan dus niet voor crash-/zoom-/scrollanalyse. De bestaande brongegevens, exportinhoud, workflowinstallatie/build en praktijkstatus blijven ongewijzigd. REL-02 blijft open.

## GitHub Actions en praktijkdekking — opdracht 29, 13 november 2026

Baseline van deze aanvulling: `ec992f7` (main inclusief PR #28). De [workflow](../.github/workflows/browsercompatibiliteit.yml) gebruikt Ubuntu 24.04, Node 24, Python 3.12, één npm-installatie/build en de officiële `playwright install --with-deps` voor alle drie engines. Elke engine heeft een herkenbare teststap; de bestaande matrix blijft 131 Chromium-/127 Firefox-/127 WebKit-gevallen omvatten. De vier CDP-/Chrome-instellingenproeven blijven uitsluitend Chromium. Drie tests kiezen nu het expliciete `CHROMIUM_PATH` of de door Playwright geïnstalleerde binary, zodat geen Ubuntu-systeempad wordt verondersteld.

Alleen PR's naar main en `workflow_dispatch` starten de workflow; geen gewone push-trigger of deployment. Per test één CI-retry, lokaal nul. Flaky resultaten, skips, ontbrekende rapporten en installatiefouten geven geen groene eindstatus. `continue-on-error` op de drie browserstappen laat andere engines doorlopen; de verplichte eindcontrole maakt iedere onvolledige/mislukte run rood. `test.only` en ontbrekende axe-voorbereiding worden in CI geweigerd.

Artifacts (7 dagen) bevatten uitsluitend versies en compacte uitkomsten per test/engine, commit en runlink (bij een PR de daadwerkelijk geteste GitHub-mergecommit). Geen ruwe JSON-testbijlagen, DOM, foutwaarden, traces, video's, screenshots, XLSX-bestanden of netwerklichamen worden geüpload. Foutdetails staan in de relevante teststap; het compacte rapport wijst naar testbestand/regel en retry-uitkomsten. Tokens/omgeving worden niet gedumpt. De job heeft alleen `contents: read`; checkout bewaart geen Git-credentials.

**Daadwerkelijke uitvoeringsstatus:** `gh workflow run browsercompatibiliteit.yml --ref browservalidatie-actions` is op 13 november 2026 geprobeerd nadat de branch was gepusht. De GitHub-API weigerde de workflowlookup met `Forbidden`; ook `gh run list --workflow browsercompatibiliteit.yml --branch browservalidatie-actions --limit 5` werd geweigerd. Start en uitvoer kunnen daardoor niet worden bevestigd. Een gewone branchpush start volgens het gekozen triggerbeleid geen workflow. Er is geen gecontroleerd Actions-run-ID of directe runlink beschikbaar. Firefox/WebKit staan daarom nog steeds op **Niet uitgevoerd**; de bestaande matrix hieronder is geen bewijs van een CI-run.

Lokaal zijn 13 geselecteerde Chromium-tests onder de CI-configuratie geslaagd (inclusief vier Excel-downloads, negen axe-scans en de vier Chrome-specifieke proeven). De drie tests van de compacte rapportage slagen, waaronder synthetische mislukte/flaky/overgeslagen/ontbrekende resultaten en omgevingsfouten. Dit valideert de testinrichting, niet Firefox/WebKit. YAML, triggers en eindstatusbewaking zijn lokaal gecontroleerd; dit is geen GitHub-run.

### Nog uit te voeren door de repositorybeheerder

1. Maak de [pull request van `browservalidatie-actions` naar main](https://github.com/EGRten/semantische-selectie-tool/pull/new/browservalidatie-actions) aan. De `pull_request`-trigger is de eerste route, zonder samenvoeging. Controleer **Checks → Browsercompatibiliteit / Chromium, Firefox en WebKit**. Geef alleen indien GitHub daarom vraagt de vereiste beheerdersgoedkeuring voor Actions.
2. Controleer installatie en de drie browserstappen afzonderlijk. Lees de samenvatting en download de compacte artifactrapporten. Noteer de werkelijke engineversies, geteste SHA, aantallen/mislukkingen/flaky/skips en de directe URL `https://github.com/EGRten/semantische-selectie-tool/actions/runs/<run-id>` in dit verslag; vul geen verzonnen run-ID in.
3. Is handmatige uitvoering nodig: zodra deze workflow op de defaultbranch is geregistreerd na reguliere review door de beheerder, open **Actions → Browsercompatibiliteit → Run workflow**, kies de te toetsen branch en start. Een nieuw workflowbestand dat nog niet op de defaultbranch staat, is niet vanzelf via `workflow_dispatch` beschikbaar. Er is geen push-trigger als omweg toegevoegd.
4. Laat de resterende praktijkproeven uitvoeren met het [praktijktestprotocol](praktijktest-toegankelijkheid.md). Alle resultaatvelden staan op **Niet uitgevoerd**. Verwerk eventuele defecten en hertesten; sluit REL-02 pas als de afgesproken bewijsdekking is bereikt.

Technisch advies blijft **geschikt onder beperkingen**: geen nieuwe productdefecten vastgesteld in deze opdracht; CI-bewijs voor alle engines en praktijkbewijs ontbreken nog. Het vrijwillige AA-doel is geen automatische verklaring van wettelijke overheidsplichten voor dit particuliere project.

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
