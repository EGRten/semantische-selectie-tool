# Integrale releaseacceptatie

12 november 2026. Getoetst: actuele `main` **`dbb1270`**, merge PR #23, inclusief PR #21/#22. Validatiebranch `releasevalidatie`; uitsluitend deze twee documenten en een afzonderlijke audithelper, geen productieherstel.

## Releaseoordeel

| Besluit | Uitkomst |
| --- | --- |
| Technisch releasegereed | **Ja binnen de onderzochte statische Chromium-omgeving**; algemene publieke vrijgave blijft geblokkeerd |
| WCAG 2.2 AA voldoende aangetoond | **Nog niet vastgesteld**; geen volledige schermlezer-/browser-/systeemtoets |
| Vier publieke downloads gevalideerd | **Ja**, gewone productiebuild zonder alias/privébron |
| Bronintegriteit bevestigd | **Ja**, tegen gecontroleerde baseline, vaste vingerafdrukken en oorspronkelijke JSON |
| Publieke vrijgave via GitHub Pages | **Nog niet verantwoord**: concordanshergebruikgrondslag niet vastgesteld; essentieel onafhankelijk toegankelijkheidsbewijs ontbreekt |

Dit onderscheidt technisch functioneren van distributierechten en conformiteitsbewijs. Openstaande punten en afsluitcriteria: [release-restpunten](release-restpunten.md). Geen Pages geactiveerd.

## Methode en resultaten

De gebruikersroutes onder toets: code-/begripszoeken of boomverkennen → officieel voorschrift → broncontext/voorwaarden → historische vergelijking of terug naar tabel; daarnaast concordans, lijst-/themawissel en vier downloads. Bestaande audit en hersteltests hergebruikt, zonder nieuw breed onderzoek. Browser-plugin niet beschikbaar; bestaande Playwright en systeem-Chromium gebruikt. Automatisch bestuurde browserproeven en menselijke inspectie van gerenderde screenshots worden afzonderlijk benoemd; geen onafhankelijke gebruikerstest.

| Controle | Aantoonbaar resultaat / grens |
| --- | --- |
| Eenmalige volledige regressie | **163/163 moduletests**, **122/122 browsertests**, nul overgeslagen, nul mislukt; browserdeel 3,8 minuten. Geen herhaling van de incidentele timeout |
| Typecheck / productiebuild | Geslaagd; subpad `/testpad/` in regressie en `/semantische-selectie-tool/` bij gewone productieproeven |
| Datasetvalidatie / CSV | Geslaagd; 15 CSV-exporten byte-identiek gereproduceerd |
| Axe-core 4.11.0, Chromium 156.0.8078.79 | Bestaande helper: **11 scans, nul overtredingen**, waaronder beide zoekmodi, details, vergelijking, vier volledige tabellen en native forced-colors-emulatie. 20 gerenderde schermtoestanden vastgelegd |
| Geautomatiseerde contrastchecks | Drie eigen paletten; 21 tekstparen ≥4,5:1 en 13 rand-/focusparen ≥3:1 per palet; echte markeringen, primaire knop, waarschuwing, fout en vergelijkingscellen gecontroleerd |
| Browserproeven / visuele inspectie | Tab/Shift+Tab, boom, lijstwissel, zoekresultaat/permalink, tabel/detail/terug en systeemselectie via bestaande gedraghelper. Gerenderde screenshots van codezoeken, details, vergelijking, tabel/concordans, mobiel, tekstafstand, thema's en zoom daadwerkelijk bekeken |
| Responsiviteit | 320/390/768/1920px en 844×390 landscape zonder pagina-overloop; 2D-tabellen lokaal scrollbaar. Echte 200/400%-zoom, browserletter 16→32px, voorgeschreven tekstafstand zonder zichtbaar verlies in de steekproef |
| Fout-/herstelgedrag | Opzettelijke 404, ontbrekende/ongeldige JSON/verwijzingen en retry geslaagd; geen verzonnen bronwaarden. Status-/alerttekst aanwezig; uitgesproken melding met AT niet getest |
| Firefox / Safari-WebKit / fysieke apparaten | **Niet uitgevoerd**: geen binaries/apparaten beschikbaar. Mobiele viewports zijn emulatie |
| NVDA/VoiceOver/andere echte schermlezer; Windows Contrast Themes | **Niet uitgevoerd**. Native forced colors in Chromium geëmuleerd, afzonderlijk van eigen hoog contrast |

Axe meldt bij volledige tabellen veel `incomplete`-kleurchecks (3.030–9.354 nodes per tabeltoestand) en één `skip-link`-beoordeling per tabeltoestand. Dat zijn geen aangetoonde overtredingen, maar evenmin geslaagde individuele beoordelingen. Tokenmetingen, visuele contrastproeven en bestaande skiplink-/focustests leveren aanvullend bewijs; onafhankelijke AT-/handmatige verificatie blijft vereist (REL-02). Er is geen nieuwe volledige WCAG-audit of conformiteitsverklaring afgegeven.

Aanvullende helper: **15 scans** verdeeld over licht/donker/hoog contrast en vier naslagwerken plus detail, nul overtredingen. Dit is een tabelsteekproef van de eerste 30 rijen per thema, met volledige overige bediening/details; alle tabelrecords blijven gerenderd. Samen met de bestaande helper: **26 scans**, geen volledige criteriumdekking. Scannerhash: `e9e5863c33a874f09bc01acd9234b7e3c871479f5eef8802fa582544465e6d01`.

Runtimeproeven: nul onverwachte console-/runtimefouten en nul externe runtime-aanvragen. De aparte koude proef met CPU 4× vertraagd, 150ms latency en 200.000 B/s download toont alle 346 rijen na **10,84 seconden**; filtering levert één juiste rij, themawisseling behoudt de vraag en 320px veroorzaakt geen pagina-overloop. Dit is CDP-emulatie, geen echt langzaam apparaat of netwerk. De bestaande gedraghelper meet de volledige concordans zonder axe na garbage collection: 716 rijen, circa **30.379 DOM-elementen** en **8,7 MB JS-heap**; dit is geen meting van totale browser-RAM of bewijs van afwezigheid van elk geheugenlek. Geen prestatiebudget of belasting bij langdurig echt mobiel gebruik vastgesteld. Alle bestanden en interne verwijzingen slagen in build/schema/regressie; externe officiële bronlinks zijn niet opnieuw integraal op bereikbaarheid gecontroleerd.

De eerste standaard surface-screenshot bij echte 400% was blanco, terwijl DOM, zichtbare hit-test, filtering en focus klopten. Een gerichte hercontrole met `Page.captureScreenshot({fromSurface:false})` toont dezelfde viewport correct. Alleen `scripts/audit/zoom.mjs` is voor deze Chromium-156-opnamebeperking aangepast en opnieuw uitgevoerd; geen productiedefect of stilzwijgend applicatieherstel geclaimd. De definitieve 200/400%-beelden zijn bekeken.

## Eerdere bevindingen UI-01–UI-12

| Bevinding | Huidige toets / status binnen Chromium |
| --- | --- |
| UI-01 randen | ≥3:1 in herstel- en thematests; geen herhaling van oude fout |
| UI-02 focus achter kop | Tab/Shift+Tab, vier tabellen, smal/desktop en echte 200/400%-zoom; dynamische kophoogte en horizontale scroll |
| UI-03 koppen | Zoekresultaten en vergelijking hebben opeenvolgende niveaus; hernieuwde axe/DOM-controle |
| UI-04 route/focus | Beide zoekmodi: juiste URL/detailfocus, Back/Forward/context; boompijlen behouden |
| UI-05 typografie | rem-schaal; echte browserlettervoorkeur 32px en zoom |
| UI-06 scroll/mobiel | Vier complete tabellen; instructies, benoemde focusbare scrollregio, 320/768/1440px |
| UI-07 kerngegevens | Waardering/volledige termijn/voorwaarden vóór aanvullende context; broninformatie behouden |
| UI-08 systeemselectie | Niet alleen kleur: dubbele rand; forced-colors-emulatie. Echte Windows-toets ontbreekt |
| UI-09 onafhankelijke toets | **Open**, REL-02; DOM/axe is geen schermlezer |
| UI-10 tokens | Bestaande semantische tokens en uniforme formulieren; geen nieuwe implementatie |
| UI-11 thema's | Systeem/Licht/Donker/Hoog contrast, opslagfouten, herladen, systeemwijzigingen, vroege paint, contextbehoud |
| UI-12 kolommen | Codekolommen smaller dan omschrijvingen; bronafbrekingen ongewijzigd, alle rijen zonder paginering |

## WCAG 2.2 A/AA: volledige scope, begrensd bewijs

De [bestaande matrix van alle 55 criteria](ui-ux-toegankelijkheidsaudit.md#alle-55-wcag-22-aaa-criteria-scope-en-resultaat) is opnieuw tegen dezelfde applicatiescope gehouden. Geen nieuwe media, transacties, authenticatie, tijdslimieten, dragbediening of persoonsgegevensformulieren; de daar als niet-toepasselijk geregistreerde criteria blijven dat. Hieronder de actuele beoordeling van alle overige criteria, zonder de historische foutstatussen als actueel over te nemen. **Geslaagd** betekent de beschreven technische/visuele steekproef, geen integrale conformiteitsverklaring.

| Criteria | Uitkomst en bewijsgrens |
| --- | --- |
| 1.1.1, 1.3.3, 1.3.4 | Geslaagd in inspectie en browser: decoratieve pijlen, tekstlabels en landscape; geen betekenisvolle inhoudelijke afbeeldingen |
| 1.3.1, 1.3.2 | Semantische koppen/tabelrollen/volgorde technisch geslaagd; werkelijke AT-lees- en navigatievolgorde **niet getest** |
| 1.4.1, 1.4.3, 1.4.11 | Thematische tekst-/componentcontrasttests en niet-kleurafhankelijke selectie geslaagd; native forced-colors alleen geëmuleerd |
| 1.4.4, 1.4.10, 1.4.12 | Echte zoom 200/400%, browserletter 32px, 320px en voorgeschreven tekstafstand; brede 2D-tabellen scrollen lokaal |
| 2.1.1, 2.1.2, 2.4.1 | Boom, tabs, zoeken, disclosures, scrollregio's en skiplink toetsenbordtechnisch geslaagd, geen val geconstateerd |
| 2.4.2, 2.4.4, 2.4.5, 2.4.6 | Titel, beschrijvende labels, meerdere vindroutes en herstelde koppen technisch geslaagd; semantische bruikbaarheid met AT nog niet vastgesteld |
| 2.4.3, 2.4.7, 2.4.11 | Focus-/geschiedeniscontract en zichtbare focus in onderzochte toestanden geslaagd; native systeem-/AT-proef ontbreekt |
| 2.5.2, 2.5.3 | Bestaande click-activering en zichtbare tekst in toegankelijke namen geïnspecteerd; geen down-only-acties |
| 2.5.8 | Hoofdcontrols ≥44px getest; **niet volledig vastgesteld** voor alle inline-/rijlinks en spacing-uitzonderingen |
| 3.1.1 | `lang="nl"` en Nederlandse applicatiebediening geslaagd |
| 3.1.2 | **Niet volledig vastgesteld** voor alle oorspronkelijke citaten/vaktermen en uitzonderingen; broninhoud niet redigeren |
| 3.2.1–3.2.4 | Consistente navigatie/identificatie; geen onverwachte route op focus; lijst-/themawijziging voorspelbaar in proeven |
| 3.3.1–3.3.3 | Labels, begrijpelijke foutmeldingen en opnieuw-proberen/herstel technisch geslaagd |
| 4.1.2, 4.1.3 | Axe/DOM-rollen, namen en live-/alertregio's technisch getoetst; daadwerkelijke uitspraak/timing **niet getest** |

Niet geslaagd: eventuele concrete nieuwe fouten staan uitsluitend bij de resultaten/restpunten. Niet-getest wordt niet als geslaagd geteld. Historische 4.1.1 (WCAG 2.1/EN) is geen WCAG 2.2-criterium; de technische HTML/ARIA-scan vervangt geen afzonderlijke wettelijke EN-documentbeoordeling.

## Gegevens, privacy en publicatievoorwaarden

Alle vier downloads zijn daadwerkelijk via de browser opgeslagen en onafhankelijk als ZIP/OOXML teruggelezen. Bestandsnamen, werkbladen, alle primaire cellen en aanvullende gegevens slagen; geen macro's/externe workbooklinks. Een actief filter verandert de volledige export niet. Geen Office-/LibreOffice-GUI- of document-AT-toets uitgevoerd.

| Download | Rijen | Werkbladen |
| --- | ---: | --- |
| `Concordans 1996-2020.xlsx` | 716 | Concordans 1996-2020; Bronvermelding |
| `Selectielijst 1996-2012.xlsx` | 494 | Selectiegegevens; Toelichtingen; Bronvermelding |
| `Selectielijst 2017.xlsx` | 305 | Selectiegegevens; Toelichtingen; Bronvermelding |
| `Selectielijst 2020.xlsx` | 346 | Selectiegegevens; Toelichtingen; Bronvermelding |

Bronintegriteit: vaste manifest-/schemavalidaties en de oorspronkelijke concordans-JSON-vergelijking slagen, inclusief alle oorspronkelijke/uitgevouwen cellen, volgorde, lege waarden, mergecontext en tien besluiten. 612 historische interpretaties blijven 606 volledig gekoppeld en zes onopgelost. De hash van de overige 605 oorspronkelijke recordparen blijft gelijk. Geen correctie aan oorspronkelijke teksten, termijnen of codes.

De vier publieke projecties zijn byte-identiek reproduceerbaar en ongewijzigd tegen `dbb1270`; ook `src/`, datasets, bronnen, controle, schema's en dependencybestanden hebben geen diff. Na een gewone herbouw zonder bronvariabele zijn **alle 103 productiebuildbestanden SHA-256-byte-identiek** aan de eerste build. Geen nieuwe runtimeafhankelijkheden.

De [privacy-/hergebruikbeoordeling](publicatie-privacy-hergebruik.md) en [actueel concordanspublicatiebesluit](concordans-publicatiebesluit.md) blijven uitgangspunt. Geen nieuwe gegevensverwerking, tracking, documentmetadata of persoonsgegevens toegevoegd. Gepubliceerde bronverantwoording kan namen bevatten; niet als volledig persoonsgegevenvrij aangeduid. Interne dossiers en originele Office-auteursmetadata blijven uitgesloten volgens bestaande controles. Geen nieuwe rechtsgrond/toestemming ontvangen; volledige concordansinhoud in een compacter formaat vormt zelf geen grondslag. Wdo/EN-scope en eventuele verklaring blijven afhankelijk van verantwoordelijke uitgever (REL-03), geen automatische overheidsplicht geclaimd.

## Reproduceren

```sh
npm run typecheck
CHROMIUM_PATH=/usr/bin/chromium npm test
python scripts/valideer_publicatie.py
python scripts/reproduce.py --output /tmp/release-csv
node scripts/genereer-publicaties.mjs --check
node scripts/controleer-publieke-downloads.mjs --output /tmp/release-downloads.json
# Gewone server, geen --concordans-env:
node scripts/serve.mjs --port 4229 --base /semantische-selectie-tool/
# In een tweede terminal, bestaande afzonderlijk beschikbare axe-core 4.11.0:
AXE_SOURCE=/tmp/ui-audit-tools/package/axe.min.js AUDIT_OUTPUT=/tmp/release-ui node scripts/audit/ui.mjs
AUDIT_OUTPUT=/tmp/release-ui node scripts/audit/gedrag.mjs
AUDIT_OUTPUT=/tmp/release-ui node scripts/audit/zoom.mjs
AXE_SOURCE=/tmp/ui-audit-tools/package/axe.min.js AUDIT_OUTPUT=/tmp/release-extra node scripts/audit/release.mjs
AXE_SOURCE=/tmp/ui-audit-tools/package/axe.min.js AUDIT_RUNTIME_ONLY=1 AUDIT_OUTPUT=/tmp/release-koud node scripts/audit/release.mjs
```

De bestaande [auditprocedure](ui-ux-verbeterroadmap.md#reproduceerbare-audit--en-regressieprocedure) beschrijft het afzonderlijk ophalen van axe-core buiten project en lockbestand. Ruwe logs, metingen en bekeken screenshots van deze uitvoering staan lokaal onder `/tmp/opdracht24-*`; de bovenstaande commando’s produceren nieuw bewijs, geen meegepubliceerde controlerapporten.

Voor de aanvullende oorspronkelijke-bronvergelijkingen in de moduletests is lokaal `CONCORDANS_BRON_JSON` gebruikt met de eerder gecontroleerde JSON-hash `b01cff07c7bfeeb6f562d467373615f5a18cfc7ab9777f11fcd5cb1ed7de73dd`; geen bronalias voor de browser/server/downloadcontrole. Zonder dat bestand melden uitsluitend die oorspronkelijke-bronvergelijkingen zich overgeslagen; reguliere publieke tests blijven werken. Geen nieuwe dependency, geen bronbestanden of tijdelijke screenshots in deze PR. De extra helper bewaart alleen niet-publieke testuitvoer in `/tmp`.
