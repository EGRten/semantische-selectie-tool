# Concordans: controle van de werkelijke bron

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

### Actuele herleiding en reproductie

De oorspronkelijke Excel en JSON zijn uitsluitend lokaal gebruikt; hun identiteiten en alle oorspronkelijke cellen blijven ongewijzigd. Er worden geen oorspronkelijke concordansbestanden of volledige afgeleide rapporten gepubliceerd. `scripts/onderzoek-concordans.mjs` neemt de afzonderlijke besluiten in het lokale controlerapport op en rapporteert de vier besluituitkomsten apart. De oudere tabellen hieronder leggen de uitgangsmeting vast; voor de actuele telling geldt de bovenstaande vóór/na-tabel.

Reproduceer met `CONCORDANS_BRON_JSON` naar de lokale oorspronkelijke JSON en `node scripts/onderzoek-concordans.mjs --bron "$CONCORDANS_BRON_JSON" --output /tmp/concordans-controle`. De gegenereerde `koppelingen.json` bevat de bronrijen, oorspronkelijke interpretaties, technische koppelingen, onderzoeksregistratie en actuele besluiten. Dezelfde bron geeft byte-identieke uitvoer. De in de bestaande lokale testprocedure beschreven Excelcontrole blijft van toepassing.

### Validatie van de besluitverwerking

Op 11 november 2026 zijn **135 moduletests en 68 Chromium-browsertests geslaagd, zonder overgeslagen tests**. Uitgevoerd: `CONCORDANS_BRON_JSON=/tmp/concordans-12/concordans.json CHROMIUM_PATH=/usr/bin/chromium npm test`, `npm run typecheck`, `python scripts/valideer_publicatie.py` en de bestaande Excel/JSON-broncontrole. Productiebuild, bronidentiteit, alle 7.876 oorspronkelijke en 7.876 uitgevouwen cellen en het byte-identiek herhaalde koppelrapport zijn geslaagd. De echte bron blijft lokaal; een andere lokale bestandslocatie kan via dezelfde omgevingsvariabele worden gebruikt.

Nieuwe regressies controleren alle tien besluiten/acht groepen, behoud van het volledige oorspronkelijke onderzoeksregister via een vaste SHA-256, 612/606/6, behoud van de oorspronkelijke 605 recordparen, broncellen, kandidaten, 50–52 en 716, gewijzigde bron-/doelcontext, ongeautoriseerde correctie-ID’s en uitsluitend de compacte besluitprojectie in de productie-uitvoer. De browser controleert rij 21 in beide richtingen, officiële vergelijking, zes open relaties, ontbrekend bestand en bestaande zoek-, boom- en detailfunctionaliteit. Desktop en mobiel zijn aanvullend visueel gecontroleerd onder `/controle/`, zonder JavaScript-fouten of horizontale overloop.

Bewust gewijzigde oude testverwachtingen: rij 21 is nu gekoppeld op expliciet besluit; rapport- en overzichtstellingen veranderen daarom van 605/7 naar 606/6. De interface verwacht de vastgelegde besluitstatus en de build mag de compacte besluitlaag projecteren. De oorspronkelijke onderzoeksvoorstellen, B-kandidaten, officiële bronverwachtingen, zoekverwachtingen en volledige 605-parenvingerafdruk zijn behouden. Dit zijn geen aanpassingen om fouten te verhullen.

## Historische uitgangsrapportage (behouden)

## Stand na gerichte controle 10A

De vijftien afwijkingsgevallen zijn afzonderlijk onderzocht in [concordans-afwijkingen-beoordeling.md](concordans-afwijkingen-beoordeling.md). De historische dekking blijft 612 interpretaties, 605 tweezijdig gekoppeld en zeven onopgelost. De zeven onopgeloste gevallen krijgen expliciete B-kandidaten; er is niet op buurcellen of een hoger structuurniveau gegokt. Vijf van de vijftien gevallen zijn technisch A en tien vragen inhoudelijke beoordeling (B).

Rij 716 heeft nu een afzonderlijk geregistreerde technische doelcorrectie naar `2020:19.2.1`, met behoud van broncode `19.21.1`. Dit blijft een nieuwe-2020-rij zonder historische relatie. Over alle 625 doelverwijzingen zijn nu 623 rechtstreeks gekoppeld, één technisch gecorrigeerd en één onopgelost. Het volledige actuele rapport staat lokaal in `/tmp/concordans-10a/koppelingen.json`; de hieronder beschreven eerste meting is de uitgangsmeting van opdracht 10.

## Correctie van de voorlopige rapportage

De aanvankelijke publicatie-ZIP bevatte geen concordans. Die constatering was voorlopig, geen volledige concordansintegratie. De nieuw aangeleverde bijlage `gemeentelijke-selectielijsten-eindpakket(2).zip` bevat wél de oorspronkelijke Excel en de eerder vervaardigde rij-JSON. Deze correctie is uitgevoerd vanaf `62f8269` (samengevoegde PR #9). Fictieve relaties zijn uitsluitend geïsoleerde technische tests; onderstaande bevindingen komen uit de werkelijke bron.

Alle ZIP-entries zijn op integriteit gecontroleerd: geen fout. Alleen de twee concordansbestanden en het reeds bekende concordans-afwijkingenregister zijn lokaal uitgelezen. Geen andere oorspronkelijke pakketbestanden zijn opnieuw geïmporteerd. De openbare officiële datasets, bestaande bronregistraties en lexicons zijn ongewijzigd.

| Controle | Resultaat |
| --- | --- |
| Excel SHA-256 | `7dfda792ce61c1a6fa28c5c116155a429560153178c6c58987eabbbe6cdf708c` — exact gelijk aan de opgegeven bronregistratie |
| Rij-JSON SHA-256 | `b01cff07c7bfeeb6f562d467373615f5a18cfc7ab9777f11fcd5cb1ed7de73dd` |
| Werkblad | Eén: Blad1 |
| Inhoud | 716 niet-lege gegevensrijen, Excelrijen 3–718; twee koprijen en een lege slotrij |
| Kolommen | A:K, elf kolommen |
| Samengevoegde bereiken | 550 |
| Oorspronkelijke cellen | Alle 7.876 waarden gelijk tussen Excel en JSON, inclusief lege waarden |
| Uitgevouwen cellen | Alle 7.876 waarden gelijk na het volgen van uitsluitend de echte samengevoegde Excelbereiken |
| Volledigheid | JSON is een volledige spiegel van de niet-lege gegevensrijen van deze werkmap; geen claim van volledige historische dekking |

De controle gebruikt `scripts/controleer-concordansbron.py` met uitsluitend Python-standaardbibliotheken. Een afwijkende Excel-hash, ontbrekende rij of gewijzigde cel laat deze controle falen. Er zijn geen broncellen gerepareerd. De machineleesbare code-inventaris in de JSON is behouden, maar vormt geen zelfstandig bewijs dat ieder genoemd nummer een resultaatcode is.

## Feitelijke versies en bronrichting

A:D beschrijven de selectielijst vanaf 1996; de technische aansluiting wordt getoetst aan de bestaande dataset 1996/2012. E:I beschrijven de selectielijst 2020. J:K zijn aantekeningen over 2017: omschrijving en waardering, **geen expliciete 2017-codes**. De koppen bewijzen geen afzonderlijke volledige vergelijking 2017↔2020 of 1996↔2017.

De technische bronrichting is de linkerkant (1996) naar de expliciet genoemde 2020-resultaten. Inkomend opzoeken is een indexweergave van dezelfde relatie, geen door de bron vastgestelde omgekeerde opvolgingsrelatie. Er is geen juridische gelijkwaardigheid, vervanging of automatische toepasselijkheid afgeleid.

## Aansluiting op bestaande datasets

De 494 bestaande selectievoorschriften van 1996/2012 bevatten ieder een unieke aanvullende bronverwijzing naar een rij van deze concordans. Alle 494 aangewezen rijen bestaan. Voor 133 verdere rijen zijn de werkelijk uitgevouwen cellen A:D exact identiek aan zo'n aangewezen rij. Daardoor is hun historische technische record traceerbaar, zonder ongedocumenteerd doorvullen van lege cellen of afleiden van technische suffixen uit subletters.

| Historische aansluiting per bronrij | Aantal |
| --- | ---: |
| Rechtstreekse bestaande dataset-rijreferentie | 494 |
| Exact identieke uitgevouwen A:D-cellen | 133 |
| Niet gekoppeld, waaronder koppen/context | 76 |
| Expliciet ‘Nieuw in Selectielijst 2020’, geen historische regel | 13 |
| Totaal | 716 |

Van de 627 technisch herkende historische rijen hebben 620 een letterlijk identieke omschrijving, vijf een afwijkende omschrijving en twee een lege concordansomschrijving. Deze zeven rijen zijn afzonderlijk gemarkeerd; de technische rij-identiteit betekent geen inhoudelijke gelijkwaardigheid. Alle 627 termijncellen komen letterlijk overeen met de gekoppelde dataset. De officiële teksten worden nooit aan de concordans aangepast.

| Verwijzingsvorm in de 2020-kolommen | Rijen |
| --- | ---: |
| Expliciete code of slashgescheiden codes in F | 578 |
| Expliciet tekstbereik ‘t/m’ | 6 |
| Algemene bepaling/paragraaf, geen resultaatcode | 21 |
| Onvolledige code zonder reparatie | 1 |
| Overige tekstuele verwijzing, te beoordelen | 43 |
| Geen resultaatcode | 67 |

De zes uitgeschreven bereiken worden begrensd over dezelfde codeprefix uitgewerkt; voorwaarden en tekst blijven ongewijzigd. ‘Bewaren onder paragraaf 1.3’ wordt niet gekoppeld aan resultaat 2020:1.3 (‘Opgeheven’). De algemene bepalingen bevatten immers een paragraaf 1.3 over beginselen voor bewaring en vernietiging. Ook een voorbeeld zoals ‘zoals 5.1’ krijgt geen bindende resultaatkoppeling. Deze beperkingen voorkomen aantoonbare nummerverwarring; de bron-JSON zelf is niet gewijzigd.

## Resultaten op werkelijke relaties

| Technisch resultaat | Aantal |
| --- | ---: |
| Relatie-interpretaties 1996→2020 | 612 |
| Aan beide kanten gekoppeld | 605 |
| Minstens één eindpunt onopgelost | 7 |
| Historisch eindpunt gekoppeld / ontbreekt | 606 / 6 |
| 2020-eindpunt gekoppeld / ontbreekt binnen interpretaties | 611 / 1 |
| Unieke gekoppelde technische recordparen | 604 |
| Historische records met één / meerdere doelen | 353 / 83 |
| Doelrecords met één / meerdere historische bronnen | 106 / 109 |
| Interpretaties met onopgelost eindpunt of expliciete brononzekerheid | 13 |

605 gekoppelde broninterpretaties omvatten 604 unieke paren: een herhaald paar blijft als twee afzonderlijke bronrijverklaringen behouden. 436 historische records en 215 2020-records hebben minstens één volledig gekoppelde relatie. Dit is technische dekking, geen maat voor inhoudelijke juistheid of volledigheid. Een rij met uitsluitend een algemene voorwaarde wordt niet tot een fictieve recordrelatie gemaakt.

De zeven onopgeloste interpretaties zijn exact:

| Bronrij-ID | Probleem | Letterlijk genoemd doel |
| --- | --- | --- |
| concordans:rij:6 | Geen expliciete of samengevoegde historische voorschriftcontext | 9.1.1 |
| concordans:rij:21 | Onvolledige doelcode; geen reparatie naar 19.1 | 19.1. |
| concordans:rij:89 | Historisch voorschrift niet uniek vastgesteld | 11.1 |
| concordans:rij:90 | Historisch voorschrift niet uniek vastgesteld | 3.1 |
| concordans:rij:293 | Historisch voorschrift niet uniek vastgesteld | 9.3.3 |
| concordans:rij:434 | Historisch voorschrift niet uniek vastgesteld | 7.1.23 |
| concordans:rij:442 | Historisch voorschrift niet uniek vastgesteld | 7.1.24 |

Daarnaast bevat rij 716 de ongeldige doelcode `19.21.1`. Deze rij staat onder ‘Nieuw in Selectielijst 2020’: er is daarom geen historische relatie aangemaakt. De afzonderlijke rijrapportage houdt het ontbrekende doel wel vast. Het bestaande afwijkingenregister noemt een voorstel `19.2.1`; in de oorspronkelijke meting werd dit niet toegepast; controle 10A registreert nu de hierboven beschreven afgeschermde technische doelcorrectie. Over alle 625 uitgewerkte doelverwijzingen, inclusief de nieuwe 2020-rijen zonder historisch voorschrift, zijn 623 codes technisch gekoppeld en twee niet (rijen 21 en 716).

## 2017: context, geen verzonnen codemapping

673 rijen hebben geen J/K-aantekening, 27 benoemen expliciet afwezigheid in 2017, dertien hebben een beschrijvende aantekening zonder code en drie alleen een waardering. Bij zes van de dertien beschrijvingen bestaat een unieke letterlijke tekstmatch met een 2017-record. Deze blijven **kandidaten voor inhoudelijke beoordeling**, geen vastgestelde 2017-concordansrelaties. Er is niet via gelijkgenummerde 2020-codes uitgebreid. Het volledige bronmateriaal en alle opmerkingen blijven in de runtime-bronrijen beschikbaar.

## Exact rapport en reproduceerbaarheid

De volledige technische rapportage per bronrij én per relatie staat lokaal in `/tmp/concordans-controle/koppelingen.json`. Zij vermeldt alle bronrij-ID's, gekoppelde technische IDs, kandidaat-IDs, statussen, oorspronkelijke doelteksten, onzekerheden en de volledige lijst onopgeloste interpretaties. `/tmp/concordans-controle/broncontrole.json` legt de Excel-/JSON-identiteit en celcontrole vast; `samenvatting.json` bevat de tellingen. De volledige afgeleide koppelingen blijven buiten de publieke commit.

```sh
npm run build
python scripts/controleer-concordansbron.py \
  --excel '/pad/Concordans Selectielijst 1996-2020(1).xlsx' \
  --json /pad/concordans.json --output /tmp/concordans-controle/broncontrole.json
node scripts/onderzoek-concordans.mjs \
  --bron /pad/concordans.json --output /tmp/concordans-controle
CONCORDANS_BRON_JSON=/pad/concordans.json CHROMIUM_PATH=/usr/bin/chromium npm test
```

De scripts weigeren rapportuitvoer naar publieke projectpaden; `.private-inputs/` is de bestaande uitgesloten lokale uitzondering. Ze pakken geen ZIP uit en importeren geen andere pakketbestanden. Voor reproduceerbaarheid zijn de twee rechtmatig verkregen bronbestanden vereist. Zonder lokale bron slaat alleen de herkenbaar gemarkeerde werkelijke-brontest over; fictieve tests gelden dan niet als vervangende dekking. In deze uitvoering is de werkelijke-brontest daadwerkelijk uitgevoerd en geslaagd.

## Herkomst en publieke distributie

Het initiatief is onafhankelijk, publiek toegankelijk, niet-commercieel en zonder winstoogmerk. Functioneel hergebruik blijft het ontwerpuitgangspunt. De nieuwe bronaanlevering en hashmatch bewijzen bestandsidentiteit, **geen nieuwe herpublicatietoestemming**. De aangeleverde werkmap bevat geen aangetoonde bestandsbrede licentie; de eerder gepubliceerde rechtenafbakening blijft gelden.

De bestaande broncontext verwijst naar [VHIC](https://www.vhic.nl/faq/selectielijsten-2017-en-2020/). Dit is geen bewezen directe downloadlocatie of bewijs dat VHIC alle rechten op deze exacte werkmap bezit. De precieze oorspronkelijke publicerende organisatie/rechthebbenden blijven in de bronmetadata onzeker; zij worden niet ingevuld op basis van software-eigenschappen of aannames.

Excel, oorspronkelijke concordans-JSON, volledige technische koppeltabel en overige bestanden uit het eindpakket zijn niet in Git opgenomen. De browsermodule kan de **werkelijke** oorspronkelijke rij-JSON zelfstandig laden zodra deze onder een vastgestelde distributiegrondslag als statisch bestand beschikbaar wordt gesteld. Nog nodig voor publieke data-opname: leg de toepasselijke voorwaarden/grondslag en naamsvermelding voor dit bestand en de afgeleide tabel concreet vast en voeg die data daarna afzonderlijk ter beoordeling toe. Geen bronpublicatie of GitHub Pages geactiveerd.

De technische verwerking op de echte bron is nu uitgevoerd. Publieke data-distributie, een concordansinterface en inhoudelijke oplossing van de resterende verwijzingen zijn niet afgerond.

## Eindcontrole bronviewer opdracht 14

Op 11 november 2026 is dezelfde bronidentiteit opnieuw bevestigd. De bestaande controle vergelijkt alle 7.876 oorspronkelijke en 7.876 uitgevouwen cellen met Excel, inclusief de 550 werkelijke samengevoegde bereiken: geslaagd. 139 moduletests en 76 Chromium-browsertests met de echte lokale bron, nul overgeslagen, productiebuild, typecheck en publieke datasetvalidatie zijn geslaagd. Alle 716 rijen zijn in de bladerinterface bereikt. Het register, oorspronkelijke cellen en bestaande koppelingen blijven intact. Zie [viewercontrole](concordans-viewer.md#uitgevoerde-eindcontrole--11-november-2026). De publieke build bevat uitsluitend de viewer en bronvermelding, geen brondata; de hergebruikgrondslag is onvoldoende vastgesteld.
