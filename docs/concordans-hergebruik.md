# Herkomst en hergebruik van de historische concordans

## Bronvermelding

De historische concordans is afkomstig uit de door VNG beschikbaar gestelde SelectTool. Bronverwijzing: **VNG — Handvatten voor de uitvoering van de Archiefwet, ledenbrief van 26 mei 2020**. Voor hergebruik wordt aangesloten bij de toepasselijke [VNG-proclaimer](https://vng.nl/proclaimer), met VNG als bron.

De [centrale rechtenverklaring](../HERGEBRUIK.md#historische-concordans) beschrijft de voorwaarden en rechtenvoorbehouden. De concordans valt niet onder de eigen MIT- of CC BY-licentie; deze documentatie is geen afzonderlijke rechtenverlening of toestemming voor het bronmateriaal.

## Bestandsidentiteit en representatie

| Onderdeel | Gecontroleerde bron |
| --- | --- |
| Oorspronkelijke werkmap | `Concordans Selectielijst 1996-2020(1).xlsx` |
| Excel SHA-256 | `7dfda792ce61c1a6fa28c5c116155a429560153178c6c58987eabbbe6cdf708c` |
| JSON SHA-256 | `b01cff07c7bfeeb6f562d467373615f5a18cfc7ab9777f11fcd5cb1ed7de73dd` |
| Inhoud | 716 gegevensrijen, elf kolommen A–K en 550 samengevoegde bereiken |

De bestaande [bronregistratie](../bronnen/concordans-aangeleverd.bron.json) en celcontroles documenteren de identiteit van de werkmap. De daar genoemde [VHIC-FAQ](https://www.vhic.nl/faq/selectielijsten-2017-en-2020/) is aanvullende vindplaatscontext, geen rechtentoekenning. De oorspronkelijke Excel en volledige JSON-spiegel worden niet meegeleverd. Website en Excel-export gebruiken dezelfde compacte projectie, met oorspronkelijke cellen en mergecontext afzonderlijk herkenbaar. Technische correcties en inhoudelijke beoordelingsbesluiten blijven gescheiden van de bronwaarden.

## Privacycontrole opdracht 15

Op 11 november 2026 zijn alle **716 × 11 = 7.876 oorspronkelijke celposities** onderzocht met gerichte signalering, gevolgd door inhoudelijke beoordeling van de gevonden kandidaten. Daarvan zijn 4.296 cellen gevuld en 3.580 leeg (`null`); er komen geen lege tekststrings voor in deze bron. De uitgevouwen context bevat overgenomen bronwaarden en geen onafhankelijk toegevoegde persoonsinformatie.

| Controle op daadwerkelijke celinhoud | Bevinding |
| --- | --- |
| E-mailadressen | Geen aangetroffen |
| Nederlandse telefoonnummerpatronen en postcodes | Geen aangetroffen |
| Negen aaneengesloten cijfers en IBAN-patronen | Geen aangetroffen |
| Persoonssignalen zoals dhr., mevr., geboren, BSN, auteur of opgesteld door | Geen aangetroffen |
| Datumvormen | Twee treffers: rij 357 (WABO, 1-10-2010) en rij 365 (bouwmeldingen, 1-1-2003); wettelijke/procedurele context, geen geboortedata |
| Naamvormen met meerdere hoofdletterwoorden | Twintig celkandidaten inhoudelijk bekeken; instellingen, wet-/regelgeving en algemene categorieën zoals Raad van State, Burgerlijke Stand en Wet Bibob; geen geïdentificeerde natuurlijke personen |

Dit is een concrete broncontrole, geen algemene garantie dat patroonherkenning iedere mogelijke persoonsverwijzing kan uitsluiten. Er zijn **geen concrete persoonsgegevens in de concordanscellen aangetroffen**. Algemene omschrijvingen van processen over bijvoorbeeld personen, uitkeringen of naturalisatie zijn geen individuele casusgegevens. Er is geen privacygrond aangevoerd om bronrijen of kolommen weg te laten: de geteste viewer en Excel behouden alle 716 rijen en alle elf bronkolommen.

De oorspronkelijke werkmapmetadata bevatten twee gevulde identificatievelden (`creator` en `lastModifiedBy`). Deze worden als potentieel identificerend behandeld en zijn in de nieuwe werkmap volledig afwezig; namen zijn niet in dit verslag opgenomen. Dit staat los van de controle op inhoudelijke cellen. De export wordt nieuw gegenereerd uit JSON en gebruikt de oorspronkelijke Excel niet als template. Onafhankelijke ZIP/XML-controle bevestigt dat geen `docProps`-onderdelen, macro's of externe-linkonderdelen worden meegeschreven. De datum in Bronvermelding is de daadwerkelijke generatiedatum.

## Documentgeschiedenis

[Eerdere versies](https://github.com/EGRten/semantische-selectie-tool/commits/911c9e2/docs/concordans-hergebruik.md) blijven beschikbaar in de Git-geschiedenis.
