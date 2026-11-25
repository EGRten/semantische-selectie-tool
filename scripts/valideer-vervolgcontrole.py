"""Controleer dat alleen geregistreerde brongebonden tekstvelden veranderen."""
import csv,hashlib,json,pathlib,subprocess
R=pathlib.Path(__file__).resolve().parents[1];D=R/'documentatie/tekstkwaliteit/vervolgcontrole';BASE='3c2210c48b672dbb0915ca47f1259384ae0b3d07'
def old(p):return json.loads(subprocess.check_output(['git','show',BASE+':'+p],cwd=R))
def load(p):return json.loads((R/p).read_text())
def get(v,path):
 for k in path:v=v[k]
 return v
rows=list(csv.DictReader((D/'uitgevoerde-correcties.csv').open(encoding='utf-8-sig'),delimiter=';'))
assert len(rows)==16
p='datasets/2020/selectiegegevens.json';before=old(p);current=load(p)
assert len(before)==len(current)==346
assert [x['id'] for x in before]==[x['id'] for x in current]
for m in rows:
 assert m['bestand']==p and m['classificatie']=='A'
 path=[int(k) if k.isdecimal() else k for k in m['json_pointer'].split('/')[1:]]
 assert path[-2:]==['uitzonderingen_en_verwijzingen','officiele_tekst']
 assert before[path[0]]['id']==m['record_id']
 assert get(before,path)==m['oud'] and get(current,path)==m['nieuw']
 assert m['bronhash']=='0174fda6020ebee109d2f5da5731078196fd46970c2d8aa5e9e452f1d21e073c'
 get(before,path[:-1])[path[-1]]=m['nieuw']
assert before==current,'Niet-geregistreerde wijziging in primaire gegevens'
concordance='publicatie/concordans.json';assert (R/concordance).read_bytes()==subprocess.check_output(['git','show',BASE+':'+concordance],cwd=R)
for name in ['1996-2012','2017','2020']:
 for part in ['relaties','zoeklexicon','bronannotaties']:
  q=f'datasets/{name}/{part}.json';assert (R/q).read_bytes()==subprocess.check_output(['git','show',BASE+':'+q],cwd=R)
print(json.dumps({'status':'geslaagd','geregistreerde_primaire_correcties':16,'codes_ids_termijnen_waarderingen_voorwaarden':'ongewijzigd','concordans_en_zoekrelaties':'ongewijzigd'},ensure_ascii=False))
