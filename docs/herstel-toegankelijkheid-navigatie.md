# Gericht herstel UI-01 t/m UI-04

Opdracht 21, 12 november 2026. Uitgangspunt: actuele `main`, mergecommit `4825165` van PR #20. Geen redesign, thema, dependency of gegevenswijziging.

| Bevinding | Herstel | Status en bewijs |
| --- | --- | --- |
| UI-01 | Zoekveld- en bronrij-invoerranden gebruiken dezelfde bestaande kleur `#7a8897` als de overige formuliervelden | Hersteld in de lichte weergave: **3,62:1** tegen wit; gerichte computed-style-test voor tabelzoeken, concordanszoeken en nummerinvoer |
| UI-02 | Gedeelde focusbewaking meet werkelijke kop-/kolomafmetingen, stelt scroll-padding bij en corrigeert native focus-scroll na layout. ResizeObserver houdt gewijzigde kophoogtes bij; observers worden bij hertekenen opgeruimd. De oude vaste 65px-rijoffset is vervangen door gemeten positionering | Alle vier tabellen getest met Tab/Shift+Tab, horizontale scroll, hogere koppen, 320px en echte 200/400%-browserzoom. De oorspronkelijke auditfocusprobe vindt geen volledig bedekte focus meer |
| UI-03 | Zoekresultaatkoppen zijn h2; de bestaande historische-disclosuresamenvatting bevat een h3 als parent van de h4-koppen voor relaties/vergelijking. Bestaande tekstgrootte, regelhoogte en marges blijven behouden | DOM-tests voor beide zoekmodi en vergelijking; gerichte axe `heading-order`-controle zonder meldingen in beide onderzochte toestanden |
| UI-04 | Gebruikersactivatie synchroniseert de bestaande `#selectie=`-permalink; zoeken en tabelnavigatie focussen de detailtitel. De boom behoudt focus bij eigen toetsenbordactivatie. Externe routes schrijven geen dubbele history-entry; lijstwissel verwijdert een verouderde recordpermalink | Beide zoekmodi getest vanaf een bestaande permalink: juist record/URL, detailfocus, behouden zoekcontext, Back/Forward en reload. Boom Rechts/Omlaag/Enter blijft werken; bestaande tabel-/vergelijkingsnavigatie blijft behouden |

## Gerichte en volledige controles

Eerst gericht uitgevoerd:

```sh
npm run build
CHROMIUM_PATH=/usr/bin/chromium npx playwright test tests/browser/herstel-toegankelijkheid.spec.mjs tests/browser/zoeken.spec.mjs
```

**24 gerichte browsertests geslaagd.** Daarvan zijn veertien nieuwe regressies voor de vier herstelpunten. De bestaande focusverwachting in `zoeken.spec.mjs` is bewust gewijzigd van de boomnode naar de detailtitel, met permalinkcontrole: dit is het gevraagde nieuwe gedrag, geen gewijzigde inhoudelijke testverwachting. Ook de bestaande subpadtest verwacht nu de juiste recordpermalink in plaats van een lege hash; de pad- en consolecontrole blijven behouden.

Vervolgens eenmaal de volledige regressieset uitgevoerd: **163 moduletests geslaagd**, nul overgeslagen; **98 van 99 Chromium-browsertests direct geslaagd**. De ene overgebleven test eiste nog een URL zonder recordhash na boomactivatie. Die verwachting is conform UI-04 gewijzigd naar behoud van het repositorysubpad mét de exacte recordpermalink en daarna gericht opnieuw geslaagd. Daarmee zijn alle 99 browsergevallen succesvol geverifieerd; de volledige set is niet onnodig een tweede keer uitgevoerd. De bestaande lokale originele bron is alleen voor bronvergelijkende moduletests gebruikt; de browser/server en gewone productiebuild gebruiken geen concordansalias. Typecheck, productiebuild, publieke datasetvalidatie en reproduceerbare generatie slagen.

De publieke vier-downloadcontrole controleert echte bestanden zonder privébron/mocks: 716 / 494 / 305 / 346 regels, exacte bestandsnamen, werkbladen en alle primaire Excel-cellen. Alle vier geslaagd.

Aanvullend gericht: bestaande `scripts/audit/focus.mjs` (0 volledig bedekte focusposities in de oorspronkelijke 30-stappenprobe), axe-core 4.11.0 alleen voor koppenvolgorde, en visuele inspectie van de aangepaste zoek-/vergelijkingsweergave. Geen brede heraudit uitgevoerd.

## Integriteit en beperkingen

`datasets/`, `publicatie/`, `bronnen/`, `controle/`, schema's, zoekmodules, concordansgegevensmodule en Excel-/projectiecode zijn ongewijzigd tegenover de uitgangscommit. De publicatie-JSON's zijn bytegelijk en reproduceerbaar. Geen spelling, interpunctie, afbreking, code, benaming, termijn, bronverwijzing, semantische relatie of beoordelingsbesluit is gewijzigd. Alle vier downloads blijven vanuit de gewone statische build beschikbaar onder een repositorysubpad.

De nieuwe focusmodule wijzigt uitsluitend focus-/scrollpresentatie; de bestaande tabelinhoud en export worden niet geraakt. Behoud van reeds geopende zoekcontext is getest binnen dezelfde lijst; een bewuste lijstwissel blijft de oude lijstcontext wissen volgens het bestaande isolatiegedrag.

Dit gerichte herstel is **geen volledige WCAG-conformiteitsverklaring**. Echte schermlezers, Safari/Firefox en native Windows Contrast Themes zijn niet opnieuw getest. De overige auditbevindingen vallen buiten deze opdracht. Geen GitHub Pages-activering en geen zelfstandige samenvoeging met `main`.
