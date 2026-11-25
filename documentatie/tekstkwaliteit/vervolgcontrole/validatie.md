# Validatie vervolgcontrole

- Basiscommit: `3c2210c48b672dbb0915ca47f1259384ae0b3d07` (`main`, inclusief PR #48).
- Alle drie geregistreerde PDF-identiteiten zijn met SHA-256 opnieuw bevestigd; de afbreekcorrecties betreffen bronvensters uit de officiële PDF 2020 en eerder visueel gecontroleerde woordvormen uit PR #48. De broneigen spatie is visueel gecontroleerd in de 2012-PDF, pagina 36.
- Twintig primaire JSON-waarden (zestien afbrekingen en vier waarden voor een broneigen leesweergave) en negentien door de bestaande generator afgeleide publieke waarden zijn volledig geregistreerd. Er zijn geen andere primaire recordvelden gewijzigd. De ruwe PDF-extractie is niet aangepast.
- `scripts/valideer-vervolgcontrole.py`: geslaagd; alle 346 2020-records en de 1996/2012-record-ID’s, codes, waarderingen, termijnen en voorwaarden behouden. Alle concordanscellen en semantische relaties blijven byte-identiek aan de basiscommit. Eén bestaande officiële 1996/2012-zoekterm volgt de gedocumenteerde leesweergave; de term-ID en doelkoppeling blijven gelijk.
- `npm run typecheck`, `npm run build`, `scripts/valideer_publicatie.py`, `scripts/reproduce.py` en `scripts/genereer-publicaties.mjs --check`: geslaagd; de 15 dataset-CSV's en vier publieke projecties zijn reproduceerbaar.
- `npm run test:unit`: 184 tests, 166 geslaagd, 0 mislukt, 18 bestaande skips wegens ontbrekende oorspronkelijke technische concordans-JSON.
- Twee uitvoeringen van het vervolgscript: zes controle-/correctieregisters byte-identiek; hashes staan in `reproductie.json`.
- Chromium: de volledige suite vóór de aanvullende 1996/2012-leesweergave had 157 geslaagde tests. Daarna slaagden negen gerichte browsergevallen onder `/semantische-selectie-tool/`, waaronder beide nieuwe detailproeven, de drie lijsttabellen en Excel-downloads.

De registers dekken alle 4.991 oorspronkelijke meldingsregels via 2.180 gegroepeerde kandidaten. **2.156 groepen zijn nog niet inhoudelijk afgerond**; hun E-status is een open onderzoeksstatus, geen bevestiging dat hun tekst correct is. Er is geen integrale visuele beoordeling van alle PDF-passages geclaimd. Ruwe bronweergaven in de interface kunnen nog afbrekingen bevatten.
