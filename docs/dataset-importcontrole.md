# Dataset-importcontrole

Uitgevoerd op 10 november 2026 voor distributie `1.0.0-publicatie.1`, afkomstig uit de taakbijlage `gemeentelijke-selectielijsten-publicatiepakket.zip`.
ZIP-SHA256: `ebdb6a390cd1974d9a345bda196a7495aaece901c9bee6931e292ff40f816238`.

## Import en conflicten

Het ZIP-bestand opent foutloos; de CRC-controle (`ZipFile.testzip`) geeft geen fouten. Alle paden zijn relatief en bevatten geen bovenliggende padverwijzingen. Het pakket bevat 133 bestanden: 132 zijn byte-identiek als nieuwe bestanden opgenomen; de pakket-`.gitignore` is met de bestaande regels samengevoegd. De hieronder opgenomen inventaris vermeldt alle definitieve importpaden. Daarnaast is dit controlerapport toegevoegd en is het ontwikkelplan uitsluitend aangevuld met de afgeronde stappen.

De enige padconflicten waren `README.md` en `.gitignore`. De pakket-README staat ongewijzigd in `documentatie/README-datasetpakket.md`; de bestaande hoofd-README en `AGENTS.md` zijn ongewijzigd. De bestaande ignore-regels voor Python blijven behouden; alleen `.bronopbouw-prive/`, `.private-inputs/` en `.reproduce/` zijn toegevoegd. Er zijn geen bestanden geforceerd overschreven. De datasets blijven in afzonderlijke mappen staan.

## Technische controles

| Controle | Resultaat |
| --- | --- |
| `python scripts/valideer_publicatie.py` | Geslaagd, exitcode 0: alle JSON syntactisch geldig; zeven schema's toegepast per lijst; unieke IDs en lijstprefixen; interne verwijzingen, ouders, testvraagverwijzingen, manifesthashes, bronbeschrijvingen en CSV-inhoud geldig. |
| `python scripts/reproduce.py --output /tmp/selectielijst-exports` | Geslaagd, exitcode 0: validatie opnieuw uitgevoerd en alle 15 CSV-exporten byte-identiek herhaald. |
| Vergelijking import met uitgepakt pakket | Alle 132 overgenomen bestanden byte-identiek, inclusief selectiegegevens, zoekverrijking, annotaties en documentatie. |
| Aanvullende controle ouder-kindstructuur | Alle ouderketens eindigen zonder cyclus. |
| Manifestcontrole | Alle directe datasetbestanden behalve het manifest zijn gehasht; alle herberekenbare actuele tellingen voor structuur, regels, statussen, termen, relaties, vragen, annotaties en lege aanvangsmomentvelden komen overeen. Historische bevestigingen zijn behouden en niet opnieuw als menselijke beoordeling uitgevoerd. |
| Bronannotaties | 0 / 4 / 7 per lijst; iedere annotatie staat ook bij het bijbehorende selectierecord. |
| AI-zoekverrijking | AI-herkomst, bron, onderbouwing, beoordelingsstatus en `juridische_gelijkwaardigheid=false` behouden en gecontroleerd in zoeklexicons en relaties. |

De aanvullende controles zijn uitgevoerd met een tijdelijk controlescript buiten de repository; er zijn geen gegenereerde controles of exports toegevoegd. Er zijn geen browser- of zoekfunctietests uitgevoerd: er is nog geen applicatie.

## Git-controles

`README.md` en `AGENTS.md` zijn ongewijzigd ten opzichte van de basiscommit. De PR bevat geen ZIP, cache of tijdelijke export. `git diff --cached --check` signaleert bestaande whitespace in het byte-identiek geïmporteerde pakket (met name CRLF in CSV en één lege scriptregel). Deze bestanden zijn bewust niet opgeschoond: behoud van pakketbytes en manifesthashes gaat voor. De nieuw geschreven documentatie en aangepaste ignore-regels zijn afzonderlijk zonder whitespacefouten gecontroleerd.

## Vastgestelde aantallen

| Selectielijst | Selectieregels | Zoektermkoppelingen | Testvragen | Structuuronderdelen | Relaties | Bronannotaties |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1996/2012 | 494 | 1.005 | 55 | 108 | 1.111 | 0 |
| 2017 | 305 | 1.342 | 54 | 334 | 1.647 | 4 |
| 2020 | 346 | 1.746 | 55 | 375 | 2.092 | 7 |

Alle uitgangsaantallen uit de opdracht zijn bevestigd. De 2020-lijst bevat 344 actieve en twee vervallen regels. AI-zoektermkoppelingen: 157 / 129 / 161, waarvan respectievelijk 148 / 121 / 153 de status `voorstel_niet_activeren` hebben. De overige 9 / 8 / 8 hebben `voorstel_inhoudelijk_beoordeeld_zoekrichting`; dit maakt ze geen officiële synoniemen. De toekomstige applicatie moet uitsluiting van onbevestigde voorstellen zelf afdwingen.

## Gerichte controle bronintegriteit

- 2017: `7.1.2`, `7.1.3`, `7.1.5` en `7.1.6` behouden procestermijn `Nihil`, de verwijzing naar de officiële XLS en de oorspronkelijke lege PDF-cel. Geen algemene overervingsregel toegepast.
- 2020: `19.1.19` tot en met `19.1.24` behouden letterlijk `Archiefvernie- tiging` (de bronafbreking van Archiefvernietiging), met annotatie. Niet genormaliseerd of vervangen door een ander label.
- 2020: de toelichting van `22.1.3` eindigt nog op `geldige of onbruikbaar`; de annotatie over de afgebroken bronpassage blijft aanwezig. Dit brongebrek blijft relevant voor termijnadvies.
- 2020: uitsluitend `7.1.20` en `19.1.13` hebben de status `vervallen`.

Dit is controle van behoud ten opzichte van het aangeleverde pakket en de daarin geregistreerde bronbeoordelingen, geen nieuwe inhoudelijke verificatie tegen PDF/XLS. De meegeleverde semantische integriteitsvingerafdrukken zijn geslaagd. Geen officiële gegevens of AI-relaties zijn aangepast. Een integrale onafhankelijke menselijke tweede lezing en juridische toepasselijkheidsbeoordeling zijn niet uitgevoerd.

## Afhankelijkheden en reproduceerbaarheid

Alle opgegeven dependencies waren al aanwezig: Python-pakketten `PyMuPDF==1.26.6`, `pandas==2.2.3`, `xlrd==2.0.1`, `openpyxl==3.1.5` en `jsonschema==4.26.0`. Niets geïnstalleerd. De twee publieke opdrachten gebruiken alleen de publieke JSON en jsonschema; de overige dependencies dienen de oorspronkelijke bronopbouw. Geen vereiste publieke bestanden of afhankelijkheden ontbreken.

De publieke CSV-export is reproduceerbaar zonder netwerk, bron-PDF's, backend of API. Volledige herextractie uit oorspronkelijke PDF/XLS/rapporten is niet mogelijk uit deze distributie alleen; daarvoor zijn afzonderlijk rechtmatig verkregen bronbytes nodig. De oorspronkelijke bronopbouwscripts en bronhashes blijven beschikbaar; die private pipeline is niet uitgevoerd. Historische documentatie kan verwijzen naar uitgesloten bestanden; bronbeschrijvingen zijn metadata, geen lokale brondocumenten.

## Beperkingen en publicatievoorbehouden

De zelfstandige Excel-concordans en volledige JSON-spiegel ontbreken bewust wegens niet vastgestelde onbeperkte herpublicatierechten. Geen concordans gereconstrueerd. Zeven volledige PDF's, twee externe spreadsheets, drie onderzoeksrapporten en elf bronuitsneden blijven uitgesloten. Het eigen controlewerkboek is wel behouden. Geen externe bronbestanden gedownload.

`HERGEBRUIK.md` bevat een gemotiveerde afbakening op basis van artikel 11 Auteurswet voor vastgestelde besluittekst, geen alomvattende licentie of juridische vrijwaring. Zelfstandig niet-normatief begeleidend materiaal en toekomstige aanvullingen vragen blijvende beoordeling door de beheerder. De eigen code en AI-verrijking hebben geen nieuwe algemene repositorylicentie gekregen.

Volgens `documentatie/privacy-publicatie.md` is beoordelaarsmetadata gepseudonimiseerd, niet gegarandeerd anoniem; indirecte herkenbaarheid blijft mogelijk. Namen in openbare officiële bronattributie zijn behouden. De beheerder blijft verantwoordelijk voor de AVG-grondslag van publieke hosting. De eerdere patrooncontrole op geheimen geeft geen absolute garantie. Rechten-, privacy- en wijzigingenregisters zijn volledig behouden; deze import claimt geen nieuwe integrale privacy- of rechtenaudit.

De datasets zijn technisch gereed als statische invoer voor een toekomstige browserapplicatie, binnen deze beperkingen. De statische gegevenslaag, zoekfuncties, frontend, concordansfunctie en applicatie-integratietests zijn nog niet gebouwd. Er is geen nieuwe databasearchitectuur ingevoerd.

## Definitieve structuur

```text
.gitignore
AGENTS.md
README.md
HERGEBRUIK.md
requirements.txt
bronnen/                       bronbeschrijvingen, register en URL's
concordans/                     README over bewuste uitsluiting
controle/                      controlewerkboek en controlemetadata
datasets/
  1996-2012/                   zelfstandige JSON- en CSV-dataset
  2017/                        zelfstandige JSON- en CSV-dataset
  2020/                        zelfstandige JSON- en CSV-dataset
documentatie/                  pakketdocumentatie en pakket-README
docs/                          ontwikkelplan en importcontrole
schemas/                       zeven JSON-schema's
scripts/                       publieke validatie en reproduceerbare export
  bronopbouw/                  historische private bronopbouwlogica
```

## Volledige inventaris van nieuwe pakketbestanden

- `HERGEBRUIK.md`
- `bronnen/1996-2012-officieel.bron.json`
- `bronnen/1996-2012-opgemaakt.bron.json`
- `bronnen/1996-2012-rapport.bron.json`
- `bronnen/2017-officieel.bron.json`
- `bronnen/2017-officiele-xls.bron.json`
- `bronnen/2017-opgemaakt.bron.json`
- `bronnen/2017-rapport.bron.json`
- `bronnen/2020-officieel.bron.json`
- `bronnen/2020-opgemaakt.bron.json`
- `bronnen/2020-rapport.bron.json`
- `bronnen/concordans-aangeleverd.bron.json`
- `bronnen/externe-bronnen.json`
- `bronnen/selecttool-handleiding.bron.json`
- `bronnen/urls.json`
- `concordans/README.md`
- `controle/Controle-instructie.md`
- `controle/Controlewerkboek.xlsx`
- `controle/bevestigingen-gebruiker.json`
- `controle/controleversie.json`
- `datasets/1996-2012/bepalingen.json`
- `datasets/1996-2012/bronannotaties.json`
- `datasets/1996-2012/codeinventaris.json`
- `datasets/1996-2012/kandidaten-ongekoppeld.json`
- `datasets/1996-2012/manifest.json`
- `datasets/1996-2012/relaties.csv`
- `datasets/1996-2012/relaties.json`
- `datasets/1996-2012/rubriekcontext.json`
- `datasets/1996-2012/selectiegegevens.csv`
- `datasets/1996-2012/selectiegegevens.json`
- `datasets/1996-2012/structuur.csv`
- `datasets/1996-2012/structuur.json`
- `datasets/1996-2012/testvragen.csv`
- `datasets/1996-2012/testvragen.json`
- `datasets/1996-2012/validatie.json`
- `datasets/1996-2012/zoeklexicon.csv`
- `datasets/1996-2012/zoeklexicon.json`
- `datasets/2017/bepalingen.json`
- `datasets/2017/bronannotaties.json`
- `datasets/2017/codeinventaris.json`
- `datasets/2017/kandidaten-ongekoppeld.json`
- `datasets/2017/manifest.json`
- `datasets/2017/relaties.csv`
- `datasets/2017/relaties.json`
- `datasets/2017/selectiegegevens.csv`
- `datasets/2017/selectiegegevens.json`
- `datasets/2017/structuur.csv`
- `datasets/2017/structuur.json`
- `datasets/2017/testvragen.csv`
- `datasets/2017/testvragen.json`
- `datasets/2017/validatie.json`
- `datasets/2017/wijzigingen.json`
- `datasets/2017/zoeklexicon.csv`
- `datasets/2017/zoeklexicon.json`
- `datasets/2020/bepalingen.json`
- `datasets/2020/bronannotaties.json`
- `datasets/2020/codeinventaris.json`
- `datasets/2020/kandidaten-ongekoppeld.json`
- `datasets/2020/manifest.json`
- `datasets/2020/relaties.csv`
- `datasets/2020/relaties.json`
- `datasets/2020/selectiegegevens.csv`
- `datasets/2020/selectiegegevens.json`
- `datasets/2020/structuur.csv`
- `datasets/2020/structuur.json`
- `datasets/2020/testvragen.csv`
- `datasets/2020/testvragen.json`
- `datasets/2020/validatie.json`
- `datasets/2020/wijzigingen.json`
- `datasets/2020/zoeklexicon.csv`
- `datasets/2020/zoeklexicon.json`
- `documentatie/README-datasetpakket.md`
- `documentatie/aanvullende-broncontrole.json`
- `documentatie/afgeronde-broncontroles.json`
- `documentatie/afgewezen-onderzoeksrelaties.json`
- `documentatie/bronannotaties.json`
- `documentatie/broncontrole-1996.json`
- `documentatie/bronnenregister.json`
- `documentatie/bronnenregister.md`
- `documentatie/bronverschillen-2017.json`
- `documentatie/bronvragen-aan-bronhouder.md`
- `documentatie/concordans-afwijkingen.json`
- `documentatie/controleoverdracht.md`
- `documentatie/correctie-procestermijn-2017.json`
- `documentatie/correctie-procestermijn-2017.md`
- `documentatie/dekking-1996.json`
- `documentatie/eindcontrole.json`
- `documentatie/eindrapport.md`
- `documentatie/gegevensspecificatie.md`
- `documentatie/implementatieadvies.md`
- `documentatie/inhoudelijke-integriteit.json`
- `documentatie/kopcontrole-1996.json`
- `documentatie/metadatawijzigingen.json`
- `documentatie/oorspronkelijke-bestandshashes.csv`
- `documentatie/openstaande-beoordelingen.json`
- `documentatie/openstaande-beoordelingen.md`
- `documentatie/privacy-publicatie.md`
- `documentatie/publicatie-wijzigingen.csv`
- `documentatie/publicatiecontrole.md`
- `documentatie/reproduceerbaarheid.md`
- `documentatie/reproduceerbaarheidscontrole.json`
- `documentatie/rubriektoewijzingscontrole-1996.json`
- `documentatie/validatie-correctie-0.3.1.json`
- `documentatie/validatierapport.md`
- `documentatie/validatieresultaten.json`
- `documentatie/volledige-termijnkolomcontrole-1996.json`
- `documentatie/wijzigingscontext-2017.json`
- `documentatie/zoekverrijking-beoordelingen.json`
- `requirements.txt`
- `schemas/bronannotaties.schema.json`
- `schemas/manifest.schema.json`
- `schemas/relaties.schema.json`
- `schemas/selectiegegevens.schema.json`
- `schemas/structuur.schema.json`
- `schemas/testvragen.schema.json`
- `schemas/zoeklexicon.schema.json`
- `scripts/bronopbouw/analyse_concordance.py`
- `scripts/bronopbouw/build_revision.py`
- `scripts/bronopbouw/correct_procestermijn.py`
- `scripts/bronopbouw/coverage1996.py`
- `scripts/bronopbouw/document_revision.py`
- `scripts/bronopbouw/enrich_revision.py`
- `scripts/bronopbouw/extract_tables.py`
- `scripts/bronopbouw/final_delivery.py`
- `scripts/bronopbouw/headers1996.py`
- `scripts/bronopbouw/reproduce.py`
- `scripts/bronopbouw/review_handoff.py`
- `scripts/bronopbouw/validate_revision.py`
- `scripts/bronopbouw/verify1996.py`
- `scripts/bronopbouw_prive.py`
- `scripts/reproduce.py`
- `scripts/valideer_publicatie.py`
