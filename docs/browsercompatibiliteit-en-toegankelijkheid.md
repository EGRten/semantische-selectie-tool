# Browsercompatibiliteit en aanvullende toegankelijkheid

12 november 2026. Baseline: **`586b474`**, actuele main inclusief PR #27. Gerichte aanvulling op de [releasevalidatie](release-acceptatie.md), geen nieuwe algemene audit. Publicatierechten, licenties en publicatiekeuze zijn niet gewijzigd.

## PR #33 — aanvullende isolatie van Firefox-evaluatiecrashes

De opdrachtgever rapporteert voor [run 43425701164](https://github.com/EGRten/semantische-selectie-tool/actions/runs/43425701164): Chromium **133/0**, WebKit **128/0**, Firefox **126/2** (geslaagd/mislukt). Beide Firefox-lijstwissels crashen ook bij herhaling bij `locator.evaluateAll`. Deze cijfers zijn aangeleverd, niet opnieuw via API uitgelezen.

Gerichte wijziging op dezelfde PR-branch: de twee scenario's gebruiken nu een onafhankelijke Playwright-locatorcontrole. Voor `S = [data-zoekresultaat]` wordt vereist: `count(S) > 0` én `count(S:not([data-zoekresultaat^="2017:"])) == 0`. Dit controleert dezelfde inhoudelijke voorwaarde als `every(n.dataset.zoekresultaat.startsWith('2017:'))`, met behoud van de bestaande niet-leegcontrole. Het betreft alle resultaten in het betreffende paneel, niet alleen de eerste of zichtbare resultaten. Een afwijkende prefix, lege identificatie en een vreemd resultaat na een geldig resultaat worden afgewezen. Geen Firefox-uitzondering, timeout- of retrywijziging.

De herhaald crashende evaluatie is geen betrouwbaar uitvoerbare functionele assertion in de aangeleverde Firefox-run: zij geeft een procesfout in plaats van een waar/onwaar-uitkomst. Dat rechtvaardigt een afzonderlijke, gelijkwaardige observatiemethode; het bewijst **niet** dat Playwright de crash veroorzaakt of dat de applicatie vrij van een Firefox-defect is. Applicatieverwerking, renderer en evaluatiepad zijn nog niet als oorzaak van elkaar onderscheiden. Productiecode is daarom ongewijzigd.

`tests/browser/lijstisolatie.spec.mjs` houdt `evaluateAll` expliciet actief in een zelfstandige pagina/context zonder app, lijstwissels, datasetverwerking of netwerkverzoeken. Vijf kleine gevallen worden met zowel de oorspronkelijke predicate (plus niet-leegvoorwaarde) als de onafhankelijke locatorcontrole getoetst. Het evaluatiepad logt vóór/na iedere aanroep en de engineversie. Een crash blijft een mislukte test en wordt niet opgevangen als succes. De twee applicatiescenario's loggen nu ook **na** de attribuutcontrole; de bestaande crash-/geheugendiagnostiek en controles op daadwerkelijk openen, 2017-permalink en detailfocus blijven behouden.

**Lokaal uitgevoerd:** Chromium 156.0.8078.79 / Playwright 1.65.0, reguliere compatibiliteitsconfiguratie onder repositorysubpad: **4 geslaagd, 0 mislukt, 0 overgeslagen, 0 flaky**, zonder retries. Dit omvat de twee oorspronkelijke scenario's en twee onafhankelijke probegevallen; hun negatieve fixtures worden eveneens gecontroleerd. Firefox-binary ontbreekt lokaal (de eerder vastgelegde installatieblokkade geldt nog); geen lokale Firefox-uitvoering of nieuw CI-succes geclaimd. Geen volledige matrix herhaald.

Reproduceer met de bestaande configuratie:

```sh
CHROMIUM_PATH=/usr/bin/chromium npx playwright test --config=playwright.compat.config.mjs --project=chromium --grep 'geïsoleerde evaluateAll|onafhankelijke DOM|wisselen wist opdracht|lijstwissel verwijdert resultaten'
```

Externe CI-beoordeling: vergelijk de afzonderlijke evaluatieprobe, locatorprobe en beide applicatiescenario's in Firefox. Crasht de minimale probe ook, dan is applicatieverwerking niet noodzakelijk voor die crash; dat onderscheidt nog niet Playwright van de Firefox-renderer. Slaagt de minimale probe maar crasht een applicatiescenario, dan blijft voorafgaande verwerking/timing/resourcebelasting te onderzoeken. Slagen alle gevallen, dan is de functionele route via het alternatieve meetpad aangetoond, maar is de oorspronkelijke crashoorzaak nog niet bewezen. De nieuwe run moet dit vaststellen; PR #33 blijft open en REL-02 blijft open.

## Webstandaarden en gerichte hertest — opdracht 33

13 november 2026; baseline **`387de88`** (main inclusief PR #32), branch `browserstandaarden-gericht-herstel`. De opdrachtgever rapporteert voor [run 43411239820](https://github.com/EGRten/semantische-selectie-tool/actions/runs/43411239820): Chromium 131/1, Firefox 125/2, WebKit 124/3 (geslaagd/mislukt). Dit zijn aangeleverde resultaten, geen in deze sessie uitgelezen logs. De eerdere analyses hieronder zijn historisch; deze sectie beschrijft de actuele zes restgevallen.

**Bronbeschikbaarheid:** vijf concrete aanvragen naar W3C WCAG 2.2, CSSOM View, CSS2 Tables, Playwright Browsers en Mozilla Memory-documentatie zijn geweigerd met `Tunnel connection failed: 403 Forbidden`. Geen geslaagd extern bronnenonderzoek of bevestigde browserbug geclaimd. Onderstaande normduiding berust op specificatiekennis en bestaande auditdocumentatie; de links dienen voor onafhankelijke verificatie. WPT/Bugzilla zijn niet als geraadpleegd bewijs gebruikt. Er is geen bewijs voor een specifieke Firefox-159-regressie.

| Probleem | Functionele eis | Standaard/bron | Vastgestelde oorzaak | Correctie | Hertest |
| --- | --- | --- | --- | --- | --- |
| Firefox, twee lijstwissels | Geen crash; uitsluitend actieve-lijstresultaten; details blijven bereikbaar | [Mozilla geheugenonderzoek](https://firefox-source-docs.mozilla.org/performance/memory/index.html), [Playwright browserbuilds](https://playwright.dev/docs/browsers) (opvragen geblokkeerd; geen normatieve geheugenlimiet of bewezen bug) | **Nog niet vastgesteld.** `Page crashed` wijst op paginaprocesverlies, niet automatisch op een applicatielek. Aangeleverde RSS/DOM-cijfers bewijzen geen OOM | Geen speculatieve productieaanpassing. Oorspronkelijke isolatieassertion/crashdiagnostiek behouden; aanvullend niet-lege resultaten en werkelijk openen met juiste 2017-permalink/focus vereist | Chromium lokaal; Firefox niet beschikbaar. Geen Firefox-herstelclaim |
| Chromium, focus bij 400% | Focus herkenbaar, niet volledig door auteursinhoud bedekt; toetsenbord bereikbaar | [WCAG 2.2 2.4.11 AA](https://www.w3.org/TR/WCAG22/#focus-not-obscured-minimum), 2.4.7 AA, 2.1.1 A, [1.4.10 AA](https://www.w3.org/TR/WCAG22/#reflow); 2.4.12/2.4.13 zijn AAA | **Te strikte testaanname:** volledige rechthoek binnen viewport werd als AA-eis gebruikt. Opgegeven CI-meting heeft onbedekt middelpunt. Dit bewijst nog niet zelfstandig zichtbare focus | Test meet een onbedekt deel binnen viewport én scrollgebied met hit-tests en eist een zichtbare outline-stijl. Tab én Shift+Tab. Negatieve proef faalt bij volledige overlay en ontbrekende outline. Bestaande focuscontrasttests en productiescrollcorrectie blijven intact | Lokale echte 100/200/400%-Chromium-instelling; CI-hertest open. Automatische hit-test/outlinecontrole is geen volledige visuele of AT-beoordeling |
| WebKit, drie kolombreedtemetingen | Leesbare code/omschrijving, alle kolommen bereikbaar, bruikbare horizontale scroll | [HTML table/col](https://html.spec.whatwg.org/multipage/tables.html#the-col-element), [CSS2 columns](https://www.w3.org/TR/CSS2/tables.html#columns), [CSSOM View rects](https://www.w3.org/TR/cssom-view-1/#dom-element-getclientrects), WCAG 1.4.10 (2D-uitzondering) | **Ongeschikte meetproxy:** een gemelde nulrechthoek voor `col` bewijst geen nulbreedte van zichtbare cellen. Dit stelt geen WebKit-conformiteitsbug vast. De precieze engineverklaring is onbevestigd | Vergelijk gerenderde `th` en eerste/laatste `td` op kolomindex uit `colgroup`. Log ook `col`, tabel- en regiobreedte. Vereis omschrijving breder dan code, consistente cellen, pijltjesscroll en bereikbare laatste kolom bij 320/768/1440px | Vier tabellen lokaal in Chromium; WebKit-hertest blijft nodig |

Branch gepusht; PR-aanmaak via `gh pr create` is geweigerd met `Post "https://api.github.com/graphql": Forbidden`. Er is geen nieuwe gecontroleerde Actions-run. Beheerder: [open de voorbereide PR](https://github.com/EGRten/semantische-selectie-tool/pull/new/browserstandaarden-gericht-herstel) naar main om de bestaande PR-trigger te starten. Dit is geen claim dat de workflow al is uitgevoerd.

### Afbakening van de eisen

Een datatabel mag een tweedimensionale indeling vereisen; dit ontslaat omliggende bediening niet van reflow. De exacte verhouding tussen code- en omschrijvingsbreedte is een **projectkeuze**, geen door HTML voorgeschreven pixelmaat. De gebruikersvraag betreft zichtbare cellen, niet de geometrie van een kolomdescriptor. Een nulmeting van `col` is daarom alleen diagnostiek.

WCAG 2.4.11 AA vereist dat focus niet **volledig** door auteursinhoud wordt verborgen; 2.4.12 AAA stelt een strengere eis. 2.4.7 blijft afzonderlijk gelden. De eerdere audit UI-02 benoemde volledige bedekking; een algemene vrijwillige AAA-toezegging is niet aangetroffen. De productiescrollcorrectie streeft nog steeds naar ruimere zichtbaarheid. De aangepaste zoomtest verlaagt geen contrast-, bron- of navigatie-eis. Een hit-test met computed outline is begrensd automatisch bewijs; rasterweergave en daadwerkelijk gebruik moeten aanvullend worden beoordeeld.

### Firefox-codecontrole

`app.ts` gebruikt een oplopend aanvraagticket vóór toepassing van geladen lijsten; oude resultaten worden meteen ontkoppeld. `begripszoeken.ts` controleert datasetidentiteit, actieve modus en aanvraagticket na lexiconladen. Beide resultaatpanelen renderen maximaal 25 resultaten per uitbreiding en verwijderen oude DOM-kinderen. Er is geen onbeperkte gelijktijdige resultaatrendering aangetoond. De oude dataverzoeken worden niet geannuleerd, maar mogen door de tickets geen nieuwe lijst overschrijven; dit ontbreken van annulering is zonder bewijs geen crashoorzaak. De bestaande vertraagd-oud-lexiconproef blijft behouden. De twee oorspronkelijke `evaluateAll`-assertions zijn niet vervangen of overgeslagen.

### Lokale verificatie en vervolg

Omgeving: Debian 13, Node 24, Playwright 1.65.0, systeem-Chromium 156.0.8078.79, productiebuild onder `/semantische-selectie-tool/`; Browser-plugin niet beschikbaar, bestaande Playwright gebruikt. Build en typecheck slagen. Eerste gerichte run: **8 geslaagd**, zonder retry. Bij alle vier tabellen is de omschrijvingskolom 448px; codekolom circa 134px op 320px en 160px op 768/1440px. Eerste/laatste gegevenscel en kop hebben gelijke breedte; laatste kolom bereikbaar, geen horizontale paginaoverloop.

Regressierun van de vier betrokken suites: **44 geslaagd, 0 mislukt, 0 flaky, 0 overgeslagen**, retries 0 (1,2 minuut). Na aanvulling van voorwaartse Tab naast Shift+Tab: beide focusgevallen opnieuw geslaagd (2/2). Geen volledige browsermatrix of nieuwe downloadinhoudscontrole uitgevoerd: exportcode en gegevens zijn niet aangepast. De laatste focusaanpassing is in deze afzonderlijke naloop getoetst.

Een aanvullende DOM-/interactieprobe op het repositorysubpad bevestigt paginatitel, 346 rijen, focus op code 2.2, viewport 320×256 bij echte 400%-instelling en geen `pageerror`. De headless-screenshot van die probe bevatte alleen de achtergrond en biedt **geen bruikbaar visueel bewijs**; oorzaak van de opname is niet vastgesteld. Geen geslaagde handmatige beoordeling van de focusindicator geclaimd. Visuele verificatie op de CI-browser/een normale browser blijft nodig; de geautomatiseerde geometrie-/hit-test is daarvoor geen volledige vervanging.

Firefox 159.0 en afzonderlijk WebKit installeren is geprobeerd met de bestaande Playwright-installatiemethode; beide downloads worden geblokkeerd met HTTP 403 `Domain forbidden`. Geen Firefox-/WebKit-uitvoering, nieuwe groene matrix of bekende browserbug geclaimd. Geen time-outs, retries, limieten of engine-uitzonderingen toegevoegd. De aangeleverde zes CI-fouten zijn hiermee niet alle opgelost verklaard.

Reproduceer lokaal (met beschikbare systeembinary of geïnstalleerde Playwright-browsers):

```sh
npm run build
npm run typecheck
CHROMIUM_PATH=/usr/bin/chromium npx playwright test --config=playwright.compat.config.mjs --project=chromium tests/browser/designsysteem.spec.mjs tests/browser/themas.spec.mjs tests/browser/zoeken.spec.mjs tests/browser/begripszoeken.spec.mjs
```

Laat de bestaande PR-workflow de drie engines draaien. Beheerder/beoordelaar: lees de twee Firefox-crashlogs, OOM-/procesdiagnostiek en uitkomsten van de nieuwe cel-/focusmetingen; leg runlink, geteste SHA, browserversies, passed/failed/flaky/skipped vast. Voor Firefox is een schone afzonderlijke herhaling van de twee oorspronkelijke scenario's nodig als zij in de matrix opnieuw crashen. Alleen een lokaal Chromium-resultaat sluit dat probleem niet. **REL-02 blijft open**, inclusief de afzonderlijke praktijkproeven. Geen nieuwe API-autorisatiediagnose, bron-/export-/productiecodewijziging of Pages-activering.

## Resterende browserfouten — opdracht 32 (gedeeltelijke hertest)

Baseline `ac79085` (main inclusief PR #31). Primaire verwijzing: [run 43400824248](https://github.com/EGRten/semantische-selectie-tool/actions/runs/43400824248), [job 131802935133](https://github.com/EGRten/semantische-selectie-tool/actions/runs/43400824248/job/131802935133). De openbare pagina is gelezen: de browserstappen en eindcontrole hebben foutannotaties. Detail-logs vereisen aanmelding; API-logtoegang en browserinstallaties blijven geblokkeerd met HTTP 403. Er is geen beschikbare GitHub-toolkoppeling met aanvullende logtoegang. De door de gebruiker aangeleverde fouten/tellingen worden hieronder als zodanig gebruikt; niet als onafhankelijk uitgelezen detailrapport.

| Foutgroep | Oorzaak / classificatie | Herstel | Hertest | Status |
| --- | --- | --- | --- | --- |
| Firefox: twee lijstwissels (`begripszoeken`, `zoeken`) | `Page crashed` is een browser-/renderercrashmelding, geen bewijs welke component of geheugenoorzaak deze veroorzaakt | Geen speculatieve applicatieaanpassing. Log bij lijstwissel/crash DOM-/resultaataantallen, Node-RSS, geschatte som van browserproces-RSS en cgroup-OOM-tellers; geen broninhoud. Proces-RSS-som kan gedeelde pagina's dubbel tellen en is geen PSS-/lekbewijs | Beide geïsoleerde gevallen lokaal geslaagd in Chromium; Firefox-binary niet beschikbaar | **Oorzaak en Firefox-herstel niet vastgesteld**; crashlog, OOM-/procesgegevens en schone Firefox-herhaling nodig |
| WebKit: vier volledige XLSX-controles | De bestaande `geslaagd` combineert inhoud met `suggestedFilename`; de opgegeven underscorevariant kan dus naamfalen geven zonder inhoudsfout. Overige oorzaken zijn nog niet uitgesloten | Log alle booleans uit de ongewijzigde checker. Controleer het exacte `a.download`-aanbod apart van browsermetadata; daarna dezelfde strikte XLSX-checker met die daadwerkelijk geobserveerde naam | Vier Chromium-exports inhoudelijk geslaagd. WebKit-hertest nog niet beschikbaar | **Inhoud niet versoepeld; specifieke WebKit-uitkomst nog vast te stellen** |
| WebKit: overige naamchecks (drie selectielijsten, concordans, publieke naslagwerken) | Gemeld browserafhankelijk voorstel met underscores; applicatie stelt volgens broncode de voorgeschreven naam in | Gedeelde testhelper eist exact origineel aanbod. Alleen WebKit mag uitsluitend spaties naar underscores omzetten in het voorstel. Hoofdletters, extensie en overige tekens moeten exact blijven. Geen productienaam of export gewijzigd | Chromium en synthetische negatieve naamgevallen geslaagd; WebKit niet uitgevoerd | **Onderbouwde, begrensde testcorrectie; daadwerkelijke WebKit-hertest open** |
| WebKit-scroll: 320/768/1440px | Nog niet vastgesteld of toetsenbordscroll werkelijk ontbreekt of de meting onjuist is | Assertion `scrollLeft > 0` blijft. Bij falen logt de test scrollWidth/clientWidth/scrollLeft, focus, vaste kop en laatste kolom | Lokale Chromium-hertest hieronder; WebKit ontbreekt | **Niet opgelost verklaard**. WebKit-wiel-/DOM-/toetsenbordvergelijking en kolombereik nodig |
| Chromium-zoom: focusgeometrie | CI-geometrie/bedekking nog niet bekend; geen bewijs om de eis te verlagen | Zichtbaarheidseis intact. Bij falen extra viewport-, DPR-, focusrect-, kophoogte-, scroll- en hit-testdiagnostiek | Lokale Chromium-hertest hieronder; CI-Chromium kan een andere versie gebruiken | **CI-herstel niet vastgesteld**; geen time-out/retryverhoging |
| Chromium: native klembord | Een echte `writeText`-weigering zonder voorafgaande permissie is onderscheiden van onjuiste broninhoud. Onverwachte fouten blijven fouten | Breng pagina naar voorgrond; eis actieve gebruikersactie, documentfocus en niet-lege tekst. Bij toegestaan schrijven blijft succes vereist. Alleen `NotAllowedError` zonder verleende permissie mag de bestaande begrijpelijke fout met handmatig alternatief geven. Granted+weigering of andere fout blijft rood. Echte inhoudsuitleestest met permissies blijft behouden | Lokaal echte schrijf- én uitleestest geslaagd; CI-beleid opnieuw toetsen | **Succes- en weigeringspad expliciet**, geen onvoorwaardelijke succesclaim |
| WebKit: twee forced-color-adjust-checks | Computed `""` bewijst op zichzelf geen defect. Ondersteuning moet tijdens de test worden vastgesteld | `CSS.supports` bepaalt de verwachting: ondersteund vereist exact `auto`; niet ondersteund vereist exact lege computed waarde. Alle overige focus-/selectieranden en systeemvoorkeurassertions blijven staan. Een ondersteunde eigenschap met lege waarde blijft falen | Chromium meldt ondersteund/auto en slaagt; WebKit-capaciteit nog niet uitgelezen | **Capability-afhankelijke testcorrectie; presentatie-/Windows-praktijkbewijs blijft open** |

Lokale omgeving: Chromium **156.0.8078.79**, Playwright **1.65.0**, Debian 13. Eerst 11 gerichte wissel-/exporttests en vier klembord-/systeemkleurtests geslaagd. Een unitproef voor de begrensde bestandsnaamvariant slaagt; samen met bestaande exportcheckerproeven: vier geslaagd, één bestaande bronafhankelijke proef overgeslagen wegens ontbrekende `CONCORDANS_BRON_JSON`-instelling. Geen inhoudelijke validatie uitgeschakeld. Volledige lokale Chromium-matrix op de gewijzigde werkboom: **131 geslaagd, 1 mislukt, 0 flaky, 0 overgeslagen** (132 gevallen, retries lokaal 0). De fout is een 30s-time-out bij de gefilterde 1996/2012-download; de snapshot toont nog “Excel-bestand maken…”. Een aansluitende geïsoleerde naloop van negen export-/lijstwisselgevallen slaagt, inclusief dezelfde export en de laatste diagnostiek. De mislukte volledige run blijft als zodanig geregistreerd: de oorzaak van deze incidentele lokale exportvertraging is nog niet vastgesteld en niet opgelost verklaard. Typecheck slaagt. Geen grens of retry verhoogd.

| Browser | Aangeleverde oude CI-run: geslaagd / mislukt | Nieuwe gecontroleerde Actions-resultaten |
| --- | --- | --- |
| Chromium | 130 / 2 | Nog niet beschikbaar |
| Firefox | 125 / 2 | Nog niet beschikbaar |
| WebKit | 113 / 14 | Nog niet beschikbaar |

Aantallen flaky/overgeslagen en werkelijke CI-browserversies kunnen zonder runrapport niet worden vastgesteld. Lokale resultaten bewijzen geen groene Actions-matrix. Volledige nieuwe CI-uitvoering en controle van de genoemde open groepen blijven nodig. De downloadtests publiceren nu naam plus alle checkerbooleans in de testlog, geen XLSX-broninhoud. Crash- en geometriediagnostiek zijn metingen, geen vermeend defectherstel.

Na push van `herstel-resterende-browserfouten` zijn PR-aanmaak, `gh workflow run browsercompatibiliteit.yml --ref herstel-resterende-browserfouten` en het opvragen van nieuwe runs geprobeerd: de API weigert alle drie met `Forbidden`. Er is geen nieuwe gecontroleerde runlink. Beheerder: open de [voorbereide PR](https://github.com/EGRten/semantische-selectie-tool/pull/new/herstel-resterende-browserfouten) en controleer de PR-trigger, of start de bestaande workflow handmatig op deze branch. Deel de volledige browserstaplogs en compacte artifacts voor de nog open crash-/scroll-/zoomdiagnose.

Productiecode, data, publicatie-JSON, exportmodules/werkbladen/kolommen, bronwaarden, licenties, workflowinstallatie/build, time-outs en retries zijn ongewijzigd. De eerdere subpad-/Chromium-permissiecorrecties blijven behouden. Praktijkproeven blijven open en REL-02 is niet afgesloten.

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
