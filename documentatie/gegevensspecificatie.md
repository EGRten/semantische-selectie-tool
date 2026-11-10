# Gegevensspecificatie — 0.3.0

Alle JSON-bestanden zijn UTF-8. De drie datasets zijn onafhankelijk: ID's en verwijzingen naar structuur, selectiegegevens en termen blijven binnen dezelfde selectielijst. De concordans staat afzonderlijk en bepaalt geen toepasselijkheid of gelijkwaardigheid.

## Identificatie en structuur

Een canonieke onderdeel-ID heeft de lijstprefix gevolgd door de officiële code. Voor 1996/2012 hebben technische subregels een suffix ::001, ::002 enzovoort. Deze suffixen en de subletters uit de concordans zijn geen officiële codes. Hetzelfde canonieke onderdeel kan in structuur.json en selectiegegevens.json voorkomen; dit verwijst naar dezelfde entiteit, geen twee verschillende entiteiten met een toevallig gelijke ID.

1996/2012 behoudt twee hoofdstukken, zestien taakvelden en negentig rubrieken. 494 technische voorschriftregels verwijzen naar de rubriek. Sommige beschrijvingen zijn delen van één opsomming met een gedeelde waarderingscel; de afzonderlijke zoekrecords betekenen niet dat de bron evenveel zelfstandig genummerde juridische regels kent. 2017/2020 behouden procestypen met generieke en specifieke resultaten. Het veld resultaattype bevat de officiële resultaatkolom. Er is geen fictieve extra hiërarchielaag toegevoegd.

## Selectiegegevens

Officiële formuleringen blijven behouden, inclusief eventuele typefouten, ontbrekende cellen en merkwaardige resultaatlabels. Waardering.type onderscheidt bewaren, vernietigen, samengesteld, vervallen en niet_ingevuld_in_bron. Bij 1996/2012 betekent B bewaren; de andere termijnen zijn vernietigingstermijnen volgens de bronlegenda. Hiervoor is geen fictieve letter V in de oorspronkelijke brontekst gezet.

Een enkelvoudige termijn zoals 10 jaar kan technisch worden uitgedrukt. Samengestelde termijnen, voorwaarden en directe vernietiging blijven tekst. De numerieke duur bepaalt geen aanvangsdatum. Waar de procestermijn exact overeenkomt met een legendacategorie is de letterlijke startdefinitie toegevoegd, met bron. De letters A–E zijn geen korte, middellange of lange duurklassen.

null betekent geen afzonderlijke tekstwaarde in dit veld; het bijbehorende statusveld verklaart waarom. Lege aanvangsmomentvelden bij bewaren zijn niet automatisch ontbrekende bewaartermijnen. Waar een voorwaarde niet veilig afzonderlijk kan worden geïnterpreteerd, verwijst het veld naar de behouden bronvelden, rubriekcontext en algemene bepalingen. Dat is een tekstuele representatie, geen datumrekenmodel.

## Bronnen

PDF-pagina's tellen vanaf 1; bbox gebruikt PDF-punten ten opzichte van de pagina. Bronsegmenten leggen tekst en coördinaten vast. Bij 1996/2012 zijn beschrijving en termijn afzonderlijk gelokaliseerd. De officiële PDF heeft op sommige pagina's defecte fontcodering voor toelichtingen; bepalingen.json en rubriekcontext.json bevatten daarom ook expliciet gelabelde leesbare paginakopieën uit de aangeleverde PDF. Die vervangen niet de autoriteit van het officiële document.

## Zoekverrijking

herkomsttype onderscheidt officieel, brononderbouwd_alternatief, taalkundige_variant en ai_voorgesteld. Letterlijk tekstvoorkomen bewijst alleen een vindverband. Een mechanische spellingvariant verandert interpunctie en is geen juridische gelijkwaardigheid. Bij AI-kandidaten betekent voorstel_inhoudelijk_beoordeeld_zoekrichting dat de richting op plausibiliteit is beoordeeld; de term wordt daarmee geen officieel synoniem. voorstel_niet_activeren blijft standaard uitgeschakeld. Niet koppelbare rapporttermen staan in kandidaten-ongekoppeld.json.

Relaties hebben een expliciete richting en herkomst. Ondersteunde concepten zijn structurele relaties, exacte synoniemen indien bewezen, afkortingen, historische benamingen, bredere/smallere en verwante begrippen en verwarringsrelaties. Niet voor ieder relatietype is in deze versie een bewezen relatie beschikbaar; geen aantallen zijn verzonnen om alle typen te vullen. Onjuiste voorgestelde relaties staan apart in het afwijkingenregister.

## Export

CSV gebruikt UTF-8 met BOM, komma als scheidingsteken en JSON-tekst voor objecten/lijsten. JSON Schema's zijn gesloten voor onbekende velden op de gemodelleerde objecten en controleren onder meer typen, ID-prefixen en minimaal veertig testvragen. Verwijzingen, broncontroles en hashes worden aanvullend door scripts gecontroleerd. Manifesten hashen alle directe datasetbestanden behalve zichzelf; daarmee is geen zelfhashkring gecreëerd.


## Aanvulling 0.3.0

bronannotaties.json bevat per afwijking bronvarianten en de gekozen transcriptie. Dezelfde annotatie is bij het betrokken selectierecord opgenomen. Manifest.opleverstatus beschrijft de oplevering; een bronafwijking is geen algemene vrijgaveblokkade. Het controlewerkboek bevat uitsluitend onbeoordeelde menselijke invulvelden.


Publicatienoot: eventuele verwijzingen naar lokale bron-PDF’s, onderzoeksrapporten of bronbeelden beschrijven het oorspronkelijke eindpakket. Deze bestanden zijn niet in de openbare distributie opgenomen; raadpleeg bronnen/externe-bronnen.json voor de huidige vindplaatsen en rechtenafbakening.
