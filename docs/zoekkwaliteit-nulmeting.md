# Zoekkwaliteit — kwalitatieve nulmeting A/B/C

Reproduceerbaar na `npm run build` met `npm run vergelijk:zoekkwaliteit -- --output docs/zoekkwaliteit-nulmeting.md`. Alle 164 oorspronkelijke volledige zoekvragen en hun relevante/alternatieve categorieën worden ongewijzigd gebruikt voor alle varianten. Geen vraagherschrijving of aanpassing van verwachtingen. Vervallen resultaten staan in alle varianten uit.

## Varianten en grens van de meting

A is de ongewijzigde klassieke EN-trefwoordzoekfunctie zonder lexicon. B is begripsgericht zoeken met directe officiële tekst en expliciet toegelaten lexiconrelaties: officiële termen, brononderbouwde aanvullingen, mechanisch gecontroleerde varianten en inhoudelijk beoordeelde AI-zoekrichtingen. Die laatste blijven zichtbaar AI-voorstellen en zijn geen officiële synoniemen. C is B met bovendien expliciet ingeschakelde `voorstel_niet_activeren`-relaties. Onbekende statussen blijven in alle varianten uit.

Alle testvragen hebben `beoordelingsstatus=brongetoetste_vindbaarheidsverwachting`, `alternatieven_uitputtend=false` en `toepasselijkheid_vastgesteld=false`. Er is geen volledige set gecontroleerde positieve en negatieve relevantieoordelen. Daarom worden Recall@5, Recall@10, Precision@5 en MRR niet als betrouwbare kwaliteitsmaten berekend. Een niet-opgegeven resultaat kan eveneens relevant zijn; een treffer is geen selectiegrondslag. Er worden geen percentages of synthetische precisies gepresenteerd.

Hieronder staat een kwalitatieve diagnostische vergelijking. De eerste positie is alleen die van een resultaat dat aan een opgegeven vindbaarheidsverwachting voldoet: exact ID of een voorschrift binnen de verwachte categorie volgens het opgeslagen ouderpad. Dit is dezelfde scopecontrole als in de eerdere trefwoordnulmeting en verandert de zoekresultaten niet. ‘Beter’ betekent eerder zo'n bekende treffer of voor het eerst een bekende treffer; ‘slechter’ betekent later of geen bekende treffer meer. ‘Gelijk’ kan ook betekenen dat beide geen bekende treffer hebben. Deze aanduidingen zijn geen menselijke eindbeoordeling van de overige resultaten.

## Per selectielijst

| Lijst | Vragen | B t.o.v. A beter / gelijk / slechter | C t.o.v. B beter / gelijk / slechter | Zonder bekende treffer A / B / C |
| --- | ---: | --- | --- | --- |
| 1996-2012 | 55 | 11 / 44 / 0 | 2 / 53 / 0 | 47 / 36 / 34 |
| 2017 | 54 | 12 / 42 / 0 | 4 / 50 / 0 | 54 / 42 / 38 |
| 2020 | 55 | 13 / 42 / 0 | 3 / 52 / 0 | 55 / 42 / 39 |

## Ongewijzigde vragen en waarnemingen

De kolommen A/B/C geven de eerste positie op een opgegeven verwachting, of — wanneer die niet voorkomt. Er is niet alleen naar de eerste vijf of tien gekeken. Verklarende termen zijn overgenomen uit het daadwerkelijk gevonden resultaat; de eerste vijf verschillende verklaringen worden voor de leesbaarheid genoemd. De interface bewaart alle verklaringen.

| Vraag | Ongewijzigde zoekvraag | Verwachte of alternatieve categorieën | A | B | C | B versus A | C versus B | Verklarende lexicontermen bij bekende treffer |
| --- | --- | --- | ---: | ---: | ---: | --- | --- | --- |
| 1996-2012:test:001 | Waar bewaar ik de notulen van de gemeenteraad? | 1996-2012:2.2 | — | 1 | 1 | beter | gelijk | notulen (voorstel_inhoudelijk_beoordeeld_zoekrichting) |
| 1996-2012:test:002 | Hoe lang bewaren we presentielijsten van vergaderingen? | 1996-2012:2.2 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:003 | Wat doe ik met een gemeentegids? | 1996-2012:2.6 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:004 | Moet de oude gemeentelijke website worden bewaard? | 1996-2012:2.6 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:005 | Hoe lang bewaar je een ingetrokken vergunningaanvraag? | 1996-2012:2.7 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:006 | Waar vallen niet-ontvankelijke aanvragen onder? | 1996-2012:2.7 | — | — | 5 | gelijk | beter | niet (voorstel_niet_activeren) |
| 1996-2012:test:007 | Archiefinspectierapport: bewaren of vernietigen? | 1996-2012:2.9 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:008 | Bestuurlijke boete dossier | 1996-2012:2.9 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:009 | Documentair structuurplan / DSP | 1996-2012:2.11 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:010 | Metadata van te bewaren dossiers | 1996-2012:2.11 | — | 1 | 1 | beter | gelijk | metadata (brononderbouwd_gecontroleerd) |
| 1996-2012:test:011 | Convenant met buurgemeenten | 1996-2012:2.18 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:012 | Beleidsnotitie vastgesteld door college | 1996-2012:2.18 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:013 | Subsidiedossier jaarlijkse subsidie | 1996-2012:2.20 | — | 1 | 1 | beter | gelijk | subsidiedossier (voorstel_inhoudelijk_beoordeeld_zoekrichting) |
| 1996-2012:test:014 | Ontvangen ESF subsidie | 1996-2012:2.20 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:015 | Bezwaarschrift tegen besluit | 1996-2012:2.25 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:016 | Jaarverslag bezwaarschriftencommissie | 1996-2012:2.25 | 1 | 1 | 1 | gelijk | gelijk | — |
| 1996-2012:test:017 | Voorbereiding gemeentebegroting | 1996-2012:3.1.1 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:018 | SISA-tabellen jaarrekening | 1996-2012:3.1.2 | 1 | 1 | 1 | gelijk | gelijk | SISA (brongetoetst) |
| 1996-2012:test:019 | Controlerapport jaarrekening | 1996-2012:3.1.3 | 1 | 1 | 1 | gelijk | gelijk | Controlerapport jaarrekening (brongetoetst) |
| 1996-2012:test:020 | WOZ / belastingaangifte | 1996-2012:3.1.4 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:021 | Personeelsdossier medewerker | 1996-2012:3.2.1 | — | 1 | 1 | beter | gelijk | personeelsdossier (voorstel_inhoudelijk_beoordeeld_zoekrichting) |
| 1996-2012:test:022 | Sollicitatiebrief niet aangenomen kandidaat | 1996-2012:3.2.2 | — | — | 15 | gelijk | beter | niet (voorstel_niet_activeren) |
| 1996-2012:test:023 | Functiewaardering | 1996-2012:3.2.3 | 1 | 1 | 1 | gelijk | gelijk | — |
| 1996-2012:test:024 | Loonadministratie / salarisadministratie | 1996-2012:3.2.4 | — | 1 | 1 | beter | gelijk | Salarisadministratie (brongetoetst) |
| 1996-2012:test:025 | RI&E arbobeleid | 1996-2012:3.2.5 | 1 | 1 | 1 | gelijk | gelijk | RI&E (brongetoetst) |
| 1996-2012:test:026 | Aankoop van gemeentelijke grond | 1996-2012:3.3.1 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:027 | Notulen bouwvergadering monument | 1996-2012:3.3.2 | 1 | 1 | 1 | gelijk | gelijk | notulen (voorstel_niet_activeren) |
| 1996-2012:test:028 | Erfpachtakte / zakelijk recht | 1996-2012:3.3.4 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:029 | Bruikleen kunstwerk aan museum | 1996-2012:3.3.4 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:030 | BAG brondocument straatnaam | 1996-2012:3.5.2 | — | 2 | 2 | beter | gelijk | BAG (brongetoetst) |
| 1996-2012:test:031 | Processen-verbaal verkiezingen N10 | 1996-2012:3.5.3 | — | 1 | 1 | beter | gelijk | N10 (brongetoetst) |
| 1996-2012:test:032 | Mandaatbesluit bestuurder aan ambtenaar | 1996-2012:3.5.4 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:033 | Bestemmingsplan met zienswijzen | 1996-2012:3.6.1 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:034 | Bouwvergunning woning | 1996-2012:3.6.2 | — | 1 | 1 | beter | gelijk | bouwvergunning (voorstel_inhoudelijk_beoordeeld_zoekrichting) |
| 1996-2012:test:035 | Sloopmelding | 1996-2012:3.6.2 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:036 | Akten burgerlijke stand | 1996-2012:3.7.1 | 1 | 1 | 1 | gelijk | gelijk | — |
| 1996-2012:test:037 | GBA persoonslijst / persoonsregister | 1996-2012:3.7.2 | — | 1 | 1 | beter | gelijk | GBA (brongetoetst) |
| 1996-2012:test:038 | Naturalisatie / Nederlanderschap | 1996-2012:3.7.3 | 1 | 1 | 1 | gelijk | gelijk | — |
| 1996-2012:test:039 | Paspoortaanvraag | 1996-2012:3.7.5 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:040 | Rijbewijsaanvraag | 1996-2012:3.7.6 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:041 | Waar vind ik stukken over het verstrekken van een subsidie? | 1996-2012:2.20, 1996-2012:3.6.2, 1996-2012:3.13.1 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:042 | Waar zoek ik een dossier over jeugdhulp? | 1996-2012:3.14.3 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:043 | Waar zoek ik documenten over een geboorteaangifte? | 1996-2012:3.7.1, 1996-2012:3.7.2, 1996-2012:3.8.2 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:044 | Waar zoek ik het verwerken van overlijdensgegevens? | 1996-2012:3.7.1, 1996-2012:3.7.2, 1996-2012:3.8.5 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:045 | Waar vind ik stukken over een verkiezing? | 1996-2012:3.2.6, 1996-2012:3.5.3 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:046 | Waar vind ik stukken over een bestemmingsplan? | 1996-2012:3.6.1, 1996-2012:3.9.1, 1996-2012:3.9.5 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:047 | Waar zoek ik een bodemonderzoek? | 1996-2012:3.6.2, 1996-2012:3.9.2 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:048 | Waar zoek ik stukken van een sollicitatieprocedure? | 1996-2012:3.2.2 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:049 | Waar zoek ik stukken over personeel? | 1996-2012:3.2.1, 1996-2012:3.2.3, 1996-2012:3.15.2 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:050 | Waar zoek ik gegevens over een reisdocument? | 1996-2012:3.7.2 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:051 | Waar zoek ik stukken waarin Wmo staat? | 1996-2012:3.14.3 | — | 1 | 1 | beter | gelijk | Wmo (brononderbouwd_gecontroleerd) |
| 1996-2012:test:052 | Waar vind ik stukken over een monument? | 1996-2012:2.7, 1996-2012:3.3.2, 1996-2012:3.8.5, 1996-2012:3.16.1 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:053 | Waar zoek ik een rioleringsplan? | 1996-2012:3.9.4 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:054 | Waar zoek ik een bezwaarschrift? | 1996-2012:2.7, 1996-2012:2.25, 1996-2012:3.1.4, 1996-2012:3.1.5, 1996-2012:3.8.5 | — | — | — | gelijk | gelijk | — |
| 1996-2012:test:055 | Waar zoek ik een contract of overeenkomst? | 1996-2012:2.17 | — | 1 | 1 | beter | gelijk | contract (voorstel_inhoudelijk_beoordeeld_zoekrichting) |
| 2017:test:001 | De gemeente stelt een nieuw organisatieonderdeel in. Waar zoek ik? | 2017:1 | — | — | — | gelijk | gelijk | — |
| 2017:test:002 | Waar vind ik het opstellen van een gemeentelijke verordening? | 2017:2 | — | — | — | gelijk | gelijk | — |
| 2017:test:003 | Waar valt het opstellen van een beleidsplan onder? | 2017:3 | — | — | — | gelijk | gelijk | — |
| 2017:test:004 | Waar zoek ik een evaluatie van uitgevoerd gemeentelijk beleid? | 2017:4 | — | 1 | 1 | beter | gelijk | Uitgevoerd (brongetoetst) |
| 2017:test:005 | De gemeente levert een product aan een inwoner. Welk procestype past als zoekrichting? | 2017:5 | — | — | — | gelijk | gelijk | — |
| 2017:test:006 | Een inwoner vraagt de gemeente iets te doen of te laten. Waar zoek ik? | 2017:6 | — | — | — | gelijk | gelijk | — |
| 2017:test:007 | Een inwoner doet een wettelijk verplichte aangifte bij de gemeente. Waar zoek ik? | 2017:7 | — | — | — | gelijk | gelijk | — |
| 2017:test:008 | Waar vind ik het verstrekken van een financiële voorziening? | 2017:8 | — | — | — | gelijk | gelijk | — |
| 2017:test:009 | Waar zoek ik het toekennen van een juridische status? | 2017:9 | — | — | — | gelijk | gelijk | — |
| 2017:test:010 | Waar vind ik het opleggen van een gemeentelijke heffing? | 2017:10 | — | — | — | gelijk | gelijk | — |
| 2017:test:011 | Een inwoner vraagt toestemming voor een activiteit. Waar zoek ik? | 2017:11 | — | — | 1 | gelijk | beter | Toestemming (voorstel_niet_activeren); toestemming (voorstel_niet_activeren) |
| 2017:test:012 | De gemeente controleert of voorschriften worden nageleefd. Waar zoek ik? | 2017:12 | — | — | — | gelijk | gelijk | — |
| 2017:test:013 | Waar zoek ik het behandelen van een geschil met een inwoner? | 2017:13 | — | — | — | gelijk | gelijk | — |
| 2017:test:014 | Waar vind ik het inrichten van de openbare ruimte? | 2017:14 | — | — | — | gelijk | gelijk | — |
| 2017:test:015 | Waar zoek ik het onderhouden of repareren van een gemeentelijk object? | 2017:15 | — | — | — | gelijk | gelijk | — |
| 2017:test:016 | Waar vind ik het aangaan van een overeenkomst door de gemeente? | 2017:16 | — | — | — | gelijk | gelijk | — |
| 2017:test:017 | Waar zoek ik het aanstellen van een medewerker? | 2017:17 | — | — | — | gelijk | gelijk | — |
| 2017:test:018 | Waar vind ik het betalen van een factuur of innen van een vordering? | 2017:18 | — | — | — | gelijk | gelijk | — |
| 2017:test:019 | Waar zoek ik het administratief verwerken van gegevens zonder inhoudelijke toets? | 2017:19 | — | — | — | gelijk | gelijk | — |
| 2017:test:020 | De gemeente verstrekt informatie. Welk procestype is een zoekrichting? | 2017:20 | — | — | — | gelijk | gelijk | — |
| 2017:test:021 | Waar zoek ik een door de gemeente uitgebracht advies? | 2017:21 | — | — | — | gelijk | gelijk | — |
| 2017:test:022 | De gemeente organiseert een gebeurtenis. Waar zoek ik? | 2017:22 | — | — | — | gelijk | gelijk | — |
| 2017:test:023 | De gemeente vraagt zelf een voorziening aan. Waar zoek ik? | 2017:23 | — | — | — | gelijk | gelijk | — |
| 2017:test:024 | De gemeente vraagt zelf toestemming aan een andere instantie. Waar zoek ik? | 2017:24 | — | — | 6 | gelijk | beter | Toestemming (voorstel_niet_activeren); toestemming (voorstel_niet_activeren) |
| 2017:test:025 | Een toezichthouder controleert de gemeente. Waar zoek ik? | 2017:25 | — | — | — | gelijk | gelijk | — |
| 2017:test:026 | De gemeente betwist een besluit van een ander bestuursorgaan. Waar zoek ik? | 2017:26 | — | — | — | gelijk | gelijk | — |
| 2017:test:027 | De gemeente vraagt zelf een status aan. Waar zoek ik? | 2017:27 | — | — | — | gelijk | gelijk | — |
| 2017:test:028 | De gemeente vraagt zelf een product of dienst aan. Waar zoek ik? | 2017:28 | — | 1 | 1 | beter | gelijk | Product of dienst (brongetoetst) |
| 2017:test:029 | De gemeente doet zelf aangifte. Waar zoek ik? | 2017:29 | — | — | — | gelijk | gelijk | — |
| 2017:test:030 | Waar vind ik stukken over het verstrekken van een subsidie? | 2017:8.1.7, 2017:8.1.8, 2017:23.1.1, 2017:23.1.2 | — | 1 | 1 | beter | gelijk | Subsidie (brongetoetst) |
| 2017:test:031 | Waar zoek ik een dossier over jeugdhulp? | 2017:3.1.4, 2017:8.1.2, 2017:8.3.2, 2017:12.1.2, 2017:12.2.6 | — | — | 1 | gelijk | beter | jeugdhulp (voorstel_niet_activeren) |
| 2017:test:032 | Waar zoek ik stukken met de afkorting BRP? | 2017:1.1.3, 2017:4.1, 2017:5.1.2, 2017:6.1.7, 2017:7.1.2, 2017:7.1.4, 2017:7.1.9, 2017:7.1.10, 2017:7.1.15, 2017:7.1.16, 2017:9.1.6, 2017:9.1.11, 2017:12.1.6, 2017:15.1, 2017:15.1.4, 2017:19.1.15 | — | 1 | 1 | beter | gelijk | BRP (brongetoetst) |
| 2017:test:033 | Waar zoek ik documenten over een geboorteaangifte? | 2017:4.1.7, 2017:5.1.8, 2017:7.1.2, 2017:7.1.3, 2017:11.1.8, 2017:11.1.9, 2017:12.1.3 | — | — | — | gelijk | gelijk | — |
| 2017:test:034 | Waar zoek ik het verwerken van overlijdensgegevens? | 2017:7.1.2, 2017:7.1.3, 2017:7.1.5, 2017:7.1.6 | — | — | — | gelijk | gelijk | — |
| 2017:test:035 | Waar vind ik stukken over een verkiezing? | 2017:19.1.17, 2017:22.1.2 | — | 1 | 1 | beter | gelijk | Verkiezing (brongetoetst) |
| 2017:test:036 | Waar zoek ik stukken over een referendum? | 2017:22.1.3 | — | 1 | 1 | beter | gelijk | Referendum (brongetoetst) |
| 2017:test:037 | Waar vind ik stukken over een bestemmingsplan? | 2017:6.1.11, 2017:6.2.1, 2017:9.1.3, 2017:11.1.11 | — | 1 | 1 | beter | gelijk | Bestemmingsplan (brongetoetst) |
| 2017:test:038 | Waar zoek ik een bodemonderzoek? | 2017:11.1.11 | — | — | — | gelijk | gelijk | — |
| 2017:test:039 | Waar zoek ik toestemming voor sanering van tanks? | 2017:11.1.16 | — | — | — | gelijk | gelijk | — |
| 2017:test:040 | Waar vind ik de verantwoording van archiefvernietiging? | 2017:19.1.18, 2017:24.1.2 | — | 1 | 1 | beter | gelijk | Archiefvernietiging (brongetoetst) |
| 2017:test:041 | Waar zoek ik stukken van een sollicitatieprocedure? | 2017:17.2.1, 2017:17.2.2 | — | — | — | gelijk | gelijk | — |
| 2017:test:042 | Waar zoek ik stukken over personeel? | 2017:4.1.6, 2017:6.1.1, 2017:9.1, 2017:12.2, 2017:17.1, 2017:17.5, 2017:19.1.13 | — | — | — | gelijk | gelijk | — |
| 2017:test:043 | Waar vind ik stukken over leerplicht? | 2017:4.1.9, 2017:11.1.2, 2017:11.1.8, 2017:12.1.3 | — | 1 | 1 | beter | gelijk | Leerplicht (brongetoetst) |
| 2017:test:044 | Waar zoek ik gegevens over een reisdocument? | 2017:5.1.4, 2017:5.1.5, 2017:5.2.1, 2017:7.1.11, 2017:7.1.12, 2017:7.1.20 | — | 1 | 1 | beter | gelijk | Reisdocument (brongetoetst) |
| 2017:test:045 | Waar zoek ik stukken waarin Wmo staat? | 2017:3.1.1, 2017:3.1.5, 2017:8.1.1, 2017:8.3.1, 2017:12.1.2, 2017:12.2.6 | — | 1 | 1 | beter | gelijk | WMO (brongetoetst) |
| 2017:test:046 | Waar vind ik stukken over een monument? | 2017:9.1.2, 2017:11.1.6, 2017:15.1.2 | — | 1 | 1 | beter | gelijk | Monument (brongetoetst) |
| 2017:test:047 | Waar zoek ik een rioleringsplan? | 2017:3.1.1, 2017:3.1.2, 2017:14.1.1 | — | — | — | gelijk | gelijk | — |
| 2017:test:048 | Waar vind ik stukken over gemeentelijke belastingen? | 2017:6.1.1, 2017:10.1, 2017:18.1, 2017:18.3, 2017:19.1.2 | — | — | — | gelijk | gelijk | — |
| 2017:test:049 | Waar zoek ik een bezwaarschrift? | 2017:13.1, 2017:13.1.3, 2017:26.1 | — | — | — | gelijk | gelijk | — |
| 2017:test:050 | Waar zoek ik een contract of overeenkomst? | 2017:16.1, 2017:16.1.1, 2017:16.1.2, 2017:16.1.4, 2017:16.2.1, 2017:16.3.1 | — | — | — | gelijk | gelijk | — |
| 2017:test:051 | Waar vind ik stukken over een register? | 2017:7.1.2, 2017:7.1.3, 2017:7.1.5, 2017:7.1.6, 2017:7.1.13, 2017:7.1.21, 2017:19.1.4 | — | — | — | gelijk | gelijk | — |
| 2017:test:052 | Waar zoek ik stukken over gegevensverwerking? | 2017:5.1.2, 2017:5.1.3, 2017:6.1.7, 2017:7.1.2, 2017:7.1.3, 2017:7.1.5, 2017:7.1.6, 2017:7.1.12, 2017:7.1.13, 2017:7.1.20, 2017:9.1.6, 2017:12.1.8, 2017:19.1, 2017:19.1.1, 2017:19.1.4, 2017:19.1.13, 2017:19.1.14, 2017:19.1.15, 2017:20.1.4 | — | — | — | gelijk | gelijk | — |
| 2017:test:053 | Waar vind ik stukken over woningen? | 2017:3.1.1, 2017:11.1.5, 2017:20.1.4 | — | — | — | gelijk | gelijk | — |
| 2017:test:054 | Waar zoek ik stukken over een vergunning? | 2017:11.1, 2017:11.1.2, 2017:11.1.6, 2017:11.1.12, 2017:11.1.15, 2017:11.2.1, 2017:11.3.1, 2017:12.1, 2017:12.1.10, 2017:12.2, 2017:19.1, 2017:21.1.1, 2017:21.1.2, 2017:24.1, 2017:24.1.1 | — | — | 1 | gelijk | beter | vergunning (voorstel_niet_activeren) |
| 2020:test:001 | De gemeente stelt een nieuw organisatieonderdeel in. Waar zoek ik? | 2020:1 | — | — | — | gelijk | gelijk | — |
| 2020:test:002 | Waar vind ik het opstellen van een gemeentelijke verordening? | 2020:2 | — | — | — | gelijk | gelijk | — |
| 2020:test:003 | Waar valt het opstellen van een beleidsplan onder? | 2020:3 | — | — | — | gelijk | gelijk | — |
| 2020:test:004 | Waar zoek ik een evaluatie van uitgevoerd gemeentelijk beleid? | 2020:4 | — | 1 | 1 | beter | gelijk | Uitgevoerd (brongetoetst) |
| 2020:test:005 | De gemeente levert een product aan een inwoner. Welk procestype past als zoekrichting? | 2020:5 | — | — | — | gelijk | gelijk | — |
| 2020:test:006 | Een inwoner vraagt de gemeente iets te doen of te laten. Waar zoek ik? | 2020:6 | — | — | — | gelijk | gelijk | — |
| 2020:test:007 | Een inwoner doet een wettelijk verplichte aangifte bij de gemeente. Waar zoek ik? | 2020:7 | — | — | — | gelijk | gelijk | — |
| 2020:test:008 | Waar vind ik het verstrekken van een financiële voorziening? | 2020:8 | — | — | — | gelijk | gelijk | — |
| 2020:test:009 | Waar zoek ik het toekennen van een juridische status? | 2020:9 | — | — | — | gelijk | gelijk | — |
| 2020:test:010 | Waar vind ik het opleggen van een gemeentelijke heffing? | 2020:10 | — | — | — | gelijk | gelijk | — |
| 2020:test:011 | Een inwoner vraagt toestemming voor een activiteit. Waar zoek ik? | 2020:11 | — | — | 1 | gelijk | beter | toestemming (voorstel_niet_activeren) |
| 2020:test:012 | De gemeente controleert of voorschriften worden nageleefd. Waar zoek ik? | 2020:12 | — | — | — | gelijk | gelijk | — |
| 2020:test:013 | Waar zoek ik het behandelen van een geschil met een inwoner? | 2020:13 | — | — | — | gelijk | gelijk | — |
| 2020:test:014 | Waar vind ik het inrichten van de openbare ruimte? | 2020:14 | — | — | — | gelijk | gelijk | — |
| 2020:test:015 | Waar zoek ik het onderhouden of repareren van een gemeentelijk object? | 2020:15 | — | — | — | gelijk | gelijk | — |
| 2020:test:016 | Waar vind ik het aangaan van een overeenkomst door de gemeente? | 2020:16 | — | — | — | gelijk | gelijk | — |
| 2020:test:017 | Waar zoek ik het aanstellen van een medewerker? | 2020:17 | — | — | — | gelijk | gelijk | — |
| 2020:test:018 | Waar vind ik het betalen van een factuur of innen van een vordering? | 2020:18 | — | — | — | gelijk | gelijk | — |
| 2020:test:019 | Waar zoek ik het administratief verwerken van gegevens zonder inhoudelijke toets? | 2020:19 | — | — | — | gelijk | gelijk | — |
| 2020:test:020 | De gemeente verstrekt informatie. Welk procestype is een zoekrichting? | 2020:20 | — | — | — | gelijk | gelijk | — |
| 2020:test:021 | Waar zoek ik een door de gemeente uitgebracht advies? | 2020:21 | — | — | — | gelijk | gelijk | — |
| 2020:test:022 | De gemeente organiseert een gebeurtenis. Waar zoek ik? | 2020:22 | — | — | — | gelijk | gelijk | — |
| 2020:test:023 | De gemeente vraagt zelf een voorziening aan. Waar zoek ik? | 2020:23 | — | — | — | gelijk | gelijk | — |
| 2020:test:024 | De gemeente vraagt zelf toestemming aan een andere instantie. Waar zoek ik? | 2020:24 | — | — | 8 | gelijk | beter | toestemming (voorstel_niet_activeren) |
| 2020:test:025 | Een toezichthouder controleert de gemeente. Waar zoek ik? | 2020:25 | — | — | — | gelijk | gelijk | — |
| 2020:test:026 | De gemeente betwist een besluit van een ander bestuursorgaan. Waar zoek ik? | 2020:26 | — | — | — | gelijk | gelijk | — |
| 2020:test:027 | De gemeente vraagt zelf een status aan. Waar zoek ik? | 2020:27 | — | — | — | gelijk | gelijk | — |
| 2020:test:028 | De gemeente vraagt zelf een product of dienst aan. Waar zoek ik? | 2020:28 | — | 1 | 1 | beter | gelijk | Product of dienst (brongetoetst) |
| 2020:test:029 | De gemeente doet zelf aangifte. Waar zoek ik? | 2020:29 | — | — | — | gelijk | gelijk | — |
| 2020:test:030 | Waar vind ik stukken over het verstrekken van een subsidie? | 2020:8.1.7, 2020:8.1.8, 2020:23.1.1, 2020:23.1.2 | — | 1 | 1 | beter | gelijk | Subsidie (brongetoetst); Subsidie (voorstel_niet_activeren) |
| 2020:test:031 | Waar zoek ik een dossier over jeugdhulp? | 2020:3.1.4, 2020:3.3.1, 2020:8.1.2, 2020:8.3.2, 2020:12.1.12, 2020:12.2.9 | — | — | — | gelijk | gelijk | — |
| 2020:test:032 | Waar zoek ik stukken met de afkorting BRP? | 2020:1.1.3, 2020:4.1, 2020:5.1.2, 2020:6.1.7, 2020:7.1.2, 2020:7.1.4, 2020:7.1.9, 2020:7.1.10, 2020:7.1.15, 2020:7.1.16, 2020:9.1.6, 2020:9.1.11, 2020:12.1.6, 2020:15.1, 2020:15.1.4, 2020:19.1.15 | — | 1 | 1 | beter | gelijk | BRP (brongetoetst) |
| 2020:test:033 | Waar zoek ik documenten over een geboorteaangifte? | 2020:4.1.7, 2020:5.1.8, 2020:7.1.2, 2020:7.1.3, 2020:11.1.8, 2020:11.1.9, 2020:12.1.3 | — | — | — | gelijk | gelijk | — |
| 2020:test:034 | Waar zoek ik het verwerken van overlijdensgegevens? | 2020:4.1.10, 2020:7.1.6 | — | — | — | gelijk | gelijk | — |
| 2020:test:035 | Waar vind ik stukken over een verkiezing? | 2020:6.1.14, 2020:19.1.17, 2020:22.1.2 | — | 1 | 1 | beter | gelijk | Verkiezing (brongetoetst) |
| 2020:test:036 | Waar zoek ik stukken over een referendum? | 2020:22.1.3 | — | 1 | 1 | beter | gelijk | Referendum (brongetoetst) |
| 2020:test:037 | Waar vind ik stukken over een bestemmingsplan? | 2020:6.1.11, 2020:6.2.1, 2020:9.1.3, 2020:11.1.11 | — | 1 | 1 | beter | gelijk | Bestemmingsplan (brongetoetst) |
| 2020:test:038 | Waar zoek ik een bodemonderzoek? | 2020:11.1.11 | — | — | — | gelijk | gelijk | — |
| 2020:test:039 | Waar zoek ik toestemming voor sanering van tanks? | 2020:11.1.16 | — | — | — | gelijk | gelijk | — |
| 2020:test:040 | Waar vind ik de verantwoording van archiefvernietiging? | 2020:19.1.18, 2020:24.1.2 | — | 1 | 1 | beter | gelijk | Archiefvernietiging (brongetoetst) |
| 2020:test:041 | Waar zoek ik stukken van een sollicitatieprocedure? | 2020:17.2.1, 2020:17.2.2 | — | — | — | gelijk | gelijk | — |
| 2020:test:042 | Waar zoek ik stukken over personeel? | 2020:4.1.6, 2020:4.1.14, 2020:4.1.15, 2020:6.1.1, 2020:9.1, 2020:12.2, 2020:17.1, 2020:17.5 | — | — | — | gelijk | gelijk | — |
| 2020:test:043 | Waar vind ik stukken over leerplicht? | 2020:4.1.9, 2020:11.1.2, 2020:11.1.8, 2020:12.1.3 | — | 1 | 1 | beter | gelijk | Leerplicht (brongetoetst) |
| 2020:test:044 | Waar vind ik een automatische incasso? | 2020:24.1.3, 2020:24.4.1 | — | 1 | 1 | beter | gelijk | Automatische incasso (brongetoetst) |
| 2020:test:045 | Waar zoek ik gegevens over een reisdocument? | 2020:5.1.4, 2020:5.1.5, 2020:5.2.1, 2020:7.1.11, 2020:7.1.12, 2020:19.1.19 | — | 1 | 1 | beter | gelijk | Reisdocument (brongetoetst) |
| 2020:test:046 | Waar zoek ik stukken waarin Wmo staat? | 2020:3.1.1, 2020:3.1.5, 2020:3.3.1, 2020:8.1.1, 2020:8.3.1, 2020:12.1.2, 2020:12.2.6 | — | 1 | 1 | beter | gelijk | WMO (brongetoetst) |
| 2020:test:047 | Waar vind ik stukken over een monument? | 2020:9.1.2, 2020:11.1.6, 2020:15.1.2, 2020:27.1.1 | — | 1 | 1 | beter | gelijk | Monument (brongetoetst) |
| 2020:test:048 | Waar zoek ik een rioleringsplan? | 2020:3.1.1, 2020:3.1.2, 2020:14.1.1 | — | — | — | gelijk | gelijk | — |
| 2020:test:049 | Waar vind ik stukken over gemeentelijke belastingen? | 2020:6.1.1, 2020:10.1, 2020:18.1, 2020:18.3, 2020:19.1.2 | — | — | — | gelijk | gelijk | — |
| 2020:test:050 | Waar zoek ik een bezwaarschrift? | 2020:13.1, 2020:13.1.3, 2020:26.1 | — | — | — | gelijk | gelijk | — |
| 2020:test:051 | Waar zoek ik een contract of overeenkomst? | 2020:16.1, 2020:16.1.1, 2020:16.1.2, 2020:16.1.4, 2020:16.2.1, 2020:16.3.1 | — | — | — | gelijk | gelijk | — |
| 2020:test:052 | Waar vind ik stukken over een register? | 2020:7.1.2, 2020:7.1.3, 2020:7.1.5, 2020:7.1.6, 2020:7.1.13, 2020:7.1.21, 2020:19.1.4 | — | — | — | gelijk | gelijk | — |
| 2020:test:053 | Waar zoek ik stukken over gegevensverwerking? | 2020:5.1.2, 2020:5.1.3, 2020:6.1.7, 2020:6.1.13, 2020:7.1.2, 2020:7.1.3, 2020:7.1.5, 2020:7.1.6, 2020:7.1.12, 2020:7.1.13, 2020:9.1.6, 2020:12.1.8, 2020:19.1, 2020:19.1.1, 2020:19.1.4, 2020:19.1.14, 2020:19.1.15, 2020:19.1.19, 2020:19.1.20, 2020:19.1.21, 2020:19.1.24, 2020:20.1.4 | — | — | — | gelijk | gelijk | — |
| 2020:test:054 | Waar vind ik stukken over woningen? | 2020:3.1.1, 2020:11.1.5, 2020:20.1.4 | — | — | — | gelijk | gelijk | — |
| 2020:test:055 | Waar zoek ik stukken over een vergunning? | 2020:6.1.13, 2020:11.1, 2020:11.1.2, 2020:11.1.6, 2020:11.1.12, 2020:11.1.15, 2020:11.3.2, 2020:12.1, 2020:12.1.10, 2020:12.1.11, 2020:12.2, 2020:19.1, 2020:21.1.1, 2020:21.1.2, 2020:24.1, 2020:24.1.1 | — | — | 1 | gelijk | beter | vergunning (voorstel_niet_activeren); Vergunning (voorstel_niet_activeren) |

## Interpretatie en beperkingen

Lexiconverrijking kan praktijktermen zoals notulen, personeelsdossier of subsidiedossier verbinden met een andere officiële benaming zonder alle overige woorden van een zin in hetzelfde bronrecord te eisen. Dit herkent een vooraf vastgelegde term, niet de bedoeling van de hele vraag. Een brede of meerduidige term kan extra onjuiste zoekrichtingen opleveren. De derde variant toont het effect van onbevestigde voorstellen, maar is geen vrijgave daarvan. Ook een beter eerste bekend resultaat bewijst geen hogere precision.

Bredere/smallere semantische relaties ontbreken in dit pakket; de structurele kind-ouderrelatie wordt niet als betekenisuitbreiding gebruikt. Ontbrekende afkortingen of alternatieven worden niet verzonnen. Voor een latere kwantitatieve evaluatie zijn aanvullende, onafhankelijke en voldoende volledige relevantieoordelen nodig, met aandacht voor meerduidigheid, niet-uitputtende alternatieven en technische voorschriften onder een rubriek.
