# Bronherijking 25 november 2026

Dit controlepakket hoort bij branch `gegevens/integrale-bronherijking-2026-11-25`, gebaseerd op `1557833777cba086ddd88a69190bd9e6f0a0713b`. Alleen de drie door de projecteigenaar aangewezen PDF's zijn gebruikt als inhoudelijke bron voor de afzonderlijke selectielijsten. Het aangeleverde bronmanifest staat ongewijzigd in `bronnen/semantische-selectie-tool-bronset-2026-11-25.json`.

Er zijn geen historische gelijkwaardigheden, nieuwe semantische relaties of juridische/archivistische besluiten vastgesteld. De oorspronkelijke concordanscellen, alle technische record-ID's en de eerdere bronannotaties blijven behouden. De 517 eerder onderzochte kandidaatverwijzingen zijn niet geïmplementeerd. Er is niets samengevoegd of gepubliceerd.

## Invoer en methode

`bronverificatie.json` bevat de onafhankelijk berekende hashes, bestandsgroottes en pagina-aantallen. Alle drie komen exact overeen met het bronmanifest. De oorspronkelijke PDF-bytes blijven extern en zijn niet aan de repository toegevoegd. Eerdere bronbeschrijvingen blijven historisch beschikbaar; de nieuwe bronvoorrang is afzonderlijk in de datasetmanifesten geregistreerd. Een oud broncitaat wordt niet achteraf als citaat uit een andere PDF gepresenteerd.

De onafhankelijke inventaris bevat alle 334 PDF-pagina's, hun tekstblokken met coördinaten, alle resultaatcellen van 2017/2020, de 2012-tabelgroepen/waarderingsankers en twee rasterfiguren. Voor 2017/2020 wordt eerst de PDF uitgelezen zonder datasets als invoer; daarna volgt vergelijking uitsluitend op exacte officiële codes. Een tweede scan van de procesnummerkolom bevestigt de aantallen. Een gelijke code impliceert geen inhoudelijke gelijkwaardigheid tussen lijsten.

Voor 1996/2012 zijn 130 fysieke tabelgroepen en 489 waarderingsankers onafhankelijk uit de PDF gelezen. Die ankers verantwoorden via bestaande geometrische bronlocaties alle 494 bestaande technische voorschriftregels; enkele regels delen een waarderingscel. Alle 1.624 bestaande beschrijvings-/termijnsegmenten zijn opnieuw in de leidende PDF gecontroleerd. Drie bronvensters bevatten ook een rubriekprefix; de letterlijke vensters blijven bewaard. De afbakening van meervoudige broncellen is niet zelfstandig herzien. De concordans heeft niet als extractie-invoer gediend.

De 2012-PDF heeft een defecte Unicode-koppeling voor enkele Verdana-subsets. De gebruikte glyphs zijn visueel aan de PDF gecontroleerd (`glyphkaart-2012.png`); `bronherijking_pdf.py` voegt uitsluitend in-memory ToUnicode toe. Alle 120 pagina's zijn vóór/na pixel-identiek bij 72 dpi/grijs. Het origineel wordt niet gewijzigd. Ruwe tekst en gecontroleerde leesweergave blijven naast elkaar beschikbaar. De twee hotspot-monitorfiguren zijn visueel letterlijk getranscribeerd, aan hun afbeeldinghash en locatie gebonden en herkenbaar als figuurtekst toegevoegd; er zijn geen proces- of selectieregels uit afgeleid. Zie `figuur-transcripties.json`.

## Vergelijkingsregels

Letterlijke gelijkheid, lege bronwaarden en technische presentatieverschillen zijn afzonderlijk geteld. Voor uitsluitend technische vergelijking worden witruimte en U+00AD behandeld; bij PDF-regeleindkoppeltekens wordt ook een aanwezige of afwezige afbreekstreep toegestaan. Die vergelijking herschrijft geen datasetwaarde en verwijdert geen betekenisvolle koppeltekens. Beide oorspronkelijke waarden blijven in het afwijkingenregister staan. Een tekstverschil is geen zelfstandig inhoudelijk oordeel.

Er zijn 10.160 veldparen vergeleken, inclusief resultaat-/procesgegevens, bestaande beschrijvingen en termijnen, afgeleide officiële weergavenamen, uitzonderingen/verwijzingen en structuurtoelichtingen. De onafhankelijk opgenomen broncellen omvatten daarnaast alle overige tabelkolommen. Algemene bepalingen, toepassingsbereik, uitzonderingen, overgangsregels, voetnoten en bijlagen blijven als volledige, lokaliseerbare brontekst behouden; hun toepasselijkheid is niet op individuele resultaten geïnterpreteerd. Bijlage 8 van 2020 is afzonderlijk herkenbaar (fysieke pagina's 88–113).

## Bestanden

- `bronherijking-inventarisatie.csv`: volledige technische broninventaris met bronhash, pagina, beschikbaar gedrukt paginanummer en bbox. De verschillende observatietypen zijn expliciet gemarkeerd; het aantal CSV-regels is geen aantal zelfstandige selectievoorschriften.
- `bronherijking-afwijkingen.csv`: oorspronkelijke veldwaarden naast bronwaarden en technische classificatie.
- `bronherijking-correcties.csv`: uitgevoerde bron-/tekst-/metadatawijzigingen, per veld met oude/nieuwe waarde en bronlocatie. Het merendeel betreft provenance, leesbare bepalingen en bronpagina's; dit is geen telling van inhoudelijke selectiefouten.
- `bronherijking-beoordeling.csv`: 83 behouden beoordelingspunten; geen vooraf ingevuld inhoudelijk besluit.
- `bronherijking-tellingen.json`, `bronherijking-samenvatting.md`, `bronherijking-validatie.md`: aantallen, uitleg en feitelijke testresultaten.
- `nulmeting.json`, `veldmutaties.json`, `bestandsmutaties.json`, `manifestmetadata.json`, `integriteitsreferentie-voor.json`: controleerbare beginsituatie, veldmutaties en integriteitsketen. Historische woordafbrekings- en concordanscitaten worden vóór vergelijking exact langs deze geregistreerde wijzigingen teruggedraaid, zonder hun oude bewijsbestanden te herschrijven.
- `structuurcontrole.csv`, `bronsegmentcontrole-1996-2012.csv`, onafhankelijke inventarissen en `zoekrelatiecontrole.csv`: onderliggende controles. Er zijn twee officiële, letterlijk afgeleide zoektermen aangepast met behoud van ID/doel; niet-officiële relaties zijn ongewijzigd.
- `concordans-integriteit.json` en `concordans-excelcontrole.json`: behoud van alle 716 bronrijen, 7.876 oorspronkelijke cellen en mergecontext. Alleen twee verwijzingslabels in de publieke projectie volgen de officiële tekstcorrecties; oorspronkelijke cellen/relatie-identiteiten blijven gelijk.
- `reproductie.json`, `csvcontrole.json`, `glyph-rendercontrole.json`, `testresultaten.json`: uitvoer- en verificatiebewijzen.

CSV: UTF-8 BOM, puntkomma en CRLF. Importeer code- en tekstkolommen in Excel als **Tekst**. Geneste waarden en `null` zijn JSON-gecodeerd; oorspronkelijke beschadigde controletekens worden als JSON-escapes weergegeven zodat de CSV geen onleesbare besturingstekens bevat. Alle CSV's zijn verliesvrij geparseerd en blijven onder de Excel-cellengrens. Er is geen Excel-desktopimportproef geclaimd.

## Reproductie

Gebruik een checkout van deze branch met de basiscommit beschikbaar in de Git-geschiedenis. De oude bestanden worden uitsluitend met `git show` gelezen; er vindt geen reset plaats. Plaats de drie exact genoemde PDF's in een externe map. Benodigd: Python-dependencies uit `requirements.txt` en vastgelegde npm-dependencies; geen nieuwe dependencies toegevoegd.

```sh
npm ci
python -m pip install -r requirements.txt
python scripts/herijk-bronnen.py --bronmap /pad/naar/pdfs --output /tmp/herijking-a
python scripts/herijk-bronnen.py --bronmap /pad/naar/pdfs --output /tmp/herijking-b
```

Vergelijk de bestandensets en SHA-256-hashes van beide uitvoermappen; `reproductie.json` legt de daadwerkelijk uitgevoerde vergelijking van 65 gegenereerde bestanden vast. `--apply` kopieert gecontroleerde uitvoer naar de checkout en is uitsluitend bedoeld voor een geïsoleerde branch met deze vastgelegde beginsituatie, niet als algemene updater voor latere datasets. Ontbrekende of afwijkend gehashte PDF's blokkeren verwerking. Ongelijke codeverzamelingen blokkeren automatische wijziging van recordidentiteiten.

```sh
python scripts/controleer-bronherijkingsbewijs.py --bronmap /pad/naar/pdfs --output /tmp/bewijs
# Optioneel: voeg --concordans-excel /pad/naar/oorspronkelijke-concordans.xlsx toe.
npm run typecheck
npm run build
python scripts/valideer_publicatie.py
python scripts/reproduce.py --output /tmp/csv-reproductie
node scripts/genereer-publicaties.mjs --check
npm run test:unit
```

De aanvullende Excel-controle gebruikt uitsluitend de oorspronkelijk geregistreerde werkmap met SHA-256 `7dfda792ce61c1a6fa28c5c116155a429560153178c6c58987eabbbe6cdf708c`, uit het eerder beschikbare controlepakket. Dit is een integriteitscontrole van de concordans, geen normbron voor selectiegegevens.

Voor de bestaande browsermatrix: installeer de door Playwright voorgeschreven browsers/systeemafhankelijkheden en gebruik dezelfde afzonderlijke `AXE_SOURCE` als de bestaande workflow. `playwright.compat.config.mjs` controleert het repositorysubpad. Zie de validatie voor werkelijk uitgevoerde runs en omgevingsbeperkingen; er wordt geen geslaagde Firefox-/WebKit-run verondersteld.

## Resterende grenzen

De 83 beoordelingspunten omvatten 77 letterlijke 2012-verschillen (veelal opsommingsmarkering/interpunctie/recordcontext), twee niet-eenduidig bevestigde structuurnamen en vier eerdere XLS-bronkeuzes bij lege 2017-PDF-cellen. De twee structuurnamen zijn `1996-2012:3` en `1996-2012:2.14`. Alle betwiste waarden zijn voorlopig behouden; niet opnieuw letterlijk bevestigde selectievelden zijn ook op recordniveau in de technische bronstatus/bevindingen gemarkeerd. De vier `Nihil`-waarden zijn via vier aanvullende annotaties zichtbaar als niet opnieuw bevestigd; de oude besluiten en annotaties zijn niet overschreven.

Dit pakket is geen integrale menselijke tweede lezing of archivistische/juridische acceptatie. Een technisch gekoppeld bronvenster bewijst geen inhoudelijke gelijkwaardigheid, en gedeelde waarderingscellen zijn niet tot nieuwe voorschriften of historische relaties omgevormd. De gepubliceerde Pages-site blijft ongemoeid. Inhoudelijke beoordeling, merge en publicatie volgen afzonderlijk.
