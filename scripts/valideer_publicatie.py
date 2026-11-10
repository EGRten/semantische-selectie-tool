"""Validate the static public distribution; no external source files or network needed."""
from pathlib import Path
import json,hashlib,csv,re,sys
import jsonschema
R=Path(__file__).resolve().parents[1]
def load(p):return json.loads(p.read_text())
def digest(v):return hashlib.sha256(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
KEYS=['1996-2012','2017','2020'];result=[]
for p in R.rglob('*.json'):load(p)
for key in KEYS:
 b=R/'datasets'/key;m=load(b/'manifest.json')
 for name in ['manifest','structuur','selectiegegevens','zoeklexicon','relaties','testvragen','bronannotaties']:jsonschema.Draft202012Validator(load(R/'schemas'/(name+'.schema.json'))).validate(load(b/(name+'.json')))
 ns=load(b/'structuur.json');ss=load(b/'selectiegegevens.json');lx=load(b/'zoeklexicon.json');rel=load(b/'relaties.json');tq=load(b/'testvragen.json');ids={n['id'] for n in ns};parts=ids|{s['id'] for s in ss};terms={z['id'] for z in lx}
 for name,rs in [('structuur',ns),('selectiegegevens',ss),('zoeklexicon',lx),('relaties',rel),('testvragen',tq)]:
  assert len({r['id'] for r in rs})==len(rs),(key,name,'dubbele_id')
  assert all(r['id'].startswith(key+':') for r in rs),(key,name,'verkeerde_lijst')
 assert all(n['parent_id'] is None or n['parent_id'] in ids for n in ns)
 assert all(s['structuur_id'] in ids for s in ss)
 assert all(z['onderdeel_id'] in parts for z in lx)
 for r in rel:
  assert r['van'] in (terms if r['van_type']=='zoekterm' else parts)
  assert r['naar'] in parts
 for q in tq:assert set(q['verwachte_relevante_categorieen']+q['alternatieve_relevante_categorieen'])<=parts
 assert len(tq)>=40
 for f,h in m['sha256'].items():assert hashlib.sha256((b/f).read_bytes()).hexdigest()==h,(key,f,'hash')
 for s in m['bronnenregister']:
  p=(b/s['bestand']).resolve();assert p.is_file(),(key,s['id'],'bronbeschrijving_ontbreekt');d=load(p);assert d['bron_id']==s['id'];assert d['inhoud_meegeleverd'] is False
 for name,rs in [('structuur',ns),('selectiegegevens',ss),('zoeklexicon',lx),('relaties',rel),('testvragen',tq)]:
  with (b/(name+'.csv')).open(encoding='utf-8-sig',newline='') as f:rows=list(csv.DictReader(f))
  assert len(rows)==len(rs),(key,name,'csv_rijtelling')
  for r,row in zip(rs,rows):
   for k,v in r.items():
    exp=json.dumps(v,ensure_ascii=False) if isinstance(v,(dict,list)) else '' if v is None else str(v)
    assert row[k]==exp,(key,name,r['id'],k,'csv_verschil')
 result.append({'lijst':key,'selectiegegevens':len(ss),'zoektermrelaties':len(lx),'testvragen':len(tq),'bronannotaties':len(load(b/'bronannotaties.json')),'status':'geslaagd'})
# Integrity fingerprints refer to original semantic content, excluding only personal verification metadata.
ref=load(R/'documentatie/inhoudelijke-integriteit.json')
for key in KEYS:
 b=R/'datasets'/key
 for name,h in ref['inhoudelijke_hashes'][key].items():
  values=load(b/(name+'.json'))
  if name=='selectiegegevens':values=[{k:v for k,v in row.items() if k!='verificatie'} for row in values]
  assert digest(values)==h,(key,name,'inhoudelijke_integriteit')
print(json.dumps({'status':'geslaagd','lijsten':result,'integriteitsvingerafdrukken':'geslaagd'},ensure_ascii=False,indent=2))
