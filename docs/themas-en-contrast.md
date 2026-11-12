# Licht, donker, hoog contrast en systeemvoorkeuren

## Status en doel

Dit is een **ontwerpvoorstel**, geen themaschakelaar of toegepast kleurenschema. De huidige interface heeft één licht thema. De werkelijke browserproef met `prefers-color-scheme: dark` liet die lichte weergave intact. Native forced colors maakt tekst/links/randen bruikbaar, maar de visuele rijselectie verdwijnt gedeeltelijk (UI-08). Eigen donker/hoog contrast zijn optionele functies, geen vervanging voor herstel van UI-01/02 of native systeemondersteuning.

Kleurkeuzes volgen de audit en zijn voor deze website ontworpen, niet als officiële NLDS- of gemeentekleuren gepresenteerd. Alle uiteindelijke componenten/staten moeten na implementatie opnieuw worden getoetst.

## Voorstel semantisch kleurenpalet

| Rol/token `--sst-…` | Licht | Donker | Hoog contrast |
| --- | --- | --- | --- |
| `background` | `#ffffff` | `#101820` | `#000000` |
| `surface` | `#ffffff` | `#18232e` | `#000000` |
| `surface-subtle` | `#f1f5f7` | `#21303c` | `#000000` |
| `text` | `#17212f` | `#eaf1f5` | `#ffffff` |
| `text-muted` | `#4b5a69` | `#b5c4ce` | `#ffffff` |
| `link` | `#006b5e` | `#a0ead8` | `#ffff00` |
| `action` / `action-text` | `#006b5e` / `#ffffff` | `#a0ead8` / `#101820` | `#ffffff` / `#000000` |
| `control-border` | `#667985` | `#8fa5b2` | `#ffffff` |
| `border-subtle` | `#ccd4d9` | `#586b78` | `#ffffff` |
| `focus` | `#176cad` | `#ffd166` | `#00ffff` |
| `selected-bg` / `selected-text` | `#e2f2ec` / `#17212f` | `#264945` / `#eaf1f5` | `#000000` / `#ffffff` |
| `warning-bg` / `warning-text` | `#fff4d6` / `#573b00` | `#332914` / `#ffdda1` | `#000000` / `#ffffff` |
| `error-bg` / `error-text` | `#fff0ed` / `#74251d` | `#3b1c21` / `#ffd1cc` | `#000000` / `#ffffff` |
| `mark-bg` / `mark-text` | `#ffe9a9` / `#17212f` | `#5a4415` / `#fff3ce` | `#ffff00` / `#000000` |

Een subtiele scheidingslijn hoeft niet 3:1 te zijn als zij geen noodzakelijke betekenis/bediening afbakent; daarom niet dezelfde token gebruiken voor de herkenbare invoerveldrand. Geselecteerde rij krijgt in **alle** thema's een blijvende marker/sterke rand en toegankelijke status, niet alleen bovenstaande achtergrond.

### Berekende contrasten van voorgestelde basisparen

Berekend met sRGB-relatieve luminantie, afgerond op twee decimalen. Dit verifieert kleurparen, **geen volledige toekomstige component**.

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

De huidige veldrand `#ccd4d9` op wit is slechts **1,50:1** en wordt dus niet als control-border behouden. Huidige gewone tekst/links zijn in de geteste lichte toestanden al goed leesbaar; een donker thema mag dat niet verslechteren. Toets geselecteerde/hover-/waarschuwings-/fout-/markcombinaties, doorschijnendheid, disabled uitzonderingen en aangrenzende surfaces opnieuw. Minimum: normale tekst 4,5:1, grote tekst volgens de norm 3:1, noodzakelijke niet-tekstcomponenten 3:1. Niet iedere vetgedrukte kleine kop is “grote tekst”.

## Visueel gedrag per modus

**Licht.** Professionele rustige standaard, weinig kleurvlakken. Accenten vooral voor bediening/selectie. Officiële inhoud in primaire tekst; broncontext duidelijk maar niet klein/vaag. Horizontaal scrollende tabellen houden herkenbare headers en vloeiende focus-scroll.

**Donker.** Geen `filter: invert()` of eenvoudige kleuromkering. Twee donkere surfaces geven hiërarchie zonder overal witte kaders. Lichte tekst hoeft niet puur wit te zijn voor lange stukken. Tabellen, native formulieren, bronannotaties, markeringen, links, selectie, foutmeldingen en Excel-statussen worden volledig meegenomen. `color-scheme: dark` helpt native bediening; alleen achtergrond wisselen is onvoldoende. Geen wijziging van bronafbeeldingen/-inhoud of Excel-kleuren nodig voor een websitevoorkeur.

**Eigen hoog contrast.** Zwart/wit plus geel voor links en cyaan voor focus. Minder decoratieve vlakken, sterkere functiegrenzen, permanente onderstreping van links, duidelijke geselecteerd-marker. Waarschuwing/fout krijgen betekenis via een tekstlabel/icoon, niet alleen een aparte tint. Grote raakvlakken, geen lichte ghost-controls. De voorkeur is optioneel en blijft een eigen webthema.

**Native forced colors.** Heeft voorrang op alle eigen palettes. Laat de browser systeemkleuren kiezen: `Canvas`, `CanvasText`, `ButtonFace`, `ButtonText`, `LinkText`, `Highlight`, `HighlightText`. Behoud `forced-color-adjust: auto`; geen brede `none` om een huisstijl af te dwingen. Focus/selectie gebruiken zichtbare borders/outlines en tekst/marker, geen alleen-box-shadow. Achtergrondafbeeldingen, schaduwen en gekleurde vlakken zijn niet betrouwbaar als enige betekenisdrager. Een eigen hoogcontrastmodus is **geen** bewijs van werking met Windows Contrast Themes.

De 412 axe-meldingen in de geforceerde scan zijn niet als 412 overtredingen vastgesteld: de werkelijk zichtbare systeemkleuren verschillen van de door de scanner vergeleken auteurskleuren. Bewaar dat onderscheid bij toekomstige controles. Gebruik echte Windows-systemen en ondersteunende technologie naast emulatie.

## Keuze en voorrangsregels

Eén duidelijke gebruikersinstelling met vier waarden: **Systeemvoorkeur volgen**, **Licht**, **Donker**, **Hoog contrast**. Gebruik bij voorkeur een native select of een correct gelabelde radiogroep, geen drie onverklaarde icoontjes. Toon dat het gaat om de websiteweergave, niet om brongegevens of downloads.

| Situatie | Advies |
| --- | --- |
| Geen expliciete keuze / “Systeem” | Volg systeeminstellingen: forced colors eerst; daarna `prefers-contrast: more` → eigen hoogcontrastpalet; anders `prefers-color-scheme: dark` → donker, anders licht |
| Expliciet licht/donker/hoog contrast | Respecteer de gekozen eigen modus; systeem-dark wijzigt die niet. `forced-colors: active` blijft altijd leidend voor native kleuren |
| `prefers-contrast: less` of `no-preference` | Laat AA-contrast niet zakken; geen automatische laagcontrastmodus |
| Systeeminstelling verandert tijdens sessie | Update alleen automatisch wanneer “Systeem” gekozen is. Geen focusverplaatsing of volledige herbouw van tabellen |
| `prefers-reduced-motion: reduce` | Onafhankelijk van kleurkeuze respecteren; geen smooth scroll/onnodige thema-overgangen. De huidige app heeft al weinig beweging |
| Ongeldige of oude opgeslagen waarde | Veilig terug naar “Systeem”; hoofdfunctionaliteit mag niet blokkeren |

### Lokale opslag en laadvolgorde

Advies voor een volgende implementatie: lokaal één beperkte key, bijvoorbeeld `sst.theme.v1`, met uitsluitend toegestane waarden `system`, `light`, `dark`, `high-contrast`. Geen account, identificatie, telemetry, externe font-/thema-API of serveropslag. Lees-/schrijffouten afvangen: bij geblokkeerde opslag alleen sessiekeuze in geheugen, zonder fout die zoeken/downloaden verhindert. Een korte UI-uitleg vermeldt dat de voorkeur lokaal in deze browser blijft. Geen uitspraak dat iedere juridische privacy/cookievraag daardoor automatisch vervalt.

Voorkom onleesbare tussenstaten met een kleine vroege initialisatie vóór de eerste paint, of een gelijkwaardig statisch/CSP-compatibel mechanisme. Geen asynchrone netwerkfetch voor de voorkeur. Zet een gevalideerd attribuut op het documentelement; CSS definieert alle rollen. Houd de initlogica en runtime-resolver gedeeld om verschillende begin-/eindkleuren te voorkomen. Als inline code wordt gebruikt, de CSP-hash expliciet beheren; geen `unsafe-inline` als gemak.

Zonder JavaScript moet de basis-CSS ten minste het systeempalet/forced colors ondersteunen; bij deze app blijft functionele data-interactie zelf wel JavaScript vereisen. Falen van voorkeurinitialisatie mag geen witte tekst op witte achtergrond of onzichtbare controls geven. Bewaar de keuze bij navigatie/Back/Forward en laat een moduswissel focus en zoekfilter intact.

## Testmatrix voor toekomstige implementatie

Test iedere gekozen modus met systeem licht/donker, contrast meer/geen en forced colors aan/uit; de voorrangregels moeten eenduidig zijn. Minimaal:

1. Start zonder opslag, geldige/ongeldige/geblokkeerde opslag en herladen onder repositorysubpad.
2. Alle drie hoofdroutes; boom uit-/ingeklapt, beide zoekmodi, selectie, bronannotaties, waarschuwingen, lege/fout-/laadtoestanden en historische vergelijking.
3. Vier volledige tabellen/downloadknoppen met normale, hover-, focus-, current-, disabled- en laadstatussen.
4. Tekstcontrast, noodzakelijke randen, focus ten opzichte van alle achtergronden, niet-kleurafhankelijke selectie en letterlijke verschillen.
5. 320px, landscape, echte 200/400%-zoom, gebruikerslettergrootte en tekstafstand.
6. Windows Contrast Themes, NVDA/Firefox of Chrome en VoiceOver/Safari; emulatie apart registreren.
7. Geen bron-/publicatie-/Excel-inhoud verandert door themakeuze. Geen nieuwe netwerkrequests, tracking of layoutverspringing die focus onzichtbaar maakt.

De optionele themaschakelaar is pas gereed als deze matrix is uitgevoerd; correcte losse kleurparen zijn niet genoeg. Zie [roadmap](ui-ux-verbeterroadmap.md).
