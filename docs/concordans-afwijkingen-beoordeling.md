# Concordansafwijkingen — gerichte controle 10A

## Uitgangspunt en broncontrole

Uitgangscommit `16a83a9` bevat de samengevoegde PR #10. Onderzocht zijn precies de zeven onopgeloste relatie-interpretaties, zeven historische tekstafwijkingen en afzonderlijk rij 716: vijftien gevallen. Geen fictieve gegevens zijn gebruikt voor deze conclusies.

De oorspronkelijke werkmap heeft opnieuw exact SHA-256 `7dfda792ce61c1a6fa28c5c116155a429560153178c6c58987eabbbe6cdf708c`. De rij-JSON heeft SHA-256 `b01cff07c7bfeeb6f562d467373615f5a18cfc7ab9777f11fcd5cb1ed7de73dd`. Alle 7.876 oorspronkelijke en 7.876 uitgevouwen cellen zijn weer tegen Excel gecontroleerd. Per geval zijn de echte samengevoegde bereiken onderzocht; lege, niet-samengevoegde cellen zijn niet doorgevuld.

Vergelijking vond plaats met de bestaande selectiegegevens, structuur, rubriekcontext en aanvullende bronverwijzingen. De lokaal aangeleverde oorspronkelijke 1996-PDF (`4e19bd25d108881ba8f72d5744e3179bf2dee5354e6d4101acc6c07f40a0de22`) en 2020-PDF (`0174fda6020ebee109d2f5da5731078196fd46970c2d8aa5e9e452f1d21e073c`) zijn aanvullend geraadpleegd op de hieronder genoemde bronpagina's. Er is niets extern gedownload en geen PDF of werkmap gepubliceerd.

A betekent technisch eenduidig, B plausibele kandidaat met inhoudelijke beoordeling nodig, C niet oplosbaar met beschikbare gegevens. Dit zijn technische onderzoeksconclusies, geen onafhankelijk menselijk afgetekende inhoudelijke beoordelingen. De oorspronkelijke concordans, technische registratie en eventuele latere inhoudelijke beoordeling blijven gescheiden.

## Overzicht vóór en na

| Maat | Vóór | Na |
| --- | ---: | ---: |
| Historische relatie-interpretaties | 612 | 612 |
| Volledig technisch gekoppeld | 605 | 605 |
| Minstens één onopgelost eindpunt | 7 | 7 |
| Unieke gekoppelde historische recordparen | 604 | 604 |
| Rechtstreeks gekoppelde 2020-verwijzingen over alle rijen | 623 | 623 |
| Afzonderlijk technisch gecorrigeerde 2020-verwijzingen | 0 | 1 |
| Onopgeloste 2020-verwijzingen over alle rijen | 2 | 1 |

Alle bestaande 605 gekoppelde interpretaties behouden exact dezelfde relatie-ID en bron-/doelrecord-ID. Een regressiecontrole vergelijkt de volledige gesorteerde parenlijst via SHA-256 `9ad6e66acaf581f538320b0f2b11763ac8fef09534ea42ab56939b0c076fd9a2` met de oorspronkelijke controle. De correctie in rij 716 is geen extra historische relatie en verhoogt dus niet het aantal 605.

Van de vijftien gevallen zijn er **vijf A, tien B en nul C**. De tien B-gevallen zijn de zeven onopgeloste historische interpretaties plus de drie scope-tekstvarianten in rijen 50–52. Voor vier A-tekstgevallen is alleen de bestaande technische koppeling bevestigd; uitsluitend bij rij 716 is een nieuwe technische correctie geactiveerd. Alle overige onzekerheden van de oorspronkelijke concordans, waaronder de aparte 2017-kandidaten, vallen buiten deze gerichte vijftiengevallencontrole en zijn niet stilzwijgend opgelost. `metOnzekerheden()` blijft dertien historische interpretaties markeren; dat is een andere maat dan tien afzonderlijke B-gevallen.

## Zeven onopgeloste relatie-interpretaties

### concordans:rij:6 — B

Oorspronkelijk zijn A:D leeg; na werkelijk samenvoegen is alleen A gevuld met ‘1. Aanwijzing van gemeentelijke vertegenwoordigers in commissies e.d.’. Het enige bereik is **A4:A7**; B:D van rij 6 zijn niet samengevoegd. E:I noemt ‘Status toekennen’, `9.1.1`, ‘Toegekend’, ‘Tijdelijke status’, ‘Vernietigen 1 jaar na einde status’.

Het doel `2020:9.1.1` is geldig (2020, PDF p.32). In rubriek 2.1 zijn `1996-2012:2.1::002` (lidmaatschappen van niet-bestuurlijke commissies, 1 jaar na de benoemings-/aanwijzingstermijn) en `::001` (vertegenwoordigers/bestuurlijke commissies, B) onderzocht; bron p.18. Het eerdere rij-5-record `::002` is plausibel, maar alleen nabijheid en de term tijdelijke status sluiten de andere rol niet uit. Statuten (`::003`) verklaart de statusverlening niet en is niet als actieve kandidaat toegevoegd.

**Wijziging:** geen binding; kandidaten geregistreerd. De rubriekcontext wordt niet tot een specifiek voorschrift verheven. Onzeker blijft welke historische rol de bron bedoelt.

### concordans:rij:21 — B

De historische C-cel bevat ‘Bescheiden betreffende/voortvloeiende uit deelneming in, respectievelijk advisering aan besturen, commissies en andere organen waarvan het secretariaat en het archief elders worden beheerd’; D is ‘3 jaar’. De directe aanvullende rijreferentie koppelt dit eenduidig aan `1996-2012:2.3::003` (p.19). Bereiken: **A19:A23, B21:B23, C21:C23, D21:D23, E21:E22**.

F21 is letterlijk `19.1.`, G ‘Verwerkt’, H leeg, I ‘Vernietigen na 5 jaar’. `2020:19.1` (generiek Verwerkt, 5 jaar, p.37) is een sterke kandidaat. Ook specifieke resultaten zoals `2020:19.1.11` (agenda/verslag van ambtelijk overleg met derden, 5 jaar) laten zien dat termijn en algemene resultaatnaam geen ontbrekend cijfer bewijzen. Rij 22 noemt bovendien expliciet `19.1.12`, maar dat legitimeert geen ontbrekende code in rij 21.

**Wijziging:** geen verwijdering van de afsluitende punt en geen automatische doelbinding. Het is niet bewezen of de punt interpunctie of een afgebroken specifieke code is. Kandidaat 19.1 heeft voorrang voor beoordeling, geen vastgestelde status.

### concordans:rij:89 — B

C89 luidt ‘Beveiliging (als toestemming gebruik)’, B/D zijn leeg; F:I noemt `11.1`, ‘Verleend’, lege omschrijving en ‘1 jaar na einde toestemming’. Alleen **A87:A91** is samengevoegd. Doel `2020:11.1` bestaat (p.33); de officiële termijn is 1 jaar en de procestermijn/context bepaalt het aanvangsmoment.

De officiële rubriek 2.12 (p.23) onderscheidt `1996-2012:2.12::001`, archiefbescheiden die voor bewaring in aanmerking komen (B), en `::002`, overige gevallen (1 jaar na vervallen bedrijfsvoeringsbelang). De beveiligingsvorm bepaalt niet welk van beide bronvoorschriften geldt. Rij 88 en 91 geven deze alternatieven aan, maar omvatten geen B:D-merge over rij 89.

**Wijziging:** beide kandidaten zichtbaar, geen binding of automatische uitbreiding over rubriek 2.12. Het historische bewaarkarakter is onbekend.

### concordans:rij:90 — B

C90 ‘Beveiliging (als plan)’, B/D leeg. F:I vermeldt `3.1`, ‘Vastgesteld’, lege specifieke omschrijving en ‘10 jaar na einde duur’. Alleen **A87:A91** omvat deze rij. Het doel `2020:3.1` bestaat (p.27); de huidige officiële gegevens vermelden 5 jaar, niet de concordanstekst ‘10 jaar’. Beide teksten blijven behouden; de concordans vervangt de officiële termijn niet.

Onderzocht zijn dezelfde twee voorschriften `1996-2012:2.12::001` en `::002` (p.23). Het woord plan sluit de verschillende soorten archiefbescheiden niet uit. De nieuwe termijn in de concordans bewijst geen oude waardering.

**Wijziging:** geen binding; twee kandidaten en het termijnverschil expliciet genoteerd. Een hoger structuurniveau gebruiken om de teller ‘opgelost’ te verhogen zou de ontbrekende voorschriftkeuze verbergen.

### concordans:rij:293 — B

B:D zijn oorspronkelijk én uitgevouwen leeg. **A289:A293** geeft ‘4. Bestuur’; **E290:E293** geeft ‘Status toekennen’. F:I noemt `9.3.3`, ‘Beëindigd’, ‘Delegatie en mandatering’, ‘Bewaren’. Het doel bestaat (2020 p.33).

Historische kandidaten in rubriek 3.5.4 (p.39) zijn `::001` ‘tussen bestuurders onderling’ (B), `::002` ‘van bestuurders naar ambtenaren’ (30 jaar na vervallen besluit) en `::003` ‘tussen ambtenaren’ (20 jaar na vervallen besluit). Rijen 290–292 verwijzen naar deze onderscheiden categorieën; geen B:D-bereik koppelt rij 293 aan slechts de laatste.

**Wijziging:** alle drie kandidaten geregistreerd, geen doorvulling vanaf rij 292. De actorrelatie blijft inhoudelijk te beoordelen.

### concordans:rij:434 — B

B:D blijven leeg. **A432:A434** geeft ‘3. Nationaliteit’; **E433:E434** geeft ‘Aangiften behandelen’. F:I noemt `7.1.23`, ‘Verwerkt’, ‘Optieverklaring Nederlanderschap’, ‘Vernietigen na 12 jaar’; J ‘nieuw in 2020’. Het doel bestaat (p.30).

Onderzocht zijn `1996-2012:3.7.3::002`, naturalisatieprocedure, en `::001`, onderzoek naar de nationaliteit (p.50); beide hebben ‘12 jaar na bekendmaking’. Rij 433 noemt de naturalisatieprocedure, maar C433:D433 zijn niet samengevoegd met rij 434. Optie en naturalisatie worden niet zonder inhoudelijke beoordeling gelijkgesteld. J zegt iets over 2017, niet dat er geen mogelijke 1996-context is.

**Wijziging:** geen binding, beide kandidaten bewaard. Gelijke termijnen en nabijheid zijn niet beslissend.

### concordans:rij:442 — B

B:D zijn leeg; alleen **A440:A443** geeft ‘6. Rijbewijzen’. F:I noemt `7.1.24`, ‘Verwerkt’, ‘Fraude melding rijbewijs’, ‘Vernietigen na 1 jaar na verallen geldigheid rijbewijs’. De bronspelling ‘verallen’ blijft behouden. Het doel bestaat (p.30).

Kandidaten zijn `1996-2012:3.7.6::001`, ‘Aanvraag en afgifte (inclusief vernieuwing)’ (11 jaar), en `::002`, ‘Ongeldig verklaring door burgemeester en inneming’ (1 jaar), p.52. Fraude kan verschillende procedurestappen betreffen. De éénjaarstermijn wijst niet zelfstandig op `::002`; de bron legt dat niet vast.

**Wijziging:** geen binding; beide kandidaten geregistreerd. Noch rij 440 doorvullen, noch rij 443 terugprojecteren is brongetrouw aangetoond.

## Zeven historische tekstafwijkingen

### concordans:rij:50 — B

C50: ‘Door de gemeente verstrekte statistische opgaven voor zover zij niet van belang zijn’; D ‘3 jaar’; F `20.1`. Officieel `1996-2012:2.8::001` (p.21): ‘Door **en aan** de gemeente verstrekte statistische opgaven voor zover zij niet van belang zijn’, eveneens 3 jaar. De aanvullende datasetbron verwijst rechtstreeks naar rij 50. Bereiken **A50:A55, B50:B52, C50:C52, D50:D52** bevestigen de rijcontext.

**Classificatie:** tekstvariant met mogelijk inhoudelijk bereikverschil, geen bewezen onschuldige afkorting. **Wijziging:** de technische recordidentiteit en bestaande koppeling blijven behouden; de afwijking krijgt B, niet een geharmoniseerde bronwaarde. Of ontvangen opgaven bewust zijn weggelaten blijft onbekend.

### concordans:rij:51 — B

C51 is oorspronkelijk leeg, maar valt werkelijk onder **C50:C52**; de uitgevouwen tekst is dus dezelfde ‘Door de gemeente…’. B/D vallen onder dezelfde bereiken; F51 `19.2` is zelfstandig. Via de exact gelijke uitgevouwen A:D-cellen is het record opnieuw `1996-2012:2.8::001` (p.21).

**Classificatie:** dezelfde mogelijk betekenisvolle omissie ‘en aan’, geen nieuwe afzonderlijke transcriptiefout in C51. **Wijziging:** bestaande technische koppeling blijft intact; B en dezelfde kandidatenrecord-ID zijn zichtbaar. Er is geen tekst in de lege oorspronkelijke C51 geschreven.

### concordans:rij:52 — B

C52 is oorspronkelijk leeg en krijgt dezelfde tekst uit **C50:C52**; F52 is `20.1.4`, H ‘Gegevens over woningstatistiek’. De technische koppeling aan `1996-2012:2.8::001` volgt opnieuw exact uit de echte A:D-mergecontext.

**Classificatie:** dezelfde scope-tekstvariant, nu bij een andere expliciete 2020-verwijzing. **Wijziging:** geen recordwissel of tekstcorrectie; B blijft aan deze eigen bronrij gekoppeld, zonder de bronverklaringen van rijen 50 en 51 weg te dedupliceren.

### concordans:rij:218 — A

A218 ‘4. Salarisadministratie’, C218 leeg, D218 ‘7 jaar’, F218 `19.1.1`; er zijn geen samengevoegde cellen in deze rij. Officieel record `1996-2012:3.2.4::001` heet ‘Salarisadministratie’, termijn 7 jaar, bron p.33. De primaire PDF toont de benaming als rubriekregel; de dataset verwijst aanvullend direct naar rij 218.

**Classificatie:** lege bronwaarde door plaatsing van de benaming in kolom A, geen aangetoonde verloren selectieomschrijving. **Wijziging:** bestaande technische koppeling bevestigd, geen vulling van C218. A geldt uitsluitend voor de technische identiteit.

### concordans:rij:262 — A

A262 ‘3. Verkoop’, C262 leeg, D262 ‘7 jaar’, F262 `16.1.1`; geen merges. Officieel `1996-2012:3.4.3::001` heeft benaming ‘Verkoop’ en termijn 7 jaar (p.36), met directe aanvullende referentie naar rij 262.

**Classificatie:** lege C-bronwaarde met benaming in A. **Wijziging:** bestaande technische koppeling bevestigd; geen officiële tekst of lege concordanscel aangepast. Een beoordeling van het toepassingsbereik van de moderne inkoopverwijzing valt niet onder deze technische identiteit.

### concordans:rij:380 — A

De concordansverklaring in C380 bevat extra de expliciete redactionele tekst **‘[in deze concordans genummerd als p t/m w]’** na ‘onderdelen a tot en met h’. Die toevoeging staat niet in de officiële verklaring van `1996-2012:3.6.2::024` (p.44–45). B380 bevat de concordanssubletter `x.`, D ‘B’, F `19.1.4`. Merges: **A346:A395, E380:E381**; C380 is geen doorgevulde buurcel.

**Classificatie:** verklaarde concordansinterne hernummering, geen nieuwe officiële code. De overige verklaring en B-waardering ondersteunen samen met de directe rijreferentie hetzelfde technische record. **Wijziging:** koppeling bevestigd; subletter wordt niet vertaald naar een officiële suffixcode en de toevoeging wordt niet in officiële gegevens geschreven. Geen juridische betekenis aan de concordanssubletters toegekend.

### concordans:rij:469 — A

C469 ‘Begraaf- en crematieregisters (inclusief **verzicht** van geruimde graven)’, D ‘B’. Officieel `1996-2012:3.8.5::004` vermeldt ‘inclusief **overzicht** van geruimde graven’, eveneens B, p.55; dit is ook in de oorspronkelijke PDF leesbaar. F469 bevat na samenvoegen de tekst uit **E469:I469** ‘Te bewaren register zoals vermeld in bijlage 4 van de selectielijst’. Verder geeft **A466:A474** de rubriekcontext.

**Classificatie:** letterlijke tekstvariant met mogelijke letteromissie; de oorzaak of maker daarvan is niet vastgesteld. Unieke titel, B en directe rijreferentie onderbouwen de technische identiteit. **Wijziging:** bestaande koppeling bevestigd, beide schrijfwijzen blijven intact. Er wordt geen resultaatcode uit ‘bijlage 4’ verzonnen; deze bronrij heeft ook na de beoordeling geen extra genormaliseerde resultaatrelatie.

## concordans:rij:716 — A, één actieve technische correctie

Oorspronkelijk F716 `19.21.1`, G ‘Niet verwerkt’, H ‘Scans kentekens’, I ‘Direct vernietigen (1 dag)’, J ‘Nieuw in 2020’. **A706:D718** luidt ‘Nieuw in Selectielijst 2020’; **E713:E718** geeft de procescontext. De originele code bestaat niet in de officiële 2020-dataset.

Het bestaande afwijkingenregister noemt `19.2.1` als voorstel met status `inhoudelijk_brongetoetst_op_omschrijving_Scans_kentekens`. Deze technische controle gaat niet uitsluitend op die status af: in de primaire 2020-PDF p.38 staan bij `19.2.1` letterlijk ‘Scans kentekens’, resultaat ‘Niet verwerkt’, Nihil en ‘direct’. De combinatie van resultaat en omschrijving is uniek in de dataset. De nabije `19.1.22` gaat over scans waarbij een boete is opgelegd en heeft een andere officiële termijn en resultaatkolom; deze is dus geen alternatief voor de bedoelde technische recordverwijzing.

**Wijziging:** alleen de afzonderlijke rijgerichte doelkoppeling krijgt `status: technisch_gecorrigeerd` en `record_id: 2020:19.2.1`. `code` blijft de bronwaarde `19.21.1`; de oorspronkelijke arrays en code-inventaris blijven ongewijzigd. De formulering ‘1 dag’ wordt niet gelijkgesteld aan of geschreven in de officiële termijn ‘direct’. Er wordt **geen historische relatie** aangemaakt.

De correctie vereist de exacte oorspronkelijke F/G/H-context, de nieuwe-2020-markering en precies één officieel record met de verwachte omschrijving/resultaatnaam. Bij veranderde of tegenstrijdige context blokkeert de verwerking en is herbeoordeling nodig. Het is een geregistreerde technische verwijzingscorrectie, geen officiële rectificatie, toestemming tot publicatie of menselijke inhoudelijke goedkeuring.

## Persistente registratie en API

`src/concordans/afwijkingen.ts` bewaart alle vijftien onderzoeksconclusies met bronrij-ID, A/B/C, kandidaten, reden en wijziging onder versiebeheer, los van broncellen en inhoudelijke beoordelingen. De bronadapter neemt deze registratie opnieuw mee bij iedere import van de onderzochte bron. Registraties worden uitsluitend aan een rij gekoppeld wanneer de verwachte doelbronwaarde overeenkomt; de actieve correctie 716 heeft de aanvullende strikte controles hierboven. Een nieuwe bronversie vereist opnieuw controle van bronhash en context, geen blind overnemen van oude oordelen.

Een toekomstige interface kan `controle.beoordelingVoor(bronrijIdOfInterpretatieId)` gebruiken, of `controle.rijen[].beoordeling` lezen. Onbekende IDs geven null; dat betekent niet ‘goedgekeurd’. B-kandidaten worden nooit als vastgestelde eindpunten opgenomen. De bestaande genormaliseerde inhoudelijke beoordelingen blijven leeg. Een rubriek is niet automatisch aan alle voorschriften toegekend.

Het bijgewerkte volledige rapport per bronrij en relatie staat lokaal in `/tmp/concordans-10a/koppelingen.json`, met samenvatting en afzonderlijke oorspronkelijke broncontrole. Het veld `afwijkingen_10a` bevat voor ieder van de vijftien gevallen tevens de volledige oorspronkelijke bronrij en de ongewijzigde officiële kandidaatrecords, zodat de letterlijke celvergelijking lokaal volledig controleerbaar blijft. De volledige afgeleide tabel en bronbestanden blijven buiten de openbare commit. Alleen de beperkte technische onderzoeksregistratie en deze gevraagde uitzonderingsrapportage worden toegevoegd; geen volledige concordans wordt heruitgegeven.

## Validatie en reproduceerbaarheid

```sh
npm run build
python scripts/controleer-concordansbron.py \
  --excel '/pad/Concordans Selectielijst 1996-2020(1).xlsx' \
  --json /pad/concordans.json --output /tmp/concordans-10a/broncontrole.json
node scripts/onderzoek-concordans.mjs --bron /pad/concordans.json --output /tmp/concordans-10a
CONCORDANS_BRON_JSON=/pad/concordans.json CHROMIUM_PATH=/usr/bin/chromium npm test
python scripts/valideer_publicatie.py
```

Gerichte echte-brontests controleren alle vijftien gevallen, de B-kandidaten, ongewijzigde broncellen, de afgeschermde correctie 716 en de volledige oorspronkelijke 605-parenvingerafdruk. Ze gelden alleen als echte-brontests wanneer de genoemde omgevingsvariabele is gezet; in deze uitvoering zijn ze daadwerkelijk uitgevoerd. Bestaande testverwachtingen zijn niet veranderd. Er zijn geen nieuwe dependencies, zoekfuncties, interfacewijzigingen of Pages-activering.

Eindresultaat: **122 moduletests en 55 bestaande Chromium-browsertests geslaagd**, zonder overgeslagen echte-brontests. Typecheck, productiebuild en Python-publicatievalidatie/integriteitsvingerafdrukken zijn geslaagd. Het uitgebreide rapport is twee keer byte-identiek gereproduceerd. Een Git-diff bevestigt behoud van officiële datasets, bronregistraties, zoekmodules en interface.
