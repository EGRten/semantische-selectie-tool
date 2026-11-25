# Validatie vervolgcontrole

- Basiscommit: `3c2210c48b672dbb0915ca47f1259384ae0b3d07` (`main`, inclusief PR #48).
- Alle drie geregistreerde PDF-identiteiten zijn met SHA-256 opnieuw bevestigd; de correcties betreffen uitsluitend bronvensters uit de officiële PDF 2020 en reeds visueel gecontroleerde woordvormen uit PR #48.
- Zestien primaire JSON-waarden en zestien door de bestaande generator afgeleide publieke notitieteksten zijn volledig geregistreerd. Er zijn geen andere primaire recordvelden gewijzigd. De ruwe PDF-extractie is niet aangepast.
- `scripts/valideer-vervolgcontrole.py`: geslaagd; alle 346 2020-records, codes, ID's, waarderingen, termijnen en voorwaarden behouden. Alle concordanscellen, semantische relaties en officiële zoektermen blijven byte-identiek aan de basiscommit.
- `npm run typecheck`, `npm run build`, `scripts/valideer_publicatie.py`, `scripts/reproduce.py` en `scripts/genereer-publicaties.mjs --check`: geslaagd; de 15 dataset-CSV's en vier publieke projecties zijn reproduceerbaar.
- `npm run test:unit`: 183 tests, 165 geslaagd, 0 mislukt, 18 bestaande skips wegens ontbrekende oorspronkelijke technische concordans-JSON.
- Twee uitvoeringen van het vervolgscript: zes controle-/correctieregisters byte-identiek; hashes staan in `reproductie.json`.
- Gerichte Chromium-browserproeven: 14 bestaande gevallen en één nieuwe detailweergaveproef geslaagd. De volledige Chromium-suite is geslaagd: 157 tests, 0 mislukt, 0 overgeslagen, onder `/semantische-selectie-tool/`.

De registers dekken alle 4.991 oorspronkelijke meldingsregels via 2.180 gegroepeerde kandidaten. **2.156 groepen zijn nog niet inhoudelijk afgerond**; hun E-status is een open onderzoeksstatus, geen bevestiging dat hun tekst correct is. Er is geen integrale visuele beoordeling van alle PDF-passages geclaimd. Ruwe bronweergaven in de interface kunnen nog afbrekingen bevatten.
