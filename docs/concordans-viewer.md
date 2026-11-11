# Concordans raadplegen

## Beschikbaarheid

De navigatie **Concordans raadplegen** opent de nieuwe alleen-lezen bronviewer naast de bestaande selectielijsten. De viewer is volledig statisch en gebruikt de bestaande concordansloader, indexen en datasetcache. Er is geen backend, database, nieuwe dependency of Markdown-interpreter.

**De integrale concordansdata zijn niet in de publieke build opgenomen.** De hergebruikgrondslag voor deze specifieke werkmap kon onvoldoende worden vastgesteld; zie [hergebruikafweging](concordans-hergebruik.md). Zonder bronbestand toont de viewer dit begrijpelijk, met herkomstinformatie en bronvermelding. De selectielijsten en zoekfuncties blijven werken. Dit is dus een technisch werkende en lokaal met de echte bron geteste viewer, geen claim dat alle bezoekers de data nu al publiek kunnen raadplegen.

## Raadplegen en navigeren

De bron bevat 716 rijen (Blad1, rijen 3–718), elf kolommen A–K. Twintig rijen per pagina behouden de bronvolgorde; alle 36 pagina's zijn bereikbaar. **Vorige pagina** en **Volgende pagina** bladeren; **Ga naar bronrij** opent rechtstreeks een Excelrij. De tabel heeft een eigen horizontaal verschuifbaar, toetsenbordfocusbaar gebied. De elf velden staan bij selectie daarnaast in een leesbare verticale detailweergave, ook op mobiel.

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

## Validatie en beperkingen

De testset controleert iedere oorspronkelijke en uitgevouwen cel, identiteit/716 rijen, elf kolommen, alle bladerpagina's, zoek-/lege toestanden, directe rijlinks, beide navigatierichtingen, cache, late antwoorden, 21/716, zes onopgeloste gevallen, statistiektekst en besluiten, bronlinks, toetsenbord en mobiel. De buildcontrole verhindert een ongewenste bronspiegel en controleert de afwezigheid van lokale paden en interne rapporten. Alle bestaande regressies worden opnieuw uitgevoerd.

Andere browserengines dan Chromium en iedere mogelijke schermgrootte zijn niet afzonderlijk getest. Er is geen beoordelings-/bewerkinterface, Excel-download, automatische juridische interpretatie of productieactivering. Integrale publieke beschikbaarheid blijft geblokkeerd door het ontbreken van een aantoonbare hergebruikgrondslag.

### Uitgevoerde eindcontrole — 11 november 2026

**139 moduletests en 76 Chromium-browsertests geslaagd, nul overgeslagen.** Dit omvat alle bestaande regressies, vier nieuwe moduletests en acht nieuwe browsertests. Geen bestaande testverwachtingen zijn aangepast. Productiebuild, `npm run typecheck`, publieke Python-validatie en de volledige Excel/JSON-identiteits-/celcontrole zijn geslaagd: 716 rijen, elf kolommen, alle 7.876 oorspronkelijke plus 7.876 uitgevouwen waarden en 550 merges.

De bestaande 612/606/6-dekking, 605 oorspronkelijke parenvingerafdruk, bronwaarden, onderzoeksvoorstellen, besluiten, datasets en zoeklexicons blijven behouden. De bronbestanden zijn niet toegevoegd. De bouwtest bevestigt dat de nieuwe viewer en publieke bronvermelding aanwezig zijn, maar geen Excel/JSON-spiegel, intern controlerapport of lokaal bronpad.

| Visuele/browsercontrole | Waarneming |
| --- | --- |
| Omgeving | Playwright met systeem-Chromium; **Browser plugin not available**. Desktop 1440×1000 en mobiel 390×844 |
| Paginatitel en URL | Semantische Selectie Tool, lokale route `/controle/#concordans` onder een subpad |
| Inhoud / overlay | Bronviewer met 716 rijen; geen blanco pagina of frameworkfoutoverlay |
| Console / runtime | Geen waarschuwingen of fouten bij raadplegen met de echte lokale bron |
| Interactie | Zoek → rij 21 → elf bronvelden → officieel 2020:19.1 → gekoppelde bronrij → terug; zoeken/wissen, alle pagina's, toetsenbordfocus en browsergeschiedenis gecontroleerd |
| Responsief | Tabel heeft eigen scrollgebied; details breken leesbaar af; geen horizontale documentoverloop |
| Publieke build zonder bronalias | `/semantische-selectie-tool/#concordans=21` toont beschikbaarheidsmelding; JSON geeft verwachte 404; 2020 laadt en trefwoordzoeken geeft resultaten; geen runtimefouten |

Screenshots zijn buiten de repository bewaard; zij worden niet in een publieke commit opgenomen. De verwachte 404 zonder bron is de expliciete distributiebeperking, geen geslaagde publieke gegevensraadpleging. Het ontbreken van rechtenonderbouwing blijft de blokkade voor volledige openbare functionaliteit. Gebruik dezelfde Playwright-procedure bij toekomstige wijzigingen; de optionele Browser-plugin kan interactieve inspectie ondersteunen, maar is geen runtimevereiste.
