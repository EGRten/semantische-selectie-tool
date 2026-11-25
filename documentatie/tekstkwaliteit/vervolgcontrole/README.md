# Vervolgcontrole van het register uit PR #48

Deze controle vertrekt van `main`-commit `3c2210c48b672dbb0915ca47f1259384ae0b3d07`. De invoer is het ongewijzigde `documentatie/tekstkwaliteit/tekstkwaliteit-onzekerheden.csv` uit PR #48. De drie eerder vastgelegde PDF's blijven de bron; het script vergelijkt hun SHA-256 met `bronnen/semantische-selectie-tool-bronset-2026-11-25.json`.

De CSV's groeperen herhaalde meldingen op soort, letterlijke tekenreeks, bron-ID en PDF-pagina. `bronverwijzingen` noemt alle onderliggende JSON-pointers. Een groep is een technisch onderzoekspunt, geen inhoudelijk besluit. De letterlijke context en status staan per groep in de registers. De classificatie E blijft expliciet open: spelling, volledige zinscontext en visuele PDF-uitsnede zijn daarvoor nog niet per groep vastgesteld. De woordenboekkolom zegt daarom `geen zelfstandig bewijs`; er is geen geschikte Nederlandse woordenlijst in de uitvoeromgeving gevonden en er wordt geen woordenboekuitkomst verzonnen.

Zestien wijzigingen aan `datasets/2020/selectiegegevens.json` zijn A: dezelfde splitsingen waren voor deze woordvormen al visueel vastgelegd in de PDF-bewijsbladen uit PR #48. Deze vervolgrun eist daarnaast de letterlijke splitsing in het PDF-bronvenster van het betrokken record. **Zestien** gewijzigde 2020-waarden zijn in `uitgevoerde-correcties.csv` vastgelegd. `mutaties.json` registreert daarnaast de zestien rechtstreeks afgeleide tekstwijzigingen in `publicatie/2020.json`, zodat eerdere bewijscontroles alleen de nieuwe laag kunnen terugdraaien. Ruwe extracties en oude bronrijen zijn onaangeroerd.

De visuele bronuitsneden `btw-bron-pagina-6.png` en `leasen-huur-bron-pagina-36.png` onderbouwen twee concrete behoudbesluiten. De bron-eigen spatiefout `leasen,huur` heeft een afzonderlijk geregistreerde leesweergavecorrectie; de letterlijke PDF-waarde blijft intact. Drie groepen met `BTW-compensatiefonds` zijn C en blijven behouden. Twee groepen met `leasen,huur` zijn D: de officiële PDF toont daar zelf geen spatie na de komma. Het register schrijft deze formulering niet redactioneel om. De overige 2.156 unieke groepen blijven E; dat aantal is geen aantal bewezen fouten. Andere bron-eigen spatiefouten kunnen nog tussen E staan. Zie `samenvatting.md` voor de precieze grens van deze controle.

Reproductie op een afzonderlijke checkout van de basiscommit, met Node 24, de bestaande npm-afhankelijkheden en Python-dependencies uit `requirements.txt`:

```sh
npm ci
python scripts/vervolgcontrole-tekstkwaliteit.py --bronmap /pad/naar/de/drie/PDFs --apply
npm run typecheck
npm run build
python scripts/vervolgcontrole-tekstkwaliteit.py --bronmap /pad/naar/de/drie/PDFs
python scripts/valideer-vervolgcontrole.py
python scripts/valideer_publicatie.py
python scripts/reproduce.py --output /tmp/vervolg-csv
node scripts/genereer-publicaties.mjs --check
npm run test:unit
```

De scriptuitvoer is deterministisch vanaf de vastgelegde basiscommit. De `--apply`-stand schrijft de 2020-JSON met de zestien afbreekcorrecties en de 1996/2012-leesweergavecorrectie, de bijbehorende CSV’s en de bestaande manifest-/integriteitshashes. De scripts van PR #48 en de bevroren registraties zijn niet gewijzigd. De actuele manifesthashes en inhoudelijke hash worden opnieuw berekend na de CSV-generatie. Er is geen nieuwe zoeklogica, relatie of Pages-deployment.
