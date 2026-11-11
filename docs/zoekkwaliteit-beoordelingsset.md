# Aanvullende beoordelingsset — 45 vragen

De machineleesbare set staat in `tests/data/zoekkwaliteit-beoordelingsset.json`: 15 nieuwe vragen per selectielijst, gescheiden van de oorspronkelijke 164 datasetvragen. Alle vraagrecords én alle voorgestelde positieve/negatieve oordelen hebben letterlijk `beoordelingsstatus: "te beoordelen"`. `onafhankelijk_gevalideerd` staat overal op `false`. De voorstellen zijn met AI opgesteld voor latere beoordeling en zijn geen onafhankelijke grondwaarheid.

## Inhoud en herleidbaarheid

Iedere vraag heeft een unieke `vraag_id`, selectielijst, zoekvraag, vraagtype, mogelijke relevante resultaten, onderbouwing, eventuele expliciet niet-relevante kandidaten, onzekerheden, status en lege velden voor beoordelaar, datum en opmerkingen. Positieve kandidaten bevatten de bestaande technische ID, officiële code/benaming en bronverwijzing. Er zijn geen nieuwe officiële codes bedacht. De expliciet niet-relevante kandidaten zijn eveneens **voorlopige te beoordelen contrastvoorstellen**: het zijn geen reeds vastgestelde uitsluitingen.

De set bevat exacte codes, officiële terminologie, gewone taal, afkortingen, historische formuleringen, Nederlandse samenstellingen, complexe casussen, dubbelzinnige vragen, generiek/specifiek onderscheid en misleidende termen/negaties. Het losse woord `niet` heeft bewust geen relevante kandidaat: zonder context is een betekenisuitbreiding niet verantwoord. Historische GBA/BRP-vragen zijn onderzoeksvragen, geen toegevoegde historische lexiconrelaties.

De 1996/2012-vragen testen onder meer gedeelde rubrieken en afzonderlijke voorschriften, WABO, historisch Erfgoedverordening/Monumentenverordening, vergunningaanvragen en sollicitatiecontext. De moderne sets testen onder meer RI&E/BRP, procesrol bij subsidies, generieke versus specifieke resultaten, Toegekend/Niet toegekend en code 7.1.20. Tijdvak, bronstatus en concrete toepasselijkheid blijven afzonderlijk te beoordelen.

## Werkwijze voor een inhoudelijke beoordelaar

1. Maak een afzonderlijke werkkopie van het JSON-bestand. Bewaar de oorspronkelijke vraag-ID's en noteer de gebruikte datasetversie/commit.
2. Lees de officiële bron, voorwaarden, toelichting, eventuele bronannotaties en het werkelijke ouderpad; baseer het oordeel niet uitsluitend op een zoekresultaat of lexiconlabel.
3. Leg vast wat met relevantie wordt bedoeld: een bruikbare vindrichting, een passend hoger structuurniveau of een specifieke regel. Stel geen juridische toepasselijkheid vast op basis van tekstgelijkenis alleen.
4. Keur iedere positieve of negatieve kandidaat afzonderlijk goed, wijs hem af of vul hem aan. Gebruik in de werkkopie bijvoorbeeld `goedgekeurd`, `afgewezen` of `nader onderzoek`, met brononderbouwing, beoordelaar en datum. Controleer ook niet voorgestelde resultaten: de kandidaatlijst is niet uitputtend.
5. Bij een dubbelzinnige vraag: documenteer de noodzakelijke context in plaats van willekeurig één juiste categorie te kiezen. Maak meerdere interpretaties zichtbaar of markeer dat een eenduidig oordeel niet mogelijk is.
6. Laat relevante gevallen onafhankelijk door een tweede beoordelaar toetsen wanneer later onafhankelijke kwaliteitscijfers worden beoogd; leg verschillen en hun oplossing vast. Een naam invullen is op zichzelf geen bewijs van onafhankelijkheid.

Een menselijke beoordeling wijzigt niet automatisch de officiële datasets of semantische relaties. Het bestand wordt niet door de browser of zoekindex ingelezen. Er is geen beoordelaarsinterface of extra opslagarchitectuur gebouwd.

## Gebruik in metingen

De 45 vragen tellen in deze opdracht **niet** mee als gevalideerde positieve/negatieve voorbeelden, niet in de A/B/C/D-samenvattingen en niet in Precision/Recall/MRR. Tests controleren uitsluitend structuur, 15-per-lijst, bestaande IDs en de initiële onbeoordeelde status; zij beweren niet dat de voorgestelde relevantie inhoudelijk juist is.

Voor latere cijfers is een expliciete, gedocumenteerde toelatingsstap nodig die alleen voldoende onafhankelijk beoordeelde oordelen gebruikt. Bewaar de herkomst van die werkkopie en de afbakening van de relevantieset. Meng afgewezen, onbekende en nog te beoordelen oordelen niet met vastgestelde negatieve voorbeelden. Ontbrekende oordelen zijn geen negatieve oordelen.
