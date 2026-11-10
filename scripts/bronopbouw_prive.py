"""Explicit private source reconstruction. Its output is NOT a public distribution."""
from pathlib import Path
import argparse,json,hashlib,shutil,subprocess,sys,tempfile
R=Path(__file__).resolve().parents[1];p=argparse.ArgumentParser(description=__doc__);p.add_argument('--bronmap',type=Path,required=True,help='Map met afzonderlijk rechtmatig verkregen oorspronkelijke PDF/XLS/XLSX/rapportbytes.');p.add_argument('--werkmap',type=Path,default=R/'.bronopbouw-prive',help='Private uitvoer, niet naar GitHub uploaden.');a=p.parse_args()
descriptors=json.loads((R/'bronnen/externe-bronnen.json').read_text());needed={d['oorspronkelijke_bestandsnaam']:d['oorspronkelijke_sha256'] for d in descriptors};errors=[]
for name,h in needed.items():
 f=a.bronmap/name
 if not f.is_file():errors.append('Ontbreekt: '+name)
 elif h and hashlib.sha256(f.read_bytes()).hexdigest()!=h:errors.append('Hash wijkt af: '+name)
if errors:p.exit(2,'Geen opbouw gestart. Verifieer externe inputs:\n'+'\n'.join(errors)+'\n')
if a.werkmap.exists():p.exit(2,'Kies een nieuwe lege werkmap; bestaande bestanden worden niet gewist.\n')
(a.werkmap/'scripts').mkdir(parents=True);(a.werkmap/'bronnen').mkdir();(a.werkmap/'upload').mkdir()
for name in needed:
 shutil.copy2(a.bronmap/name,a.werkmap/'bronnen'/name)
 if Path(name).suffix in ['.pdf','.xlsx']:shutil.copy2(a.bronmap/name,a.werkmap/'upload'/name)
shutil.copy2(R/'bronnen/urls.json',a.werkmap/'bronnen/urls.json');shutil.copy2(R/'controle/bevestigingen-gebruiker.json',a.werkmap/'bevestigingen-gebruiker.json')
for f in (R/'scripts/bronopbouw').glob('*.py'):shutil.copy2(f,a.werkmap/'scripts'/f.name)
steps=['analyse_concordance.py','verify1996.py','coverage1996.py','headers1996.py','extract_tables.py','build_revision.py','enrich_revision.py','validate_revision.py','document_revision.py','review_handoff.py','correct_procestermijn.py','final_delivery.py']
for name in steps:subprocess.run([sys.executable,str((a.werkmap/'scripts'/name).resolve())],cwd=a.werkmap,check=True)
print('Private bronopbouw afgerond. Deze uitvoer bevat externe bronbytes en is NIET publicatieklaar; voer opnieuw publicatiecontrole uit.')
