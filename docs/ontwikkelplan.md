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
