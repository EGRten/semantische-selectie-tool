# Publicatieversie: oorspronkelijke bronopbouwlogica, geen zelfstandige openbare bronbundel.
# Gebruik scripts/bronopbouw_prive.py met een rechtmatig verkregen externe bronmap.
# Alleen deze wrapper kopieert dit script naar de verwachte private werkstructuur.
from pathlib import Path as _PublicPath
if __name__ == "__main__" and _PublicPath(__file__).parent.name == "bronopbouw":
    print("Dit is bronopbouwlogica. Gebruik: python scripts/bronopbouw_prive.py --help")
    raise SystemExit(0)
import pathlib,json,gzip,hashlib,importlib.metadata
R=pathlib.Path(__file__).resolve().parents[1];P=R/'revisie';D=P/'documentatie';S=json.loads((D/'validatieresultaten.json').read_text());REV=json.loads((D/'openstaande-beoordelingen.json').read_text())
def put(name,s):(D/name).write_text(s.strip()+'\n')
def fmt(n):return f'{n:,}'.replace(',','.')
put('gegevensspecificatie.md','''# Gegevensspecificatie — 0.2.0

Alle JSON-bestanden zijn UTF-8. De drie datasets zijn onafhankelijk: ID's en verwijzingen naar structuur, selectiegegevens en termen blijven binnen dezelfde selectielijst. De concordans staat afzonderlijk en bepaalt geen toepasselijkheid of gelijkwaardigheid.

## Identificatie en structuur

Een canonieke onderdeel-ID heeft de lijstprefix gevolgd door de officiële code. Voor 1996/2012 hebben technische subregels een suffix ::001, ::002 enzovoort. Deze suffixen en de subletters uit de concordans zijn geen officiële codes. Hetzelfde canonieke onderdeel kan in structuur.json en selectiegegevens.json voorkomen; dit verwijst naar dezelfde entiteit, geen twee verschillende entiteiten met een toevallig gelijke ID.

1996/2012 behoudt twee hoofdstukken, zestien taakvelden en negentig rubrieken. 494 technische voorschriftregels verwijzen naar de rubriek. Sommige beschrijvingen zijn delen van één opsomming met een gedeelde waarderingscel; de afzonderlijke zoekrecords betekenen niet dat de bron evenveel zelfstandig genummerde juridische regels kent. 2017/2020 behouden procestypen met generieke en specifieke resultaten. Het veld resultaattype bevat de officiële resultaatkolom. Er is geen fictieve extra hiërarchielaag toegevoegd.

## Selectiegegevens

Officiële formuleringen blijven behouden, inclusief eventuele typefouten, ontbrekende cellen en merkwaardige resultaatlabels. Waardering.type onderscheidt bewaren, vernietigen, samengesteld, vervallen en niet_ingevuld_in_bron. Bij 1996/2012 betekent B bewaren; de andere termijnen zijn vernietigingstermijnen volgens de bronlegenda. Hiervoor is geen fictieve letter V in de oorspronkelijke brontekst gezet.

Een enkelvoudige termijn zoals 10 jaar kan technisch worden uitgedrukt. Samengestelde termijnen, voorwaarden en directe vernietiging blijven tekst. De numerieke duur bepaalt geen aanvangsdatum. Waar de procestermijn exact overeenkomt met een legendacategorie is de letterlijke startdefinitie toegevoegd, met bron. De letters A–E zijn geen korte, middellange of lange duurklassen.

null betekent geen afzonderlijke tekstwaarde in dit veld; het bijbehorende statusveld verklaart waarom. Lege aanvangsmomentvelden bij bewaren zijn niet automatisch ontbrekende bewaartermijnen. Waar een voorwaarde niet veilig afzonderlijk kan worden geïnterpreteerd, verwijst het veld naar de behouden bronvelden, rubriekcontext en algemene bepalingen. Dat is een tekstuele representatie, geen datumrekenmodel.

## Bronnen

PDF-pagina's tellen vanaf 1; bbox gebruikt PDF-punten ten opzichte van de pagina. Bronsegmenten leggen tekst en coördinaten vast. Bij 1996/2012 zijn beschrijving en termijn afzonderlijk gelokaliseerd. De officiële PDF heeft op sommige pagina's defecte fontcodering voor toelichtingen; bepalingen.json en rubriekcontext.json bevatten daarom ook expliciet gelabelde leesbare paginakopieën uit de aangeleverde PDF. Die vervangen niet de autoriteit van het officiële document.

## Zoekverrijking

herkomsttype onderscheidt officieel, brononderbouwd_alternatief, taalkundige_variant en ai_voorgesteld. Letterlijk tekstvoorkomen bewijst alleen een vindverband. Een mechanische spellingvariant verandert interpunctie en is geen juridische gelijkwaardigheid. Bij AI-kandidaten betekent voorstel_inhoudelijk_beoordeeld_zoekrichting dat de richting op plausibiliteit is beoordeeld; de term wordt daarmee geen officieel synoniem. voorstel_niet_activeren blijft standaard uitgeschakeld. Niet koppelbare rapporttermen staan in kandidaten-ongekoppeld.json.

Relaties hebben een expliciete richting en herkomst. Ondersteunde concepten zijn structurele relaties, exacte synoniemen indien bewezen, afkortingen, historische benamingen, bredere/smallere en verwante begrippen en verwarringsrelaties. Niet voor ieder relatietype is in deze versie een bewezen relatie beschikbaar; geen aantallen zijn verzonnen om alle typen te vullen. Onjuiste voorgestelde relaties staan apart in het afwijkingenregister.

## Export

CSV gebruikt UTF-8 met BOM, komma als scheidingsteken en JSON-tekst voor objecten/lijsten. JSON Schema's zijn gesloten voor onbekende velden op de gemodelleerde objecten en controleren onder meer typen, ID-prefixen en minimaal veertig testvragen. Verwijzingen, broncontroles en hashes worden aanvullend door scripts gecontroleerd. Manifesten hashen alle directe datasetbestanden behalve zichzelf; daarmee is geen zelfhashkring gecreëerd.
''')
put('bronnenregister.md','''# Bronnenregister

Geraadpleegd op 10 november 2026. Exacte bestandsnamen, URL's en SHA-256-hashes staan in bronnenregister.json en de manifesten. De bronbestanden zijn meegeleverd.

| Bron | Gezag en gebruikte versie |
|---|---|
| Nationaal Archief — 1996/2012 | PDF met addendum, 120 pagina's; vastgesteld 21 juni 2012, Staatscourant 25 juni 2012, 11906, NA/12/3900. Alle 494 beschrijvingsfragmenten zijn genormaliseerd teruggevonden in deze officiële PDF. |
| Nationaal Archief — 2017 | PDF versie 4 juli 2017, 155 pagina's; vastgesteld 23 juni 2017, Staatscourant 6 juli 2017, 38013. Bevat tabel en wijzigingsbijlagen. |
| Nationaal Archief — officiële Excel 2017 | 305 gegevensregels. Onafhankelijke vergelijking met de aangeleverde opgemaakte PDF en officiële PDF. De Excel is niet gebruikt om lege PDF-cellen stilzwijgend te vullen. |
| Aangeleverde opgemaakte PDF 2017 | 101 pagina's. Geconsolideerde opmaak gebruikt voor betrouwbare tabelsegmentatie; officiële NA-PDF, XLS en wijzigingsbijlagen blijven de controlebronnen. |
| Nationaal Archief — 2020 | Selectielijst_20200214.pdf, 113 pagina's; vastgesteld 18 februari 2020, Staatscourant 26 februari 2020, 11143. De paginagewijze geëxtraheerde tekst is gelijk aan de aangeleverde PDF; bytes/hashes verschillen. |
| Concordans Selectielijst 1996-2020(1).xlsx | Aangeleverd aanvullend hulpmiddel. Geen eigen officiële vaststellingsstatus aangetoond. Kandidaten en kruisverwijzingen, geen normbron voor selectiegegevens. |
| Drie Deep Research-rapporten | Kandidaatzoektermen, voorbeeldvragen en claims. Beschikbare rapporttekst opnieuw beoordeeld; interne citatienummers zijn geen zelfstandig bewijs. |
| Handleiding SelectTool | Aanvullend materiaal voor navigatie en presentatie; geen gezaghebbende bron voor waarderingen of termijnen. |

Officiële besluiten:

- https://zoek.officielebekendmakingen.nl/stcrt-2012-11906.html
- https://zoek.officielebekendmakingen.nl/stcrt-2017-38013.html
- https://zoek.officielebekendmakingen.nl/stcrt-2020-11143.html

Officiële downloads staan in bronnen/urls.json. De officiële 2017-PDF draagt ook het opschrift Ontwerpselectielijst; dezelfde titelpagina vermeldt de vaststelling. Dat opschrift is geen reden geweest om de aangeboden officiële bron te negeren.

Er is aanvullend gezocht naar rectificaties en correcties bij Nationaal Archief, officiële bekendmakingen en VNG. De in de documenten aanwezige wijzigingsbijlagen zijn betrokken bij de verwerking. Er is geen afzonderlijke formele rectificatie aangetroffen die de elf beschreven bronvragen oplost. Dit is geen garantie dat buiten de onderzochte zoekresultaten geen latere documenten bestaan.

De CSV/XLSX-bestanden waarnaar het rapport 1996/2012 verwijst waren niet aangeleverd; een zoekactie op exacte bestandsnamen leverde geen resultaten op. De concordans is een ander bestand en is niet als die ontbrekende onderzoeksdataset gepresenteerd.
''')
lines=['# Validatierapport — brongecontroleerde revisie 0.2.0','', 'De ontbrekende extractie is uitgevoerd. Alle opgenomen selectieregels hebben bronverwijzingen en zijn door broncontroles gegaan. Dit is geen verklaring dat alle officiële bronteksten onderling eenduidig zijn of dat een onafhankelijke tweede inhoudelijke beoordeling is uitgevoerd.','', '| Lijst | Structuur | Voorschrift-/resultaatregels | Zoektermrelaties | Tests | Records met open bronvraag |','|---|---:|---:|---:|---:|---:|']
for s in S:lines.append(f"|{s['selectielijst']}|{s['structuuronderdelen']}|{s['selectievoorschriften_of_resultaatregels']}|{s['zoektermrelaties']}|{s['testvragen']}|{s['records_met_open_bronvraag']}|")
lines+=['','## 1996/2012','De concordans leverde 494 verschillende technische beschrijvings-/termijncombinaties. De 494 beschrijvingen zijn, na drie expliciete tekstcorrecties, letterlijk genormaliseerd teruggevonden in de officiële PDF. Elke termijn is afzonderlijk gelokaliseerd. Alle 494 beschrijvingsposities vallen bovendien binnen de grenzen van hun eigen officiële rubriek. Verschillende oorspronkelijke layoutafstanden vroegen gericht onderzoek; gedeelde cellen en verschoven waarderingen zijn gecontroleerd. Twee voorschriften zonder omschrijving in de concordans — Salarisadministratie en Verkoop — zijn toegevoegd vanuit hun rubriek en termijn.','', 'Onafhankelijk vanuit de primaire termijnkolom zijn 486 beginvermeldingen van waarderingen/termijnen herkend: geen daarvan is ongekoppeld. De volledige kolom bevat 573 tekstspans; 547 behoren tot gekoppelde termijnsegmenten. De 26 overige spans zijn kolomkoppen of defect gecodeerde toelichtingsglyphs, met posities in het controlebestand. Dit ondersteunt dekking van de selectieopsomming; het is geen bewijs van een onbegrensde semantische dekking.','', 'De 90 rubrieken plus zestien taakvelden en twee hoofdstukken verklaren de 108 structuuronderdelen. Het onderzoeksrapport noemt 89 rubrieken en 468 voorschriften. Deze cijfers zijn niet overgenomen: de onafhankelijke koppeninventaris telt 90 rubrieken, en de technische opsplitsing van gedeelde opsommingen is anders. De voorgestelde subletters in de concordans zijn geen officiële codes.','', 'Concordansafwijkingen: “Door de gemeente verstrekte statistische opgaven” is gecorrigeerd naar “Door en aan de gemeente …”; “verzicht van geruimde graven” naar “overzicht …”; de redactionele toevoeging “[in deze concordans genummerd als p t/m w]” is verwijderd uit de officiële omschrijving. De oorspronkelijke concordans blijft in het auditmateriaal bewaard.','', '## 2017','Alle 305 officiële Excel-codes komen voor. Een onafhankelijke inventarisatie via de procesnummerkolom telt ook 305 tabelregels in de opgemaakte PDF. Alle waarderingen zijn vergeleken met de officiële XLS; termijnen eveneens, met behoud van het gedocumenteerde tekstverschil bij 7.1.20. Er zijn 36 veldverschillen met de XLS vastgelegd, waarvan 21 een andere formulering van dezelfde procestoelichting bij procestype 19 betreffen.','', 'De officiële PDF-tabel vermeldt bij 16.2.2 vier jaar, maar de wijzigingsbijlage op pagina 153 schrijft drie jaar voor. De dataset bevat drie jaar, in overeenstemming met de bijlage en de Excel. Bij 20.1.7 zijn de gewijzigde omschrijving en het schrappen van de toelichting volgens pagina 154 verwerkt. Bij 19.1.18 is de officiële wijzigingsinstructie over Resultaat gevolgd. Bij 4.1.6 is de uitgeschreven RI&E-formulering uit de bijlage behouden.','', 'Vier bronverschillen blijven open: de procestermijn in de PDF is leeg bij 7.1.2, 7.1.3, 7.1.5 en 7.1.6, terwijl de officiële Excel Nihil vermeldt. De lege PDF-cellen blijven leeg; een aannemelijke waarde is geen toegestane broncorrectie. De volledige wijzigingscontext is meegeleverd. Niet iedere verhalende algemene wijzigingsinstructie is omgezet in een afzonderlijk executable toepasselijkheidsregeltje.','', '## 2020','Onafhankelijke telling via de procesnummerkolom bevestigt 346 tabelregels. Daarvan zijn 344 actief en twee vervallen. 7.1.20 verwijst naar 19.1.19; 19.1.13 verwijst naar 4.1.14. Vervallen regels zijn behouden voor herkenning, niet voorzien van nieuwe termijnen. Samengestelde waarderingen bij 22.1.2 en 22.1.3 zijn letterlijk opgenomen; de drie maanden uit de uitzondering zijn niet als termijn voor het gehele dossier gepresenteerd.','', 'Zeven records hebben een bronvraag: 19.1.19 t/m 19.1.24 hebben in de gepubliceerde resultaatkolom Archiefvernietiging, terwijl hun omschrijving andere onderwerpen betreft. Die labels zijn niet stilzwijgend vervangen. De toelichting van 22.1.3 is zichtbaar afgekapt; de ontbrekende opsomming is niet uit 2017 gekopieerd.','', '## Technische validatie','Alle achttien verplichte JSON-bestanden slagen voor JSON Schema-validatie. Alle overige JSON-bestanden worden eveneens geparseerd. Unieke IDs per entiteitscollectie, canonieke verwijzingen, ouder-kindrelaties, testverwachtingen, lijstprefixen, bronpagina’s en manifesthashes zijn gecontroleerd. De inventarischecks voor 494/305/346 en de gewijzigde regel 16.2.2 zijn als gerichte controles opgenomen. Een herkenbare code is niet automatisch een juiste waardering: de broncontroles zijn daarom apart uitgevoerd.','', '## Zoekverrijking en testvragen','Letterlijke brontermen, aantoonbare alternatieven, mechanische schrijfvarianten en AI-voorstellen zijn afzonderlijk geteld. Veertig gerichte extra zoekkoppelingen zijn beoordeeld en gedocumenteerd; niet-bewezen voorstellen blijven uitgeschakeld. Niet koppelbare rapporttermen staan in een wachtrij. De niet meegeleverde, in rapporten beloofde honderden termen zijn niet als werkelijk aangeleverde data aangemerkt.','', 'De sets bevatten 55, 54 en 55 vragen. Die omvatten onderzoeksvoorbeelden, gewone taal, afkortingen, specifieke onderwerpen, brede of meerduidige vragen en bij 2017/2020 de 29 procesrollen. De bron ondersteunt de verwachte vindrichting. Geen antwoord beweert op basis van de vraag al de juridisch toepasselijke categorie te hebben vastgesteld. Er is geen zoekmachine uitgevoerd; recall, precisie en rangschikking zijn dus nog niet gemeten.','', '## Grenzen van inhoudelijke verificatie','De bronextractie is op alle records gecontroleerd met geautomatiseerde vergelijkingen en gerichte beoordeling van afwijkingen. Geen integrale tweede lezing door een andere menselijke informatieprofessional is uitgevoerd. De elf bronvragen verhinderen een verklaring dat alle officiële gegevens eenduidig en volledig inhoudelijk vrijgegeven zijn. Voorwaarden en startmomenten zijn waar nodig tekstueel behouden; het pakket bevat geen volledig geïnterpreteerd datumrekenmodel.']
lines+=['','## Herkomst zoektermkoppelingen','', '| Lijst | Officieel | Brononderbouwd alternatief | Taalkundige variant | AI-voorstel | Nog niet gevalideerd voorstel |','|---|---:|---:|---:|---:|---:|']
for row in S:lines.append(f"|{row['selectielijst']}|{row['officiele_termrelaties']}|{row['brononderbouwde_alternatieve_termrelaties']}|{row['taalkundige_variantrelaties']}|{row['ai_voorgestelde_termrelaties']}|{row['nog_niet_gevalideerde_zoekvoorstellen']}|")
lines+=['','Een term kan terecht aan meerdere onderdelen gekoppeld zijn; dit zijn aantallen koppelingen, geen aantallen unieke woorden. Niet-opgenomen of niet-koppelbare rapporttermen staan apart in kandidaten-ongekoppeld.json. Niet ieder onderwerp heeft een bewezen extra synoniem; voor 2020 zijn daarom geen brononderbouwde alternatieven verzonnen om een niet-nul aantal te bereiken.']
put('validatierapport.md','\n'.join(lines))
lines=['# Openstaande beoordelingen','', 'De eerdere ontbrekende extractie van 1996/2012 is geen open werkpunt meer. Openstaande bronvragen zijn teruggebracht tot de onderstaande elf records. Voor bronvragen is geen stilzwijgende inhoudelijke correctie toegepast.','', '| Lijst | Code | Vraag |','|---|---|---|']
for r in REV:lines.append(f"|{r['lijst']}|{r['code']}|{r['bevinding']}|")
lines+=['','## Beoordelingen voor vrijgave','1. Laat een tweede beoordelaar de technische opsplitsing en gedeelde context bij 1996/2012 beoordelen, met extra aandacht voor gedeelde waarderingscellen en de uitgebreide BAG-opsomming.','2. Laat de bronhouder verduidelijken welke procestermijn geldt bij de vier 2017-regels waar PDF en Excel verschillen. Ook de toelichting over overlijdensgegevens bij anders omschreven BRP-gevallen verdient aandacht.','3. Laat de bronhouder de zes afwijkende resultaatlabels in 2020 en de volledige referendumtoelichting bevestigen of corrigeren. Een gecorrigeerde bron is nodig om de dataset normatief aan te passen.','4. Beoordeel AI-zoekvoorstellen voordat ze in een standaard zoekprofiel worden opgenomen. Zoekverbanden mogen opzettelijk breed zijn, exacte equivalentie vereist sterker bewijs.','5. Test later de zoekmachine met de meegeleverde verwachtingen; dit pakket levert gegevens, geen gevalideerd rankingmodel.','6. Een extra formele vrijgavecontrole is wenselijk voor gemeentelijk productiegebruik. Geen tweede reviewer is gefingeerd.']
put('openstaande-beoordelingen.md','\n'.join(lines))
put('bronvragen-aan-bronhouder.md','''# Conceptvragen aan de bronhouder — niet verzonden

Bij de machineleesbare ontsluiting zijn verschillen binnen de officiële bronnen aangetroffen. Kunt u de bedoelde bronformulering en eventuele formele correctie bevestigen?

1. **Selectielijst 2017 — 7.1.2, 7.1.3, 7.1.5 en 7.1.6:** de PDF laat de procestermijn leeg, terwijl de officiële Excel Nihil vermeldt. Welke waarde is bedoeld? Is de toelichting over overlijdensgegevens bij de anders omschreven BRP-gevallen eveneens beoogd?
2. **Selectielijst 2020 — 19.1.19 t/m 19.1.24:** de resultaatkolom vermeldt Archiefvernietiging, terwijl de omschrijvingen andere processen/gegevens betreffen. Is dit een opmaak- of kopieerfout, en welke formeel vastgestelde tekst geldt?
3. **Selectielijst 2020 — 22.1.3:** de referendumtoelichting eindigt bij geldige of onbruikbaar. Kunt u de volledige gezaghebbende tekst beschikbaar stellen?

Bronnen: de Nationaal Archief-downloads vermeld in bronnenregister.md. De oorspronkelijke tekst en verschillen zijn per code behouden in het datasetpakket. Er is geen waarde afgeleid uit een andere selectielijst om deze punten te herstellen.
''')
# Download sizes distinguish runtime files from the audit archive.
size_lines=['# Implementatieadvies','', 'De kernbestanden kunnen zelfstandig door een browser worden geladen via statische hosting, waaronder Sites. Geen database of backend-API nodig. Dit is een dataoplevering; de uiteindelijke Sites-app is nog niet gebouwd of getest.','', '| Lijst | Vijf kernbestanden samen | Gzip-indicatie |','|---|---:|---:|']
for s in S:
 base=P/'datasets'/s['selectielijst'];names=['structuur','selectiegegevens','zoeklexicon','relaties','testvragen'];bs=[(base/(n+'.json')).read_bytes() for n in names];size_lines.append(f"|{s['selectielijst']}|{sum(map(len,bs))/1024:.0f} KiB|{sum(len(gzip.compress(b,mtime=0)) for b in bs)/1024:.0f} KiB|")
size_lines+=['','Laad eerst manifest, structuur en selectiegegevens van één gekozen lijst. Laad zoeklexicon en relaties pas bij zoeken; testvragen uitsluitend in een ontwikkel-/controlefunctie. Bronnen, volledige bepalingsteksten en auditbestanden zijn afzonderlijke downloads en hoeven niet vooraf te worden geladen. De getoonde gzip-indicatie is een bestandsgrootteberekening, geen netwerkbenchmark.','', 'Gebruik Map-indexen op canonieke ID en op parent_id. Selectiegegevens verwijzen bij 1996/2012 naar de rubriek via structuur_id; meerdere voorschriften kunnen dezelfde officiële code hebben. Een navigatieboom die een rubriek aan slechts één termijn koppelt is daarom onjuist.','', 'Filter vervallen regels standaard uit de actuele resultaten, maar bied ze aan als historische verwijzingen. Maak bronproblemen zichtbaar en geef bij de betrokken records geen automatische termijnuitkomst. Behandel de bronvragen voor 2017 en 2020 als open.','', 'Bied exacte trefwoordzoeking en begripsverruiming afzonderlijk aan. Begin met herkomsttype officieel en brononderbouwd_alternatief. Taalkundige varianten kunnen aanvullend worden gebruikt met hun risicomelding. AI-voorstellen staan standaard uit, ook als een zoekrichting op plausibiliteit is beoordeeld.','', 'Een beperkte spelling-/afkortingenlaag is geen volledige semantische zoekmachine. Relevantie is geen toepasselijkheid; toon bron, resultaat, voorwaarden en algemene bepalingen bij een keuze. Bereken geen vernietigingsdatum uit technisch.waarde zonder de procestermijn en uitzonderingen te beoordelen.','', 'Offline gebruik kan met een versiegebonden cache van één pakket. De concordans is optioneel audit-/vergelijkingsmateriaal en geen verplichte runtime-afhankelijkheid van de drie pakketten. Serverloze hosting betekent dat bestanden via HTTP worden aangeboden; rechtstreeks openen via file:// kan fetch beperken.','', 'De leesbare paginakopieën in 1996/2012 hebben een expliciete bronstatus. Toon bij defecte PDF-tekstcodering ook een verwijzing naar de oorspronkelijke PDF-weergave.']
put('implementatieadvies.md','\n'.join(size_lines))
put('reproduceerbaarheid.md','''# Reproduceerbaarheid

Voer vanuit de uitgepakte pakketmap uit:

    python scripts/reproduce.py

Het script maakt een tijdelijke .reproduce-map, gebruikt de meegeleverde bronbytes en voert achtereenvolgens kandidaatselectie, primaire bronmatching, onafhankelijke kolomcontrole, koppeninventarisatie, karakterextractie, datasetbouw, zoekverrijking en validatie uit. Het heeft geen netwerkverbinding nodig. Benodigde Python-pakketten en de gebruikte versies staan in requirements.txt.

De volgorde is:

1. analyse_concordance.py
2. verify1996.py
3. coverage1996.py
4. headers1996.py
5. extract_tables.py
6. build_revision.py
7. enrich_revision.py
8. validate_revision.py
9. document_revision.py

De bronherstelkeuzes zijn expliciet in scripts opgenomen: drie tekstcorrecties tegenover de concordans, twee rubriceringsregels zonder eigen omschrijving, woordgrenzen bij genormaliseerde matching en gerichte layoutcontroles voor gedeelde/verschoven termijnen. Er is geen verborgen taalmodelaanroep in de generatiepipeline.

Vergelijking na reproductie betreft de verplichte zes JSON-bestanden per lijst, schemas en reproduceerbare auditbestanden. Verschillende versies van de PDF-extractiebibliotheek kunnen kleine veranderingen in coördinaten of tekstopmaak veroorzaken; daarom zijn bronhashes en gebruikte pakketversies opgenomen. Een geslaagde hergeneratie bewijst reproduceerbaarheid, geen juridische juistheid.
''')
(P/'README.md').write_text('''# Gemeentelijke selectielijsten — brongecontroleerde revisie 0.2.0

Deze versie vervangt de eerdere onvolledige werkextractie inhoudelijk. Zij bevat 494 technische voorschriftregels voor 1996/2012, 305 resultaten voor 2017 en 346 tabelregels voor 2020 (waarvan twee vervallen).

Begin bij documentatie/validatierapport.md en openstaande-beoordelingen.md. Elf records hebben open bronvragen. Niet alle zoekvoorstellen zijn inhoudelijk vrijgegeven en er is geen integrale tweede menselijke beoordeling uitgevoerd. Geen automatische selectie of datumrekenmachine.

De officiële gegevens blijven gezaghebbend. De concordans staat apart en maakt verschillende selectielijsten niet onderling juridisch uitwisselbaar.
''')
req=[]
for package in ['PyMuPDF','pandas','xlrd','openpyxl','jsonschema']:
 req.append(package+'=='+importlib.metadata.version(package))
(P/'requirements.txt').write_text('\n'.join(req)+'\n')
print('documentatie gegenereerd')
