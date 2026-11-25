"""Onafhankelijke controle van toegestane veldmutaties en ongewijzigde broninhoud."""
import csv,hashlib,json,pathlib,subprocess,collections
R=pathlib.Path(__file__).resolve().parents[1];D=R/'documentatie/tekstkwaliteit'
def load(p):return json.loads(p.read_text())
def h(b):return hashlib.sha256(b).hexdigest()
def original(p):return json.loads(subprocess.check_output(['git','show',base+':'+p],cwd=R))
def at(v,path):
 for k in path:v=v[k]
 return v
nul=load(D/'nulmeting.json');base=nul['basiscommit'];mut=load(D/'mutaties.json');filelog=load(D/'bestandsmutaties.json');group=collections.defaultdict(list)
for m in mut:group[m['bestand']].append(m)
for p,changes in group.items():
 actual=load(R/p);expected=original(p);seen=set()
 for m in changes:
  path=m['pad'];key=json.dumps(path);assert key not in seen,(p,path,'dubbele_mutatie');seen.add(key)
  assert at(expected,path)==m['voor'];assert at(actual,path)==m['na'];assert isinstance(m['na'],str) or (p.startswith('publicatie/') and path[-1]=='notities' and m['status']=='gegenereerde_deduplicatie');assert m['categorie'] in ['A','B'];assert m['bronhash'];assert m['pdf_pagina']>0
  if p=='publicatie/concordans.json':assert not {'waarden','context'}.intersection(path)
  forbidden={'id','code','bron','ruwe_extractie','officiele_bronrij','waardering','bewaartermijn','procestermijn','aanvangsmoment','verificatie'};assert not forbidden.intersection(path),(p,path)
  at(expected,path[:-1])[path[-1]]=m['na']
 assert expected==actual,(p,'niet_geregistreerde_mutatie')
# Alle oorspronkelijke bestanden, niet alleen de gewijzigde steekproef.
for p,oldhash in nul['bestanden'].items():
 actual=h((R/p).read_bytes())
 if p in filelog:assert filelog[p]=={'voor_sha256':oldhash,'na_sha256':actual}
 elif p.startswith(('datasets/','publicatie/','bronnen/','documentatie/')):assert actual==oldhash,(p,'oorspronkelijk_bewijs_of_gegevens_onbedoeld_gewijzigd')
# Manifesten: alleen afgeleide bestandshashes zijn veranderd.
for y in ['1996-2012','2017','2020']:
 p=f'datasets/{y}/manifest.json';old=original(p);new=load(R/p);old.pop('sha256');new.pop('sha256');assert old==new
 for name in ['structuur','selectiegegevens','zoeklexicon','relaties','testvragen']:
  p=f'datasets/{y}/{name}.json';a=original(p);b=load(R/p);assert len(a)==len(b);assert [x['id'] for x in a]==[x['id'] for x in b]
  for x,z in zip(a,b):
   for k in ['code','waardering','bewaartermijn','procestermijn','aanvangsmoment','toepassingsvoorwaarden','uitzonderingen_en_verwijzingen','officiele_bronrij','verificatie','bron','aanvullende_bronnen','onderdeel_id','relatietype','van','naar','herkomsttype','betrouwbaarheid','beoordelingsstatus']:
    assert x.get(k)==z.get(k),(p,x['id'],k)
 for name in ['bepalingen','rubriekcontext']:
  p=f'datasets/{y}/{name}.json'
  if (R/p).exists():
   for x,z in zip(original(p),load(R/p)):assert x.get('ruwe_extractie')==z.get('ruwe_extractie')
a=original('publicatie/concordans.json');b=load(R/'publicatie/concordans.json');assert len(a['rijen'])==len(b['rijen'])==716
for x,z in zip(a['rijen'],b['rijen']):
 assert x['waarden']==z['waarden'];assert x.get('context')==z.get('context');assert len(x['waarden'])==11
 for k in x:
  if k!='koppelingen':assert x[k]==z[k],(x['id'],k)
 for l,r in zip(x.get('koppelingen',[]),z.get('koppelingen',[])):assert {k:v for k,v in l.items() if k!='benaming'}=={k:v for k,v in r.items() if k!='benaming'}
with (D/'tekstkwaliteit-correcties.csv').open(encoding='utf-8-sig',newline='') as f:rows=list(csv.DictReader(f,delimiter=';'))
assert len(rows)==len(mut)
for r,m in zip(rows,mut):
 for k in ['bestand','json_pointer','voor','na','bronhash']:assert (json.loads(r[k]) if isinstance(m[k],(dict,list)) else r[k])==m[k]
for p in D.glob('*.csv'):
 with p.open(encoding='utf-8-sig',newline='') as f:
  for row in csv.reader(f,delimiter=';'):assert all(len(x)<=32767 for x in row),(p,'Excel_cellengrens')
result={'status':'geslaagd','basiscommit':base,'tekstmutaties':len(mut),'bestanden_met_tekstmutaties':len(group),'concordansrijen':716,'ongewijzigde_concordanscellen':7876,'codes_ids_termijnen_waarderingen_relatieidentiteiten':'ongewijzigd','ruwe_extracties_en_historisch_bewijs':'ongewijzigd','csv_correctieregister':'identiek_aan_json_register','excel_csv_cellengrens':'geslaagd'}
print(json.dumps(result,ensure_ascii=False,indent=2))
