# Privacy, herkomst en publicatiebesluit naslagwerken

> De gewone productiebuild bevat vier naslagwerken en vier Excel-downloads, zonder lokale concordansalias. Zie de [actuele acceptatie](concordans-distributie-acceptatie.md) en [rechtenverklaring](../HERGEBRUIK.md). Eerdere technische resultaten hieronder beschrijven de genoemde ontwikkelstappen, niet de huidige distributiestatus.

## Herkomst en rechtenafbakening

Voor officiële selectiegegevens, de historische concordans uit de VNG-SelectTool en ander bronmateriaal gelden de afbakening en voorwaarden in [HERGEBRUIK.md](../HERGEBRUIK.md). De projectlicenties zijn geen herlicentiëring van bronmateriaal. De [bronverantwoording](concordans-hergebruik.md) beschrijft de gecontroleerde bestandsidentiteit: 716 rijen, elf kolommen, 550 merges en alle oorspronkelijke en uitgevouwen waarden.

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

## Documentgeschiedenis

[Eerdere versies](https://github.com/EGRten/semantische-selectie-tool/commits/911c9e2/docs/publicatie-privacy-hergebruik.md) blijven beschikbaar in de Git-geschiedenis.
