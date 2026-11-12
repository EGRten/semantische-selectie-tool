# Voorstel: een klein, duurzaam designsysteem

## Voorkeursrichting

Advies: **een rustig naslagwerk met één consistente werkruimte**, gebouwd op de bestaande TypeScript-/CSS-architectuur. Behoud de drie hoofdfuncties, de boom/detailverdeling, native tabellen, bestaande routes en vier downloads. Geef officiële kerngegevens visuele voorrang; historische relaties en uitleg blijven duidelijk afzonderlijk. Geen zwaar UI-framework, geen nieuwe navigatiearchitectuur en geen vervanging van brongetrouwe gegevenscomponenten.

Er is geen tweede volwaardig ontwerp nodig: een dashboard met kaarten of een chatinterface past minder bij lange officiële teksten en doorlopende tabellen. Het huidige functionele model is bruikbaar; vooral schaal, semantiek, focus en consistentie vragen verbetering. Dit document is uitsluitend een voorstel; er zijn geen tokens of stijlen in productie geïmplementeerd.

## Onderbouwing uit de audit

| Bevinding | Ontwerpbesluit |
| --- | --- |
| UI-01 onvoldoende veldrandcontrast | Scheid decoratieve scheidingslijn van functionele control-border |
| UI-02 focus achter sticky kop | Focuszichtbaarheid is een componentcontract; kophoogte en scrollruimte moeten samenwerken |
| UI-03 koppen | Eén semantische outline per route, uiterlijk los van h-niveau |
| UI-04 navigatie/focus | Expliciet contract voor verkennen, activeren, terugkeren en delen |
| UI-05 pixelmaten, invoerfont en standaardletter | Rem-schaal vanaf gebruikersbasis; `font: inherit` voor alle bedieningen |
| UI-06 scrollgebieden | Eén duidelijk hoofdscrollpad en benoemde lokale 2D-tabelregio; mobiele detailroute behouden |
| UI-07 kerngegevens laag in detail | Officiële gegevens eerst, toepassingen/bronnen daarna, vergelijking als aanvullende functie |
| UI-08 systeemselectie | Selectie naast kleur ook met teken/rand/tekst herkenbaar maken |
| UI-09 validatielacunes | Component klaar pas na toetsenbord-, AT-, zoom- en browsercontrole |
| UI-10 hardcoded stijlregels | Kleine semantische tokenlaag, geen losse nieuwe kleur per component |
| UI-11/12 thema's en kolommen | Eén tokencontract voor alle thema's; semantische kolombreedtes |

## NL Design System als referentie, geen automatisch keurmerk

Gebruik NL Design System voor toegankelijk componentgedrag, tokenconventies, documentatie en toetscriteria. Daadwerkelijk geraadpleegd: [design tokens/thema maken](https://github.com/nl-design-system/documentatie/blob/7205379f7fd56848d5f04c261d954046d649ca7e/docs/handboek/developer/04-design-tokens/02-thema-maken.mdx) en [niet-tekstcontrast](https://github.com/nl-design-system/documentatie/blob/7205379f7fd56848d5f04c261d954046d649ca7e/docs/richtlijnen/stijl/colour/2-contrast-non-text/_guideline.md). De hoofdsite was niet bereikbaar; er wordt geen recent component als live beoordeeld geclaimd.

Een eigen beperkte verzameling CSS Custom Properties volstaat. Een JSON-tokenbouwstraat of componentpakket is pas zinvol bij aantoonbaar gedeeld beheer met andere producten. Namen/rolscheiding aansluiten op NLDS-principes zonder te claimen dat dit product een officieel goedgekeurd NLDS-thema is. Geen gemeentelijk logo of overheidshuisstijl nabootsen voor dit onafhankelijke initiatief.

## Inventaris huidige vormgeving

De [complete waardelijsten](audit-bewijs/css-inventaris.json) komen rechtstreeks uit `style.css`, zonder de broninhoud te wijzigen.

| Onderdeel | Huidig |
| --- | --- |
| Letterfamilie | System UI, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif. Viewerinput valt terug op UA-font doordat alleen button/select algemeen erven |
| Lettergroottes | 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23, 25, 26, 27, 29px; daarnaast inherit. Root 16px |
| Gewichten | 400, 600, 650, 700 |
| Regelhoogtes | 1.25, 1.3, 1.35, 1.4, 1.5, 1.6; sommige inputs native `normal` |
| Letterafstand | Negatieve kopafstanden -.35, -.6, -.7px |
| Kleuren | 23 hex-notaties plus `white`, `none`, `inherit`; slechts vier tokens: accent, lijn, zacht, muted |
| Afstanden | Veel losse padding-/margecombinaties van 0 tot 48px; gaps 3,4,5,7,8,10,12,18,24px en gemengde paren |
| Randen/afronding | 1px lijnen, 2/3px accent-/focusranden; radius 1/2px; geselecteerde boom via inset shadow |
| Componentmaten | Select/zoek 42px; viewerinput 35px; hoofdacties circa 36–44px; tabelregio max 530px; zoeklijsten 300/370px; mobiele boom 40vh |
| Layout | 28/72%-werkruimte, tussenstap 35/65%, vanaf 680px één kolom; 1000px sticky zijbalk; viewers max 1440px |

Positief: systeemletter, weinig decoratie, ruime line-height en reeds herkenbare accentkleur. Te verbeteren: leesbare context, één formulierenbasis, minder willekeurige kopmaten en duidelijke semantische kleurrollen.

## Tokencontract — voorstel

Een compacte laag van semantische tokens plus enkele componentaliassen is voldoende. Onderstaande namen/waarden zijn **ontwerpvoorstel**, geen toegepaste CSS. Themawaarden staan in [thema's en contrast](themas-en-contrast.md).

| Token | Voorstel | Verantwoordelijkheid |
| --- | --- | --- |
| `--sst-font-family` | `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` | Geen externe fontrequest of tracker |
| Basis | `font-size: 100%` | Respecteert gebruikersstandaard; geen root 16px vastzetten |
| `--sst-text-sm` | `.875rem` | Alleen secundaire tekst; geen onmisbare voorwaarden in mini-tekst |
| `--sst-text-md` | `1rem` | Body, labels, formulieren |
| `--sst-text-lg` | `1.125rem` | Lead/subkop |
| `--sst-heading-sm` | `1.25rem` | Sectiekop |
| `--sst-heading-md` | `1.5rem` | Route-/detailkop, mag op lange tekst ombreken |
| `--sst-heading-lg` | `2rem` | Productkop op ruim scherm, kleiner via rem-gebaseerd breakpoint |
| `--sst-table-text` | `.9375rem` | Doorlopende tabellen; compacte `.875rem` pas na gebruikersproef |
| `--sst-line-body` / `--sst-line-heading` | `1.6` / `1.3` | Eenheidsloos, tekstafstand moet kunnen overrulen |
| `--sst-weight-normal/strong/heading` | `400 / 600 / 700` | 650 niet als losse rol nodig |
| `--sst-space-1…8` | `.25, .5, .75, 1, 1.5, 2, 3, 4rem` | Klein aantal herbruikbare tussenruimtes |
| `--sst-border-width` / `--sst-border-emphasis` | `1px / 2px` | Geen betekenis uitsluitend in hairline kleur |
| `--sst-radius` | `.25rem` | Bescheiden en uniform |
| `--sst-focus-width` / `--sst-focus-offset` | `3px / 3px` | Tweevoudige contrasterende ring waar nodig; geen alleen-shadowfocus |
| `--sst-control-min-height` | `2.75rem` | 44px bij standaard16, comfortdoel; afzonderlijk AA-minimum toetsen |
| `--sst-touch-gap` | `.5rem` | Geen dicht opeengepakte verschillende acties |
| `--sst-reading-width` | `70ch` | Lopende app-uitleg; officiële hard-breaks blijven bestaan |
| `--sst-content-max` | `90rem` | Naslagwerk op breed scherm; geen onbegrensde regels |
| `--sst-side-min/max` | `18rem / 26rem` | Getoetste zijbalk, geen star percentage op elk scherm |
| Responsieve omslag | Eerst rond `45rem`, daarna inhoudsgericht rond `65rem` | Waarden toetsen bij echte zoom; geen betekenisvolle inhoud verbergen |

Maak voor `background`, `surface`, `surface-subtle`, `text`, `text-muted`, `link`, `action`, `action-text`, `border-subtle`, `control-border`, `focus`, `selected-bg`, `selected-text`, `warning-bg/text`, `error-bg/text` en `mark-bg/text` afzonderlijke rollen. Een lichte tabelrasterlijn hoeft niet hetzelfde te zijn als een invoerveldrand met 3:1-eis. Niet elk token vereist een nieuwe primitieve kleur.

### Interactieve toestanden

| Toestand | Contract voor alle componenten |
| --- | --- |
| Default | Herkenbare rol, betekenisvol label, voldoende contrast |
| Hover | Extra onderscheid zonder betekenis alleen in hover; geen broninhoud verbergen |
| Focus-visible | Duidelijke ring, niet volledig bedekt, niet afgesneden door scroll/overflow; ook op summary/scrollregio/rijlink |
| Active/pressed | Geen verschuivende layout; vaste ruimte voor rand/indicator |
| Selected/current | Tekst/teken of rand naast kleur, `aria-selected/current` passend gebruiken |
| Disabled | Niet alleen opacity voor algehele styling; native disabled en begrijpelijke reden indien relevant |
| Loading | Korte zichtbare status en geschikte live-regio; focus niet zonder reden wegzetten |
| Error | Benoem probleem + herstelactie; kleur én tekst/icoon, geen fictieve vervangingsdata |
| Empty | Geen resultaten onderscheiden van technische fout; filter wissen bereikbaar |

## Componentrichtlijnen

**Hoofdnavigatie en pagina-outline.** Behoud de drie herkenbare routes en huidige stabiele permalinks. Geef huidige route een teken/onderstreping en passende aria-status. Producttitel h1; actieve hoofdtaak h2; subsectoren volgen betekenisvol. Een klasse bepaalt grootte, niet een overgeslagen h-niveau. Skiplink benoemt de actieve bestemming begrijpelijk. Elke route heeft één zichtbare main-landmark.

**Knoppen en links.** Gebruik links voor deelbare navigatie, knoppen voor acties. Primair, secundair en tekstactie zijn maximaal drie varianten. “Download…” en “Kopieer…” gebruiken hetzelfde actiecontract, met verschillende duidelijke labels. Comfortabele hoogte zonder de bronlinks in lange tekst kunstmatig als grote knoppen te tonen. Linktekst blijft herkenbaar; inline links onderstrepen. Met 24px-AA-uitzonderingen zorgvuldig omgaan, niet elk 16px-checkboxje automatisch afkeuren.

**Formulieren en zoekmodi.** Eén label-/invoer-/hulp-/foutopbouw, overal hetzelfde font, pad en control-border. Helptekst via `aria-describedby` waar nodig; fout koppelen zonder iedere keypress storend aan te kondigen. Tabbladgedrag met pijlen en roving tabstop behouden. Geen chatvorm voor begripszoeken. Onbevestigde AI-termen en vervallen resultaten blijven standaard expliciet uitgesloten volgens de huidige logica.

**Boom.** Bestaande tree/group/treeitem-rollen, niveaus en roving tabstop behouden. Visueel onderscheid tussen uitklappen en selecteren, maar geen onnodige extra tabstop per item. Pijltoetsen verkennen; activeren opent details volgens één focuscontract. Selectie heeft naast kleur een herkenbare rand/marker. Type-ahead kan later worden onderzocht, niet als huidige AA-verplichting gepresenteerd.

**Detailweergave.** Eerst lijst/code/benaming en officiële waardering/volledige termijn, dan voorwaarden, toelichting, bronnen/annotaties en historische relaties. Behoud ontbrekend/bronleeg/niet-toepasselijk. Maak applicatie-uitleg herkenbaar als uitleg; geen nieuwe juridische duiding. Gebruik een leesbare definitielijst die op smalle schermen label/waarde stapelt. Hard-breaks en bronspelling blijven intact.

**Tabellen.** Native tabelsemantiek, captions en scope behouden. Alle 716/494/305/346 rijen in bronvolgorde; geen paginering. Codekolom smaller dan omschrijving maar breed genoeg voor kop/code. Geef lokale horizontale scroll een label en toetsbare focus; hoofdcontrols blijven zonder horizontale scroll bereikbaar. Dynamische sticky-kophoogte meenemen in focus-scroll; rijlink mag ook bij Shift+Tab nooit volledig achter kop/kolom zitten. Geen CSS- of DOM-virtualisatie invoeren voordat AT en volledige bereikbaarheid aantoonbaar behouden blijven.

**Vergelijking.** Officiële waarden, bronconcordans, technische correctie en besluit blijven visueel/semantisch vier verschillende lagen. “Letterlijk verschil” blijft tekstueel benoemd. Een mobiele gestapelde vergelijking moet expliciete kolomcontext behouden in de toegankelijkheidsboom; pseudo-elementtekst alleen niet als voldoende AT-bewijs aannemen. Nooit bronvelden normaliseren om een verschil aantrekkelijker te presenteren.

**Meldingen en disclosure.** Eén rustige meldingstypografie, betekenis via tekst én kleur. Korte context standaard zichtbaar; lange broninformatie uitklapbaar met juiste summary. Geen twaalf concurrerende waarschuwingkaders boven officiële kerngegevens. Verplaats/compacteer alleen app-uitleg; oorspronkelijke voorwaarden en annotaties blijven integraal raadpleegbaar.

## Bronintegriteit als ontwerpcontract

- Geen redactie, spellingcorrectie, termmodernisering of normalisatie van oorspronkelijke afbrekingen/interpunctie.
- Geen `text-transform`, automatische samenvatting of gewijzigde bronwaarde voor een visueel netter resultaat.
- CSS mag omloop, leesbreedte, ruimte en semantische structuur verbeteren; `white-space: pre-wrap` of gelijkwaardige behoudende presentatie bewaart de oorspronkelijke tekst. Codes niet uit suffixen afleiden en geen technische suffixen als officiële codes tonen.
- Uitleg in begrijpelijke taal krijgt een eigen label “Toelichting van de applicatie” en vervangt geen broninhoud. Zij introduceert geen archivistisch oordeel.
- Vergelijk bij toekomstige implementatie dataset-/publicatiehashes én uitgepakte relevante Excel-cellen; XLSX-bytes kunnen door exportdatum verschillen terwijl inhoud gelijk hoort te blijven.

## Onderhoud en invoering

Wijs één onderhoudsverantwoordelijke aan voor tokenrollen en componentcontracten. Documenteer per component semantiek, staten, toetsenbordgedrag, bron-/focuscontract en testscenario. Laat kleurwijzigingen via een kleine contrastevaluatie en visuele regressie gaan. Beperk overrides; verwijder oude regels pas nadat de nieuwe variant alle toestanden afdekt.

Een afzonderlijke componentdemopagina kan later nuttig zijn, maar is geen voorwaarde om de P1's te herstellen. Begin met bestaande CSS in beheersbare stappen. Nieuwe tokens krijgen stabiele semantische namen; een grote Sass-/React-/UI-librarymigratie levert hier geen aangetoonde meerwaarde. Zie [roadmap](ui-ux-verbeterroadmap.md) voor volgorde en acceptatiecriteria.
