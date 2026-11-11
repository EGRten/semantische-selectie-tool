# Technische concordansgegevensmodule

## Afbakening

`src/concordans/index.ts` is een zelfstandige TypeScript-module voor statische historische relaties. De browserinterface importeert of activeert deze module nog niet. Geen vergelijkingsinterface, zoekwijziging, automatische adviezen, backend of database. Een historische verwijzing bewijst geen opvolging, vervanging, juridische gelijkwaardigheid of toepasselijkheid.

De aanvullende oorspronkelijke bron is nu ontvangen en op Excel-identiteit en volledige celovereenkomst gecontroleerd. Zie [broncontrole](concordans-broncontrole.md) voor de werkelijke dekking, alle resterende problemen en de publicatiegrens. De module ondersteunt zowel het genormaliseerde technische contract als de werkelijk aangetroffen rij-JSON. Fictieve fixtures blijven beperkt tot geïsoleerde tests.

## Werkelijke rijbron laden

`src/concordans/bronbestand.ts` valideert het daadwerkelijke negenveldenformaat van `concordans/concordans.json`: rij-ID, bron (bron_id/werkblad/rij), elf oorspronkelijke cellen, elf uitgevouwen cellen, expliciete 2020-code-inventaris, ongeldige codes en de twee expliciet onware betekenis-/2017-afleidingsclaims. De oorspronkelijke JSON-array wordt niet herschreven; de retourwaarde `bronrijen` bewaart alle waarden diep bevroren.

```ts
import { laadBronconcordans } from './concordans/index.js';
const bronlaag = laadBronconcordans({
  bestandUrl: new URL('./concordans/concordans.json', document.baseURI),
  gegevenslaag,
});
const controle = await bronlaag.laad();
const bronrijen = controle.bronrijen; // letterlijke, ongewijzigde bron
const rijrapport = controle.rijen;  // interpretatie, kandidaten en afwijkingen
const relaties = controle.concordans.vanuitSelectiegegeven(
  '1996-2012', '1996-2012:2.1::002',
);
```

Deze URL is geen claim dat de gegevens al publiek worden meegebouwd: de daadwerkelijke brondata blijven voorlopig lokaal. `valideerBronrijen` en `indexeerBronconcordans` zijn afzonderlijk testbaar. De loader is lazy, deelt een lopende aanvraag, cachet alleen succes en ondersteunt expliciet opnieuw proberen. Alleen statische JSON wordt geladen; Excelcontrole gebeurt tijdens voorbereiding, niet in de browser.

De rijadapter volgt de bronindeling A:D (1996), E:I (2020), J:K (2017-aantekeningen). Hij gebruikt de unieke bestaande werkbladrijreferenties van 1996/2012 of exact identieke, werkelijk uitgevouwen A:D-cellen. Hij vult geen ongedocumenteerde lege cellen door en leidt technische suffixen niet af uit subletters. Lege/afwijkende historische omschrijvingen en termijnen zijn afzonderlijk zichtbaar, ook wanneer de rij-identiteit technisch vaststaat.

2020-codes worden alleen bindend gevolgd vanuit een volledige code/slashlijst in kolom F of een expliciet begrensd ‘t/m’-bereik met dezelfde prefix (maximaal 101 eindpunten). Algemene bepalingen met ‘paragraaf’, onvolledige codes en overige tekst krijgen eigen statussen; voorbeelden zoals ‘zoals 5.1’ worden niet automatisch recordrelaties. Een ontbrekende doelcode blijft onopgelost; er is geen broncorrectie. De eerdere `expliciete_2020_codes`-inventaris blijft behouden, maar wordt niet blind gebruikt als semantische classificatie van ieder nummer.

Voor de historische kant wordt geen volledige officiële code verzonnen waar die niet letterlijk is opgeslagen: `code` is daar null. Een expliciete technische binding via de bestaande rijreferentie wijst het juiste record aan. Een bestaande niet-lege broncode blijft wel verplicht gelijk aan de technische recordcode om bindend te koppelen. Rij-omschrijvingen en toelichtingen blijven in hun oorspronkelijke vorm bewaard.

De adapter maakt 1996→2020-interpretaties met een stabiele ID op basis van bronrij en lokaal codevolgnummer. Expliciet nieuwe 2020-rijen blijven in de rijrapportage maar krijgen geen verzonnen historische relatie. J/K worden apart tegen 2017 onderzocht: zelfs een unieke letterlijke tekstmatch blijft een te beoordelen kandidaat, geen geactiveerde relatie of via 2020 afgeleide code. De bestaande gegevenslaag laadt 1996/2012 en 2020; 2017 alleen wanneer een beschrijvende J-aantekening onderzocht moet worden.

De drie retourvelden scheiden **bron**, **technische rijinterpretatie** en **geïndexeerde koppelingen**. Binnen het bestaande genormaliseerde contract heet de basisrelatie nog `oorspronkelijk`; bij gebruik van de adapter is dat nadrukkelijk de genormaliseerde technische interpretatie, niet een vervanging van de letterlijke cellen in `bronrijen`. Rij-ID en bronlocatie verbinden beide. Er zijn geen nieuwe inhoudelijke beoordelingen ingevuld.

## Genormaliseerd contract: drie gescheiden lagen

Het statische object heeft exact vijf velden:

| Veld | Betekenis |
| --- | --- |
| `versie: 1` | Versie van dit technische invoercontract |
| `bronnen` | Bron-ID, titel, organisatie of null, URL of null, vastgelegde hergebruikvoorwaarden, verificatiestatus |
| `relaties` | Ongewijzigd overgenomen oorspronkelijke verwijzingen, bronrichting en toelichting |
| `koppelingen` | Afzonderlijke expliciete technische bindingsvoorstellen, indien nodig |
| `beoordelingen` | Afzonderlijke latere inhoudelijke beoordelingen; standaard leeg |

Een oorspronkelijke relatie bevat `id`, `bron`, `doel`, `toelichting` (string/null), `herkomst_id`, `bronlocatie` (string/null, bijvoorbeeld een werkelijk geregistreerd werkblad/rijbereik), `relatietype` (string/null), `verificatiestatus` en een lijst `onzekerheden`. Elk eindpunt bevat `selectielijst` (`1996-2012`, `2017` of `2020`), de oorspronkelijke `code` en `omschrijving` (beide string/null; een onbekende code wordt niet verzonnen). De drie ondersteunde datasets betekenen geen claim dat een bron alle drie vergelijkt. Een directe bronrij met meerdere verwijzingen kan later in afzonderlijke relaties met behoud van herkomst/rijreferentie worden vastgelegd; de genormaliseerde kernmodule splitst geen codecellen; de rijadapter doet uitsluitend de hierboven beschreven expliciete kolomverwerking en interpreteert geen Excel.

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
  bestandUrl: new URL('./concordans/concordans-technisch.json', document.baseURI),
  gegevenslaag,
});
const concordans = await concordanslaag.laad();
const uitgaand = concordans.vanuitSelectiegegeven('2020', '2020:1.1');
const rubriek = concordans.vanuitStructuur('1996-2012', '1996-2012:2.1');
const inkomend = concordans.vanuitSelectiegegeven('2020', '2020:1.1', 'inkomend');
const onopgelost = concordans.onopgelost();
const onzeker = concordans.metOnzekerheden();
```

Gebruik voor de werkelijke rij-JSON `laadBronconcordans`; `maakConcordanslaag` in dit tweede voorbeeld verwacht het genormaliseerde vijfveldenobject. De formaten worden niet stilzwijgend verwisseld. De module heeft geen standaard-URL en haalt niets op bij initialisatie. De aanroeper bepaalt een URL relatief aan de publicatiepagina; de module kopieert die URL bij initialisatie. Werkt onder `/project/` zonder absolute domein- of rootpaden. Een optionele `ophalen`-functie vervangt fetch voor lokale tests. Er is geen runtimecompiler, externe zoekdienst of bron-download nodig.

`laad()` deelt een lopende/geslaagde aanvraag binnen dezelfde instantie. Bij mislukking wordt de cache verwijderd en kan expliciet opnieuw worden geladen. De bestaande gegevenslaag laadt en valideert alleen de selectielijsten die daadwerkelijk als bron of doel in het concordansbestand voorkomen. Zoeklexicons worden niet opgehaald. De retourwaarde en bronobjecten zijn diep bevroren; indexarrays zijn readonly. `valideerConcordans(unknown)` en `indexeerConcordans(bestand, gegevenslaag)` zijn ook afzonderlijk beschikbaar.

## Technische koppeling

Exact betekent **codegelijkheid binnen de aangegeven selectielijst**, niet inhoudelijke gelijkwaardigheid. Er wordt geen interpunctie hersteld, suffix afgeleid, omschrijving gematcht of relatie omgedraaid.

- Een historische rubriek met dezelfde code koppelt uitsluitend aan het structuuronderdeel, ook als daar maar één voorschrift bij hoort.
- Anders kan precies één selectiegegevensregel exact op code koppelen. Een generiek/specifiek resultaat behoudt zijn bestaande technische ID.
- Zonder unieke selectiegegevensregel kan precies één structuuronderdeel worden gekoppeld.
- Meerdere kandidaten zonder uniek structuurniveau leveren `meerdere_kandidaten`, een kandidatenlijst en geen gekozen record op.
- Geen exacte code levert `ontbreekt` op. De broncode blijft behouden.
- Een expliciete binding kan één technisch voorschrift kiezen. Een ontbrekend ID blijft `ontbreekt`; een binding met `te_beoordelen` of een afwijkende niet-lege officiële code blijft `onzeker`, zonder bindend record. Afwijkende historische subletters vragen dus een afzonderlijk beoordeelde uitbreiding, geen automatische suffixregel.

Elk koppelresultaat bevat de oorspronkelijke verwijzing, status, een gekozen `{selectielijst, id, soort}` of null, kandidaten, technische toelichting en de eventuele expliciete koppeling. Het geretourneerde relatieobject bevat `oorspronkelijk`, `bron`, `doel` en `inhoudelijke_beoordeling` apart.

Uitgaande/inkomende in-memory indexen zijn gescheiden en gebruiken lijst én technisch ID. Standaard wordt uitsluitend de oorspronkelijke bronrichting opgezocht. Optioneel inkomend opzoeken toont dezelfde bronrelatie met dezelfde oorspronkelijke richting; het creëert geen omgekeerde relatie. Eén-op-veel en veel-op-één behouden alle afzonderlijke bronrelaties en bronvolgorde.

Een voorschriftquery erft geen rubriekrelaties. Een structuurquery retourneert alleen directe structuurkoppelingen of een canoniek selectiegegevensrecord met exact hetzelfde technische ID. Geen bovenliggende, onderliggende of concordansketens worden doorlopen. Voor een niet bij het bestand betrokken lijst wordt een lege lijst gegeven zonder die dataset alsnog te laden; dit betekent geen uitspraak over het bestaan van het gevraagde record of historische dekking.

`onopgelost()` geeft relaties waarvan minstens één eindpunt geen bindend record heeft. `metOnzekerheden()` geeft daarnaast relaties met expliciete brononzekerheden of een inhoudelijke beoordeling `te_beoordelen`. Een technisch exacte relatie kan dus inhoudelijk onzeker blijven. Vrije bronstatussen worden bewaard, niet stilzwijgend als goedkeuring geïnterpreteerd.

## Validatie en fouten

Er zijn geen nieuwe dependencies. De gesloten runtimevalidator controleert alle benodigde velden en typen, versie, toegestane lijsten, bronverwijzingen, dubbele relatie-/bron-ID's, dubbele bindingszijden en beoordelingsverwijzingen. HTTP(S)-bronlinks worden als links gevalideerd, niet bezocht. JSON-schema's van de bestaande datasets blijven via de bestaande gegevenslaag leidend voor datasetrecords.

`Concordansfout.code` onderscheidt `LADEN_MISLUKT`, `ONGELDIGE_JSON`, `ONGELDIG_BESTAND`, `DUBBELE_ID`, `ONGELDIGE_KOPPELING` en `ONBEKEND_RECORD`. Een technische binding naar een andere lijst is blokkerend. Ontbrekende bron-/doelcodes of ontbrekende record-ID's blijven juist als onopgeloste relaties beschikbaar. Fouten in de geladen officiële datasets blijven de bestaande `Gegevensfout` en blokkeren indexopbouw. Er worden geen officiële waarden gerepareerd om validatie te laten slagen.

## Build, tests en beperkingen

`npm run build` controleert TypeScript en bouwt `dist/concordans/index.js` met typeverklaringen. De statische site bevat alleen de module onder `dist/site/concordans/`; geen echte of fictieve concordansdata. De bestaande interface blijft zonder concordans werken. GitHub Pages wordt niet geactiveerd.

Tests: `CHROMIUM_PATH=/usr/bin/chromium npm test`; aanvullend `npm run typecheck` en `python scripts/valideer_publicatie.py`. `tests/concordans.test.mjs` gebruikt alleen geïsoleerde fictieve fout-/structuurgevallen. `tests/concordans-bron.test.mjs` combineert afzonderlijk gelabelde geïsoleerde tests met een expliciet benoemde test op de werkelijke bron; de laatste vereist `CONCORDANS_BRON_JSON`. Geen van de fictieve gevallen vormt de grondslag voor de dekkingscijfers. De oorspronkelijke zoek-, detail-, gegevenslaag- en browsertests blijven ongewijzigd. Eindcontrole van de correctie: 116 moduletests, inclusief de echte broncontrole en zes nieuwe rijadaptertests, en 55 bestaande Chromium-browsertests geslaagd. De echte-brontest is met `CONCORDANS_BRON_JSON` uitgevoerd, niet overgeslagen. Typecheck, statische productiebuild, publieke Python-validatie en integriteitsvingerafdrukken zijn geslaagd. Bestaande testverwachtingen zijn niet gewijzigd. De module is ook vanuit de gebouwde site-uitvoer geïmporteerd/getoetst; er is geen nieuwe gebruikersinterface om visueel te beoordelen.

De werkelijke bron is nu gecontroleerd en het volledige lokale koppelrapport is gemaakt. Bronvolledigheid geldt uitsluitend voor de werkmapspiegel, niet voor alle historische relaties tussen selectielijsten. De module bewijst geen rechten, inhoudelijke gelijkwaardigheid of toepasselijkheid. Publieke distributie van de concordansdata en de vergelijkingsinterface blijven afzonderlijke vervolgstappen.


## Gerichte afwijkingsregistratie 10A

`src/concordans/afwijkingen.ts` bewaart vijftien afzonderlijke technische onderzoeksregistraties (vijf A, tien B), geen inhoudelijke goedkeuringen. `controle.beoordelingVoor(bronrijIdOfInterpretatieId)` geeft de registratie met kandidaten, onderbouwing en wijziging terug; onbekende IDs geven null. De registratie staat ook in `controle.rijen[].beoordeling`. B-kandidaten activeren geen recordkoppeling.

Alle bestaande 605 historische koppelingen en zeven onopgeloste interpretaties blijven behouden. Alleen de rijgerichte doelkoppeling 716 krijgt `technisch_gecorrigeerd` naar `2020:19.2.1`. Het veld `code` blijft letterlijk `19.21.1`; broncellen, `doel2020.codes` en code-inventaris veranderen niet. Er wordt geen historische relatie voor deze nieuwe-2020-rij gemaakt. De correctie vereist passende nieuwe-2020-context, de oorspronkelijke doelcode, een exacte omschrijving/resultaatnaam en een uniek overeenkomend officieel record. Gewijzigde context blokkeert en vraagt herbeoordeling.

Deze beperkte, onder versiebeheer bewaarde registratie gaat bij een herimport niet verloren. Bronhash en context moeten bij een nieuwe bronversie opnieuw worden gecontroleerd; er bestaat geen algemene typo- of buurcelcorrectie. Zie de [afwijkingenbeoordeling](concordans-afwijkingen-beoordeling.md) voor alle vijftien gevallen, de primaire bronpagina's en de afzonderlijke uitkomsten.
