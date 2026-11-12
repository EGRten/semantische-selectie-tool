# Concordansdistributie na PR #18 — beoordeling opdracht 18

## Uitkomst

Beoordeeld op 11 november 2026, op branch vanaf mergecommit `1752e50` van PR #18. Het functionele doel blijft integrale publieke raadpleging en vier werkende Excel-downloads. **Na de aanvullende publicatie-instructie werken alle vier downloads uit de gewone productiebuild.** De juridische onderbouwing van hergebruik en de technische beschikbaarheid worden afzonderlijk gerapporteerd.

De projecteigenaar heeft tijdens deze opdracht vervolgens expliciet gevraagd de distributieblokkade te negeren en toch te publiceren. Dat gewijzigde uitvoeringsbesluit is technisch verwerkt: de compacte projectie staat in de reguliere build, zonder privébronvoorziening. Voor deze specifieke zelfstandige concordans is nog steeds geen voldoende onderbouwde wettelijke vrijstelling, toepasselijke hergebruikregeling of toestemming aangetoond. Dit is **geen bewezen vaststelling dat toestemming noodzakelijk is**, dat de werkmap daadwerkelijk auteursrechtelijk beschermd is of dat een databankenrecht bestaat. De juridische voorwaarden voor publicatie zonder toestemming kunnen met de beschikbare herkomststukken evenmin worden vastgesteld. Daarom wordt geen volledige bron overgenomen op basis van een onbewezen kwalificatie.

De beoordeling hieronder is een toepassing van de genoemde toetsingskaders op de beschikbare stukken, geen onafhankelijk deskundigenoordeel of nieuw bewijs van eigendom. Er is geen nieuwe privacyblokkade: de bestaande inventarisatie blijft gelden, alle 716 rijen en A–K blijven technisch behouden.

## Beschikbare bewijsstukken

| Bewijs | Vastgesteld | Betekenis en beperking |
| --- | --- | --- |
| [Bronregistratie](../bronnen/concordans-aangeleverd.bron.json) | Oorspronkelijke werkmapnaam, hash en VHIC-FAQ als vindplaatscontext; exacte download-URL onbekend | Geen vastgestelde auteur, uitgever, producent of overdracht van rechten. Vermelding van VHIC bewijst niet dat VHIC rechthebbende is |
| Oorspronkelijke werkmap | SHA-256 `7dfda792ce61c1a6fa28c5c116155a429560153178c6c58987eabbbe6cdf708c`; opnieuw lokaal geverifieerd | Identificeert het onderzochte object; geen wettelijke kwalificatie of licentie |
| Bestaande JSON-spiegel | SHA-256 `b01cff07c7bfeeb6f562d467373615f5a18cfc7ab9777f11fcd5cb1ed7de73dd`; opnieuw lokaal geverifieerd; 716 rijen | Getrouwe omzetting, geen onafhankelijk vervaardigde vergelijkingsverzameling |
| Bronopbouw | A–D historisch voorschrift/termijn; E–I koppeling naar 2020; J–K opmerkingen/waardering 2017. In oorspronkelijke J zijn 40 cellen gevuld, in K 14 | Zelfstandige combinatie en toelichting; geen volledige 2017-mapping. Aantal gevulde cellen bewijst geen originaliteit of substantiële investering |
| Bekende afwijkingen en besluiten | Bronwaarde rij 21 `19.1.` en rij 716 `19.21.1` blijven intact; technische interpretaties staan apart. Rijen 50–52 hebben een afwijkende historische formulering | Bevestigt dat het bestand geen identieke heruitgave van uitsluitend officiële besluiten is. Afwijkingen bewijzen op zichzelf geen auteursrechtelijke bescherming |
| Werkmaponderdelen en koppen | Geen licentie-/rechtenonderdeel, custom-properties of externe-linkonderdelen aangetroffen; eerdere controle koppen zonder vrijgave | Afwezigheid van een licentie is geen bewijs van bescherming en ook geen vrijgave. Office-productmetadata stellen de maker/rechthebbende niet vast |
| [HERGEBRUIK.md](../HERGEBRUIK.md) en [pakketcontrole](../documentatie/publicatiecontrole.md) | Eerdere kwalificatie officiële besluitteksten; zelfstandige concordans uitgesloten | Onderzoeksdocumentatie, geen toestemming van een derde en geen wettelijke regel |

De oorspronkelijke Excel en volledige oorspronkelijke JSON-spiegel zijn alleen lokaal onderzocht en niet aan deze wijziging toegevoegd. De compacte inhoudelijke publicatieprojectie is wel opgenomen op grond van de aanvullende instructie. De eerdere volledige broncelcontrole en privacy-inventarisatie worden niet zonder aanleiding overgedaan. Bronwaarden, technische relaties, AI-onderzoeksvoorstellen en tien besluiten zijn ongewijzigd.

## Afzonderlijke juridische objecten

1. **Officiële selectievoorschriften.** De eerder vastgestelde artikel 11-kwalificatie betreft officiële besluittekst en vastgestelde toelichting, met de [vaststelling 2012](https://zoek.officielebekendmakingen.nl/stcrt-2012-11906.html), [2017](https://zoek.officielebekendmakingen.nl/stcrt-2017-38013.html) en [2020](https://zoek.officielebekendmakingen.nl/stcrt-2020-11143.html). Die grondslag blijft gelden voor de drie bestaande projecties.
2. **Losse feiten en bronwaarden.** Een code, termijngetal of feitelijke verwijzing is niet door zijn enkele vermelding een oorspronkelijk auteursrechtelijk werk. Voor artikel 11-tekst is geen toestemming nodig wegens het auteursrecht op die officiële tekst. Dit betekent niet dat overname van alle feiten uit een mogelijk beschermde databank buiten het databankenrecht valt.
3. **De zelfstandige concordans.** De gevraagde publicatie behoudt alle bronrijen, oorspronkelijke kolommen, selectie, ordening en relatiekeuzen, inclusief opmerkingen en afwijkende formuleringen. Een compacte JSON is nog steeds een integrale overname van die samenstelling. Minder technische kolommen en een nieuwe Excel-opmaak nemen eventuele rechten op inhoud of verzameling niet weg.

Een onafhankelijke vaststelling van losse feiten kan juridisch anders liggen dan het integraal spiegelen van een bestaande verzameling. Nieuwe historische relaties reconstrueren of de inhoud uitkleden is geen oplossing binnen deze opdracht: de bestaande concordans en alle kolommen moeten behouden blijven.

## Toets van publicatiemogelijkheden

| Route / toetsingsbron | Voorwaarden die hier relevant zijn | Toepassing op deze werkmap | Uitkomst |
| --- | --- | --- | --- |
| Geen auteursrechtelijke bescherming: [Auteurswet, art. 10](https://wetten.overheid.nl/BWBR0001886/) en [HvJ EU C-604/10, Football Dataco, 1 maart 2012](https://eur-lex.europa.eu/legal-content/NL/TXT/?uri=CELEX:62010CJ0604) | Bij een databank betreft auteursrecht de oorspronkelijke keuze/rangschikking als eigen intellectuele schepping; arbeid/deskundigheid alleen volstaat niet | Bronvolgorde en officiële codes kunnen functioneel bepaald zijn. Tegelijk zijn koppelingen, samenvoegingen en beschrijvende keuzes aanwezig. Hun creatieve vrijheid en ontstaansproces zijn niet gedocumenteerd. Geen bewijs dat alle selectie/ordening uitsluitend mechanisch voorgeschreven was | Mogelijke publicatieroute, niet uitgesloten. Ook geen bewijs dat de hele werkmap beschermd is. Afwezigheid van bescherming is hier niet voldoende onderbouwd voor integrale vrijgave |
| Officiële besluiten: Auteurswet art. 11 | Het overgenomen object moet onder de wettelijke uitsluiting vallen, bijvoorbeeld een overheidsbesluit | De drie selectielijsten wel eerder als besluittekst beoordeeld. Geen vaststellingsbesluit, officiële bijlage of uitvaardiging gevonden die deze specifieke concordans als object dekt. Alleen verwijzen naar besluiten volstaat niet | Geen aangetoonde art. 11-grondslag voor de zelfstandige samenstelling; officiële tekst blijft wel afzonderlijk herbruikbaar |
| Overheidsopenbaarmaking: Auteurswet art. 15b | Werk openbaar gemaakt door of vanwege de openbare macht; wettelijke uitzonderingen/voorbehouden en rechten moeten worden betrokken | Openbaarmakende instantie en opdrachtketen onbekend. Geen bewijs van openbaarmaking door/vanwege de openbare macht en toepasselijke voorbehouden. VNG/VHIC-context mag niet automatisch als openbaar gezag worden gekwalificeerd | Geen vastgestelde toepassing. Een publieke downloadlocatie zonder bekende publicatiebevoegdheid zou dit niet oplossen |
| Hergebruik overheidsinformatie: [Wet hergebruik van overheidsinformatie](https://wetten.overheid.nl/BWBR0036795/) en [Richtlijn (EU) 2019/1024, met name art. 1 lid 2 onder c](https://eur-lex.europa.eu/legal-content/NL/TXT/?uri=CELEX:32019L1024) | Eerst vaststellen dat het document bij een onder de regeling vallende instantie berust en binnen het toepassingsbereik valt; intellectuele rechten van derden zijn een relevante uitsluiting | Die institutionele herkomst en eventuele rechten van derden zijn niet vastgesteld. De regeling verleent geen algemene licentie voor ieder online bestand met overheidsgerelateerde inhoud | Geen zelfstandige aangetoonde vrijgave voor dit bestand. Een bevoegde instantie kan informatie over de hergebruikstatus verstrekken; zo'n besluit ontbreekt |
| Geen sui-generis databankenrecht: [Databankenwet art. 1–2](https://wetten.overheid.nl/BWBR0010591/), [Richtlijn 96/9/EG art. 7](https://eur-lex.europa.eu/legal-content/NL/TXT/?uri=CELEX:31996L0009) en [HvJ EU C-203/02, BHB, 9 november 2004](https://eur-lex.europa.eu/legal-content/NL/TXT/?uri=CELEX:62002CJ0203) | Substantiële investering in verkrijging, controle of presentatie; louter het creëren van nieuwe gegevens is daarvan te onderscheiden | 716 rijen en het vergelijken van voorschriften bewijzen geen kwalificerende investering. Evenmin is documentatie beschikbaar die bescherming uitsluit. Wie initiatief/risico droeg en welke verkrijgings-/controle-investeringen plaatsvonden is onbekend | Bescherming niet bewezen, maar afwezigheid evenmin voldoende vastgesteld. Bij bestaande bescherming is overname van alle 716 rijen geen beroep op alleen onsubstantiële extractie |
| Overheidsdatabank: Databankenwet art. 8 | Specifieke voorwaarden voor databanken waarvan de openbare macht producent is, inclusief toepasselijke voorbehouden | Producent/openbare-machtstatus en voorbehouden van deze werkmap onbekend | Niet automatisch toepasbaar op een zelfstandige VNG- of VHIC-werkmap; ook niet bewezen dat zij werkelijk producent zijn |
| Licentie, toestemming of geldige vrijgave | Toepasselijkheid op de exacte werkmap, bevoegdheid en dekking van integrale webweergave/JSON/XLSX en eventuele databankenrechten | Geen aantoonbare toestemming; exacte oorspronkelijke publicatie onbekend. [VNG-proclaimer](https://vng.nl/proclaimer) kan pas helpen als het object en de bevoegdheid daadwerkelijk onder die voorwaarden vallen | Nog geen bruikbare licentie. Er is geen onvoorwaardelijke open licentie nodig als een beperktere toestemming de concrete handelingen voldoende dekt |
| Citaatrecht: Auteurswet art. 15a | Citaatdoel, functionele omvang en verdere voorwaarden | Het doel is een blijvend, volledig naslagwerk met volledige download; niet een noodzakelijk beperkt citaat voor bespreking van de bron | Geen dragende grond voor deze integrale distributie |
| Onderzoek, onderwijs, privékopie, niet-commercieel gebruik | Elke uitzondering heeft eigen voorwaarden; een privékopie dekt geen openbare distributie | Publiek naslagwerk voor alle bezoekers, volledig downloadbaar. Geen concrete uitzondering aangetoond die deze handelingen dekt | Onderzoeksdoel, kosteloosheid en bronvermelding geven hier op zichzelf geen vrijgave |

De genoemde bepalingen en uitspraken zijn concrete toetsingsbronnen, geen nieuw verkregen rechtenbewijs. Een geschatte leeftijd van de werkmap bewijst geen verstreken beschermingsduur: dit bestand bevat gegevens over 2020 en het is geen als historisch publiek domein geïdentificeerd werk.

## Verificatiegrens van externe bronnen

Op 11 november 2026 zijn naast de eerdere VHIC-/VNG-links ook de Wet hergebruik van overheidsinformatie, EUR-Lex (open-data-richtlijn), wetgevingspublicaties en Curia als alternatieve officiële routes benaderd. Deze omgevingsproxy gaf voor die externe sites HTTP 403 / tunnelweigering. De inhoud is daarom niet als opnieuw gelezen of als actuele geconsolideerde wettekst geciteerd. Voor toepassing bij een uiteindelijke vrijgave moet de dan geldende tekst worden gecontroleerd.

GitHub was bereikbaar. Er is echter geen identificeerbaar bevoegd rechtenbewijs voor deze werkmap gevonden in de beschikbare repository/pakketstukken. Een willekeurige kopie of commentaar op een wet zou geen bewijs van werkmapherkomst, bevoegdheid of toestemming opleveren. De conclusie berust daarom **niet op de HTTP-fouten**, maar op de ontbrekende feitelijke aansluiting bij iedere onderzochte wettelijke route. Zelfs bij volledige toegang tot de wetten zou bewijs van maker/publicatie/producent nog ontbreken. Er worden geen actuele VNG-voorwaarden of impliciete toestemmingen verzonnen.

## Concreet ontbrekend en noodzakelijke vervolgstap

Er ontbreekt geen universeel verplicht licentieformulier. Er ontbreken de feiten om verantwoord te kiezen tussen **onbeschermd/vrijgesteld** en **beschermd met benodigde toestemming**. Het project kan de blokkade via één van de volgende voldoende onderbouwde routes laten opheffen:

- Herkomst van de exacte hash vaststellen, inclusief openbaarmakende instantie/opdrachtgever, en bewijs overleggen dat art. 11/15b Auteurswet en waar nodig art. 8 Databankenwet werkelijk van toepassing zijn, met de toepasselijke voorbehouden.
- Een bevoegde rechthebbende/producent identificeren en aantoonbare toestemming/licentie vastleggen voor integrale openbare webraadpleging, compacte JSON en volledige aangepaste Excel, inclusief naamsvermelding en eventuele rechten van derden.
- Met gedocumenteerde ontstaanswijze en toepasselijk recht voldoende onderbouwen dat de integrale overgenomen samenstelling geen beschermde oorspronkelijke keuzes bevat en geen kwalificerende databankinvestering wordt overgenomen. Alleen het ontbreken van een copyrightteken of een laag aantal rijen is daarvoor onvoldoende.

Voor het alsnog vaststellen van de hergebruikgrondslag is de praktisch eerstvolgende handeling het oorspronkelijke downloadadres of de herkomstbevestiging bij de aanleveraar verkrijgen en daarmee de bevoegde publicerende partij en toepasselijke voorwaarden voor deze exacte werkmap vaststellen. Voor zover nodig kan daarna gerichte toestemming worden verkregen. Er is geen verzoek aan derden verstuurd. Een nieuw projectbesluit alleen kan de ontbrekende feiten of rechten niet vervangen.

## Technische wijzigingen na het aanvullende publicatiebesluit

| Onderdeel | Wijziging opdracht 18 |
| --- | --- |
| Generator | Vierde reguliere JSON opgenomen. De gewone build valideert schema en een vaste vingerafdruk van alle oorspronkelijke/uitgevouwen cellen, zonder privébron. Regeneratie vanuit het origineel blijft mogelijk met de bestaande SHA-256-controle |
| Build | Whitelist uitgebreid tot exact vier publicatiebestanden; ontbrekende vierde projectie blokkeert de build |
| Publicatielaag en Excel | Bestaande schema's, cache en XLSX-schrijver behouden; geen nieuwe architectuur of dependency |
| Viewer | Metadata tonen het expliciete projectbesluit en de onbekende hergebruikstatus. Ontbrekende bestanden blijven een technische fout met herstelmogelijkheid |
| Historische vergelijking | Kleine adapter reconstrueert oorspronkelijke cellen/mergecontext uit dezelfde compacte projectie en gebruikt de ongewijzigde concordansindex. Eén gegevensbestand, geen publieke bronspiegel of privéalias. Alle 612 interpretaties, 606 volledige koppelingen, zes open gevallen en besluiten blijven gelijk |
| Acceptatiecontrole | Geen vooraf gekozen foutuitkomst meer: controleert de werkelijke aanwezigheid, alle vier downloads, namen, bladen en iedere primaire Excel-cel |
| Browserregressies | Reguliere statische server zonder concordansalias; bronafhankelijke viewertests zijn nu standaard actief. Foutscenario's blokkeren expliciet het publieke bestand |

De oorspronkelijke gegevenslagen, alle 1.145 selectievoorschriften, de drie bestaande projecties en de privacymaatregelen blijven intact. Het oorspronkelijke Excelbestand en de oorspronkelijke volledige JSON worden niet gepubliceerd. De compacte projectie bevat wel hun volledige inhoudelijke celinformatie; die technische omzetting vormt geen rechtsgrond.

## Werkelijke publieke controle

De gewone productiecontrole wordt uitgevoerd zonder `CONCORDANS_BRON_JSON`, lokale alias, mocks of privébron. Alle vier bestanden zijn beschikbaar; de concordans toont 716 rijen en de selectielijsten 494, 305 en 346. Vier daadwerkelijke browserdownloads zijn teruggelezen en alle primaire cellen zijn vergeleken. Ontbrekend-bestandtests blijven afzonderlijk bestaan.

De actuele resultaten en regressie-uitkomsten staan in [het opleverrapport](concordans-distributie-acceptatie.md). Het functionele einddoel is voor de productiebuild gehaald. De hergebruikgrondslag is niet alsnog aangetoond: publicatie volgt de aanvullende expliciete instructie, geen vaststelling van toestemming van derden. Geen GitHub Pages-activering of samenvoeging met `main`.
