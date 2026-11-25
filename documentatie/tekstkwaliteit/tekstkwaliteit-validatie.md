# Validatie tekstkwaliteit — 25 november 2026

Uitgevoerd op branch `tekstkwaliteit/integrale-controle`, vanaf main `59add247289e3328a2f433ac6c26262d3db0f468`. PR #47 is daarin opgenomen. Opnieuw ophalen van main bevestigde dezelfde commit. Geen applicatiecode, schema, workflow of afhankelijkheid is gewijzigd.

## Brongetrouwheid en integriteit

De drie PDF's zijn daadwerkelijk beschikbaar en hun SHA-256 komt exact overeen met het aangewezen bronmanifest:

| PDF | SHA-256 |
| --- | --- |
| Geactualisteerde Selectielijst 2012.pdf | `cad76fc4edc14aef32df2b2d2ee2825d1d96bd73e6e8e0ccd8f5ca5bbfb9e242` |
| Gemeentelijke Selectielijst 2017.pdf | `7398d4e499079ea6b988572fc6a80af33ff9e47cb6ae2f69ecc5a264741b7689` |
| Geactualiseerde Gemeentelijke Selectielijst 2020.pdf | `0174fda6020ebee109d2f5da5731078196fd46970c2d8aa5e9e452f1d21e073c` |

De woordparen zijn visueel aan gerenderde bronvensters gecontroleerd; 40 vensters staan onder `bewijs/`. Iedere toegepaste regel vereist bovendien een letterlijk overeenkomstige splitsing binnen het PDF-bronvenster van het betreffende record. Bij ontbrekend of afwijkend gehasht document breekt het script af. PDF-regelafbrekingen zijn niet op grond van uitsluitend taalmodel- of woordenboekadvies verwijderd.

`scripts/valideer-tekstkwaliteit.py` reconstrueert de volledige oorspronkelijke JSON per gewijzigd bestand met uitsluitend de geregistreerde mutaties. Alle overige velden moeten exact gelijk blijven. De controle bevestigt:

- 494 / 305 / 346 selectierecords, alle oorspronkelijke codes en technische ID's behouden.
- Waarderingen, bewaartermijnen, procestermijnen, aanvangsmomenten, voorwaarden en bestaande beoordelingen ongewijzigd.
- Alle zoekterm-/relatie-ID's, doelen, relatietypen, herkomst- en beoordelingsstatussen behouden. Alleen 104 letterlijke officiële zoektermwaarden zijn bijgewerkt; geen nieuwe synoniemen of AI-relaties.
- 716 concordansrijen, alle 7.876 oorspronkelijke cellen, mergecontext en historische koppelingen exact behouden. Alleen 49 afgeleide verwijzingslabels volgen hun eigen bestaande doelrecord.
- Ruwe bronrijen en ruwe pagina-extracties ongewijzigd. Alle oorspronkelijke bestanden onder `bronnen/` en `documentatie/bronherijking/`, eerdere woordafbrekingsbewijzen, concordansbewijzen, bronannotaties en onzekerheidsbesluiten blijven byte-identiek.
- Alle wijzigingen aan primaire/publieke tekst en afgeleide notitiearrays staan in het register. Het CSV-register is inhoudelijk gelijk aan het JSON-register; alle CSV-cellen passen binnen de Excel-lengtegrens.

De actuele bestandshashes en actuele integriteitsreferentie zijn opnieuw berekend; de oude referentie staat apart in `integriteitsreferentie-voor.json`. Het bestaande historische bewijs wordt niet overschreven. De testhelpers draaien uitsluitend expliciet geregistreerde nieuwe wijzigingen terug alvorens de oudere bewijschecks uit te voeren. Een extra test verantwoordt alle 119 oorspronkelijke JSON-bestanden, inclusief lege verzamelingen.

## Uitgevoerde controles

| Controle | Feitelijk resultaat |
| --- | --- |
| `npm ci` met bestaande lockfile | Geslaagd; geen dependencywijziging. |
| `npm run typecheck` | Geslaagd. |
| `npm run build` | Geslaagd; bestaande begrensde productiebuild en publieke projecties. |
| `python scripts/valideer_publicatie.py` | Geslaagd: JSON-syntax, schema's, ID's, verwijzingen, bestandshashes, CSV-waarden en actuele integriteitsreferenties. |
| `python scripts/valideer-tekstkwaliteit.py` | Geslaagd: uitsluitend geregistreerde tekstmutaties; beschermde inhoud en oorspronkelijke bewijsbestanden behouden. |
| `python scripts/reproduce.py --output …` | Alle 15 dataset-CSV's byte-identiek gereproduceerd. |
| `node scripts/genereer-publicaties.mjs --check` | Alle vier publieke JSON-projecties reproduceerbaar. |
| Twee onafhankelijke tekstcontroleruns | Alle 13 gegenereerde controlebestanden byte-identiek; hashes in `reproductie.json`. |
| Bronbeelden opnieuw gerenderd | Alle vijf PNG-bestanden byte-identiek aan de beoordeelde bewijsbladen. |
| `npm run test:unit` | 182 tests: 164 geslaagd, 0 mislukt, 18 overgeslagen. Inclusief integratie, schemacontrole, Excel-teruglezing, artifactgrenzen en vijf tekstkwaliteitsregressies. |
| Playwright Chromium, compat-config onder `/semantische-selectie-tool/` | Alle 156 tests geslaagd, geen skips. Inclusief drie nieuwe tekstkwaliteitsgevallen, alle lijsten, beide zoekmodi, boom/details, concordans, tabellen, vier downloads, responsiviteit en bestaande toetsenbordproeven. |
| Diffcontrole met `core.whitespace=cr-at-eol` | Geslaagd; bestaande CSV-CRLF blijft behouden. |

De bestaande Excel-tests lezen voor alle drie selectielijsten de echte XLSX als ZIP/XML terug en vergelijken iedere primaire cel met de huidige publieke projectie, inclusief de gecorrigeerde tekst en aanvullende pagina-inhoud. De browsercontrole laat tevens de vier echte downloads plaatsvinden. Er is geen desktop-Excel-/schermlezertest geclaimd.

## Resterende beperkingen en beoordelingsgevallen

De scan is integraal voor de geïnventariseerde machineleesbare tekstvelden en de beschreven mechanische controles. Hij bewijst geen volledige Nederlandse spelling-/grammaticacorrectheid of afwezigheid van iedere denkbare extractiefout. Vier mogelijke bron-eigen taalproblemen staan als C op hun bronlocatie en zijn niet redactioneel gecorrigeerd. Alle overige onbesliste patronen staan afzonderlijk in het onzekerhedenregister; betekenisvolle samengestelde woorden mogen daarin ook als signaal voorkomen. Er is geen algemene koppelteken-, spatie- of alineanormalisatie toegepast.

Mogelijke kolomverstrengeling in taakvelden en de onduidelijke woordgrens bij `Basisregistratie-\npersonen` zijn niet zelfstandig opgelost. Ongewijzigde ruwe bronkopieën, termijnteksten en oorspronkelijke concordanscellen kunnen eveneens afbrekingen bevatten. De bestaande interface/export toont enkele van die bronweergaven rechtstreeks. Dat blijft expliciet een beperking; het resultaat wordt niet als volledig artefactvrije bronpublicatie gepresenteerd.

De 18 bestaande unit-/integratietests zijn overgeslagen omdat de afzonderlijke oorspronkelijke technische concordans-JSON niet is meegeleverd (`CONCORDANS_BRON_JSON`). Dat is geen ontbrekende leidende PDF: alle drie leidende PDF's zijn wel gecontroleerd. De bestaande publieke concordansprojectie en al haar oorspronkelijke cellen zijn wél onafhankelijk tegen de basiscommit gecontroleerd.

Firefox is daadwerkelijk geprobeerd maar start niet: `Could not find profile folder`. WebKit is eveneens geprobeerd en mist de systeemlibraries `libgtk-4`, `libgraphene`, `libharfbuzz-icu`, `libmanette`, `libhyphen` en `libGLESv2`. Hun browserregressies zijn daarom lokaal niet uitgevoerd en niet als geslaagd gerekend. De bestaande browserworkflow blijft ongewijzigd en kan die engines in GitHub Actions controleren.

Er is geen algemene toegankelijkheidsaudit of inhoudelijke selectie-/concordansbeoordeling heropend. Er zijn geen issues gesloten, geen GitHub Pages-instellingen gewijzigd en geen deployment gestart. De wijzigingen worden uitsluitend ter beoordeling in een pull request aangeboden.
