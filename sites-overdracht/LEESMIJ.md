# Exacte Sites-broncode

De zes bestanden in src/interface zijn bytegetrouwe exports uit Sites-commit a5082debf7f19cc91e2c1ba408d05dfd9e673b87. Ze staan bewust in een aparte overdrachtsmap. De applicatiebestanden op main zijn hiermee niet gewijzigd.

## Instructie voor Codex

Gebruik deze bestanden als daadwerkelijke ontwerpbron. Vergelijk ze met de actuele src/interface-bestanden en integreer alleen de ontwerpwijzigingen op een nieuwe branch vanaf de actuele main. Kopieer de bestanden niet blind over: behoud het footerherstel en de woordafbrekingscorrecties uit main 95c4277 en alle latere wijzigingen. Pas zo nodig aan de actuele interfaces aan.

Neem geen Sites-hostingconfiguratie, lege dev-opdracht, out-map of credentials over. Behoud de GitHub Pages-configuratie en het repositorysubpad. Behoud datasets, bronwaarden, zoeklogica, exportfuncties en instellingen voor zoekverrijking.

Voer typecontrole, build en bestaande tests uit, en controleer desktop, mobiel, toetsenbordbediening, boomselectie vanuit zoeken, de drie selectielijsten, concordans, downloads en paden onder het repositorysubpad. Browser-QA is in de oorspronkelijke Sites-omgeving niet uitgevoerd vanwege een previewbeperking. Daar waren typecontrole/build geslaagd en 154 unittests geslaagd, 18 overgeslagen.

Open een pull request; niet zelfstandig samenvoegen of Pages activeren. Deze overdrachtsbranch is bronmateriaal, niet een te mergen implementatie.
