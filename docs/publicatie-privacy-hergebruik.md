# Privacy, herkomst en publicatiebesluit naslagwerken

## Besluit en harde beperking — 11 november 2026

De drie officiële selectielijstprojecties kunnen binnen de bestaande afbakening van [HERGEBRUIK.md](../HERGEBRUIK.md) als tekstuele naslagwerken worden opgenomen: vastgestelde besluittekst op basis van de eerdere artikel 11-beoordeling en de drie vaststellingspublicaties. Er is geen nieuwe algemene licentie voor oorspronkelijke PDF-opmaak, spreadsheets, afbeeldingen, AI-rapporten of zelfstandige concordans verleend. Er zijn geen uitgesloten oorspronkelijke documenten toegevoegd.

**Voor integrale openbare concordansweergave én JSON-/XLSX-distributie is nog geen voldoende onderbouwde grondslag vastgesteld. De harde acceptatievoorwaarde van vier publieke downloads is daarom NIET VERVULD.** De compacte concordansprojectie blijft lokaal. Een geslaagde privétest vervangt deze voorwaarde niet en deze opdracht is niet volledig afgerond. GitHub Pages is niet geactiveerd.

## Concrete bron- en rechtencontrole concordans

De oorspronkelijke werkmap `Concordans Selectielijst 1996-2020(1).xlsx` is geïdentificeerd met SHA-256 `7dfda792ce61c1a6fa28c5c116155a429560153178c6c58987eabbbe6cdf708c`; de gecontroleerde JSON met `b01cff07c7bfeeb6f562d467373615f5a18cfc7ab9777f11fcd5cb1ed7de73dd`. De bestaande Excel/JSON-controle bevestigt 716 rijen, elf kolommen, 550 merges, alle 7.876 oorspronkelijke en 7.876 uitgevouwen waarden.

| Bewijsstuk / bron | Feitelijke uitkomst |
| --- | --- |
| [Bronregistratie](../bronnen/concordans-aangeleverd.bron.json) | Exacte werkmapdownloadlocatie onbekend; VHIC-FAQ uitsluitend vindplaatscontext, geen aangetoonde eigendom/licentie |
| Werkmapkoppen, rijen 1 en 2 | Verwijzen naar selectielijsten 1996, 2020 en beschrijvend 2017; geen licentie of toestemming |
| ZIP-onderdelen / documenteigenschappen | Geen rechten-/licentieonderdeel of custom-propertiesbestand. Twee gevulde makervelden. `Application=Microsoft Excel`, `Company=Microsoft`: productmetadata, geen bewijs van producent/rechthebbende van deze concordans |
| [VHIC-FAQ](https://www.vhic.nl/faq/selectielijsten-2017-en-2020/) | Nieuwe HTTP-raadpleging geblokkeerd door omgevingsproxy met 403; reguliere Chromium-raadpleging eveneens `ERR_TUNNEL_CONNECTION_FAILED` |
| [VNG-proclaimer](https://vng.nl/proclaimer) | Dezelfde beperkingen. Geen actuele tekst als gelezen of toestemming als verkregen gepresenteerd |
| [Auteurswet](https://wetten.overheid.nl/BWBR0001886/) / [Databankenwet](https://wetten.overheid.nl/BWBR0010591/) | Concrete bestaande wettelijke toetsingsbronnen; nieuwe HTTP-raadpleging 403. Geen bewijs dat de zelfstandige werkmap onder een passende uitzondering of vrijgave valt |
| [Bestaande hergebruikafweging](concordans-hergebruik.md) | Maker, bevoegde rechthebbende, eventuele databankproducent en toepasselijke voorwaarden voor de exacte werkmap nog niet vastgesteld |

Een openbare vindplaats, bronvermelding, niet-commercieel gebruik, een compact formaat of het weglaten van dubbele contextkolommen maakt de integrale inhoud niet automatisch vrij van auteurs- of eventuele databankenrechten. Dat officiële besluittekst onder de eerdere artikel 11-beoordeling valt, bewijst niet dat dit zelfstandige hulpmiddel integraal onder dezelfde grondslag valt. De weigering betreft bewijs/onzekerheid, niet een bewezen verbod op ieder los functioneel hergebruik.

## Privacy-inventarisatie en gegevensminimalisatie

De inventarisatie onderscheidt de inhoudelijke bronlaag van documentmetadata, technische extractie en interne projectbeoordeling. De nieuwe bestanden worden met een gesloten schema en een whitelist-projector opgebouwd; er wordt niet eerst een volledig record gedumpt en achteraf oppervlakkig een naam verwijderd.

| Categorie | Concreet aangetroffen | Beslissing en motivering |
| --- | --- | --- |
| Concordanscellen | Eerdere volledige celcontrole en herhaalde inspectie: geen concrete persoonsidentificerende casusgegevens gevonden; categorieën over personen zijn geen ingevulde individuele dossiers | Alle 716 rijen en A–K behouden. Geen rij/kolom verwijderd op basis van een privacyvermoeden |
| Office-documentmetadata | Twee gevulde `creator`/`lastModifiedBy`-velden in oorspronkelijke werkmap; productmetadata | Volledig uitgesloten. Export gebruikt JSON, niet de werkmap als template; geen Office-auteursmetadata in XLSX |
| Interne beoordelings- en ontwikkelgegevens | Bron-/controlelaag bevat onder meer beoordelaarsvelden, bevestigingsdata, controleopdrachten, AI-onderzoeksvoorstellen en verificatiemethoden | Niet opgenomen in nieuwe projecties of exports. Besluiten blijven intact in hun oorspronkelijke laag. Alleen noodzakelijke publieksuitleg bij concordansafwijkingen behouden, zonder reviewer/datum/proposal-dump |
| Technische gegevens | Bbox, extractiesegmenten, geparseerde termijnen, technische statuscodes, volledige JSON-records en lokale controlerapporten | Uitgesloten; leesbare ontbrekend-duiding en relevante bronlocatie behouden. Alleen verborgen stabiele navigatiesleutels toegestaan |
| Openbare bronverantwoordingen selectielijsten | In de achtergrondteksten zijn **5 / 6 / 9 unieke naamdragende tekstfragmenten** gesignaleerd bij respectievelijk 1996/2012, 2017 en 2020: publicatiecommissies/functionarissen en auteurs van aangehaalde onderzoeken | Behouden als gepubliceerde broninhoud en bronverantwoording, geen namen van interne projectbeoordelaars. Deze passages maken de oorspronkelijke totstandkoming en bronverwijzingen controleerbaar. Niet ten onrechte als anonieme tekst aangemerkt; geen individuele namen extra in dit verslag herhaald |
| Primaire selectie-/resultaatrijen | Geen geïdentificeerde natuurlijke personen uit casussen aangetroffen; de genoemde personenclusters bevinden zich in de openbare achtergrondverantwoording | Geen officiële inhoud verwijderd op een onbevestigd vermoeden. Geen nieuwe niet-publieke persoonsgegevens toegevoegd |

De persoonskandidaten zijn inhoudelijk bekeken na signalering op onder meer e-mail-/naam-/titulatuurpatronen, met aandacht voor broncontext. Dit is geen garantie dat automatische signalering iedere mogelijke persoonsverwijzing herkent. Het behoud van gepubliceerde bronverantwoording betekent niet dat dergelijke namen uit een intern beoordelingsdossier mogen worden gekopieerd. De oorspronkelijke bron-/controlebestanden blijven gescheiden van de nieuwe publieksbestanden. Exacte uitsluitingen en samenvoegingen staan in de [veldmatrix](publicatie-veldmatrix.md).

De drie nieuwe projecties bevatten geen oorspronkelijke auteursmetadata, interne beoordelaarsvelden, lokale paden, PDF-coördinaten of volledige technische bronregistraties. Een bronregister bevat enkel unieke leesbare verwijzingen; korte verwijssleutels zijn niet zichtbaar in de exports. Werkelijke bronteksten met gepubliceerde namen zijn niet stilzwijgend geanonimiseerd of als volledig persoonsgegevenvrij omschreven.

## Noodzakelijke vervolgstap

Stel de herkomstketen en bevoegde rechthebbende/producent van de exacte concordanswerkmap vast. Verkrijg of toon een toepasselijke licentie/toestemming die integrale webweergave, compacte JSON en volledige afgeleide XLSX dekt, of onderbouw een passende wettelijke grondslag. Leg bewijs, toepasselijke voorwaarden en bronvermelding vast. Een projectbesluit alleen kan geen rechten van derden verlenen.

Pas na die vaststelling mag de concordansprojectie worden opgenomen en de fail-closed bouwblokkade worden aangepast. Herhaal dan de bron-/privacycontrole en de gewone productieacceptatie tot werkelijk vier downloads slagen zonder alias of privébron. Tot die tijd zijn het vierde publieke JSON-bestand en de vierde publieke download niet opgeleverd. Er zijn geen toestemmingsverzoeken aan derden verstuurd of productiepublicaties geactiveerd.
