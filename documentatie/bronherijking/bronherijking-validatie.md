# Uitgevoerde validatie

Uitvoering op branch `gegevens/integrale-bronherijking-2026-11-25`, uitgangscommit `1557833777cba086ddd88a69190bd9e6f0a0713b`. Python 3.12.14, Node.js v24.22.1 en bestaande vastgelegde dependencies. Alle aantallen zijn gemeten, geen verwachte aantallen die kunstmatig zijn afgedwongen.

| Controle | Daadwerkelijke uitkomst |
| --- | --- |
| PDF-identiteit | 3/3 SHA-256, bytegrootte en pagina-aantal exact volgens manifest |
| Broninventaris | 334 pagina's, alle tekstblokken, twee visueel getranscribeerde rasterfiguren |
| Codes 2017/2020 | 305/346 unieke PDF-codes; onafhankelijke proceskolomscan sluit aan |
| 1996/2012 | 489 onafhankelijke waarderingsankers verantwoorden alle 494 bestaande regels; 130 fysieke tabelgroepen |
| Bestaande bronsegmenten 2012 | 1.624 opnieuw gelezen; drie vensters bevatten tevens een rubriekprefix, expliciet bewaard |
| Glyphherstel | 120/120 pagina's pixel-identiek vóór/na uitsluitend technische ToUnicode-mapping |
| Selectievelden | 10.160 veldparen technisch vergeleken; categorieën in tellingen/afwijkingenregister |
| ID's en relaties | Alle bestaande technische ID's behouden; alle lexicon-/relatiedoelen bestaan; geen nieuwe semantische of historische relaties |
| Brononzekerheden | 83 beoordelingspunten bewaard; niet opnieuw bevestigde selectievelden ook op recordniveau gemarkeerd; eerdere annotaties ongewijzigd behouden |
| Oorspronkelijke concordans | 716 rijen en 7.876 cellen plus mergecontext rechtstreeks tegen gehashte oorspronkelijke Excel gecontroleerd |
| Typecheck | `npm run typecheck` geslaagd |
| Productiebuild | `npm run build` geslaagd; bestaande subpadinrichting behouden |
| Schema's en integriteit | `python scripts/valideer_publicatie.py` geslaagd; alle manifest- en inhoudelijke hashes gecontroleerd |
| Dataset-CSV's | `python scripts/reproduce.py --output ...` herhaalt alle 15 exports byte-identiek |
| Publieke projecties | `node scripts/genereer-publicaties.mjs --check`: alle vier reproduceerbaar |
| Onderzoeks-CSV's | UTF-8 BOM/puntkomma, gelijk kolomaantal, verliesvrij teruggelezen; cellen binnen 32.767 tekens |
| Herinventarisatie herhaald | Twee volledige runs; alle 65 gegenereerde bestanden byte-identiek; script- en invoeridentiteit vastgelegd |
| Unittests | 159 geslaagd, 0 mislukt, 18 optionele tests overgeslagen |
| Diffcontrole | Code/JSON/Markdown geslaagd; bronwitruimte en bestaande CRLF in CSV niet inhoudelijk weggepoetst |

## Browsercontrole

De productiebuild is met de bestaande compatibiliteitsconfiguratie onder `/semantische-selectie-tool/` getest. De volledige Chromium-run omvatte 153 gevallen: 152 geslaagd en één verouderde annotatietelling mislukt. Die test telde 11 annotaties, terwijl de 11 oorspronkelijke annotaties nu vier expliciete herijkingsvragen erbij hebben. De test is op **11 oorspronkelijke + 4 aanvullende** geactualiseerd; alle bestaande inhoudelijke assertions blijven behouden. Vervolgens zijn de detailsuite en de drie nieuwe bronherijkingstests gericht herhaald: **15/15 geslaagd**. Er wordt geen nieuwe volledige 153/153-run na deze testactualisatie geclaimd.

De uitgevoerde Chromium-gevallen omvatten alle drie de lijsten, boom en details, beide zoekmodi, lijstisolatie en standaard uitgeschakelde onbevestigde AI, concordans/historische vergelijkingen, desktop/mobiel, thema's, toetsenbordbediening, het subpad en publieke documenten. Alle **vier Excel-downloads** zijn echt gedownload en onafhankelijk teruggelezen; primaire bronwaarden en aanvullende informatie sluiten aan op de bijgewerkte projecties. Nieuwe regressies controleren beide concrete 2012-correcties in details/tabel en de zichtbare aanvullende 2017-brononzekerheid.

Browserdownloads waren aanvankelijk geweigerd maar kwamen later beschikbaar. Een nieuwe Firefox-run is daadwerkelijk geprobeerd met de voorgeschreven Firefox 159.0. Eén browseronafhankelijke HTTP-documentcontrole slaagde; 146 gevallen konden hun browser niet starten (`Could not find profile folder`). Een startprobe met een alternatieve tijdelijke map gaf dezelfde fout. Dit zijn **geen 146 aangetoonde applicatiefouten** en geen geslaagde functionele Firefox-validatie.

WebKit is gedownload maar de startprobe meldt ontbrekende hostlibraries: `libgtk-4.so.1`, `libgraphene-1.0.so.0`, `libharfbuzz-icu.so.0`, `libmanette-0.2.so.0`, `libhyphen.so.0` en `libGLESv2.so.2`. Er is geen werkende toegestane systeempackagehelper beschikbaar. De functionele WebKit-suite is daarom niet uitgevoerd. Er zijn geen repository-afhankelijkheden of tests gewijzigd om deze omgevingsproblemen te maskeren. Definitieve bevestiging van Firefox/WebKit moet in een geschikte runner gebeuren; de bestaande workflow met alle browsers is behouden.

## Grenzen en resterende beoordeling

De 18 optionele unittests vereisen de oorspronkelijke externe bronrij-JSON van de concordans. Die is niet uit andere data gereconstrueerd. De beschikbare oorspronkelijke Excel is wel onafhankelijk op alle cellen en mergecontext gecontroleerd; de overige technische concordans- en projectietests zijn uitgevoerd.

De 83 beoordelingspunten bestaan uit 77 letterlijke 2012-verschillen, twee structuurnamen en vier lege 2017-PDF-cellen tegenover eerdere expliciete `Nihil`-keuzes uit Excel. Geen betekenis van leegte, andere afbakening of bewaartermijn is zelfstandig vastgesteld. De vier eerdere keuzes blijven als historische feiten bewaard, met nieuwe beperkte bronstatus en afzonderlijke waarschuwingen. Alle andere betwiste waarden zijn voorlopig behouden.

De inventaris is een technische bron-/locatiecontrole, geen integrale archivistische tweede lezing. Algemene bepalingen en bijlagen zijn volledig beschikbaar als broncontext, niet als nieuwe automatisch toegepaste regels. Geen definitieve inhoudelijke acceptatie, geen nieuwe historische relaties, geen merge, geen Release en geen GitHub Pages-deployment.
