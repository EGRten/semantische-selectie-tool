"""Repeat public CSV exports from canonical public JSON; not original PDF re-extraction."""
from pathlib import Path
import argparse,csv,json,subprocess,sys,hashlib
R=Path(__file__).resolve().parents[1];p=argparse.ArgumentParser(description=__doc__);p.add_argument('--output',type=Path,required=True,help='Afzonderlijke uitvoermap voor herhaalde CSV-exporten.');a=p.parse_args()
subprocess.run([sys.executable,str(R/'scripts/valideer_publicatie.py')],check=True)
a.output.mkdir(parents=True,exist_ok=True)
for key in ['1996-2012','2017','2020']:
 for name in ['structuur','selectiegegevens','zoeklexicon','relaties','testvragen']:
  rs=json.loads((R/'datasets'/key/(name+'.json')).read_text());dest=a.output/key/(name+'.csv');dest.parent.mkdir(parents=True,exist_ok=True)
  with dest.open('w',encoding='utf-8-sig',newline='') as f:
   w=csv.DictWriter(f,fieldnames=sorted(set().union(*(r.keys() for r in rs))));w.writeheader();w.writerows({k:json.dumps(v,ensure_ascii=False) if isinstance(v,(dict,list)) else v for k,v in r.items()} for r in rs)
  assert dest.read_bytes()==(R/'datasets'/key/(name+'.csv')).read_bytes(),str(dest)
print('15 CSV-exporten byte-identiek herhaald; geen externe bronbestanden gebruikt.')
