# Concordans raadplegen

> Actueel bij opdracht 17: viewer en download gebruiken dezelfde compacte publicatieprojectie. De tabel/export heeft bronrij plus A–K (12 kolommen); mergecontext staat herkenbaar in dezelfde cel, niet in elf dubbele kolommen. Integrale publieke distributie blijft geblokkeerd. Zie [acceptatierapport](publicatie-acceptatie.md), [veldmatrix](publicatie-veldmatrix.md) en [hergebruik](publicatie-privacy-hergebruik.md). Oudere uitvoeringsbeschrijvingen hieronder documenteren de vorige ontwikkelstappen.

## Beschikbaarheid

De navigatie **Concordans raadplegen** opent de nieuwe alleen-lezen bronviewer naast de bestaande selectielijsten. De viewer is volledig statisch en gebruikt de bestaande concordansloader, indexen en datasetcache. Er is geen backend, database, nieuwe dependency of Markdown-interpreter.

**De integrale concordansdata zijn niet in de publieke build opgenomen.** De hergebruikgrondslag voor deze specifieke werkmap kon onvoldoende worden vastgesteld; zie [hergebruikafweging](concordans-hergebruik.md). Zonder bronbestand toont de viewer dit begrijpelijk, met herkomstinformatie en bronvermelding. De selectielijsten en zoekfuncties blijven werken. Dit is dus een technisch werkende en lokaal met de echte bron geteste viewer, geen claim dat alle bezoekers de data nu al publiek kunnen raadplegen.

## Raadplegen en navigeren

De bron bevat 716 rijen (Blad1, rijen 3–718), elf kolommen A–K. Alle 716 rijen staan gelijktijdig in één doorlopende tabel in oorspronkelijke bronvolgorde. Er zijn geen paginaovergangen of bladerknoppen meer. **Ga naar bronrij** opent rechtstreeks een Excelrij en verschuift de tabel naar de herkenbaar gemarkeerde rij. Kolomkoppen en bronrijnummers blijven zichtbaar bij respectievelijk verticaal en horizontaal scrollen. De tabel heeft een eigen horizontaal verschuifbaar, toetsenbordfocusbaar gebied. De elf velden staan bij selectie daarnaast in een leesbare verticale detailweergave, ook op mobiel.

Zoeken is eenvoudige, deterministische tekstmatching: Unicode-/diakritische normalisatie, hoofdletterongevoelig en interpunctie als spatie. Alle zoekwoorden moeten in de oorspronkelijke cellen of expliciet onderscheiden mergecontext van dezelfde rij voorkomen. Er is geen semantische uitbreiding of statuscorrectie in de bronzoektekst. **Zoekopdracht wissen** herstelt alle rijen. Geen resultaten en ontbrekende/ongeldige data hebben verschillende meldingen.

Permalinks zijn fragmenten op de bestaande applicatiepagina, bijvoorbeeld `#concordans=21` en `#selectie=2020%3A19.1`. Zij werken onder een repositorysubpad zonder serverrouting. Rijlinks kiezen exact de technische ID; suffixen worden niet als officiële codes gepresenteerd. Voor kandidaatlinks blijft duidelijk dat het geen vastgestelde koppelingen zijn. De browsergeschiedenis ondersteunt terugkeren naar de bronrij. Handmatig verlaten van de viewer maakt late asynchrone antwoorden ongeldig.

De bestaande vergelijkingssectie toont links naar alle rechtstreeks bij het geselecteerde record gekoppelde bronrijen, inclusief rijgerichte nieuwe-2020-verwijzingen. De bronverklaring heeft ook een rechtstreekse viewerlink. Inkomende relaties veranderen niet in omgekeerd vastgestelde opvolgingsrelaties. Contextuele J/K-opmerkingen worden niet tot 2017-codemapping gemaakt.

## Brongetrouwheid

`src/concordans/raadplegen.ts` bevat uitsluitend technische veldpresentatie, tekstfilter en fragmenthelpers, geen bronkopie. `src/interface/concordans-viewer.ts` toont de bestaande `bronrijen` en afzonderlijke technische `rijen` uit de gedeelde loader. De oorspronkelijke JSON wordt niet gewijzigd, opnieuw geconstrueerd of door een Markdown-versie vervangen.

Originele `null` wordt “Leeg in de bron”; een lege string blijft onderscheiden als “Lege tekst in de bron”. Een gewone lege cel krijgt geen overgenomen buurwaarde. Alleen wanneer de gecontroleerde uitgevouwen waarde afwijkt van de oorspronkelijke cel wordt deze apart als **Samengevoegde context (niet de oorspronkelijke celwaarde)** getoond. De JSON geeft die gecontroleerde context, niet de exacte geometrie van ieder mergebereik; de viewer claimt geen zelfstandig vastgestelde bereikgrenzen. De broncontrole toetst alle uitgevouwen waarden aan de 550 oorspronkelijke Excel-merges.

De oorspronkelijke spelling, codes, spaties en regeleinden worden tekstueel behouden. Er wordt geen HTML uit bronwaarden uitgevoerd. Technische correcties 21 en 716 staan in een afzonderlijke sectie. Bronwaarde `19.1.` en `19.21.1` blijven in de bronvelden zichtbaar; officiële koppelingen staan daarnaast. Alle tien eigenaarbesluiten blijven behouden, de zes historische gevallen onopgelost en de afwijkende tekst bij 50–52 zichtbaar. De technische dekking blijft 612/606/6.

## Bronidentiteit en rechten

De viewer toont documentnaam, Excel- en JSON-SHA-256, aangeleverde herkomst en geregistreerde VHIC-vindplaatscontext. Maker en rechthebbende zijn niet vastgesteld; een eigendoms- of toestemmingsclaim ontbreekt daarom terecht. De build kopieert uitsluitend de compacte publieke [bronvermelding](../documentatie/concordans-bronvermelding.md). Privébestanden, interne rapporten en lokale paden worden niet meegebouwd. Markdown wordt als afzonderlijk document aangeboden, niet geïnterpreteerd in de applicatie.

## Reproduceerbare lokale controle

Gebruik de bestaande rechtmatig verkregen Excel en JSON buiten de publieke repository. Voer eerst `scripts/controleer-concordansbron.py` uit volgens de bestaande [concordansinterface-instructies](concordans-interface.md). De verwachte Excel-hash is `7dfda792ce61c1a6fa28c5c116155a429560153178c6c58987eabbbe6cdf708c`; JSON-hash `b01cff07c7bfeeb6f562d467373615f5a18cfc7ab9777f11fcd5cb1ed7de73dd`.

```sh
npm run build
CONCORDANS_BRON_JSON='/pad/concordans.json' node scripts/serve.mjs --base /testpad/ --port 4205 --concordans-env
CONCORDANS_BRON_JSON='/pad/concordans.json' CHROMIUM_PATH=/usr/bin/chromium npm test
npm run typecheck
python scripts/valideer_publicatie.py
```

Open lokaal `http://127.0.0.1:4205/testpad/#concordans`. De expliciete previewalias controleert de JSON-hash en serveert de bytes alleen op localhost. Zij schrijft niets naar `dist/site`; zij is geen productiebackend. Zonder `--concordans-env` is de privébron ook met een gezette omgevingsvariabele niet beschikbaar. Dit onderscheid blijft vereist zolang de publicatiegrondslag ontbreekt.

## Excel-download

De knop heet exact **Download Concordans 1996-2020 (.xlsx)**. De browser maakt op aanvraag **Concordans 1996-2020.xlsx**, met eerst werkblad **Concordans 1996-2020** en daarna **Bronvermelding**. De schrijver wordt pas bij de eerste download geladen als afzonderlijke statische module. Een actieve zoekopdracht verandert de export niet: alle 716 bronrijen worden gebruikt. Zonder beschikbare gecontroleerde bron kan niets worden geëxporteerd.

A–K bevatten uitsluitend oorspronkelijke waarden, in oorspronkelijke volgorde. L–V bevatten de volledige, duidelijk als aanvullend benoemde uitgevouwen context van A–K. Ook oorspronkelijke niet-lege waarden zijn daar herhaald zodat iedere contextkolom zelfstandig filterbaar is. W bevat het oorspronkelijke bronrijnummer in Blad1. De export bevat geen samengevoegde cellen; de koprij is vastgezet en het filterbereik is A1:W717. Daardoor zijn sorteren, filteren en bronherleiding mogelijk zonder originele lege cellen te vullen. Technische correcties en beoordelingsbesluiten worden niet in deze waarden verwerkt.

Bronvermelding bevat bronidentiteit, documentnaam, herkomst en vindplaatscontext, UTC-generatiedatum, omzettings- en contextuitleg, rechtenbeperking en de waarschuwing dat de concordans geen zelfstandig juridisch of archivistisch oordeel is. Er worden geen oorspronkelijke Excel-auteursmetadata ingelezen of gekopieerd. Alle bronwaarden worden als tekst geschreven, ook formuleachtige tekst. Een lege string blijft onderscheiden van een lege cel.

De schrijver is `write-excel-file` **4.1.1** (MIT, volgens npm laatst gewijzigd 8 juni 2026), met uitsluitend `fflate` **0.8.3** (MIT) als transitieve productieafhankelijkheid in de lockfile. Er is geen XLSX-lezer of zwaar framework toegevoegd. De meegeleverde MIT-vermeldingen staan in de publieke build in `concordans-excel-licenties.txt`. `npm audit --omit=dev` meldde geen bekende kwetsbaarheden; dat is geen absolute veiligheidsgarantie. Compressie gebruikt een lokale browser-Worker via een blob-URL, zonder netwerkdienst; een eigen strengere CSP moet zulke Workers toestaan. De bibliotheekextensie voegt alleen het standaard OOXML-filter toe en bewaart expliciete lege tekst waar de schrijver anders naar een lege cel zou normaliseren.

## Validatie en beperkingen

De testset controleert iedere oorspronkelijke en uitgevouwen cel, identiteit/716 rijen, elf kolommen, de doorlopende lijst, zoek-/lege toestanden, directe rijlinks, beide navigatierichtingen, cache, late antwoorden, 21/716, zes onopgeloste gevallen, statistiektekst en besluiten, bronlinks, toetsenbord en mobiel. De buildcontrole verhindert een ongewenste bronspiegel en controleert de afwezigheid van lokale paden en interne rapporten. Alle bestaande regressies worden opnieuw uitgevoerd.

Andere browserengines dan Chromium en iedere mogelijke schermgrootte zijn niet afzonderlijk getest. Er is geen beoordelings-/bewerkinterface, Excel-download, automatische juridische interpretatie of productieactivering. Integrale publieke beschikbaarheid blijft geblokkeerd door het ontbreken van een aantoonbare hergebruikgrondslag.

### Historische eindcontrole opdracht 14 — 11 november 2026

**139 moduletests en 76 Chromium-browsertests geslaagd, nul overgeslagen.** Dit omvat alle bestaande regressies, vier nieuwe moduletests en acht nieuwe browsertests. Geen bestaande testverwachtingen zijn aangepast. Productiebuild, `npm run typecheck`, publieke Python-validatie en de volledige Excel/JSON-identiteits-/celcontrole zijn geslaagd: 716 rijen, elf kolommen, alle 7.876 oorspronkelijke plus 7.876 uitgevouwen waarden en 550 merges.

De bestaande 612/606/6-dekking, 605 oorspronkelijke parenvingerafdruk, bronwaarden, onderzoeksvoorstellen, besluiten, datasets en zoeklexicons blijven behouden. De bronbestanden zijn niet toegevoegd. De bouwtest bevestigt dat de nieuwe viewer en publieke bronvermelding aanwezig zijn, maar geen Excel/JSON-spiegel, intern controlerapport of lokaal bronpad.

| Visuele/browsercontrole | Waarneming |
| --- | --- |
| Omgeving | Playwright met systeem-Chromium; **Browser plugin not available**. Desktop 1440×1000 en mobiel 390×844 |
| Paginatitel en URL | Semantische Selectie Tool, lokale route `/controle/#concordans` onder een subpad |
| Inhoud / overlay | Bronviewer met 716 rijen; geen blanco pagina of frameworkfoutoverlay |
| Console / runtime | Geen waarschuwingen of fouten bij raadplegen met de echte lokale bron |
| Interactie | Zoek → rij 21 → elf bronvelden → officieel 2020:19.1 → gekoppelde bronrij → terug; zoeken/wissen, alle bronrijen, toetsenbordfocus en browsergeschiedenis gecontroleerd |
| Responsief | Tabel heeft eigen scrollgebied; details breken leesbaar af; geen horizontale documentoverloop |
| Publieke build zonder bronalias | `/semantische-selectie-tool/#concordans=21` toont beschikbaarheidsmelding; JSON geeft verwachte 404; 2020 laadt en trefwoordzoeken geeft resultaten; geen runtimefouten |

Screenshots zijn buiten de repository bewaard; zij worden niet in een publieke commit opgenomen. De verwachte 404 zonder bron is de expliciete distributiebeperking, geen geslaagde publieke gegevensraadpleging. Het ontbreken van rechtenonderbouwing blijft de blokkade voor volledige openbare functionaliteit. Gebruik dezelfde Playwright-procedure bij toekomstige wijzigingen; de optionele Browser-plugin kan interactieve inspectie ondersteunen, maar is geen runtimevereiste.

### Controle van doorlopende viewer en Excel — opdracht 15

De volledige eindrun is geslaagd: **142 moduletests en 77 Chromium-browsertests, nul overgeslagen**, inclusief de werkelijke lokale bron en onafhankelijke XLSX-teruglezing met Python-standaardbibliotheken. Productiebuild, typecheck, publieke datasetvalidatie en volledige Excel/JSON-identiteits-/celcontrole zijn eveneens geslaagd. De enige vervangen oude gedragsverwachting is paginering: de gevraagde doorlopende tabel bevat nu direct alle 716 rij-ID's in bronvolgorde. Inhoudelijke bron-, kandidaat- en besluitverwachtingen zijn niet aangepast. Een dubbele initiële tabelopbouw bij rechtstreekse rijlinks is verwijderd; een rijselectie hergebruikt de bestaande tabel. Testtimeouts zijn hiervoor niet verruimd.

De Excel-controle leest ZIP, werkbladrelaties, gedeelde strings en alle cellen onafhankelijk terug: exact twee voorgeschreven werkbladnamen, 716 gegevensrijen, 23 kolommen waarvan elf origineel, volledige context, bronrijnummers, beide ongewijzigde foutieve broncodes, filterbereik, vaste koprij en afwezigheid van auteursmetadata, macro's, formules en externe-linkonderdelen. Een technische test met fictieve formuleachtige tekst/Unicode/lege tekst controleert alleen veilig schrijven, niet concordansdekking. De browser controleert de daadwerkelijke downloadnaam en bewijst dat een actief zoekfilter de 716 geëxporteerde rijen niet beperkt.

Aanvullend visueel gecontroleerd: `http://127.0.0.1:4203/controle/`, desktop 1440×1000 en mobiel 390×844, met de echte bron. Correcte paginatitel, inhoud, rijscroll en downloadbediening, geen foutoverlay, relevante consolefouten of horizontale documentoverloop. De Browser-plugin is niet beschikbaar; bestaande Playwright/Chromium is gebruikt. Screenshots en de gegenereerde XLSX blijven buiten Git. Een gewone productiepreview zonder privébronalias blijft een begrijpelijke beschikbaarheidsmelding geven; selectielijsten en zoeken blijven bruikbaar.

Een lokale meting inclusief laden en valideren gaf **3.244 ms** voor openen van alle 716 rijen, **787 ms** voor invoeren/uitvoeren van een zoekopdracht en **709 ms** voor XLSX-generatie inclusief lazy laden; de download was circa 73 kB. Dit zijn indicatieve metingen op deze omgeving, geen garantie voor ieder apparaat. Daarom is geen virtual scrolling toegevoegd: de volledige tabel blijft één native, logisch navigeerbare tabel. Rijselectie bouwt de 716 rijen niet opnieuw op. Andere browserengines en tragere fysieke apparaten zijn niet afzonderlijk gemeten.

Er is geen handmatige opening in Microsoft Excel of LibreOffice uitgevoerd; die programma's waren hier niet beschikbaar. Geldigheid en brongetrouwheid zijn gecontroleerd via de onderhouden XLSX-schrijver, daadwerkelijke browserdownload en onafhankelijke ZIP/XML-teruglezing. De publicatiegrondslag blijft onvoldoende vastgesteld; deze technische controles geven geen distributietoestemming.
