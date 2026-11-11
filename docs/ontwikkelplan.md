# Ontwikkelplan

Dit plan beschrijft de stapsgewijze ontwikkeling van de Semantische Selectie Tool voor de selectielijsten 1996 (actualisatie 2012), 2017 en 2020. Iedere selectielijst behoudt haar eigen structuur, terminologie en gegevens.

## Huidige publicatieroute

GitHub Pages is vanaf opdracht 10 de beoogde primaire publicatieroute, ter vervanging van ChatGPT Sites. De applicatie blijft volledig statisch en geschikt voor een repositorysubpad. Pages wordt in deze opdracht niet geactiveerd. Eerdere Sites-vermeldingen in de afgeronde stappen hieronder beschrijven de toenmalige scope.

## Oorspronkelijke voorbereidingsstap

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
| 10. Voorbereiding op GitHub Pages | Geschiktheid voor statische hosting onder een subpad op GitHub Pages controleren; publicatie-instructies, beperkingen en resterende bevindingen documenteren. Publicatie gebeurt in een afzonderlijke opdracht. |

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


## Afgeronde detailweergave en kopieerfunctie — 11 november 2026

Het detailgedeelte van fase 8 is aangevuld op basis van een veldinventarisatie. Algemene bepalingen en de volledige rubriekcontext zijn op verzoek leesbaar, inclusief de afzonderlijk gelabelde leesbare paginakopieën. Procestoelichting, herkomst waardering, onderbouwing van procestermijnen, vaststelling en datasetversie zijn ontsloten. Volledige brontermijnen blijven behouden, met expliciet onderscheid tussen bronwaarden, bronlegenda-duiding, ontbrekende waarden en vervallen resultaten. Bronlocaties, documentbrede links, metadata en de elf bestaande bronannotaties blijven controleerbaar zonder rectificatieclaims.

Een toetsenbordbedienbare kopieerfunctie levert beschikbare officiële selectiegegevens met context en bronverwijzingen, met toegankelijke bevestiging/foutmelding. Alle 1.145 kopieerteksten zijn gecontroleerd. Typecheck, productiebuild, 92 moduletests, 55 Chromium-browsertests en Python-publicatievalidatie zijn geslaagd. Desktop en mobiel zijn visueel gecontroleerd onder een subpad. Geen bestaande testverwachtingen, officiële datasets, bronregistraties of zoekalgoritmen gewijzigd. Zie [detailweergave.md](detailweergave.md) voor veldmatrix, presentatieregels, tests en beperkingen. Concordans en Sites-integratie zijn niet uitgevoerd.


## Voorlopige technische concordansmodule zonder oorspronkelijke bron — 11 november 2026

De technische concordansgegevensmodule is gerealiseerd met afzonderlijke oorspronkelijke relaties, technische koppelingen en latere inhoudelijke beoordelingen. Lazy laden, bronrichting, directe record-/structuuropvragingen, meervoudige relaties en expliciete onopgeloste/onzekere verwijzingen zijn beschikbaar. Rubriekrelaties worden niet aan alle afzonderlijke voorschriften toegekend.

De bijlage bevat niet de oorspronkelijke concordans-JSON of Excel. Echte dekking, richtingen en koppelcijfers zijn daarom niet vastgesteld; de tests gebruiken uitsluitend als fictief gelabelde verbindingen. Bron- en publicatievoorbehouden en de concrete vervolgactie voor echte gegevens staan in [concordans-broncontrole.md](concordans-broncontrole.md); de API staat in [concordans-gegevensmodel.md](concordans-gegevensmodel.md). Er zijn geen echte concordansgegevens, werkmap of volledige afgeleide tabel gepubliceerd.

Typecheck, productiebuild, 110 moduletests (18 concordanstests), 55 bestaande Chromium-browsertests en publieke Python-validatie zijn geslaagd. Officiële datasets, zoeklexicons en bestaande interface zijn ongewijzigd. Alleen het technische deel van de concordansfase is afgerond; echte gegevensopname en vergelijkingsinterface zijn niet uitgevoerd. GitHub Pages is de beoogde primaire publicatieroute, maar is niet geactiveerd.


## Correctie opdracht 10: werkelijke concordansbron — 11 november 2026

De aanvullende oorspronkelijke Excel en rij-JSON zijn ontvangen. De Excel-hash is exact gelijk aan de bronregistratie; alle 716 bronrijen met elf oorspronkelijke en elf uitgevouwen cellen zijn tegen de werkmap gecontroleerd. De eerdere fictieve tests blijven uitsluitend geïsoleerde technische tests en gelden niet als dekkingsbewijs.

De zelfstandige rijadapter verwerkt de werkelijke bron, behoudt alle oorspronkelijke cellen en maakt expliciete technische interpretaties met bronrijherleidbaarheid. 612 interpretaties leveren 605 tweezijdig gekoppelde en zeven onopgeloste relaties op (604 unieke gekoppelde paren). Algemene-bepalingenverwijzingen, onvolledige codes, nieuwe 2020-rijen, tekstverschillen en 2017-aantekeningen blijven apart zichtbaar. Er zijn geen 2017-codes uit 2020 afgeleid. Het volledige rapport per rij/relatie is lokaal beschikbaar; zie [broncontrole](concordans-broncontrole.md) en [gegevensmodel](concordans-gegevensmodel.md).

116 moduletests met de daadwerkelijk uitgevoerde echte-brontest, 55 bestaande Chromium-browsertests, productiebuild en publieke datasetvalidatie zijn geslaagd. Officiële datasets, zoeklexicons en interface zijn ongewijzigd. Geen overige bestanden uit het oorspronkelijke eindpakket, Excel of volledige concordansspiegel zijn in de openbare repository opgenomen. Technische verwerking op echte gegevens is uitgevoerd; publieke gegevensdistributie wacht op vastlegging van toepasselijke voorwaarden. Vergelijkingsinterface en Pages-activering zijn niet uitgevoerd.


## Gerichte concordanscontrole 10A — 11 november 2026

Alle vijftien aangeduide afwijkingsgevallen zijn afzonderlijk tegen echte Excelcellen, merges, JSON, bestaande selectiegegevens en primaire bronpagina's onderzocht. De zeven eerder onopgeloste historische interpretaties blijven B-kandidaten zonder automatische activering. Vier historische tekstgevallen zijn technisch bevestigd (A); drie tekstvarianten met mogelijk scopeverschil blijven B. Rij 716 krijgt als vijfde A-geval een afgeschermde technische doelcorrectie naar 2020:19.2.1, los van de ongewijzigde bronwaarde en zonder fictieve historische relatie.

De dekking blijft 612 historische interpretaties met 605 volledig gekoppelde en zeven onopgeloste relaties. De bestaande 605 recordparen zijn met een volledige vingerafdruk op behoud gecontroleerd. De technische uitzonderingsregistratie blijft bij herimport behouden en is via bronrij- of interpretatie-ID raadpleegbaar. Zie [concordans-afwijkingen-beoordeling.md](concordans-afwijkingen-beoordeling.md). Er is geen vergelijkingsinterface of Pages-activering en er zijn geen officiële gegevens of zoeklexicons gewijzigd.

De eindcontrole omvat 122 geslaagde moduletests, 55 geslaagde bestaande Chromium-browsertests, typecheck, productiebuild en publieke datasetvalidatie. De echte-brontests zijn uitgevoerd zonder overslaan; het uitgebreide controlerapport is byte-identiek gereproduceerd.


## Afgeronde concordansinterface en historische vergelijking — 11 november 2026

Het bestaande detailpaneel bevat nu lazy historische relaties en een vergelijking van officiële datasetvelden. Navigatie werkt vanuit 1996/2012 naar 2020 en via de inkomende index terug, met behoud van technische recordselectie, boomlocatie en een terugkeerknop. Meervoudige relaties en dubbele bronrijverklaringen blijven afzonderlijk herleidbaar. De zeven onopgeloste interpretaties, hun B-kandidaten en de aparte correctie 716 zijn zichtbaar in een controleoverzicht zonder beoordelingsfuncties. 2017 krijgt geen afgeleide codemapping; beschrijvende opmerkingen staan los van relaties.

De bestaande concordansmodule en beoordelingsstatussen zijn ongewijzigd. De werkelijke bron is in een lokale browser getest via een expliciet aangezette statische localhost-bestandsalias; de productiebuild neemt de private concordans niet op. Ontbrekende data geven een beperkte foutmelding terwijl officiële details, boom en zoekmodi bruikbaar blijven. De gegevensdistributiegrondslag blijft een afzonderlijke vervolgstap; Pages is niet geactiveerd.

125 moduletests en 67 Chromium-browsertests zijn geslaagd met daadwerkelijk uitgevoerde echte-brontests. Typecheck, productiebuild, bronidentiteit/celcontrole en publieke datasetvalidatie zijn geslaagd. Desktop en mobiel zijn visueel gecontroleerd onder een subpad. De enige bewust gewijzigde oude testverwachting is dat de nu gevraagde lazy interface aanwezig is; inhoudelijke dataset- en zoekverwachtingen zijn behouden. Zie [concordans-interface.md](concordans-interface.md) voor werking, statussen, beperkingen en de reproduceerbare lokale testprocedure.


## Verwerkte beoordelingsbesluiten opdracht 13 — 11 november 2026

Tien expliciete besluiten van de projecteigenaar zijn vastgelegd voor acht probleemgroepen, gescheiden van de ongewijzigde AI-onderzoeksvoorstellen. Rij 21 krijgt een afgeschermde technische doelverwijzing van de behouden bronwaarde `19.1.` naar `2020:19.1`; dezelfde relatie-ID en historische bron blijven behouden. De werkelijke bron levert 612 interpretaties, 606 volledig gekoppelde en zes onopgeloste relaties. De zes historische kandidaatgevallen blijven onopgelost met vastgelegd besluit; 50–52 behouden hun koppeling en zichtbare tekstverschil. Rij 716 blijft intact.

De bestaande concordansinterface toont besluiten, onzekerheden en technische correcties afzonderlijk en biedt de officiële vergelijking voor rij 21. Er zijn geen officiële gegevens, oorspronkelijke concordanscellen, zoeklexicons of AI-onderzoeksvoorstellen gewijzigd en geen oorspronkelijke concordansbestanden gepubliceerd. GitHub Pages is niet geactiveerd. Zie de actuele aanvullingen in het beoordelingsdossier, afwijkingenrapport, broncontrole en interfacedocumentatie.

Eindcontrole: 135 moduletests en 68 Chromium-browsertests met echte lokale bron geslaagd, nul overgeslagen; typecheck, productiebuild, publieke validatie, volledige Excel/JSON-celcontrole en reproduceerbaar koppelrapport geslaagd. De oorspronkelijke 605 koppelingen en oorspronkelijke onderzoeksgegevens zijn via vaste vingerafdrukken behouden. Desktop en mobiel zijn onder een subpad visueel gecontroleerd.


## Technische bronviewer opdracht 14 — 11 november 2026

De statische alleen-lezen viewer voor de oorspronkelijke concordans is gerealiseerd, met 716 rijen/A–K, zoeken, 36 bladerpagina's, rijselectie, detailweergave, subpadgeschikte permalinks en koppelingen met de bestaande concordans-/selectieinterface. Originele lege cellen, werkelijke mergecontext, technische correcties en besluiten blijven onderscheiden. Er is geen nieuwe bronkopie, dependency, backend of architectuur toegevoegd.

De specifieke werkmap is op identiteit/volledigheid en hergebruikdocumentatie onderzocht. Een voldoende onderbouwde grondslag voor integrale publieke weergave en JSON-distributie is niet vastgesteld. Daarom is uitsluitend de viewer met publieke bronvermelding gebouwd; de brondata blijven buiten Git en productie-uitvoer. Integrale publieke beschikbaarheid is niet afgerond en GitHub Pages is niet geactiveerd. Zie [viewer](concordans-viewer.md) en [hergebruikafweging](concordans-hergebruik.md).

Eindcontrole opdracht 14: 139 moduletests en 76 Chromium-browsertests met de echte lokale bron, nul overgeslagen, productiebuild, typecheck, publieke validatie en volledige Excel/JSON-celcontrole geslaagd. Alle 716 rijen zijn via de bladerinterface gecontroleerd. Desktop/mobiel en een gewone productiebuild zonder bronalias zijn daadwerkelijk geraadpleegd. Publieke data-opname blijft niet afgerond wegens de gedocumenteerde hergebruikblokkade.


## Doorlopende concordansviewer en Excel — opdracht 15

De paginering is verwijderd. Alle 716 rijen worden als één doorlopende tabel getoond met vaste koppen, vaste bronrijnummers, automatische rijscroll en herkenbare selectie. Zoeken en detail-/voorschriftlinks blijven behouden. Een browserexport maakt op aanvraag `Concordans 1996-2020.xlsx` met de twee voorgeschreven werkbladen, ongewijzigde A–K, aanvullende mergecontext L–V en bronrij W. Een actief filter beperkt de download niet. De lichte MIT-schrijver wordt apart geladen; er is geen tweede bronbestand of Excel-dataset.

De celinhoud is op concrete persoonsgegevens gecontroleerd: geen aangetroffen; geen rijen of kolommen verwijderd. Oorspronkelijke makermetadata worden niet geëxporteerd. De juridische distributieblokkade blijft bestaan en GitHub Pages is niet geactiveerd. Zie de bijgewerkte viewer-, interface- en hergebruikdocumentatie. Publieke gegevensopname is niet als afgerond geregistreerd.

Validatie opdracht 15: volledige broncontrole en publieke datasetvalidatie, productiebuild en typecheck; regressieset van 142 moduletests en 77 Chromium-browsertests met echte bron. Onafhankelijke XLSX-teruglezing controleert alle broncellen/context en de daadwerkelijke browserdownload. Desktop/mobiel zijn visueel beoordeeld; lokale responstijden zijn vastgelegd in de viewerdocumentatie. Bestaande koppeldekking 612/606/6 en alle tien besluiten blijven behouden. Geen openbare data-opname of Pages-activering.


## Selectielijsten raadplegen en downloaden — opdracht 16

Drie doorlopende tabellen op basis van de bestaande gevalideerde datasets zijn gerealiseerd, met 494 / 305 / 346 afzonderlijke voorschriften in bronvolgorde. Datasetkeuze, eenvoudige tabelmatching, exacte codefilters, detail-/teruglinks en sessiecontext zijn toegevoegd binnen de bestaande applicatie. Brongetrouwe browserexports met de voorgeschreven drie bestandsnamen en twee werkbladen gebruiken de gedeelde XLSX-schrijver en bestaande contextcache. Uitgebreide officiële gegevens, annotaties, statussen en algemene/rubriekvoorwaarden blijven beschikbaar.

Er zijn geen nieuwe dependencies, backend, gegevenskopieën of wijzigingen in officiële datasets/zoeklexicons/concordansbesluiten. De bestaande publicatiebeoordeling voor officiële tekst is toegepast zonder uitgesloten bronbestanden toe te voegen. Concordansdistributie blijft afzonderlijk geblokkeerd en GitHub Pages is niet geactiveerd. Zie [documentatie](selectielijsten-raadplegen.md).

Eindcontrole opdracht 16: 149 moduletests en 84 Chromium-browsertests met alle bestaande echte-bronregressies geslaagd, nul overgeslagen. Alle zeven nieuwe browsertests zijn bovendien zonder privéconcordansbron geslaagd. Productiebuild, typecheck en publieke datasetvalidatie zijn geslaagd. De drie werkelijke downloads zijn onafhankelijk teruggelezen; desktop/mobiel en het repositorysubpad zijn visueel gecontroleerd. Bronbestanden en beoordelingsbesluiten zijn ongewijzigd.
