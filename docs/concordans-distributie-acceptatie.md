# Opleverrapport publieke concordansdistributie — opdracht 18

## Uitkomst op 12 november 2026

**Functionele harde acceptatie gehaald: vier van vier echte Excel-downloads werken uit de gewone productiebuild.** Alle vier naslagwerken zijn doorlopend raadpleegbaar. Er is geen concordansalias, privébron, mock of omgevingsvariabele nodig voor raadplegen, vergelijken of downloaden.

Dit resultaat volgt op de aanvullende expliciete instructie van de projecteigenaar om ondanks de niet-vastgestelde hergebruikgrondslag te publiceren. **Er is geen nieuwe licentie, toestemming van derden of voldoende onderbouwde wettelijke vrijstelling vastgesteld.** De technische beschikbaarheid is gerealiseerd; het oorspronkelijke juridische vrijgavecriterium is daarmee niet aangetoond. Zie [de concrete beoordeling en het gewijzigde uitvoeringsbesluit](concordans-publicatiebesluit.md).

## Gewone productiecontrole

| Naslagwerk | Webrijen | Daadwerkelijke download | Werkbladen | Resultaat |
| --- | ---: | --- | --- | --- |
| Concordans | 716 | `Concordans 1996-2020.xlsx` | Concordans 1996-2020; Bronvermelding | Geslaagd |
| 1996/2012 | 494 | `Selectielijst 1996-2012.xlsx` | Selectiegegevens; Toelichtingen; Bronvermelding | Geslaagd |
| 2017 | 305 | `Selectielijst 2017.xlsx` | Selectiegegevens; Toelichtingen; Bronvermelding | Geslaagd |
| 2020 | 346 | `Selectielijst 2020.xlsx` | Selectiegegevens; Toelichtingen; Bronvermelding | Geslaagd |

De controle vraagt de vier reguliere publicatie-JSON's onder een repositorysubpad op, valideert het schema, telt de werkelijke DOM-tabelrijen en activeert de downloadknoppen in Chromium. De bestanden worden onafhankelijk als ZIP/OOXML teruggelezen. Bestandsnamen, werkbladnamen, aantallen, alle primaire Excel-cellen en gevulde aanvullende informatie worden gecontroleerd. Geen macro's of externe links. De concordans heeft twaalf primaire kolommen: bronrij en A–K; de selectielijsten 9 / 11 / 11. Het script schrijft `harde_acceptatie: true` en eindigt met exitcode 0. Een ontbrekend of ongeldig vierde bestand wordt niet overgeslagen en geeft exitcode 1.

```sh
npm run build
node scripts/controleer-publieke-downloads.mjs --output /tmp/vier-downloads.json
```

De gewone build gebruikt alleen bestanden uit Git en dependencies uit het lockbestand. De acceptatiecontrole verwijdert zelf `CONCORDANS_BRON_JSON` uit de serveromgeving en gebruikt nooit `--concordans-env`. De Playwright-regressieserver gebruikt die lokale alias nu evenmin. De controle kan ook een toekomstige wijziging naar een ontbrekende of verkeerde download detecteren; zij bevat geen vooraf gekozen concordansfout meer.

## Bronbehoud, technische koppeling en reproduceerbaarheid

De oorspronkelijke Excel- en JSON-hashes zijn opnieuw gecontroleerd. De nieuwe reguliere `publicatie/concordans.json` bewaart alle 716 × 11 oorspronkelijke cellen met afzonderlijke sparse mergecontext. Het schema is ongewijzigd. Tijdens elke build wordt daarnaast de vaste SHA-256 `05240739d880693aab5a52a8fc5ed243f2e08baae34f33760ba5eef79d878044` gecontroleerd over JSON van alle `{rij, origineel, uitgevouwen}`-waarden in bronvolgorde. Zo worden gewijzigde broncellen of mergecontext afgewezen, ook zonder oorspronkelijke werkmap.

`node scripts/genereer-publicaties.mjs --check` controleert alle vier bestanden. De drie selectieprojecties worden uit hun officiële datasets herleid; de vierde aanwezige projectie wordt op schema en gecontroleerde celidentiteit getoetst. Wie de oorspronkelijke JSON lokaal bezit, kan ook de volledige concordansprojectie opnieuw bytegelijk genereren en vergelijken:

```sh
node scripts/genereer-publicaties.mjs --concordans /tmp/concordans/concordans.json --check
```

De oorspronkelijke JSON zelf hoeft niet in Git of de productieomgeving te staan. Deze optionele broncontrole is niet het runtimepad.

Een kleine adapter in `src/publicatie/concordans.ts` reconstrueert in het geheugen de oorspronkelijke en uitgevouwen cellen voor de bestaande concordansindex. Er is geen tweede statische bronspiegel. De ongebruikte oorspronkelijke code-inventarisvelden worden niet als onafhankelijk behouden broninformatie voorgesteld: de bestaande index bepaalt de doelverwijzingen uit kolom F. De adapter is tegen de echte oorspronkelijke bron getest: alle rij-interpretaties, technische relaties en besluiten zijn gelijk. Telling blijft **612 interpretaties, 606 volledig gekoppeld, zes onopgelost**. Rij 21 en rij 716 behouden hun oorspronkelijke code naast de bestaande technische correctie. Er zijn geen nieuwe relaties of betekenislabels toegevoegd.

## Tests en bewust gewijzigde verwachtingen

- **163 moduletests geslaagd, nul mislukt of overgeslagen**, inclusief vergelijking met de echte oorspronkelijke concordans.
- **85 Chromium-browsertests geslaagd**, met een gewone statische server zonder concordansalias. Inclusief vergelijking, terugnavigatie, gedeelde cache, fouten, mobiel en toetsenbordbediening.
- Productiebuild, typecheck, publieke datasetvalidatie en reproduceerbare generatie geslaagd.
- Afzonderlijke productieacceptatie: vier daadwerkelijke downloads geslaagd, zonder privébron of mocks.

De oorspronkelijke bron is alleen nodig om de aanvullende bronvergelijkende moduletests zonder overslaan uit te voeren. Voor productiebuild, volledige browserregressies en de vier-downloadacceptatie is zij niet nodig. De bestaande tests op de oorspronkelijke bronlaag blijven behouden.

Bewust gewijzigd ten opzichte van PR #18: browsernetwerkcontroles en foutinjecties richten zich nu op de gedeelde `publicatie/concordans.json`; publiek aanwezige concordansdata worden niet langer als afwezig verwacht; de onjuiste tekst “nog niet vrijgegeven” is vervangen door een technische beschikbaarheidsmelding. De tests voor bronwaarden, koppeldekking, correcties, besluiten, zoekresultaten en tabelaantallen zijn inhoudelijk niet afgezwakt. Nieuwe controles detecteren ook een gewijzigde Excel-cel bij ongewijzigd aantal rijen en eisen vier verschillende geslaagde downloads.

## Behouden en resterende beperkingen

Officiële datasets, structuur, zoeklexicons, semantische relaties, oorspronkelijke concordanscellen, AI-onderzoeksvoorstellen en beoordelingsbesluiten zijn ongewijzigd. De drie bestaande selectieprojecties zijn bytegelijk. Geen nieuwe dependencies, backend, database of beoordelingssysteem. De bestaande privacy-/minimalisatie-inventarisatie is niet zonder aanwijzing herhaald; Office-makermetadata en interne controlebestanden blijven uitgesloten.

De hergebruikgrondslag blijft onzeker zoals hierboven beschreven. Externe wettelijke pagina's konden niet opnieuw worden gelezen; concrete voorwaarden zijn niet als geverifieerde toestemming gepresenteerd. Er is geen nieuwe 2017-codemapping en er blijven zes onopgeloste historische relaties. Een technische koppeling blijft geen juridisch selectieadvies.

Deze oplevering maakt de publieke gegevens beschikbaar op de nieuwe Git-branch en in de gewone productiebuild. De branch wordt ter beoordeling aangeboden; `main` wordt niet zelfstandig bijgewerkt en GitHub Pages wordt niet geactiveerd. Een geslaagde productiebuild wordt niet voorgesteld als een reeds uitgevoerde Pages-deployment.
