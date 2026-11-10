# AGENTS.md — Semantische Selectie Tool

## Projectdoel

Deze repository bevat de ontwikkeling van de Semantische Selectie Tool: een browsergebaseerde applicatie waarmee informatieprofessionals gemeentelijke archiefselectielijsten kunnen raadplegen en doorzoeken.

De applicatie ondersteunt drie selectielijsten:

- 1996, actualisatie 2012.
- 2017.
- 2020.

De applicatie ondersteunt het vinden van relevante selectievoorschriften, maar neemt geen zelfstandig juridisch of archivistisch selectiebesluit.

## Algemene ontwikkelinstructies

1. Lees de README en relevante projectdocumentatie voordat je wijzigingen uitvoert.
2. Voer uitsluitend de gevraagde ontwikkelstap uit.
3. Kies eenvoudige, onderhoudbare en stabiele oplossingen.
4. Introduceer geen onnodige frameworks, dependencies of architectuurlagen.
5. Behoud bestaande functionaliteit tenzij expliciet om wijziging wordt gevraagd.
6. Documenteer relevante technische keuzes en beperkingen.
7. Controleer wijzigingen voordat je ze oplevert.
8. Rapporteer duidelijk welke controles wel en niet zijn uitgevoerd.

## Technische randvoorwaarden

- De applicatie functioneert volledig in de browser.
- Geen eigen backend of serverdatabase.
- Geen verplichte externe API, AI-dienst of API-sleutel.
- Python mag worden gebruikt voor voorbereiding, validatie en generatie van datasets, maar niet tijdens het gebruik van de applicatie.
- ChatGPT Sites is de beoogde omgeving voor verdere ontwikkeling en publicatie.
- De implementatie moet geschikt blijven voor een statische browseromgeving.

## Brongetrouwheid

De officieel vastgestelde selectielijsten zijn leidend.

- Wijzig officiële selectiecodes, omschrijvingen, waarderingen of bewaartermijnen niet zonder expliciete opdracht en controleerbare brongrondslag.
- Behoud de oorspronkelijke structuur van iedere selectielijst.
- Houd de selectielijsten inhoudelijk en technisch gescheiden.
- Presenteer technische identificaties niet als officiële selectiecodes.
- Behoud beschikbare bronverwijzingen, annotaties en onzekerheden.
- Verzin geen ontbrekende brongegevens.
- Vul lege of onvolledige bronvelden niet zelfstandig in.
- Reduceer samengestelde of voorwaardelijke bewaartermijnen niet tot één getal.
- Bereken geen vernietigingsdatums tenzij dit later uitdrukkelijk wordt opgedragen.

## Semantische zoekfunctionaliteit

De semantische zoekrelaties zijn met behulp van AI opgesteld en kunnen onbevestigde aannames bevatten.

- Houd officiële brongegevens en aanvullende zoekverrijking gescheiden.
- Beschouw AI-gegenereerde relaties niet als officiële selectievoorschriften.
- Neem onbevestigde AI-zoekvoorstellen standaard niet op in actieve zoekresultaten.
- Maak herkomst en status van zoekrelaties inzichtelijk.
- Gebruik betekenisverwantschap uitsluitend als hulpmiddel voor vindbaarheid.
- Presenteer een gevonden categorie niet automatisch als toepasselijk.
- Vermeng zoekresultaten uit verschillende selectielijsten niet zonder expliciete gebruikershandeling.

## Betrouwbaarheid en testen

- Controleer gegevensstructuren met de beschikbare JSON-schema's.
- Controleer waar mogelijk technische verwijzingen en unieke identificaties.
- Gebruik bestaande testvragen zonder verwachte uitkomsten kunstmatig aan te passen.
- Houd technische validatie en inhoudelijke broncontrole gescheiden.
- Verberg geen fouten met standaardwaarden die niet uit de bron volgen.
- Rapporteer afwijkingen en onopgeloste problemen expliciet.

## Openbare repository

Deze repository is openbaar.

- Voeg geen persoonsgegevens, vertrouwelijke documenten of geheimen toe.
- Neem geen API-sleutels, tokens of wachtwoorden op.
- Controleer hergebruikvoorwaarden voordat externe bronbestanden worden gepubliceerd.
- Behoud bron- en auteursrechtvermeldingen.
- Leg vast wanneer inhoud door AI is gegenereerd of verrijkt.

## Werkwijze met GitHub

- Werk bij inhoudelijke wijzigingen op een afzonderlijke branch.
- Houd wijzigingen beperkt tot de actuele opdracht.
- Gebruik beschrijvende commitberichten.
- Lever wijzigingen bij voorkeur via een pull request ter beoordeling aan.
- Voeg pull requests niet zelfstandig samen met `main`.
- Wijzig geen bestanden buiten de opdracht zonder dit expliciet te melden.
- Verwijder geen bestaande datasets of documentatie zonder opdracht.

## Oplevering

Rapporteer na iedere opdracht:

1. Wat is uitgevoerd.
2. Welke bestanden zijn aangemaakt of gewijzigd.
3. Welke controles zijn uitgevoerd en wat de resultaten zijn.
4. Welke beperkingen of problemen resteren.
5. Of de opdracht gereed is voor beoordeling.

Stop na afronding van de gevraagde ontwikkelstap. Begin niet zelfstandig aan een volgende fase.
