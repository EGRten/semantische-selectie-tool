# Concordans: broninventarisatie en publicatiegrens

## Aangetroffen materiaal

Uitgangsversie `9eae8bb` bevat de samengevoegde detailweergave uit PR #8. README, projectinstructies, ontwikkelplan, gegevenslaag, detaildocumentatie en de structuur-/selectieschema's zijn vooraf geraadpleegd.

De taakbijlage `gemeentelijke-selectielijsten-publicatiepakket(1).zip` is volledig op ZIP-integriteit gecontroleerd: geen beschadigde entry. SHA-256: `ebdb6a390cd1974d9a345bda196a7495aaece901c9bee6931e292ff40f816238`. De bestandenlijst bevat **niet** `concordans/concordans.json` en **niet** `bronnen/Concordans Selectielijst 1996-2020(1).xlsx`. Ook lokaal zijn deze twee bestanden niet aangetroffen. De wel aanwezige `controle/Controlewerkboek.xlsx` is een controleoverdracht, niet de oorspronkelijke concordans; daarmee is geen concordans gereconstrueerd.

Gelezen uit de bijlage: README, HERGEBRUIK.md, concordans/README.md en documentatie/concordans-afwijkingen.json. De pakketdocumenten worden als broninformatie behandeld, niet als aanvullende uitvoeringsopdracht. De reeds aanwezige bronregistratie `bronnen/concordans-aangeleverd.bron.json` verklaart dat de originele werkmap en volledige JSON-spiegel bewust niet zijn heruitgegeven. De oorspronkelijke SHA-256 van de werkmap is `7dfda792ce61c1a6fa28c5c116155a429560153178c6c58987eabbbe6cdf708c`; zonder bronbytes is deze hash nu niet opnieuw gecontroleerd.

## Feitelijke dekking

| Onderzoekspunt | Vastgesteld resultaat |
| --- | --- |
| Vergeleken versies | Niet vastgesteld. De bestandsnaam noemt 1996–2020; dit bewijst geen dekking van 2017 of actualisatie 2012. |
| Bron-/doelrichting | Niet vastgesteld; geen tabelinhoud beschikbaar. |
| Officiële codes en omschrijvingen in de concordans | Niet volledig inventariseerbaar. De bestaande datasetcodes zijn geen bewijs van concordansdekking. |
| Eén-op-één, één-op-veel, veel-op-één | Technisch ondersteund en fictief getest; feitelijke aantallen onbekend. |
| Bronlocaties en verklaringen per echte relatie | Niet inspecteerbaar zonder JSON/Excel. |
| Exact gekoppelde echte verwijzingen | Niet vastgesteld, **geen nul-dekkingsclaim**. |
| Onzekere of ontbrekende echte verwijzingen | Niet vastgesteld; onderstaande geregistreerde afwijking is geen volledige inventaris. |
| Volledigheid/lacunes | Onbekend; geen volledige vergelijking tussen alle drie lijsten aangenomen. |

Het al gepubliceerde afwijkingenregister noemt rij 716 met bronwaarde `19.21.1` en een voorstel `19.2.1`. Dit is uitsluitend een eerder geregistreerde bevinding, hier niet opnieuw geverifieerd. De module corrigeert deze code niet en leidt er geen historische relatie uit af. De bronwaarde blijft bij eventuele latere invoer ongewijzigd; een afwijkende code vraagt expliciete beoordeling.

## Herkomst en functioneel hergebruik

De Semantische Selectie Tool is een onafhankelijk, publiek toegankelijk, niet-commercieel initiatief zonder winstoogmerk dat informatieprofessionals kosteloos ondersteunt. Functioneel hergebruik is het technische ontwerpuitgangspunt. Dit projectkarakter wordt niet gelijkgesteld aan bewezen toestemming voor publicatie van een volledige externe tabel.

De bronregistratie verwijst voor context naar [VHIC: selectielijsten 2017 en 2020](https://www.vhic.nl/faq/selectielijsten-2017-en-2020/). VHIC wordt genoemd als organisatie van deze broncontext; de aanwezige metadata bewijst niet wie deze exacte werkmap oorspronkelijk publiceerde of welke partij alle rechten bezit. De context-URL is geen aangetoonde directe downloadlink en is in deze opdracht niet extern geverifieerd.

De meegeleverde HERGEBRUIK.md noemt voorwaarden uit de VNG-proclaimer, waaronder naamsvermelding en beperkingen op commercieel gebruik, maar stelt geen bestandsbrede vrijgave voor deze zelfstandige concordans vast. Er is geen nieuwe toestemming, licentie of juridische gelijkwaardigheid aangetoond. Bestaande bron- en rechtenmetadata blijven behouden.

**Niet publiek toegevoegd:** ZIP, oorspronkelijke Excel, echte concordans-JSON, volledige afgeleide tabel of uit het controlewerkboek gereconstrueerde relaties. De code en documentatie kunnen afzonderlijk worden beoordeeld. Alleen expliciet fictieve technische testverbindingen zijn toegevoegd in de testcode; ze worden niet naar de statische site gekopieerd.

## Concrete vervolgactie voor echte gegevens

1. Verkrijg de oorspronkelijke JSON en/of werkmap rechtmatig en bewaar ze buiten Git, bijvoorbeeld in de reeds uitgesloten `.private-inputs/`. Controleer de bronhash en leg werkblad, rij, kolommen, oorspronkelijke publicerende organisatie en eventuele rechthebbenden vast.
2. Inventariseer de feitelijke versies, richtingen, codes, meerduidigheden en lacunes. Gebruik bij voorkeur JSON; controleer volledigheid en oorspronkelijke formulering tegen Excel. Het nieuwe invoercontract is geen veronderstelde beschrijving van de ontbrekende oude JSON: een eventuele omzetting moet expliciet worden gecontroleerd.
3. Leg een toepasselijke publicatiegrondslag of concrete toestemming vast, inclusief eventuele naamsvermelding, versie, beperkingen en bereik voor de afgeleide gegevens. Laat de beheerder deze afbakening vaststellen; niet-commercieel gebruik alleen geldt niet als bewijs van toestemming.
4. Maak daarna pas een afzonderlijk beoordeelbare toevoeging van het statische gegevensbestand. Behoud bronrelatie, technische koppeling en latere inhoudelijke beoordeling apart. Laat onopgeloste verwijzingen zichtbaar, zonder codeherstel of verspreiding over rubriekvoorschriften.
5. Voer de validatie en koppelrapportage op die echte invoer uit. Publiceer de werkmap niet automatisch mee. De huidige module heeft geen automatische invoer- of publicatieroute voor private bestanden.

Er is in deze opdracht geen verzoek om toestemming verstuurd en niets naar GitHub Pages gepubliceerd.

## Technische koppelrapportage op fictieve data

De zes bronrelaties in `tests/concordans.test.mjs` zijn **verzonnen verbindingen tussen bestaande datasetcodes**. Ze zijn uitsluitend een technische fixture, geen historisch materiaal en geen inhoudelijke relevantieoordelen.

| Resultaat basisfixture | Aantal |
| --- | ---: |
| Fictieve relaties | 6 |
| Aan beide kanten technisch oplosbaar | 5 |
| Met ontbrekend doel | 1 |
| Exacte eindpuntkoppelingen | 8 |
| Eindpunten uitsluitend op structuurniveau | 3 |
| Ontbrekende eindpunten | 1 |
| Relaties met expliciete brononzekerheid | 6 |
| Inhoudelijk goedgekeurde relaties | 0 |

Afzonderlijke tests controleren een expliciete, nog te beoordelen koppeling; een afwijkende broncode; een ontbrekend technisch ID; meerdere kandidaten; dubbele koppelingen en een verwijzing naar de verkeerde lijst. Er worden geen aantallen uit deze fixture aan echte concordansdekking toegeschreven. Zie het [gegevensmodel](concordans-gegevensmodel.md) voor de API en de resterende beperkingen.
