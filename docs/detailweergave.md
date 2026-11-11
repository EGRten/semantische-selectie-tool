# Detailweergave, bronherleidbaarheid en kopiëren

## Uitgangsversie en inventaris

Gecontroleerd vanaf `06357c7` (samengevoegde PR #7). De bestaande gegevenslaag, boom en beide zoekmodi blijven in gebruik. Geen wijzigingen aan zoekrangschikking, lexicons, officiële gegevens of dependencies.

Onderstaande matrix vergelijkt de oorspronkelijke detailweergave met de aanwezige velden. ‘Context’ betekent dat het veld uitsluitend bij een relevant onderdeel of een beschikbare waarde wordt getoond.

| Bestanden en velden | Voorheen | Context | Aanvulling/presentatie |
| --- | --- | --- | --- |
| structuur: code, benaming, type | Ja | Alle onderdelen | Ongewijzigde officiële waarden |
| structuur: parent_id, volgorde | Via navigatie | Alle onderdelen | Volledig broodkruimelpad en ouderknop; geen code-afgeleide hiërarchie |
| structuur: toelichting, bron | Ja | Indien beschikbaar | Geen fictieve selectiegegevens op hogere niveaus |
| structuur: id, codeopbouw, verificatie | Intern | Technisch | Niet als officiële code tonen |
| selectiegegevens: code, officiele_benaming, officiele_omschrijving | Ja | Voorschrift/resultaat | Lege omschrijving weglaten |
| resultaattype, generiek_specifiek, procesomschrijving, procesobject | Ja | 2017/2020, waar gevuld | Officiële formulering behouden |
| waardering.officiele_tekst, type, afleiding | Tekst | Voorschrift | Bronlegenda-afleiding afzonderlijk benoemd, geen fictieve letter V |
| bewaartermijn.officiele_tekst, status, technisch | Tekst/status | Voorschrift | Volledige brontekst; technisch numeriek object niet als vervangende termijn gebruiken |
| procestermijn.officiele_tekst, status | Ja | Voorschrift | Bronwaarde/status behouden |
| procestermijn.onderbouwing, bron, legendacategorie, generiek_resultaat_id | Bron deels | Indien aanwezig | Onderbouwing en herkomst zichtbaar; legenda staat in aanvangstekst, geen extra afleiding |
| aanvangsmoment.officiele_tekst, status, bron | Ja | Voorschrift | Letterlijke legenda, geen datumberekening |
| toelichting, uitzonderingen_en_verwijzingen.officiele_tekst/status | Ja | Indien relevant | Lange en afgebroken tekst integraal behouden |
| toepassingsvoorwaarden.bronvelden/status | Verwijzing | Voorschrift | Verwijzing naar behouden teksten; geen zelfstandig geïnterpreteerde voorwaarden |
| algemene_bepalingen, uitzonderingen_en_verwijzingen.algemene_bepalingen | Alleen JSON-link | Geselecteerd onderdeel | Uitklapbare algemene bepalingen, per bronpagina |
| broncontext | Alleen JSON-link | 1996/2012 rubriek/voorschrift | Volledige rubriektekst en gelabelde leesbare paginakopieën |
| herkomst_waardering, taakvelden_brontekst | Nee | Indien gevuld | Afzonderlijk getoond |
| officiele_bronrij.procestoelichting | Nee | Indien gevuld | Volledige procestoelichting getoond |
| officiele_bronrij overige velden/segmenten | Via corresponderende gegevens | Technische extractie | Geen dubbele tabellen; bronlocaties en oorspronkelijke JSON blijven beschikbaar |
| status | Alleen vervallen melding | Vervallen resultaat | Expliciete melding behouden; ook in kopie |
| bron, aanvullende_bronnen, veldgebonden bronnen | Deels | Beschikbaar | Pagina/bereik, werkblad/rij/kolom(men), coördinaten, functie en bronstatus |
| verificatie.bronannotaties / bronannotaties.json | Bevinding/verwerking | Elf betrokken records | Ook aanvullende bronnen en datum menselijke bevestiging; geen rectificatieclaim |
| verificatie overige controlevelden | Niet apart | Technisch | Geen algemene vrijgaveclaim; datasetmetadata blijft leidend |
| bepalingen: tekst, bron, tekstcodering, leesbare_paginakopie | Alleen bestand | Op verzoek | Letterlijke tekst en kopie afzonderlijk gelabeld |
| bepalingen: id, type, interpretatie | Niet apart | Technisch | ID-prefix gecontroleerd, tekst niet geïnterpreteerd |
| rubriekcontext: primaire_fragmenten, leesbare_paginakopie, opmerking | Alleen bestand | Per officiële rubriekcode | Tekst, waarschuwing en eigen bronlocatie |
| manifest: officiele_titel, vaststellingsgegevens, datasetversie | Alleen korte lijstnaam | Alle details | Uitklapbare titel, vaststelling, kenmerk en datasetversie |
| bronnenregister: id, url, bestand, status | ID/links | Per bronlocatie | Documentbrede link duidelijk onderscheiden van lokale bronmetadata |
| manifest: aantallen, hashes, validatiestatus, beperkingen | Niet apart | Datasetbeheer | Geen inhoudelijke validatie afleiden uit technische validatie |

## Presentatie en ontbrekende waarden

De bestaande `details.ts` rendert met DOM-tekstknopen, niet met HTML uit datasets. De tweedelige indeling blijft behouden. Alleen voorschriften/resultaten hebben een kopieerknop. Bij meerdere technische regels onder dezelfde rubriek wordt het volgnummer binnen die rubriek getoond; dit is geen nieuwe officiële code. Technische suffixen worden niet gepresenteerd.

Optionele lege omschrijvingen en toelichtingen worden weggelaten. Kernvelden voor termijn en aanvang blijven waar nodig voorzien van een statusuitleg: geen afzonderlijke kolom, niet ingevuld in de bron, in tekst behouden of niet van toepassing wegens vervallen resultaat. Onbekend/te beoordelen krijgt een eigen uitleg wanneer zo'n status wordt aangeleverd. Een null zonder expliciete status levert geen sterkere inhoudelijke uitspraak op. Technische null-waarden worden niet letterlijk getoond.

Vaste, samengestelde, voorwaardelijke en gebeurtenisafhankelijke termijnen blijven volledige tekst. ‘B’ blijft ‘B’, met de expliciete bronlegenda waar aanwezig. Bij 1996/2012 heeft een vernietigingstermijn geen afzonderlijke waarderingsletter. Waar de officiële waarderingstekst null is maar waardering.type bewaren/vernietigen vastlegt, wordt die duiding expliciet als volgens de bronlegenda getoond en gekopieerd; er wordt geen letter V toegevoegd. Permanente bewaring krijgt geen fictief aantal jaren. Procestermijn en aanvang zijn afzonderlijk van bewaartermijn zichtbaar. Er wordt geen datum berekend.

## Broncontext en herleidbaarheid

`context.ts` haalt alleen bij openen `bepalingen.json` of (1996/2012) `rubriekcontext.json` op voor de gekozen lijst. De URL is relatief aan `document.baseURI`, geschikt voor subpaden. Cache per volledige URL; mislukte of onbruikbare aanvragen worden verwijderd en kunnen opnieuw worden geprobeerd. De ontvangen tekst blijft bij het aanvragende detailonderdeel, zodat een late aanvraag geen nieuwe selectie of andere lijst kan overschrijven.

De presentatie controleert arrays, benodigde tekst/bronvelden, lijstprefixen van bronpagina's en bron-ID's tegen het manifest. Voor deze twee contextbestanden bestaat geen afzonderlijk JSON-schema; de bestaande publieke pakketvalidatie blijft daarnaast noodzakelijk. Het zijn geen nieuwe officieel geïnterpreteerde voorwaarden.

Bij 1996/2012 zijn primaire fragmenten en leesbare kopieën afzonderlijk zichtbaar. De laatste kunnen andere rubrieken bevatten en vervangen de autoriteit van het officiële document niet. Algemene bepalingen zijn per pagina inklapbaar; er wordt niet beweerd dat elke pagina afzonderlijk van toepassing is.

Bronnen tonen uitsluitend geregistreerde vindplaatsen. De titel van het manifest wordt bij de officiële bron gebruikt; andere bronnen behouden hun bron-ID en geregistreerde status, zonder verzonnen titel. Metadata is geen lokaal brondocument. Een ontbrekende openbare link wordt benoemd. Externe links zijn documentbreed: de genoemde PDF-pagina is een geregistreerde locatie, geen gegarandeerde deeplink. Er worden geen documenten automatisch gedownload.

De vier specifieke procestermijnen Nihil (2017), de zes officiële afwijkende resultaatlabels 19.1.19–19.1.24 (2020) en de afgebroken toelichting 22.1.3 blijven ongewijzigd. Gecontroleerde transcriptie, menselijke bevestiging en officiële rectificatie worden expliciet onderscheiden. De elf annotaties zijn al identiek ingebed in de selectierecords; daarvoor is geen tweede download nodig.

## Kopieerfunctie

`kopieer.ts` maakt een deterministisch Nederlandstalig overzicht van beschikbare bronwaarden: titel/vaststelling/versie, code/benaming, volledig pad, waardering, termijnen, voorwaardenverwijzingen, toelichtingen, bronlocaties/documentlinks en annotaties. Het overzicht gebruikt geen technische ID als officiële code en maakt geen vervangende bronwaarde voor ontbrekende termijnen. Algemene bepalingen en rubriekcontext worden als verwijzing opgenomen; niet de volledige paginacollectie. De gebruiker moet deze afzonderlijk raadplegen.

De knop gebruikt `navigator.clipboard.writeText` tijdens de gebruikershandeling. Een beleefde live-regio meldt succes of een begrijpelijke fout; de knop wordt na afloop opnieuw beschikbaar. Geen casusopslag, automatische dossiervorming of centrale verwerking. Clipboard vereist browserondersteuning, een veilige context (HTTPS of localhost) en eventuele toestemming. Bij weigering kan de gebruiker tekst handmatig selecteren.

## Controles en beperkingen

Commando's: `npm run typecheck`, `CHROMIUM_PATH=/usr/bin/chromium npm test`, `python scripts/valideer_publicatie.py`. De productiebuild is onderdeel van `npm test`. Tests vergelijken echte bronwaarden, alle kopieerteksten en alle elf annotaties. Bestaande zoektests en verwachtingen blijven ongewijzigd.

Browsercontrole gebruikt Playwright/Chromium omdat de Browser-plugin niet beschikbaar is. De stroom onder test is: lijst kiezen → boom of beide zoekmodi → hetzelfde technische record → context/bron raadplegen → kopiëren met bevestiging of fout. Aanvullend: hogere niveaus, gedeelde rubriekcodes, generieke/specifieke en vervallen resultaten, contextfout/herstel, toetsenbord en mobiele weergave. De eindcontrole omvat 92 geslaagde moduletests en 55 geslaagde Chromium-browsertests, inclusief de bestaande regressies. Er zijn geen bestaande testverwachtingen gewijzigd. Alle 1.145 kopieerteksten zijn op beschikbare bronwaarden, technische suffixen en null-waarden gecontroleerd. Het echte Chromium-klembord is naast de gecontroleerde succes-/foutgevallen getest.

Visueel gecontroleerd: `http://127.0.0.1:4199/testpad/`, desktop 1440×1000 en mobiel 390×844. Paginatitel en inhoud kloppen; geen foutoverlay, consolefout of horizontale overflow. Boomselectie → detail → volledige rubriekcontext is daadwerkelijk doorlopen. Screenshots staan buiten de repository in `/tmp/detailweergave-desktop.png` en `/tmp/detailweergave-mobiel.png`. Typecheck, productiebuild, publieke Python-validatie en integriteitsvingerafdrukken zijn geslaagd. Een Git-diff bevestigt dat datasets, bronnenregistraties en zoekmodules ongewijzigd zijn.

Technische tests bewijzen geen archivistische toepasselijkheid. Geen concordans, zoekwijziging of vernietigingsdatum toegevoegd. Bronbestanden met publicatievoorbehouden blijven extern. Alleen Chromium is getest; klembordtoestemming verschilt per browser en hostingomgeving.
