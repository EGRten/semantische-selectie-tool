# Historische acceptatie publicatienaslagwerken — opdracht 17

> De gewone productiebuild bevat vier naslagwerken en vier Excel-downloads, zonder lokale concordansalias. Zie de [actuele acceptatie](concordans-distributie-acceptatie.md) en [rechtenverklaring](../HERGEBRUIK.md). Eerdere technische resultaten hieronder beschrijven de genoemde ontwikkelstappen, niet de huidige distributiestatus.

**Historisch resultaat van opdracht 17:** destijds waren drie publieke Excel-downloads opgenomen en werd de concordans lokaal gecontroleerd. De vierde projectie maakte toen nog geen deel uit van de productiebuild. De huidige vier-downloadstatus staat in het [actuele acceptatierapport](concordans-distributie-acceptatie.md). Geen Pages-activering of samenvoeging.

## Resultaat per acceptatievoorwaarde

| Controle | Uitkomst |
| --- | --- |
| Drie doorlopende selectietabellen | Geslaagd: 494, 305 en 346 afzonderlijke regels, inclusief vervallen resultaten, zonder paginering |
| Vier compacte JSON-bestanden | Drie publiek; vierde reproduceerbaar lokaal gegenereerd met 716 rijen, buiten Git en productiebuild |
| Concordans A–K en bronrij | Lokaal geslaagd: 716 × 11 oorspronkelijke waarden en bijbehorende mergecontext behouden; 550 mergebereiken gecontroleerd tegen Excel |
| Vier publieke downloads zonder privébron | **Niet geslaagd: 3 van 4**; ontbrekende concordans geeft een begrijpelijke fout, overige functies werken |
| Excel-selectielijsten | Exact voorgeschreven namen; Selectiegegevens / Toelichtingen / Bronvermelding; 9 / 11 / 11 primaire kolommen |
| Excel-concordans | Alleen lokaal: Concordans 1996-2020.xlsx; Concordans 1996-2020 / Bronvermelding; 12 primaire kolommen |
| Zelfstandig teruglezen | Alle vier echte browserdownloads met Python ZIP/XML en openpyxl geopend, juiste aantallen en werkbladen; openpyxl meldt alleen het ontbreken van een standaardstijl |
| Brongetrouwheid en scheiding | Oorspronkelijke datasets, concordansinterpretaties, besluiten, AI-voorstellen en zoeklexicons ongewijzigd; technische correcties staan afzonderlijk |
| Minimalisatie | Geen volledige records/structuurpaden als JSON, PDF-coördinaten, Office-makermetadata of interne beoordelaars in de projecties/exports; verborgen navigatie-ID's blijven in JSON |
| Subpad, mobiel en toetsenbord | Browserregressies; aanvullende visuele controle bij 390 en 1440 pixels; geen paginaoverflow of consolefouten |
| Rechten | Bronvermelding, oorspronkelijke rechten en toepasselijke voorwaarden blijven afzonderlijk gelden; zie [HERGEBRUIK.md](../HERGEBRUIK.md) |

## Schema en productiepad

Het gesloten [JSON-schema](../schemas/publicatie.schema.json) beschrijft versie 1. `id`, `titel`, `kolommen` en `rijen` bepalen het naslagwerk. Iedere rij heeft een stabiel verborgen `id`, exact 9 of 11 officiële waarden (nullable), leesbare `notities`, bronreferenties en eventuele verwijzingen naar gedeelde achtergrond. Concordansrijen hebben bovendien `bronrij`, afzonderlijke sparse `context` en technische `koppelingen`. `achtergrond` bewaart gedeelde officiële toelichtingen eenmaal; `bronnen` is een register met korte verwijzingen, titels, beschikbare URL's en leesbare bronlocaties. `hergebruik` bevat de toepasselijke toelichting. Schema en runtime valideren aantallen, unieke IDs, verwijzingen en concordansrijvolgorde.

`src/publicatie/projectie.ts` maakt de afgeleide projecties vanuit de ongewijzigde bronlaag. `publicatie/*.json` bevatte in deze stap de drie minified selectielijsten. `src/publicatie/index.ts` laadt uitsluitend de gekozen projectie met sessiecache en foutafhandeling. Dezelfde cel- en bronpresentatie wordt gebruikt door beide viewers en `src/publicatie/excel.ts`. Gemeenschappelijke toelichtingen staan eenmaal met leesbare verwijzingen in het aanvullende werkblad. Uitgebreide broninhoud maakt de bestanden ondanks minimalisatie nog relatief groot; het is geen verlieslatende samenvatting.

De build van opdracht 17 kopieerde uitsluitend de drie selectielijstprojecties en weigerde een vierde bestand of ander onverwacht bestand in de publieke projectiemap. Reguliere concordansgeneratie was toen niet opgenomen. Oudere volledige exporthulpmiddelen blijven voor controle en regressietests beschikbaar in de ontwikkeluitvoer, maar hun exportmodules worden niet naar de website gekopieerd.

## Reproduceren

```sh
npm run typecheck
npm test
python scripts/valideer_publicatie.py
node scripts/genereer-publicaties.mjs --check
node scripts/controleer-publieke-downloads.mjs --output /tmp/publieke-downloads.json
```

De laatste controle start een gewone statische server onder een repositorysubpad, verwijdert de concordansomgevingsvariabele, gebruikt geen alias of mock en downloadt via Chromium. De run van opdracht 17 eindigde met exitcode 1: `harde_acceptatie: false`. Dit is de geconstateerde blokkade, geen als geslaagd aangemerkte test.

Uitsluitend voor lokale broncontrole, na ontvangst van de oorspronkelijke JSON met de gedocumenteerde hash:

```sh
node scripts/genereer-publicaties.mjs --concordans /tmp/concordans/concordans.json --output /tmp/projecties
CONCORDANS_BRON_JSON=/tmp/concordans/concordans.json npm test
CONCORDANS_BRON_JSON=/tmp/concordans/concordans.json node scripts/serve.mjs --concordans-env
```

Gebruik de bestaande expliciete lokale serveroptie voor controle van vergelijking en viewer. Deze voorziening bewijst geen publieke beschikbaarheid. De generator controleert de bronhash; het Excelbestand is afzonderlijk op de vastgelegde SHA-256 gecontroleerd. Een Office- of LibreOffice-applicatie is niet handmatig gebruikt; onafhankelijk teruglezen gebeurde met openpyxl en XML-controles.

## Testresultaten en aangepaste verwachtingen

De volledige regressieset omvat 157 moduletests en 85 Chromium-browsertests, met de echte concordans lokaal beschikbaar. Typecheck, productiebuild, publieke datasetvalidatie en reproduceerbare generatie zijn uitgevoerd. Nieuwe tests controleren gesloten schema, bronwaarden en aanvullende officiële gegevens, gedeelde bronnen/toelichtingen, minimalisatie, vier lokale exports en drie gewone publieke downloads. De afzonderlijke harde publieke acceptatie blijft rood.

Bestaande browserverwachtingen zijn uitsluitend aangepast aan de gevraagde nieuwe gegevensroute (`publicatie/*.json`), drie selectiewerkbladen en gescheiden besluiten zonder onnodige beoordelaarsrol. Technische exportcontroles op de oorspronkelijke volledige bronlaag blijven intact. Zoekrangschikking en inhoudelijke verwachtingen zijn niet aangepast.

## Actuele verwijzingen

De huidige gegevensroute en vier publieke downloads staan in het [acceptatierapport](concordans-distributie-acceptatie.md); voor bronvermelding en voorwaarden geldt [HERGEBRUIK.md](../HERGEBRUIK.md). Zie ook de [privacy-inventarisatie](publicatie-privacy-hergebruik.md) en [veldmatrix](publicatie-veldmatrix.md).

[Eerdere versies](https://github.com/EGRten/semantische-selectie-tool/commits/911c9e2/docs/publicatie-acceptatie.md) blijven beschikbaar in de Git-geschiedenis.
