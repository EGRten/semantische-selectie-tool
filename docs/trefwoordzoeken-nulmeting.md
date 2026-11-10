# Nulmeting klassiek trefwoordzoeken

Reproduceerbaar met `npm run nulmeting -- --output docs/trefwoordzoeken-nulmeting.md` na `npm run build`. Alle 164 bestaande testvragen en verwachte categorieën zijn ongewijzigd gebruikt. Deze meting gebruikt uitsluitend officiële teksten, niet de semantische zoeklexicons.

De volledige vraag wordt letterlijk met EN tussen alle woorden gezocht, zonder verwijdering van vraagwoorden of betekenisinterpretatie. Een tweede controle gebruikt uitsluitend het bestaande `controleerbaar_bronfragment`. Een treffer betekent hier dat een vooraf genoemde relevante of alternatieve categorie als exact technisch ID in de resultaten staat; er is geen uitbreiding van zoekresultaten naar ouders of kinderen. De aanvullende scopecontrole kijkt alleen voor de evaluatie of een gevonden voorschrift via het bestaande ouderpad binnen een verwachte rubriek valt. Dit wijzigt geen verwachtingen en voegt geen zoekresultaten toe. De standaarduitsluiting van vervallen resultaten geldt. Dit is een vindbaarheidsmeting, geen toepasselijkheidsbeoordeling.

| Lijst | Vragen | Letterlijke vraag vindt verwachte categorie | Bronfragment vindt verwachte categorie | Missers met afwezige woorden | Bronfragment binnen verwachte categorie | Letterlijke vraag binnen categorie |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1996-2012 | 55 | 0 | 40 | 19 | 55 | 8 |
| 2017 | 54 | 0 | 54 | 25 | 54 | 0 |
| 2020 | 55 | 0 | 55 | 23 | 55 | 0 |

Een afwezig woord is ook bij gedeeltelijk tekstzoeken nergens in de gedocumenteerde officiële zoekvelden gevonden (gecontroleerd inclusief vervallen). Dat kan een andere formulering zijn, maar ook een vraagwoord, ontbrekend bronveld of een niet-herstelde woordafbreking; deze controle bewijst geen semantisch verschil. Woorden die ieder afzonderlijk voorkomen hoeven niet samen in hetzelfde onderdeel te staan. De resultaten hieronder zijn een nulmeting, geen aangepaste verwachte testuitkomsten.

| Vraag-ID | Ongewijzigde vraag | Resultaten | Verwachte categorie gevonden | Afwezige zoekwoorden | Diagnose | Bronfragment vindt categorie | Bronfragment binnen categorie |
| --- | --- | ---: | --- | --- | --- | --- | --- |
| 1996-2012:test:001 | Waar bewaar ik de notulen van de gemeenteraad? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 1996-2012:test:002 | Hoe lang bewaren we presentielijsten van vergaderingen? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 1996-2012:test:003 | Wat doe ik met een gemeentegids? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 1996-2012:test:004 | Moet de oude gemeentelijke website worden bewaard? | 0 | nee | website | Woorden ontbreken in zoekbereik | ja | ja |
| 1996-2012:test:005 | Hoe lang bewaar je een ingetrokken vergunningaanvraag? | 0 | nee | vergunningaanvraag | Woorden ontbreken in zoekbereik | ja | ja |
| 1996-2012:test:006 | Waar vallen niet-ontvankelijke aanvragen onder? | 0 | nee | ontvankelijke | Woorden ontbreken in zoekbereik | ja | ja |
| 1996-2012:test:007 | Archiefinspectierapport: bewaren of vernietigen? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 1996-2012:test:008 | Bestuurlijke boete dossier | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 1996-2012:test:009 | Documentair structuurplan / DSP | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 1996-2012:test:010 | Metadata van te bewaren dossiers | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 1996-2012:test:011 | Convenant met buurgemeenten | 0 | nee | buurgemeenten | Woorden ontbreken in zoekbereik | ja | ja |
| 1996-2012:test:012 | Beleidsnotitie vastgesteld door college | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 1996-2012:test:013 | Subsidiedossier jaarlijkse subsidie | 0 | nee | subsidiedossier | Woorden ontbreken in zoekbereik | ja | ja |
| 1996-2012:test:014 | Ontvangen ESF subsidie | 0 | nee | esf | Woorden ontbreken in zoekbereik | ja | ja |
| 1996-2012:test:015 | Bezwaarschrift tegen besluit | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 1996-2012:test:016 | Jaarverslag bezwaarschriftencommissie | 1 | nee | — | Voorschrift binnen verwachte categorie | ja | ja |
| 1996-2012:test:017 | Voorbereiding gemeentebegroting | 0 | nee | gemeentebegroting | Woorden ontbreken in zoekbereik | ja | ja |
| 1996-2012:test:018 | SISA-tabellen jaarrekening | 1 | nee | — | Voorschrift binnen verwachte categorie | ja | ja |
| 1996-2012:test:019 | Controlerapport jaarrekening | 1 | nee | — | Voorschrift binnen verwachte categorie | ja | ja |
| 1996-2012:test:020 | WOZ / belastingaangifte | 0 | nee | woz, belastingaangifte | Woorden ontbreken in zoekbereik | ja | ja |
| 1996-2012:test:021 | Personeelsdossier medewerker | 0 | nee | personeelsdossier, medewerker | Woorden ontbreken in zoekbereik | ja | ja |
| 1996-2012:test:022 | Sollicitatiebrief niet aangenomen kandidaat | 0 | nee | sollicitatiebrief, kandidaat | Woorden ontbreken in zoekbereik | ja | ja |
| 1996-2012:test:023 | Functiewaardering | 1 | nee | — | Voorschrift binnen verwachte categorie | ja | ja |
| 1996-2012:test:024 | Loonadministratie / salarisadministratie | 0 | nee | loonadministratie | Woorden ontbreken in zoekbereik | ja | ja |
| 1996-2012:test:025 | RI&E arbobeleid | 1 | nee | — | Voorschrift binnen verwachte categorie | ja | ja |
| 1996-2012:test:026 | Aankoop van gemeentelijke grond | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 1996-2012:test:027 | Notulen bouwvergadering monument | 2 | nee | — | Voorschrift binnen verwachte categorie | ja | ja |
| 1996-2012:test:028 | Erfpachtakte / zakelijk recht | 0 | nee | erfpachtakte | Woorden ontbreken in zoekbereik | ja | ja |
| 1996-2012:test:029 | Bruikleen kunstwerk aan museum | 0 | nee | bruikleen, kunstwerk, museum | Woorden ontbreken in zoekbereik | ja | ja |
| 1996-2012:test:030 | BAG brondocument straatnaam | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 1996-2012:test:031 | Processen-verbaal verkiezingen N10 | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 1996-2012:test:032 | Mandaatbesluit bestuurder aan ambtenaar | 0 | nee | mandaatbesluit | Woorden ontbreken in zoekbereik | ja | ja |
| 1996-2012:test:033 | Bestemmingsplan met zienswijzen | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 1996-2012:test:034 | Bouwvergunning woning | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 1996-2012:test:035 | Sloopmelding | 0 | nee | sloopmelding | Woorden ontbreken in zoekbereik | ja | ja |
| 1996-2012:test:036 | Akten burgerlijke stand | 1 | nee | — | Voorschrift binnen verwachte categorie | ja | ja |
| 1996-2012:test:037 | GBA persoonslijst / persoonsregister | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 1996-2012:test:038 | Naturalisatie / Nederlanderschap | 1 | nee | — | Voorschrift binnen verwachte categorie | ja | ja |
| 1996-2012:test:039 | Paspoortaanvraag | 0 | nee | paspoortaanvraag | Woorden ontbreken in zoekbereik | ja | ja |
| 1996-2012:test:040 | Rijbewijsaanvraag | 0 | nee | rijbewijsaanvraag | Woorden ontbreken in zoekbereik | ja | ja |
| 1996-2012:test:041 | Waar vind ik stukken over het verstrekken van een subsidie? | 0 | nee | — | Woorden komen niet samen voor | nee | ja |
| 1996-2012:test:042 | Waar zoek ik een dossier over jeugdhulp? | 0 | nee | — | Woorden komen niet samen voor | nee | ja |
| 1996-2012:test:043 | Waar zoek ik documenten over een geboorteaangifte? | 0 | nee | geboorteaangifte | Woorden ontbreken in zoekbereik | nee | ja |
| 1996-2012:test:044 | Waar zoek ik het verwerken van overlijdensgegevens? | 0 | nee | — | Woorden komen niet samen voor | nee | ja |
| 1996-2012:test:045 | Waar vind ik stukken over een verkiezing? | 0 | nee | — | Woorden komen niet samen voor | nee | ja |
| 1996-2012:test:046 | Waar vind ik stukken over een bestemmingsplan? | 0 | nee | — | Woorden komen niet samen voor | nee | ja |
| 1996-2012:test:047 | Waar zoek ik een bodemonderzoek? | 0 | nee | — | Woorden komen niet samen voor | nee | ja |
| 1996-2012:test:048 | Waar zoek ik stukken van een sollicitatieprocedure? | 0 | nee | sollicitatieprocedure | Woorden ontbreken in zoekbereik | nee | ja |
| 1996-2012:test:049 | Waar zoek ik stukken over personeel? | 0 | nee | — | Woorden komen niet samen voor | nee | ja |
| 1996-2012:test:050 | Waar zoek ik gegevens over een reisdocument? | 0 | nee | — | Woorden komen niet samen voor | nee | ja |
| 1996-2012:test:051 | Waar zoek ik stukken waarin Wmo staat? | 0 | nee | — | Woorden komen niet samen voor | nee | ja |
| 1996-2012:test:052 | Waar vind ik stukken over een monument? | 0 | nee | — | Woorden komen niet samen voor | nee | ja |
| 1996-2012:test:053 | Waar zoek ik een rioleringsplan? | 0 | nee | — | Woorden komen niet samen voor | nee | ja |
| 1996-2012:test:054 | Waar zoek ik een bezwaarschrift? | 0 | nee | — | Woorden komen niet samen voor | nee | ja |
| 1996-2012:test:055 | Waar zoek ik een contract of overeenkomst? | 0 | nee | — | Woorden komen niet samen voor | nee | ja |
| 2017:test:001 | De gemeente stelt een nieuw organisatieonderdeel in. Waar zoek ik? | 0 | nee | organisatieonderdeel | Woorden ontbreken in zoekbereik | ja | ja |
| 2017:test:002 | Waar vind ik het opstellen van een gemeentelijke verordening? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:003 | Waar valt het opstellen van een beleidsplan onder? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:004 | Waar zoek ik een evaluatie van uitgevoerd gemeentelijk beleid? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:005 | De gemeente levert een product aan een inwoner. Welk procestype past als zoekrichting? | 0 | nee | levert, welk, past, zoekrichting | Woorden ontbreken in zoekbereik | ja | ja |
| 2017:test:006 | Een inwoner vraagt de gemeente iets te doen of te laten. Waar zoek ik? | 0 | nee | vraagt | Woorden ontbreken in zoekbereik | ja | ja |
| 2017:test:007 | Een inwoner doet een wettelijk verplichte aangifte bij de gemeente. Waar zoek ik? | 0 | nee | doet, verplichte | Woorden ontbreken in zoekbereik | ja | ja |
| 2017:test:008 | Waar vind ik het verstrekken van een financiële voorziening? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:009 | Waar zoek ik het toekennen van een juridische status? | 0 | nee | juridische | Woorden ontbreken in zoekbereik | ja | ja |
| 2017:test:010 | Waar vind ik het opleggen van een gemeentelijke heffing? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:011 | Een inwoner vraagt toestemming voor een activiteit. Waar zoek ik? | 0 | nee | vraagt | Woorden ontbreken in zoekbereik | ja | ja |
| 2017:test:012 | De gemeente controleert of voorschriften worden nageleefd. Waar zoek ik? | 0 | nee | controleert, voorschriften, nageleefd | Woorden ontbreken in zoekbereik | ja | ja |
| 2017:test:013 | Waar zoek ik het behandelen van een geschil met een inwoner? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:014 | Waar vind ik het inrichten van de openbare ruimte? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:015 | Waar zoek ik het onderhouden of repareren van een gemeentelijk object? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:016 | Waar vind ik het aangaan van een overeenkomst door de gemeente? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:017 | Waar zoek ik het aanstellen van een medewerker? | 0 | nee | medewerker | Woorden ontbreken in zoekbereik | ja | ja |
| 2017:test:018 | Waar vind ik het betalen van een factuur of innen van een vordering? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:019 | Waar zoek ik het administratief verwerken van gegevens zonder inhoudelijke toets? | 0 | nee | administratief | Woorden ontbreken in zoekbereik | ja | ja |
| 2017:test:020 | De gemeente verstrekt informatie. Welk procestype is een zoekrichting? | 0 | nee | welk, zoekrichting | Woorden ontbreken in zoekbereik | ja | ja |
| 2017:test:021 | Waar zoek ik een door de gemeente uitgebracht advies? | 0 | nee | uitgebracht | Woorden ontbreken in zoekbereik | ja | ja |
| 2017:test:022 | De gemeente organiseert een gebeurtenis. Waar zoek ik? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:023 | De gemeente vraagt zelf een voorziening aan. Waar zoek ik? | 0 | nee | vraagt, zelf | Woorden ontbreken in zoekbereik | ja | ja |
| 2017:test:024 | De gemeente vraagt zelf toestemming aan een andere instantie. Waar zoek ik? | 0 | nee | vraagt, zelf | Woorden ontbreken in zoekbereik | ja | ja |
| 2017:test:025 | Een toezichthouder controleert de gemeente. Waar zoek ik? | 0 | nee | toezichthouder, controleert | Woorden ontbreken in zoekbereik | ja | ja |
| 2017:test:026 | De gemeente betwist een besluit van een ander bestuursorgaan. Waar zoek ik? | 0 | nee | bestuursorgaan | Woorden ontbreken in zoekbereik | ja | ja |
| 2017:test:027 | De gemeente vraagt zelf een status aan. Waar zoek ik? | 0 | nee | vraagt, zelf | Woorden ontbreken in zoekbereik | ja | ja |
| 2017:test:028 | De gemeente vraagt zelf een product of dienst aan. Waar zoek ik? | 0 | nee | vraagt, zelf | Woorden ontbreken in zoekbereik | ja | ja |
| 2017:test:029 | De gemeente doet zelf aangifte. Waar zoek ik? | 0 | nee | doet, zelf | Woorden ontbreken in zoekbereik | ja | ja |
| 2017:test:030 | Waar vind ik stukken over het verstrekken van een subsidie? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:031 | Waar zoek ik een dossier over jeugdhulp? | 0 | nee | dossier | Woorden ontbreken in zoekbereik | ja | ja |
| 2017:test:032 | Waar zoek ik stukken met de afkorting BRP? | 0 | nee | afkorting | Woorden ontbreken in zoekbereik | ja | ja |
| 2017:test:033 | Waar zoek ik documenten over een geboorteaangifte? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:034 | Waar zoek ik het verwerken van overlijdensgegevens? | 0 | nee | overlijdensgegevens | Woorden ontbreken in zoekbereik | ja | ja |
| 2017:test:035 | Waar vind ik stukken over een verkiezing? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:036 | Waar zoek ik stukken over een referendum? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:037 | Waar vind ik stukken over een bestemmingsplan? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:038 | Waar zoek ik een bodemonderzoek? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:039 | Waar zoek ik toestemming voor sanering van tanks? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:040 | Waar vind ik de verantwoording van archiefvernietiging? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:041 | Waar zoek ik stukken van een sollicitatieprocedure? | 0 | nee | sollicitatieprocedure | Woorden ontbreken in zoekbereik | ja | ja |
| 2017:test:042 | Waar zoek ik stukken over personeel? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:043 | Waar vind ik stukken over leerplicht? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:044 | Waar zoek ik gegevens over een reisdocument? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:045 | Waar zoek ik stukken waarin Wmo staat? | 0 | nee | waarin | Woorden ontbreken in zoekbereik | ja | ja |
| 2017:test:046 | Waar vind ik stukken over een monument? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:047 | Waar zoek ik een rioleringsplan? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:048 | Waar vind ik stukken over gemeentelijke belastingen? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:049 | Waar zoek ik een bezwaarschrift? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:050 | Waar zoek ik een contract of overeenkomst? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:051 | Waar vind ik stukken over een register? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2017:test:052 | Waar zoek ik stukken over gegevensverwerking? | 0 | nee | gegevensverwerking | Woorden ontbreken in zoekbereik | ja | ja |
| 2017:test:053 | Waar vind ik stukken over woningen? | 0 | nee | woningen | Woorden ontbreken in zoekbereik | ja | ja |
| 2017:test:054 | Waar zoek ik stukken over een vergunning? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:001 | De gemeente stelt een nieuw organisatieonderdeel in. Waar zoek ik? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:002 | Waar vind ik het opstellen van een gemeentelijke verordening? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:003 | Waar valt het opstellen van een beleidsplan onder? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:004 | Waar zoek ik een evaluatie van uitgevoerd gemeentelijk beleid? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:005 | De gemeente levert een product aan een inwoner. Welk procestype past als zoekrichting? | 0 | nee | levert, welk, past, zoekrichting | Woorden ontbreken in zoekbereik | ja | ja |
| 2020:test:006 | Een inwoner vraagt de gemeente iets te doen of te laten. Waar zoek ik? | 0 | nee | vraagt | Woorden ontbreken in zoekbereik | ja | ja |
| 2020:test:007 | Een inwoner doet een wettelijk verplichte aangifte bij de gemeente. Waar zoek ik? | 0 | nee | doet, verplichte | Woorden ontbreken in zoekbereik | ja | ja |
| 2020:test:008 | Waar vind ik het verstrekken van een financiële voorziening? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:009 | Waar zoek ik het toekennen van een juridische status? | 0 | nee | juridische | Woorden ontbreken in zoekbereik | ja | ja |
| 2020:test:010 | Waar vind ik het opleggen van een gemeentelijke heffing? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:011 | Een inwoner vraagt toestemming voor een activiteit. Waar zoek ik? | 0 | nee | vraagt | Woorden ontbreken in zoekbereik | ja | ja |
| 2020:test:012 | De gemeente controleert of voorschriften worden nageleefd. Waar zoek ik? | 0 | nee | controleert, voorschriften, nageleefd | Woorden ontbreken in zoekbereik | ja | ja |
| 2020:test:013 | Waar zoek ik het behandelen van een geschil met een inwoner? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:014 | Waar vind ik het inrichten van de openbare ruimte? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:015 | Waar zoek ik het onderhouden of repareren van een gemeentelijk object? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:016 | Waar vind ik het aangaan van een overeenkomst door de gemeente? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:017 | Waar zoek ik het aanstellen van een medewerker? | 0 | nee | medewerker | Woorden ontbreken in zoekbereik | ja | ja |
| 2020:test:018 | Waar vind ik het betalen van een factuur of innen van een vordering? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:019 | Waar zoek ik het administratief verwerken van gegevens zonder inhoudelijke toets? | 0 | nee | administratief | Woorden ontbreken in zoekbereik | ja | ja |
| 2020:test:020 | De gemeente verstrekt informatie. Welk procestype is een zoekrichting? | 0 | nee | welk, zoekrichting | Woorden ontbreken in zoekbereik | ja | ja |
| 2020:test:021 | Waar zoek ik een door de gemeente uitgebracht advies? | 0 | nee | uitgebracht | Woorden ontbreken in zoekbereik | ja | ja |
| 2020:test:022 | De gemeente organiseert een gebeurtenis. Waar zoek ik? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:023 | De gemeente vraagt zelf een voorziening aan. Waar zoek ik? | 0 | nee | vraagt | Woorden ontbreken in zoekbereik | ja | ja |
| 2020:test:024 | De gemeente vraagt zelf toestemming aan een andere instantie. Waar zoek ik? | 0 | nee | vraagt | Woorden ontbreken in zoekbereik | ja | ja |
| 2020:test:025 | Een toezichthouder controleert de gemeente. Waar zoek ik? | 0 | nee | toezichthouder, controleert | Woorden ontbreken in zoekbereik | ja | ja |
| 2020:test:026 | De gemeente betwist een besluit van een ander bestuursorgaan. Waar zoek ik? | 0 | nee | bestuursorgaan | Woorden ontbreken in zoekbereik | ja | ja |
| 2020:test:027 | De gemeente vraagt zelf een status aan. Waar zoek ik? | 0 | nee | vraagt | Woorden ontbreken in zoekbereik | ja | ja |
| 2020:test:028 | De gemeente vraagt zelf een product of dienst aan. Waar zoek ik? | 0 | nee | vraagt | Woorden ontbreken in zoekbereik | ja | ja |
| 2020:test:029 | De gemeente doet zelf aangifte. Waar zoek ik? | 0 | nee | doet | Woorden ontbreken in zoekbereik | ja | ja |
| 2020:test:030 | Waar vind ik stukken over het verstrekken van een subsidie? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:031 | Waar zoek ik een dossier over jeugdhulp? | 0 | nee | dossier | Woorden ontbreken in zoekbereik | ja | ja |
| 2020:test:032 | Waar zoek ik stukken met de afkorting BRP? | 0 | nee | afkorting | Woorden ontbreken in zoekbereik | ja | ja |
| 2020:test:033 | Waar zoek ik documenten over een geboorteaangifte? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:034 | Waar zoek ik het verwerken van overlijdensgegevens? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:035 | Waar vind ik stukken over een verkiezing? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:036 | Waar zoek ik stukken over een referendum? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:037 | Waar vind ik stukken over een bestemmingsplan? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:038 | Waar zoek ik een bodemonderzoek? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:039 | Waar zoek ik toestemming voor sanering van tanks? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:040 | Waar vind ik de verantwoording van archiefvernietiging? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:041 | Waar zoek ik stukken van een sollicitatieprocedure? | 0 | nee | sollicitatieprocedure | Woorden ontbreken in zoekbereik | ja | ja |
| 2020:test:042 | Waar zoek ik stukken over personeel? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:043 | Waar vind ik stukken over leerplicht? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:044 | Waar vind ik een automatische incasso? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:045 | Waar zoek ik gegevens over een reisdocument? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:046 | Waar zoek ik stukken waarin Wmo staat? | 0 | nee | waarin | Woorden ontbreken in zoekbereik | ja | ja |
| 2020:test:047 | Waar vind ik stukken over een monument? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:048 | Waar zoek ik een rioleringsplan? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:049 | Waar vind ik stukken over gemeentelijke belastingen? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:050 | Waar zoek ik een bezwaarschrift? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:051 | Waar zoek ik een contract of overeenkomst? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:052 | Waar vind ik stukken over een register? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
| 2020:test:053 | Waar zoek ik stukken over gegevensverwerking? | 0 | nee | gegevensverwerking | Woorden ontbreken in zoekbereik | ja | ja |
| 2020:test:054 | Waar vind ik stukken over woningen? | 0 | nee | woningen | Woorden ontbreken in zoekbereik | ja | ja |
| 2020:test:055 | Waar zoek ik stukken over een vergunning? | 0 | nee | — | Woorden komen niet samen voor | ja | ja |
