# Licht, donker, hoog contrast en systeemvoorkeuren

## Status en doel

Geïmplementeerd in opdracht 23, vanaf `main` met PR #22 (`d3946be`). Eén gelabelde instelling **Weergave** biedt Systeem, Licht, Donker en Hoog contrast. De bestaande interface, gegevens en exports blijven intact. Native geforceerde systeemkleuren gaan altijd voor; een eigen hoogcontrastpalet vervangt geen Windows Contrast Theme.

Eén centraal mechanisme in `src/interface/thema.ts` bepaalt zowel het eerste als latere thema. CSS gebruikt de bestaande semantische tokens, zonder kleurinversie of componentkopieën. Het bouwscript maakt een klein klassiek `interface/thema.js`, dat in de HTML vóór de stylesheet staat. De gevalideerde voorkeur wordt daardoor vóór de eerste gestileerde paint toegepast, ook als de app-module nog laadt. Er is geen inline script, externe themadienst of extra dependency.

## Vier instellingen

| Instelling | Werkelijke werking |
| --- | --- |
| Systeem (standaard) | Native forced colors eerst; anders `prefers-contrast: more` → hoog contrast; anders `prefers-color-scheme: dark` → donker; anders licht. Reageert op systeemwijzigingen |
| Licht | Vast licht palet; systeem-dark/contrast wijzigen dit niet. Native forced colors blijft voorgaan |
| Donker | Vast donker palet, inclusief native donkere formuliervelden; geen inversiefilter |
| Hoog contrast | Zwart/wit, gele links, cyaan focus, herkenbare selectieranden. Dit is een eigen webpalet naast native systeemcontrast |

## Geïmplementeerd semantisch kleurenpalet

| Rol/token `--sst-…` | Licht | Donker | Hoog contrast |
| --- | --- | --- | --- |
| `background` | `#ffffff` | `#101820` | `#000000` |
| `surface` | `#ffffff` | `#18232e` | `#000000` |
| `surface-subtle` | `#f1f5f7` | `#21303c` | `#000000` |
| `text` | `#17212f` | `#eaf1f5` | `#ffffff` |
| `muted` | `#4b5a69` | `#b5c4ce` | `#ffffff` |
| `accent` (links) | `#006b5e` | `#a0ead8` | `#ffff00` |
| `action` / `action-text` | `#006b5e` / `#ffffff` | `#a0ead8` / `#101820` | `#ffffff` / `#000000` |
| `control-border` | `#667985` | `#8fa5b2` | `#ffffff` |
| `border-subtle` | `#ccd4d9` | `#586b78` | `#ffffff` |
| `focus` | `#176cad` | `#ffd166` | `#00ffff` |
| `selected` / `selected-text` | `#e2f2ec` / `#17212f` | `#264945` / `#eaf1f5` | `#000000` / `#ffffff` |
| `warning-bg` / `warning-text` | `#fff4d6` / `#573b00` | `#332914` / `#ffdda1` | `#000000` / `#ffffff` |
| `error-bg` / `error-text` | `#fff0ed` / `#74251d` | `#3b1c21` / `#ffd1cc` | `#000000` / `#ffffff` |
| `mark` / `mark-text` | `#ffe9a9` / `#17212f` | `#5a4415` / `#fff3ce` | `#ffff00` / `#000000` |

De bestaande namen `accent`, `muted`, `selected` en `mark` zijn behouden; `action-text` en `mark-text` scheiden noodzakelijke voorgrondrollen. Hover en letterlijke verschillen hebben per palet eigen ondersteunende achtergrondtokens.

Een subtiele scheidingslijn hoeft niet 3:1 te zijn als zij geen noodzakelijke betekenis/bediening afbakent; daarom niet dezelfde token gebruiken voor de herkenbare invoerveldrand. Geselecteerde rij krijgt in **alle** thema's een blijvende marker/sterke rand en toegankelijke status, niet alleen bovenstaande achtergrond.

### Berekende contrasten van basisparen

Berekend met sRGB-relatieve luminantie, afgerond op twee decimalen. Dit verifieert kleurparen, **geen volledige WCAG-conformiteitsverklaring**.

| Paar | Ratio |
| --- | ---: |
| Licht hoofdtekst op wit | 16,22:1 |
| Licht secundair op wit | 7,08:1 |
| Licht link op wit | 6,43:1 |
| Licht control-border op wit | 4,53:1 |
| Licht focus op wit | 5,55:1 |
| Donker hoofdtekst op pagina | 15,68:1 |
| Donker secundair op surface | 8,91:1 |
| Donker link op surface | 11,57:1 |
| Donker control-border op surface | 6,21:1 |
| Donker focus op surface | 11,04:1 |
| Hoog contrast wit op zwart | 21:1 |
| Hoog contrast geel op zwart | 19,56:1 |
| Hoog contrast cyaan op zwart | 16,75:1 |

De oorspronkelijke veldrand `#ccd4d9` had slechts **1,50:1** contrast op wit. Het lichte palet gebruikt nu `#667985` als functionele rand (**4,53:1**). Huidige gewone tekst/links zijn in de geteste lichte toestanden al goed leesbaar; een donker thema mag dat niet verslechteren. Toets geselecteerde/hover-/waarschuwings-/fout-/markcombinaties, doorschijnendheid, disabled uitzonderingen en aangrenzende surfaces opnieuw. Minimum: normale tekst 4,5:1, grote tekst volgens de norm 3:1, noodzakelijke niet-tekstcomponenten 3:1. Niet iedere vetgedrukte kleine kop is “grote tekst”.

## Visueel gedrag per modus

**Licht.** Professionele rustige standaard, weinig kleurvlakken. Accenten vooral voor bediening/selectie. Officiële inhoud in primaire tekst; broncontext duidelijk maar niet klein/vaag. Horizontaal scrollende tabellen houden herkenbare headers en vloeiende focus-scroll.

**Donker.** Geen `filter: invert()` of eenvoudige kleuromkering. Twee donkere surfaces geven hiërarchie zonder overal witte kaders. Lichte tekst hoeft niet puur wit te zijn voor lange stukken. Tabellen, native formulieren, bronannotaties, markeringen, links, selectie, foutmeldingen en Excel-statussen worden volledig meegenomen. `color-scheme: dark` helpt native bediening; alleen achtergrond wisselen is onvoldoende. Geen wijziging van bronafbeeldingen/-inhoud of Excel-kleuren nodig voor een websitevoorkeur.

**Eigen hoog contrast.** Zwart/wit plus geel voor links en cyaan voor focus. Minder decoratieve vlakken, sterkere functiegrenzen, permanente onderstreping van links, duidelijke geselecteerd-marker. Waarschuwing/fout krijgen betekenis via een tekstlabel/icoon, niet alleen een aparte tint. Grote raakvlakken, geen lichte ghost-controls. De voorkeur is optioneel en blijft een eigen webthema.

**Native forced colors.** Heeft voorrang op alle eigen palettes. Laat de browser systeemkleuren kiezen: `Canvas`, `CanvasText`, `ButtonFace`, `ButtonText`, `LinkText`, `Highlight`, `HighlightText`. Behoud `forced-color-adjust: auto`; geen brede `none` om een huisstijl af te dwingen. Focus/selectie gebruiken zichtbare borders/outlines en tekst/marker, geen alleen-box-shadow. Achtergrondafbeeldingen, schaduwen en gekleurde vlakken zijn niet betrouwbaar als enige betekenisdrager. Een eigen hoogcontrastmodus is **geen** bewijs van werking met Windows Contrast Themes.

## Keuze en voorrangsregels

Eén native select met zichtbaar label **Weergave** en vier waarden: **Systeem**, **Licht**, **Donker**, **Hoog contrast**. De gekoppelde hulptekst maakt duidelijk dat dit alleen de websiteweergave betreft. De instelling blijft buiten de app-route staan en wordt niet bij navigatie vervangen.

| Situatie | Werking |
| --- | --- |
| Geen expliciete keuze / “Systeem” | Volg systeeminstellingen: forced colors eerst; daarna `prefers-contrast: more` → eigen hoogcontrastpalet; anders `prefers-color-scheme: dark` → donker, anders licht |
| Expliciet licht/donker/hoog contrast | Respecteer de gekozen eigen modus; systeem-dark wijzigt die niet. `forced-colors: active` blijft altijd leidend voor native kleuren |
| `prefers-contrast: less` of `no-preference` | Laat AA-contrast niet zakken; geen automatische laagcontrastmodus |
| Systeeminstelling verandert tijdens sessie | Update alleen automatisch wanneer “Systeem” gekozen is. Geen focusverplaatsing of volledige herbouw van tabellen |
| `prefers-reduced-motion: reduce` | Onafhankelijk van kleurkeuze respecteren; geen smooth scroll/onnodige thema-overgangen. De huidige app heeft al weinig beweging |
| Ongeldige of oude opgeslagen waarde | Veilig terug naar “Systeem”; hoofdfunctionaliteit mag niet blokkeren |

### Lokale opslag en laadvolgorde

Er wordt lokaal één beperkte key gebruikt, `sst.theme.v1`, met uitsluitend toegestane waarden `system`, `light`, `dark`, `high-contrast`. Geen account, identificatie, telemetry, externe font-/thema-API of serveropslag. Lees-/schrijffouten afvangen: bij geblokkeerde opslag alleen sessiekeuze in geheugen, zonder fout die zoeken/downloaden verhindert. Een korte UI-uitleg vermeldt dat de voorkeur lokaal in deze browser blijft. Geen uitspraak dat iedere juridische privacy/cookievraag daardoor automatisch vervalt.

Hetzelfde centrale mechanisme leest de voorkeur bij de parserblokkerende vroege initialisatie en verwerkt daarna gebruikers-/systeemwijzigingen. Alleen `data-thema` op het documentelement verandert; geen herbouw van boom, zoekpanelen, tabellen of details. Er zijn geen thema-animaties of smooth-scrollovergangen toegevoegd, ook niet bij `prefers-reduced-motion`.

Bij geblokkeerde opslag blijft de expliciete keuze in geheugen bruikbaar en vermeldt de gekoppelde hulptekst dat zij alleen voor deze pagina geldt. Ongeldige waarden vallen veilig terug op Systeem. Er wordt geen account, cookie-identificatie, externe opslag of tracking toegevoegd. Er is geen cross-tab-synchronisatie; herladen leest de laatste lokaal opgeslagen voorkeur.

Ontbreekt of faalt het vroege themascript, dan blijft een leesbare lichte CSS-basis beschikbaar en de instelling uitgeschakeld; native forced colors blijft via CSS ondersteund. JavaScript is ook voor de bestaande gegevensinteractie nodig. Er wordt niet beweerd dat de opgeslagen voorkeur zonder JavaScript kan worden gelezen. Alle scripts zijn subpadrelatief en vanaf dezelfde statische publicatie te laden; geen CSP-versoepeling met `unsafe-inline` nodig.

## Validatie opdracht 23

Gerichte thematests controleren de vier waarden, echte mediawijzigingen, opslagfouten, ongeldige opslag, herladen en de vroege initialisatie terwijl de app-module geblokkeerd is. Alle vier tabellen behouden filter, DOM-identiteit, URL en scrollposities; beide zoekmodi behouden opdracht, filters, selectie en focus. Contrasttests meten semantische tekst-/link-/toestandparen (minimaal 4,5:1), noodzakelijke randen en focus tegen hun aangrenzende oppervlakken (minimaal 3:1), plus echte markeringen, primaire knoppen, waarschuwingen, foutmeldingen en vergelijkingscellen. Inactieve controls zijn geen 4,5:1-conformiteitsclaim.

320px en echte Chromium-zoom 200/400% zijn per palet gecontroleerd, inclusief tabelfocus. Native forced colors is geëmuleerd, niet op echte Windows Contrast Themes met schermlezer getest. Safari/Firefox en onafhankelijke AT-verificatie blijven bestaande releasebeperkingen. De eenmalige volledige regressie slaagt: 163 moduletests en 122 browsertests. Typecheck, productiebuild, publieke datasetvalidatie en reproduceerbare publicatieprojecties slagen. De gewone productiebuild levert zonder alias of privébron alle vier geldige Excel-downloads met 716/494/305/346 rijen, correcte bestandsnamen, werkbladen en bronwaarden. Desktop-, mobiele en native-contrastemulatiebeelden zijn visueel gecontroleerd. De beschermde bron-, controle- en publicatiebestanden zijn ongewijzigd tegenover uitgangscommit d3946be.

De bestaande browsertests kiezen de selectielijst nu op het label **Selectielijst** in plaats van een onbenoemde combobox: de nieuwe thema-instelling is immers ook een native select. De inhoudelijke verwachtingen en navigatiecontroles blijven behouden.

## Overblijvende releaseverificatie

Test iedere gekozen modus met systeem licht/donker, contrast meer/geen en forced colors aan/uit; de voorrangregels moeten eenduidig zijn. Minimaal:

1. Start zonder opslag, geldige/ongeldige/geblokkeerde opslag en herladen onder repositorysubpad.
2. Alle drie hoofdroutes; boom uit-/ingeklapt, beide zoekmodi, selectie, bronannotaties, waarschuwingen, lege/fout-/laadtoestanden en historische vergelijking.
3. Vier volledige tabellen/downloadknoppen met normale, hover-, focus-, current-, disabled- en laadstatussen.
4. Tekstcontrast, noodzakelijke randen, focus ten opzichte van alle achtergronden, niet-kleurafhankelijke selectie en letterlijke verschillen.
5. 320px, landscape, echte 200/400%-zoom, gebruikerslettergrootte en tekstafstand.
6. Windows Contrast Themes, NVDA/Firefox of Chrome en VoiceOver/Safari; emulatie apart registreren.
7. Geen bron-/publicatie-/Excel-inhoud verandert door themakeuze. Geen nieuwe netwerkrequests, tracking of layoutverspringing die focus onzichtbaar maakt.

De gerichte geautomatiseerde toets vervangt geen onafhankelijk WCAG-onderzoek of echte Windows-/schermlezertest. Zie de bestaande [roadmap](ui-ux-verbeterroadmap.md).
