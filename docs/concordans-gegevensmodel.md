# Technische concordansgegevensmodule

## Afbakening

`src/concordans/index.ts` is een zelfstandige TypeScript-module voor statische historische relaties. De browserinterface importeert of activeert deze module nog niet. Geen vergelijkingsinterface, zoekwijziging, automatische adviezen, backend of database. Een historische verwijzing bewijst geen opvolging, vervanging, juridische gelijkwaardigheid of toepasselijkheid.

De echte bronbestanden ontbreken ook in de taakbijlage. Zie [broncontrole](concordans-broncontrole.md). Het hier beschreven contract is een eenvoudig nieuw invoercontract voor later afzonderlijk gecontroleerde data, geen aanname over het schema van de ontbrekende oorspronkelijke JSON. Geen fictieve fixture wordt als productieconcordans aangeboden.

## Drie gescheiden lagen

Het statische object heeft exact vijf velden:

| Veld | Betekenis |
| --- | --- |
| `versie: 1` | Versie van dit technische invoercontract |
| `bronnen` | Bron-ID, titel, organisatie of null, URL of null, vastgelegde hergebruikvoorwaarden, verificatiestatus |
| `relaties` | Ongewijzigd overgenomen oorspronkelijke verwijzingen, bronrichting en toelichting |
| `koppelingen` | Afzonderlijke expliciete technische bindingsvoorstellen, indien nodig |
| `beoordelingen` | Afzonderlijke latere inhoudelijke beoordelingen; standaard leeg |

Een oorspronkelijke relatie bevat `id`, `bron`, `doel`, `toelichting` (string/null), `herkomst_id`, `bronlocatie` (string/null, bijvoorbeeld een werkelijk geregistreerd werkblad/rijbereik), `relatietype` (string/null), `verificatiestatus` en een lijst `onzekerheden`. Elk eindpunt bevat `selectielijst` (`1996-2012`, `2017` of `2020`), de oorspronkelijke `code` en `omschrijving` (string/null). De drie ondersteunde datasets betekenen geen claim dat een bron alle drie vergelijkt. Een directe bronrij met meerdere verwijzingen kan later in afzonderlijke relaties met behoud van herkomst/rijreferentie worden vastgelegd; de huidige module splitst geen codecellen en interpreteert geen Excel.

Een herkomst-ID moet in `bronnen` bestaan. De bronbeschrijving bewaart de feitelijk vastgestelde titel, organisatie, vindplaats en hergebruiktekst. Leg bronblad/rij/kolommen waar beschikbaar vast in `bronlocatie`, gescheiden van de oorspronkelijke toelichting. Een onbekende vindplaats blijft null. Er worden geen fictieve links of algemene toestemmingsstatussen toegevoegd. `relatietype` blijft null als de bron de betekenis niet expliciet onderbouwt. De validator kan die inhoudelijke onderbouwing niet bewijzen.

Een expliciete technische koppeling bevat `relatie_id`, `zijde` (`bron`/`doel`), `soort` (`selectiegegeven`/`structuur`), `record_id`, `status` (`technisch_gecontroleerd`/`te_beoordelen`) en `onderbouwing`. Per relatie/eindpunt is hoogstens één expliciete binding toegestaan; verschillende bronrelaties mogen hetzelfde record aanwijzen. Meerdere kandidaten blijven zonder bindende keuze beschikbaar in het koppelresultaat. Echte één-op-veelrelaties zijn meerdere oorspronkelijke relaties, geen automatische uitbreiding van één rubriek.

Een inhoudelijke beoordeling bevat `relatie_id`, `status` (`goedgekeurd`, `afgewezen`, `te_beoordelen`), `beoordelaar`, `datum` (beide string/null) en `toelichting`. Bij goed- of afkeuring moeten beoordelaar en datum zijn ingevuld. Dit bewaart een aangeleverd oordeel, bewijst geen onafhankelijke menselijke controle en verandert noch bronstatus noch technische koppeling. Een afgewezen beoordeling blijft als zodanig bij de historische relatie zichtbaar; er wordt geen bronrij verwijderd.

## Laden en opvragen

```ts
import { maakGegevenslaag } from './gegevenslaag/index.js';
import { maakConcordanslaag } from './concordans/index.js';

const gegevenslaag = maakGegevenslaag({
  datasetsUrl: new URL('./datasets/', document.baseURI),
});
const concordanslaag = maakConcordanslaag({
  // Dit bestand is nog NIET meegeleverd; pas gebruiken na afzonderlijke opname.
  bestandUrl: new URL('./concordans/concordans.json', document.baseURI),
  gegevenslaag,
});
const concordans = await concordanslaag.laad();
const uitgaand = concordans.vanuitSelectiegegeven('2020', '2020:1.1');
const rubriek = concordans.vanuitStructuur('1996-2012', '1996-2012:2.1');
const inkomend = concordans.vanuitSelectiegegeven('2020', '2020:1.1', 'inkomend');
const onopgelost = concordans.onopgelost();
const onzeker = concordans.metOnzekerheden();
```

De module heeft geen standaard-URL en haalt niets op bij initialisatie. De aanroeper bepaalt een URL relatief aan de publicatiepagina; de module kopieert die URL bij initialisatie. Werkt onder `/project/` zonder absolute domein- of rootpaden. Een optionele `ophalen`-functie vervangt fetch voor lokale tests. Er is geen runtimecompiler, externe zoekdienst of bron-download nodig.

`laad()` deelt een lopende/geslaagde aanvraag binnen dezelfde instantie. Bij mislukking wordt de cache verwijderd en kan expliciet opnieuw worden geladen. De bestaande gegevenslaag laadt en valideert alleen de selectielijsten die daadwerkelijk als bron of doel in het concordansbestand voorkomen. Zoeklexicons worden niet opgehaald. De retourwaarde en bronobjecten zijn diep bevroren; indexarrays zijn readonly. `valideerConcordans(unknown)` en `indexeerConcordans(bestand, gegevenslaag)` zijn ook afzonderlijk beschikbaar.

## Technische koppeling

Exact betekent **codegelijkheid binnen de aangegeven selectielijst**, niet inhoudelijke gelijkwaardigheid. Er wordt geen interpunctie hersteld, suffix afgeleid, omschrijving gematcht of relatie omgedraaid.

- Een historische rubriek met dezelfde code koppelt uitsluitend aan het structuuronderdeel, ook als daar maar één voorschrift bij hoort.
- Anders kan precies één selectiegegevensregel exact op code koppelen. Een generiek/specifiek resultaat behoudt zijn bestaande technische ID.
- Zonder unieke selectiegegevensregel kan precies één structuuronderdeel worden gekoppeld.
- Meerdere kandidaten zonder uniek structuurniveau leveren `meerdere_kandidaten`, een kandidatenlijst en geen gekozen record op.
- Geen exacte code levert `ontbreekt` op. De broncode blijft behouden.
- Een expliciete binding kan één technisch voorschrift kiezen. Een ontbrekend ID blijft `ontbreekt`; een binding met `te_beoordelen` of een afwijkende officiële code blijft `onzeker`, zonder bindend record. Afwijkende historische subletters vragen dus een afzonderlijk beoordeelde uitbreiding, geen automatische suffixregel.

Elk koppelresultaat bevat de oorspronkelijke verwijzing, status, een gekozen `{selectielijst, id, soort}` of null, kandidaten, technische toelichting en de eventuele expliciete koppeling. Het geretourneerde relatieobject bevat `oorspronkelijk`, `bron`, `doel` en `inhoudelijke_beoordeling` apart.

Uitgaande/inkomende in-memory indexen zijn gescheiden en gebruiken lijst én technisch ID. Standaard wordt uitsluitend de oorspronkelijke bronrichting opgezocht. Optioneel inkomend opzoeken toont dezelfde bronrelatie met dezelfde oorspronkelijke richting; het creëert geen omgekeerde relatie. Eén-op-veel en veel-op-één behouden alle afzonderlijke bronrelaties en bronvolgorde.

Een voorschriftquery erft geen rubriekrelaties. Een structuurquery retourneert alleen directe structuurkoppelingen of een canoniek selectiegegevensrecord met exact hetzelfde technische ID. Geen bovenliggende, onderliggende of concordansketens worden doorlopen. Voor een niet bij het bestand betrokken lijst wordt een lege lijst gegeven zonder die dataset alsnog te laden; dit betekent geen uitspraak over het bestaan van het gevraagde record of historische dekking.

`onopgelost()` geeft relaties waarvan minstens één eindpunt geen bindend record heeft. `metOnzekerheden()` geeft daarnaast relaties met expliciete brononzekerheden of een inhoudelijke beoordeling `te_beoordelen`. Een technisch exacte relatie kan dus inhoudelijk onzeker blijven. Vrije bronstatussen worden bewaard, niet stilzwijgend als goedkeuring geïnterpreteerd.

## Validatie en fouten

Er zijn geen nieuwe dependencies. De gesloten runtimevalidator controleert alle benodigde velden en typen, versie, toegestane lijsten, bronverwijzingen, dubbele relatie-/bron-ID's, dubbele bindingszijden en beoordelingsverwijzingen. HTTP(S)-bronlinks worden als links gevalideerd, niet bezocht. JSON-schema's van de bestaande datasets blijven via de bestaande gegevenslaag leidend voor datasetrecords.

`Concordansfout.code` onderscheidt `LADEN_MISLUKT`, `ONGELDIGE_JSON`, `ONGELDIG_BESTAND`, `DUBBELE_ID`, `ONGELDIGE_KOPPELING` en `ONBEKEND_RECORD`. Een technische binding naar een andere lijst is blokkerend. Ontbrekende bron-/doelcodes of ontbrekende record-ID's blijven juist als onopgeloste relaties beschikbaar. Fouten in de geladen officiële datasets blijven de bestaande `Gegevensfout` en blokkeren indexopbouw. Er worden geen officiële waarden gerepareerd om validatie te laten slagen.

## Build, tests en beperkingen

`npm run build` controleert TypeScript en bouwt `dist/concordans/index.js` met typeverklaringen. De statische site bevat alleen de module onder `dist/site/concordans/`; geen echte of fictieve concordansdata. De bestaande interface blijft zonder concordans werken. GitHub Pages wordt niet geactiveerd.

Tests: `CHROMIUM_PATH=/usr/bin/chromium npm test`; aanvullend `npm run typecheck` en `python scripts/valideer_publicatie.py`. `tests/concordans.test.mjs` test met expliciet fictieve relaties tussen bestaande codes en gecontroleerde foutgevallen. De oorspronkelijke zoek-, detail-, gegevenslaag- en browsertests blijven ongewijzigd. Eindcontrole: 110 moduletests (waarvan 18 concordanstests) en 55 bestaande Chromium-browsertests geslaagd. Typecheck, statische productiebuild, publieke Python-validatie en integriteitsvingerafdrukken zijn geslaagd. Bestaande testverwachtingen zijn niet gewijzigd. De module is ook vanuit de gebouwde site-uitvoer geïmporteerd/getoetst; er is geen nieuwe gebruikersinterface om visueel te beoordelen.

De module bewijst geen bronvolledigheid, rechten of historische/juridische betekenis. Het echte koppelrapport kan pas na beschikbaarheid van de oorspronkelijke bron worden gemaakt. Een volgende afzonderlijke opdracht moet echte data en toepasselijke publicatievoorwaarden vaststellen; deze stap levert uitsluitend de technische module op.
