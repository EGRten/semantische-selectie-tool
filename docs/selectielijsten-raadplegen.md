# Selectielijsten raadplegen en downloaden

## Hoofdfuncties en beschikbaarheid

De navigatie biedt **Zoeken en verkennen**, **Selectielijsten raadplegen** en **Concordans raadplegen**. De eerste functie behoudt de bestaande boom, twee zoekmodi, details en historische vergelijking. De oude route `#selectielijsten` blijft daarvoor geldig. De nieuwe raadpleegfunctie staat op `#lijsten` en is onafhankelijk van de niet-publieke concordansbron beschikbaar. Zij gebruikt uitsluitend reeds gepubliceerde officiële datasets; er is geen backend, API, nieuwe gegevenskopie of nieuwe dependency.

Kies 1996/2012, 2017 of 2020. Alleen de gekozen dataset wordt via de bestaande `laadDataset` geladen; manifest, structuur en selectiegegevens delen de bestaande sessiecache met de boom/details. Zoeklexicons en concordans worden niet voor deze tabellen opgehaald. Uitgebreide voorwaarden worden pas bij een Excel-download geladen via de reeds bestaande broncontextcache.

## Tabellen en veldherkomst

Iedere gegevensregel is een bestaand selectievoorschrift, niet een extra structuuronderdeel. De bronvolgorde is de oorspronkelijke `selectiegegevens`-array. Alle 494 / 305 / 346 rijen staan in één native doorlopende tabel, zonder paginering. Horizontaal en verticaal scrollen gebeurt binnen een focusbaar tabelgebied; koppen en de eerste codekolom blijven zichtbaar. Links zijn met Tab/Enter bedienbaar. Op mobiel blijft de brede tabel horizontaal verschuifbaar; de bestaande details geven de volledige tekst in een leesbare verticale indeling.

| Lijst | Kolommen | Werkelijke herkomst |
| --- | --- | --- |
| 1996/2012 | Officiële code; hoofdstuk; taakveld; rubriek; omschrijving selectievoorschrift; waardering; bewaartermijn; toelichting; status | `code`; expliciete structuuronderdelen uit `padNaar(id)` met typen `hoofdstuk`, `taakveld`, `rubriek`; `officiele_omschrijving`; `waardering.officiele_tekst`; `bewaartermijn.officiele_tekst`; `toelichting`; `status` |
| 2017/2020 | Resultaatcode; procestype; procesomschrijving; resultaattype; resultaatomschrijving; generiek/specifiek; waardering; bewaartermijn; procestermijn; aanvangsmoment; toelichting; status | `code`; expliciet `procestype` in het structuurpad; `procesomschrijving`; `resultaattype`; `officiele_omschrijving`; `generiek_specifiek`; de drie termijn-/aanvangsobjecten met `officiele_tekst`; `waardering.officiele_tekst`; `toelichting`; `status` |

Er worden geen officiële codes uit technische suffixen afgeleid. De historische rubriek 3.6.1 bevat 22 voorschriften en 3.6.2 bevat 36 voorschriften; ieder heeft zijn eigen technische record-ID en eigen rij. De tabel maakt geen keuze tussen gelijkgenummerde voorschriften. In de 2020-tabel blijven ook beide vervallen regels opgenomen. De bronvelden bepalen wat wordt getoond: bijvoorbeeld de procesomschrijving van 2020 is niet automatisch vervangen door een langere toelichting elders in de bronrij.

Ontbrekende waarden volgen de bestaande `legeWaarde`-presentatie, met beschikbare termijnstatus voor niet-van-toepassing, geen afzonderlijke bronkolom en onbekend. Een lege tekststring wordt als lege bronwaarde benoemd. De export bewaart lege cellen en houdt aanvullende statusinformatie afzonderlijk; er wordt niets ingevuld of berekend.

## Tabelzoeken en navigatie

Het veld **Zoek in deze tabel** is een afzonderlijk, eenvoudig filter. Een volledige, bestaande officiële code vindt precies de voorschriften met die code. Anders moeten alle woorden in de getoonde officiële velden en structuurcontext voorkomen. Hoofdletters, diakritische tekens, Unicode en interpunctie worden voor matching genormaliseerd; de weergegeven bronwaarden blijven ongewijzigd. Er is geen rangschikking, lexiconuitbreiding, AI-relatie of verwijzing naar een andere lijst.

**Tabelzoekopdracht wissen** herstelt de volledige lijst. Iedere lijst bewaart haar eigen zoek-/scrollcontext tijdens dezelfde sessie. Wisselen toont geen oude resultaten of oude downloadknop tijdens de nieuwe lading; een laat antwoord kan een nieuw gekozen lijst niet overschrijven.

Een codelink opent het bestaande detailpaneel via `#selectie=` met de URL-gecodeerde volledige technische ID. **Terug naar tabelrij** staat bij ieder officieel voorschrift en opent `#lijst=` met dezelfde ID, bijvoorbeeld `#lijst=1996-2012%3A3.6.2%3A%3A008`. De bijbehorende rij wordt gemarkeerd, in beeld geschoven en de codelink krijgt focus. De bestaande zoekcontext blijft waar mogelijk behouden; alleen een filter dat die expliciet opgevraagde rij uitsluit wordt gewist. Browsergeschiedenis werkt tussen deze functies. Een lijst zonder rij kan rechtstreeks worden geopend met bijvoorbeeld `#lijst=2020`. Alle links blijven geschikt voor een GitHub Pages-repositorysubpad.

Concordansrelaties blijven via de bestaande technische koppelingen naar dezelfde details navigeren. De teruglink naar de tabel gebruikt het daadwerkelijk geselecteerde record, niet alleen de officiële rubriekcode. Geen concordansmapping, kandidaat of beoordelingsbesluit is aangepast.

## Drie Excel-downloads

| Lijst | Knop | Bestandsnaam |
| --- | --- | --- |
| 1996/2012 | Download Selectielijst 1996-2012 (.xlsx) | `Selectielijst 1996-2012.xlsx` |
| 2017 | Download Selectielijst 2017 (.xlsx) | `Selectielijst 2017.xlsx` |
| 2020 | Download Selectielijst 2020 (.xlsx) | `Selectielijst 2020.xlsx` |

Alle bestanden hebben eerst **Selectiegegevens**, daarna **Bronvermelding**. Alle voorschriften worden meegenomen, inclusief vervallen regels en ongeacht een actief zoekfilter. Het eerste blad heeft filterbare kolommen en een vaste koprij. Tekstcodes blijven tekst; formuleachtige tekst wordt niet uitgevoerd. De bestaande XLSX-bibliotheek wordt pas bij downloaden geladen; dezelfde schrijver wordt door de concordans en de selectielijsten gebruikt. Softwarelicenties blijven in de statische build beschikbaar.

De leesbare tabelkolommen worden aangevuld met officiële benaming, procesobject, herkomst waardering, taakvelden, uitzonderingen/verwijzingen, voorwaardenverwijzingen, bronlocaties en aanvullende bronnen, letterlijke procestoelichting en technische termijnstatussen. Bronannotaties staan afzonderlijk als leesbare bevinding/verwerking en als JSON, niet als vervanging van de officiële waarde.

Voor controle op volledigheid bevat iedere rij ook expliciet als technisch benoemde record-/structuur-ID, het **volledige ongewijzigde datasetrecord** en het **volledige structuurpad** als JSON. Dit bewaart alle geneste velden, bronsegmenten, oorspronkelijke bronrij, statussen en annotaties zonder ze als nieuwe officiële tekst te presenteren. Deze controlekolommen zijn aanvullende metadata; de compacte webtabel is geen volledige weergave van ieder recordveld.

Bronvermelding bevat titel, versie, vaststelling, officiële bronlinks/metadata, UTC-exportdatum, uitleg over representatie/technische IDs en de bestaande rechtenafbakening. Ook de algemene bepalingen en historische rubriekcontext staan in dit blad: leesbare primaire tekst plus het volledige bestaande broncontextrecord als controle-JSON. Langere waarden worden zonder inhoudsverlies in genummerde delen onder de Excel-cellimiet opgenomen. Ontbrekende of ongeldige context blokkeert de export in plaats van voorwaarden weg te laten. Niet-afdrukbare bronkarakters worden met de standaard OOXML ST_Xstring-codering behouden, evenals letterlijke escapevormen en lege tekst. Geen oorspronkelijke PDF-/Excel-auteursmetadata worden gelezen of overgenomen.

## Hergebruik en afbakening

De bestaande [rechtenbeoordeling](../HERGEBRUIK.md), [importcontrole](dataset-importcontrole.md) en publieke bronregistraties blijven uitgangspunt. De nieuwe Excel is een tekstuele representatie van dezelfde reeds gepubliceerde vastgestelde selectiegegevens en toelichting. De bestaande artikel 11-beoordeling in samenhang met de drie Staatscourantbesluiten blijft daarop van toepassing binnen dezelfde afbakening; er wordt geen nieuwe algemene licentie voor alle oorspronkelijke documenten verleend.

Er zijn geen oorspronkelijke PDF's/spreadsheets, beelden, AI-rapporten, zoeklexicons of volledige concordansgegevens aan de exports toegevoegd. Bestaande bronreferenties naar ondersteunend materiaal blijven metadata, geen heruitgave daarvan. Bronannotaties en technische verificatiegegevens zijn herkenbaar van normtekst gescheiden. Er worden geen aanvullende vertrouwelijke gegevens of externe documentmetadata geïntroduceerd; alleen bestaande publieke JSON wordt gebruikt. De zelfstandige concordans houdt haar afzonderlijke distributieblokkade. GitHub Pages is niet geactiveerd.

Dit naslagwerk bepaalt niet welk voorschrift juridisch of archivistisch op een casus van toepassing is en berekent geen vernietigingsdatum.

## Implementatie, testen en beperkingen

- `src/raadplegen/index.ts`: veldprojectie en eenvoudig tabelzoeken op bestaande datasetrecords.
- `src/interface/selectielijsten-viewer.ts`: lijstkeuze, doorlopende tabel, status/focus en downloaden.
- `src/raadplegen/excel.ts`: volledige gegevens- en broncontextprojectie voor de twee werkbladen.
- `src/gedeeld/tekstfilter.ts` en `src/gedeeld/excel.ts`: gedeelde tabelmatching en veilige XLSX-schrijver, ook gebruikt door de concordans.
- `src/interface/context.ts`: bestaande broncontextcache, nu tevens beschikbaar voor de nieuwe exports.

Gebruik `npm test`, `npm run typecheck` en `python scripts/valideer_publicatie.py`. Voor alle bestaande echte-concordanstests blijft de eerder beschreven lokale `CONCORDANS_BRON_JSON`-procedure nodig. De nieuwe functie zelf vereist die privébron niet: de aparte browserrun `CHROMIUM_PATH=/usr/bin/chromium npx playwright test selectielijsten-viewer.spec.mjs` werkt zonder die omgevingsvariabele op de gewone publieke build.

De regressies controleren aantallen, alle record-ID's en bronvolgorde, context, gedeelde codes, vervallen regels, zoeken/wissen, datasetisolatie/cache, navigatie/focus/browsergeschiedenis, ontbrekende bestanden en late antwoorden. Iedere Excel wordt via onafhankelijke ZIP/XML-teruglezing gecontroleerd op exacte namen, aantallen, tabelwaarden, volledige datasetrecords/structuurpaden, bepalingen en historische context. Browserdownloads worden werkelijk uitgevoerd terwijl een filter geen resultaten toont. Bronbestanden, lexicons, concordansrelaties en besluiten worden met een Git-diff en de bestaande integriteitsvingerafdrukken op behoud gecontroleerd.

Er is geen virtual scrolling nodig voor deze begrensde aantallen. Grote teksten maken tabellen breed; gebruik horizontaal scrollen en de bestaande details. De export kan kort verwerkingstijd en lokale browser-Workers vragen. Andere browserengines, fysieke langzame apparaten en handmatige opening in Microsoft Excel/LibreOffice zijn niet afzonderlijk gevalideerd; onafhankelijke XLSX-teruglezing en echte Chromium-downloads leveren het technische bewijs. De bronnen behouden hun reeds gedocumenteerde beperkingen, waaronder geen integrale onafhankelijke menselijke tweede lezing.

## Uitgevoerde eindcontrole — 11 november 2026

**149 moduletests en 84 Chromium-browsertests geslaagd, nul overgeslagen**, met de werkelijke lokale concordans voor de bestaande regressies. Daarnaast zijn **alle zeven nieuwe browsertests zonder `CONCORDANS_BRON_JSON` geslaagd** op de gewone publieke build. Productiebuild, typecheck en `python scripts/valideer_publicatie.py` zijn geslaagd. Een Git-diff bevestigt dat officiële datasets, schema's, zoeklexicons, concordansregistraties en beoordelingsbesluiten ongewijzigd zijn. De bestaande 612/606/6-dekking en alle eerdere integriteitsvingerafdrukken blijven behouden.

De enige bewust gewijzigde bestaande UI-verwachting is de gevraagde navigatienaam **Zoeken en verkennen**. Inhoudelijke bron- en zoekverwachtingen zijn niet aangepast. De nieuwe brongetrouwheidstests gebruiken de werkelijk aanwezige 36 regels onder 3.6.2 en het letterlijke label `Archiefvernie- tiging` voor 2020:19.1.19; er wordt geen genormaliseerde bronwaarde afgedwongen.

| Aanvullende controle | Uitkomst |
| --- | --- |
| Browseromgeving | Bestaande Playwright met systeem-Chromium; Browser-plugin niet beschikbaar |
| Publieke route | `http://127.0.0.1:4206/semantische-selectie-tool/`, zonder privébronalias |
| Paginatitel / inhoud / fouten | Correcte titel, betekenisvolle tabelinhoud, geen foutoverlay of console-/runtimefouten |
| Desktop en mobiel | 1440×1000 en 390×844 visueel gecontroleerd; geen horizontale documentoverloop; eigen tabelscrollgebied |
| Werkelijke interactie | Drie lijsten kiezen → drie downloads → exact codefilter → bestaande details → terug naar dezelfde gemarkeerde tabelrij |
| Netwerkisolatie | Geen concordans- of lexiconrequests tijdens deze nieuwe functie |
| Brongetrouwheid | Alle records/kolommen en oorspronkelijke teksten teruggelezen; volledige datasetrecords, structuurpaden, bepalingen en rubriekcontext gelijk aan de JSON |
| Formaten / metadata | Drie exacte bestandsnamen, twee exacte werkbladnamen; geen auteursmetadata, macro's, externe werkmaplinks of formuleconversie |

Indicatieve lokale meting, inclusief laden/validatie waar nodig: tabelopbouw 1.141 / 324 / 242 ms voor 1996/2012, 2017 en 2020; Excel-download inclusief generatie 1.288 / 670 / 1.022 ms. De bestanden waren circa 447 / 231 / 249 kB. Deze eenmalige omgevingsmeting is geen prestatiegarantie voor ieder apparaat. De aantallen zijn beperkt genoeg voor native tabellen zonder virtual scrolling. Screenshots en gegenereerde testbestanden staan buiten Git.
