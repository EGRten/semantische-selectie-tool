# Gerichte pre-publicatieconsistentie — opdracht 35

Baseline: `12d67446f9baa132a93e45d8505b1f18bf800da4` (main inclusief PR #33). Geen nieuwe rechtenanalyse of wijziging van publicatiebesluit.

## Vooraf begrensde wijzigingen

| Toegestaan veld | Oude presentatie | Beoogde presentatie |
| --- | --- | --- |
| `Publicatie.hergebruik` voor concordans, in projector en `publicatie/concordans.json` | Aangeleverde werkmap; onvoldoende grondslag; expliciete instructie projecteigenaar | VNG-SelectTool, ledenbrief 26 mei 2020, toepasselijke VNG-voorwaarden en bestaand rechtenvoorbehoud |
| Bron-/herkomstparagraaf in `src/interface/concordans.ts` | Oorspronkelijke publicerende organisatie niet vastgesteld | Gedocumenteerde VNG-SelectTool-herkomst naast ongewijzigde documentnaam/bronmetadata |
| Herkomst-/hergebruikparagraaf in `src/interface/concordans-viewer.ts` | Distributie op instructie projecteigenaar | Dezelfde publieke verklaring als de projectie |
| Excel `Bronvermelding`, rij `Hergebruik` | Oude `Publicatie.hergebruik` | Nieuwe `Publicatie.hergebruik`; alle andere cellen en werkbladen ongewijzigd |

Niet toegestaan: bronrijen/kolommen, oorspronkelijke en uitgevouwen cellen, mergecontext, technische koppelingen, kandidaten, besluiten, bronregistraties, bronidentiteit, officiële datasets en primaire Excel-gegevens. SHA-256 van de canonieke concordansprojectie **zonder uitsluitend de top-level sleutel `hergebruik`**, JSON met gesorteerde sleutels en compacte UTF-8-serialisatie: `abaa86ddbf04ecf181dfc77e314c03fa7a15579cc4b389d7a57c905bfbeeaab1`.

Documentverpakking: uitsluitend een expliciete whitelist. De rootkopie van `concordans-bronvermelding.md` krijgt de passende relatieve verwijzing naar `./HERGEBRUIK.md`; de oorspronkelijke documentlocatie blijft ongewijzigd. De projectlicenties zelf veranderen niet.

## Controles en resterende acceptatie

REL-01, REL-02, REL-03 en de praktijkgerichte toegankelijkheidstoetsing blijven open. Geen Pages-activering, release of zelfstandige samenvoeging.

## Veldgerichte vergelijking na verwerking

In de JSON verschilt uitsluitend de vooraf aangewezen top-level sleutel `hergebruik`. De canonieke hash zonder die sleutel blijft exact gelijk aan de hierboven vastgelegde baseline. Alle rijvelden, oorspronkelijke cellen, mergecontext, koppelingen, kandidaten, notities/besluiten en bronregistraties zijn daardoor gelijk gebleven.

**Oude `hergebruik`-tekst (uitsluitend historische vergelijking):**

> Herkomst: aangeleverde werkmap; maker/rechthebbende niet vastgesteld. Vindplaatscontext: https://www.vhic.nl/faq/selectielijsten-2017-en-2020/ . Geen voldoende onderbouwde grondslag voor integrale openbare weergave en Excel-distributie vastgesteld. Publiek opgenomen op expliciete instructie van de projecteigenaar. Dit besluit is geen toestemming van eventuele derden en stelt geen licentie vast. Geen zelfstandig juridisch of archivistisch oordeel.

**Nieuwe `hergebruik`-tekst:**

> De historische concordans is afkomstig uit de door de Vereniging van Nederlandse Gemeenten (VNG) beschikbaar gestelde SelectTool. Bronverwijzing: VNG — Handvatten voor de uitvoering van de Archiefwet, ledenbrief van 26 mei 2020. Voor hergebruik wordt aangesloten bij de toepasselijke VNG-hergebruikvoorwaarden (https://vng.nl/proclaimer), met VNG als bron. De oorspronkelijke rechten en voorwaarden blijven gelden. De projectlicenties verlenen geen rechten op de concordans; deze toelichting is geen afzonderlijke licentie of toestemming. Geen zelfstandig juridisch of archivistisch oordeel.

De viewer gebruikt dezelfde nieuwe verklaring uit `src/publicatie/herkomst.ts`; de vergelijking toont de herkomstzin daarvan naast de oorspronkelijke werkmapnaam en ongewijzigde metadata-link. Er wordt geen rechthebbende, afzonderlijke toestemming of juridische gelijkwaardigheid vastgesteld.

Oude en nieuwe concordans-Excel zijn met dezelfde vaste exportdatum nieuw gegenereerd en onafhankelijk als OOXML teruggelezen. Er is **precies één celverschil: `Bronvermelding!B4` (`Hergebruik`)**. Het primaire werkblad met 716 rijen en alle overige bronvermeldingscellen zijn identiek. De XLSX-schrijver en exportstructuur zijn niet aangepast. De drie selectielijstprojecties zijn byte-ongewijzigd; officiële datasetbestanden, relaties en besluiten hebben geen Git-diff.

## Documentwhitelist

`HERGEBRUIK.md`, `LICENCE.md`, `LICENCE-CC-BY-4.0.md`, `docs/concordans-hergebruik.md`, de bestaande rootalias `concordans-bronvermelding.md` en `privacy-publicatie.md` worden expliciet verpakt. Alleen bij de verplaatste bronvermelding wordt de ene relatieve link van `../HERGEBRUIK.md` naar `./HERGEBRUIK.md` omgezet; de originele documentatie blijft ongewijzigd. Geen volledige docs-/controle-/onderzoeksmap toegevoegd. De nieuwe browsertest controleert ieder document, alle lokale Markdown-doelen via HTTP onder het repositorysubpad, gelijke bronbytes waar niet verplaatst en 404 voor drie uitgesloten controle-/onderzoeksbestanden.

## Hertestresultaten

- Technische Python-validatie en bronintegriteitsvingerafdrukken: geslaagd; 494/305/346 selectieregels, elf annotaties behouden.
- Vijftien CSV-exports: byte-identiek gereproduceerd.
- Projectiecontrole `--check`: geslaagd; concordans 716 rijen, elf inhoudelijke kolommen; broncel-/mergehash behouden. Alleen `hergebruik` verschilt in de JSON.
- Volledige lokale moduletestset: **168 gevallen, 150 geslaagd, 18 bronafhankelijk overgeslagen, 0 mislukt**. De extra metadata-integriteitstest slaagt; de historische opdracht-34-telling 149/18 blijft afzonderlijk staan.
- Gerichte lokale browserregressie: **25 Chromium-tests geslaagd, 0 mislukt, 0 flaky, 0 overgeslagen**, waaronder viewer, vergelijking, openbare naslagwerken en twee nieuwe document-/herkomsttests. Lokaal retries 0.
- Vier daadwerkelijke downloads uit de gewone build onder `/semantische-selectie-tool/`: allemaal geslaagd; juiste namen, werkbladen, 716/494/305/346 gegevensrijen en primaire bronwaarden. Geen alias, mocks of privébron.
- Concordans-Excel vóór/na: alleen `Bronvermelding!B4` gewijzigd, alle overige teruggelezen waarden identiek bij gelijke exportdatum.
- Typecheck en productiebuild: geslaagd. Interne Markdown-bestandsdoelen in gewijzigde documenten bestaan; Git-diffcontrole geslaagd.
- Officiële datasets, bronregistraties, controle-/besluitregisters, oorspronkelijke concordansbestanden, schema's, licentiebestanden en workflowconfiguratie: geen Git-diff.

Omgeving: Debian 13, Node 24.22.1, Python 3.12.14, Playwright 1.65.0, systeem-Chromium 156.0.8078.79. Geen nieuwe Firefox-/WebKit-uitvoering lokaal; de volledige nieuwe PR-matrix blijft afzonderlijk vereist.

## Bijgewerkte bestanden

- `AGENTS.md`: actieve GitHub Pages-route.
- `README.md`, `docs/release-acceptatie.md`, `docs/release-restpunten.md`, `docs/browsercompatibiliteit-en-toegankelijkheid.md`: centrale actuele status, compacte runmetadata en expliciet historische verslagen.
- `src/publicatie/herkomst.ts`, `src/publicatie/projectie.ts`, `publicatie/concordans.json`: gedeelde applicatie-eigen herkomst-/hergebruikverklaring; uitsluitend toegestane projectiemetadata.
- `src/interface/concordans.ts`, `src/interface/concordans-viewer.ts`: overeenkomstige publieke bron-/herkomstteksten.
- `scripts/publieke-documenten.mjs`, `scripts/bouw-interface.mjs`: begrensde documentverpakking en relatieve aliaslink.
- `tests/prepublicatie.test.mjs`, `tests/browser/publieke-documenten.spec.mjs`: metadata-integriteit, HTTP-documentdoelen en beide publieke herkomstpresentaties.
- Dit document: vooraf begrensde velden, vergelijking en verificatie.

## Nog open

- De nieuwe PR-browsermatrix moet onafhankelijk worden beoordeeld; eerdere 395/395-resultaten zijn geen bewijs voor deze gewijzigde commit.
- Werkelijke engineversies en uitgevoerde workflow-merge-SHA van run 43427464946 zijn door geweigerde API-toegang niet geverifieerd. De openbare headcommit is afzonderlijk geregistreerd. Geen waarden verzonnen.
- Oorspronkelijke concordans-JSON is niet gekoppeld voor lokale bronafhankelijke moduletests; dit beperkt de nieuwe hercontrole, niet het functioneren van de reguliere build.
- Praktijkproeven en resterend AA-bewijs zijn niet uitgevoerd; rechtenvoorbehoud en particuliere positionering zijn ongewijzigd.


## PR- en Actions-uitvoeringsstatus

De branch `prepublicatie-consistentie` is gepusht. `gh pr create` is geweigerd met `Post "https://api.github.com/graphql": Forbidden`; ook `gh workflow run browsercompatibiliteit.yml --ref prepublicatie-consistentie` wordt bij de workflowlookup geweigerd met `Forbidden`. Er is daardoor geen nieuwe gecontroleerde PR-/Actions-runlink. De GitHub-tag levert in deze sessie geen aanroepbare repository-/Actions-tools op.

Beheerder: [open de voorbereide PR naar main](https://github.com/EGRten/semantische-selectie-tool/pull/new/prepublicatie-consistentie), controleer dat de bestaande PR-trigger start en beoordeel alle drie engine-uitkomsten. Laat de PR open. De volledige nieuwe matrix is **nog niet uitgevoerd/bevestigd vanuit deze sessie**; dit is een open opleveringspunt. Het eerdere 395/395-bewijs wordt daarvoor niet hergebruikt.
