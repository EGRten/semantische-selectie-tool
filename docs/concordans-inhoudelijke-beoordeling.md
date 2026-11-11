# Concordans — inhoudelijk beoordelingsdossier

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

### Behoud van het oorspronkelijke dossier

Het onderzoeksdossier hieronder beschrijft de uitgangssituatie vóór de besluiten. De oorspronkelijke conclusies en lege beoordelingsvelden worden als historisch onderzoeksvoorstel behouden, niet als actuele onbehandelde status. De letterlijke besluiten, motivering, herkomst, rol, vastleggingsdatum, technische verwerking en resterende onzekerheden staan in `controle/concordans-inhoudelijke-beoordeling.json` onder `beoordelingsbesluiten`. Iedere besluitregistratie verwijst naar het oorspronkelijke bronrij-ID en de ongewijzigde oorspronkelijke voorstelconclusie.

De officiële statistiektekst “Door en aan de gemeente” blijft leidend tegenover de beperktere concordanstekst “Door de gemeente”. Niet vastgesteld is of dit een bewuste beperking of redactionele verkorting betreft. De drie rijen vertegenwoordigen afzonderlijke doelen, maar leveren geen drie onafhankelijke bewijzen voor de auteursbedoeling.

### Validatie van de besluitverwerking

Op 11 november 2026 zijn **135 moduletests en 68 Chromium-browsertests geslaagd, zonder overgeslagen tests**. Uitgevoerd: `CONCORDANS_BRON_JSON=/tmp/concordans-12/concordans.json CHROMIUM_PATH=/usr/bin/chromium npm test`, `npm run typecheck`, `python scripts/valideer_publicatie.py` en de bestaande Excel/JSON-broncontrole. Productiebuild, bronidentiteit, alle 7.876 oorspronkelijke en 7.876 uitgevouwen cellen en het byte-identiek herhaalde koppelrapport zijn geslaagd. De echte bron blijft lokaal; een andere lokale bestandslocatie kan via dezelfde omgevingsvariabele worden gebruikt.

Nieuwe regressies controleren alle tien besluiten/acht groepen, behoud van het volledige oorspronkelijke onderzoeksregister via een vaste SHA-256, 612/606/6, behoud van de oorspronkelijke 605 recordparen, broncellen, kandidaten, 50–52 en 716, gewijzigde bron-/doelcontext, ongeautoriseerde correctie-ID’s en uitsluitend de compacte besluitprojectie in de productie-uitvoer. De browser controleert rij 21 in beide richtingen, officiële vergelijking, zes open relaties, ontbrekend bestand en bestaande zoek-, boom- en detailfunctionaliteit. Desktop en mobiel zijn aanvullend visueel gecontroleerd onder `/controle/`, zonder JavaScript-fouten of horizontale overloop.

Bewust gewijzigde oude testverwachtingen: rij 21 is nu gekoppeld op expliciet besluit; rapport- en overzichtstellingen veranderen daarom van 605/7 naar 606/6. De interface verwacht de vastgelegde besluitstatus en de build mag de compacte besluitlaag projecteren. De oorspronkelijke onderzoeksvoorstellen, B-kandidaten, officiële bronverwachtingen, zoekverwachtingen en volledige 605-parenvingerafdruk zijn behouden. Dit zijn geen aanpassingen om fouten te verhullen.

## Historische uitgangsrapportage (behouden)

Dit dossier bevat **AI-onderzoeksvoorstellen**, geen onafhankelijk gevalideerde archivistische oordelen. Alle tien gevallen staan op `te_beoordelen`; beoordelaar, datum en definitief oordeel zijn leeg. Er zijn geen relaties, bronwaarden, bestaande A/B/C-statussen of productiefuncties aangepast. De conclusienummers 1–5 hieronder behoren uitsluitend bij deze onderzoeksopdracht en vervangen de technische A/B/C-registratie niet.

## Bronnen, identiteit en methodiek

De opnieuw aangeleverde ZIP opent zonder fouten. De oorspronkelijke Excel is geverifieerd met SHA-256 `7dfda792ce61c1a6fa28c5c116155a429560153178c6c58987eabbbe6cdf708c`; rij-JSON met `b01cff07c7bfeeb6f562d467373615f5a18cfc7ab9777f11fcd5cb1ed7de73dd`. De twee leidende PDF's zijn gelijk aan de oorspronkelijke hashes in de bestaande bronbeschrijvingen: 1996/2012 `4e19bd25d108881ba8f72d5744e3179bf2dee5354e6d4101acc6c07f40a0de22`, 2020 `0174fda6020ebee109d2f5da5731078196fd46970c2d8aa5e9e452f1d21e073c`. Manifesthashes van `.bron.json` zijn metadatahashes en zijn niet met PDF-hashes verward.

Officiële publicaties: [1996, actualisatie 2012](https://www.nationaalarchief.nl/sites/default/files/field-file/selectielijsten/bsd_gemeentelijke_en_intergemeentelijke_organen_stcnrt_2012_11906_addendum_pdfa_versie.pdf) (Staatscourant 2012/11906) en [2020](https://www.nationaalarchief.nl/sites/default/files/field-file/Selectielijst_20200214.pdf) (Staatscourant 2020/11143). Dit zijn geregistreerde documentbrede links, geen nieuwe externe download of paginadeeplink. Technische suffixen in record-ID’s zijn geen officiële codes. Paginanummers hieronder zijn **PDF-pagina's vanaf 1**, niet de soms afwijkende gedrukte paginanummers. Excelposities verwijzen naar Blad1.

De relevante tabellen zijn rechtstreeks in de aangeleverde officiële PDF's gelezen. Bij defecte fontcodering in de 1996-PDF is de visuele pagina gecontroleerd; een leesbare aangeleverde kopie is niet als vervangende normbron behandeld. De bestaande schema's, bronannotaties en afwijkingenregisters zijn geraadpleegd. De elf bekende bronannotaties geven geen ontbrekende actor-, object- of codecellen voor deze tien gevallen; de afzonderlijke technische correctie 716 wordt niet herbeoordeeld of gewijzigd.

Alle criteria worden per geval gebruikt: **A** bronduidelijkheid, **B** proces, **C** informatieobject, **D** toepassingsbereik, **E** waardering/termijn, **F** alternatieven en **G** concrete brononderbouwing. Overeenkomsten ondersteunen vergelijking; zij bewijzen geen één-op-éénidentiteit. Betrouwbaarheid wordt kwalitatief aangegeven, zonder schijnpercentages.

Gemeenschappelijke officiële beperkingen:

- 1996/2012, hoofdstuk 1.4, PDF p.8: bevoegdheden en samenhang tellen mee; een specifieke categorie met langere termijn kan voorgaan. PDF p.9 noemt bij uitzonderingen onder meer “bescheiden die een samenvatting zijn van gegevens, zoals jaarverslagen, overzichten en statistieken”. Dit mag niet worden losgemaakt van het volledige toetsingskader.
- 2020, PDF p.10: procestype vanuit de zorgdrager; generieke resultaten zijn de basis, specifieke resultaten betreffen een specifiek omschreven deel en gaan daarvoor voor. Deze regel herstelt geen ontbrekende concordanscode.
- 2020, PDF p.25: procestermijn A (Nihil), B (bestaans-/geldigheidsduur), D (vast te leggen geldigheidsdatum) en samengevoegde termijnen hebben verschillende startlogica. Gelijke getallen zijn geen gelijke totale bewaartermijnen. Er is geen vernietigingsdatum berekend.

Noodzakelijke bronbestanden voor dit dossier zijn aanwezig. Niet aangetroffen zijn een auteursverklaring over de inkorting “en aan”, een codeherstelverklaring voor rij 21 of concrete dossier-/actorbeschrijvingen voor de lege historische cellen. Voor procedurele gelijkstelling, bijvoorbeeld optie/naturalisatie, kunnen aanvullende historische wets- en procesbronnen nodig zijn; hun inhoud is hier niet verzonnen.

## Compact overzicht

| Rij | Onderwerp | Voorlopig voorstel | Vervolg na menselijke bevestiging |
| --- | --- | --- | --- |
| 6 | Welke historische aanwijzing correspondeert met de tijdelijke status? | 3. Onvoldoende onderbouwde relatie | Vergelijk een werkelijk benoemingsbesluit en de actorrol. Alleen na bevestiging één afzonderlijke koppeling toevoegen; anders brononzekerheid blijven tonen. |
| 21 | Is 19.1. een generiek resultaat of een afgebroken specifiek nummer? | 3. Onvoldoende onderbouwde relatie | Verifieer de bedoelde resultaatcode bij een bronbeheerder of met een concrete dossierinventaris. Behoud de historische technische ID; activeer nu geen nieuw doel. |
| 89 | Betreft beveiliging als gebruikstoestemming hetzelfde proces en welk historisch voorschrift? | 3. Onvoldoende onderbouwde relatie | Vraag vaststelling van actor, gebruiker, informatieobject, onmisbaarheid voor raadpleging en waardering van het beschermde archief. Behoud onzekerheid; voeg nu geen binding toe. |
| 90 | Kan een beveiligingsplan onder meerdere historische waarderingen vallen? | 2. Meerdere inhoudelijk verdedigbare relaties | Laat vaststellen welk plan en welk beschermd archief zijn bedoeld. Na bevestiging eventueel meerdere conditionele historische relaties registreren; generiek/specifiek doel afzonderlijk beoordelen. |
| 293 | Welke delegatie-/mandaatcategorie kan een beëindigde status betreffen? | 2. Meerdere inhoudelijk verdedigbare relaties | Na bevestiging van proces/object eventueel meerdere expliciete relaties met actorvoorwaarden registreren. Behoud oorspronkelijke termijnen en onderscheid attributie; nu geen activering. |
| 434 | Is optie inhoudelijk aan nationaliteitsonderzoek of naturalisatie te verbinden? | 3. Onvoldoende onderbouwde relatie | Laat een informatieprofessional de toenmalige nationaliteitsprocedure en concrete informatieobjecten toetsen, zo nodig met aanvullende historische wettelijke/procedurebronnen. Geen één-op-éénrelatie activeren. |
| 442 | Welke historische rijbewijsdossiers kunnen een fraudemelding omvatten? | 2. Meerdere inhoudelijk verdedigbare relaties | Beschrijf eerst de dossiergrens, uitkomst van de melding en originele geldigheidsduur. Registreer na bevestiging zo nodig meerdere conditionele documentrelaties; behoud de brononzekerheid tot die tijd. |
| 50 | Wat betekent de weglating en aan bij deze afzonderlijke doelverwijzing? | 5. Bronafwijking zonder gevolgen voor de technische koppeling | Bestaande technische koppeling aan 2.8::001 behouden. Na inhoudelijke bevestiging een toelichting op de beperkte concordansformulering en de objectafbakening tonen; 2.8::002 is alleen aanvullende beoordelingscontext, geen voorgestelde recordwissel. |
| 51 | Wat betekent de weglating en aan bij deze afzonderlijke doelverwijzing? | 5. Bronafwijking zonder gevolgen voor de technische koppeling | Bestaande technische koppeling aan 2.8::001 behouden. Na inhoudelijke bevestiging een toelichting op de beperkte concordansformulering en de objectafbakening tonen; 2.8::002 is alleen aanvullende beoordelingscontext, geen voorgestelde recordwissel. |
| 52 | Wat betekent de weglating en aan bij deze afzonderlijke doelverwijzing? | 5. Bronafwijking zonder gevolgen voor de technische koppeling | Bestaande technische koppeling aan 2.8::001 behouden. Na inhoudelijke bevestiging een toelichting op de beperkte concordansformulering en de objectafbakening tonen; 2.8::002 is alleen aanvullende beoordelingscontext, geen voorgestelde recordwissel. |

Tien afzonderlijke bronrijen vertegenwoordigen **acht onafhankelijke probleemgroepen**: zeven unieke openstaande interpretaties en één gedeelde statistiekformulering met drie doelverwijzingen. De drie statistiekrijen zijn geen drie onafhankelijke aanwijzingen voor auteursbedoeling. Uitkomst: vier voorstellen 3, drie voorstellen 2 en drie voorstellen 5. Geen voorstel 1 of definitieve goed-/afkeuring is voldoende onderbouwd. Voorstel 5 betreft uitsluitend de behouden technische recordidentiteit: het mogelijke inhoudelijke scopeverschil is daarmee niet onschadelijk verklaard en de bestaande B-status wordt niet vervangen. De dekking blijft 612 interpretaties, 605 technisch gekoppeld en zeven onopgelost.

## concordans:rij:6

**1. Identificatie.** Blad1, rij 6; probleemgroep `concordans:rij:6`.

**2. Onderzoeksvraag.** Welke historische aanwijzing correspondeert met de tijdelijke status?

**3. Letterlijke oorspronkelijke brongegevens.**

| Kolom | Oorspronkelijke cel | Werkelijk uitgevouwen cel |
| --- | --- | --- |
| A | Leeg | 1. Aanwijzing van gemeentelijke vertegenwoordigers in commissies e.d. |
| B | Leeg | Leeg |
| C | Leeg | Leeg |
| D | Leeg | Leeg |
| E | Status toekennen | Status toekennen |
| F | 9.1.1 | 9.1.1 |
| G | Toegekend | Toegekend |
| H | Tijdelijke status | Tijdelijke status |
| I | Vernietigen 1 jaar na einde status | Vernietigen 1 jaar na einde status |

**4. Betrokken officiële voorschriften (E: waardering, termijn en aanvang; C/D/F: object, bereik en kandidaten).** B is letterlijk bewaren volgens de bronlegenda. Waar de waarderingsletter leeg is, staat de termijn letterlijk vermeld; er wordt geen V in de brontekst gezet.

- `1996-2012:2.1::001` — **Voorzitters en leden van bestuurlijke commissies, comités e.d. alsmede aanwijzing van gemeentelijke vertegenwoordigers in externe bestuurlijke organen**. Officiële omschrijving: Voorzitters en leden van bestuurlijke commissies, comités e.d. alsmede aanwijzing van gemeentelijke vertegenwoordigers in externe bestuurlijke organen Waardering: B Termijn: **B**. Procestermijn: Geen afzonderlijke bronwaarde (zie status/context). (`geen_afzonderlijke_kolom_in_bron`). Aanvang: Geen afzonderlijke bronwaarde (zie status/context). (`raadpleeg_algemene_bepalingen`). Voorwaarden: raadpleeg officiele_omschrijving, broncontext, algemene_bepalingen; rubriekcontext rubriekcontext.json#2.1 en algemene beginselen 1.4. Bron: `1996-2012-officieel`, PDF p.18.
- `1996-2012:2.1::002` — **Lidmaatschappen van niet-bestuurlijke commissies, stembureaus, werkgroepen e.d.**. Officiële omschrijving: Lidmaatschappen van niet-bestuurlijke commissies, stembureaus, werkgroepen e.d. Waardering: Geen afzonderlijke bronwaarde (zie status/context). Termijn: **1 jaar na het verstrijken van de termijn waarvoor de benoeming/aanwijzing is geschied**. Procestermijn: Geen afzonderlijke bronwaarde (zie status/context). (`geen_afzonderlijke_kolom_in_bron`). Aanvang: 1 jaar na het verstrijken van de termijn waarvoor de benoeming/aanwijzing is geschied (`in_termijntekst_behouden`). Voorwaarden: raadpleeg officiele_omschrijving, broncontext, algemene_bepalingen; rubriekcontext rubriekcontext.json#2.1 en algemene beginselen 1.4. Bron: `1996-2012-officieel`, PDF p.18.
- `2020:9.1.1` — **Tijdelijke status**. Officiële omschrijving: Tijdelijke status Waardering: Vernietigen Termijn: **1 jaar**. Procestermijn: De tijdens het proces vast te
leggen datum waarop de gel-
digheid van het procesobject
komt te vervallen (`letterlijk_overgenomen`). Aanvang: Tijdens de procesuitvoering wordt de datum bepaald wanneer het procesobject haar geldigheid zal verliezen. Tot dat moment loopt de procestermijn. (`letterlijke_legenda_bij_procestermijn_geen_datumberekening`). Voorwaarden: raadpleeg officiele_omschrijving, procesomschrijving, toelichting, algemene_bepalingen; procesomschrijving: Het toepassen van de publieke bevoegdheden als overheids-
orgaan om personen, objecten of immateriële zaken een
bepaalde status toe te kennen.; procesobject: De status. Officiële toelichting: Tijdelijke verkeersmaatregel, eenmalige Babs Bron: `2020-officieel`, PDF p.32.

**5. Bronverwijzingen (G).** Blad1 rij 6; de recordbronnen en paginanummers hierboven, plus het gemeenschappelijke kader PDF 1996 p.8–9 en 2020 p.10/25. De bron maakt de actorrol niet expliciet; A4:A7 is alleen rubriekcontext en B:D zijn niet samengevoegd. Officiële voorbeelden geven geen uitsluitende identificatie.

**6. Overeenkomsten (B/C).** Beide historische voorschriften gaan over benoeming of aanwijzing; resultaat 9.1.1 kan een tijdgebonden status betreffen.

**7. Verschillen (D/E).** De historische lijst onderscheidt bestuurlijke vertegenwoordiging (B) en niet-bestuurlijke lidmaatschappen (vernietiging na benoemingstermijn). De 2020-toelichting noemt tijdelijke verkeersmaatregel en eenmalige Babs, niet alle commissielidmaatschappen. De officiële rubriek noemt bovendien een eigen zevenjarige bewaring door een rechtspersoon; dat is geen algemene vervanging van de gemeentelijke termijnen.

**8. Mogelijke interpretaties (A/F).** Een verwijzing naar niet-bestuurlijke lidmaatschappen is voorstelbaar, maar ook een tijdelijke bestuurlijke aanwijzing is niet door de tekst uitgesloten. De duur van een benoeming bewijst de aard van de rol niet.

**9. Risico's.** Een algemene tijdelijke-statuskoppeling kan blijvend te bewaren bestuurlijke vertegenwoordiging ten onrechte als vernietigbaar voorstellen.

**10. Voorgestelde conclusie.** **3. Onvoldoende onderbouwde relatie** — uitsluitend voorstel voor inhoudelijke beoordeling.

**11. Zekerheid en onzekerheid.** Beperkt: procesverwantschap is aannemelijk, de specifieke historische identiteit niet. Geen onafhankelijk menselijk archivistisch oordeel vastgesteld.

**12. Aanbevolen vervolghandeling.** Vergelijk een werkelijk benoemingsbesluit en de actorrol. Alleen na bevestiging één afzonderlijke koppeling toevoegen; anders brononzekerheid blijven tonen. Deze actie is niet uitgevoerd.

**13. Oordeel inhoudelijke beoordelaar.** Status: **te beoordelen**. Beoordelaar: … Datum: … Oordeel (bevestigen/verwerpen/aanvullen): … Motivering en aanvullende bronverwijzingen: …

## concordans:rij:21

**1. Identificatie.** Blad1, rij 21; probleemgroep `concordans:rij:21`.

**2. Onderzoeksvraag.** Is 19.1. een generiek resultaat of een afgebroken specifiek nummer?

**3. Letterlijke oorspronkelijke brongegevens.**

| Kolom | Oorspronkelijke cel | Werkelijk uitgevouwen cel |
| --- | --- | --- |
| A | Leeg | 3. Intermediair optreden |
| B | c. | c. |
| C | Bescheiden betreffende/voortvloeiende uit deelneming in, respectievelijk advisering aan besturen, commissies en andere organen waarvan het secretariaat en het archief elders worden beheerd | Bescheiden betreffende/voortvloeiende uit deelneming in, respectievelijk advisering aan besturen, commissies en andere organen waarvan het secretariaat en het archief elders worden beheerd |
| D | 3 jaar | 3 jaar |
| E | Secretariaat voeren en gegevens administreren / verwerken  | Secretariaat voeren en gegevens administreren / verwerken  |
| F | 19.1. | 19.1. |
| G | Verwerkt | Verwerkt |
| H | Leeg | Leeg |
| I | Vernietigen na 5 jaar | Vernietigen na 5 jaar |

**4. Betrokken officiële voorschriften (E: waardering, termijn en aanvang; C/D/F: object, bereik en kandidaten).** B is letterlijk bewaren volgens de bronlegenda. Waar de waarderingsletter leeg is, staat de termijn letterlijk vermeld; er wordt geen V in de brontekst gezet.

- `1996-2012:2.3::003` — **Bescheiden betreffende/voortvloeiende uit deelneming in, respectievelijk advisering aan besturen, commissies en andere organen waarvan het secretariaat en het archief elders worden beheerd**. Officiële omschrijving: Bescheiden betreffende/voortvloeiende uit deelneming in, respectievelijk advisering aan besturen, commissies en andere organen waarvan het secretariaat en het archief elders worden beheerd Waardering: Geen afzonderlijke bronwaarde (zie status/context). Termijn: **3 jaar**. Procestermijn: Geen afzonderlijke bronwaarde (zie status/context). (`geen_afzonderlijke_kolom_in_bron`). Aanvang: Geen afzonderlijke bronwaarde (zie status/context). (`raadpleeg_algemene_bepalingen`). Voorwaarden: raadpleeg officiele_omschrijving, broncontext, algemene_bepalingen; rubriekcontext rubriekcontext.json#2.3 en algemene beginselen 1.4. Bron: `1996-2012-officieel`, PDF p.19.
- `2020:19.1` — **Verwerkt**. Officiële omschrijving: Geen afzonderlijke bronwaarde (zie status/context). Waardering: Vernietigen Termijn: **5 jaar**. Procestermijn: Nihil (`letterlijk_overgenomen`). Aanvang: A Nihil = Er is geen aparte procestermijn, de bewaartermijn start direct. (`letterlijke_legenda_bij_procestermijn_geen_datumberekening`). Voorwaarden: raadpleeg officiele_omschrijving, procesomschrijving, toelichting, algemene_bepalingen; procesomschrijving: Het door het orgaan in een van haar administraties verwerken
van aangeleverde, gemelde of geconstateerde gegevens,
zonder dat hier een inhoudelijke toetsing bij plaatsvindt; procesobject: De verwerkte gegevens. Officiële toelichting: Gegevens verwerken, watervergunning/-melding, beslag-
legging, (overige) hulpadministraties zonder financiele
consequenties Bron: `2020-officieel`, PDF p.37.
- `2020:19.1.11` — **Agenda, verslag van ambtelijk overleg met derden**. Officiële omschrijving: Agenda, verslag van
ambtelijk overleg met
derden Waardering: Vernietigen Termijn: **5 jaar**. Procestermijn: Nihil (`letterlijk_overgenomen`). Aanvang: A Nihil = Er is geen aparte procestermijn, de bewaartermijn start direct. (`letterlijke_legenda_bij_procestermijn_geen_datumberekening`). Voorwaarden: raadpleeg officiele_omschrijving, procesomschrijving, toelichting, algemene_bepalingen; procesomschrijving: Het door het orgaan in een van haar administraties verwerken
van aangeleverde, gemelde of geconstateerde gegevens,
zonder dat hier een inhoudelijke toetsing bij plaatsvindt; procesobject: De verwerkte gegevens. Bron: `2020-officieel`, PDF p.37.
- `2020:19.1.12` — **Agenda, verslag van overleg met derden geor- ganiseerd door derde**. Officiële omschrijving: Agenda, verslag van
overleg met derden geor-
ganiseerd door derde Waardering: Vernietigen Termijn: **1 jaar**. Procestermijn: Nihil (`letterlijk_overgenomen`). Aanvang: A Nihil = Er is geen aparte procestermijn, de bewaartermijn start direct. (`letterlijke_legenda_bij_procestermijn_geen_datumberekening`). Voorwaarden: raadpleeg officiele_omschrijving, procesomschrijving, toelichting, algemene_bepalingen; procesomschrijving: Het door het orgaan in een van haar administraties verwerken
van aangeleverde, gemelde of geconstateerde gegevens,
zonder dat hier een inhoudelijke toetsing bij plaatsvindt; procesobject: De verwerkte gegevens. Bron: `2020-officieel`, PDF p.37.

**5. Bronverwijzingen (G).** Blad1 rij 21; de recordbronnen en paginanummers hierboven, plus het gemeenschappelijke kader PDF 1996 p.8–9 en 2020 p.10/25. De voorrangsregel voor specifieke resultaten op PDF p.10 bepaalt de selectie bij bekende objecten, maar herstelt geen onvolledige concordanscel. F21 blijft letterlijk 19.1.; C21:C23 deelt alleen de historische omschrijving.

**6. Overeenkomsten (B/C).** Historische deelnemings-/adviesbescheiden kunnen administratief verwerkte gegevens zijn. Generiek 19.1 en specifiek overleg met derden bieden procescontext.

**7. Verschillen (D/E).** Bij 2.3 wordt het secretariaat/archief elders beheerd. 19.1.11 betreft ambtelijk overleg met derden; 19.1.12 juist overleg georganiseerd door een derde en heeft 1 jaar in plaats van 5 jaar. Generiek 19.1 heeft Nihil als procestermijn en 5 jaar; historisch is het 3 jaar zonder afzonderlijk vastgelegd aanvangsmoment.

**8. Mogelijke interpretaties (A/F).** Generiek 19.1 is een sterke kandidaat door lege specifieke omschrijving en vijfjaarstekst. De nadere informatieobjecten kunnen echter specifiek overleg betreffen; 19.1.12 is relevante aanvullende context, geen correctie van de doelcode.

**9. Risico's.** Een ontbrekend cijfer stilzwijgend herstellen kan de specifieke-resultatenvoorrang negeren of bescheiden van een derde met eigen gemeentelijke procesdossiers verwarren.

**10. Voorgestelde conclusie.** **3. Onvoldoende onderbouwde relatie** — uitsluitend voorstel voor inhoudelijke beoordeling.

**11. Zekerheid en onzekerheid.** Beperkt: generiek 19.1 is plausibel maar niet uniek bewezen. Geen onafhankelijk menselijk archivistisch oordeel vastgesteld.

**12. Aanbevolen vervolghandeling.** Verifieer de bedoelde resultaatcode bij een bronbeheerder of met een concrete dossierinventaris. Behoud de historische technische ID; activeer nu geen nieuw doel. Deze actie is niet uitgevoerd.

**13. Oordeel inhoudelijke beoordelaar.** Status: **te beoordelen**. Beoordelaar: … Datum: … Oordeel (bevestigen/verwerpen/aanvullen): … Motivering en aanvullende bronverwijzingen: …

## concordans:rij:89

**1. Identificatie.** Blad1, rij 89; probleemgroep `concordans:rij:89`.

**2. Onderzoeksvraag.** Betreft beveiliging als gebruikstoestemming hetzelfde proces en welk historisch voorschrift?

**3. Letterlijke oorspronkelijke brongegevens.**

| Kolom | Oorspronkelijke cel | Werkelijk uitgevouwen cel |
| --- | --- | --- |
| A | Leeg | 12. Beheer, beveiliging en programmatuur |
| B | Leeg | Leeg |
| C | Beveiliging (als toestemming gebruik) | Beveiliging (als toestemming gebruik) |
| D | Leeg | Leeg |
| E | Toestemming verlenen | Toestemming verlenen |
| F | 11.1 | 11.1 |
| G | Verleend | Verleend |
| H | Leeg | Leeg |
| I | 1 jaar na einde toestemming | 1 jaar na einde toestemming |

**4. Betrokken officiële voorschriften (E: waardering, termijn en aanvang; C/D/F: object, bereik en kandidaten).** B is letterlijk bewaren volgens de bronlegenda. Waar de waarderingsletter leeg is, staat de termijn letterlijk vermeld; er wordt geen V in de brontekst gezet.

- `1996-2012:2.12::001` — **- betrekking hebbend op archiefbescheiden, die voor bewaring in aanmerking komen**. Officiële omschrijving:  - betrekking hebbend op archiefbescheiden, die voor bewaring in aanmerking komen Waardering: B Termijn: **B**. Procestermijn: Geen afzonderlijke bronwaarde (zie status/context). (`geen_afzonderlijke_kolom_in_bron`). Aanvang: Geen afzonderlijke bronwaarde (zie status/context). (`raadpleeg_algemene_bepalingen`). Voorwaarden: raadpleeg officiele_omschrijving, broncontext, algemene_bepalingen; rubriekcontext rubriekcontext.json#2.12 en algemene beginselen 1.4. Bron: `1996-2012-officieel`, PDF p.23.
- `1996-2012:2.12::002` — **- overige gevallen**. Officiële omschrijving:  - overige gevallen Waardering: Geen afzonderlijke bronwaarde (zie status/context). Termijn: **1 jaar na vervallen van het belang voor de bedrijfsvoering **. Procestermijn: Geen afzonderlijke bronwaarde (zie status/context). (`geen_afzonderlijke_kolom_in_bron`). Aanvang: 1 jaar na vervallen van het belang voor de bedrijfsvoering  (`in_termijntekst_behouden`). Voorwaarden: raadpleeg officiele_omschrijving, broncontext, algemene_bepalingen; rubriekcontext rubriekcontext.json#2.12 en algemene beginselen 1.4. Bron: `1996-2012-officieel`, PDF p.23.
- `2020:11.1` — **Verleend**. Officiële omschrijving: Geen afzonderlijke bronwaarde (zie status/context). Waardering: Vernietigen Termijn: **1 jaar**. Procestermijn: De bestaans- of geldigheids-
duur van het procesobject (`letterlijk_overgenomen`). Aanvang: Nadat het procesobject haar geldigheid heeft verloren of niet meer bestaat, gaat de bewaartermijn lopen. (`letterlijke_legenda_bij_procestermijn_geen_datumberekening`). Voorwaarden: raadpleeg officiele_omschrijving, procesomschrijving, toelichting, algemene_bepalingen; procesomschrijving: Het door het orgaan behandelen van een aanvraag, melding
of verzoek om toestemming voor het doen of laten van een
derde waar het orgaan bevoegd is om over te beslissen; procesobject: De verleende toestem-
ming. Officiële toelichting: Lozing afvalwater, drank en horeca, grafbedekking, grafuitgifte,
doorlopende collectevergunning, rioolaansluiting, gedoogbe-
schikking, omgevingsvergunning alarminstallatie, uitrit, aanleg
kabels en leidingen Bron: `2020-officieel`, PDF p.33.

**5. Bronverwijzingen (G).** Blad1 rij 89; de recordbronnen en paginanummers hierboven, plus het gemeenschappelijke kader PDF 1996 p.8–9 en 2020 p.10/25. Het perspectief van de zorgdrager op PDF p.10 en de expliciete derde in procestype 11 beperken de analogie. A87:A91 identificeert de rubriek, niet de betrokken soort archief.

**6. Overeenkomsten (B/C).** Toegangsrechten kunnen samenhangen met het beheer en de beveiliging van geautomatiseerde administraties.

**7. Verschillen (D/E).** Rubriek 2.12 vereist bescheiden die onmisbaar zijn voor raadpleging en onderscheidt blijvend te bewaren archief van overige gevallen. Procestype 11 behandelt een aanvraag/melding/verzoek van een derde om toestemming; interne autorisatie is daarmee niet vanzelf hetzelfde. 11.1: 1 jaar na bestaans-/geldigheidsduur, tegenover historisch B of 1 jaar na bedrijfsvoeringsbelang.

**8. Mogelijke interpretaties (A/F).** Het kan om externe gebruikstoestemming gaan, of om een intern beveiligings-/autorisatieobject. Beide historische waarderingsvarianten blijven afhankelijk van het beschermde archief en de onmisbaarheid.

**9. Risico's.** Een intern rechtenbestand als extern toestemmingsdossier behandelen kan zowel verkeerde dossiervorming als een onjuiste termijnsuggestie opleveren.

**10. Voorgestelde conclusie.** **3. Onvoldoende onderbouwde relatie** — uitsluitend voorstel voor inhoudelijke beoordeling.

**11. Zekerheid en onzekerheid.** Beperkt: zowel de procesrol als het historische toepassingsbereik ontbreken. Geen onafhankelijk menselijk archivistisch oordeel vastgesteld.

**12. Aanbevolen vervolghandeling.** Vraag vaststelling van actor, gebruiker, informatieobject, onmisbaarheid voor raadpleging en waardering van het beschermde archief. Behoud onzekerheid; voeg nu geen binding toe. Deze actie is niet uitgevoerd.

**13. Oordeel inhoudelijke beoordelaar.** Status: **te beoordelen**. Beoordelaar: … Datum: … Oordeel (bevestigen/verwerpen/aanvullen): … Motivering en aanvullende bronverwijzingen: …

## concordans:rij:90

**1. Identificatie.** Blad1, rij 90; probleemgroep `concordans:rij:90`.

**2. Onderzoeksvraag.** Kan een beveiligingsplan onder meerdere historische waarderingen vallen?

**3. Letterlijke oorspronkelijke brongegevens.**

| Kolom | Oorspronkelijke cel | Werkelijk uitgevouwen cel |
| --- | --- | --- |
| A | Leeg | 12. Beheer, beveiliging en programmatuur |
| B | Leeg | Leeg |
| C | Beveiliging (als plan) | Beveiliging (als plan) |
| D | Leeg | Leeg |
| E | Plannen opstellen | Plannen opstellen |
| F | 3.1 | 3.1 |
| G | Vastgesteld | Vastgesteld |
| H | Leeg | Leeg |
| I | 10 jaar na einde duur | 10 jaar na einde duur |

**4. Betrokken officiële voorschriften (E: waardering, termijn en aanvang; C/D/F: object, bereik en kandidaten).** B is letterlijk bewaren volgens de bronlegenda. Waar de waarderingsletter leeg is, staat de termijn letterlijk vermeld; er wordt geen V in de brontekst gezet.

- `1996-2012:2.12::001` — **- betrekking hebbend op archiefbescheiden, die voor bewaring in aanmerking komen**. Officiële omschrijving:  - betrekking hebbend op archiefbescheiden, die voor bewaring in aanmerking komen Waardering: B Termijn: **B**. Procestermijn: Geen afzonderlijke bronwaarde (zie status/context). (`geen_afzonderlijke_kolom_in_bron`). Aanvang: Geen afzonderlijke bronwaarde (zie status/context). (`raadpleeg_algemene_bepalingen`). Voorwaarden: raadpleeg officiele_omschrijving, broncontext, algemene_bepalingen; rubriekcontext rubriekcontext.json#2.12 en algemene beginselen 1.4. Bron: `1996-2012-officieel`, PDF p.23.
- `1996-2012:2.12::002` — **- overige gevallen**. Officiële omschrijving:  - overige gevallen Waardering: Geen afzonderlijke bronwaarde (zie status/context). Termijn: **1 jaar na vervallen van het belang voor de bedrijfsvoering **. Procestermijn: Geen afzonderlijke bronwaarde (zie status/context). (`geen_afzonderlijke_kolom_in_bron`). Aanvang: 1 jaar na vervallen van het belang voor de bedrijfsvoering  (`in_termijntekst_behouden`). Voorwaarden: raadpleeg officiele_omschrijving, broncontext, algemene_bepalingen; rubriekcontext rubriekcontext.json#2.12 en algemene beginselen 1.4. Bron: `1996-2012-officieel`, PDF p.23.
- `2020:3.1` — **Vastgesteld**. Officiële omschrijving: Geen afzonderlijke bronwaarde (zie status/context). Waardering: Vernietigen Termijn: **5 jaar**. Procestermijn: De tijdens het proces vast te
leggen datum waarop de gel-
digheid van het procesobject
komt te vervallen (`letterlijk_overgenomen`). Aanvang: Tijdens de procesuitvoering wordt de datum bepaald wanneer het procesobject haar geldigheid zal verliezen. Tot dat moment loopt de procestermijn. (`letterlijke_legenda_bij_procestermijn_geen_datumberekening`). Voorwaarden: raadpleeg officiele_omschrijving, procesomschrijving, toelichting, algemene_bepalingen; procesomschrijving: Opstellen van plannen voor een in het plan afgebakende
periode die richting geeft voor wat er in die periode moet
gebeuren / verwacht wordt dat er gaat gebeuren.; procesobject: Het plan. Officiële toelichting: Dit gaat om processen op het gebied van bedrijfsvoering: b.v.
persoonlijk ontwikkelingsplan, plan Wet Poortwachter, glad-
heidsbestrijdingsplan, plan van aanpak re-integratie Bron: `2020-officieel`, PDF p.27.
- `2020:3.1.2` — **Beheerplan**. Officiële omschrijving: Beheerplan Waardering: Vernietigen Termijn: **10 jaar**. Procestermijn: De tijdens het proces vast te
leggen datum waarop de gel-
digheid van het procesobject
komt te vervallen (`letterlijk_overgenomen`). Aanvang: Tijdens de procesuitvoering wordt de datum bepaald wanneer het procesobject haar geldigheid zal verliezen. Tot dat moment loopt de procestermijn. (`letterlijke_legenda_bij_procestermijn_geen_datumberekening`). Voorwaarden: raadpleeg officiele_omschrijving, procesomschrijving, toelichting, algemene_bepalingen; procesomschrijving: Opstellen van plannen voor een in het plan afgebakende
periode die richting geeft voor wat er in die periode moet
gebeuren / verwacht wordt dat er gaat gebeuren.; procesobject: Het plan. Officiële toelichting: Onderhoudsplan, rioleringsplan t.b.v. onderhoud, wegen-
beheerplan Bron: `2020-officieel`, PDF p.27.

**5. Bronverwijzingen (G).** Blad1 rij 90; de recordbronnen en paginanummers hierboven, plus het gemeenschappelijke kader PDF 1996 p.8–9 en 2020 p.10/25. De primaire PDF p.23 bevestigt het historische onderscheid; PDF p.27 onderscheidt generiek 3.1 en Beheerplan 3.1.2. Gelijke tienjaarstekst alleen bewijst geen type-identiteit. B:D van rij 90 zijn niet samengevoegd.

**6. Overeenkomsten (B/C).** Een plan voor beveiliging of beheer kan een bedrijfsvoeringsplan zijn; de historische rubriek omvat beheer/beveiliging van geautomatiseerde administraties voor zover onmisbaar voor raadpleging.

**7. Verschillen (D/E).** De historische waardering volgt het soort beschermd archief (B of 1 jaar na bedrijfsvoeringsbelang), niet alleen het woord plan. Bron F90 noemt 3.1 met 10 jaar na einde duur; officieel generiek 3.1 heeft 5 jaar, terwijl specifiek 3.1.2 Beheerplan 10 jaar heeft. De officiële voorbeelden bij 3.1.2 betreffen onderhoud; niet ieder beveiligingsplan is daarmee een beheerplan.

**8. Mogelijke interpretaties (A/F).** Afhankelijk van archiefwaarde en onmisbaarheid kunnen beide oude voorschriften inhoudelijk relevant zijn. 3.1.2 is een nieuwe onderzoekskandidaat voor de termijntegenstrijdigheid, geen bewezen vervanging van de expliciete 3.1-verwijzing.

**9. Risico's.** Alle plannen onder één vernietigingstermijn brengen kan de historische blijvende bewaring en de voorrang van specifieke moderne resultaten verhullen.

**10. Voorgestelde conclusie.** **2. Meerdere inhoudelijk verdedigbare relaties** — uitsluitend voorstel voor inhoudelijke beoordeling.

**11. Zekerheid en onzekerheid.** Matig voor meerdere conditionele vergelijkingsrichtingen, beperkt voor een concreet plan. Geen onafhankelijk menselijk archivistisch oordeel vastgesteld.

**12. Aanbevolen vervolghandeling.** Laat vaststellen welk plan en welk beschermd archief zijn bedoeld. Na bevestiging eventueel meerdere conditionele historische relaties registreren; generiek/specifiek doel afzonderlijk beoordelen. Deze actie is niet uitgevoerd.

**13. Oordeel inhoudelijke beoordelaar.** Status: **te beoordelen**. Beoordelaar: … Datum: … Oordeel (bevestigen/verwerpen/aanvullen): … Motivering en aanvullende bronverwijzingen: …

## concordans:rij:293

**1. Identificatie.** Blad1, rij 293; probleemgroep `concordans:rij:293`.

**2. Onderzoeksvraag.** Welke delegatie-/mandaatcategorie kan een beëindigde status betreffen?

**3. Letterlijke oorspronkelijke brongegevens.**

| Kolom | Oorspronkelijke cel | Werkelijk uitgevouwen cel |
| --- | --- | --- |
| A | Leeg | 4. Bestuur |
| B | Leeg | Leeg |
| C | Leeg | Leeg |
| D | Leeg | Leeg |
| E | Leeg | Status toekennen |
| F | 9.3.3 | 9.3.3 |
| G | Beëindigd | Beëindigd |
| H | Delegatie en mandatering  | Delegatie en mandatering  |
| I | Bewaren | Bewaren |

**4. Betrokken officiële voorschriften (E: waardering, termijn en aanvang; C/D/F: object, bereik en kandidaten).** B is letterlijk bewaren volgens de bronlegenda. Waar de waarderingsletter leeg is, staat de termijn letterlijk vermeld; er wordt geen V in de brontekst gezet.

- `1996-2012:3.5.4::001` — **- tussen bestuurders onderling**. Officiële omschrijving:  - tussen bestuurders onderling Waardering: B Termijn: **B**. Procestermijn: Geen afzonderlijke bronwaarde (zie status/context). (`geen_afzonderlijke_kolom_in_bron`). Aanvang: Geen afzonderlijke bronwaarde (zie status/context). (`raadpleeg_algemene_bepalingen`). Voorwaarden: raadpleeg officiele_omschrijving, broncontext, algemene_bepalingen; rubriekcontext rubriekcontext.json#3.5.4 en algemene beginselen 1.4. Bron: `1996-2012-officieel`, PDF p.39.
- `1996-2012:3.5.4::002` — **- van bestuurders naar ambtenaren**. Officiële omschrijving:  - van bestuurders naar ambtenaren Waardering: Geen afzonderlijke bronwaarde (zie status/context). Termijn: **30 jaar na vervallen besluit**. Procestermijn: Geen afzonderlijke bronwaarde (zie status/context). (`geen_afzonderlijke_kolom_in_bron`). Aanvang: 30 jaar na vervallen besluit (`in_termijntekst_behouden`). Voorwaarden: raadpleeg officiele_omschrijving, broncontext, algemene_bepalingen; rubriekcontext rubriekcontext.json#3.5.4 en algemene beginselen 1.4. Bron: `1996-2012-officieel`, PDF p.39.
- `1996-2012:3.5.4::003` — **- tussen ambtenaren**. Officiële omschrijving:  - tussen ambtenaren Waardering: Geen afzonderlijke bronwaarde (zie status/context). Termijn: **20 jaar na vervallen besluit**. Procestermijn: Geen afzonderlijke bronwaarde (zie status/context). (`geen_afzonderlijke_kolom_in_bron`). Aanvang: 20 jaar na vervallen besluit (`in_termijntekst_behouden`). Voorwaarden: raadpleeg officiele_omschrijving, broncontext, algemene_bepalingen; rubriekcontext rubriekcontext.json#3.5.4 en algemene beginselen 1.4. Bron: `1996-2012-officieel`, PDF p.39.
- `2020:9.3.3` — **Delegatie en mandatering**. Officiële omschrijving: Delegatie en mandatering Waardering: Bewaren Termijn: **Geen afzonderlijke bronwaarde (zie status/context).**. Procestermijn: Geen afzonderlijke bronwaarde (zie status/context). (`niet_ingevuld_in_bron`). Aanvang: Geen afzonderlijke bronwaarde (zie status/context). (`raadpleeg_procestermijn_toelichting_en_algemene_bepalingen`). Voorwaarden: raadpleeg officiele_omschrijving, procesomschrijving, toelichting, algemene_bepalingen; procesomschrijving: Het toepassen van de publieke bevoegdheden als overheids-
orgaan om personen, objecten of immateriële zaken een
bepaalde status toe te kennen.; procesobject: De status. Bron: `2020-officieel`, PDF p.33.

**5. Bronverwijzingen (G).** Blad1 rij 293; de recordbronnen en paginanummers hierboven, plus het gemeenschappelijke kader PDF 1996 p.8–9 en 2020 p.10/25. PDF p.39 toont alle drie categorieën onder hetzelfde kopje. A289:A293 en E290:E293 geven gedeelde context; de lege B:D-cellen bepalen geen actor.

**6. Overeenkomsten (B/C).** De historische rubriek noemt delegatie, mandatering en attributie; 9.3.3 noemt delegatie en mandatering bij beëindigde status.

**7. Verschillen (D/E).** Historisch worden actorrelaties onderscheiden: bestuurders onderling B, bestuurders naar ambtenaren 30 jaar na vervallen besluit, ambtenaren onderling 20 jaar na vervallen besluit. 2020:9.3.3 is Bewaren en heeft geen afzonderlijk ingevulde procestermijn/aanvang. Attributie staat niet letterlijk in de specifieke moderne omschrijving.

**8. Mogelijke interpretaties (A/F).** Alle drie actorrelaties kunnen bij delegatie/mandatering relevant zijn. Voor attributie is geen zelfstandige dekking bewezen. De brede moderne categorie geeft geen reden alleen de nabijgelegen ambtenarencategorie te kiezen.

**9. Risico's.** Een keuze voor alleen de laatste rij verliest andere actorrelaties. Een moderne B-waardering met terugwerkende kracht toepassen zou historische termijnen overschrijven.

**10. Voorgestelde conclusie.** **2. Meerdere inhoudelijk verdedigbare relaties** — uitsluitend voorstel voor inhoudelijke beoordeling.

**11. Zekerheid en onzekerheid.** Matig voor meerdere inhoudelijk relevante relaties; onvoldoende voor een unieke actor of voor attributie. Geen onafhankelijk menselijk archivistisch oordeel vastgesteld.

**12. Aanbevolen vervolghandeling.** Na bevestiging van proces/object eventueel meerdere expliciete relaties met actorvoorwaarden registreren. Behoud oorspronkelijke termijnen en onderscheid attributie; nu geen activering. Deze actie is niet uitgevoerd.

**13. Oordeel inhoudelijke beoordelaar.** Status: **te beoordelen**. Beoordelaar: … Datum: … Oordeel (bevestigen/verwerpen/aanvullen): … Motivering en aanvullende bronverwijzingen: …

## concordans:rij:434

**1. Identificatie.** Blad1, rij 434; probleemgroep `concordans:rij:434`.

**2. Onderzoeksvraag.** Is optie inhoudelijk aan nationaliteitsonderzoek of naturalisatie te verbinden?

**3. Letterlijke oorspronkelijke brongegevens.**

| Kolom | Oorspronkelijke cel | Werkelijk uitgevouwen cel |
| --- | --- | --- |
| A | Leeg | 3. Nationaliteit |
| B | Leeg | Leeg |
| C | Leeg | Leeg |
| D | Leeg | Leeg |
| E | Leeg | Aangiften behandelen |
| F | 7.1.23 | 7.1.23 |
| G | Verwerkt | Verwerkt |
| H | Optieverklaring Nederlanderschap | Optieverklaring Nederlanderschap |
| I | Vernietigen na 12 jaar | Vernietigen na 12 jaar |

**4. Betrokken officiële voorschriften (E: waardering, termijn en aanvang; C/D/F: object, bereik en kandidaten).** B is letterlijk bewaren volgens de bronlegenda. Waar de waarderingsletter leeg is, staat de termijn letterlijk vermeld; er wordt geen V in de brontekst gezet.

- `1996-2012:3.7.3::001` — **Onderzoek naar de nationaliteit**. Officiële omschrijving: Onderzoek naar de nationaliteit Waardering: Geen afzonderlijke bronwaarde (zie status/context). Termijn: **12 jaar na bekendmaking**. Procestermijn: Geen afzonderlijke bronwaarde (zie status/context). (`geen_afzonderlijke_kolom_in_bron`). Aanvang: 12 jaar na bekendmaking (`in_termijntekst_behouden`). Voorwaarden: raadpleeg officiele_omschrijving, broncontext, algemene_bepalingen; rubriekcontext rubriekcontext.json#3.7.3 en algemene beginselen 1.4. Bron: `1996-2012-officieel`, PDF p.50.
- `1996-2012:3.7.3::002` — **Naturalisatieprocedure: bescheiden betreffende verkrijging en verlies van het Nederlanderschap**. Officiële omschrijving: Naturalisatieprocedure: bescheiden betreffende verkrijging en verlies van het Nederlanderschap Waardering: Geen afzonderlijke bronwaarde (zie status/context). Termijn: **12 jaar na bekendmaking**. Procestermijn: Geen afzonderlijke bronwaarde (zie status/context). (`geen_afzonderlijke_kolom_in_bron`). Aanvang: 12 jaar na bekendmaking (`in_termijntekst_behouden`). Voorwaarden: raadpleeg officiele_omschrijving, broncontext, algemene_bepalingen; rubriekcontext rubriekcontext.json#3.7.3 en algemene beginselen 1.4. Bron: `1996-2012-officieel`, PDF p.50.
- `2020:7.1.23` — **Optieverklaring Nederlan- derschap**. Officiële omschrijving: Optieverklaring Nederlan-
derschap Waardering: Vernietigen Termijn: **12 jaar**. Procestermijn: Nihil (`letterlijk_overgenomen`). Aanvang: A Nihil = Er is geen aparte procestermijn, de bewaartermijn start direct. (`letterlijke_legenda_bij_procestermijn_geen_datumberekening`). Voorwaarden: raadpleeg officiele_omschrijving, procesomschrijving, toelichting, algemene_bepalingen; procesomschrijving: Het behandelen van een aangifte van een bepaald feit, situ-
atie of voornemen waar een inwoner op basis van wet- en
regelgeving toe verplicht is.; procesobject: De aangifte. Bron: `2020-officieel`, PDF p.30.

**5. Bronverwijzingen (G).** Blad1 rij 434; de recordbronnen en paginanummers hierboven, plus het gemeenschappelijke kader PDF 1996 p.8–9 en 2020 p.10/25. PDF p.50 onderscheidt twee historische handelingen; PDF p.30 noemt uitsluitend Optieverklaring Nederlanderschap. E433:E434 verbindt procescontext, niet de lege B:D. De meegeleverde publicaties bevatten geen uitgewerkt oud optieproces waarmee kandidaten definitief zijn af te grenzen.

**6. Overeenkomsten (B/C).** Alle genoemde voorschriften raken de nationaliteit of verkrijging/verlies van Nederlanderschap.

**7. Verschillen (D/E).** Historisch staan Onderzoek naar de nationaliteit en Naturalisatieprocedure apart, beide 12 jaar na bekendmaking. Het moderne resultaat noemt specifiek optieverklaring en een aangifte; Nihil plus 12 jaar levert niet hetzelfde expliciet genoemde aanvangsmoment op. De selectielijsten leveren geen juridische gelijkstelling van optie en naturalisatie.

**8. Mogelijke interpretaties (A/F).** Een optieverklaring kan stukken van onderzoek bevatten, maar daarmee is het volledige optieproces niet gelijk aan naturalisatie. Mogelijk is slechts een gedeeltelijke historische documentrelatie verdedigbaar.

**9. Risico's.** Gelijke twaalfjaarstermijnen kunnen een ten onrechte gelijkgestelde procedure en een fout startmoment suggereren.

**10. Voorgestelde conclusie.** **3. Onvoldoende onderbouwde relatie** — uitsluitend voorstel voor inhoudelijke beoordeling.

**11. Zekerheid en onzekerheid.** Beperkt: thematische verwantschap staat vast, procedurele identiteit ontbreekt. Geen onafhankelijk menselijk archivistisch oordeel vastgesteld.

**12. Aanbevolen vervolghandeling.** Laat een informatieprofessional de toenmalige nationaliteitsprocedure en concrete informatieobjecten toetsen, zo nodig met aanvullende historische wettelijke/procedurebronnen. Geen één-op-éénrelatie activeren. Deze actie is niet uitgevoerd.

**13. Oordeel inhoudelijke beoordelaar.** Status: **te beoordelen**. Beoordelaar: … Datum: … Oordeel (bevestigen/verwerpen/aanvullen): … Motivering en aanvullende bronverwijzingen: …

## concordans:rij:442

**1. Identificatie.** Blad1, rij 442; probleemgroep `concordans:rij:442`.

**2. Onderzoeksvraag.** Welke historische rijbewijsdossiers kunnen een fraudemelding omvatten?

**3. Letterlijke oorspronkelijke brongegevens.**

| Kolom | Oorspronkelijke cel | Werkelijk uitgevouwen cel |
| --- | --- | --- |
| A | Leeg | 6. Rijbewijzen |
| B | Leeg | Leeg |
| C | Leeg | Leeg |
| D | Leeg | Leeg |
| E | Aangiften behandelen | Aangiften behandelen |
| F | 7.1.24 | 7.1.24 |
| G | Verwerkt | Verwerkt |
| H | Fraude melding rijbewijs | Fraude melding rijbewijs |
| I | Vernietigen na 1 jaar na verallen geldigheid rijbewijs | Vernietigen na 1 jaar na verallen geldigheid rijbewijs |

**4. Betrokken officiële voorschriften (E: waardering, termijn en aanvang; C/D/F: object, bereik en kandidaten).** B is letterlijk bewaren volgens de bronlegenda. Waar de waarderingsletter leeg is, staat de termijn letterlijk vermeld; er wordt geen V in de brontekst gezet.

- `1996-2012:3.7.6::001` — **Aanvraag en afgifte (inclusief vernieuwing)**. Officiële omschrijving: Aanvraag en afgifte (inclusief vernieuwing) Waardering: Geen afzonderlijke bronwaarde (zie status/context). Termijn: **11 jaar**. Procestermijn: Geen afzonderlijke bronwaarde (zie status/context). (`geen_afzonderlijke_kolom_in_bron`). Aanvang: Geen afzonderlijke bronwaarde (zie status/context). (`raadpleeg_algemene_bepalingen`). Voorwaarden: raadpleeg officiele_omschrijving, broncontext, algemene_bepalingen; rubriekcontext rubriekcontext.json#3.7.6 en algemene beginselen 1.4. Bron: `1996-2012-officieel`, PDF p.52.
- `1996-2012:3.7.6::002` — **Ongeldig verklaring door burgemeester en inneming**. Officiële omschrijving: Ongeldig verklaring door burgemeester en inneming Waardering: Geen afzonderlijke bronwaarde (zie status/context). Termijn: **1 jaar**. Procestermijn: Geen afzonderlijke bronwaarde (zie status/context). (`geen_afzonderlijke_kolom_in_bron`). Aanvang: Geen afzonderlijke bronwaarde (zie status/context). (`raadpleeg_algemene_bepalingen`). Voorwaarden: raadpleeg officiele_omschrijving, broncontext, algemene_bepalingen; rubriekcontext rubriekcontext.json#3.7.6 en algemene beginselen 1.4. Bron: `1996-2012-officieel`, PDF p.52.
- `2020:7.1.24` — **Fraude melding rijbewijs**. Officiële omschrijving: Fraude melding rijbewijs Waardering: Vernietigen Termijn: **1 jaar**. Procestermijn: De procestermijn is samenge-
voegd met de bewaartermijn (`letterlijk_overgenomen`). Aanvang: Geen afzonderlijke bronwaarde (zie status/context). (`raadpleeg_procestermijn_toelichting_en_algemene_bepalingen`). Voorwaarden: raadpleeg officiele_omschrijving, procesomschrijving, toelichting, algemene_bepalingen; procesomschrijving: Het behandelen van een aangifte van een bepaald feit, situ-
atie of voornemen waar een inwoner op basis van wet- en
regelgeving toe verplicht is.; procesobject: De aangifte. Officiële toelichting: Na verloop originele geldigheidsduur rijbewijs Bron: `2020-officieel`, PDF p.30.

**5. Bronverwijzingen (G).** Blad1 rij 442; de recordbronnen en paginanummers hierboven, plus het gemeenschappelijke kader PDF 1996 p.8–9 en 2020 p.10/25. PDF p.52 noemt beide historische handelingen; PDF p.30 specificeert de geldigheidsduur als anker. A440:A443 geeft alleen rubriekcontext; B:D blijven leeg.

**6. Overeenkomsten (B/C).** Een fraudemelding kan samenhangen met aanvraag/afgifte of met ongeldigverklaring en inneming van een rijbewijs.

**7. Verschillen (D/E).** Historisch aanvraag/afgifte 11 jaar en ongeldigverklaring 1 jaar; de afzonderlijke aanvang is niet vastgelegd. Het moderne aangifteresultaat is 1 jaar met samengevoegde procestermijn en toelichting Na verloop originele geldigheidsduur rijbewijs. Het informatieobject melding is niet vanzelf het gehele rijbewijsdossier.

**8. Mogelijke interpretaties (A/F).** Voorwaardelijk zijn beide historische procesrichtingen verdedigbaar. Een melding die geen ongeldigverklaring oplevert hoeft niet onder die laatste categorie te vallen; een daadwerkelijke afgiftezaak omvat meer dan de melding.

**9. Risico's.** De overeenkomstige éénjaarstermijn gebruiken als identiteitsbewijs kan afgiftegegevens te kort bewaren of het verschil tussen melding en besluit wissen.

**10. Voorgestelde conclusie.** **2. Meerdere inhoudelijk verdedigbare relaties** — uitsluitend voorstel voor inhoudelijke beoordeling.

**11. Zekerheid en onzekerheid.** Matig voor twee mogelijke procesrichtingen, beperkt voor een bepaalde melding. Geen onafhankelijk menselijk archivistisch oordeel vastgesteld.

**12. Aanbevolen vervolghandeling.** Beschrijf eerst de dossiergrens, uitkomst van de melding en originele geldigheidsduur. Registreer na bevestiging zo nodig meerdere conditionele documentrelaties; behoud de brononzekerheid tot die tijd. Deze actie is niet uitgevoerd.

**13. Oordeel inhoudelijke beoordelaar.** Status: **te beoordelen**. Beoordelaar: … Datum: … Oordeel (bevestigen/verwerpen/aanvullen): … Motivering en aanvullende bronverwijzingen: …

## concordans:rij:50

**1. Identificatie.** Blad1, rij 50; probleemgroep `statistische_scope_2.8`.

**2. Onderzoeksvraag.** Wat betekent de weglating en aan bij deze afzonderlijke doelverwijzing?

**3. Letterlijke oorspronkelijke brongegevens.**

| Kolom | Oorspronkelijke cel | Werkelijk uitgevouwen cel |
| --- | --- | --- |
| A | 8. Statistisch onderzoek | 8. Statistisch onderzoek |
| B | a. | a. |
| C | Door de gemeente verstrekte statistische opgaven voor zover zij niet van belang zijn | Door de gemeente verstrekte statistische opgaven voor zover zij niet van belang zijn |
| D | 3 jaar | 3 jaar |
| E | Informeren | Informeren |
| F | 20.1 | 20.1 |
| G | Uitgevoerd | Uitgevoerd |
| H | Leeg | Leeg |
| I | Vernietigen na 1 jaar | Vernietigen na 1 jaar |

**4. Betrokken officiële voorschriften (E: waardering, termijn en aanvang; C/D/F: object, bereik en kandidaten).** B is letterlijk bewaren volgens de bronlegenda. Waar de waarderingsletter leeg is, staat de termijn letterlijk vermeld; er wordt geen V in de brontekst gezet.

- `1996-2012:2.8::001` — **Door en aan de gemeente verstrekte statistische opgaven voor zover zij niet van belang zijn**. Officiële omschrijving: Door en aan de gemeente verstrekte statistische opgaven voor zover zij niet van belang zijn Waardering: Geen afzonderlijke bronwaarde (zie status/context). Termijn: **3 jaar**. Procestermijn: Geen afzonderlijke bronwaarde (zie status/context). (`geen_afzonderlijke_kolom_in_bron`). Aanvang: Geen afzonderlijke bronwaarde (zie status/context). (`raadpleeg_algemene_bepalingen`). Voorwaarden: raadpleeg officiele_omschrijving, broncontext, algemene_bepalingen; rubriekcontext rubriekcontext.json#2.8 en algemene beginselen 1.4. Bron: `1996-2012-officieel`, PDF p.21.
- `1996-2012:2.8::002` — **Wel van betekenis en niet of nauwelijks te reconstrueren statistische opgaven. Voorbeelden hiervan zijn gemeentelijke sociaaleconomische en geografische onderzoeken en opgaven, zoals de loop en de leeftijdsopbouw van de bevolking, de woningvoorraad en het bodemgebruik**. Officiële omschrijving: Wel van betekenis en niet of nauwelijks te reconstrueren statistische opgaven. Voorbeelden hiervan zijn gemeentelijke sociaaleconomische en geografische onderzoeken en opgaven, zoals de loop en de leeftijdsopbouw van de bevolking, de woningvoorraad en het bodemgebruik Waardering: B Termijn: **B**. Procestermijn: Geen afzonderlijke bronwaarde (zie status/context). (`geen_afzonderlijke_kolom_in_bron`). Aanvang: Geen afzonderlijke bronwaarde (zie status/context). (`raadpleeg_algemene_bepalingen`). Voorwaarden: raadpleeg officiele_omschrijving, broncontext, algemene_bepalingen; rubriekcontext rubriekcontext.json#2.8 en algemene beginselen 1.4. Bron: `1996-2012-officieel`, PDF p.21.
- `2020:20.1` — **Uitgevoerd**. Officiële omschrijving: Geen afzonderlijke bronwaarde (zie status/context). Waardering: Vernietigen Termijn: **1 jaar**. Procestermijn: Nihil (`letterlijk_overgenomen`). Aanvang: A Nihil = Er is geen aparte procestermijn, de bewaartermijn start direct. (`letterlijke_legenda_bij_procestermijn_geen_datumberekening`). Voorwaarden: raadpleeg officiele_omschrijving, procesomschrijving, toelichting, algemene_bepalingen; procesomschrijving: Het op initiatief van het orgaan samenstellen en verspreiden
van informatie over zaken van het orgaan die interne of
externe derden aangaan; procesobject: De verstrekte of gepubli-
ceerde informatie. Officiële toelichting: Ter inzage legging voor derde, representatie, aanmelding bij
verzekering Bron: `2020-officieel`, PDF p.38.

**5. Bronverwijzingen (G).** Blad1 rij 50; de recordbronnen en paginanummers hierboven, plus het gemeenschappelijke kader PDF 1996 p.8–9 en 2020 p.10/25. PDF p.21 bevestigt letterlijk door en aan en de naburige B-categorie; PDF p.9 noemt samenvattende gegevens zoals statistieken bij uitzonderingen. C50:C52 is één echte merge: drie doelverwijzingen, één gedeeld tekstprobleem.

**6. Overeenkomsten (B/C).** De technische rij-identiteit wijst op hetzelfde historische statistiekvoorschrift; doel en bron raken statistische informatie.

**7. Verschillen (D/E).** De concordans noemt alleen door de gemeente verstrekte opgaven; de officiële tekst noemt door en aan. Uitgaande en inkomende informatiestromen zijn taalkundig niet dezelfde verzameling. Historisch niet van belang: 3 jaar; wel van betekenis/niet of nauwelijks te reconstrueren: B. Het moderne doel heeft Nihil en 1 jaar.

**8. Mogelijke interpretaties (A/F).** Informeren gaat over door het orgaan samengestelde en verspreide informatie; dat ondersteunt een mogelijke uitgaande deelverzameling, maar bewijst de bedoeling van de inkorting niet. Redactionele verkorting en een bewuste deelverzameling zijn beide hypotheses; geen auteursverklaring of wijzigingsmotivering is aangetroffen.

**9. Risico's.** De verkorte tekst als volledig historisch toepassingsbereik tonen kan ontvangen opgaven onzichtbaar maken; alle statistiek vernietigbaar noemen kan de B-categorie en uitzonderingscriteria negeren.

**10. Voorgestelde conclusie.** **5. Bronafwijking zonder gevolgen voor de technische koppeling** — uitsluitend voorstel voor inhoudelijke beoordeling.

**11. Zekerheid en onzekerheid.** Hoog voor de tekstuele afwijking en technische identiteit; beperkt voor de bedoeling van de concordansauteur. Geen onafhankelijk menselijk archivistisch oordeel vastgesteld.

**12. Aanbevolen vervolghandeling.** Bestaande technische koppeling aan 2.8::001 behouden. Na inhoudelijke bevestiging een toelichting op de beperkte concordansformulering en de objectafbakening tonen; 2.8::002 is alleen aanvullende beoordelingscontext, geen voorgestelde recordwissel. Deze actie is niet uitgevoerd.

**13. Oordeel inhoudelijke beoordelaar.** Status: **te beoordelen**. Beoordelaar: … Datum: … Oordeel (bevestigen/verwerpen/aanvullen): … Motivering en aanvullende bronverwijzingen: …

## concordans:rij:51

**1. Identificatie.** Blad1, rij 51; probleemgroep `statistische_scope_2.8`.

**2. Onderzoeksvraag.** Wat betekent de weglating en aan bij deze afzonderlijke doelverwijzing?

**3. Letterlijke oorspronkelijke brongegevens.**

| Kolom | Oorspronkelijke cel | Werkelijk uitgevouwen cel |
| --- | --- | --- |
| A | Leeg | 8. Statistisch onderzoek |
| B | Leeg | a. |
| C | Leeg | Door de gemeente verstrekte statistische opgaven voor zover zij niet van belang zijn |
| D | Leeg | 3 jaar |
| E | Secretariaat voeren en gegevens administreren / verwerken  | Secretariaat voeren en gegevens administreren / verwerken  |
| F | 19.2 | 19.2 |
| G | Niet verwerkt | Niet verwerkt |
| H | Leeg | Leeg |
| I | Vernietigen na 1 jaar | Vernietigen na 1 jaar |

**4. Betrokken officiële voorschriften (E: waardering, termijn en aanvang; C/D/F: object, bereik en kandidaten).** B is letterlijk bewaren volgens de bronlegenda. Waar de waarderingsletter leeg is, staat de termijn letterlijk vermeld; er wordt geen V in de brontekst gezet.

- `1996-2012:2.8::001` — **Door en aan de gemeente verstrekte statistische opgaven voor zover zij niet van belang zijn**. Officiële omschrijving: Door en aan de gemeente verstrekte statistische opgaven voor zover zij niet van belang zijn Waardering: Geen afzonderlijke bronwaarde (zie status/context). Termijn: **3 jaar**. Procestermijn: Geen afzonderlijke bronwaarde (zie status/context). (`geen_afzonderlijke_kolom_in_bron`). Aanvang: Geen afzonderlijke bronwaarde (zie status/context). (`raadpleeg_algemene_bepalingen`). Voorwaarden: raadpleeg officiele_omschrijving, broncontext, algemene_bepalingen; rubriekcontext rubriekcontext.json#2.8 en algemene beginselen 1.4. Bron: `1996-2012-officieel`, PDF p.21.
- `1996-2012:2.8::002` — **Wel van betekenis en niet of nauwelijks te reconstrueren statistische opgaven. Voorbeelden hiervan zijn gemeentelijke sociaaleconomische en geografische onderzoeken en opgaven, zoals de loop en de leeftijdsopbouw van de bevolking, de woningvoorraad en het bodemgebruik**. Officiële omschrijving: Wel van betekenis en niet of nauwelijks te reconstrueren statistische opgaven. Voorbeelden hiervan zijn gemeentelijke sociaaleconomische en geografische onderzoeken en opgaven, zoals de loop en de leeftijdsopbouw van de bevolking, de woningvoorraad en het bodemgebruik Waardering: B Termijn: **B**. Procestermijn: Geen afzonderlijke bronwaarde (zie status/context). (`geen_afzonderlijke_kolom_in_bron`). Aanvang: Geen afzonderlijke bronwaarde (zie status/context). (`raadpleeg_algemene_bepalingen`). Voorwaarden: raadpleeg officiele_omschrijving, broncontext, algemene_bepalingen; rubriekcontext rubriekcontext.json#2.8 en algemene beginselen 1.4. Bron: `1996-2012-officieel`, PDF p.21.
- `2020:19.2` — **Niet verwerkt**. Officiële omschrijving: Geen afzonderlijke bronwaarde (zie status/context). Waardering: Vernietigen Termijn: **1 jaar**. Procestermijn: Nihil (`letterlijk_overgenomen`). Aanvang: A Nihil = Er is geen aparte procestermijn, de bewaartermijn start direct. (`letterlijke_legenda_bij_procestermijn_geen_datumberekening`). Voorwaarden: raadpleeg officiele_omschrijving, procesomschrijving, toelichting, algemene_bepalingen; procesomschrijving: Het door het orgaan in een van haar administraties verwerken
van aangeleverde, gemelde of geconstateerde gegevens,
zonder dat hier een inhoudelijke toetsing bij plaatsvindt; procesobject: De verwerkte gegevens. Bron: `2020-officieel`, PDF p.38.

**5. Bronverwijzingen (G).** Blad1 rij 51; de recordbronnen en paginanummers hierboven, plus het gemeenschappelijke kader PDF 1996 p.8–9 en 2020 p.10/25. PDF p.21 bevestigt letterlijk door en aan en de naburige B-categorie; PDF p.9 noemt samenvattende gegevens zoals statistieken bij uitzonderingen. C50:C52 is één echte merge: drie doelverwijzingen, één gedeeld tekstprobleem.

**6. Overeenkomsten (B/C).** De technische rij-identiteit wijst op hetzelfde historische statistiekvoorschrift; doel en bron raken statistische informatie.

**7. Verschillen (D/E).** De concordans noemt alleen door de gemeente verstrekte opgaven; de officiële tekst noemt door en aan. Uitgaande en inkomende informatiestromen zijn taalkundig niet dezelfde verzameling. Historisch niet van belang: 3 jaar; wel van betekenis/niet of nauwelijks te reconstrueren: B. Het moderne doel Niet verwerkt heeft Nihil en 1 jaar.

**8. Mogelijke interpretaties (A/F).** Niet verwerkt is een procesuitkomst, geen synoniem voor ontvangen of voor niet van belang. De brede officiële historische tekst omvat ook ontvangen opgaven; dossierfase en verwerking moeten worden vastgesteld. Redactionele verkorting en een bewuste deelverzameling zijn beide hypotheses; geen auteursverklaring of wijzigingsmotivering is aangetroffen.

**9. Risico's.** De verkorte tekst als volledig historisch toepassingsbereik tonen kan ontvangen opgaven onzichtbaar maken; alle statistiek vernietigbaar noemen kan de B-categorie en uitzonderingscriteria negeren.

**10. Voorgestelde conclusie.** **5. Bronafwijking zonder gevolgen voor de technische koppeling** — uitsluitend voorstel voor inhoudelijke beoordeling.

**11. Zekerheid en onzekerheid.** Hoog voor de tekstuele afwijking en technische identiteit; beperkt voor de bedoeling van de concordansauteur. Geen onafhankelijk menselijk archivistisch oordeel vastgesteld.

**12. Aanbevolen vervolghandeling.** Bestaande technische koppeling aan 2.8::001 behouden. Na inhoudelijke bevestiging een toelichting op de beperkte concordansformulering en de objectafbakening tonen; 2.8::002 is alleen aanvullende beoordelingscontext, geen voorgestelde recordwissel. Deze actie is niet uitgevoerd.

**13. Oordeel inhoudelijke beoordelaar.** Status: **te beoordelen**. Beoordelaar: … Datum: … Oordeel (bevestigen/verwerpen/aanvullen): … Motivering en aanvullende bronverwijzingen: …

## concordans:rij:52

**1. Identificatie.** Blad1, rij 52; probleemgroep `statistische_scope_2.8`.

**2. Onderzoeksvraag.** Wat betekent de weglating en aan bij deze afzonderlijke doelverwijzing?

**3. Letterlijke oorspronkelijke brongegevens.**

| Kolom | Oorspronkelijke cel | Werkelijk uitgevouwen cel |
| --- | --- | --- |
| A | Leeg | 8. Statistisch onderzoek |
| B | Leeg | a. |
| C | Leeg | Door de gemeente verstrekte statistische opgaven voor zover zij niet van belang zijn |
| D | Leeg | 3 jaar |
| E | Informeren | Informeren |
| F | 20.1.4 | 20.1.4 |
| G | Uitgevoerd | Uitgevoerd |
| H | Gegevens over woningstatistiek | Gegevens over woningstatistiek |
| I | Vernietigen na 5 jaar | Vernietigen na 5 jaar |

**4. Betrokken officiële voorschriften (E: waardering, termijn en aanvang; C/D/F: object, bereik en kandidaten).** B is letterlijk bewaren volgens de bronlegenda. Waar de waarderingsletter leeg is, staat de termijn letterlijk vermeld; er wordt geen V in de brontekst gezet.

- `1996-2012:2.8::001` — **Door en aan de gemeente verstrekte statistische opgaven voor zover zij niet van belang zijn**. Officiële omschrijving: Door en aan de gemeente verstrekte statistische opgaven voor zover zij niet van belang zijn Waardering: Geen afzonderlijke bronwaarde (zie status/context). Termijn: **3 jaar**. Procestermijn: Geen afzonderlijke bronwaarde (zie status/context). (`geen_afzonderlijke_kolom_in_bron`). Aanvang: Geen afzonderlijke bronwaarde (zie status/context). (`raadpleeg_algemene_bepalingen`). Voorwaarden: raadpleeg officiele_omschrijving, broncontext, algemene_bepalingen; rubriekcontext rubriekcontext.json#2.8 en algemene beginselen 1.4. Bron: `1996-2012-officieel`, PDF p.21.
- `1996-2012:2.8::002` — **Wel van betekenis en niet of nauwelijks te reconstrueren statistische opgaven. Voorbeelden hiervan zijn gemeentelijke sociaaleconomische en geografische onderzoeken en opgaven, zoals de loop en de leeftijdsopbouw van de bevolking, de woningvoorraad en het bodemgebruik**. Officiële omschrijving: Wel van betekenis en niet of nauwelijks te reconstrueren statistische opgaven. Voorbeelden hiervan zijn gemeentelijke sociaaleconomische en geografische onderzoeken en opgaven, zoals de loop en de leeftijdsopbouw van de bevolking, de woningvoorraad en het bodemgebruik Waardering: B Termijn: **B**. Procestermijn: Geen afzonderlijke bronwaarde (zie status/context). (`geen_afzonderlijke_kolom_in_bron`). Aanvang: Geen afzonderlijke bronwaarde (zie status/context). (`raadpleeg_algemene_bepalingen`). Voorwaarden: raadpleeg officiele_omschrijving, broncontext, algemene_bepalingen; rubriekcontext rubriekcontext.json#2.8 en algemene beginselen 1.4. Bron: `1996-2012-officieel`, PDF p.21.
- `2020:20.1.4` — **Gegevens over woning- statistiek**. Officiële omschrijving: Gegevens over woning-
statistiek Waardering: Vernietigen Termijn: **5 jaar**. Procestermijn: Nihil (`letterlijk_overgenomen`). Aanvang: A Nihil = Er is geen aparte procestermijn, de bewaartermijn start direct. (`letterlijke_legenda_bij_procestermijn_geen_datumberekening`). Voorwaarden: raadpleeg officiele_omschrijving, procesomschrijving, toelichting, algemene_bepalingen; procesomschrijving: Het op initiatief van het orgaan samenstellen en verspreiden
van informatie over zaken van het orgaan die interne of
externe derden aangaan; procesobject: De verstrekte of gepubli-
ceerde informatie. Bron: `2020-officieel`, PDF p.38.

**5. Bronverwijzingen (G).** Blad1 rij 52; de recordbronnen en paginanummers hierboven, plus het gemeenschappelijke kader PDF 1996 p.8–9 en 2020 p.10/25. PDF p.21 bevestigt letterlijk door en aan en de naburige B-categorie; PDF p.9 noemt samenvattende gegevens zoals statistieken bij uitzonderingen. C50:C52 is één echte merge: drie doelverwijzingen, één gedeeld tekstprobleem.

**6. Overeenkomsten (B/C).** De technische rij-identiteit wijst op hetzelfde historische statistiekvoorschrift; doel en bron raken statistische informatie.

**7. Verschillen (D/E).** De concordans noemt alleen door de gemeente verstrekte opgaven; de officiële tekst noemt door en aan. Uitgaande en inkomende informatiestromen zijn taalkundig niet dezelfde verzameling. Historisch niet van belang: 3 jaar; wel van betekenis/niet of nauwelijks te reconstrueren: B. Het moderne doel heeft Nihil en 5 jaar.

**8. Mogelijke interpretaties (A/F).** Woningstatistiek kan deels in een uitgaande statistiekstroom passen, maar de historische lijst noemt ook belangrijke of moeilijk te reconstrueren statistiek als B. Een modern specifiek onderwerp bewijst niet dat de oude opgaven onbelangrijk waren. Redactionele verkorting en een bewuste deelverzameling zijn beide hypotheses; geen auteursverklaring of wijzigingsmotivering is aangetroffen.

**9. Risico's.** De verkorte tekst als volledig historisch toepassingsbereik tonen kan ontvangen opgaven onzichtbaar maken; alle statistiek vernietigbaar noemen kan de B-categorie en uitzonderingscriteria negeren.

**10. Voorgestelde conclusie.** **5. Bronafwijking zonder gevolgen voor de technische koppeling** — uitsluitend voorstel voor inhoudelijke beoordeling.

**11. Zekerheid en onzekerheid.** Hoog voor de tekstuele afwijking en technische identiteit; beperkt voor de bedoeling van de concordansauteur. Geen onafhankelijk menselijk archivistisch oordeel vastgesteld.

**12. Aanbevolen vervolghandeling.** Bestaande technische koppeling aan 2.8::001 behouden. Na inhoudelijke bevestiging een toelichting op de beperkte concordansformulering en de objectafbakening tonen; 2.8::002 is alleen aanvullende beoordelingscontext, geen voorgestelde recordwissel. Deze actie is niet uitgevoerd.

**13. Oordeel inhoudelijke beoordelaar.** Status: **te beoordelen**. Beoordelaar: … Datum: … Oordeel (bevestigen/verwerpen/aanvullen): … Motivering en aanvullende bronverwijzingen: …

## Register, gebruik en validatie

Het bijbehorende [machineleesbare register](../controle/concordans-inhoudelijke-beoordeling.json) bevat dezelfde tien gevallen, dezelfde voorstellen, kandidaten en bronposities. Alle velden voor beoordelaar, datum en definitief oordeel zijn null. Het register wordt **niet** door applicatie, concordansmodule, build of preview als inhoudelijke goedkeuring geladen. Een beoordelaar kan een afzonderlijke versie aanvullen met motivering, naam/datum en bronnen; ook een ingevuld register activeert niet vanzelf een relatie. Een eventueel bevestigd vervolg moet later apart als technische wijziging ter beoordeling worden aangeboden.

Dit dossier publiceert geen oorspronkelijke PDF, Excel of volledige concordans. Alleen de tien voor het gevraagde onderzoek noodzakelijke bronrijpassages en officiële recordverwijzingen zijn opgenomen. Geen oorspronkelijke relatie-ID, broncel, officiële dataset, lexicon, bestaande beoordelingsstatus of gebruikersinterface is aangepast.

Validatie: de gerichte registertests controleren alle tien rijen, acht probleemgroepen, bestaande technische IDs, herleidbare bronpagina's, de nog lege beoordelingsvelden, letterlijke bronwaarden waar de echte bron beschikbaar is en afwezigheid van het register in de productie-uitvoer. De bestaande regressies worden met de echte bron uitgevoerd. De volledige bronidentiteits-/celcontrole blijft de voorafgaande technische validatie, geen onafhankelijk archivistisch oordeel.

Eindcontrole op 11 november 2026: **129 moduletests en 67 Chromium-browsertests geslaagd**, inclusief de daadwerkelijk uitgevoerde echte-brontests (nul overgeslagen). Productiebuild, typecheck, bronidentiteit/volledige celcontrole en publieke datasetvalidatie zijn geslaagd. De bestaande concordansinterface werkt in de regressierun ongewijzigd; het register ontbreekt in productie-uitvoer en runtime-imports. Een Git-diff bevestigt dat uitsluitend dit dossier, het nieuwe register en de beperkte registertests zijn toegevoegd. De bestaande 612/605/7-dekking en alle relatie-ID’s en statussen blijven intact.
