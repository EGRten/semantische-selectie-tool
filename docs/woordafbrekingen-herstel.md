# Gericht herstel van woordafbrekingen in productiedata

Uitgangspunt: `4f54552` (actuele main bij aanvang). Uitgevoerd op verzoek om correctie in de productiedatasets; geen frontendnormalisatie, nieuwe zoekregels of wijziging van de selectiesystematiek.

## Oorzaak en bewijs

De PDF-extractie bewaart bijvoorbeeld `Geschillen behan-\ndelen` in `officiele_bronrij.procesnaam`. `clean()` in `scripts/bronopbouw/build_revision.py` vervangt witruimte door een spatie; structuur en zoeklexicon krijgen daardoor `Geschillen behan- delen`. De frontend en projecties tonen die datasetwaarde. De 2017-procesnamen werden bij oorspronkelijke import al uit de officiële XLS overgenomen en hebben dit probleem veel minder.

Onderbouwing voor de correcties: de aanwezige, ongewijzigd bewaarde officiële tekstextracties in `datasets/*/bepalingen.json`, met bron-ID en PDF-pagina. De intacte woordvorm moet daarin voorkomen. De oorspronkelijke externe PDF's zijn niet lokaal aanwezig; downloaden wordt door de netwerkproxy geblokkeerd. Er is dus **geen nieuwe visuele controle van de oorspronkelijke PDF** uitgevoerd. Deze begrensde controle gebruikt de productiedatasets zoals nader opgedragen; zij is geen nieuwe volledige bronvalidatie.

## Resultaat

| Dataset | Geïnventariseerde kandidaatvormen | Gecorrigeerde vormen | Vervangingen in JSON-tekstvelden | Gewijzigde tekstvelden |
| --- | ---: | ---: | ---: | ---: |
| 1996/2012 | 34 | 0 | 0 | 0 |
| 2017 | 16 | 1 | 2 | 2 |
| 2020 | 201 | 133 | 1892 | 1798 |

Kandidaten zijn unieke letterdelen rond een koppelteken met volgende witruimte in de productievelden van structuur, selectiegegevens en zoeklexicon; zij omvatten ook correcte samentrekkingen zoals `bestaans- of`. Vormen tellen hoofdlettervarianten en verschillende afbreekposities afzonderlijk. Vervangingen tellen herhalingen over records/velden, inclusief afgeleide zoekvarianten; CSV en publicatieprojecties worden niet nogmaals meegeteld. Overige kandidaten zijn niet stilzwijgend als fout of als gecontroleerd correct aangemerkt.

| Voor | Na | Intacte vorm in aanwezige officiële extractie |
| --- | --- | --- |
| `Geschillen behan- delen` | `Geschillen behandelen` | 2020-officieel, PDF-pagina 28 |
| `Archiefvernie- tiging` | `Archiefvernietiging` | 2020-officieel, PDF-pagina 38 |
| `aan- vragen` | `aanvragen` | 2020-officieel, PDF-pagina 23 |
| `WKPB- OZ` | `WKPB-OZ` | 2017-officieel, PDF-pagina 36 |
| `niet- Nederlander` | `niet-Nederlander` | 2020-officieel, PDF-pagina 95 |

Geen algemene koppeltekenverwijdering: uitsluitend expliciet vastgelegde combinaties zijn vervangen. Bij de laatste twee voorbeelden blijft het betekenisvolle koppelteken behouden. Twijfelgeval `Basisregistratie- personen` is niet samengevoegd. Mechanische schrijfvarianten in het zoeklexicon volgen dezelfde vastgelegde woordcorrectie; IDs en relaties blijven behouden.

Het machineleesbare [correctielogboek](../documentatie/woordafbrekingen-correcties.json) bevat alle toegestane vormen, bronpagina's en per gewijzigd tekstveld het pad en de volledige voor-/natekst. De regressie draait alleen die wijzigingen terug en controleert vervolgens de canonieke hash van de complete uitgangsbestanden. Daardoor zijn ook codes, relaties, volgorde, aantallen, getallen, bronverwijzingen, verificatie en alle niet-aangewezen inhoud beschermd. Ongewijzigde datasetbestanden zijn afzonderlijk op bytes gecontroleerd. Manifestwijzigingen beperken zich tot bestandschecksums; integriteitsvingerafdrukken zijn bijgewerkt.

Oorspronkelijke bronrijen, letterlijke bepalingenextracties, bronannotaties, historische beoordelingscitaten, concordans en testvragen blijven ongewijzigd. In expliciete bronweergaven kunnen dus nog oorspronkelijke regelafbrekingen staan. De leesbare productievelden, zoekindex, details, tabellen en gegenereerde Excel gebruiken de gecorrigeerde datasetwaarden. Bij een toekomstige volledige bronherimport moet het logboek expliciet worden toegepast; er is bewust geen algemene normalisatie aan de importer of frontend toegevoegd.

## Verificatie

- Technische datasetvalidatie inclusief schema's, CSV/JSON-gelijkheid, manifestchecksums en inhoudelijke integriteit: geslaagd.
- Typecheck en productiebuild: geslaagd; publicatieprojecties reproduceerbaar via `node scripts/genereer-publicaties.mjs --check`.
- Volledige moduletests: 172 gevallen, 154 geslaagd en 18 bestaande bronafhankelijke skips; geen mislukkingen. De nieuwe correctie-/bewijstests en historische-citaatcontrole zijn gericht opnieuw geslaagd na afronding van de metadata.
- Eerste gerichte Chromium-run: zeven tests geslaagd, waaronder alle vier echte Excel-downloads inhoudelijk teruggelezen en zoeken met beide modi, details en tabelnavigatie op `Geschillen behandelen`.
- Na de aanvullende correcties met behoud van koppeltekens: 2017-/2020-downloads, dezelfde drie nieuwe browserregressies en twee bestaande label-/navigatieregressies opnieuw gecontroleerd. Geen gewijzigde zoekverwachtingen, codes of categorieën om fouten te verbergen; drie oude verwachtingen van de afgebroken resultaatnaam zijn bewust aangepast naar `Archiefvernietiging`.

De laatste browserhertest bevat zeven geslaagde gevallen. Diffcontrole slaagt met `git -c core.whitespace=cr-at-eol diff --check`; bestaande CSV-regelafsluitingen zijn behouden.

Geen Firefox/WebKit-run, algemene toegankelijkheidsaudit, merge of Pages-deployment uitgevoerd.
