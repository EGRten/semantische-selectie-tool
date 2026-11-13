# Praktijktest toegankelijkheid

Dit protocol vult REL-02/UI-09 aan. **Alle praktijkresultaten hieronder starten op Niet uitgevoerd.** Een workflow, axe-scan of ARIA-inspectie vervangt geen schermlezer-, Windows- of documentpraktijkproef. Gebruik de bestaande [browservalidatie](browsercompatibiliteit-en-toegankelijkheid.md); herhaal geen algemene audit.

## Voorbereiden en vastleggen

Gebruik de te beoordelen build onder het repositorysubpad, of een lokale preview die een begeleider klaarzet. Noteer URL, commit/build, datum, besturingssysteem, browserversie, schermlezer/appversie, taal, zoom, gekozen thema en relevante AT-instellingen. Start met een schoon venster en **Weergave: Systeem**, browserzoom 100%. Gebruik alleen openbare voorbeeldgegevens; geen persoonlijke dossiers. Open geen echte casus in een screenshot of opname.

Maak per combinatie een kopie van de scenariotabellen. Vul Werkelijk gedrag concreet in, ook als het slaagt: wat werd uitgesproken, waar stond de focus en wat was de volgende bereikbare bediening? Resultaat is **Geslaagd / Afwijking / Geblokkeerd / Niet uitgevoerd**. Gebruik bij afwijkingen **blokkerend / belangrijk / niet-blokkerend**, met reproduceerstappen en minimaal bewijs. Bewijs kan een korte geanonimiseerde notitie zijn; opnamen alleen indien nodig en zonder persoonsgegevens.

| Omgeving | Uit te voeren | Huidige status |
| --- | --- | --- |
| Windows + NVDA + Chrome | SR-01 t/m SR-08 | Niet uitgevoerd |
| Windows + NVDA + Firefox | SR-01 t/m SR-08 | Niet uitgevoerd |
| macOS + VoiceOver + Safari | SR-01 t/m SR-08 | Niet uitgevoerd |
| iOS + VoiceOver + Safari, indien beschikbaar | SR-01 t/m SR-08, mobiele vergelijking en tabellen | Niet uitgevoerd |
| Windows Contrast Themes + toetsenbord | CT-01 en CT-02 | Niet uitgevoerd |
| Microsoft Excel + NVDA | XLS-01 t/m XLS-04 | Niet uitgevoerd |
| Geschikte spreadsheetapp + VoiceOver, indien beschikbaar | XLS-01 t/m XLS-04, app/versie apart noteren | Niet uitgevoerd |

Toetsen kunnen afhangen van versie en instellingen. NVDA-toets is meestal Insert of Caps Lock; `NVDA+Spatie` wisselt lees-/focusmodus. Gebruik Tab/Shift+Tab, Enter/Spatie, pijlen, Home/End; in NVDA-leesmodus H voor koppen, D voor landmarks, T voor tabellen en Ctrl+Alt+pijlen voor tabelcellen. VoiceOver: VO is Ctrl+Option; VO+U opent de rotor, VO+Spatie activeert, VO+Shift+pijl-omlaag/-omhoog start/stopt interactie met een onderdeel. Schakel zo nodig Quick Nav uit om pijlen aan de boom door te geven. Op iOS: veeg links/rechts, dubbel tik om te activeren en gebruik de rotor. Noteer afwijkende instellingen; beoordeel eerst normaal gebruik zonder per-record reparaties.

## Scenario 1 — Eerste oriëntatie

| Test-ID | Startpositie | Handelingen | Verwacht gedrag | Werkelijk gedrag | Resultaat | Bewijs | Ernst |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SR-01 | Startpagina, geen lijst gekozen | Laat paginatitel en taal voorlezen; navigeer langs koppen/landmarks; zoek de skiplink via Tab of linklijst en activeer die; lees verder | Titel benoemt Semantische Selectie Tool; Nederlandse uitspraak; hoofdnavigatie, selectie en details zijn herkenbaar. Skiplink zet focus op de zichtbare relevante inhoud; geen onlogische sprong of val | — | Niet uitgevoerd | — | — |

## Scenario 2 — Selectielijsten en boomstructuur

| Test-ID | Startpositie | Handelingen | Verwacht gedrag | Werkelijk gedrag | Resultaat | Bewijs | Ernst |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SR-02 | Zoeken en verkennen | Kies achtereenvolgens 1996/2012, 2017 en 2020. Tab naar de boom; rechts klapt open, omlaag verplaatst, links keert terug/klapt in; Home/End; Enter selecteert. Controleer ook de uitklappijl met aanwijzer indien gebruikt | Boomnaam, niveau, uitgeklapt/ingeklapt en selectie zijn begrijpelijk. Boom-Enter houdt focus in de boom en toont het gekozen detail; pijlen blijven werken. Bij lijstwissel geen oude selectie of gemengde inhoud; alle losse historische voorschriften bereikbaar | — | Niet uitgevoerd | — | — |

## Scenario 3 — Exact en begripsgericht zoeken

| Test-ID | Startpositie | Handelingen | Verwacht gedrag | Werkelijk gedrag | Resultaat | Bewijs | Ernst |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SR-03 | Lijst 2020 actief | Zoek bij Trefwoordzoeken eerst `19.1.19`, daarna `Gemeentewapen`; Enter. Ga naar resultaten en activeer een resultaat. Wissel naar Begripsgericht zoeken, zoek `bodemonderzoek`; lees resultaat en verklaring. Wis de opdracht; probeer `zzzonvindbaarzzz` | Velden/tabs hebben duidelijke namen; aantal/lege toestand wordt op bruikbaar moment aangekondigd zonder focusroof of hinderlijke herhaling. Resultaten hebben code, benaming en context; begripstreffer vermeldt de verklaring. Activering geeft juiste URL, detailtitel en focus. AI-verrijking is geen officieel selectieadvies | — | Niet uitgevoerd | — | — |

## Scenario 4 — Details en broninformatie

| Test-ID | Startpositie | Handelingen | Verwacht gedrag | Werkelijk gedrag | Resultaat | Bewijs | Ernst |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SR-04 | Detail `#selectie=2020%3A19.1.19` | Lees via koppen en veldnamen; waardering, volledige termijn, procestermijn en voorwaarden. Open broncontext en annotaties; volg een bronverwijzing en keer terug. Probeer Kopieer selectiegegevens | Code, benaming, officiële tekst en context zijn gekoppeld en volledig bereikbaar. Geen uitgesproken technische null-waarden. Bronannotatie/eigen toelichting is herkenbaar gescheiden van officiële gegevens. Bronlink heeft begrijpelijk doel; kopieerbevestiging of fout wordt aangekondigd | — | Niet uitgevoerd | — | — |

## Scenario 5 — Historische vergelijking

| Test-ID | Startpositie | Handelingen | Verwacht gedrag | Werkelijk gedrag | Resultaat | Bewijs | Ernst |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SR-05 | Zelfde 2020-detail | Open Vergelijk met andere selectielijsten, daarna Vergelijk officiële gegevens bij een relatie. Navigeer met schermlezertabeltoetsen. Open gerelateerd voorschrift en keer terug. Herhaal op smal scherm of echte 400%-zoom; iOS indien beschikbaar | Bronrichting en koppelstatus zijn begrijpelijk, zonder suggestie van gelijkwaardigheid. Rijkop en beide voorschriftkolommen blijven bij elkaar; leesvolgorde veld → geselecteerd → gerelateerd is ook mobiel begrijpelijk. Openen/sluiten en terugkeer geven voorspelbare focus | — | Niet uitgevoerd | — | — |

## Scenario 6 — Vier tabellen en concordans

| Test-ID | Startpositie | Handelingen | Verwacht gedrag | Werkelijk gedrag | Resultaat | Bewijs | Ernst |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SR-06 | Selectielijsten raadplegen; daarna Concordans raadplegen | Controleer 1996/2012 (494), 2017 (305), 2020 (346) en concordans (716). Navigeer koppen/cellen, scroll verticaal en horizontaal, filter en wis; selecteer eerste, middelste en laatste rij. Concordans: Ga naar bronrij `21`. Open een gekoppeld voorschrift en gebruik terugnavigatie | Tabelnaam, kolom-/rijkoppen en aantallen zijn begrijpelijk, zonder paginering. Focus blijft zichtbaar onder vaste koppen; regionavigatie sluit de gebruiker niet op. Filterstatus wordt aangekondigd. Bronrij, lege broncellen, mergecontext en technische interpretatie zijn te onderscheiden. Terugkeer herstelt juiste rij/context | — | Niet uitgevoerd | — | — |

## Scenario 7 — Thema's en instellingen

| Test-ID | Startpositie | Handelingen | Verwacht gedrag | Werkelijk gedrag | Resultaat | Bewijs | Ernst |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SR-07 | Een zoekvraag/resultaat of gefilterde tabel actief | Tab naar Weergave; kies Systeem, Licht, Donker, Hoog contrast; herlaad na expliciete keuze. Keer terug naar eerdere taak | Label, huidige waarde en vier opties worden uitgesproken. Wijziging behoudt focus, selectie, zoek-/scrollcontext; expliciete keuze blijft na herladen behouden. Native Windows-contrast heeft voorrang op het applicatiepalet | — | Niet uitgevoerd | — | — |

## Scenario 8 — Foutmeldingen en herstel

| Test-ID | Startpositie | Handelingen | Verwacht gedrag | Werkelijk gedrag | Resultaat | Bewijs | Ernst |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SR-08 | Nieuw startvenster zonder geladen lijsten | Open `#selectie=2020%3Abestaat-niet` voor een ongeldige verwijzing. Voor laadfout: begeleider zet browsernetwerk offline terwijl startpagina al openstaat; kies een nog niet geladen lijst. Zet netwerk terug online en activeer Opnieuw proberen | Begrijpelijke fout, geen fictieve bronwaarde of blanco toestand. Melding wordt aangekondigd; herstelknop is vindbaar en bruikbaar en herstelt juiste lijst. Focus raakt niet zoek. Als netwerkproef niet veilig uitvoerbaar is: Geblokkeerd noteren, geen geslaagde test registreren | — | Niet uitgevoerd | — | — |

De begeleider kan in browserontwikkeltools de netwerkstand Offline/Online instellen; dit vereist geen applicatiecodewijziging. Voorkom dat de hele pagina offline wordt herladen: dat toetst vooral de browser, niet de foutafhandeling van de geladen app. Ongeldige JSON is reeds onderwerp van automatische tests; maak daarvoor geen publiek beschadigd bronbestand.

## Daadwerkelijke Windows Contrast Themes

Gebruik Windows-instellingen → Toegankelijkheid → Contrastthema's (of het equivalente menu van de Windows-versie). Noteer de exacte themanamen en kies minstens één donker en één licht thema indien beschikbaar. Dit is **geen** test van alleen de applicatieoptie Hoog contrast en **geen** Chromium-emulatie van forced-colors. Voer met uitsluitend toetsenbord de routes SR-02/03/05/06/07/08 uit.

| Test-ID | Startpositie | Handelingen | Verwacht gedrag | Werkelijk gedrag | Resultaat | Bewijs | Ernst |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CT-01 | Echt Windows, donker contrastthema | Doorloop boom/zoeken, details/vergelijking en vier tabellen; wissel applicatiethema en focus; toon status/fout | Tekst/links leesbaar; focus en selectie herkenbaar zonder alleen achtergrondkleur; uitklapstatus zichtbaar. Velden, knoppen en grenzen onderscheiden; native kleuren hebben voorrang. Geen onbereikbare of bedekte bediening | — | Niet uitgevoerd | — | — |
| CT-02 | Echt Windows, licht contrastthema | Herhaal CT-01; controleer ook niet-geselecteerde en geselecteerde rij naast elkaar | Zelfde criteria in licht systeemcontrast; betekenis en interactie blijven behouden. Niet beschikbaar? Geblokkeerd met reden, niet vervangen door emulatie | — | Niet uitgevoerd | — | — |

## Excel met schermlezer

Download alle bestanden uit de te testen gewone build, zonder actief filter als bronselectie; export blijft altijd volledig. Noteer app-/schermlezerversies. Open zonder het bestand te bewerken. Een normale Beveiligde weergave door een internetdownload apart noteren; een onverwachte herstel- of formaatwaarschuwing is een afwijking.

Per bestand: wissel werkblad (in Excel meestal Ctrl+PageUp/PageDown), Ctrl+Home naar A1, pijlen en schermlezerbediening door eerste/middelste/laatste rij. Controleer koppen zonder extra per-bestand handmatig ingestelde AT-koppen; noteer als zulke aanpassing nodig is. Lees een lange termijn/toelichting volledig (zo nodig F2 en afsluiten met Esc zonder wijziging). Lees Bronvermelding en eventuele Toelichtingen. Probeer vergroting via Beeld/Zoom en toetsenbordbediening. Een Office-toegankelijkheidscontrole is aanvullend, geen vervanging van deze praktijkproef.

| Test-ID | Startpositie | Handelingen | Verwacht gedrag | Werkelijk gedrag | Resultaat | Bewijs | Ernst |
| --- | --- | --- | --- | --- | --- | --- | --- |
| XLS-01 | `Concordans 1996-2020.xlsx` | Bovenstaande proef in Microsoft Excel+NVDA; optionele VoiceOver-proef apart vastleggen | Opent zonder herstel; werkbladen Concordans 1996-2020 en Bronvermelding herkenbaar. 716 rijen, bronrij en A–K; oorspronkelijke cel en mergecontext begrijpelijk gescheiden. Koppen, lange tekst, bronvermelding en navigatie bruikbaar | — | Niet uitgevoerd | — | — |
| XLS-02 | `Selectielijst 1996-2012.xlsx` | Zelfde proef | Selectiegegevens, Toelichtingen en Bronvermelding herkenbaar; 494 voorschriften afzonderlijk, ook gedeelde codes. Koppen/context, termijnen en broninformatie leesbaar en navigeerbaar | — | Niet uitgevoerd | — | — |
| XLS-03 | `Selectielijst 2017.xlsx` | Zelfde proef | Dezelfde drie bladen; 305 resultaatregels. Koppen, proces-/resultaatcontext, volledige termijnen en broninformatie leesbaar en navigeerbaar | — | Niet uitgevoerd | — | — |
| XLS-04 | `Selectielijst 2020.xlsx` | Zelfde proef | Dezelfde drie bladen; 346 resultaatregels inclusief vervallen regels. Volledige bronwaarden en aanvullende informatie leesbaar en navigeerbaar | — | Niet uitgevoerd | — | — |

**Technisch correcte OOXML en brongetrouwe inhoud bewijzen geen documenttoegankelijkheid.** Registreer resultaten per bestand én app/AT-combinatie; een geslaagde Excel/NVDA-proef geldt niet automatisch voor een andere spreadsheetapp.

## Gerichte aanvullende beoordeling en afronding

Beoordeel alleen de resterende dekking, naast bovenstaande scenario's:

| Open punt | Beoordeling / bewijs |
| --- | --- |
| Contrast en axe-incomplete | Beoordeel werkelijk zichtbare tekst/bediening bij scroll en selectie in alle paletten en native contrast; noteer kleuren/contrastberekening. Offscreen/bedekte axe-nodes zijn niet automatisch geslaagd of fout |
| Skiplink/focus | SR-01/03/05/06/08; ook Tab/Shift+Tab na filteren en terugnavigatie, 320px en echte 200/400%-browserzoom |
| 2.5.8 doelgrootte | Boompijl, hoofdcontrols, rij-/bronlinks en mobiele bediening; meet 24×24 CSS px of beoordeel toepasselijke afstands-/inline-/andere uitzonderingen. Geen algemene 44px-AA-eis |
| 3.1.2 taalonderdelen | Let op doorlopende anderstalige passages en uitspraak; eigennamen/vaktermen kunnen uitzonderingen zijn. Geen spelling-, vertaal- of brontekstwijziging uitvoeren |
| Status, boom-ARIA, leesvolgorde, tabellen | Werkelijke uitspraak/timing en bruikbaarheid in SR-02/03/05/06/08; DOM/axe alleen is onvoldoende |

Alle aanvullende beoordelingen zijn **Niet uitgevoerd** totdat een tester het betreffende bewijs vastlegt. Het rapport noemt wat automatisch is getest en wat werkelijk door een mens met AT is beoordeeld; geen volledige WCAG-conformiteit op basis van scans.

Bij een defect: noteer ID, build, combinatie, stappen, verwacht/werkelijk, ernst en minimaal bewijs. Kleine afgebakende correctie: gerichte regressie en hertest in betrokken combinaties. Grotere problemen: herstelvoorstel vastleggen, geen herontwikkeling starten. Na herstel blijft de oude uitkomst traceerbaar en krijgt de hertest een eigen datum/build. Pas REL-02 aan op basis van bewijs; sluit het niet na alleen inrichting van workflow of protocol.

Het WCAG 2.2-AA-doel is een projectkwaliteitsdoel. Dit particuliere project wordt niet automatisch als overheidswebsite met alle bijbehorende wettelijke verplichtingen aangemerkt. Een technische praktijkproef stelt de wettelijke scope niet vast.
