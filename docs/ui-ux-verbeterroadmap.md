# UI/UX-verbeterroadmap voor publieke release

## Besluit en grenzen

Voorkeur: de bestaande statische applicatie behouden en gericht verbeteren met een klein semantisch designsysteem. Geen nieuwe framework-/backendarchitectuur. Deze opdracht levert uitsluitend onderzoek, bewijs en voorstel op; **geen herstel of thema-implementatie is uitgevoerd**.

Prioriteitstelling uit de [audit](ui-ux-toegankelijkheidsaudit.md): **2 P1, 8 P2, 2 P3**. Twee bewezen toegankelijkheidsproblemen blokkeren het afgesproken WCAG 2.2-AA-doel. De ontbrekende schermlezer-/cross-browservalidatie blokkeert een onderbouwde conformiteitsclaim, ook nadat die twee zichtbare problemen zijn opgelost. Dat is niet hetzelfde als stellen dat de particuliere site automatisch wettelijk een overheidswebsite is.

## Aanbevolen implementatievolgorde

| Fase | Omvang / bevindingen | Concrete acceptatie | Afhankelijkheid |
| --- | --- | --- | --- |
| 0 Baseline vastleggen | Bron-/exportintegriteit, reproduceerbare audit, wettelijke scope, UI-09 | Uitgever/verantwoordelijkheid en toepasselijke normversie gedocumenteerd; ongewijzigde datasets/publicaties en uitgepakte Excel-cellen vastgelegd; vier gewone downloads groen | Geen UI-wijziging |
| 1 P1 herstellen | UI-01 veldranden; UI-02 bedekte focus | Noodzakelijke randen ≥3:1 tegen beide aangrenzende kleuren. Tab en Shift+Tab houden focus zichtbaar onder dynamische kop/vaste kolom, alle vier tabellen, 200/400%, kleine schermen | Eerst doen, niet wachten op redesign |
| 2 Semantiek en activering | UI-03 koppen, UI-04 focus/routecontract | Betekenisvolle outline; boomverkennen versus openen voorspelbaar; beide zoekmodi en tabelroute geven passende focus; URL/Back/Forward/terugcontext werken | Gerichte AT-proef parallel |
| 3 Compacte basisstijl | UI-05 typografie, UI-10 tokens, UI-07 detailhiërarchie | Gebruikerslettergrootte werkt door; één input-/knopcontract; officiële kerngegevens voorop; bronlagen en alle voorwaarden intact | Tokens eerst op één component toepassen, dan uitbreiden |
| 4 Responsieve en systeemweergave | UI-06 scrolloriëntatie; UI-08 forced colors | Geen onnodige pagina-overloop op 320px/400%; lokale 2D-scroll met instructie; selectie zichtbaar zonder alleen kleur/shadow; echte Windows-controle | Sticky-focusherstel behouden |
| 5 Optionele voorkeuren en afwerking | UI-11 donker/hoog contrast; UI-12 kolombreedtes | Vier voorkeurwaarden, fouttolerante opslag, alle themastaten getest, geen onleesbare flits; rustigere codekoppen zonder bronbewerking | Na basis- en semantiekherstel; afzonderlijke opdracht |
| 6 Onafhankelijke releasevalidatie | UI-09, alle herstelde punten | WCAG-/EN-scope bevestigen; NVDA+Firefox/Chrome, VoiceOver+Safari/iOS en Windows Contrast Themes; bevindingen afsluiten met bewijs, vier downloads opnieuw groen | Voor conformiteitsclaim/publieke releasebeslissing |

Geen betrouwbare ureninschatting zonder implementatieontwerp en beschikbaarheid van testers. De eerste fase is klein en afgebakend; thema's zijn een bredere statenmatrix en mogen de urgente P1-correcties niet vertragen. Eén reviewer bewaakt bronintegriteit, een tweede deskundige toegankelijkheidsreviewer toetst de herstelde bediening.

## Acceptatiecriteria die in iedere vervolg-PR gelden

### Brongetrouwheid — harde grens

1. Geen spelling-, grammatica-, interpunctie-, afbrekings- of terminologiewijziging in broninhoud. Geen code-, waardering-, termijn-, voorwaarde- of bronlinkcorrectie.
2. Officiële datasetbestanden, concordansbronwaarden, technische relaties, onderzoeksvoorstellen en besluiten zijn bytegelijk of inhoudelijk exact gelijk waar alleen niet-inhoudelijke verpakking een rol speelt. Bewaak dit met baselinehashes en expliciete diffcontrole.
3. Publicatie-JSON behoudt alle 716/494/305/346 rijen, bronvolgorde, null/lege-waardebetekenis en mergecontext. Geen stilzwijgende tekstnormalisatie in UI of export.
4. Vergelijk vier gedownloade XLSX-bestanden na uitpakken, inclusief primaire cellen, Toelichtingen en relevante Bronvermelding. Exportdatum kan veranderen; broninhoud niet. Bestandsnamen en werkbladen blijven exact gelijk.
5. Aanvullende begrijpelijke uitleg staat apart als applicatietoelichting, vervangt geen oorspronkelijke tekst en introduceert geen archivistische/juridische interpretatie.

### Bediening, presentatie en toegankelijkheid

- Volledige doelroutes met toetsenbord, inclusief uitklappen, zoekmoduswissel, filtering, vergelijking, kopiëren, vier downloads en terugkeer. Geen focusverlies naar verborgen nodes of onder sticky lagen.
- Gehele focusindicator zichtbaar waar praktisch, minimaal nooit volledig bedekt conform 2.4.11. Meet ook bij variabele kophoogte/tekstafstand; geen oplossing alleen op één record.
- Semantische main/heading/table/tree/tab-/disclosure-rollen kloppen en hebben betekenisvolle namen. Geen extra aria wanneer native HTML voldoende is.
- 4,5:1 normale tekst, 3:1 relevante grote tekst/niet-tekstcomponenten; controle van alle surfaces/staten/thema's. Selectie en fouten niet alleen door kleur.
- 320px, 390px, tablet en desktop; landscape; echte 200/400%-browserzoom, verhoogde gebruikerslettergrootte en voorgeschreven tekstafstand. Brede gegevenstabellen mogen lokaal scrollen, hoofdcontrols niet onnodig.
- Bronannotaties en bekende afwijkingen blijven zichtbaar bij het juiste record. Geen fictieve gegevens bij ontbrekende/ongeldige bestanden.
- Native systeemcontrast werkt naast eigen hoogcontrastthema. Animatie/smooth scroll ontbreekt of respecteert reduced motion.

## Reproduceerbare audit- en regressieprocedure

De audithelpers zijn afzonderlijk, niet opgenomen in de productiebuild. Vereist: bestaande npm-installatie, Python, Chromium. axe-core is **niet** aan projectdependencies toegevoegd. Voor een zelfstandige nieuwe auditrondgang:

```sh
npm run build
# Terminal 1: gewone statische build, geen lokale bronalias
node scripts/serve.mjs --port 4229 --base /semantische-selectie-tool/

# Terminal 2: scanner afzonderlijk ophalen, buiten project/lockbestand
mkdir -p /tmp/ui-audit-tools
npm_config_cache=/tmp/ui-audit-tools/cache npm pack axe-core@4.11.0 --pack-destination /tmp/ui-audit-tools
tar -xzf /tmp/ui-audit-tools/axe-core-4.11.0.tgz -C /tmp/ui-audit-tools
AXE_SOURCE=/tmp/ui-audit-tools/package/axe.min.js node scripts/audit/ui.mjs
node scripts/audit/inventaris.mjs
node scripts/audit/gedrag.mjs
node scripts/audit/zoom.mjs
node scripts/audit/focus.mjs
node scripts/controleer-publieke-downloads.mjs --output /tmp/vier-downloads.json
```

De scripts bewaren meetgegevens/screenshots standaard buiten Git in `/tmp/semantische-ui-audit`. De brede scan herlaadt elke route om geïnjecteerde test-CSS niet naar een andere toestand mee te nemen. `zoom.mjs` gebruikt een tijdelijk persistent Chromium-profiel en de echte `settingsPrivate`-zoominstelling; deze browserinterne API kan in een toekomstige versie veranderen. Als dat gebeurt, moet de zoomtest als niet uitgevoerd worden gerapporteerd of met echte handmatige browserzoom worden herhaald; een viewportsimulatie telt niet stilzwijgend als vervanging.

`focus.mjs` is een reproduceerprobe van de huidige fout, geen test die de fout als gewenst gedrag vastlegt. Na herstel hoort de bedekking uit te blijven. De JSON-bijlage is een momentopname, geen gouden conformiteitsbaseline die nieuwe problemen goedpraat. Volledige axe-uitvoer/incomplete-checks worden lokaal opgeslagen; de compacte bewijsbijlage bevat geen bronkopieën of interne controledossiers.

Daarnaast de bestaande controles:

```sh
npm run typecheck
npm test
python scripts/valideer_publicatie.py
node scripts/genereer-publicaties.mjs --check
```

Voor **alle** bronvergelijkende moduletests zonder overslaan is optioneel de oorspronkelijke concordans nodig via de bestaande lokale testvariabele. De productiebuild, de browserregressies en de vier-downloadcontrole hebben die niet nodig. Gebruik een beschikbaar origineel uitsluitend lokaal voor bronvergelijking; publiceer het niet als auditbijlage.

## Uitgevoerd in deze audit

- Gewone productiebuild, vier daadwerkelijke downloads en vergelijking van aantallen/namen/bladen/alle primaire Excel-cellen geslaagd.
- Alle bestaande regressies opnieuw uitgevoerd met echte bron voor uitsluitend de bronvergelijkende moduletests; browserregressies gebruiken de reguliere server zonder alias. Resultaat: **163 moduletests en 85 browsertests**, geen overgeslagen tests.
- Typecheck, publieke datasetvalidatie en reproduceerbare projecties gecontroleerd; er zijn geen productiewijzigingen gedaan.
- Axe-scans, gerichte toetsenbordproeven, actuele screenshotinspectie, echte browserzoom en browserlettervoorkeur afzonderlijk vastgelegd. Geen schermlezer- of Safari/Firefox-succes geclaimd.

Een mislukte externe webraadpleging is als onderzoeksbeperking geregistreerd, niet als blokkade van de applicatie. Er is geen nieuwe privacyanalyse of hergebruikprocedure in deze UI-audit gestart; eerder vastgelegde onzekerheden blijven ongewijzigd.

## Nog noodzakelijk vóór publieke release

1. Twee P1's herstellen en hertesten; P2's gericht afhandelen of een expliciet gemotiveerde releasebeslissing vastleggen.
2. Onafhankelijke WCAG 2.2-AA-beoordeling op representatieve complete processen, inclusief schermlezers en mobiele vergelijking. Geen claim op basis van alleen axe.
3. Juridische status van publicerende organisatie en actuele aangewezen norm bevestigen; zo nodig toegankelijkheidsverklaring en beheerverantwoordelijkheid regelen. De particuliere status niet ongemotiveerd als overheidsplicht of algemene vrijstelling behandelen.
4. Reële Windows Contrast Themes, NVDA/Firefox of Chrome, VoiceOver/Safari/iOS en alternatieve browser toetsen. Test ook de XLSX-bestanden met relevante Office-AT.
5. Op een langzame telefoon/CPU en reële verbinding grote tabellen, laden, herstel, geheugen en downloads meten; de lokale heapmomentopname is geen prestatiegarantie.
6. Vier gewone productie-downloads en bronintegriteit na ieder herstel opnieuw controleren; geen lokale alias, mocks of externe API.
7. Een expliciete publicatiebeslissing blijft afzonderlijk: deze audit activeert GitHub Pages niet en voegt niets samen.
