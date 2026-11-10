# Semantische Selectie Tool

Een browsergebaseerde webapplicatie voor het raadplegen en doorzoeken van gemeentelijke archiefselectielijsten.

## Doel

De Semantische Selectie Tool ondersteunt informatieprofessionals bij het vinden, raadplegen en vergelijken van gemeentelijke selectievoorschriften.

De applicatie is geïnspireerd op de VNG SelectTool en voegt uitgebreide zoekmogelijkheden toe, waaronder begripsgericht zoeken met behulp van **door AI gegenereerde semantische zoekrelaties**.

De applicatie ondersteunt het vinden van mogelijk relevante selectievoorschriften, maar neemt geen zelfstandig juridisch of archivistisch selectiebesluit.

## Ondersteunde selectielijsten

- Selectielijst 1996, actualisatie 2012.
- Selectielijst 2017.
- Selectielijst 2020.

Iedere selectielijst behoudt haar eigen hiërarchische structuur, terminologie en selectiegegevens.

## Beoogde functionaliteit

- Raadplegen van iedere selectielijst via een eigen boomstructuur.
- Zoeken op officiële codes, trefwoorden en omschrijvingen.
- Afzonderlijk begripsgericht zoeken met semantische zoeklexicons.
- Bekijken van selectiegegevens, waarderingen en bewaartermijnen.
- Raadplegen van toelichtingen, voorwaarden en bronverwijzingen.
- Inzichtelijk maken van concordansrelaties tussen selectielijsten.
- Kopiëren van selectiegegevens voor gebruik in andere toepassingen.

## Semantische zoekrelaties en AI

De semantische zoeklexicons zijn tot stand gekomen met behulp van AI-ondersteund onderzoek naar de drie gemeentelijke selectielijsten en aanvullende documentatie.

Daarbij zijn onder meer synoniemen, afkortingen, historische benamingen, verwante begrippen en gangbare praktijkformuleringen geïdentificeerd en aan selectievoorschriften gekoppeld.

**Deze semantische relaties zijn onderzoeksresultaten die met behulp van AI zijn opgesteld. Zij maken geen deel uit van de officieel vastgestelde selectielijsten en zijn niet zonder meer inhoudelijk gevalideerd.**

De datasets maken waar mogelijk onderscheid tussen officiële terminologie, brononderbouwde alternatieve benamingen en door AI voorgestelde zoekverrijkingen.

Semantische relaties worden uitsluitend gebruikt om mogelijk relevante selectievoorschriften beter vindbaar te maken. Een betekenisovereenkomst vormt geen bewijs dat een selectievoorschrift daadwerkelijk van toepassing is.

Onbevestigde AI-voorstellen worden standaard niet meegenomen in zoekresultaten, tenzij de gebruiker deze mogelijkheid expliciet inschakelt.

## Technische uitgangspunten

- De applicatie functioneert volledig in de browser.
- Geen eigen backend of serverdatabase.
- Geen verplichte externe API, AI-dienst of API-sleutel.
- De officiële selectielijsten vormen de gezaghebbende gegevensbron.
- Officiële selectiegegevens en aanvullende zoekverrijking blijven gescheiden.
- GitHub wordt gebruikt voor bronbeheer, versiebeheer en ontwikkeling met Codex.
- ChatGPT Sites is de beoogde omgeving voor verdere ontwikkeling en publicatie.

## Ontwikkelaanpak

Het project wordt stapsgewijs ontwikkeld.

1. Repository inrichten en datasetpakket opnemen.
2. Gegevensbestanden en bronverwijzingen valideren.
3. Statische gegevenslaag ontwikkelen.
4. Navigatie en boomstructuren implementeren.
5. Trefwoordzoekfunctie ontwikkelen.
6. Begripsgerichte zoekfunctie ontwikkelen.
7. Detailweergave en concordans toevoegen.
8. Testen en voorbereiden op ChatGPT Sites.

## Projectstatus

**In voorbereiding.**

Het datasetpakket voor de drie gemeentelijke selectielijsten is beschikbaar. De webapplicatie is nog niet gebouwd.

De eerste ontwikkelfase richt zich op het onder versiebeheer brengen, controleren en technisch ontsluiten van de gegevens.

## Betrouwbaarheid en verantwoordelijkheid

De officiële selectielijsten en hun toepasselijke bepalingen blijven leidend bij archiefselectie.

De applicatie is een hulpmiddel voor het raadplegen en vinden van selectievoorschriften. Zoekresultaten, waaronder resultaten op basis van AI-gegenereerde semantische relaties, vormen geen zelfstandig juridisch of archivistisch advies.

De gebruiker blijft verantwoordelijk voor het beoordelen van de toepasselijkheid van een selectievoorschrift en het correct toepassen van de bijbehorende voorwaarden en bewaartermijnen.

Onzekerheden, ontbrekende gegevens en bekende bronafwijkingen worden waar mogelijk herkenbaar weergegeven.