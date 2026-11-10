# Publicatieversie: oorspronkelijke bronopbouwlogica, geen zelfstandige openbare bronbundel.
# Gebruik scripts/bronopbouw_prive.py met een rechtmatig verkregen externe bronmap.
# Alleen deze wrapper kopieert dit script naar de verwachte private werkstructuur.
from pathlib import Path as _PublicPath
if __name__ == "__main__" and _PublicPath(__file__).parent.name == "bronopbouw":
    print("Dit is bronopbouwlogica. Gebruik: python scripts/bronopbouw_prive.py --help")
    raise SystemExit(0)
"""Offline reproduction and byte-for-byte checks for the distributed dataset package."""
from pathlib import Path
import shutil,subprocess,sys,json,hashlib
ROOT=Path(__file__).resolve().parents[1];WORK=ROOT/'.reproduce'
if WORK.exists():shutil.rmtree(WORK)
(WORK/'scripts').mkdir(parents=True);(WORK/'upload').mkdir()
shutil.copytree(ROOT/'bronnen',WORK/'bronnen')
for p in (ROOT/'bronnen').iterdir():
 if p.name.startswith('Selectielijst ') or p.name.startswith('Concordans ') or p.name=='Handleiding SelectTool.pdf':shutil.copy2(p,WORK/'upload'/p.name)
for p in (ROOT/'scripts').glob('*.py'):shutil.copy2(p,WORK/'scripts'/p.name)
shutil.copy2(ROOT/'controle/bevestigingen-gebruiker.json',WORK/'bevestigingen-gebruiker.json')
steps=['analyse_concordance.py','verify1996.py','coverage1996.py','headers1996.py','extract_tables.py','build_revision.py','enrich_revision.py','validate_revision.py','document_revision.py','review_handoff.py','correct_procestermijn.py','final_delivery.py']
with (WORK/'reproductie.log').open('w') as log:
 for name in steps:
  print('Uitvoeren:',name,flush=True)
  subprocess.run([sys.executable,str(WORK/'scripts'/name)],cwd=WORK,stdout=log,stderr=subprocess.STDOUT,check=True)
checks=[]
for path in sorted((ROOT/'datasets').glob('*/*.json')):
 generated=WORK/'revisie'/path.relative_to(ROOT)
 assert generated.exists(),str(generated)
 a=hashlib.sha256(path.read_bytes()).hexdigest();b=hashlib.sha256(generated.read_bytes()).hexdigest()
 checks.append({'bestand':str(path.relative_to(ROOT)),'gelijk':a==b})
for path in sorted((ROOT/'schemas').glob('*.json')):
 generated=WORK/'revisie'/path.relative_to(ROOT);checks.append({'bestand':str(path.relative_to(ROOT)),'gelijk':path.read_bytes()==generated.read_bytes()})
result={'offline_reproductie':'geslaagd' if all(c['gelijk'] for c in checks) else 'afwijkingen','gecontroleerde_bestanden':len(checks),'controles':checks}
(ROOT/'documentatie/reproduceerbaarheidscontrole.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k!='controles'},ensure_ascii=False))
if not all(c['gelijk'] for c in checks):
 print([c for c in checks if not c['gelijk']]);sys.exit(1)
