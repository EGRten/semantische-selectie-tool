# Veldmatrix publieksgerichte naslagwerken

De oorspronkelijke bron- en controlelaag blijft ongewijzigd. Het gesloten schema is [publicatie.schema.json](../schemas/publicatie.schema.json). Drie selectielijstprojecties staan in `publicatie/`; de concordansprojectie wordt alleen lokaal gegenereerd zolang de distributiegrondslag ontbreekt. Website en nieuwe Excel-downloads lezen dezelfde projectie, niet ieder een eigen selectie van bronvelden.

| Bronveld / gegevensgroep | Behandeling | Publieke bestemming / motivering |
| --- | --- | --- |
| Record-ID | Verborgen behouden | `rijen[].id`, uitsluitend stabiele navigatie naar het juiste bestaande voorschrift; geen zichtbare of Excel-kolom |
| Structuur-ID, parent-ID, volgorde | Samengevoegd / verborgen | Expliciete structuurrelaties leveren hoofdstuk, taakveld, rubriek of procestype. Bronarrayvolgorde behouden; geen nieuwe code-afleiding. Geen volledige structuurrecords in publicatie of Excel |
| Officiële code | Behouden | Primaire kolom; afzonderlijke rijen met dezelfde code blijven bestaan |
| Officiële benaming | Samengevoegd | Wanneer identiek aan zichtbare tekst geen duplicaat; anders in Toelichtingen |
| Hoofdstuk, taakveld, rubriek | Behouden | Alleen bij 1996/2012, uit het werkelijke structuurpad |
| Procestype, procesomschrijving | Behouden | Primaire kolommen 2017/2020; geen vervanging van bronwoorden door een afgeleide omschrijving |
| Resultaattype, resultaatomschrijving, generiek/specifiek | Behouden | Primaire kolommen 2017/2020 |
| Waardering, bewaartermijn, procestermijn, aanvangsmoment | Behouden | Volledige officiële tekst, geen getalreductie of datumberekening |
| Technische termijnstatus | Vertaald / uitgesloten | Geen interne enumvelden. Alleen bij een ontbrekende bronwaarde een leesbare duiding in `ontbrekend`; dezelfde presentatie in website en Excel |
| Geparseerde termijnwaarden/eenheden/type | Uitgesloten | Afgeleide technische extractie, niet nodig naast volledige brontekst |
| Toelichting | Behouden | 1996/2012 primair; 2017/2020 uitsluitend Toelichtingen/detailweergave |
| Procesobject, procestoelichting, taakvelden, herkomst waardering | Behouden | Toelichtingen. Gedeelde procestekst eenmaal in achtergrond, verwijzing per voorschrift. Letterlijk verschillende bronweergaven blijven afzonderlijk behouden |
| Voorwaarden / uitzonderingen / verwijzingen | Behouden / samengevoegd | Volledige beschikbare teksten plus expliciete verwijzing naar de betreffende omschrijving, toelichting, rubriekcontext en algemene bepalingen; geen juridische toepassing afgeleid |
| Rubriekcontext primaire fragmenten | Behouden | Gedeelde achtergrond met fragmentnummer, bron en verwijzing vanuit ieder betrokken voorschrift |
| Leesbare paginakopie en tekstcoderingsbeperking | Behouden met onderscheid | Als leesvoorziening gemarkeerd, niet verheven tot vervanging van officiële bron; geen ruwe technische tekstcoderingstags |
| Algemene bepalingen / bijlagen in bestaande broncontext | Behouden | Achtergrond en Toelichtingen; bronherkomst en paginaverwijzing behouden. Zie de afzonderlijke privacybeoordeling van openbare namen in bronverantwoording |
| Vervallen status | Behouden | Primaire kolom, beide 2020-regels blijven opgenomen |
| Bronannotatie: bevinding/verwerking | Behouden | Leesbare annotatie afzonderlijk van normtekst, met bronverwijzing en de beperking dat bronbevestiging geen officiële rectificatie is |
| Annotatie: reviewer, datum, controleopdracht, interne verwerkingsstatus, verificatiemethode | Uitgesloten | Niet nodig voor publieke raadpleging; blijft in bron-/controlelaag |
| Bron-ID, dubbele registerobjecten | Samengevoegd | Eén compact register van unieke bronverwijzingen; korte verwijssleutel alleen in JSON. Excel toont titel, URL, pagina en waar relevant werkblad/rij/kolom |
| Manifesthashes, extractiecoördinaten, bbox, technische bronsegmenten | Uitgesloten | Controlehulpmiddelen; geen verlies van inhoudelijke tekst of relevante bronlocatie |
| Volledig record / bronrij / structuurpad als JSON | Uitgesloten | Geen JSON-cellen of volledige datasetrecords in publieke exports; relevante tekst heeft expliciete publieksvelden |
| Publicatietitel en hergebruikafbakening | Behouden | Bronvermelding, gebaseerd op bestaande vaststellingspublicaties en rechtenbeoordeling; geen nieuwe licentie verleend |
| Excel-exportdatum | Behouden | Werkelijke UTC-generatiedatum, geen oorspronkelijke Office-auteursmetadata |
| Office creator / lastModifiedBy / Company / lokale paden | Uitgesloten | Geen onderdeel van de nieuwe projecties of XLSX; geen oorspronkelijke werkmap als template |

## Concordans

| Bronveld | Behandeling | Bestemming |
| --- | --- | --- |
| Alle 716 oorspronkelijke gegevensrijen | Behouden | Bronrijen 3–718, in dezelfde volgorde |
| Elf oorspronkelijke inhoudelijke cellen A–K | Behouden | `waarden` bewaart oorspronkelijke strings/null exact; bronlaag blijft intact |
| Werkelijk uitgevouwen mergecontext | Samengevoegd | Alleen afwijkende context als spaarzame `context`-vermelding met kolomnummer. Website en Excel benoemen oorspronkelijke waarde en samenvoegcontext binnen dezelfde inhoudelijke cel. Geen elf extra contextkolommen |
| Bronrijnummer | Behouden | Zichtbaar en in Excel, naast A–K: twaalf kolommen totaal |
| Oorspronkelijke codes 19.1. / 19.21.1 | Behouden | Geen stilzwijgende broncorrectie |
| Technische correcties 21/716 en vastgelegde besluiten | Afzonderlijk | Publieksgerichte toelichting, los van de broncellen. Oorspronkelijke controle-/besluitregistratie niet aangepast |
| Vastgestelde eindpunten en kandidaten | Verborgen / herkenbaar | Stabiele IDs in `koppelingen` voor juiste navigatie. Code/benaming zichtbaar, kandidaatstatus uitdrukkelijk geen definitieve koppeling |
| AI-onderzoeksvoorstellen, beoordelaarsrol/datum, volledig afwijkingenrapport | Uitgesloten | Geen publiek duplicaat van intern onderzoeksdossier; oorspronkelijke lagen intact |
| Organisatie / rechthebbende / licentie | Niet ingevuld zonder bewijs | Bronvermelding benoemt dat deze niet zijn vastgesteld; compact maken is geen distributietoestemming |

## Gelijkblijvende inhoud, verschillende presentatiemiddelen

`publicatieCel` bepaalt de celpresentatie voor website en Excel. Een lege broncel wordt expliciet benoemd, niet als een gevulde officiële waarde gepresenteerd. Een concordanscel met mergecontext bevat beide onderscheiden betekenissen. De selectielijstwerkbladen zijn **Selectiegegevens**, **Toelichtingen**, **Bronvermelding**; de concordans houdt **Concordans 1996-2020** en **Bronvermelding**.

Gedeelde toelichtingen en bronnen zijn in JSON eenmaal opgenomen met verwijzingen. Op de website kunnen ze bij een voorschrift worden geopend; in Excel wijzen de betreffende voorschriften naar het benoemde gedeelde onderdeel in Toelichtingen. Langere teksten worden zonder verlies in genummerde delen onder de Excel-cellimiet gezet. Er wordt geen officiële tekst gecorrigeerd, genormaliseerd of door een nieuw selectieadvies vervangen.
