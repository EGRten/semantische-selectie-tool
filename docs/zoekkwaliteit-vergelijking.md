# Zoekkwaliteit — reproduceerbare A/B/C/D-vergelijking

Uitgangsversie: `22eb7af`. Reproduceer: `npm run build` en `npm run onderzoek:zoekkwaliteit`. Alle 164 volledige vragen, oorspronkelijke relevante en alternatieve IDs en onzekerheden zijn ongewijzigd. De afzonderlijke beoordelingsset van 45 vragen telt niet mee. Vervallen resultaten staan voor alle varianten uit.

## Varianten en eerlijke attributie

A gebruikt de byte-identiek bewaarde oorspronkelijke klassieke module en normalisatie. B gebruikt uitsluitend verbeterde tekstmatching. C combineert exact dezelfde B-basis met standaard toegelaten lexiconrelaties. D is C met expliciet ingeschakelde onbevestigde voorstellen. C-zonder-beoordeelde-AI is een gevoeligheidscontrole: dezelfde C, maar zonder de 25 AI-zoekrichtingen met plausibiliteitsstatus. Geen enkele variant wijzigt brongegevens of relaties.

A→B is het effect van tekstverwerking. B→C is het aanvullende effect van lexiconverrijking. C→D is het effect van de opt-in. De historische vergelijking vermengde deze effecten.

## Beperkingen van relevantie en maten

Alle oorspronkelijke vragen hebben niet-uitputtende brongetoetste vindbaarheidsverwachtingen, geen onafhankelijk en volledig positief/negatief relevantieoordeel. Precision@5, Recall@5, Recall@10 en MRR worden daarom niet als kwaliteitscijfers berekend. Een gevonden vooraf genoemd ID of een voorschrift onder die categorie telt uitsluitend als bekende verwachting, niet als bewijs van toepasselijkheid. Exact-ID-posities worden daarnaast apart in het JSON-rapport bewaard. Een niet genoemde treffer is niet automatisch irrelevant.

Eerste positie is 1-gebaseerd en over alle resultaten gemeten. Gemiddelde eerste positie wordt alleen over vragen mét bekende treffer berekend; het aantal ontbrekende treffers staat ernaast. Resultaataantallen en diagnostische posities zijn geen zoekprecisie. Verbeteringen/verslechteringen zijn signalen voor beoordeling, geen onafhankelijke inhoudelijke scores.

| Lijst | Variant | Met bekende verwachting | Zonder | Gemiddeld resultaten per vraag | Gemiddelde eerste positie bij treffer |
| --- | --- | ---: | ---: | ---: | ---: |
| 1996-2012 | A | 8 | 47 | 0.16 | 1 |
| 1996-2012 | B | 28 | 27 | 1.2 | 1 |
| 1996-2012 | C | 35 | 20 | 1.8 | 1.06 |
| 1996-2012 | D | 35 | 20 | 1.84 | 1.06 |
| 1996-2012 | C_zonder_beoordeelde_AI | 31 | 24 | 1.67 | 1.03 |
| 2017 | A | 0 | 54 | 0 | — |
| 2017 | B | 27 | 27 | 1.54 | 1.04 |
| 2017 | C | 31 | 23 | 2.89 | 1.68 |
| 2017 | D | 33 | 21 | 3.22 | 1.79 |
| 2017 | C_zonder_beoordeelde_AI | 31 | 23 | 2.87 | 1.68 |
| 2020 | A | 0 | 55 | 0 | — |
| 2020 | B | 28 | 27 | 1.69 | 1.04 |
| 2020 | C | 32 | 23 | 3.15 | 1.66 |
| 2020 | D | 34 | 21 | 3.6 | 1.82 |
| 2020 | C_zonder_beoordeelde_AI | 32 | 23 | 3.13 | 1.66 |

| Lijst | Vergelijking | Eerder/nieuw gevonden | Gelijk | Later/verdwenen |
| --- | --- | ---: | ---: | ---: |
| 1996-2012 | AB | 20 | 35 | 0 |
| 1996-2012 | BC | 7 | 48 | 0 |
| 1996-2012 | CD | 0 | 55 | 0 |
| 2017 | AB | 27 | 27 | 0 |
| 2017 | BC | 4 | 49 | 1 |
| 2017 | CD | 2 | 52 | 0 |
| 2020 | AB | 28 | 27 | 0 |
| 2020 | BC | 4 | 50 | 1 |
| 2020 | CD | 2 | 53 | 0 |

## Iedere vraag afzonderlijk

Elke cel A–D bevat `eerste bekende positie / totaal resultaten`; — betekent geen bekende treffer. Beter/gelijk/slechter vergelijkt die eerste positie met de voorgaande variant, niet alle relevante documenten. De [machineleesbare diagnose](zoekkwaliteit-diagnose.json) bevat ook de eerste vijf IDs, exacte ID-positie, AI-groepen en de C-zonder-beoordeelde-AI-controle voor iedere vraag.

| Vraag | Ongewijzigde zoekvraag | A | B | C | D | A→B | B→C | C→D |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1996-2012:test:001 | Waar bewaar ik de notulen van de gemeenteraad? | — / 0 | — / 0 | 1 / 1 | 1 / 3 | gelijk | beter | gelijk |
| 1996-2012:test:002 | Hoe lang bewaren we presentielijsten van vergaderingen? | — / 0 | 1 / 1 | 1 / 1 | 1 / 1 | beter | gelijk | gelijk |
| 1996-2012:test:003 | Wat doe ik met een gemeentegids? | — / 0 | 1 / 1 | 1 / 1 | 1 / 1 | beter | gelijk | gelijk |
| 1996-2012:test:004 | Moet de oude gemeentelijke website worden bewaard? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 1996-2012:test:005 | Hoe lang bewaar je een ingetrokken vergunningaanvraag? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 1996-2012:test:006 | Waar vallen niet-ontvankelijke aanvragen onder? | — / 0 | 1 / 1 | 1 / 1 | 1 / 1 | beter | gelijk | gelijk |
| 1996-2012:test:007 | Archiefinspectierapport: bewaren of vernietigen? | — / 0 | 1 / 1 | 1 / 1 | 1 / 1 | beter | gelijk | gelijk |
| 1996-2012:test:008 | Bestuurlijke boete dossier | — / 0 | 1 / 1 | 1 / 1 | 1 / 1 | beter | gelijk | gelijk |
| 1996-2012:test:009 | Documentair structuurplan / DSP | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 1996-2012:test:010 | Metadata van te bewaren dossiers | — / 0 | 1 / 2 | 1 / 3 | 1 / 3 | beter | gelijk | gelijk |
| 1996-2012:test:011 | Convenant met buurgemeenten | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 1996-2012:test:012 | Beleidsnotitie vastgesteld door college | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 1996-2012:test:013 | Subsidiedossier jaarlijkse subsidie | — / 0 | — / 0 | 1 / 1 | 1 / 1 | gelijk | beter | gelijk |
| 1996-2012:test:014 | Ontvangen ESF subsidie | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 1996-2012:test:015 | Bezwaarschrift tegen besluit | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 1996-2012:test:016 | Jaarverslag bezwaarschriftencommissie | 1 / 1 | 1 / 1 | 1 / 1 | 1 / 1 | gelijk | gelijk | gelijk |
| 1996-2012:test:017 | Voorbereiding gemeentebegroting | — / 0 | — / 0 | — / 1 | — / 1 | gelijk | gelijk | gelijk |
| 1996-2012:test:018 | SISA-tabellen jaarrekening | 1 / 1 | 1 / 1 | 1 / 1 | 1 / 1 | gelijk | gelijk | gelijk |
| 1996-2012:test:019 | Controlerapport jaarrekening | 1 / 1 | 1 / 1 | 1 / 1 | 1 / 1 | gelijk | gelijk | gelijk |
| 1996-2012:test:020 | WOZ / belastingaangifte | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 1996-2012:test:021 | Personeelsdossier medewerker | — / 0 | — / 0 | 1 / 1 | 1 / 1 | gelijk | beter | gelijk |
| 1996-2012:test:022 | Sollicitatiebrief niet aangenomen kandidaat | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 1996-2012:test:023 | Functiewaardering | 1 / 1 | 1 / 1 | 1 / 1 | 1 / 1 | gelijk | gelijk | gelijk |
| 1996-2012:test:024 | Loonadministratie / salarisadministratie | — / 0 | — / 0 | 1 / 2 | 1 / 2 | gelijk | beter | gelijk |
| 1996-2012:test:025 | RI&E arbobeleid | 1 / 1 | 1 / 1 | 1 / 2 | 1 / 2 | gelijk | gelijk | gelijk |
| 1996-2012:test:026 | Aankoop van gemeentelijke grond | — / 0 | 1 / 1 | 1 / 1 | 1 / 1 | beter | gelijk | gelijk |
| 1996-2012:test:027 | Notulen bouwvergadering monument | 1 / 2 | 1 / 2 | 1 / 3 | 1 / 3 | gelijk | gelijk | gelijk |
| 1996-2012:test:028 | Erfpachtakte / zakelijk recht | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 1996-2012:test:029 | Bruikleen kunstwerk aan museum | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 1996-2012:test:030 | BAG brondocument straatnaam | — / 0 | — / 0 | 2 / 8 | 2 / 8 | gelijk | beter | gelijk |
| 1996-2012:test:031 | Processen-verbaal verkiezingen N10 | — / 0 | 1 / 1 | 1 / 1 | 1 / 1 | beter | gelijk | gelijk |
| 1996-2012:test:032 | Mandaatbesluit bestuurder aan ambtenaar | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 1996-2012:test:033 | Bestemmingsplan met zienswijzen | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 1996-2012:test:034 | Bouwvergunning woning | — / 0 | — / 1 | 2 / 2 | 2 / 2 | gelijk | beter | gelijk |
| 1996-2012:test:035 | Sloopmelding | — / 0 | 1 / 2 | 1 / 2 | 1 / 2 | beter | gelijk | gelijk |
| 1996-2012:test:036 | Akten burgerlijke stand | 1 / 1 | 1 / 3 | 1 / 4 | 1 / 4 | gelijk | gelijk | gelijk |
| 1996-2012:test:037 | GBA persoonslijst / persoonsregister | — / 0 | — / 0 | 1 / 11 | 1 / 11 | gelijk | beter | gelijk |
| 1996-2012:test:038 | Naturalisatie / Nederlanderschap | 1 / 1 | 1 / 1 | 1 / 1 | 1 / 1 | gelijk | gelijk | gelijk |
| 1996-2012:test:039 | Paspoortaanvraag | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 1996-2012:test:040 | Rijbewijsaanvraag | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 1996-2012:test:041 | Waar vind ik stukken over het verstrekken van een subsidie? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 1996-2012:test:042 | Waar zoek ik een dossier over jeugdhulp? | — / 0 | 1 / 2 | 1 / 2 | 1 / 2 | beter | gelijk | gelijk |
| 1996-2012:test:043 | Waar zoek ik documenten over een geboorteaangifte? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 1996-2012:test:044 | Waar zoek ik het verwerken van overlijdensgegevens? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 1996-2012:test:045 | Waar vind ik stukken over een verkiezing? | — / 0 | 1 / 4 | 1 / 4 | 1 / 4 | beter | gelijk | gelijk |
| 1996-2012:test:046 | Waar vind ik stukken over een bestemmingsplan? | — / 0 | 1 / 9 | 1 / 9 | 1 / 9 | beter | gelijk | gelijk |
| 1996-2012:test:047 | Waar zoek ik een bodemonderzoek? | — / 0 | 1 / 2 | 1 / 2 | 1 / 2 | beter | gelijk | gelijk |
| 1996-2012:test:048 | Waar zoek ik stukken van een sollicitatieprocedure? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 1996-2012:test:049 | Waar zoek ik stukken over personeel? | — / 0 | 1 / 6 | 1 / 6 | 1 / 6 | beter | gelijk | gelijk |
| 1996-2012:test:050 | Waar zoek ik gegevens over een reisdocument? | — / 0 | 1 / 3 | 1 / 3 | 1 / 3 | beter | gelijk | gelijk |
| 1996-2012:test:051 | Waar zoek ik stukken waarin Wmo staat? | — / 0 | 1 / 3 | 1 / 4 | 1 / 4 | beter | gelijk | gelijk |
| 1996-2012:test:052 | Waar vind ik stukken over een monument? | — / 0 | 1 / 10 | 1 / 10 | 1 / 10 | beter | gelijk | gelijk |
| 1996-2012:test:053 | Waar zoek ik een rioleringsplan? | — / 0 | 1 / 1 | 1 / 1 | 1 / 1 | beter | gelijk | gelijk |
| 1996-2012:test:054 | Waar zoek ik een bezwaarschrift? | — / 0 | 1 / 2 | 1 / 2 | 1 / 2 | beter | gelijk | gelijk |
| 1996-2012:test:055 | Waar zoek ik een contract of overeenkomst? | — / 0 | 1 / 1 | 1 / 3 | 1 / 3 | beter | gelijk | gelijk |
| 2017:test:001 | De gemeente stelt een nieuw organisatieonderdeel in. Waar zoek ik? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2017:test:002 | Waar vind ik het opstellen van een gemeentelijke verordening? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2017:test:003 | Waar valt het opstellen van een beleidsplan onder? | — / 0 | 2 / 2 | 2 / 2 | 2 / 2 | beter | gelijk | gelijk |
| 2017:test:004 | Waar zoek ik een evaluatie van uitgevoerd gemeentelijk beleid? | — / 0 | — / 0 | 1 / 31 | 1 / 31 | gelijk | beter | gelijk |
| 2017:test:005 | De gemeente levert een product aan een inwoner. Welk procestype past als zoekrichting? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2017:test:006 | Een inwoner vraagt de gemeente iets te doen of te laten. Waar zoek ik? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2017:test:007 | Een inwoner doet een wettelijk verplichte aangifte bij de gemeente. Waar zoek ik? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2017:test:008 | Waar vind ik het verstrekken van een financiële voorziening? | — / 0 | 1 / 2 | 1 / 2 | 1 / 2 | beter | gelijk | gelijk |
| 2017:test:009 | Waar zoek ik het toekennen van een juridische status? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2017:test:010 | Waar vind ik het opleggen van een gemeentelijke heffing? | — / 0 | 1 / 1 | 1 / 1 | 1 / 1 | beter | gelijk | gelijk |
| 2017:test:011 | Een inwoner vraagt toestemming voor een activiteit. Waar zoek ik? | — / 0 | — / 0 | — / 0 | 1 / 6 | gelijk | gelijk | beter |
| 2017:test:012 | De gemeente controleert of voorschriften worden nageleefd. Waar zoek ik? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2017:test:013 | Waar zoek ik het behandelen van een geschil met een inwoner? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2017:test:014 | Waar vind ik het inrichten van de openbare ruimte? | — / 0 | 1 / 2 | 1 / 2 | 1 / 2 | beter | gelijk | gelijk |
| 2017:test:015 | Waar zoek ik het onderhouden of repareren van een gemeentelijk object? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2017:test:016 | Waar vind ik het aangaan van een overeenkomst door de gemeente? | — / 0 | 1 / 5 | 1 / 5 | 1 / 5 | beter | gelijk | gelijk |
| 2017:test:017 | Waar zoek ik het aanstellen van een medewerker? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2017:test:018 | Waar vind ik het betalen van een factuur of innen van een vordering? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2017:test:019 | Waar zoek ik het administratief verwerken van gegevens zonder inhoudelijke toets? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2017:test:020 | De gemeente verstrekt informatie. Welk procestype is een zoekrichting? | — / 0 | 1 / 1 | 21 / 21 | 21 / 21 | beter | slechter | gelijk |
| 2017:test:021 | Waar zoek ik een door de gemeente uitgebracht advies? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2017:test:022 | De gemeente organiseert een gebeurtenis. Waar zoek ik? | — / 0 | 1 / 1 | 1 / 1 | 1 / 1 | beter | gelijk | gelijk |
| 2017:test:023 | De gemeente vraagt zelf een voorziening aan. Waar zoek ik? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2017:test:024 | De gemeente vraagt zelf toestemming aan een andere instantie. Waar zoek ik? | — / 0 | — / 0 | — / 0 | 6 / 6 | gelijk | gelijk | beter |
| 2017:test:025 | Een toezichthouder controleert de gemeente. Waar zoek ik? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2017:test:026 | De gemeente betwist een besluit van een ander bestuursorgaan. Waar zoek ik? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2017:test:027 | De gemeente vraagt zelf een status aan. Waar zoek ik? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2017:test:028 | De gemeente vraagt zelf een product of dienst aan. Waar zoek ik? | — / 0 | — / 0 | 1 / 3 | 1 / 3 | gelijk | beter | gelijk |
| 2017:test:029 | De gemeente doet zelf aangifte. Waar zoek ik? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2017:test:030 | Waar vind ik stukken over het verstrekken van een subsidie? | — / 0 | 1 / 2 | 1 / 3 | 1 / 3 | beter | gelijk | gelijk |
| 2017:test:031 | Waar zoek ik een dossier over jeugdhulp? | — / 0 | 1 / 5 | 1 / 5 | 1 / 5 | beter | gelijk | gelijk |
| 2017:test:032 | Waar zoek ik stukken met de afkorting BRP? | — / 0 | — / 0 | 1 / 16 | 1 / 16 | gelijk | beter | gelijk |
| 2017:test:033 | Waar zoek ik documenten over een geboorteaangifte? | — / 0 | 1 / 1 | 1 / 1 | 1 / 1 | beter | gelijk | gelijk |
| 2017:test:034 | Waar zoek ik het verwerken van overlijdensgegevens? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2017:test:035 | Waar vind ik stukken over een verkiezing? | — / 0 | 1 / 2 | 1 / 2 | 1 / 2 | beter | gelijk | gelijk |
| 2017:test:036 | Waar zoek ik stukken over een referendum? | — / 0 | 1 / 1 | 1 / 1 | 1 / 1 | beter | gelijk | gelijk |
| 2017:test:037 | Waar vind ik stukken over een bestemmingsplan? | — / 0 | 1 / 4 | 1 / 4 | 1 / 4 | beter | gelijk | gelijk |
| 2017:test:038 | Waar zoek ik een bodemonderzoek? | — / 0 | 1 / 1 | 1 / 1 | 1 / 1 | beter | gelijk | gelijk |
| 2017:test:039 | Waar zoek ik toestemming voor sanering van tanks? | — / 0 | 1 / 1 | 1 / 1 | 1 / 7 | beter | gelijk | gelijk |
| 2017:test:040 | Waar vind ik de verantwoording van archiefvernietiging? | — / 0 | — / 0 | 1 / 1 | 1 / 1 | gelijk | beter | gelijk |
| 2017:test:041 | Waar zoek ik stukken van een sollicitatieprocedure? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2017:test:042 | Waar zoek ik stukken over personeel? | — / 0 | 1 / 9 | 1 / 9 | 1 / 9 | beter | gelijk | gelijk |
| 2017:test:043 | Waar vind ik stukken over leerplicht? | — / 0 | 1 / 4 | 1 / 4 | 1 / 4 | beter | gelijk | gelijk |
| 2017:test:044 | Waar zoek ik gegevens over een reisdocument? | — / 0 | 1 / 6 | 1 / 6 | 1 / 6 | beter | gelijk | gelijk |
| 2017:test:045 | Waar zoek ik stukken waarin Wmo staat? | — / 0 | 1 / 6 | 1 / 6 | 1 / 6 | beter | gelijk | gelijk |
| 2017:test:046 | Waar vind ik stukken over een monument? | — / 0 | 1 / 3 | 1 / 3 | 1 / 3 | beter | gelijk | gelijk |
| 2017:test:047 | Waar zoek ik een rioleringsplan? | — / 0 | 1 / 2 | 1 / 2 | 1 / 2 | beter | gelijk | gelijk |
| 2017:test:048 | Waar vind ik stukken over gemeentelijke belastingen? | — / 0 | 1 / 3 | 1 / 3 | 1 / 3 | beter | gelijk | gelijk |
| 2017:test:049 | Waar zoek ik een bezwaarschrift? | — / 0 | 1 / 1 | 1 / 1 | 1 / 1 | beter | gelijk | gelijk |
| 2017:test:050 | Waar zoek ik een contract of overeenkomst? | — / 0 | 1 / 2 | 1 / 3 | 1 / 3 | beter | gelijk | gelijk |
| 2017:test:051 | Waar vind ik stukken over een register? | — / 0 | 1 / 8 | 1 / 8 | 1 / 8 | beter | gelijk | gelijk |
| 2017:test:052 | Waar zoek ik stukken over gegevensverwerking? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2017:test:053 | Waar vind ik stukken over woningen? | — / 0 | 1 / 1 | 1 / 1 | 1 / 1 | beter | gelijk | gelijk |
| 2017:test:054 | Waar zoek ik stukken over een vergunning? | — / 0 | 1 / 7 | 1 / 7 | 1 / 7 | beter | gelijk | gelijk |
| 2020:test:001 | De gemeente stelt een nieuw organisatieonderdeel in. Waar zoek ik? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2020:test:002 | Waar vind ik het opstellen van een gemeentelijke verordening? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2020:test:003 | Waar valt het opstellen van een beleidsplan onder? | — / 0 | 2 / 2 | 2 / 2 | 2 / 2 | beter | gelijk | gelijk |
| 2020:test:004 | Waar zoek ik een evaluatie van uitgevoerd gemeentelijk beleid? | — / 0 | — / 0 | 1 / 37 | 1 / 37 | gelijk | beter | gelijk |
| 2020:test:005 | De gemeente levert een product aan een inwoner. Welk procestype past als zoekrichting? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2020:test:006 | Een inwoner vraagt de gemeente iets te doen of te laten. Waar zoek ik? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2020:test:007 | Een inwoner doet een wettelijk verplichte aangifte bij de gemeente. Waar zoek ik? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2020:test:008 | Waar vind ik het verstrekken van een financiële voorziening? | — / 0 | 1 / 2 | 1 / 2 | 1 / 2 | beter | gelijk | gelijk |
| 2020:test:009 | Waar zoek ik het toekennen van een juridische status? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2020:test:010 | Waar vind ik het opleggen van een gemeentelijke heffing? | — / 0 | 1 / 1 | 1 / 1 | 1 / 1 | beter | gelijk | gelijk |
| 2020:test:011 | Een inwoner vraagt toestemming voor een activiteit. Waar zoek ik? | — / 0 | — / 0 | — / 0 | 1 / 8 | gelijk | gelijk | beter |
| 2020:test:012 | De gemeente controleert of voorschriften worden nageleefd. Waar zoek ik? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2020:test:013 | Waar zoek ik het behandelen van een geschil met een inwoner? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2020:test:014 | Waar vind ik het inrichten van de openbare ruimte? | — / 0 | 1 / 2 | 1 / 2 | 1 / 2 | beter | gelijk | gelijk |
| 2020:test:015 | Waar zoek ik het onderhouden of repareren van een gemeentelijk object? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2020:test:016 | Waar vind ik het aangaan van een overeenkomst door de gemeente? | — / 0 | 1 / 7 | 1 / 7 | 1 / 7 | beter | gelijk | gelijk |
| 2020:test:017 | Waar zoek ik het aanstellen van een medewerker? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2020:test:018 | Waar vind ik het betalen van een factuur of innen van een vordering? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2020:test:019 | Waar zoek ik het administratief verwerken van gegevens zonder inhoudelijke toets? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2020:test:020 | De gemeente verstrekt informatie. Welk procestype is een zoekrichting? | — / 0 | 1 / 1 | 21 / 21 | 21 / 21 | beter | slechter | gelijk |
| 2020:test:021 | Waar zoek ik een door de gemeente uitgebracht advies? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2020:test:022 | De gemeente organiseert een gebeurtenis. Waar zoek ik? | — / 0 | 1 / 1 | 1 / 1 | 1 / 1 | beter | gelijk | gelijk |
| 2020:test:023 | De gemeente vraagt zelf een voorziening aan. Waar zoek ik? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2020:test:024 | De gemeente vraagt zelf toestemming aan een andere instantie. Waar zoek ik? | — / 0 | — / 0 | — / 0 | 8 / 8 | gelijk | gelijk | beter |
| 2020:test:025 | Een toezichthouder controleert de gemeente. Waar zoek ik? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2020:test:026 | De gemeente betwist een besluit van een ander bestuursorgaan. Waar zoek ik? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2020:test:027 | De gemeente vraagt zelf een status aan. Waar zoek ik? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2020:test:028 | De gemeente vraagt zelf een product of dienst aan. Waar zoek ik? | — / 0 | — / 0 | 1 / 3 | 1 / 3 | gelijk | beter | gelijk |
| 2020:test:029 | De gemeente doet zelf aangifte. Waar zoek ik? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2020:test:030 | Waar vind ik stukken over het verstrekken van een subsidie? | — / 0 | 1 / 2 | 1 / 3 | 1 / 4 | beter | gelijk | gelijk |
| 2020:test:031 | Waar zoek ik een dossier over jeugdhulp? | — / 0 | 1 / 6 | 1 / 6 | 1 / 6 | beter | gelijk | gelijk |
| 2020:test:032 | Waar zoek ik stukken met de afkorting BRP? | — / 0 | — / 0 | 1 / 16 | 1 / 16 | gelijk | beter | gelijk |
| 2020:test:033 | Waar zoek ik documenten over een geboorteaangifte? | — / 0 | 1 / 1 | 1 / 1 | 1 / 1 | beter | gelijk | gelijk |
| 2020:test:034 | Waar zoek ik het verwerken van overlijdensgegevens? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2020:test:035 | Waar vind ik stukken over een verkiezing? | — / 0 | 1 / 3 | 1 / 3 | 1 / 3 | beter | gelijk | gelijk |
| 2020:test:036 | Waar zoek ik stukken over een referendum? | — / 0 | 1 / 1 | 1 / 1 | 1 / 1 | beter | gelijk | gelijk |
| 2020:test:037 | Waar vind ik stukken over een bestemmingsplan? | — / 0 | 1 / 4 | 1 / 4 | 1 / 4 | beter | gelijk | gelijk |
| 2020:test:038 | Waar zoek ik een bodemonderzoek? | — / 0 | 1 / 1 | 1 / 1 | 1 / 1 | beter | gelijk | gelijk |
| 2020:test:039 | Waar zoek ik toestemming voor sanering van tanks? | — / 0 | 1 / 1 | 1 / 1 | 1 / 9 | beter | gelijk | gelijk |
| 2020:test:040 | Waar vind ik de verantwoording van archiefvernietiging? | — / 0 | — / 0 | 1 / 2 | 1 / 2 | gelijk | beter | gelijk |
| 2020:test:041 | Waar zoek ik stukken van een sollicitatieprocedure? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2020:test:042 | Waar zoek ik stukken over personeel? | — / 0 | 1 / 11 | 1 / 11 | 1 / 11 | beter | gelijk | gelijk |
| 2020:test:043 | Waar vind ik stukken over leerplicht? | — / 0 | 1 / 4 | 1 / 4 | 1 / 4 | beter | gelijk | gelijk |
| 2020:test:044 | Waar vind ik een automatische incasso? | — / 0 | 1 / 2 | 1 / 2 | 1 / 2 | beter | gelijk | gelijk |
| 2020:test:045 | Waar zoek ik gegevens over een reisdocument? | — / 0 | 1 / 6 | 1 / 6 | 1 / 6 | beter | gelijk | gelijk |
| 2020:test:046 | Waar zoek ik stukken waarin Wmo staat? | — / 0 | 1 / 7 | 1 / 7 | 1 / 7 | beter | gelijk | gelijk |
| 2020:test:047 | Waar vind ik stukken over een monument? | — / 0 | 1 / 4 | 1 / 4 | 1 / 4 | beter | gelijk | gelijk |
| 2020:test:048 | Waar zoek ik een rioleringsplan? | — / 0 | 1 / 2 | 1 / 2 | 1 / 2 | beter | gelijk | gelijk |
| 2020:test:049 | Waar vind ik stukken over gemeentelijke belastingen? | — / 0 | 1 / 4 | 1 / 4 | 1 / 4 | beter | gelijk | gelijk |
| 2020:test:050 | Waar zoek ik een bezwaarschrift? | — / 0 | 1 / 1 | 1 / 1 | 1 / 1 | beter | gelijk | gelijk |
| 2020:test:051 | Waar zoek ik een contract of overeenkomst? | — / 0 | 1 / 1 | 1 / 2 | 1 / 2 | beter | gelijk | gelijk |
| 2020:test:052 | Waar vind ik stukken over een register? | — / 0 | 1 / 8 | 1 / 8 | 1 / 8 | beter | gelijk | gelijk |
| 2020:test:053 | Waar zoek ik stukken over gegevensverwerking? | — / 0 | — / 0 | — / 0 | — / 0 | gelijk | gelijk | gelijk |
| 2020:test:054 | Waar vind ik stukken over woningen? | — / 0 | 1 / 1 | 1 / 1 | 1 / 1 | beter | gelijk | gelijk |
| 2020:test:055 | Waar zoek ik stukken over een vergunning? | — / 0 | 1 / 7 | 1 / 7 | 1 / 7 | beter | gelijk | gelijk |

## Concrete veranderingen

- 1996-2012:test:001: “Waar bewaar ik de notulen van de gemeenteraad?”; A→B gelijk, B→C beter, C→D gelijk.
- 1996-2012:test:002: “Hoe lang bewaren we presentielijsten van vergaderingen?”; A→B beter, B→C gelijk, C→D gelijk.
- 1996-2012:test:003: “Wat doe ik met een gemeentegids?”; A→B beter, B→C gelijk, C→D gelijk.
- 1996-2012:test:006: “Waar vallen niet-ontvankelijke aanvragen onder?”; A→B beter, B→C gelijk, C→D gelijk.
- 1996-2012:test:007: “Archiefinspectierapport: bewaren of vernietigen?”; A→B beter, B→C gelijk, C→D gelijk.
- 1996-2012:test:008: “Bestuurlijke boete dossier”; A→B beter, B→C gelijk, C→D gelijk.
- 1996-2012:test:010: “Metadata van te bewaren dossiers”; A→B beter, B→C gelijk, C→D gelijk.
- 1996-2012:test:013: “Subsidiedossier jaarlijkse subsidie”; A→B gelijk, B→C beter, C→D gelijk.
- 1996-2012:test:021: “Personeelsdossier medewerker”; A→B gelijk, B→C beter, C→D gelijk.
- 1996-2012:test:024: “Loonadministratie / salarisadministratie”; A→B gelijk, B→C beter, C→D gelijk.
- 1996-2012:test:026: “Aankoop van gemeentelijke grond”; A→B beter, B→C gelijk, C→D gelijk.
- 1996-2012:test:030: “BAG brondocument straatnaam”; A→B gelijk, B→C beter, C→D gelijk.
- 1996-2012:test:031: “Processen-verbaal verkiezingen N10”; A→B beter, B→C gelijk, C→D gelijk.
- 1996-2012:test:034: “Bouwvergunning woning”; A→B gelijk, B→C beter, C→D gelijk.
- 1996-2012:test:035: “Sloopmelding”; A→B beter, B→C gelijk, C→D gelijk.

Opvallende dalingen op de diagnostische positie:

- 2017:test:020: “De gemeente verstrekt informatie. Welk procestype is een zoekrichting?”; BC. Zie aantallen/posities in de volledige tabel.
- 2020:test:020: “De gemeente verstrekt informatie. Welk procestype is een zoekrichting?”; BC. Zie aantallen/posities in de volledige tabel.

Alle verslechteringen staan ongefilterd in de volledige tabel. Extra resultaten kunnen ondanks een betere eerste bekende positie onjuist of meerduidig zijn. De C-zonder-beoordeelde-AI-controle scheidt officiële/brononderbouwde/taalkundige ingangen van AI-zoekrichtingen met onzekere menselijke beoordelingsherkomst. Onbevestigde voorstellen zijn uitsluitend in D actief en blijven als zodanig herkenbaar.
