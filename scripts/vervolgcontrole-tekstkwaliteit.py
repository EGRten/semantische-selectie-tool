"""Herstel uitsluitend bronbewezen woordafbrekingen in 2020-uitzonderingsuitleg."""
import argparse,csv,json,pathlib,re,hashlib,collections,subprocess
import fitz
R=pathlib.Path(__file__).resolve().parents[1];P=R/'documentatie/tekstkwaliteit/vervolgcontrole';P.mkdir(exist_ok=True)
a=argparse.ArgumentParser();a.add_argument('--bronmap',type=pathlib.Path,required=True);a.add_argument('--apply',action='store_true');args=a.parse_args()
source=json.loads((R/'bronnen/semantische-selectie-tool-bronset-2026-11-25.json').read_text());pdfmeta=next(x for x in source['bronnen'] if x['lijst']=='2020');pdf=args.bronmap/pdfmeta['bestandsnaam'];assert hashlib.sha256(pdf.read_bytes()).hexdigest()==pdfmeta['sha256'];doc=fitz.open(pdf)
prior=json.loads((R/'documentatie/tekstkwaliteit/mutaties.json').read_text());rules={(q['links'],q['rechts']) for x in prior if x['bestand']=='datasets/2020/selectiegegevens.json' for q in x['regels'] if q['links']!='BRP'}
path=R/'datasets/2020/selectiegegevens.json';records=json.loads(subprocess.check_output(['git','show','3c2210c48b672dbb0915ca47f1259384ae0b3d07:datasets/2020/selectiegegevens.json'],cwd=R));changes=[]
for i,row in enumerate(records):
 old=row['uitzonderingen_en_verwijzingen']['officiele_tekst'];new=old
 if not isinstance(old,str):continue
 page=row['bron']['pdf_pagina'];bbox=row['bron']['bbox'];page_text=doc[page-1].get_text('text',clip=fitz.Rect(bbox))
 for left,right in rules:
  regex=re.compile(r'(?<!\w)'+re.escape(left)+r'-\s+'+re.escape(right)+r'(?!\w)')
  if regex.search(new) and regex.search(page_text):new=regex.sub(left+right,new)
 if new!=old:
  row['uitzonderingen_en_verwijzingen']['officiele_tekst']=new
  changes.append({'bestand':'datasets/2020/selectiegegevens.json','record_id':row['id'],'json_pointer':f'/{i}/uitzonderingen_en_verwijzingen/officiele_tekst','oud':old,'nieuw':new,'type':'PDF-regelafbreking','classificatie':'A','bronbestand':pdfmeta['bestandsnaam'],'bronhash':pdfmeta['sha256'],'pdf_pagina':page,'bbox':bbox,'besluit':'corrigeren'})
def csvout(name,rows,fields):
 with (P/name).open('w',encoding='utf-8-sig',newline='') as f:
  w=csv.DictWriter(f,fieldnames=fields,delimiter=';');w.writeheader();w.writerows(rows)
rows=list(csv.DictReader((R/'documentatie/tekstkwaliteit/tekstkwaliteit-onzekerheden.csv').open(encoding='utf-8-sig'),delimiter=';'));groups=collections.defaultdict(list)
for x in rows:groups[(x['type'],x['aangetroffen'],x['bron_id'],x['pdf_pagina'])].append(x)
word=[];spaces=[];remaining=[]
for (kind,literal,sourceid,page),members in sorted(groups.items()):
 matched=[c for c in changes if any(m['record_id']==c['record_id'] and m['json_pointer']==c['json_pointer'] for m in members)]
 classification='A' if matched else 'C' if literal=='BTW-compensatiefonds' or (kind=='woordafbreking' and literal.split()[-1].lower() in ('en','of')) else 'D' if kind=='ontbrekende_spatie' and 'leasen,huur' in members[0]['context'] else 'E'
 decision='corrigeren' if matched else 'behouden' if classification in ('C','D') else 'nader beoordelen'
 item={'type':kind,'aangetroffen':literal,'voorstel':matched[0]['nieuw'] if matched else '', 'bron_id':sourceid,'pdf_pagina':page,'aantal_registerregels':len(members),'classificatie':classification,'besluit':decision,'woordenboekcontrole':'geen zelfstandig bewijs','context':members[0]['context'],'onderbouwing':'Eerdere PDF-visuele controle PR #48 en huidig bronvenster' if matched else 'Niet eenduidig bronbewezen; behouden','bronverwijzingen':json.dumps(sorted({m['bestand']+'#'+m['json_pointer'] for m in members}),ensure_ascii=False)}
 (word if kind in ('woordafbreking','koppelteken_in_woord','soft_hyphen') else spaces).append(item)
 if classification=='E':remaining.append(item)
fields=list(word[0]);csvout('woordafbrekingen-beoordeling.csv',word,fields);csvout('spatieproblemen-beoordeling.csv',spaces,fields);csvout('resterende-onzekerheden.csv',remaining,fields)
csvout('uitgevoerde-correcties.csv',changes,list(changes[0]) if changes else ['bestand','record_id','json_pointer','oud','nieuw','type','classificatie','bronbestand','bronhash','pdf_pagina','bbox','besluit'])
if args.apply:
 path.write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
 csvpath=R/'datasets/2020/selectiegegevens.csv'
 with csvpath.open('w',encoding='utf-8-sig',newline='') as f:
  writer=csv.DictWriter(f,fieldnames=sorted(set().union(*(r.keys() for r in records))));writer.writeheader()
  writer.writerows({k:json.dumps(v,ensure_ascii=False) if isinstance(v,(dict,list)) else v for k,v in r.items()} for r in records)
 manifestpath=R/'datasets/2020/manifest.json';manifest=json.loads(manifestpath.read_text())
 for name in ['selectiegegevens.json','selectiegegevens.csv']:
  manifest['sha256'][name]=hashlib.sha256((R/'datasets/2020'/name).read_bytes()).hexdigest()
 manifestpath.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
 referencepath=R/'documentatie/inhoudelijke-integriteit.json';reference=json.loads(referencepath.read_text())
 canonical=[{k:v for k,v in r.items() if k!='verificatie'} for r in records]
 payload=json.dumps(canonical,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()
 reference['inhoudelijke_hashes']['2020']['selectiegegevens']=hashlib.sha256(payload).hexdigest()
 referencepath.write_text(json.dumps(reference,ensure_ascii=False,indent=2)+'\n')
 print('Toegepaste correcties',len(changes))
# Registreer ook de direct gegenereerde publieke waarden na de productiebuild.
public='publicatie/2020.json'
baseline='3c2210c48b672dbb0915ca47f1259384ae0b3d07'
original=json.loads(subprocess.check_output(['git','show',baseline+':'+public],cwd=R))
current=json.loads((R/public).read_text())
allmut=list(changes)
byid={m['record_id']:m for m in changes}
for i,(oldrow,newrow) in enumerate(zip(original['rijen'],current['rijen'])):
 for j,(oldnote,newnote) in enumerate(zip(oldrow['notities'],newrow['notities'])):
  if oldnote['tekst']!=newnote['tekst']:
   assert newrow['id'] in byid
   m=dict(byid[newrow['id']]);m.update(bestand=public,json_pointer=f'/rijen/{i}/notities/{j}/tekst',oud=oldnote['tekst'],nieuw=newnote['tekst']);allmut.append(m)
(P/'mutaties.json').write_text(json.dumps(allmut,ensure_ascii=False,indent=2)+'\n')
filelog={}
for name in ['datasets/2020/selectiegegevens.json',public]:
 old=subprocess.check_output(['git','show',baseline+':'+name],cwd=R)
 new=(R/name).read_bytes()
 if old!=new:filelog[name]={'voor_sha256':hashlib.sha256(old).hexdigest(),'na_sha256':hashlib.sha256(new).hexdigest()}
(P/'bestandsmutaties.json').write_text(json.dumps(filelog,indent=2)+'\n')
print('Unieke kandidaten',len(groups),'Correcties',len(changes),'Resterend E',len(remaining))
