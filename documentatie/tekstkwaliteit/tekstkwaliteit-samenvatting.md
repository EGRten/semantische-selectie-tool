# Samenvatting tekstkwaliteit

De drie aangewezen PDF-hashes zijn bevestigd. Alle 119 oorspronkelijke JSON-bestanden zijn geïnventariseerd; 82.376 tekstwaarden zijn mechanisch gecontroleerd. De controle wijzigt uitsluitend bewezen regelafbrekingen, met visueel PDF-bewijs en controle per bronvenster. Een algemene taalcertificering is hiermee niet afgegeven.

| Lijst | Primaire tekstwaarden | Officiële zoektermwaarden | Publieke stringwaarden | Afgeleide notitiearrays |
| --- | ---: | ---: | ---: | ---: |
| 1996/2012 | 0 | 0 | 0 | 0 |
| 2017 | 5 | 4 | 3 | 0 |
| 2020 | 133 | 100 | 114 | 12 |
| Totaal | 138 | 104 | 117 | 12 |

Er zijn 359 gewijzigde stringwaarden en 12 geregistreerde afgeleide arraywijzigingen. De 36 dehyphenatieregels voor 2020 herstellen 190 voorkomens in primaire tekstrepresentaties. De BRP-spatiecorrectie met behoud van koppelteken herstelt vijf primaire voorkomens per lijst (2017/2020). Inclusief rechtstreeks afgeleide officiële zoektermen zijn dit 304 vervangingsvoorkomens. Deze telling bevat herhaalde representaties van dezelfde PDF-tekst en is geen aantal unieke voorschriften.

Voorbeelden:

- `Niet doorge- gaan` → `Niet doorgegaan` (2020, 1.4, PDF-pagina 26).
- `Gehandicaptenpar-\nkeerkaart` → `Gehandicaptenparkeerkaart` (2020, 8.1.14, pagina 31).
- `verant-\nwoordingsplicht` → `verantwoordingsplicht` (2020, 8.1.8, pagina 31).
- `BRP-\ngegevens` → `BRP-gegevens` (2017, pagina 33; 2020, pagina 32).

De volledige beginscan vindt 11.915 vermoedelijke woordafbrekingspatronen, 23.762 spatiesignalen (meervoudige/randspaties, spaties bij leestekens, Unicode-spaties), 153.126 regeleinden, 4.348 soft hyphens en 444 herhaalde-woordpatronen. Daarnaast zijn 6.554 koppeltekens binnen woorden gesignaleerd en behouden voor beoordeling. Dit omvat gegenereerde/historische duplicaten en betekenisvolle structuren; **het zijn geen vastgestelde foutaantallen**. Er is geen generieke spatie- of alineanormalisatie uitgevoerd.

Vier bronlocaties met twee mogelijke bron-eigen taalproblemen (`voorvoor`, `verstekken`) zijn als C geregistreerd en niet gewijzigd. Er blijven 4.991 onbesliste signaalgroepen in 1513 velden voor beoordeling. Tot de onzekere gevallen behoren mogelijke kolomverstrengeling, betekenisvolle woordspaties en soft hyphens. Het volledige bevindingenregister bevat daarnaast ook legitieme en historische signalen; ruwe bronweergaven kunnen afbrekingen behouden.

Zoeken, details, boom, publieke tabellen en exports gebruiken de gecorrigeerde primaire tekst. Alle selectiecodes, technische ID's, waarderingen, bewaartermijnen, procestermijnen, toepassingsvoorwaarden en semantische/historische relatie-identiteiten blijven ongewijzigd. Alle 716 concordansrijen en 7.876 oorspronkelijke cellen blijven exact behouden; alleen 49 afgeleide verwijzingslabels volgen hun bestaande doelrecord. De bestaande generator verwijdert twaalf overbodig geworden benoemingsnotities zonder informatieverlies.

Typecheck, build, schema-/integriteitscontrole, CSV-/projectiereproductie, 164 unit-/integratietests en 156 Chromium-browsertests zijn geslaagd. Achttien bestaande tests met een niet meegeleverde oorspronkelijke technische concordansbron zijn overgeslagen. Firefox/WebKit konden lokaal niet starten; hun tests worden niet als geslaagd gepresenteerd. Zie de validatie voor details.
