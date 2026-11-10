# Lexicongebaseerd begripsgericht zoeken

De tweede zoekmodus gebruikt uitsluitend de vooraf samengestelde zoeklexicons en relaties van de gekozen selectielijst. Er is geen live AI-assistent, generatief model, embedding, externe zoekdienst, concordans of automatisch selectieadvies. De gewone trefwoordzoekmodule en haar normalisatie zijn inhoudelijk en technisch ongewijzigd.

De uitgangsbranch is gecontroleerd: `03d7a43` bevat de samengevoegde klassieke zoekfunctie uit PR #5. De officiële datasets, README en AGENTS zijn niet gewijzigd.

## Opzet en laden

- `src/begripszoeken/index.ts`: zelfstandig testbare zoeklogica en expliciete toelatingsregels, zonder DOM of netwerk.
- `src/interface/zoekmodi.ts`: twee tabbladen en hun afzonderlijke panelen.
- `src/interface/begripszoeken.ts`: begripsformulier, laad-/foutstatus, filters en uitlegbare resultaten.
- De bestaande `src/interface/zoeken.ts` en `src/zoeken/` blijven ongewijzigd.
- De gegevenslaag is uitgebreid met typen `Zoekterm`, `Betekenisrelatie`, `Zoekverrijking` en `laadZoekverrijking(id)`.

De gegevenslaag laadt `zoeklexicon.json` en `relaties.json` pas op expliciete aanvraag, tegelijk met hergebruik van de al geladen basisdataset. De interface vraagt ze alleen aan wanneer begripsgericht zoeken actief is voor de gekozen lijst. Trefwoordzoeken en boomnavigatie blijven zonder die bestanden werken. Er worden nooit standaard drie lexicons opgehaald.

De twee nieuwe bestanden worden met de bestaande JSON-schema's gevalideerd. De gegevenslaag controleert unieke IDs, lijstprefixen, bestaande onderdelen en zoektermen, eindpunttypen en manifesttellingen. Een mislukte aanvraag blijft niet in de cache staan. Gelijktijdige aanvragen voor dezelfde lijst delen één promise; andere lijsten hebben hun eigen cache. Geladen bronrecords zijn diep bevroren. De volledige pakket-/hashcontrole blijft aanvullend de verantwoordelijkheid van `scripts/valideer_publicatie.py`.

Schemavalidators worden met de bestaande build vooraf gegenereerd; de browser gebruikt geen runtimecompiler of `eval`. Er zijn geen dependencies toegevoegd. `npm run build` bouwt ook de zelfstandige zoekmodule naar `dist/begripszoeken/index.js` en de bestaande statische applicatie naar `dist/site/`. Relatieve paden en de bestaande subpadondersteuning blijven behouden.

## Werkelijk aangetroffen inhoud

| Lijst | Officieel / brongetoetst | Brononderbouwd alternatief | Mechanische variant | Beoordeelde AI-zoekrichting | Onbevestigd AI-voorstel |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1996/2012 | 641 | 13 | 194 | 9 | 148 |
| 2017 | 1.191 | 2 | 20 | 8 | 121 |
| 2020 | 1.358 | 0 | 227 | 8 | 153 |

De betekenisrelaties zijn in dit pakket steeds gericht van een zoekterm naar een onderdeel. Daarnaast bevat `relaties.json` structurele `onderdeel_van`-kanten met richting `kind_naar_ouder`. Er zijn geen aparte bredere/smallere betekenisrelaties, bewezen exacte-synoniemrelaties of zoekterm-naar-zoektermketens. Die zijn niet verzonnen om de gewenste typenlijst te vullen. In 2020 ontbreekt ook een afzonderlijke groep brononderbouwde alternatieven; de engine maakt daarvoor geen nieuwe records.

## Toelating: term én relatie

Een gevonden term wordt alleen gebruikt wanneer zowel de zoekterm als de bijbehorende relatie expliciet zijn toegelaten. Hun herkomst en type moeten overeenkomen. De relatie moet naar het bij de term opgeslagen `onderdeel_id` wijzen, en beide records moeten `juridische_gelijkwaardigheid=false` hebben. De score `betrouwbaarheid` en de aanwezigheid van een bron leveren op zichzelf geen toegang op.

| Herkomst | Exacte toegelaten status | Werkelijk gebruikte relatietypen | Standaard |
| --- | --- | --- | --- |
| `officieel` | `brongetoetst` | `officiele_benaming`, `letterlijk_fragment` | Aan |
| `brononderbouwd_alternatief` | `brononderbouwd_gecontroleerd` | `afkorting`, `afkorting_voluit`, `historische_benaming`, `verwant_begrip` | Aan |
| `taalkundige_variant` | `mechanisch_gecontroleerd` | `spellingvariant` | Aan |
| `ai_voorgesteld` | `voorstel_inhoudelijk_beoordeeld_zoekrichting` | `praktijkformulering` | Aan, herkenbaar als beoordeelde AI-zoekrichting |
| `ai_voorgesteld` | `voorstel_niet_activeren` | `verwant_begrip_voorstel` | Uit; uitsluitend met expliciete checkbox |

Het statusveld heet bij termen `beoordelingsstatus` en bij relaties `status`. Onbekende statussen, herkomsten of combinaties worden in alle modi uitgesloten, ook wanneer de AI-checkbox aanstaat. Een beoordeelde zoekrichting blijft een AI-voorstel: de plausibiliteitsbeoordeling maakt er geen officieel synoniem, formele goedkeuring of selectiegrondslag van.

`Ook onbevestigde AI-zoektermen gebruiken` staat standaard uit. De tekst eronder benoemt de mogelijke extra resultaten én minder betrouwbare betekenisrelaties. Zowel een nieuwe lijst als een moduswissel wist de opdracht en zet dit filter terug op uit. Het vervallenfilter staat eveneens standaard uit; uitsluitend het werkelijke selectierecordveld `status === 'vervallen'` bepaalt uitsluiting.

## Begripsmatching en richting

De zoeklogica hergebruikt de bestaande Unicode-, accent-, interpunctie- en afbreeknormalisatie. De originele lexicontekst blijft behouden voor de uitleg. Het aangeleverde `genormaliseerde_zoekterm` wordt niet blind vergeleken met een anders genormaliseerde query; de engine normaliseert de echte `zoekterm` met dezelfde functie als de invoer.

Een lexiconterm moet als volledige genormaliseerde woordgroep in de vraag voorkomen, met woordgrenzen. Zo kan `Waar vind ik notulen van vergaderingen?` de opgeslagen ingang `notulen` vinden zonder te eisen dat ieder vraagwoord in hetzelfde bronrecord staat. Er is geen intentieherkenning, vraagherschrijving, spellingscorrectie of vrije synonymengeneratie. Een kleine vaste lijst gewone functiewoorden voorkomt uitbreiding via termen die alleen uit woorden zoals ‘de’, ‘het’, ‘van’ of ‘waar’ bestaan. Ingangen korter dan drie letters/cijfers worden niet gebruikt, behalve expliciet opgeslagen afkortingen.

De engine volgt maximaal **één gerichte stap**: `van_type=zoekterm`, `richting=zoekterm_naar_onderdeel`, `naar_type=onderdeel`. Een omgekeerde kant wordt niet gevolgd; een onderdeel wordt niet terugvertaald naar alle termen en vervolgens doorgekoppeld naar andere onderdelen. De structurele relatie `onderdeel_van` wordt niet als breder begrip opgevat. Er is geen automatische uitbreiding naar ouders, kinderen of andere selectielijsten. Afkorting en volledige benaming werken waar het pakket beide ingangen expliciet bevat, bijvoorbeeld WABO en Wet algemene bepalingen omgevingsrecht; een ontbrekende tegenhanger wordt niet geconstrueerd.

Naast lexiconkanten worden de directe resultaten van de ongewijzigde trefwoordfunctie opgenomen. Dat geeft een herkenbare basis van officiële tekstovereenkomsten. De twee zoekmethoden blijven door de actieve tab en de afzonderlijke verklaringen onderscheiden.

## Rangschikking en samenvoegen

Iedere verklaring heeft een vaste prioriteit. Een resultaat krijgt de beste prioriteit van zijn verklaringen:

| Prioriteit | Overeenkomst |
| ---: | --- |
| 1 | Exacte officiële code/benaming uit de directe zoekfunctie, of een exacte officiële lexiconingang. |
| 2 | Expliciet brononderbouwde historische benaming. |
| 3 | Opgeslagen afkorting/volledige afkorting, gecontroleerde schrijfvariant, ingebed officieel tekstfragment of directe overeenkomst met hele belangrijke woorden in naam/omschrijving. |
| 5 | Brononderbouwd verwant begrip, inhoudelijk beoordeelde praktijkformulering of minder directe officiële tekstovereenkomst. |
| 6 | Expliciet ingeschakeld onbevestigd AI-voorstel. |

Prioriteit 4 is bewust niet ingevuld: er zijn geen onderbouwde bredere/smallere relaties om daarmee te vullen. De daadwerkelijke herkomst gaat vóór de suggestieve naam van een type; een onbevestigd verwant voorstel krijgt nooit prioriteit 5.

Bij gelijke prioriteit tellen eerst het aantal verschillende gedekte niet-functiewoorden en vervolgens de lengte van de overeenkomende woordgroep. Alleen verklaringen op de beste prioriteit mogen deze nevenschikking versterken. Daarna volgen de oorspronkelijke directe trefwoordvolgorde en de officiële hiërarchische volgorde. Hierdoor verdringt een algemene ingang zoals ‘notulen’ niet een tekstovereenkomst met alle woorden van ‘Notulen bouwvergadering monument’ binnen dezelfde prioriteit. Onbevestigde extra bewijzen mogen bestaande toegelaten resultaten niet opwaarderen; nieuwe onbevestigde resultaten komen achter de standaardresultaten.

Het samenvoegen gebeurt op technisch onderdeel-ID, niet op officiële code. Alle verschillende term-/relatieverklaringen blijven behouden, ook wanneer meerdere termen hetzelfde onderdeel aanwijzen. Een resultaat kan tegelijk een officiële tekstovereenkomst, beoordeelde zoekrichting en — alleen indien ingeschakeld — onbevestigde verklaring bevatten. De interface meldt dan dat het resultaat een onbevestigde relatie bevat, niet dat alle overige verklaringen onbetrouwbaar zijn. Er worden geen kunstmatige betrouwbaarheidspercentages getoond.

1996/2012 behoudt alle afzonderlijke voorschriften onder een gedeelde code. Waar een relatie werkelijk naar een technisch voorschrift verwijst, wordt dat voorschrift geselecteerd. Waar het pakket alleen een rubriek koppelt, blijft het resultaat een rubriek; er worden geen veronderstelde koppelingen naar alle voorschriften toegevoegd. In 2017/2020 blijven generieke en specifieke resultaten onderscheiden.

## Interface en asynchrone veiligheid

De tabs hebben `role=tab`, een actieve toestand, zichtbare focus en een bijbehorend tabpaneel. Pijl links/rechts en Home/End bedienen de tabkeuze. De bestaande invoer met Enter, zoekknop, wissen en boomnavigatie blijft beschikbaar. Begripsresultaten tonen selectielijst, officiële code/naam, type, context en de beste vindreden. Via `Waarom gevonden?` zijn alle verklaringen bereikbaar: daadwerkelijke term, herkomst, onderbouwing, beide beoordelingsstatussen, bron/pagina, beschikbaar bronfragment en risico op verwarring.

De interface zegt expliciet dat zoekrelevantie geen archivistische toepasselijkheid of selectieadvies is. Beoordeelde AI-zoekrichtingen krijgen de toelichting dat het geen officiële synoniemen zijn. Onbevestigde relaties hebben een aparte aanduiding.

Bij lijst- of moduswissel worden resultaten en filters gewist. Een aanvraagnummer, actief-moduscontrole en controle van het Dataset-object zorgen dat oude laadantwoorden geen status of resultaten kunnen terugzetten. De indexcache is aan het eigen Dataset-object gekoppeld. Het ontbreken van een lexicon geeft een begrijpelijke fout en een knop om opnieuw te laden; trefwoordzoeken en de boom blijven bruikbaar. Zoekfouten worden niet als ‘nul resultaten’ verborgen.

## Zoekkwaliteit

De reproduceerbare [A/B/C-vergelijking](zoekkwaliteit-nulmeting.md) gebruikt alle 164 ongewijzigde volledige testvragen en dezelfde verwachte/alternatieve categorieën:

- A: ongewijzigd trefwoordzoeken zonder verrijking.
- B: standaard begripsmodus met expliciet toegelaten relaties, inclusief mechanische varianten en beoordeelde AI-zoekrichtingen.
- C: B plus expliciet ingeschakelde onbevestigde voorstellen.

De vragen bevatten brongetoetste vindbaarheidsverwachtingen, maar geen uitputtende en onafhankelijk gecontroleerde relevantieoordelen. Daarom zijn Recall@5, Recall@10, Precision@5 en MRR niet als betrouwbare kwaliteitscijfers berekend. Het rapport gebruikt diagnostisch de eerste positie van een bekende verwachting, met dezelfde ouderpad-scopecontrole als de bestaande nulmeting; het bevat per vraag beter/gelijk/slechter en concrete gebruikte lexicontermen. Dit beoordeelt niet alle extra resultaten als juist of onjuist.

In B staan bij 1996/2012 11 vragen eerder op een bekende verwachting, bij 2017 12 en bij 2020 13; de overige vragen zijn op deze beperkte maat gelijk. Het rapport vermeldt ook de uitkomsten van C en alle resterende vragen zonder bekende treffer. Deze waarnemingen zijn geen bewijs van hogere precision of juridische toepasselijkheid.

Reproduceren:

```sh
npm run build
npm run vergelijk:zoekkwaliteit -- --output docs/zoekkwaliteit-nulmeting.md
```

## Tests en controles

Uitgevoerd op 11 november 2026:

- Productiebuild en TypeScript-controle geslaagd; browsermodules zonder runtimecompiler, backend of extra dependency.
- 75 Node-tests geslaagd: de bestaande gegevenslaag- en trefwoordtests, nieuwe lazy-load/schema/verwijzings/cachetests en zelfstandige begripszoektests.
- 41 Chromium-tests geslaagd: bestaande interface/trefwoorden plus modusschakeling, toelichting, AI-opt-in, navigatie, lijstisolatie, trage oude aanvragen, ontbrekend lexicon/herstel, vervallenfilter en toetsenbord/mobiel.
- De gevraagde bredere/smallere typen zijn als **ontbrekend** getest en gedocumenteerd; structurele ouderkanten leveren geen betekenisuitbreiding op. Er is geen kunstmatig positieve test voor niet-bestaande bronrelaties gemaakt.
- `python scripts/valideer_publicatie.py` opnieuw geslaagd met alle oorspronkelijke aantallen en integriteitsvingerafdrukken. Officiële datasets en klassieke zoekmodule/-tests zijn ongewijzigd.
- Bestaande UI-tests zijn alleen aangepast voor de extra tabstop en om boomselecties op `role=treeitem` te controleren; een geselecteerde tab is geen geselecteerde boomregel. Er zijn geen bronverwachtingen gewijzigd.
- Werkende interface visueel gecontroleerd op `http://127.0.0.1:4199/testpad/`, desktop 1440 × 1000 en mobiel 390 × 844. Traject lijst → begripsmodus → WABO → verklaring → boom/details doorlopen; juiste titel/URL, gevulde pagina, geen foutoverlay, relevante consolefout of horizontale overflow. De Browser-plugin ontbreekt; de frontend-testing-debugging-aanpak gebruikt daarom Playwright met de aanwezige Chromium. Beelden zijn via `view_image` bekeken; tabonderscheid, lange benamingen, uitleg, filters, ruimte en mobiele stapeling zijn gecontroleerd. Screenshots blijven buiten Git. Geen menselijke acceptatie- of schermlezertest uitgevoerd.

De volledige controle is uit te voeren met `CHROMIUM_PATH=/usr/bin/chromium npm test` in deze omgeving, of `npm test` met een reguliere Playwright-Chromiuminstallatie.

## Bekende beperkingen

Bredere/smallere relaties en ontbrekende afkortingen worden niet verzonnen. Gewone taal wordt alleen ondersteund voor zover een opgeslagen term of directe tekst overeenkomt; ontkenningen, alternatieve bedoelingen en juridische voorwaarden worden niet geïnterpreteerd. Algemene woorden kunnen meerdere zoekrichtingen opleveren. Verificatie van bronpassages en beoordelingsstatussen is geen formele beslissing over toepasselijkheid.

Een bekende categorie kan te grof zijn om de juiste specifieke regel aan te wijzen. Het rapport meet daarom geen automatische selectiejuistheid. Algemene bepalingen, rubriekcontext en concordans blijven buiten deze uitbreiding. Alleen Chromium is getest. Geen generatief model, embeddings, selectieadviezen, datumrekeningen, accounts, casusopslag, definitieve publicatie of ChatGPT Sites-integratie toegevoegd.
