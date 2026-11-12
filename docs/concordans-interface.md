# Concordansinterface en historische vergelijking

> Actueel opdracht 18: na een aanvullende expliciete publicatie-instructie van de projecteigenaar bevat de gewone productiebuild vier werkende downloads en de compacte concordans. De hergebruikgrondslag blijft niet vastgesteld; er wordt geen toestemming van derden geclaimd. Zie [publicatiebesluit](concordans-publicatiebesluit.md) en [acceptatierapport](concordans-distributie-acceptatie.md). Onderstaande eerdere uitvoeringsverslagen blijven als historie behouden.

> Actueel bij opdracht 17: viewer en download gebruiken dezelfde compacte publicatieprojectie. De tabel/export heeft bronrij plus A–K (12 kolommen); mergecontext staat herkenbaar in dezelfde cel, niet in elf dubbele kolommen. Integrale publieke distributie blijft geblokkeerd. Zie [acceptatierapport](publicatie-acceptatie.md), [veldmatrix](publicatie-veldmatrix.md) en [hergebruik](publicatie-privacy-hergebruik.md). Oudere uitvoeringsbeschrijvingen hieronder documenteren de vorige ontwikkelstappen.

## Doorlopende tabel en Excel-download — opdracht 15

De viewer toont nu alle 716 rijen in één doorlopende tabel, zonder paginering. Kolomkoppen en bronrijnummers blijven vast bij scrollen. Bronrijlinks markeren de rij en verschuiven de tabel ernaartoe. De knop **Download Concordans 1996-2020 (.xlsx)** maakt **Concordans 1996-2020.xlsx** met werkbladen **Concordans 1996-2020** en **Bronvermelding**. A–K blijven origineel, L–V zijn expliciet aanvullende uitgevouwen context en W is het bronrijnummer. Alle rijen worden geëxporteerd, ongeacht zoekfilters.

De schrijver wordt pas op aanvraag in de browser geladen; er is geen aparte Excel-dataset of backend. Gegevens, besluiten en koppelingen blijven intact. De hergebruikgrondslag ontbreekt nog: JSON en afgeleide download worden niet publiek meegeleverd. De broninhoud is afzonderlijk op concrete persoonsgegevens gecontroleerd; er zijn daarbij geen concrete persoonsgegevens aangetroffen en er zijn geen rijen of kolommen om privacyredenen weggelaten. Twee gevulde maker-/wijzigingsvelden uit de oorspronkelijke werkmapmetadata worden niet overgenomen. Zie [viewer](concordans-viewer.md) en [privacy en hergebruik](concordans-hergebruik.md#privacycontrole-opdracht-15).


## Concordansviewer — 11 november 2026

**Concordans raadplegen** ontsluit technisch alle 716 oorspronkelijke rijen en elf kolommen met zoeken, bladeren, rijpermalinks en koppelingen naar de bestaande voorschriften. Bronvelden, mergecontext, technische correcties en eigenaarbesluiten blijven gescheiden. De bestaande vergelijkingssectie linkt terug naar de bronviewer. Zie [concordans-viewer.md](concordans-viewer.md) voor bediening, testen en lokaal gebruik.

De specifieke werkmap heeft nog geen voldoende aangetoonde hergebruikgrondslag voor integrale openbare JSON-distributie. Daarom blijven de oorspronkelijke data buiten de publieke build. Zonder data toont de viewer een eerlijke beschikbaarheidsmelding en werken selectielijsten/zoeken door. De [hergebruikafweging](concordans-hergebruik.md) beschrijft concrete bronnen, onzekerheden en de vereiste vervolgstap. Er is geen productiepublicatie geactiveerd.


## Actuele verwerking van beoordelingsbesluiten — 11 november 2026

De projecteigenaar heeft tien besluiten voor acht probleemgroepen aangeleverd. Codex heeft deze technisch verwerkt; dit is geen onafhankelijke inhoudelijke validatie door Codex en geen validatie van alle 612 interpretaties. De vastleggingsdatum is 11 november 2026. De oorspronkelijke gespreksdatum is onbekend en blijft leeg. Beoordelaarsrol: **Projecteigenaar — inhoudelijke beoordeling**.

De oorspronkelijke onderzoeksvoorstellen, kandidaten en technische A/B/C-registratie blijven intact. Het register onderscheidt de oorspronkelijke `gevallen` (onderzoeksvoorstellen), de nieuwe `beoordelingsbesluiten` en hun afzonderlijke `technische_verwerking`. De oude lege beoordelaarsvelden horen bij het oorspronkelijke onderzoeksdossier; de actuele besluiten staan uitsluitend in de nieuwe laag. `relatie_inhoudelijk_goedgekeurd` is bij alle tien besluiten `false`: een bevestigde onzekerheid of technische recordidentiteit is geen goedkeuring van juridische of inhoudelijke gelijkwaardigheid.

| Bronrij | Vastgelegd besluit | Technisch gevolg |
| --- | --- | --- |
| 50, 51, 52 | Behoud koppeling met `1996-2012:2.8::001`; tekstverschil blijft zichtbaar | Drie bestaande koppelingen behouden; één gedeeld tekstueel vraagstuk |
| 6 | Onvoldoende onderbouwd; beide historische kandidaten behouden | Geen definitieve historische koppeling |
| 21 | Afzonderlijke technische verwijzing van `19.1.` naar `2020:19.1` | De bestaande relatie-ID en bron `1996-2012:2.3::003` blijven behouden |
| 89 | Onvoldoende onderbouwd; beide historische kandidaten behouden | Geen definitieve historische koppeling |
| 90 | Meerdere historische relaties mogelijk; beide kandidaten en termijnverschil zichtbaar | Geen definitieve historische koppeling; concordans 10 jaar versus officiële 5 jaar blijft zichtbaar |
| 293 | Meerdere historische relaties mogelijk; alle drie kandidaten behouden | Geen definitieve historische koppeling |
| 434 | Onvoldoende onderbouwd; beide historische kandidaten behouden | Geen definitieve historische koppeling |
| 442 | Meerdere historische relaties mogelijk; beide kandidaten behouden | Geen definitieve historische koppeling |

| Dekking op werkelijke bron | Vóór | Na |
| --- | ---: | ---: |
| Historische relatie-interpretaties | 612 | 612 |
| Volledig technisch gekoppeld | 605 | 606 |
| Onopgelost | 7 | 6 |
| Unieke gekoppelde recordparen | 604 | 605 |

De zes resterende open interpretaties zijn rijen **6, 89, 90, 293, 434 en 442**. Zij blijven in het overzicht raadpleegbaar met hun kandidaten, onderbouwing en bevestigde onzekerheid. Er is geen kandidaat geactiveerd. Rij 716 blijft een afzonderlijke nieuwe-2020-verwijzing naar `2020:19.2.1`, zonder historische relatie.

### Actuele besluitpresentatie

De rijadapter biedt naast `beoordelingVoor` voor de oorspronkelijke onderzoeksregistratie nu `besluitVoor(bronrijOfInterpretatieId)` aan. Elke betrokken rij bevat haar afzonderlijke `beoordelingsbesluit`. De browserbuild neemt alleen de compacte besluitlaag uit het register op; het volledige onderzoeksregister wordt niet naar de site gekopieerd of tijdens gebruik opgehaald.

De interface toont “Beoordelingsbesluit vastgelegd”, herkomst projecteigenaar, technische verwerking Codex, vastleggingsdatum en resterende onzekerheid. Technische koppeling, eigenaarbesluit en historisch onderzoek worden apart benoemd. Negatieve of meervoudige besluiten melden expliciet dat geen definitieve historische koppeling is vastgesteld.

Rij 21 toont de oorspronkelijke `19.1.`, het gekoppelde officiële `19.1 — Verwerkt` en de melding dat de oorspronkelijke bedoeling niet onafhankelijk bewezen is. Vergelijken en navigeren gebruiken het officiële record in beide indexrichtingen. De vergelijkingskolommen blijven uitsluitend officiële datasetwaarden bevatten. Het overzicht toont zes open relaties en afzonderlijk beide technische correcties 21 en 716. De besluiten verwijderen de zes open relaties niet uit dit overzicht. Bij 50–52 blijft het tekstverschil direct zichtbaar; de officiële omschrijving is leidend.

### Validatie van de besluitverwerking

Op 11 november 2026 zijn **135 moduletests en 68 Chromium-browsertests geslaagd, zonder overgeslagen tests**. Uitgevoerd: `CONCORDANS_BRON_JSON=/tmp/concordans-12/concordans.json CHROMIUM_PATH=/usr/bin/chromium npm test`, `npm run typecheck`, `python scripts/valideer_publicatie.py` en de bestaande Excel/JSON-broncontrole. Productiebuild, bronidentiteit, alle 7.876 oorspronkelijke en 7.876 uitgevouwen cellen en het byte-identiek herhaalde koppelrapport zijn geslaagd. De echte bron blijft lokaal; een andere lokale bestandslocatie kan via dezelfde omgevingsvariabele worden gebruikt.

Nieuwe regressies controleren alle tien besluiten/acht groepen, behoud van het volledige oorspronkelijke onderzoeksregister via een vaste SHA-256, 612/606/6, behoud van de oorspronkelijke 605 recordparen, broncellen, kandidaten, 50–52 en 716, gewijzigde bron-/doelcontext, ongeautoriseerde correctie-ID’s en uitsluitend de compacte besluitprojectie in de productie-uitvoer. De browser controleert rij 21 in beide richtingen, officiële vergelijking, zes open relaties, ontbrekend bestand en bestaande zoek-, boom- en detailfunctionaliteit. Desktop en mobiel zijn aanvullend visueel gecontroleerd onder `/controle/`, zonder JavaScript-fouten of horizontale overloop.

Bewust gewijzigde oude testverwachtingen: rij 21 is nu gekoppeld op expliciet besluit; rapport- en overzichtstellingen veranderen daarom van 605/7 naar 606/6. De interface verwacht de vastgelegde besluitstatus en de build mag de compacte besluitlaag projecteren. De oorspronkelijke onderzoeksvoorstellen, B-kandidaten, officiële bronverwachtingen, zoekverwachtingen en volledige 605-parenvingerafdruk zijn behouden. Dit zijn geen aanpassingen om fouten te verhullen.

## Historische uitgangsrapportage (behouden)

## Functie en afbakening

Vanaf uitgangscommit `c2b4d99` (samengevoegde PR #11) bevat het bestaande detailpaneel een inklapbaar onderdeel **Vergelijk met andere selectielijsten**. De oorspronkelijke boom, zoekmodi en officiële details blijven de ingang. Er is geen nieuwe applicatiearchitectuur, backend, database, zoekalgoritme of beoordelingssysteem.

De interface gebruikt de werkelijke oorspronkelijke concordans via de bestaande `laadBronconcordans`-module. De gegevens worden pas opgehaald wanneer het onderdeel wordt geopend. De oorspronkelijke rijbron, technische koppelingen, afwijkingsregistratie en eventuele inhoudelijke beoordeling blijven afzonderlijk herkenbaar. De toelichting luidt:

> Deze vergelijking is gebaseerd op een historische concordans. Een relatie tussen voorschriften betekent niet automatisch dat zij juridisch of inhoudelijk gelijkwaardig zijn.

De publieke build bevat nog **geen concordans-JSON**. Publieke distributie daarvan blijft afhankelijk van de vast te leggen grondslag; een lokaal functionerende vergelijking betekent geen herpublicatietoestemming. Het project is onafhankelijk, niet-commercieel, kosteloos en publiek toegankelijk. Dat is context voor de hergebruikafweging, geen zelfstandige toestemming.

## Componenten en bestaande API's

- `src/interface/concordans.ts`: uitklapbaar relatiesectie, groepering van recordparen, bronverklaringen, controleoverzicht, vergelijking en navigatieknoppen.
- `src/interface/vergelijking.ts`: afzonderlijk testbare veldprojectie van uitsluitend bestaande officiële datasetrecords. Deze module kent geen concordanscellen en kan ze niet als vervangende bronwaarde gebruiken.
- `src/interface/app.ts`: gebruikt de bestaande gegevenslaag en boom. Alleen navigatie vanuit de concordans bouwt een tijdelijke terugkeerreeks op. De gekozen lijst, actieve technische ID, geopende boomlocatie en details worden samen bijgewerkt.
- `src/interface/details.ts`: bestaande bronlocatie- en ontbrekende-waardepresentatie worden hergebruikt, zonder wijziging van officiële waarden.
- `src/interface/style.css`: rustige relatielijst en één vergelijkingstabel; op mobiel staan veldnamen boven de twee waarden met herhaalde kolomlabels.

Eén concordansloader hoort bij de applicatiesessie en gebruikt `new URL('./concordans/concordans.json', document.baseURI)`. Er zijn geen absolute domein-/rootpaden. De bestaande module deelt lopende aanvragen, cachet succesvol geladen gegevens en verwijdert een mislukte aanvraag voor een expliciete herpoging. Dezelfde gegevenslaaginstantie hergebruikt de al geladen officiële datasets. Het laden van concordansdata mag de daadwerkelijk betrokken lijsten ontsluiten; het openen van de applicatie doet dat niet.

## Relaties, bronrichting en navigatie

Een voorschrift gebruikt `vanuitSelectiegegeven`; een hoger onderdeel gebruikt `vanuitStructuur`. De interface vraagt uitgaande én inkomende relaties op, zonder de historische bronrichting om te keren. Vanuit 2020 wordt daarom expliciet uitgelegd dat het om inkomende 1996→2020-verwijzingen gaat. Er wordt geen vastgestelde opvolgingsrelatie geïmpliceerd.

Eén-op-één, één-op-veel en veel-op-één behouden de bestaande eindpunten. Exact hetzelfde gekoppelde recordpaar krijgt één groep, met toegang tot **iedere afzonderlijke oorspronkelijke bronrijverklaring**. Bij de echte bron zijn rijen 344 en 345 zo afzonderlijk toegankelijk onder het paar `1996-2012:3.6.1::022`–`2020:13.1.1`. Onvolledige verwijzingen worden niet op basis van een ontbrekend eindpunt tot één groep samengevoegd.

De knop **Vergelijk officiële gegevens** opent de tabel binnen hetzelfde detailpaneel. **Sluit vergelijking** verwijdert de tabel en focust de relatiesectie. **Open gerelateerd voorschrift** wisselt zo nodig van lijst, activeert precies de gekoppelde technische ID, opent de boomlocatie en focust de detailtitel. **Terug naar oorspronkelijk voorschrift** herstelt het vorige record; bij meerdere concordansstappen kan de gebruiker de reeks teruglopen.

Een handmatige lijstkeuze of gewone boom-/zoekselectie begint een nieuwe navigatiecontext en wist deze tijdelijke terugkeerreeks. Er is geen opslag buiten de sessie en geen casusopslag. Technische suffixen worden uitsluitend intern als IDs gebruikt; zichtbaar blijven officiële codes en benamingen.

Een geselecteerd hoger structuurniveau krijgt geen relaties van al zijn onderliggende voorschriften toegeschreven. De generieke module en vergelijking ondersteunen directe structuurverwijzingen, maar de echte huidige historische paren zijn aan selectiegegevens gekoppeld. De renderer verzint geen voorbeeldrelatie naar een hoger niveau om dekking te suggereren. Tests controleren lege hogere niveaus en de geïsoleerde veldpresentatie daarvan.

## Officiële vergelijkingskolommen

De tabel toont waar van toepassing selectielijst/vaststelling, officiële code, benaming, context, omschrijving, waardering, volledige bewaartermijn, procestermijn, aanvangsmoment, voorwaardenverwijzingen, toelichting, uitzonderingen en bronlocatie. De bronlegenda voor waardering wordt alleen getoond als die daadwerkelijk in de dataset beschikbaar is.

Elke kolom komt uit het bijbehorende officiële datasetrecord. Samengestelde termijnen, B-waarden, voorwaarden, regeleinden en lege velden worden niet inhoudelijk herschreven. Waar een bron geen afzonderlijke termijn bevat, wordt dat uitgelegd; bij een hoger structuurniveau wordt ‘niet van toepassing’ onderscheiden van een ontbrekende bronwaarde. Een ontbrekende officiële waarde wordt nooit vervangen door concordanstekst. Er wordt geen vernietigingsdatum berekend.

Een lichte markering en het label **Letterlijk verschil** geven alleen stringverschillen weer. ‘B’ en ‘Bewaren’ kunnen dus gemarkeerd worden zonder dat dit een inhoudelijke wijziging betekent. Er wordt geen automatische conclusie over verlenging, geldigheid of toepasselijkheid getrokken. Bronlinks en bronlocaties volgen de bestaande presentatie: geregistreerde PDF-pagina's zijn geen gegarandeerde paginadeeplinks. Algemene bepalingen en rubriekcontext blijven afzonderlijk raadpleegbaar.

## Statussen en onzekerheid

| Presentatie | Betekenis |
| --- | --- |
| Technisch gekoppeld | Beide eindpunten zijn technisch herleid; dit bewijst geen inhoudelijke gelijkwaardigheid. |
| Kandidaat, inhoudelijke beoordeling vereist | De bestaande afwijkingsregistratie of een ontbrekend eindpunt vraagt beoordeling. Kandidaatknoppen openen alleen een officieel record; ze activeren geen relatie. |
| Niet gekoppeld | Er ontbreekt een bindend eindpunt. De bekende context en bronverklaring blijven toegankelijk. |
| Technisch gecorrigeerde verwijzing | De ongewijzigde bronwaarde is gescheiden van een onderbouwde technische verwijzing naar een officieel record. |

Bij rijen 50–52 kunnen **Technisch gekoppeld** en een B-waarschuwing tegelijk voorkomen: de technische recordidentiteit staat vast, maar ‘Door de gemeente’ versus ‘Door en aan de gemeente’ heeft mogelijk een andere inhoudelijke reikwijdte. Beide uitspraken worden afzonderlijk getoond. De bestaande A/B/C-statussen en correcties zijn niet veranderd.

Het onderdeel **Openstaande en gecorrigeerde verwijzingen** toont alle zeven onopgeloste interpretaties: rijen **6, 21, 89, 90, 293, 434 en 442**. De kandidaat-IDs uit `beoordelingVoor` worden naar officiële code/benaming vertaald, met een expliciete kandidaatstatus. Onopgeloste bronnen verdwijnen dus niet doordat zij niet via een geselecteerd historisch record geïndexeerd zijn. Dit overzicht biedt geen bewerk-, goedkeur- of beheerfuncties.

Rij **716** is apart zichtbaar in het overzicht en bij het officiële record `2020:19.2.1`. De bronwaarde `19.21.1`, technische correctie en bronrijverklaring worden samen getoond met ‘Nieuw in 2020; dit is geen historische 1996–2020-relatie’. Er is geen vergelijkingspaar met een verzonnen 1996-voorschrift.

## Bronherleidbaarheid en 2017

Elke bronverklaring vermeldt de oorspronkelijke richting, bronrij en werkblad. De oorspronkelijke cellen zijn afzonderlijk uitklapbaar; lege oorspronkelijke cellen blijven als leeg herkenbaar. Alleen daadwerkelijk uitgevouwen, gewijzigde mergewaarden staan onder ‘Werkelijk samengevoegde broncontext’. Concordanssubletters worden niet als officiële codes gepresenteerd.

De oorspronkelijke bestandsnaam en bestaande lokale bronmetadata zijn bereikbaar. Er wordt geen directe Excel-downloadlink verzonnen. Publicerende organisatie en rechthebbenden worden niet op basis van aannames ingevuld; de beschikbare registratie stelt die voor deze exacte werkmap niet vast. De bestaande VHIC-contextverwijzing wordt niet verheven tot een bewezen publicatie- of eigendomsclaim.

Vanuit 2017 verschijnt eerst de melding dat deze bron geen rechtstreeks vastgestelde 2017-codemapping bevat. Dat opent nog geen concordansbestand. Wie vervolgens expliciet het concordansoverzicht opent, kan de beschrijvende opmerkingen in J/K afzonderlijk bekijken. Ook een tekstovereenkomst wordt geen vastgestelde relatie of code-uitbreiding naar een andere lijst.

## Laden, fouten en gelijktijdige acties

Ontbrekende of ongeldige concordansdata geven een fout binnen de relatiesectie met **Concordans opnieuw proberen**. De officiële details, boom en zoekfuncties blijven werken. Geen resultaten betekent geen rechtstreeks geïndexeerde relatie, niet dat historische samenhang is uitgesloten.

Een gesloten of inmiddels vervangen detailsectie kan na een late aanvraag geen nieuwe selectie overschrijven. Navigatieverzoeken en vergelijkingsverzoeken hebben hun eigen volgordecontrole. Handmatige lijstwissels wissen de actieve selectie en verouderde zichtbare vergelijking. Ongeldige officiële vergelijkingsrecords geven een eigen foutmelding; er worden geen standaardbronwaarden verzonnen.

## Reproduceerbaar lokaal testen met de echte bron

Er is geen fictief productieconcordansbestand. Gebruik de rechtmatig verkregen oorspronkelijke Excel en JSON buiten de publieke repository, bijvoorbeeld in `/tmp` of de al uitgesloten `.private-inputs/`.

```sh
npm ci
npm run build
python scripts/controleer-concordansbron.py \
  --excel '/pad/Concordans Selectielijst 1996-2020(1).xlsx' \
  --json /pad/concordans.json --output /tmp/concordans-interface-broncontrole.json

CONCORDANS_BRON_JSON='/pad/concordans.json' \
  node scripts/serve.mjs --base /testpad/ --port 4201 --concordans-env
```

Open `http://127.0.0.1:4201/testpad/`. De bestaande **lokale statische previewserver** krijgt alleen met de expliciete vlag `--concordans-env` een extra bestandsalias voor `concordans/concordans.json`. Hij controleert eerst SHA-256 `b01cff07c7bfeeb6f562d467373615f5a18cfc7ab9777f11fcd5cb1ed7de73dd` en luistert alleen op localhost. De bytes blijven buiten `dist/site/`; er ontstaat geen backenddienst in de applicatie. Zonder vlag wordt de privébron niet aangeboden, ook niet wanneer de omgevingsvariabele toevallig gezet is.

De productiebuild blijft dus zonder bron-JSON en kan niets daarvan automatisch publiceren. De alias is een lokale ontwikkelvoorziening, geen publicatieroute. GitHub Pages wordt niet geactiveerd. Gewone hosting zonder de apart vast te stellen data-opname toont de begrijpelijke ontbrekend-bestandmelding.

Volledige tests, inclusief daadwerkelijke browserinteracties met de echte bron:

```sh
CONCORDANS_BRON_JSON='/pad/concordans.json' \
  CHROMIUM_PATH=/usr/bin/chromium npm test
npm run typecheck
python scripts/valideer_publicatie.py
```

`CHROMIUM_PATH` is alleen nodig wanneer het systeem-Chromium wordt gebruikt. Playwright zet voor deze expliciete bronrun de lokale alias aan. Zonder de bronvariabele blijven de ontbrekend-bestand-/2017-tests actief; alleen de herkenbaar gemarkeerde echte-brontests worden overgeslagen. Zo'n run is geen bewijs van volledige concordansfunctionaliteit.

## Validatie en resterende beperkingen

Uitgevoerd met de **werkelijke** geverifieerde bron: 125 moduletests en 67 Chromium-browsertests, inclusief de bestaande regressies. De nieuwe controles dekken één-op-één, één-op-veel, veel-op-één, beide navigatierichtingen, terugkeer naar het precieze technische voorschrift, dubbele bronrijverklaringen, zeven openstaande relaties, rij 716, rijen 50–52, 2017, herstel/cache, late aanvragen, keyboardfocus, mobiele leesbaarheid en productiebuild. Geïsoleerde veldtests controleren samengestelde/voorwaardelijke termijnen, lege waarden en structuurniveaus zonder fictieve concordansdekking te claimen.

Eén oude bouwtest is bewust bijgewerkt: de verwachting ‘geen UI-activatie’ uit de technische modulefase is nu vervangen door aanwezigheid van de gevraagde lazy interface. De controle dat geen bron-JSON in de productiebuild staat blijft behouden. Bestaande inhoudelijke zoek- en datasetverwachtingen zijn niet gewijzigd.

Visueel gecontroleerd via Playwright/Chromium op `http://127.0.0.1:4201/testpad/`, desktop 1440×1000 en mobiel 390×844. De Browser-plugin is niet beschikbaar; de bestaande Playwright-omgeving is gebruikt. Controle: correcte paginatitel/URL, betekenisvolle inhoud, geen foutoverlay, geen relevante console-/runtimefouten, werkende officiële vergelijking en geen horizontale overflow. Screenshots staan buiten de repository in `/tmp/concordans11-desktop.png` en `/tmp/concordans11-mobiel.png`.

Niet getest in andere browserengines of op alle schermformaten. Zeven interpretaties blijven onopgelost; 2017 heeft geen volledige mapping; technische juistheid bewijst geen archivistische toepasselijkheid. De volledige bron en afgeleide tabel zijn niet publiek toegevoegd. Voor openbare functionaliteit blijft een afzonderlijke, onderbouwde data-distributiestap nodig.
