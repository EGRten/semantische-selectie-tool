# Klassiek trefwoordzoeken

Deze zoekfunctie doorzoekt uitsluitend officiële tekst binnen de expliciet gekozen selectielijst. De bestaande boom blijft beschikbaar en wordt niet gefilterd of vervangen door de zoekresultaten. Er worden geen semantische zoeklexicons, AI-relaties, embeddings, concordansrelaties of externe zoekdiensten gebruikt.

De uitgangsbranch is vooraf gecontroleerd: commit `3bcadc0` bevat de samengevoegde browserinterface uit PR #4. De interface is uitgebreid, niet opnieuw opgebouwd. De datasets en de TypeScript-gegevenslaag zijn ongewijzigd.

## Bediening

Boven de boom staat `Trefwoordzoeken`. Kies eerst een selectielijst; het zoekveld blijft tijdens laden uitgeschakeld. Voer een officiële code of woorden in en druk op Enter of `Zoeken`. Alle verschillende zoekwoorden moeten voorkomen. `Wissen` verwijdert de opdracht en de resultaten, maar laat de zichtbare instelling voor vervallen resultaten staan. Wijzigen van de invoer verbergt oude resultaten; er wordt pas opnieuw gezocht na Enter, de zoekknop of het veranderen van het vervallenfilter bij een ingevulde opdracht.

De resultaten hebben een afzonderlijke kop en tonen code, officiële benaming, onderdeeltype, oudercontext, een relevant tekstfragment waar beschikbaar en de rangschikkingsreden. Overeenkomende tekstdelen worden met `<mark>` gemarkeerd. Er zijn geen betrouwbaarheidspercentages. Eerst verschijnen maximaal 25 resultaten; `Meer resultaten tonen` maakt alle overige resultaten bereikbaar. De telling betreft altijd het volledige resultaat, niet alleen de eerste pagina.

Een resultaat selecteert het oorspronkelijke technische onderdeel, opent zijn boompad en werkt het bestaande detailpaneel bij. De toetsenbordfocus gaat naar het geselecteerde boomonderdeel. De bronwaarden in het detailpaneel worden niet aangepast. Een melding met nul resultaten en een tip voor andere officiële termen is onderscheiden van een technische zoekfout. Bij een technische zoekfout blijft de boom bruikbaar.

## Afzonderlijke zoekmodule en index

`src/zoeken/index.ts` bevat `maakZoekindex(dataset)` en `zoek(vraag, { vervallenMeenemen })`. `src/zoeken/normalisatie.ts` bevat de zuivere tekstnormalisatie en bronposities voor markering. De module kent geen DOM, fetch of gebruikersinterface. `src/interface/zoeken.ts` verzorgt uitsluitend het zoekformulier en de resultatenweergave.

De index wordt pas bij de eerste zoekactie op een geladen dataset gemaakt. Genormaliseerde teksten en sets van volledige woorden worden één keer per document opgeslagen, zodat dezelfde bronvelden niet bij iedere zoekactie opnieuw hoeven te worden genormaliseerd. Een eenvoudige lineaire doorloop is voor deze kleine datasets voldoende; een extra zoekframework of geïnverteerde database-index is niet nodig. Er zijn geen dependencies toegevoegd.

De index bevat een document per uniek onderdeel: alle structuuronderdelen en alle selectieregels die geen eigen structuurrecord met dezelfde canonieke ID hebben. Zo wordt een resultaat uit 2017/2020 niet dubbel geteld. Een rubriek uit 1996/2012 en haar afzonderlijke voorschriften blijven verschillende documenten. Alleen voor normalisatie en indexering worden tekstrepresentaties in geheugen gemaakt; bronrecords en datasetbestanden blijven intact.

Het zoekpaneel bewaart een index per Dataset-object in een WeakMap, naast de bestaande gegevenscache. Bij een lijstwissel worden opdracht, resultaten en vervallenfilter direct gewist en wordt de vorige actieve index losgekoppeld. Alleen de index van de nieuw geladen dataset kan daarna worden gebruikt. Terugschakelen mag de bijbehorende eigen index hergebruiken. De zoekfunctie veroorzaakt geen extra netwerkverzoeken; alleen de bestaande gegevenslaag laadt manifest, structuur en selectiegegevens van de gekozen lijst.

## Doorzochte velden

| Onderdeel | Werkelijke datasetvelden |
| --- | --- |
| Officiële code | `code`, met afzonderlijke herkenning van numerieke codeopdrachten. |
| Structuuronderdeel | `benaming` en `toelichting`. |
| Selectievoorschrift/resultaat | `officiele_benaming`, `officiele_omschrijving`, `toelichting`, `uitzonderingen_en_verwijzingen.officiele_tekst` en `resultaattype`. |
| Letterlijke bronrijvarianten | `officiele_bronrij.omschrijving` en `officiele_bronrij.resultaat`, voor de oorspronkelijke tekst inclusief woordafbrekingen. |
| Procestype | Daarnaast de officiële `procesomschrijving`, `procesobject` en `officiele_bronrij.procesnaam` van de bij dit procestype behorende regels, deduplicerend verzameld. |

De koppeling van algemene procesteksten gebeurt via het werkelijke `padNaar()` en het opgeslagen type `procestype`, niet door codes te ontleden. Dezelfde algemene procesomschrijving wordt niet bij iedere onderliggende regel geïndexeerd. Ook ouderbenamingen en rubriekteksten worden niet automatisch aan alle kinderen toegevoegd. Ouders worden wel als zichtbare context getoond, maar dragen niet als geërfde zoektekst bij. Dit voorkomt dat één procesomschrijving vrijwel alle resultaten van dat proces oplevert.

Niet doorzocht worden technische IDs, bronbestandsnamen, verificatie-/beoordelingsmetadata, bronannotatiebevindingen, semantische relaties, waarderings- en termijnkolommen of de afzonderlijke algemene bepalingen/rubriekcontextbestanden. Die laatste bestanden worden door de bestaande gegevenslaag niet geladen. Dit is een afgebakende vindfunctie voor onderdelen, geen volledige doorzoeking van ieder pakketbestand.

## Normalisatie en meerdere woorden

1. Unicode wordt met NFKD genormaliseerd en naar kleine letters omgezet. Combinatietekens worden verwijderd: `financiële` en `financiele`, en samengestelde/ontbonden accentnotaties, zijn gelijk voor het zoeken. Compatibiliteitsletters, zoals brede Latijnse tekens, worden meegenomen.
2. Een zacht afbreekteken (`U+00AD`) wordt genegeerd. Een lettergebonden afbreekstreepje direct vóór een regeleinde wordt met dat regeleinde verwijderd: `jeugd-\nhulp` wordt `jeugdhulp`. Dit ondersteunt ook typografische afbreekstreepjes, CR/LF en Unicode-regel-/alineaovergangen.
3. Overige interpunctie en niet-letter-/niet-cijfertekens worden spaties. Herhaalde witruimte wordt één spatie; begin/eindspaties verdwijnen. `wet- en regelgeving` blijft dus drie woorden; gewone koppeltekencombinaties worden niet blind aaneengeplakt.
4. Dezelfde normalisatie geldt voor bronvelden en opdrachten. Herhaalde querywoorden worden één keer beschouwd. De resterende woorden worden met **EN** gecombineerd: ieder woord moet ergens in de eigen geïndexeerde velden van het document voorkomen. De volgorde mag verschillen en woorden mogen over eigen velden verdeeld zijn. Een deelwoordovereenkomst is toegestaan.
5. Er zijn geen stopwoorden, stemming, spellingscorrectie, synoniemen of vraagontleding. `plan aanpak cliënt` is daardoor geschikt als trefwoordopdracht; een lange natuurlijke vraag kan extra woorden bevatten die niet samen in de officiële tekst voorkomen.

Een volledig numerieke, eventueel gepunte officiële code krijgt een aparte behandeling: na NFKC, trimmen en verwijderen van spaties rondom punten worden alleen exact gelijke codes en hun gepunte vervolgcodes gevonden. `1.1` vindt eerst `1.1`, daarna bijvoorbeeld `1.1.1`. De opdracht wordt niet als losse cijfers in willekeurige toelichtingen gezocht. Codes in combinatie met gewone woorden hebben deze aparte codebehandeling niet; gebruik voor exact codezoeken de code alleen. Technische suffixen worden niet als officiële codes geïndexeerd.

De markering gebruikt posities in de oorspronkelijke Unicode-string. Accenten, ligaturen, astrale tekens en woordafbrekingen blijven in de weergave behouden. Broninhoud en zoekopdrachten worden als tekstnodes opgebouwd, niet via `innerHTML`; markering kan geen HTML uitvoeren.

## Controleerbare rangschikking

Het resultaat bevat `rang`, `reden` en `overeenkomstvelden`. De vijf vaste redenen staan in `RANGREDENEN` en kunnen onafhankelijk worden getest:

| Rang | Voorwaarde |
| ---: | --- |
| 1 | Exacte officiële code. |
| 2 | Exacte genormaliseerde officiële benaming, inclusief de eigen officiële structuur-/procesnaamvariant. |
| 3 | Alle querywoorden komen als volledige woorden voor in de eigen benaming en/of omschrijving. Dit geldt ook voor een enkel volledig zoekwoord. |
| 4 | Alle querywoorden komen als volledige woorden in de eigen velden voor en ten minste één daarvan staat in een officiële toelichting of uitzondering. |
| 5 | Overige overeenkomsten, waaronder deelwoorden, resultaattype/procesobject zonder hogere overeenkomst, en vervolgcodes bij een codeopdracht. |

Binnen dezelfde rang gaan documenten met meer volledige querywoorden in hun benaming voor; daarna telt het aantal volledige querywoorden in de omschrijving. Overige gelijke resultaten volgen de oorspronkelijke hiërarchische doorloop: officiële structuurvolgorde en voorschriftvolgorde. Bij zuivere codeopdrachten geldt direct die bronvolgorde binnen de rang, zodat gedeelde codes niet worden herordend op toevallige cijfers in een omschrijving. Duplicaatvelden leveren geen extra woordpunten op. Er is geen probabilistische score.

## Verschillen per selectielijst en vervallen resultaten

1996/2012 houdt alle voorschriften onder een gedeelde rubriek apart. Zo geeft `3.6.2` 37 resultaten: de rubriek en haar 36 individuele voorschriften. Code, volledige benaming en oudercontext maken het verschil zichtbaar. De resultaatsleutel gebruikt het technische ID, maar suffixen worden niet als zichtbare officiële nummering gebruikt.

2017 en 2020 behouden procestypen, generieke en specifieke resultaten als eigen soorten. Het bronveld `resultaattype` is doorzoekbare tekst en wordt geen verzonnen boomniveau.

Alleen `selectiegegeven.status === 'vervallen'` bepaalt of een document vervallen is. De twee vervallen resultaten uit 2020 worden standaard uitgesloten, inclusief hun canonieke structuurweergave in zoekresultaten. Een actieve regel waarin toevallig het woord ‘vervallen’ voorkomt blijft doorzoekbaar. De expliciete checkbox voegt vervallen resultaten toe en de resultaatstatus benoemt of ze in- of uitgesloten zijn. De oorspronkelijke boom en datasets blijven daarbij ongewijzigd.

## Tests en nulmeting

Uitgevoerd op 11 november 2026:

- `CHROMIUM_PATH=/usr/bin/chromium npm test`: productiebuild, **52 Node-tests** en **31 Chromium-browsertests** geslaagd. Dit omvat alle vijftien gevraagde testonderwerpen, de bestaande gegevenslaag/interface en de bytecontrole van de statische datasetkopieën.
- De nieuwe tests controleren onder meer vaste rangvolgorde, herhaalbaarheid, EN-combinatie, volledige gedeelde rubriek, Unicode/accentsamenstelling, echte afbrekingen, statusfilters, navigatie, markering, toetsenbordfocus, technische fout versus nul resultaten en mobiele overflow.
- Twee eerdere UI-verwachtingen zijn functioneel bijgewerkt: het nieuwe zoekveld is aanvankelijk uitgeschakeld in plaats van afwezig, en de Tab-volgorde bevat nu het zoekveld vóór de boom. De eerdere bronverwachtingen en gegevenslaagtests zijn ongewijzigd; deze updates verbergen geen technische fout.
- `python scripts/valideer_publicatie.py`: geslaagd voor alle datasets en integriteitsvingerafdrukken. Git-controle bevestigt dat de officiële datasets, README, AGENTS en gegevenslaag ongewijzigd zijn.
- Werkende Chromium-interface bekeken op `http://127.0.0.1:4199/testpad/`, desktop 1440 × 1000 en mobiel 390 × 844. Lijstkeuze → zoekopdracht met Enter → resultaat → geopende boom en officiële details gecontroleerd. Paginatitel en URL zijn correct, de pagina is gevuld en er zijn geen relevante console-/runtimefouten of foutoverlays. Markeringen, lange context, responsieve stapeling en focus zijn visueel geïnspecteerd; geen horizontale overflow. De Browser-plugin is niet beschikbaar, daarom is de frontend-testing-debugging-aanpak met Playwright en aanwezige Chromium gebruikt. Screenshots staan buiten Git.

De volledige reproduceerbare [nulmeting](trefwoordzoeken-nulmeting.md) bevat alle 164 bestaande vragen met de ongewijzigde verwachtingen, ontbrekende woorden en resultaten. `scripts/nulmeting-trefwoordzoeken.mjs` reproduceert het rapport met `npm run nulmeting -- --output docs/trefwoordzoeken-nulmeting.md` na een build. De rapportage maakt onderscheid tussen een exact verwacht categorie-ID en een daadwerkelijk gevonden voorschrift binnen die categorie via het bestaande ouderpad. Dit verandert de zoekresultaten of verwachtingen niet.

| Lijst | Vragen | Letterlijke vraag: exact verwacht ID | Letterlijke vraag: binnen verwachte categorie | Officieel bronfragment: exact ID | Bronfragment: binnen categorie | Missers met afwezige woorden |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1996/2012 | 55 | 0 | 8 | 40 | 55 | 19 |
| 2017 | 54 | 0 | 0 | 54 | 54 | 25 |
| 2020 | 55 | 0 | 0 | 55 | 55 | 23 |

De vijftien bronfragmenten uit 1996/2012 zonder exact categorie-ID vinden wel het afzonderlijke voorschrift onder de verwachte rubriek. Alle 164 bronfragmenten zijn zo technisch vindbaar binnen de verwachte scope; dit is ook geautomatiseerd gecontroleerd.

De natuurlijke praktijkvragen vallen vaak buiten klassiek EN-zoeken. Voorbeelden zijn `Convenant met buurgemeenten` (1996/2012, `buurgemeenten` ontbreekt in het zoekbereik), `Subsidiedossier jaarlijkse subsidie` (`subsidiedossier`) en `Ontvangen ESF subsidie` (`esf`). Andere vragen bevatten wel afzonderlijk voorkomende woorden, maar niet samen in één onderdeel. De volledige vraagtekst is daarom niet gelijkgesteld aan een trefwoordopdracht. Deze gevallen blijven zichtbaar als nulmeting voor later begripsgericht zoeken; er zijn geen woorden vervangen of verwachtingen aangepast om de uitkomst te verbeteren.

## Beperkingen

De resultaten zijn vindverbanden, geen zelfstandig selectieadvies. Deelwoordzoeken kan ook woorden met toevallige tekstoverlap vinden. Interpunctie en accenten worden gelijkgetrokken; niet iedere typografische fout of afbreking wordt herkend. Een woord dat zonder afbreekstreepje over regels is verdeeld, of alleen als afgebroken variant met een spatie staat, wordt niet automatisch tot een verondersteld nieuw woord gereconstrueerd. Waar beschikbaar helpt de oorspronkelijke bronrijvariant met een echte afbreking.

De oudercontext is zichtbaar, maar geen geërfde zoektekst. Algemene bepalingen en afzonderlijke rubriekcontext zijn buiten het zoekbereik; er wordt niets extra geladen. De index zoekt lineair binnen de huidige omvang en doet geen fuzzy matching of semantische interpretatie. Alleen Chromium is getest; er is geen menselijke acceptatie- of schermlezertest uitgevoerd. Geen definitieve publicatie of ChatGPT Sites-integratie uitgevoerd.
