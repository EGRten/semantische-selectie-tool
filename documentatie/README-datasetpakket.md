# Gemeentelijke selectielijsten — publieke distributie

Publicatievoorbereide kopie van eindpakket 1.0.0, distributieversie 1.0.0-publicatie.1. De oorspronkelijke ZIP is niet gewijzigd. Geen wijzigingen aan GitHub uitgevoerd.

De drie onafhankelijke datasets behouden 494 technische voorschriftregels (1996/2012), 305 resultaten (2017) en 346 tabelregels (2020; twee vervallen). Officiële gegevens, technische IDs, zoektermkoppelingen, testvragen en bronannotaties zijn behouden. Alleen persoonlijke controlemetadata en technische publicatieverwijzingen zijn aangepast.

Lees HERGEBRUIK.md en documentatie/privacy-publicatie.md vóór publicatie. Het pakket is gepseudonimiseerd; het bevat geen onbeperkte juridische vrijwaring of nieuwe repositorylicentie. Afzonderlijke bronpublicaties zonder vastgestelde bestandsbrede herpublicatiegrondslag zijn uitgesloten; vindplaatsen en originele hashes blijven beschikbaar.

## Valideren en exports herhalen

    python scripts/valideer_publicatie.py
    python scripts/reproduce.py --output /tmp/selectielijst-exports

Deze opdrachten gebruiken uitsluitend de meegeleverde publieke JSON en hebben geen bron-PDF's, netwerk of backend nodig. De tweede opdracht herhaalt CSV-exporten van de canonieke publieke JSON; dit is geen herextractie van de oorspronkelijke externe documenten.

De oorspronkelijke bronopbouwlogica blijft in scripts/bronopbouw/ beschikbaar. Voor volledige bronopbouw zijn rechtmatig verkregen externe bronbytes nodig: zie python scripts/bronopbouw_prive.py --help. Die opbouw maakt een private, opnieuw te controleren uitvoer en is geen publicatiepipeline. Ontbrekende bronnen worden vooraf gecontroleerd, niet stilzwijgend vervangen.

Voor de toekomstige browserapp zijn de datasets statische bestanden. De concordans-spiegel is optioneel vergelijkingsmateriaal en is niet nodig voor de werking van de drie datasets. Bronbeschrijvingen zijn geen vervangende officiële brontekst; gebruik hun url om de officiële bron te raadplegen.
