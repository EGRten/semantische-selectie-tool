# Integrale zoekkwaliteitsanalyse

Onderzocht op 11 november 2026, uitgangscommit `22eb7af`. Alle 164 oorspronkelijke testvragen en beide zoekmodules zijn onderzocht. De [A/B/C/D-vergelijking](zoekkwaliteit-vergelijking.md) en [JSON-diagnose](zoekkwaliteit-diagnose.json) zijn reproduceerbaar via `npm run onderzoek:zoekkwaliteit` na een build. De classificaties hieronder zijn technische waarnemingen en inhoudelijke beoordelingshypothesen, geen nieuwe semantische relaties of onafhankelijk gevalideerde relevantieoordelen.

## Problemen, oorzaken en maatregelen

De oorspronkelijke AND-functie eiste ook vraagwoorden en contextwoorden. Daardoor werden volledige zinnen vaak niet gevonden, terwijl begripszoeken één ingebedde term kon gebruiken. Variant A blijft onveranderd beschikbaar; B verwijdert gewone vraagwoorden en behandelt document-/bewaarvraagkaders alleen als kader wanneer er andere inhoudelijke termen zijn. De inhoudelijke kernwoorden blijven met AND gecombineerd: er is geen algemene OR-terugval op één bekend woord. Onbekende inhoudelijke woorden blijven een reden voor nul resultaten.

B vergelijkt beperkte woordvormen (-en, -s, adjectivale -e) en kan aangrenzende bronwoorden verbinden voor een lang samengesteld woord. Een lang querywoord kan alleen in twee delen worden gesplitst wanneer beide delen werkelijk als woorden in hetzelfde officiële corpus voorkomen; beide moeten binnen een eigen bronveld matchen. Dit is mechanische tekstvergelijking, geen synonymengeneratie of nieuw lexicon. Regels met alleen een generieke term moeten die als heel woord, beperkte woordvorm of herkenbaar samenstellingsdeel in naam/omschrijving bevatten, niet toevallig ergens in een lange toelichting.

Ouderbenamingen mogen ontbrekende contextwoorden aanvullen uitsluitend als een niet-generiek kernwoord al in de eigen tekst matcht. Een ouder kan nooit alleen een kind activeren; procesomschrijvingen worden niet over alle kinderen gekopieerd. De verklaring vermeldt contextgebruik. Exacte codes en namen houden hun oorspronkelijke prioriteit; gedeelde codes blijven afzonderlijke technische voorschriften.

Negaties worden niet als betekenisloze stopwoorden weggegooid. Een negatieve vraag vereist een negatieve primaire resultaatcontext; een positieve resultaatnaam wordt niet aan haar gelijknamige negatieve tegenhanger gelijkgesteld. De letterlijke code blijft altijd opvraagbaar. De losstaande lexiconingang ‘niet’ wordt nooit gevolgd. Andere brede losse ingangen worden alleen als lexiconuitbreiding gevolgd wanneer de hele opdracht precies die ingang is; in een specifieke langere vraag mogen zij geen ongerichte extra dossiers activeren. Volledige officiële frases zoals ‘Niet toegekend’ blijven beschikbaar. Complexe negatie en ‘niet alleen’ worden niet taalkundig geïnterpreteerd en vereisen contextbeoordeling.

## Classificaties

Meerdere classificaties per vraag zijn mogelijk. Codes verwijzen naar de volledige probleemtaxonomie uit de opdracht. Een indicatie van lage positie bewijst geen fout zolang de relevante set niet onafhankelijk vaststaat.

| Code | Probleem / beoordelingscategorie | Vragen met indicatie |
| ---: | --- | ---: |
| 1 | Geen passende officiële tekstovereenkomst | 156 |
| 2 | Te strenge combinatie van zoekwoorden | 73 |
| 3 | Onvoldoende normalisatie | 8 |
| 4 | Ontbrekende zoekterm in het lexicon | 61 |
| 5 | Bestaande lexiconrelatie niet toegelaten | 12 |
| 6 | Onjuiste of te lage rangschikking | 2 |
| 7 | Te algemene zoekterm | 79 |
| 8 | Onvoldoende onderscheid tussen resultaten | 16 |
| 9 | Verwijzing naar hoger structuurniveau | 113 |
| 10 | Ontbrekende context of dubbelzinnige zoekvraag | 113 |
| 11 | Onvolledige of onvoldoende gecontroleerde relevantieoordelen | 164 |

| Vraag | Ongewijzigde zoekvraag | Classificatiecodes | Technisch versus inhoudelijk |
| --- | --- | --- | --- |
| 1996-2012:test:001 | Waar bewaar ik de notulen van de gemeenteraad? | 1, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:002 | Hoe lang bewaren we presentielijsten van vergaderingen? | 1, 2, 7, 9, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:003 | Wat doe ik met een gemeentegids? | 1, 2, 9, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:004 | Moet de oude gemeentelijke website worden bewaard? | 1, 4, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:005 | Hoe lang bewaar je een ingetrokken vergunningaanvraag? | 1, 4, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:006 | Waar vallen niet-ontvankelijke aanvragen onder? | 1, 2, 3, 5, 7, 9, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:007 | Archiefinspectierapport: bewaren of vernietigen? | 1, 2, 7, 9, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:008 | Bestuurlijke boete dossier | 1, 2, 7, 9, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:009 | Documentair structuurplan / DSP | 1, 4, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:010 | Metadata van te bewaren dossiers | 1, 2, 5, 7, 8, 9, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:011 | Convenant met buurgemeenten | 1, 4, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:012 | Beleidsnotitie vastgesteld door college | 1, 4, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:013 | Subsidiedossier jaarlijkse subsidie | 1, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:014 | Ontvangen ESF subsidie | 1, 4, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:015 | Bezwaarschrift tegen besluit | 1, 4, 7, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:016 | Jaarverslag bezwaarschriftencommissie | 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:017 | Voorbereiding gemeentebegroting | 1, 4, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:018 | SISA-tabellen jaarrekening | 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:019 | Controlerapport jaarrekening | 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:020 | WOZ / belastingaangifte | 1, 4, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:021 | Personeelsdossier medewerker | 1, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:022 | Sollicitatiebrief niet aangenomen kandidaat | 1, 5, 7, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:023 | Functiewaardering | 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:024 | Loonadministratie / salarisadministratie | 1, 8, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:025 | RI&E arbobeleid | 8, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:026 | Aankoop van gemeentelijke grond | 1, 2, 9, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:027 | Notulen bouwvergadering monument | 5, 8, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:028 | Erfpachtakte / zakelijk recht | 1, 4, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:029 | Bruikleen kunstwerk aan museum | 1, 4, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:030 | BAG brondocument straatnaam | 1, 8, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:031 | Processen-verbaal verkiezingen N10 | 1, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:032 | Mandaatbesluit bestuurder aan ambtenaar | 1, 4, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:033 | Bestemmingsplan met zienswijzen | 1, 4, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:034 | Bouwvergunning woning | 1, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:035 | Sloopmelding | 1, 3, 8, 9, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:036 | Akten burgerlijke stand | 8, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:037 | GBA persoonslijst / persoonsregister | 1, 8, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:038 | Naturalisatie / Nederlanderschap | 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:039 | Paspoortaanvraag | 1, 4, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:040 | Rijbewijsaanvraag | 1, 4, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:041 | Waar vind ik stukken over het verstrekken van een subsidie? | 1, 4, 7, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:042 | Waar zoek ik een dossier over jeugdhulp? | 1, 2, 7, 8, 9, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:043 | Waar zoek ik documenten over een geboorteaangifte? | 1, 4, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:044 | Waar zoek ik het verwerken van overlijdensgegevens? | 1, 4, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:045 | Waar vind ik stukken over een verkiezing? | 1, 2, 7, 8, 9, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:046 | Waar vind ik stukken over een bestemmingsplan? | 1, 2, 7, 8, 9, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:047 | Waar zoek ik een bodemonderzoek? | 1, 2, 9, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:048 | Waar zoek ik stukken van een sollicitatieprocedure? | 1, 4, 7, 9, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:049 | Waar zoek ik stukken over personeel? | 1, 2, 7, 8, 9, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:050 | Waar zoek ik gegevens over een reisdocument? | 1, 2, 8, 9, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:051 | Waar zoek ik stukken waarin Wmo staat? | 1, 2, 7, 8, 9, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:052 | Waar vind ik stukken over een monument? | 1, 2, 7, 8, 9, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:053 | Waar zoek ik een rioleringsplan? | 1, 2, 9, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:054 | Waar zoek ik een bezwaarschrift? | 1, 2, 9, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 1996-2012:test:055 | Waar zoek ik een contract of overeenkomst? | 1, 2, 8, 9, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:001 | De gemeente stelt een nieuw organisatieonderdeel in. Waar zoek ik? | 1, 3, 4, 7, 9, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:002 | Waar vind ik het opstellen van een gemeentelijke verordening? | 1, 4, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:003 | Waar valt het opstellen van een beleidsplan onder? | 1, 2, 9, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:004 | Waar zoek ik een evaluatie van uitgevoerd gemeentelijk beleid? | 1, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:005 | De gemeente levert een product aan een inwoner. Welk procestype past als zoekrichting? | 1, 4, 7, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:006 | Een inwoner vraagt de gemeente iets te doen of te laten. Waar zoek ik? | 1, 4, 7, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:007 | Een inwoner doet een wettelijk verplichte aangifte bij de gemeente. Waar zoek ik? | 1, 3, 4, 7, 9, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:008 | Waar vind ik het verstrekken van een financiële voorziening? | 1, 2, 9, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:009 | Waar zoek ik het toekennen van een juridische status? | 1, 4, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:010 | Waar vind ik het opleggen van een gemeentelijke heffing? | 1, 2, 9, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:011 | Een inwoner vraagt toestemming voor een activiteit. Waar zoek ik? | 1, 5, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:012 | De gemeente controleert of voorschriften worden nageleefd. Waar zoek ik? | 1, 4, 7, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:013 | Waar zoek ik het behandelen van een geschil met een inwoner? | 1, 4, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:014 | Waar vind ik het inrichten van de openbare ruimte? | 1, 2, 9, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:015 | Waar zoek ik het onderhouden of repareren van een gemeentelijk object? | 1, 4, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:016 | Waar vind ik het aangaan van een overeenkomst door de gemeente? | 1, 2, 7, 9, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:017 | Waar zoek ik het aanstellen van een medewerker? | 1, 4, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:018 | Waar vind ik het betalen van een factuur of innen van een vordering? | 1, 4, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:019 | Waar zoek ik het administratief verwerken van gegevens zonder inhoudelijke toets? | 1, 4, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:020 | De gemeente verstrekt informatie. Welk procestype is een zoekrichting? | 1, 2, 6, 7, 9, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:021 | Waar zoek ik een door de gemeente uitgebracht advies? | 1, 4, 7, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:022 | De gemeente organiseert een gebeurtenis. Waar zoek ik? | 1, 2, 7, 9, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:023 | De gemeente vraagt zelf een voorziening aan. Waar zoek ik? | 1, 4, 7, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:024 | De gemeente vraagt zelf toestemming aan een andere instantie. Waar zoek ik? | 1, 5, 7, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:025 | Een toezichthouder controleert de gemeente. Waar zoek ik? | 1, 4, 7, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:026 | De gemeente betwist een besluit van een ander bestuursorgaan. Waar zoek ik? | 1, 4, 7, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:027 | De gemeente vraagt zelf een status aan. Waar zoek ik? | 1, 4, 7, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:028 | De gemeente vraagt zelf een product of dienst aan. Waar zoek ik? | 1, 7, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:029 | De gemeente doet zelf aangifte. Waar zoek ik? | 1, 4, 7, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:030 | Waar vind ik stukken over het verstrekken van een subsidie? | 1, 2, 7, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:031 | Waar zoek ik een dossier over jeugdhulp? | 1, 2, 5, 7, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:032 | Waar zoek ik stukken met de afkorting BRP? | 1, 7, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:033 | Waar zoek ik documenten over een geboorteaangifte? | 1, 2, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:034 | Waar zoek ik het verwerken van overlijdensgegevens? | 1, 3, 4, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:035 | Waar vind ik stukken over een verkiezing? | 1, 2, 7, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:036 | Waar zoek ik stukken over een referendum? | 1, 2, 7, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:037 | Waar vind ik stukken over een bestemmingsplan? | 1, 2, 7, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:038 | Waar zoek ik een bodemonderzoek? | 1, 2, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:039 | Waar zoek ik toestemming voor sanering van tanks? | 1, 2, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:040 | Waar vind ik de verantwoording van archiefvernietiging? | 1, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:041 | Waar zoek ik stukken van een sollicitatieprocedure? | 1, 4, 7, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:042 | Waar zoek ik stukken over personeel? | 1, 2, 7, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:043 | Waar vind ik stukken over leerplicht? | 1, 2, 7, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:044 | Waar zoek ik gegevens over een reisdocument? | 1, 2, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:045 | Waar zoek ik stukken waarin Wmo staat? | 1, 2, 7, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:046 | Waar vind ik stukken over een monument? | 1, 2, 7, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:047 | Waar zoek ik een rioleringsplan? | 1, 2, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:048 | Waar vind ik stukken over gemeentelijke belastingen? | 1, 2, 7, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:049 | Waar zoek ik een bezwaarschrift? | 1, 2, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:050 | Waar zoek ik een contract of overeenkomst? | 1, 2, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:051 | Waar vind ik stukken over een register? | 1, 2, 7, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:052 | Waar zoek ik stukken over gegevensverwerking? | 1, 4, 7, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:053 | Waar vind ik stukken over woningen? | 1, 2, 3, 7, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2017:test:054 | Waar zoek ik stukken over een vergunning? | 1, 2, 5, 7, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:001 | De gemeente stelt een nieuw organisatieonderdeel in. Waar zoek ik? | 1, 4, 7, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:002 | Waar vind ik het opstellen van een gemeentelijke verordening? | 1, 4, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:003 | Waar valt het opstellen van een beleidsplan onder? | 1, 2, 9, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:004 | Waar zoek ik een evaluatie van uitgevoerd gemeentelijk beleid? | 1, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:005 | De gemeente levert een product aan een inwoner. Welk procestype past als zoekrichting? | 1, 4, 7, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:006 | Een inwoner vraagt de gemeente iets te doen of te laten. Waar zoek ik? | 1, 4, 7, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:007 | Een inwoner doet een wettelijk verplichte aangifte bij de gemeente. Waar zoek ik? | 1, 3, 4, 7, 9, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:008 | Waar vind ik het verstrekken van een financiële voorziening? | 1, 2, 9, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:009 | Waar zoek ik het toekennen van een juridische status? | 1, 4, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:010 | Waar vind ik het opleggen van een gemeentelijke heffing? | 1, 2, 9, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:011 | Een inwoner vraagt toestemming voor een activiteit. Waar zoek ik? | 1, 5, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:012 | De gemeente controleert of voorschriften worden nageleefd. Waar zoek ik? | 1, 4, 7, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:013 | Waar zoek ik het behandelen van een geschil met een inwoner? | 1, 4, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:014 | Waar vind ik het inrichten van de openbare ruimte? | 1, 2, 9, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:015 | Waar zoek ik het onderhouden of repareren van een gemeentelijk object? | 1, 4, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:016 | Waar vind ik het aangaan van een overeenkomst door de gemeente? | 1, 2, 7, 9, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:017 | Waar zoek ik het aanstellen van een medewerker? | 1, 4, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:018 | Waar vind ik het betalen van een factuur of innen van een vordering? | 1, 4, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:019 | Waar zoek ik het administratief verwerken van gegevens zonder inhoudelijke toets? | 1, 4, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:020 | De gemeente verstrekt informatie. Welk procestype is een zoekrichting? | 1, 2, 6, 7, 9, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:021 | Waar zoek ik een door de gemeente uitgebracht advies? | 1, 4, 7, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:022 | De gemeente organiseert een gebeurtenis. Waar zoek ik? | 1, 2, 7, 9, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:023 | De gemeente vraagt zelf een voorziening aan. Waar zoek ik? | 1, 4, 7, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:024 | De gemeente vraagt zelf toestemming aan een andere instantie. Waar zoek ik? | 1, 5, 7, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:025 | Een toezichthouder controleert de gemeente. Waar zoek ik? | 1, 4, 7, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:026 | De gemeente betwist een besluit van een ander bestuursorgaan. Waar zoek ik? | 1, 4, 7, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:027 | De gemeente vraagt zelf een status aan. Waar zoek ik? | 1, 4, 7, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:028 | De gemeente vraagt zelf een product of dienst aan. Waar zoek ik? | 1, 7, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:029 | De gemeente doet zelf aangifte. Waar zoek ik? | 1, 4, 7, 9, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:030 | Waar vind ik stukken over het verstrekken van een subsidie? | 1, 2, 5, 7, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:031 | Waar zoek ik een dossier over jeugdhulp? | 1, 2, 7, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:032 | Waar zoek ik stukken met de afkorting BRP? | 1, 7, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:033 | Waar zoek ik documenten over een geboorteaangifte? | 1, 2, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:034 | Waar zoek ik het verwerken van overlijdensgegevens? | 1, 4, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:035 | Waar vind ik stukken over een verkiezing? | 1, 2, 7, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:036 | Waar zoek ik stukken over een referendum? | 1, 2, 7, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:037 | Waar vind ik stukken over een bestemmingsplan? | 1, 2, 7, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:038 | Waar zoek ik een bodemonderzoek? | 1, 2, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:039 | Waar zoek ik toestemming voor sanering van tanks? | 1, 2, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:040 | Waar vind ik de verantwoording van archiefvernietiging? | 1, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:041 | Waar zoek ik stukken van een sollicitatieprocedure? | 1, 4, 7, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:042 | Waar zoek ik stukken over personeel? | 1, 2, 7, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:043 | Waar vind ik stukken over leerplicht? | 1, 2, 7, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:044 | Waar vind ik een automatische incasso? | 1, 2, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:045 | Waar zoek ik gegevens over een reisdocument? | 1, 2, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:046 | Waar zoek ik stukken waarin Wmo staat? | 1, 2, 7, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:047 | Waar vind ik stukken over een monument? | 1, 2, 7, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:048 | Waar zoek ik een rioleringsplan? | 1, 2, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:049 | Waar vind ik stukken over gemeentelijke belastingen? | 1, 2, 7, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:050 | Waar zoek ik een bezwaarschrift? | 1, 2, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:051 | Waar zoek ik een contract of overeenkomst? | 1, 2, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:052 | Waar vind ik stukken over een register? | 1, 2, 7, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:053 | Waar zoek ik stukken over gegevensverwerking? | 1, 4, 7, 10, 11 | Geen bewezen technische oplossing; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:054 | Waar vind ik stukken over woningen? | 1, 2, 3, 7, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |
| 2020:test:055 | Waar zoek ik stukken over een vergunning? | 1, 2, 5, 7, 10, 11 | Technische matchingkandidaat; inhoudelijke relevantiebeoordeling blijft nodig |

Concrete bewijzen en betrokken querywoorden/term-IDs staan per vraag in JSON. ‘Ontbrekende zoekterm’ betekent uitsluitend dat geen bestaande passende ingang naar een opgegeven verwachting is aangetroffen; er wordt geen nieuwe relatie verondersteld of voorgesteld als waarheid.

## Brede termen: daadwerkelijke data en effecten

De onderstaande lexiconaantallen zijn exacte genormaliseerde ingangen, geen willekeurige deelwoordtelling. Statusgroepen staan in JSON. ‘Oud D’ toont de oorspronkelijke begripslogica met opt-in; A/B/C/D tonen de nieuwe eerlijke varianten bij uitsluitend dit woord. ‘Niet’ is een negatie; aanvraag/vergunning/besluit/dossier/zaak/rapport zijn brede vakbegrippen; stukken/gemeente zijn vaak vraagkader; bewaren/vernietigen kunnen vraaghandelingen of inhoudelijke termen zijn. Context bepaalt het gebruik. Geen datasetrecord is aangepast.

| Lijst | Woord | Bestaande lexiconkoppelingen | Oud D | A | B | C | D |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1996-2012 | niet | 28 | 29 | 29 | 0 | 0 | 0 |
| 1996-2012 | aanvraag | 0 | 4 | 4 | 4 | 4 | 4 |
| 1996-2012 | vergunning | 21 | 22 | 22 | 17 | 17 | 22 |
| 1996-2012 | besluit | 0 | 27 | 27 | 18 | 18 | 18 |
| 1996-2012 | dossier | 7 | 7 | 7 | 5 | 5 | 7 |
| 1996-2012 | zaak | 0 | 9 | 9 | 9 | 9 | 9 |
| 1996-2012 | rapport | 16 | 17 | 17 | 2 | 2 | 16 |
| 1996-2012 | stukken | 0 | 5 | 5 | 5 | 5 | 5 |
| 1996-2012 | gemeente | 0 | 53 | 53 | 22 | 22 | 22 |
| 1996-2012 | bewaren | 0 | 5 | 5 | 5 | 5 | 5 |
| 1996-2012 | vernietigen | 0 | 1 | 1 | 1 | 1 | 1 |
| 2017 | niet | 37 | 48 | 47 | 0 | 0 | 0 |
| 2017 | aanvraag | 0 | 2 | 2 | 1 | 1 | 1 |
| 2017 | vergunning | 15 | 15 | 15 | 7 | 7 | 15 |
| 2017 | besluit | 0 | 9 | 9 | 2 | 2 | 2 |
| 2017 | dossier | 0 | 0 | 0 | 0 | 0 | 0 |
| 2017 | zaak | 0 | 1 | 1 | 1 | 1 | 1 |
| 2017 | rapport | 0 | 4 | 4 | 3 | 3 | 3 |
| 2017 | stukken | 0 | 2 | 2 | 1 | 1 | 1 |
| 2017 | gemeente | 0 | 13 | 13 | 1 | 1 | 1 |
| 2017 | bewaren | 0 | 4 | 4 | 2 | 2 | 2 |
| 2017 | vernietigen | 0 | 5 | 5 | 0 | 0 | 0 |
| 2020 | niet | 0 | 57 | 57 | 0 | 0 | 0 |
| 2020 | aanvraag | 0 | 2 | 2 | 1 | 1 | 1 |
| 2020 | vergunning | 32 | 16 | 16 | 7 | 7 | 16 |
| 2020 | besluit | 9 | 9 | 9 | 3 | 3 | 9 |
| 2020 | dossier | 0 | 0 | 0 | 0 | 0 | 0 |
| 2020 | zaak | 1 | 1 | 1 | 1 | 1 | 1 |
| 2020 | rapport | 0 | 4 | 4 | 3 | 3 | 3 |
| 2020 | stukken | 0 | 2 | 2 | 1 | 1 | 1 |
| 2020 | gemeente | 0 | 14 | 14 | 1 | 1 | 1 |
| 2020 | bewaren | 3 | 4 | 4 | 2 | 2 | 3 |
| 2020 | vernietigen | 5 | 5 | 5 | 0 | 0 | 5 |

## AI-beoordelingsstatus: herkomst onderzocht

`brongetoetst`, `brononderbouwd_gecontroleerd` en `mechanisch_gecontroleerd` blijven onderscheiden van de twee AI-statussen. `documentatie/gegevensspecificatie.md` omschrijft `voorstel_inhoudelijk_beoordeeld_zoekrichting` als plausibiliteitsbeoordeling, niet als officieel synoniem. `scripts/bronopbouw/enrich_revision.py:42` schrijft die status programmatisch bij vooraf opgenomen praktijkingangen. `scripts/bronopbouw/review_handoff.py:157` maakt vervolgens menselijke controlevelden aan met ‘Niet beoordeeld’. Het daadwerkelijke Controlewerkboek bevat 4.093 zoekverrijkingsregels en 164 zoekvragen met die waarde. `controle/bevestigingen-gebruiker.json` bevestigt zeven specifieke bronafwijkingen, niet de semantische zoekrichtingen.

Daarom is onafhankelijke menselijke goedkeuring van de 25 beoordeelde AI-zoekrichtingen niet aangetoond. De herkomst wijst op vastgelegde, AI-ondersteunde plausibiliteitscontrole; niet bewezen is wie iedere beoordeling inhoudelijk uitvoerde. Dit blijft onzeker en wordt in de interface expliciet benoemd. Statusvelden zijn niet gewijzigd. C behoudt de bestaande expliciete toelating; de gevoeligheidsvariant C-zonder-beoordeelde-AI toont hun afzonderlijke effect. D voegt alleen de andere, onbevestigde AI-groep toe. Een bron of hoge betrouwbaarheidsscore vervangt nooit de vereiste statuscontrole van zowel term als relatie.

## Per selectielijst en resterende risico's

1996/2012 gebruikt rubrieken met meerdere technische voorschriften; een rubriektreffer is geen gekozen juridische regel. Bij 2017/2020 zijn procesrol en generiek/specifiek onderscheid essentieel. De vergelijking bewaart zowel exacte ID-posities als posities binnen een vooraf genoemde categorie. Die scopevergelijking is diagnostisch en maakt geen concordans of automatische toepasselijkheidsbeslissing.

De oorspronkelijke 164 vragen zijn niet onafhankelijk volledig geannoteerd. Alle gevallen behouden daarom categorie 11; er worden geen Precision@5/Recall@5/Recall@10/MRR-cijfers gefabriceerd. De aparte set van 45 vragen heeft uitsluitend ‘te beoordelen’-oordelen en telt niet als grondwaarheid mee. Woordvormregels kunnen onbedoelde tekstoverlap vinden; compounds hebben geen gegarandeerde juridische betekenis. Ontbrekende afkortingen, historie of semantische ingangen vragen inhoudelijk werk en worden niet verzonnen. Zoektermen kunnen breed of dubbelzinnig blijven, en nieuw gevonden resultaten zijn niet automatisch juist.

De oorspronkelijke zoeklogica en normalisatie zijn met bronhashes bewaard in `src/zoeken/oorspronkelijk.ts` en `tests/data/zoekkwaliteit-uitgangsversie.json`; de oude begripsvariant blijft eveneens reproduceerbaar. De historische rapporten worden niet stilzwijgend herschreven. Geen officiële gegevens, relaties, beoordelingsstatussen, externe AI-dienst, backend, embeddings of Sites-integratie toegevoegd of gewijzigd.
