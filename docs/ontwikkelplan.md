# Ontwikkelplan

Dit plan beschrijft de stapsgewijze ontwikkeling van de Semantische Selectie Tool voor de selectielijsten 1996 (actualisatie 2012), 2017 en 2020. Iedere selectielijst behoudt haar eigen structuur, terminologie en gegevens.

## Huidige voorbereidingsstap

De bestaande repository bevat `README.md` en `AGENTS.md`. Deze stap voegt alleen dit ontwikkelplan en een `.gitignore` toe. Er worden nog geen datasets opgenomen, dependencies geïnstalleerd, webfunctionaliteiten gebouwd of databasearchitecturen ingevoerd. De onderstaande vervolgfases worden pas op afzonderlijke opdracht uitgevoerd.

## Ontwikkelfasen

| Fase | Werkzaamheden en beoogd resultaat |
| --- | --- |
| 1. Repository-inrichting | Bestaande structuur en projectinstructies controleren; ontwikkelplan en passende uitsluitingen voor lokale ontwikkelbestanden vastleggen. |
| 2. Datasetinventarisatie en publicatiecontrole | Het bestaande datasetpakket inventariseren, inclusief bestanden, versies, schema's, bronverwijzingen en testvragen. Voor openbare opname hergebruikvoorwaarden, auteursrechtvermeldingen, persoonsgegevens en vertrouwelijke informatie controleren. Onzekerheden vastleggen. |
| 3. Datasetopname en technische validatie | Na publicatiecontrole het pakket onder versiebeheer opnemen. Gegevens met beschikbare JSON-schema's valideren en unieke identificaties, technische verwijzingen en volledigheid controleren. Technische afwijkingen afzonderlijk van inhoudelijke broncontrole rapporteren. Ontbrekende brongegevens niet aanvullen. |
| 4. Statische gegevenslaag | Gegevens geschikt ontsluiten voor gebruik volledig in de browser, met behoud van bronverwijzingen, onzekerheden en scheiding tussen selectielijsten. Geen eigen backend, serverdatabase of verplichte externe API introduceren. Python uitsluitend voor voorbereiding, validatie of generatie gebruiken. |
| 5. Boomstructuren per selectielijst | Per selectielijst de oorspronkelijke hiërarchie en terminologie raadpleegbaar maken. Technische identificaties onderscheiden van officiële selectiecodes. |
| 6. Trefwoordzoeken | Zoeken op officiële codes, trefwoorden en omschrijvingen implementeren binnen de gekozen selectielijst. Resultaten uit verschillende lijsten alleen op expliciete gebruikershandeling combineren. |
| 7. Begripsgericht zoeken | Afzonderlijk zoeken met semantische zoeklexicons toevoegen, met zichtbare herkomst en status. Onbevestigde AI-voorstellen standaard uitsluiten en alleen na expliciete inschakeling gebruiken. |
| 8. Detailweergave en concordans | Officiële selectiegegevens, waarderingen, volledige bewaartermijnen, voorwaarden, toelichtingen en bronverwijzingen tonen. Beschikbare concordansrelaties herkenbaar weergeven zonder automatische toepasselijkheidsconclusies. |
| 9. Integratietests | Samenhang tussen gegevenslaag, boomnavigatie, beide zoekvormen, details en concordans controleren. Beschikbare testvragen gebruiken zonder verwachte uitkomsten kunstmatig aan te passen. Ook standaardsluiting van onbevestigde AI-relaties en behoud van brongegevens controleren. |
| 10. Voorbereiding op ChatGPT Sites | Geschiktheid voor een statische browseromgeving en ChatGPT Sites controleren; publicatie-instructies, beperkingen en resterende bevindingen documenteren. Publicatie gebeurt in een afzonderlijke opdracht. |

## Gescheiden beheer van brongegevens en zoekverrijking

Officiële brongegevens en AI-gegenereerde zoekverrijking worden afzonderlijk beheerd en herkenbaar gehouden in bestanden, validatie en presentatie. De concrete bestandsindeling volgt pas na inventarisatie van het bestaande pakket. Officiële selectiecodes, omschrijvingen, waarderingen, bewaartermijnen en hiërarchieën blijven brongetrouw; zoekverrijking overschrijft deze gegevens niet.

Voor zoekrelaties worden de beschikbare herkomst, status en eventuele onzekerheden behouden. Officiële terminologie, brononderbouwde alternatieve benamingen en AI-voorstellen blijven te onderscheiden. AI-relaties maken geen deel uit van de officieel vastgestelde selectielijsten en zijn niet zonder meer inhoudelijk gevalideerd. Onbevestigde voorstellen staan standaard uit.

Semantische verwantschap ondersteunt alleen de vindbaarheid. Een zoekresultaat of concordansrelatie bewijst niet dat een selectievoorschrift van toepassing is en vormt geen zelfstandig juridisch of archivistisch selectiebesluit. Technische validatie bevestigt evenmin de inhoudelijke juistheid; inhoudelijke broncontrole blijft een afzonderlijke activiteit.

## Afgeronde datasetimport — 10 november 2026

Fase 1 is afgerond. Voor fase 2 is het publicatievoorbereide pakket geïnventariseerd en zijn de meegeleverde rechten- en privacybeoordelingen en resterende voorbehouden gelezen en behouden. Fase 3 is afgerond: de drie datasets zijn gescheiden opgenomen, de publieke technische validatie is geslaagd en vijftien CSV-exporten zijn byte-identiek gereproduceerd. De gerichte bronintegriteitscontrole bevestigt behoud van de geregistreerde afwijkingen; er is geen nieuwe inhoudelijke bronbeoordeling uitgevoerd. Zie [dataset-importcontrole.md](dataset-importcontrole.md) voor inventaris, aantallen, controles en beperkingen. Fasen 4 tot en met 10 zijn hiermee niet uitgevoerd.

## Afgeronde statische gegevenslaag — 10 november 2026

Fase 4 is afgerond: een TypeScript-gegevenslaag laadt per gekozen lijst manifest, structuur en selectiegegevens, hergebruikt geladen gegevens en ontsluit readonly bronrecords via technische indexen. Ouder-kindrelaties, paden en de koppeling van meerdere voorschriftregels aan een rubriek zijn beschikbaar zonder een interface te bouwen. Schema's, lijstscheiding, verwijzingen, unieke IDs, oudercycli en relevante manifesttellingen worden gecontroleerd. Alle 36 geautomatiseerde tests en de bestaande Python-publicatievalidatie zijn geslaagd. Zie [gegevenslaag.md](gegevenslaag.md) voor API, gebruik en beperkingen. Fasen 5 tot en met 10 zijn nog niet uitgevoerd; de technische boomopvragingen zijn onderdeel van deze gegevenslaag en vormen nog geen navigatie-interface.

## Afgeronde browserinterface en boomstructuren — 10 november 2026

Fase 5 is afgerond met een frameworkvrije TypeScript-browserinterface op de bestaande gegevenslaag. De drie selectielijsten zijn afzonderlijk te kiezen en te navigeren, inclusief alle losse voorschriften onder een rubriek in 1996/2012. Uit-/inklappen, actieve selectie, ouder- en broodkruimelnavigatie, toetsenbordbediening en een responsief detailpaneel met officiële waarden, bronlocaties en annotaties zijn gerealiseerd. De statische productiebuild, 37 Node-tests, 21 Chromium-browsertests en bestaande Python-publicatievalidatie zijn geslaagd. Zie [gebruikersinterface.md](gebruikersinterface.md) voor opzet, bediening, controles en beperkingen. De basisdetailweergave uit fase 8 is hiermee gedeeltelijk uitgevoerd; concordans en de overige fases zijn niet uitgevoerd. Er is niets gepubliceerd of samengevoegd met main.

## Afgerond klassiek trefwoordzoeken — 11 november 2026

Fase 6 is afgerond: een afzonderlijke TypeScript-zoekmodule doorzoekt de eigen officiële velden van uitsluitend de gekozen lijst, met Unicode-/accentnormalisatie, EN-combinatie, vaste rangschikking en expliciete opname van vervallen resultaten. Het bestaande browserpaneel heeft een zoekveld, resultaatmarkering, telling en resultaatnavigatie naar boom en details. Algemene procesteksten worden niet aan alle onderliggende resultaten overgeërfd. Productiebuild, 52 Node-tests, 31 Chromium-tests en datasetvalidatie zijn geslaagd. De reproduceerbare nulmeting gebruikt alle 164 ongewijzigde testvragen en maakt de beperkingen van letterlijke praktijkvragen zichtbaar. Zie [trefwoordzoeken.md](trefwoordzoeken.md) en [de nulmeting](trefwoordzoeken-nulmeting.md). Er zijn geen semantische zoeklexicons, AI-relaties, concordans of nieuwe gegevensarchitectuur gebruikt; fase 7 en de overige open vervolgstappen zijn niet uitgevoerd.

## Afgerond lexicongebaseerd begripsgericht zoeken — 11 november 2026

Fase 7 is afgerond voor de daadwerkelijk aanwezige lexiconrelaties: een afzonderlijke TypeScript-zoekmodule, twee herkenbare zoekmodi, lazy laden en valideren van lexicon/relaties per lijst, expliciete toelatingsstatussen, onbevestigde AI standaard uit, gerichte éénstapsrelaties, samengevoegde verklaringen en vaste rangschikking. De oorspronkelijke trefwoordlogica blijft ongewijzigd. Bredere/smallere betekenisrelaties ontbreken in het pakket en zijn niet gereconstrueerd. Productiebuild, 75 Node-tests, 41 Chromium-tests en datasetvalidatie zijn geslaagd. De kwalitatieve A/B/C-vergelijking gebruikt alle 164 ongewijzigde vragen; volwaardige precision/recall/MRR is wegens onvoldoende volledige relevantieoordelen niet berekend. Zie [begripsgericht-zoeken.md](begripsgericht-zoeken.md) en [zoekkwaliteit-nulmeting.md](zoekkwaliteit-nulmeting.md). Concordans, overige open stappen en Sites-integratie zijn niet uitgevoerd.


## Afgeronde zoekkwaliteitscontrole — 11 november 2026

Beide zoekmethoden zijn onderzocht op alle 164 bestaande vragen. De oorspronkelijke klassieke variant blijft bevroren beschikbaar; verbeterde klassieke tekstmatching, toegelaten lexiconverrijking en expliciete AI-opt-in zijn afzonderlijk reproduceerbaar vergeleken. Vraagwoorden, beperkte woordvormen, samenstellingen, context en negaties worden controleerbaar verwerkt. Officiële datasets, relaties en beoordelingsstatussen zijn ongewijzigd. Alle bestaande testverwachtingen zijn behouden.

De aanvullende set bevat 45 vragen (15 per lijst), met alle voorgestelde positieve en negatieve oordelen op **te beoordelen**. Onafhankelijke menselijke beoordeling van de geregistreerde AI-zoekrichtingen is niet aangetoond. Daarom zijn alleen diagnostische uitkomsten gerapporteerd, geen bewezen precision/recall/MRR. Zie [analyse](zoekkwaliteit-analyse.md), [A/B/C/D-vergelijking](zoekkwaliteit-vergelijking.md) en [beoordelingsset](zoekkwaliteit-beoordelingsset.md).

Productiebouw, 87 moduletests, 44 Chromium-browsertests en Python-publicatievalidatie zijn geslaagd. Desktop (1440 px) en mobiel (390 px) zijn visueel gecontroleerd onder een subpad. Een afzonderlijke Chromium-meting van 15 zoekacties in lijst 2020 mat maximaal 175 ms voor B (inclusief koude index), 29 ms voor C en 10 ms voor D (warme caches). Dit meet synchrone zoekactie en DOM-opbouw, geen netwerk of uiteindelijke paint, en is geen garantie voor andere apparaten. De regressiegrens bedraagt 1500 ms per actie. Concordans, Sites-integratie en overige vervolgstappen zijn niet uitgevoerd.
