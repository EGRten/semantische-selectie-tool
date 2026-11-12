# Browserinterface en boomstructuren

## Selectielijsten raadplegen en downloaden — opdracht 16

De hoofdnavigatie bestaat nu uit **Zoeken en verkennen**, **Selectielijsten raadplegen** en **Concordans raadplegen**. De nieuwe raadpleegfunctie biedt één doorlopende tabel per officiële lijst: 494 / 305 / 346 voorschriften, eenvoudig tabelzoeken, links naar dezelfde details en terug naar de exacte rij. Alleen de gekozen dataset wordt geladen, met hergebruik van de bestaande cache.

De drie downloads heten exact `Selectielijst 1996-2012.xlsx`, `Selectielijst 2017.xlsx` en `Selectielijst 2020.xlsx`, met werkbladen `Selectiegegevens` en `Bronvermelding`. Zij bevatten alle voorschriften ongeacht zoekfilters, uitgebreide officiële gegevens, afzonderlijke annotaties/statussen, volledige controle-JSON en broncontext. De bestaande tekstuele publicatiegrondslag geldt binnen dezelfde afbakening; oorspronkelijke documenten en concordansdata worden niet toegevoegd. Zie [selectielijsten-raadplegen.md](selectielijsten-raadplegen.md) voor veldherkomst, rechten, links en tests.


## Doorlopende tabel en Excel-download — opdracht 15

De viewer toont nu alle 716 rijen in één doorlopende tabel, zonder paginering. Kolomkoppen en bronrijnummers blijven vast bij scrollen. Bronrijlinks markeren de rij en verschuiven de tabel ernaartoe. De knop **Download Concordans 1996-2020 (.xlsx)** maakt **Concordans 1996-2020.xlsx** met werkbladen **Concordans 1996-2020** en **Bronvermelding**. A–K blijven origineel, L–V zijn expliciet aanvullende uitgevouwen context en W is het bronrijnummer. Alle rijen worden geëxporteerd, ongeacht zoekfilters.

De schrijver wordt pas op aanvraag in de browser geladen; er is geen aparte Excel-dataset of backend. Gegevens, besluiten en koppelingen blijven intact. De broninhoud is afzonderlijk op concrete persoonsgegevens gecontroleerd; er zijn daarbij geen concrete persoonsgegevens aangetroffen en er zijn geen rijen of kolommen om privacyredenen weggelaten. Twee gevulde maker-/wijzigingsvelden uit de oorspronkelijke werkmapmetadata worden niet overgenomen. Zie [viewer](concordans-viewer.md) en [privacy en hergebruik](concordans-hergebruik.md#privacycontrole-opdracht-15).


## Concordansviewer — 11 november 2026

**Concordans raadplegen** ontsluit technisch alle 716 oorspronkelijke rijen en elf kolommen met zoeken, bladeren, rijpermalinks en koppelingen naar de bestaande voorschriften. Bronvelden, mergecontext, technische correcties en eigenaarbesluiten blijven gescheiden. De bestaande vergelijkingssectie linkt terug naar de bronviewer. Zie [concordans-viewer.md](concordans-viewer.md) voor bediening, testen en lokaal gebruik.

De gewone productiebuild bevat de compacte concordansprojectie voor raadplegen, vergelijken en downloaden. Bij ontbrekende of ongeldige data blijft een begrijpelijke foutmelding beschikbaar; de selectielijsten en zoekfuncties blijven werken. Voor bronvermelding en voorwaarden geldt [HERGEBRUIK.md](../HERGEBRUIK.md). GitHub Pages is niet geactiveerd.


De eerste browserinterface maakt de drie gemeentelijke selectielijsten afzonderlijk raadpleegbaar. De applicatie heeft geen zoekfunctie, backend, database, accounts, selectieadvies of ChatGPT Sites-integratie.

## Frontendopzet

De interface gebruikt TypeScript, semantische HTML en gewone CSS, zonder frontendframework of runtime-dependencies. De bestaande esbuild- en TypeScript-configuratie wordt hergebruikt. Playwright is uitsluitend toegevoegd als ontwikkeldependency voor echte browsertests. De bestaande gegevenslaag, datasets en eerdere testverwachtingen zijn ongewijzigd.

| Bestand | Verantwoordelijkheid |
| --- | --- |
| `src/interface/index.html` | Nederlandstalige paginastructuur, skiplink, header en footer. |
| `src/interface/main.ts` | Starten van de applicatie en melding bij een opstartfout. |
| `src/interface/app.ts` | Lijstkeuze, laadstatus, actieve dataset, wisselingen en foutafhandeling. |
| `src/interface/boom.ts` | Boomweergave, in-/uitklappen, actieve selectie en toetsenbordnavigatie. |
| `src/interface/details.ts` | Broodkruimels, bovenliggende context, officiële gegevens en bronannotaties. |
| `src/interface/dom.ts` | Kleine DOM-hulpfuncties en Nederlandstalige interfacebenamingen. |
| `src/interface/style.css` | Tweedelige desktopindeling, mobiele stapeling en zichtbare focus. |
| `scripts/bouw-interface.mjs` | Zelfstandige statische productiemap samenstellen. |
| `scripts/serve.mjs` | Lokale statische ontwikkel-/testserver; geen applicatiebackend. |
| `tests/browser/interface.spec.mjs` | Interactietests in Chromium met de werkelijke datasets. |
| `tests/productiebouw.test.mjs` | Bytebehoud van alle datasetbestanden in de productiebuild en relatieve ingangspaden. |

Bronteksten worden via `textContent` en tekstnodes toegevoegd, niet via HTML-injectie. De app haalt geen code, lettertypen, afbeeldingen of gegevens van externe diensten op. Externe bronlinks worden uitsluitend na een gebruikershandeling geopend.

## Ontwikkelen, testen en bouwen

Vereist: Node.js 22 of nieuwer en npm. Getest met Node.js 24.22.1, TypeScript 5.9.3, esbuild 0.28.2, Ajv 8.20.0, Playwright 1.65.0 en de beschikbare Chromium 156.0.8078.79.

```sh
npm ci
npm run dev
```

`dev` bouwt de applicatie en start de lokale statische preview op `http://127.0.0.1:4173/`. Na bronwijzigingen opnieuw bouwen of `dev` opnieuw starten; er is geen automatische watcher toegevoegd.

| Commando | Functie |
| --- | --- |
| `npm run typecheck` | Alle TypeScript-broncode controleren. |
| `npm run build:gegevenslaag` | De bestaande zelfstandige gegevenslaag met declaraties bouwen. |
| `npm run build` | Gegevenslaag en volledige statische interface bouwen. |
| `npm run preview` | De gebouwde `dist/site/` lokaal bekijken. |
| `npm run test:unit` | Bestaande gegevenslaagtests plus controle van de reeds gebouwde productiemap. |
| `npm run test:browser` | De reeds gebouwde interface met Playwright testen. |
| `npm test` | Eerst bouwen, daarna alle Node- en browsertests uitvoeren. |

Voor een reguliere Playwright-installatie is een testbrowser nodig: `npx playwright install chromium`. Een reeds aanwezige Chromium kan via de omgevingsvariabele `CHROMIUM_PATH` worden gebruikt. In deze omgeving is het volledige commando uitgevoerd als `CHROMIUM_PATH=/usr/bin/chromium npm test`; er is geen extra browser gedownload. De testserver gebruikt poort 4173 onder `/testpad/`; sluit een eigen preview op die poort vooraf af. Testuitvoer staat in `/tmp/semantische-selectie-browserresultaten`, buiten de repository.

De productiebuild staat in `dist/site/`. Die map bevat `index.html`, `interface/`, `gegevenslaag/`, de bestaande `datasets/` en `bronnen/`, plus de hergebruik- en privacytoelichting. Datasetbestanden worden byte-identiek gekopieerd, niet getransformeerd. Er is geen servercomponent nodig bij publicatie. Alle applicatie-, stylesheet-, bronbeschrijvings- en datasetpaden zijn relatief; de volledige map kan ook onder bijvoorbeeld `/selectietool/` staan. Gebruik HTTP(S), geen `file:`-URL. Er is geen deployment of definitieve publicatie uitgevoerd.

## Lijstkeuze en datasetisolatie

Bij het starten is nog geen selectielijst gekozen en wordt geen dataset geladen. De gebruiker kiest tussen 1996, actualisatie 2012; 2017; en 2020.

Eén instantie van `maakGegevenslaag()` verzorgt alle gegevensaanvragen. Uitsluitend `laadDataset()` van de gekozen lijst wordt aangeroepen; die laadt manifest, structuur en selectiegegevens. De interface gebruikt de bestaande sessiecache. Er worden geen zoeklexicons of concordansbestanden opgehaald.

Bij iedere lijstwisseling verdwijnen de vorige boom en selectie onmiddellijk. Er verschijnt een laadmelding; na laden begint de nieuwe boom volledig ingeklapt, zonder actieve selectie. Een oplopend aanvraagnummer voorkomt dat een vertraagd antwoord voor een vorige lijst de nieuwe boom overschrijft. Ook bij fouten worden geen gegevens van de vorige lijst opnieuw getoond.

## Boomnavigatie

Hoofdonderdelen, kinderen, ouders en paden komen rechtstreeks uit `hoofdonderdelen()`, `kinderen()`, `ouder()` en `padNaar()` van de gegevenslaag. Er wordt geen hiërarchie uit de notatie van codes afgeleid. De officiële volgorde blijft behouden.

1996/2012 toont hoofdstukken, taakvelden en rubrieken volgens hun opgeslagen ouderrelaties; niet iedere rubriek heeft een taakveld als ouder. Afzonderlijke voorschriftregels worden via `selectiegegevensBij()` als bladeren onder hun rubriek bereikbaar. Rubriek 3.6.2 bevat bijvoorbeeld 36 afzonderlijke voorschriften. De zichtbare code is altijd het oorspronkelijke `code`-veld; technische suffixen zoals `::001` worden niet als officiële code of zichtbare nummering gepresenteerd. De volledige benaming onderscheidt voorschriften die een code delen.

2017 en 2020 tonen procestypen met de opgeslagen generieke en specifieke resultaten. Een selectieregel met dezelfde canonieke ID als een structuurrecord wordt niet als extra blad gedupliceerd. Het bronveld `resultaattype` wordt in het detailpaneel getoond en is geen verzonnen extra boomniveau.

Klik op de pijl om een tak te openen of te sluiten; klik op de tekst om het onderdeel te selecteren. `Alles inklappen` sluit alle takken en houdt een zichtbare tabstop over. De details van een geselecteerd onderdeel blijven daarbij staan. Broodkruimels en de knop naar het bovenliggende onderdeel selecteren die context en openen de benodigde voorouders.

De ARIA-boom heeft één tabstop en ondersteunt:

- Pijl omhoog/omlaag: vorig/volgend zichtbaar onderdeel.
- Pijl rechts: tak openen of naar het eerste kind gaan.
- Pijl links: tak sluiten of naar de ouder gaan.
- Home/End: eerste/laatste zichtbare onderdeel.
- Enter of spatie: gefocust onderdeel selecteren.
- Tab: naar de volgende bediening; de skiplink gaat rechtstreeks naar de details.

Een geselecteerd onderdeel en toetsenbordfocus zijn afzonderlijk herkenbaar. Op kleine schermen staat de navigatie boven de details; de boom heeft een begrensde, scrollbare hoogte zodat de details bereikbaar blijven.

## Details en brongetrouwheid

Het detailpaneel toont de lijst, officiële code en benaming, onderdeeltype, broodkruimels en ouder. Hogere structuurniveaus tonen alleen hun beschikbare toelichting, bronlocatie en vervolgnavigatie; er worden geen fictieve waarderingen of termijnen getoond.

Voor een selectieregel worden de volledige beschikbare omschrijving, resultaattype, generiek/specifiek, waardering, bewaartermijn, procestermijn, aanvangsmoment, procesomschrijving, procesobject, toelichting en uitzonderingen ontsloten. De bestaande verwijzingen naar voorwaarden, algemene bepalingen en rubriekcontext blijven beschikbaar. Algemene bepalingen en rubriekcontext worden als afzonderlijke JSON-bronbestanden geopend; ze worden in deze stap niet opnieuw geïnterpreteerd of inhoudelijk samengevat.

Ontbrekende waarden worden verklaard aan de hand van de geregistreerde status. De interface onderscheidt onder meer een niet-ingevulde bronwaarde, een ontbrekende afzonderlijke kolom, een vervallen resultaat en een verwijzing naar toelichting/algemene bepalingen. Er verschijnt geen technische `null`-tekst. Samengestelde of voorwaardelijke termijnen en toelichtingen blijven volledig weergegeven, inclusief oorspronkelijke afbrekingen. Er worden geen aanvangs- of vernietigingsdatums afgeleid.

`bronannotatiesBij()` ontsluit de meegeleverde bevinding, verwerking, bronvariant en bevestigingsscope bij de selectieregel. De afgebroken toelichting van 2020-resultaat 22.1.3 en het bronlabel `Archiefvernie- tiging` bij 19.1.19–19.1.24 blijven zichtbaar en ongewijzigd. Bronlocaties bevatten beschikbare pagina's, coördinaten, XLS-rij/kolom en bronregisterlinks. Een metadata-bestand wordt expliciet als bronbeschrijving aangeduid; het wordt niet voorgesteld als een meegeleverde PDF.

## Foutafhandeling

Laadfouten tonen een begrijpelijke melding en `Opnieuw proberen`. Schemafouten, ongeldige verwijzingen en cycli worden door de gegevenslaag geblokkeerd; de interface toont geen gedeeltelijk bruikbare dataset. Een onbekend onderdeel krijgt een eigen melding. Ontbrekende selectiegegevens bij een rubriek of resultaat worden expliciet gemeld; een hoger structuurniveau zonder selectieregel geldt niet als fout. Er is een aparte melding voor onverwachte technische fouten en een eenvoudige terugvaltekst bij een opstartfout.

## Uitgevoerde controles

### Geautomatiseerd

Op 10 november 2026 zijn de productiebuild, 37 Node-tests (36 bestaande gegevenslaagtests en één productiecontrole) en 21 Chromium-browsertests geslaagd. De bestaande testverwachtingen zijn niet gewijzigd. De browsertests gebruiken de werkelijke bronbestanden; fouttests wijzigen uitsluitend antwoorden in het testgeheugen.

De tests dekken alle veertien gevraagde onderwerpen: initialisatie; keuze van alle lijsten; datasetisolatie en snelle wisselingen; hiërarchie en volgorde; uit-/inklappen; selectie; officiële details; alle voorschriften binnen een gedeelde rubriek; generieke/specifieke resultaten; samengestelde waarderingen en de volledige voorwaardelijke termijn uit 1996; annotaties; toetsenbord/focus/skiplink; ontbrekende en ongeldige gegevens; en statische productie onder een subpad. Er zijn geen relevante console- of runtimefouten geconstateerd.

`python scripts/valideer_publicatie.py` is opnieuw geslaagd voor alle drie datasets, inclusief inhoudelijke integriteitsvingerafdrukken. De oorspronkelijke aantallen blijven 494/1.005/55, 305/1.342/54 en 346/1.746/55 (selectieregels/zoektermkoppelingen/testvragen). `npm audit --omit=optional --audit-level=moderate` meldt geen bekende kwetsbaarheden. Git-controle bevestigt dat datasets, README, AGENTS, gegevenslaag en bestaande gegevenslaagtests ongewijzigd zijn.

### Visuele inspectie en handmatige controles

De Browser-plugin is niet beschikbaar; daarom is Playwright met de aanwezige Chromium gebruikt. Het traject lijst kiezen → boom openen → resultaat selecteren → details bekijken is in een werkende browser uitgevoerd. De gerenderde screenshots zijn visueel beoordeeld naast de vooraf gemaakte ontwerpreferentie, op de oorspronkelijke referentiemaat 1487 × 1058 en mobiel op 390 × 844. Dit is een visuele inspectie van browserbeelden; er is geen afzonderlijke menselijke acceptatietest of schermlezertest uitgevoerd.

| Vergelijkingspunt | Bevinding / bewuste uitwerking |
| --- | --- |
| Indeling | Twee kolommen, links circa 28%, rechts leesruimte; mobiel gestapeld en zonder horizontale overflow. |
| Kleur en omlijsting | Witte leesruimte, koele grijze navigatie, donkergroene accenten en dunne scheidingen; geen decoratieve kaarten of afbeeldingen. |
| Typografie | Systeemlettertype, duidelijke koppen, expliciete bedieningstekstgrootte; lange bronregels blijven leesbaar. |
| Boom en iconen | Kleine consistente SVG-pijlen, inspringing, hiërarchielijnen en afzonderlijke selectie-/focusmarkering. |
| Inhoud | Kop en bediening volgen het ontwerp; illustratieve voorbeeldteksten uit het concept zijn vervangen door de echte officiële gegevens, ook als die onvolledig zijn. |
| Functionele aanvulling | Laadstatus, bovenliggende navigatie, volledige bronvelden en rechten-/privacylinks volgen de opdracht en maken het scherm langer dan het schematische concept. |

De zichtbare tekst boven de vouw is gecontroleerd: uitsluitend de gevraagde titel, lijstkeuze, structuurbediening, status, brongegevens en navigatie; geen zoekveld, fictieve statistieken of nieuwe functionaliteiten. De visuele stijl is tegen de referentie gecontroleerd; de genoemde inhoudelijke verschillen zijn bewust om brongetrouwheid en de opdracht te volgen. Er zijn geen resterende blokkerende visuele problemen vastgesteld. Screenshots en het ontwerp staan buiten de repository en zijn niet toegevoegd aan de PR.

## Bekende beperkingen

- Alleen Chromium is getest; Firefox, Safari, schermlezers en een menselijke inhoudelijke acceptatieronde zijn niet uitgevoerd.
- Een expliciete lijstkeuze is vereist; er is geen URL-/sessieherstel van een eerdere selectie.
- Algemene bepalingen en rubriekcontext openen als bronbestand, niet als extra uitgewerkte leesweergave.
- Geen zoekfuncties, concordans, automatische selectieadviezen, datumrekeningen of Sites-integratie. De bronnen behouden hun bestaande rechten-, privacy- en inhoudelijke voorbehouden.
- De ontwikkelserver is alleen lokaal bedoeld. Voor latere hosting moet uitsluitend `dist/site/` als statische map worden aangeboden; er is nu niets gedeployed.
