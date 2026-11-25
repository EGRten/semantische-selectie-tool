"""Conservatieve tekstcontrole; alleen visueel beoordeelde, brongebonden regels toepassen.

De vaste basis wordt alleen gelezen met git show. Zonder --apply blijft de checkout intact.
"""
import argparse,collections,csv,hashlib,json,pathlib,re,subprocess,sys
import fitz
R=pathlib.Path(__file__).resolve().parents[1]
BASE='59add247289e3328a2f433ac6c26262d3db0f468'
YEARS=['1996-2012','2017','2020']
TEXT={'benaming','officiele_benaming','officiele_omschrijving','resultaattype','procesomschrijving','procesobject','toelichting','herkomst_waardering','taakvelden_brontekst','omschrijving','tekst','tekst_leesbaar','opmerking','zoekterm','genormaliseerde_zoekterm','onderbouwing','risico_op_verwarring','vraag','titel','label','beschrijving','motivering','uitleg','samenvatting','toepassingsvoorwaarden','uitzonderingen_en_verwijzingen'}
PROTECTED={'officiele_bronrij','ruwe_extractie','verificatie','bron','aanvullende_bronnen','waardering','bewaartermijn','procestermijn','aanvangsmoment','broncontext'}
RULES=[('doorge','gaan'),('glad','heidsbestrijdingsplan'),('woningbouw','programma'),('wegen','beheerplan'),('certifi','caat'),('ambulan','cevervoer'),('gevac','cineerde'),('omzet','ting'),('duur','zaamheidslening'),('verant','woordingsplicht'),('sta','tushouder'),('Gehandicaptenpar','keerkaart'),('bedrijfshulp','verlening'),('buitentoepassingsver','klaring'),('vakan','tietoestemming'),('sloop','melding'),('strij','dig'),('kinder','opvang'),('geluids','hinder'),('leeg','standswet'),('contractu','eel'),('accom','modatie'),('waar','schuwingsteken'),('automatiseringspro','gramma'),('ingebruikge','ving'),('garan','tiebepalingen'),('Samenwerkingsovereen','komst'),('schenkings','overeenkomst'),('loontoe','slag'),('beslag','legging'),('basisadmi','nistraties'),('woning','statistiek'),('beschikbaarge','stelde'),('ge','frankeerde'),('hoogwaar','digheidsbekleder'),('aansprakelijk','stelling')]
PATTERNS=[('koppelteken_in_woord',re.compile(r'(?<!\w)[^\W\d_]+-[^\W\d_]+(?!\w)')),('woordafbreking',re.compile(r'(?<!\w)[^\W\d_]+-\s+[^\W\d_]+(?!\w)')),('soft_hyphen',re.compile('\u00ad')),('unicode_spatie',re.compile('[\u00a0\u2000-\u200b\u202f\ufeff]')),('meervoudige_spatie',re.compile('[ \t]{2,}')),('randspatie',re.compile(r'^\s+|\s+$')),('spatie_voor_leesteken',re.compile(r' +[,;:!?]')),('ontbrekende_spatie',re.compile(r'(?<=[a-zà-ÿ])[,;!?](?=[A-Za-zÀ-ÿ])')),('regeleinde',re.compile(r'\r?\n')),('herhaald_woord',re.compile(r'\b([a-zà-ÿ]{2,})\s+\1\b',re.I))]
def sha(b):return hashlib.sha256(b).hexdigest()
def jb(v):return (json.dumps(v,ensure_ascii=False,indent=2)+'\n').encode()
def canonical(v):return json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()
def javascript_hashes(values):
 code="import {createHash} from 'node:crypto';let s='';process.stdin.setEncoding('utf8');for await(const b of process.stdin)s+=b;const sort=v=>v&&typeof v==='object'?Array.isArray(v)?v.map(sort):Object.fromEntries(Object.keys(v).sort().map(k=>[k,sort(v[k])])):v;process.stdout.write(JSON.stringify(Object.fromEntries(Object.entries(JSON.parse(s)).map(([p,v])=>[p,createHash('sha256').update(JSON.stringify(sort(v))).digest('hex')]))));"
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',code],input=json.dumps(values,ensure_ascii=False).encode(),cwd=R))

def before(path):return subprocess.check_output(['git','show',BASE+':'+path],cwd=R)
def files():return subprocess.check_output(['git','ls-tree','-r','--name-only',BASE],cwd=R,text=True).splitlines()
def escape(s):return str(s).replace('~','~0').replace('/','~1')
def walk(v,path=(),record=None,ancestors=()):
 if isinstance(v,dict):
  record=v.get('id',record)
  for k,x in v.items():yield from walk(x,path+(k,),record,ancestors+(k,))
 elif isinstance(v,list):
  for i,x in enumerate(v):yield from walk(x,path+(i,),record,ancestors)
 elif isinstance(v,str):yield path,v,record,ancestors

def classify(p):
 if p=='documentatie/inhoudelijke-integriteit.json':return 'technische_metadata_of_bronannotatie'
 if p.startswith(('documentatie/','controle/','tests/')):return 'historisch_controle_of_bewijs'
 if p.startswith('publicatie/'):return 'afgeleid'
 if p.startswith('datasets/'):
  name=pathlib.Path(p).stem
  if name in ['zoeklexicon','relaties','testvragen']:return 'aanvullend_zoeken_en_interpretatie'
  if name in ['structuur','selectiegegevens','bepalingen','rubriekcontext']:return 'primair'
  if name in ['wijzigingen','codeinventaris']:return 'afgeleid'
  return 'technische_metadata_of_bronannotatie'
 return 'technische_configuratie_en_metadata'
def source_for(value,path):
 for n in range(len(path)-1,-1,-1):
  obj=at(value,path[:n])
  if isinstance(obj,dict) and isinstance(obj.get('bron'),dict):return obj['bron']
 return {}

def ptr(path):return '/'+ '/'.join(map(escape,path))
def at(v,path):
 for k in path:v=v[k]
 return v
def put(v,path,new):at(v,path[:-1])[path[-1]]=new

def writecsv(out,name,rows,columns):
 with (out/name).open('w',encoding='utf-8-sig',newline='') as f:
  w=csv.DictWriter(f,fieldnames=columns,delimiter=';');w.writeheader()
  for row in rows:
   w.writerow({k:json.dumps(v,ensure_ascii=False) if isinstance(v,(list,dict)) else v for k,v in row.items() if k in columns})

def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--bronmap',type=pathlib.Path,required=True);ap.add_argument('--output',type=pathlib.Path,required=True);ap.add_argument('--apply',action='store_true');ap.add_argument('--controleer-projecties',action='store_true',help='Na build: registreer en controleer ook de rechtstreeks gegenereerde publieke projecties.');a=ap.parse_args();out=a.output;out.mkdir(parents=True,exist_ok=True)
 manifest=json.loads(before('bronnen/semantische-selectie-tool-bronset-2026-11-25.json'));sources={s['lijst']:s for s in manifest['bronnen']};docs={};sourcecheck=[]
 for y,s in sources.items():
  p=a.bronmap/s['bestandsnaam'];h=sha(p.read_bytes());assert h==s['sha256'],f'Bronhash wijkt af: {p}';docs[y]=fitz.open(p);sourcecheck.append({'lijst':y,'bestand':s['bestandsnaam'],'sha256':h,'pagina_aantal':len(docs[y]),'identiteit_bevestigd':True})
 paths=[p for p in files() if p.endswith('.json')];original={p:json.loads(before(p)) for p in paths};changed={};patches=[];inventory=[];findings=[];proposals=[];counts=collections.Counter();scanned=0
 # Primaire gecontroleerde tekst, nooit de aparte ruwe extractie, termijnen of bronannotaties.
 for y in YEARS:
  for name in ['structuur','selectiegegevens','bepalingen']:
   p=f'datasets/{y}/{name}.json';data=json.loads(before(p));old=original[p]
   for i,r in enumerate(data):
    b=r['bron'];page=b.get('pdf_pagina');bbox=b.get('bbox');literal=docs[y][page-1].get_text('text',clip=fitz.Rect(bbox) if bbox else None)
    for key,text in list(r.items()):
     if key not in TEXT or not isinstance(text,str):continue
     new=text;used=[]
     rs=RULES if y=='2020' else []
     for left,right in rs+([('BRP','gegevens')] if y in ['2017','2020'] else []):
      pattern=re.compile(r'(?<!\w)'+re.escape(left)+r'-\s+'+re.escape(right)+r'(?!\w)')
      if not pattern.search(new):continue
      # Bronregel is per pagina/bronvenster gecontroleerd, niet alleen op woordvorm.
      if not pattern.search(literal):continue
      replacement=left+('-' if left=='BRP' else '')+right
      new,n=pattern.subn(replacement,new);used.append({'links':left,'rechts':right,'correct':replacement,'aantal':n})
     if new!=text:
      path=[i,key];patch={'bestand':p,'pad':path,'json_pointer':ptr(path),'record_id':r['id'],'veld':key,'voor':text,'na':new,'categorie':'B' if all(x['links']=='BRP' for x in used) else 'A','afwijkingstype':'regelafbreking_in_woord','selectielijst':y,'bronbestand':sources[y]['bestandsnaam'],'bronhash':sources[y]['sha256'],'pdf_pagina':page,'bbox':bbox,'bron_id':b['bron_id'],'regels':used,'motivering':'PDF-regelafbreking visueel gecontroleerd; uitsluitend deze benoemde woordvorm en letterlijk aangetroffen splitsing in dit bronvenster. BRP behoudt zijn betekenisvolle koppelteken.','status':'doorgevoerd'}
      patches.append(patch);r[key]=new
   if data!=old:changed[p]=data
 # Alleen letterlijk afgeleide officiële termen volgen hun eigen bestaande doelrecord; geen AI-termen wijzigen.
 for y in YEARS:
  p=f'datasets/{y}/zoeklexicon.json';data=json.loads(before(p));targets={r['id']:r for n in ['structuur','selectiegegevens'] for r in changed.get(f'datasets/{y}/{n}.json',original[f'datasets/{y}/{n}.json'])}
  for i,z in enumerate(data):
   if z.get('herkomsttype')!='officieel':continue
   target=targets.get(z['onderdeel_id']);basis=[x for x in patches if x['record_id']==z['onderdeel_id'] and x['veld'] in ['benaming','officiele_benaming']]
   if not target or not basis:continue
   for key in ['zoekterm','genormaliseerde_zoekterm']:
    text=z[key];new=text
    for b in basis:
     if text==(b['voor'] if key=='zoekterm' else b['voor'].lower()):new=b['na'] if key=='zoekterm' else b['na'].lower();break
    if new!=text:
     q=dict(basis[0]);q.update(bestand=p,pad=[i,key],json_pointer=ptr([i,key]),record_id=z['id'],veld=key,voor=text,na=new,motivering='Letterlijk afgeleide officiële zoekterm volgt geregistreerde broncorrectie; bestaande ID en doel behouden.');patches.append(q);z[key]=new
  if data!=original[p]:changed[p]=data
 # Concordans: uitsluitend een rechtstreeks afgeleid label, alle broncellen/context/relaties blijven exact gelijk.
 p='publicatie/concordans.json';data=json.loads(before(p))
 for path,text,rid,anc in walk(data):
  if not path or path[-1]!='benaming' or 'koppelingen' not in path:continue
  parent=at(data,path[:-1]);target=parent.get('onderdeel_id') or parent.get('id');basis=[x for x in patches if x['record_id']==target and x['veld'] in ['benaming','officiele_benaming'] and x['voor']==text]
  if basis:
   q=dict(basis[0]);q.update(bestand=p,pad=list(path),json_pointer=ptr(path),record_id=rid,veld='benaming',motivering='Afgeleid verwijzingslabel; oorspronkelijke concordanscellen en relaties blijven gelijk.');put(data,path,q['na']);patches.append(q)
 if data!=original[p]:changed[p]=data
 # Na de bestaande build: ook iedere gewijzigde publieke tekstwaarde afzonderlijk verantwoorden.
 if a.controleer_projecties:
  import tempfile
  with tempfile.TemporaryDirectory(prefix='tekstkwaliteit-projecties-') as tmp:
   subprocess.run(['node','scripts/genereer-publicaties.mjs','--output',tmp],cwd=R,check=True,stdout=subprocess.DEVNULL)
   for y in YEARS:
    p=f'publicatie/{y}.json';assert (pathlib.Path(tmp)/(y+'.json')).read_bytes()==(R/p).read_bytes(),p
    data=json.loads((R/p).read_text());structuurpaden=[]
    for i,(oldrow,newrow) in enumerate(zip(original[p]['rijen'],data['rijen'])):
     if len(oldrow.get('notities',[]))==len(newrow.get('notities',[])):continue
     rid=newrow['id'];basis=[x for x in patches if x['bestand'].startswith('datasets/'+y+'/') and x['record_id']==rid];assert basis
     path=['rijen',i,'notities'];structuurpaden.append(path);q=dict(basis[0]);q.update(bestand=p,pad=path,json_pointer=ptr(path),record_id=rid,veld='notities',voor=oldrow['notities'],na=newrow['notities'],status='gegenereerde_deduplicatie',motivering='Bestaande generator laat een overbodige benoemingsnotitie weg zodra de gecorrigeerde officiële benaming gelijk is aan de zichtbare omschrijving. Volledige oude en nieuwe notities bewaard; geen broninhoud verwijderd.');patches.append(q)
    for path,text,rid,anc in walk(data):
     if any(list(path[:len(q)])==q for q in structuurpaden):continue
     old=at(original[p],path)
     if text==old:continue
     assert isinstance(old,str)
     b=source_for(data,path)
     if path[0]=='achtergrond':
      label=data['achtergrond'][path[1]].get('titel','');match=re.search(r'pagina (\d+)$',label)
      if match:b={'pdf_pagina':int(match[1])};rid=None
     basis=[x for x in patches if x['bestand'].startswith('datasets/'+y+'/') and (x['record_id']==rid if rid else x['pdf_pagina']==b.get('pdf_pagina'))]
     assert basis,(p,path,rid,b)
     q=dict(basis[0]);q.update(bestand=p,pad=list(path),json_pointer=ptr(path),record_id=rid,veld=str(path[-1]),voor=old,na=text,status='gegenereerd',motivering='Bestaande publieke generator; rechtstreeks afgeleid van geregistreerde primaire tekstcorrecties. Geen zelfstandig bewerkte publicatiewaarde.')
     patches.append(q)
 # Volledige inventarisatie, inclusief bevroren gegevens en technische JSON; daar alleen signaleren.
 for p in paths:
  cat=classify(p);groups=collections.defaultdict(lambda:collections.Counter());v=original[p]
  for path,text,rid,anc in walk(v):
   meaningful=(bool(set(anc)&TEXT) or (len(text.split())>2 and not re.match(r'^(https?://|[./]?(datasets|documentatie|bronnen)/)',text))) and not bool(set(anc)&PROTECTED)
   if p.startswith('publicatie/') and 'waarden' in path:meaningful=True
   if p=='publicatie/concordans.json' and ('waarden' in path or 'context' in path):meaningful=True
   wildcard=ptr(['*' if isinstance(x,int) else x for x in path]);g=groups[wildcard];g['tekstwaarden']+=1;g['tekens']+=len(text)
   if not meaningful:g['technisch_of_immuut']+=1;continue
   g['onderzochte_tekstwaarden']+=1;scanned+=1
   for typ,pattern in PATTERNS:
    ms=list(pattern.finditer(text))
    if not ms:continue
    g['signalen']+=len(ms);counts[typ]+=len(ms)
    # Groepeer herhaalde identieke patronen per veld; posities verwijzen naar de letterlijke basiswaarde.
    grouped=collections.defaultdict(list)
    for match in ms:grouped[match[0]].append(match)
    for matches in grouped.values():
     m=matches[0]
     # Geen claims op grond van patroonherkenning: ook legitieme constructies zijn signalen.
     legitimate=typ=='woordafbreking' and m[0].split()[-1].lower() in ['en','of']
     corrected=any(x['bestand']==p and x['pad']==list(path) and any(m[0]==q['links']+'- '+q['rechts'] or re.fullmatch(re.escape(q['links'])+r'-\s+'+re.escape(q['rechts']),m[0]) for q in x['regels']) for x in patches)
     status='doorgevoerd' if corrected else 'behouden_betekenisvol_koppelteken' if legitimate else 'behouden_voor_beoordeling'
     category='A' if corrected else 'B' if legitimate else 'E'
     if corrected and m[0].startswith('BRP-'):category='B'
     frozen=cat=='historisch_controle_of_bewijs' or any(x in anc for x in ['ruwe_extractie','officiele_bronrij'])
     if frozen:status='bevroren_niet_wijzigen';category='E'
     if typ in ['regeleinde','meervoudige_spatie','randspatie'] and not corrected:status='structuur_of_witruimte_beoordelen_geen_foutvaststelling' if not frozen else status
     # Grootste bewijs-/paginavelden: beperk alleen het signaalexcerpt, nooit de correctiewaarde.
     b=source_for(v,path);sy=p.split('/')[1] if p.startswith('datasets/') else None
     lead={'1996-2012':'1996-2012-leidend-2026-11-25','2017':'2017-opgemaakt','2020':'2020-officieel'}
     source=sources.get(sy,{}) if sy and b.get('bron_id')==lead[sy] else {}
     row={'bron_id':b.get('bron_id'),'pdf_pagina':b.get('pdf_pagina'),'bbox':b.get('bbox'),'bronbestand':source.get('bestandsnaam'),'bronhash':source.get('sha256'),'bestand':p,'categorie_bestand':cat,'record_id':rid,'json_pointer':ptr(path),'type':typ,'classificatie':category,'aantal_in_veld':len(matches),'positie':[x.start() for x in matches],'aangetroffen':m[0],'context':text[max(0,m.start()-80):m.end()+80],'status':status,'bronlocatie':'zie ongewijzigde recordbron; signaal is geen broncorrectiebewijs'}
     findings.append(row)
  if not groups:inventory.append({'bestand':p,'categorie':cat,'veld':'(geen tekstwaarden)','tekstwaarden':0,'tekens':0,'onderzochte_tekstwaarden':0,'technisch_of_immuut':0,'signalen':0})
  for field,n in sorted(groups.items()):inventory.append({'bestand':p,'categorie':cat,'veld':field,**n})
 # Twee visueel aan de bron bevestigde taalvoorstellen. Bronformulering blijft letterlijk behouden.
 for y,word,suggestion,page,reason in [('2017','voorvoor','voor',26,'Mogelijke dubbele woordtypografie in de officiële bron.'),('2020','verstekken','verstrekken',31,'Mogelijk ontbrekende r in de officiële formulering; niet als broncorrectie vastgesteld.')]:
  pages=[(p.number+1,p.get_text()) for p in docs[y] if word in p.get_text()]
  assert any(n==page for n,t in pages)
  for page,page_text in pages:
   pos=page_text.index(word);proposals.append({'selectielijst':y,'letterlijke_officiele_tekst':page_text[max(0,pos-60):pos+len(word)+80],'voorstel':suggestion,'motivering':reason,'betekenisrisico':'Geen toepassing zonder menselijke redactionele beoordeling; officiële tekst blijft leidend.','classificatie':'C','bronbestand':sources[y]['bestandsnaam'],'bronhash':sources[y]['sha256'],'pdf_pagina':page,'status':'niet_doorgevoerd'})
 # Bron-eigen taalvoorstellen staan ook in het volledige bevindingenregister, zonder wijziging.
 for q in proposals:
  p=f"datasets/{q['selectielijst']}/bepalingen.json";i=q['pdf_pagina']-1;r=original[p][i]
  q.update(bestand=p,record_id=r['id'],json_pointer=ptr([i,'tekst']))
  findings.append({'bestand':p,'categorie_bestand':'primair','record_id':r['id'],'json_pointer':q['json_pointer'],'type':'mogelijk_bron_eigen_taalprobleem','classificatie':'C','aantal_in_veld':1,'positie':[],'aangetroffen':q['letterlijke_officiele_tekst'],'context':q['motivering'],'status':'niet_doorgevoerd_zie_taalvoorstellen','bronlocatie':f"PDF-pagina {q['pdf_pagina']}",'bron_id':r['bron']['bron_id'],'pdf_pagina':q['pdf_pagina'],'bbox':None,'bronbestand':q['bronbestand'],'bronhash':q['bronhash']})
 # Metadata en CSV's worden in één reproduceerbare stap uit de gewijzigde primaire waarden afgeleid.
 if a.apply:
  for p,d in changed.items():(R/p).write_bytes(jb(d) if not p.startswith('publicatie/') else (json.dumps(d,ensure_ascii=False,separators=(',',':'))+'\n').encode())
  for y in YEARS:
   for name in ['structuur','selectiegegevens','zoeklexicon','relaties','testvragen']:
    p=f'datasets/{y}/{name}.json'
    if p not in changed:continue
    rows=changed[p]
    with (R/f'datasets/{y}/{name}.csv').open('w',encoding='utf-8-sig',newline='') as f:
     w=csv.DictWriter(f,fieldnames=sorted(set().union(*(r.keys() for r in rows))));w.writeheader();w.writerows({k:json.dumps(v,ensure_ascii=False) if isinstance(v,(dict,list)) else v for k,v in r.items()} for r in rows)
   p=f'datasets/{y}/manifest.json';d=json.loads(before(p))
   for f in d['sha256']:d['sha256'][f]=sha((R/f'datasets/{y}'/f).read_bytes())
   if d!=original[p]:(R/p).write_bytes(jb(d))
  p='documentatie/inhoudelijke-integriteit.json';d=json.loads(before(p))
  d['methode']+=' Nieuwe afzonderlijk geregistreerde technische tekstcorrecties: documentatie/tekstkwaliteit/mutaties.json; eerdere bewijsregistraties behouden.'
  for y in YEARS:
   for name in d['inhoudelijke_hashes'][y]:
    v=json.loads((R/f'datasets/{y}/{name}.json').read_text())
    if name=='selectiegegevens':v=[{k:x for k,x in r.items() if k!='verificatie'} for r in v]
    d['inhoudelijke_hashes'][y][name]=sha(canonical(v))
  (R/p).write_bytes(jb(d))
 if a.controleer_projecties:
  filemutations={}
  for p in files():
   if not (p.startswith(('datasets/','publicatie/')) or p=='documentatie/inhoudelijke-integriteit.json'):continue
   oldhash=sha(before(p));newhash=sha((R/p).read_bytes())
   if oldhash!=newhash:filemutations[p]={'voor_sha256':oldhash,'na_sha256':newhash}
  (out/'bestandsmutaties.json').write_bytes(jb(filemutations))
  (out/'integriteitsreferentie-voor.json').write_bytes(before('documentatie/inhoudelijke-integriteit.json'))
 # Oude audit-/bewijshashes blijven bewaard; nieuwe waarden worden uitsluitend in dit register verantwoord.
 uncertainty=[x for x in findings if x['classificatie']=='E' and x['categorie_bestand'] in ['primair','aanvullend_zoeken_en_interpretatie'] and x['type'] not in ['regeleinde','meervoudige_spatie','randspatie']]
 columns=['bestand','categorie_bestand','record_id','json_pointer','type','classificatie','aantal_in_veld','positie','aangetroffen','context','status','bronlocatie','bron_id','pdf_pagina','bbox','bronbestand','bronhash']
 writecsv(out,'tekstkwaliteit-inventarisatie.csv',inventory,['bestand','categorie','veld','tekstwaarden','tekens','onderzochte_tekstwaarden','technisch_of_immuut','signalen'])
 writecsv(out,'tekstkwaliteit-bevindingen.csv',findings,columns)
 writecsv(out,'tekstkwaliteit-onzekerheden.csv',uncertainty,columns)
 writecsv(out,'tekstkwaliteit-correcties.csv',patches,['selectielijst','bestand','record_id','veld','json_pointer','voor','na','categorie','afwijkingstype','bron_id','bronbestand','bronhash','pdf_pagina','bbox','regels','motivering','status'])
 writecsv(out,'tekstkwaliteit-taalvoorstellen.csv',proposals,['selectielijst','bestand','record_id','json_pointer','letterlijke_officiele_tekst','voorstel','motivering','betekenisrisico','classificatie','bronbestand','bronhash','pdf_pagina','status'])
 for name,value in [('inhoud-voor.json',javascript_hashes({p:original[p] for p in sorted({x['bestand'] for x in patches})})),('mutaties.json',patches),('bronverificatie.json',sourcecheck),('nulmeting.json',{'basiscommit':BASE,'bestanden':{p:sha(before(p)) for p in files() if not p.startswith('documentatie/tekstkwaliteit/')}}),('tellingen.json',{'basiscommit':BASE,'json_bestanden':len(paths),'onderzochte_tekstwaarden':scanned,'inventarisatie_veldgroepen':len(inventory),'signalen_per_type':dict(counts),'signalen':sum(counts.values()),'bevindingregels':len(findings),'onzekerheidssignalen':len(uncertainty),'taalvoorstellen':len(proposals),'geregistreerde_mutaties':len(patches),'gewijzigde_tekstwaarden':sum(isinstance(x['na'],str) for x in patches),'gegenereerde_deduplicaties':sum(isinstance(x['na'],list) for x in patches),'primaire_en_officiele_zoekterm_mutaties':sum(x['bestand'].startswith('datasets/') for x in patches),'publieke_afgeleide_mutaties':sum(x['bestand'].startswith('publicatie/') for x in patches),'correcties_per_lijst':dict(collections.Counter(x['selectielijst'] for x in patches)),'vervangingen':sum(sum(r['aantal'] for r in x['regels']) for x in patches if x['bestand'].startswith('datasets/'))})]:
  (out/name).write_bytes(jb(value))
 print(json.dumps(json.loads((out/'tellingen.json').read_text()),ensure_ascii=False,indent=2))
if __name__=='__main__':main()
