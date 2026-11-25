#!/usr/bin/env python3
"""Herijk uitsluitend de aangewezen PDF's; onafhankelijke extractie vóór datasetvergelijking.

--output maakt een afzonderlijke reproduceerbare uitvoer. --apply kopieert uitsluitend
gecontroleerde uitvoer naar de checkout; normatieve waarden/ID's worden niet geraden.
"""
from pathlib import Path
import argparse,collections,copy,csv,hashlib,importlib.util,io,json,re,shutil,subprocess
import fitz
from bronherijking_pdf import decode,GLYPHS
R=Path(__file__).resolve().parents[1]
CFG=json.loads((R/'documentatie/bronherijking/configuratie.json').read_text())
BASIS=CFG['basiscommit'];DOC='documentatie/bronherijking/'
COLS17=[('procestype',29,54.3),('procesnaam',54.3,95.5),('procesomschrijving',95.5,210.5),('procestoelichting',210.5,325.5),('procesobject',325.5,374.7),('code',374.7,392.6),('generiek_specifiek',392.6,426.9),('resultaat',426.9,456.2),('omschrijving',456.2,504.2),('herkomst',504.2,535.8),('waardering',535.8,567.1),('procestermijn',567.1,624.4),('bewaartermijn',624.4,656.2),('toelichting',656.2,773.3),('taakvelden',773.3,1160)]
COLS20=[*COLS17[:5],('generiek_specifiek',374.7,408.9),('resultaat',408.9,438.2),('code',438.2,456.2),*COLS17[8:]]
FIELDS={'officiele_omschrijving':'omschrijving','resultaattype':'resultaat','generiek_specifiek':'generiek_specifiek','procesomschrijving':'procesomschrijving','procesobject':'procesobject','waardering.officiele_tekst':'waardering','bewaartermijn.officiele_tekst':'bewaartermijn','procestermijn.officiele_tekst':'procestermijn','toelichting':'toelichting','herkomst_waardering':'herkomst','taakvelden_brontekst':'taakvelden','uitzonderingen_en_verwijzingen.officiele_tekst':'toelichting'}
KEYS=['1996-2012','2017','2020'];SOURCE_IDS={'1996-2012':'1996-2012-leidend-2026-11-25','2017':'2017-opgemaakt','2020':'2020-officieel'}
sha=lambda b:hashlib.sha256(b).hexdigest()
def canon(v):return json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':'))
def encoded(v):return (json.dumps(v,ensure_ascii=False,indent=2)+'\n').encode()
def n1(s):return re.sub(r'\s+',' ',str(s or '').replace('\xad','')).strip()
def n2(s):return re.sub(r'\s+','',str(s or '').replace('\xad',''))
def n3(s):return n2(re.sub(r'-\n(?=\w)','',str(s or '')))
def wrap_equal(old,new):
 # Alleen PDF-regeleindkoppeltekens mogen in deze vergelijking aanwezig of afwezig zijn.
 # Beide bronwaarden blijven letterlijk bewaard; dit herschrijft geen datasettekst.
 pattern='-?'.join(re.escape(n2(part))for part in re.split(r'-[ \t]*\n[ \t]*',str(new or '')))
 return re.fullmatch(pattern,n2(old))is not None
def category(old,new):
 if old==new:return 'exact overeenkomstig'
 if (old is None and new=='')or(old==''and new is None):return 'exact overeenkomstig; lege bronwaarde'
 if n1(old)==n1(new)or n2(old)==n2(new)or n3(old)==n3(new)or wrap_equal(old,new):return 'alleen technisch presentatieverschil'
 if new in [None,'']:return 'datasetwaarde niet rechtstreeks bevestigd in leidende bron'
 if old in [None,'']:return 'ontbrekend gegeven in dataset'
 return 'inhoudelijk afwijkende waarde; geen automatisch inhoudelijk oordeel'
def pathget(obj,path):
 for k in path.split('.'):obj=obj[k]
 return obj
CACHE={}
def original(path):
 if path not in CACHE:CACHE[path]=subprocess.check_output(['git','show',BASIS+':'+path],cwd=R)
 return CACHE[path]
def data(path):return json.loads(original(path))
PRINTED={}
def printed(page):
 key=(id(page.parent),page.number)
 if key in PRINTED:return PRINTED[key]
 candidates={w[4]for w in page.get_text('words')if re.fullmatch(r'\d{1,3}',w[4])and(w[1]<40 or w[1]>page.rect.height-40)}
 value=int(next(iter(candidates)))if len(candidates)==1 else None
 PRINTED[key]=value
 return value

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--bronmap',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--apply',action='store_true');a=p.parse_args()
 assert a.output.resolve()!=R,'Uitvoer moet afzonderlijk van repositoryroot zijn'
 manifest=json.loads((R/CFG['leidende_bronset']).read_text());docs={};rawdocs={};source={};verification=[];out={};patches={};inventory=[];differences=[];reviews=[];corrections=[]
 def emit(path,v):out[path]=encoded(v)
 def csvout(path,rows,columns=None):
  assert rows or columns,'CSV heeft expliciete kolommen nodig'
  f=io.StringIO(newline='');w=csv.DictWriter(f,fieldnames=columns or list(rows[0]),delimiter=';',lineterminator='\r\n');w.writeheader()
  for row in rows:w.writerow({k:json.dumps(v,ensure_ascii=False)if v is None or isinstance(v,(dict,list,bool))or isinstance(v,str)and any(ord(c)<32 and c not in '\r\n\t'for c in v)else v for k,v in row.items()})
  out[path]=b'\xef\xbb\xbf'+f.getvalue().encode()
 def change(path,reason,operation=None):
  if operation is None and path in out:
   before=data(path)if path in tracked else None;after=json.loads(out[path])
   def leaves(old,new,prefix,rid,bron):
    if old==new:return
    if isinstance(old,dict)and isinstance(new,dict):
     for key in sorted(set(old)|set(new)):leaves(old.get(key),new.get(key),prefix+'.'+key,rid,bron)
    elif isinstance(old,list)and isinstance(new,list):
     for i in range(max(len(old),len(new))):leaves(old[i]if i<len(old)else None,new[i]if i<len(new)else None,prefix+'.'+str(i),rid,bron)
    elif isinstance(new,dict)and old is None:
     for key,value in new.items():leaves(None,value,prefix+'.'+key,rid,bron)
    elif isinstance(old,dict)and new is None:
     for key,value in old.items():leaves(value,None,prefix+'.'+key,rid,bron)
    else:change(path,reason,{'record_id':rid,'veld':prefix,'voor':old,'na':new,'bron':bron})
   if isinstance(after,list):
    byid={str(r.get('id',r.get('code',i))):r for i,r in enumerate(before or [])};seen=set()
    for i,row in enumerate(after):
     rid=str(row.get('id',row.get('code',i)));seen.add(rid);leaves(byid.get(rid),row,'bronrecord',rid,row.get('bron'))
    for rid,row in byid.items():
     if rid not in seen:leaves(row,None,'historische_bronpagina',rid,row.get('bron'))
   else:leaves(before,after,'bronmetadata',None,path)
   return
  corrections.append({'bestand':path,'selectielijst':path.split('/')[1]if path.startswith('datasets/')else None,'record_id':operation.get('record_id')if operation else None,'veld':operation.get('veld')if operation else None,'oude_waarde':operation.get('voor')if operation else None,'nieuwe_waarde':operation.get('na')if operation else None,'bronverwijzing':operation.get('bron')if operation else None,'reden':reason})
 def patch(path,obj,key,value,record_id,veld,bron,reden):
  old=copy.deepcopy(obj[key]);
  if old==value:return
  obj[key]=copy.deepcopy(value);entry={'record_id':record_id,'veld':veld,'voor':old,'na':value,'bron':bron};patches.setdefault(path,[]).append(entry);change(path,reden,entry)
 def loc(y,page,bbox=None):return {'bron_id':SOURCE_IDS[y],'pdf_pagina':page,'bbox':list(bbox)if bbox else None}
 for s in manifest['bronnen']:
  y=s['lijst'];f=a.bronmap/s['bestandsnaam'];b=f.read_bytes();d=fitz.open(stream=b,filetype='pdf')
  assert sha(b)==s['sha256']and len(b)==s['bytes']and len(d)==s['pdf_paginas'],('Bronidentiteit wijkt af',y)
  source[y]=s;rawdocs[y]=d;docs[y]=decode(fitz.open(stream=b,filetype='pdf'))if y=='1996-2012'else d
  verification.append({**s,'sha256_berekend':sha(b),'identiteit_bevestigd':True,'extractie':'visueel geverifieerde glyphmapping; ruwe tekst bewaard'if y=='1996-2012'else'PDF-karakterposities en tekstblokken','nieuwe_online_download':False})
 emit(DOC+'bronverificatie.json',verification)
 emit(DOC+'glyphmapping-2012.json',{'bron_sha256':source['1996-2012']['sha256'],'methode':'Alle gebruikte Verdana-glyphs visueel getoetst op glyphkaart-2012.png; uitsluitend ToUnicode in-memory. Brondocumentbytes ongewijzigd.','glyphs':GLYPHS})
 # Nulmeting omvat alle tracked input-/afhankelijkheidsbestanden, vóór mutaties.
 tracked=subprocess.check_output(['git','ls-tree','-r','--name-only',BASIS],cwd=R,text=True).splitlines()
 baseline={f:sha(original(f))for f in tracked if f.startswith(('datasets/','schemas/','scripts/','src/','concordans/','publicatie/','bronnen/','tests/','documentatie/'))}
 packs={y:{n:data(f'datasets/{y}/{n}.json')for n in ['structuur','selectiegegevens','zoeklexicon','relaties','testvragen','bronannotaties','manifest','validatie']}for y in KEYS}
 counts_before={y:{n:len(pack[n])for n in ['structuur','selectiegegevens','zoeklexicon','relaties','testvragen','bronannotaties']}for y,pack in packs.items()}
 emit(DOC+'nulmeting.json',{'basiscommit':BASIS,'aantallen':counts_before,'bestandshashes':baseline,'bestaande_bronannotaties':{y:pack['bronannotaties']for y,pack in packs.items()},'identificaties':{y:{n:[r['id']for r in pack[n]]for n in ['structuur','selectiegegevens','zoeklexicon','relaties']}for y,pack in packs.items()}})
 PAGE_TEXT={};PAGE_N3={};FIGURES=json.loads((R/(DOC+'figuur-transcripties.json')).read_text())['figuren']
 # Alle 334 PDF-pagina's, inclusief voetnoten, algemene regels en bijlagen, onafhankelijk lezen.
 for y,d in docs.items():
  page_records=[];PAGE_TEXT[y]=[];PAGE_N3[y]=[]
  print('Inventariseer pagina’s',y,flush=True)
  for index,page in enumerate(d):
   pg=index+1;raw=rawdocs[y][index].get_text();text=page.get_text();pp=printed(page);PAGE_TEXT[y].append(text);PAGE_N3[y].append(n3(text))
   figures=[f for f in FIGURES if f['selectielijst']==y and f['pdf_pagina']==pg]
   for f in figures:
    assert sha(d.extract_image(f['image_xref'])['image'])==f['image_sha256']
    boxes=page.get_image_rects(f['image_xref']);assert len(boxes)==1
    text+='\n\nLetterlijke tekst in rasterfiguur (geen interpretatie):\n'+f['tekst']
    inventory.append({'selectielijst':y,'inventaris_type':'visueel_getranscribeerde_rasterfiguur','bronrecord_id':f'{y}:pdf:{pg}:figuur:{f["image_xref"]}','record_id':None,'officiele_code':None,'veld':'letterlijke_figuurtekst','bronwaarde':f['tekst'],'ruwe_extractie_json':None,'bron_id':SOURCE_IDS[y],'bron_sha256':source[y]['sha256'],'pdf_pagina':pg,'gedrukt_paginanummer':pp,'bbox':list(boxes[0]),'verwerking':'visueel getoetste letterlijke labels; afbeeldinghash '+f['image_sha256']+'; geen proces- of selectierelatie afgeleid'})
   if y=='2020'and pg>=88:typ='bijlage_8_officieel_wijzigingsoverzicht'
   elif y=='2017'and pg>=89:typ='bijlage_wijzigingsoverzicht'
   elif y=='1996-2012'and 18<=pg<=73:typ='selectietabel_met_rubriekcontext_en_voetnoten'
   else:typ='volledige_bronpagina_geen_juridische_interpretatie'
   row={'id':f'{y}:bronpagina:{pg}','type':typ,'tekst':text,'tekst_leesbaar':text,'ruwe_extractie':raw,'bron':loc(y,pg),'gedrukt_paginanummer':pp,'bron_sha256':source[y]['sha256'],'interpretatie':False}
   page_records.append(row)
   inventory.append({'selectielijst':y,'inventaris_type':'volledige_bronpagina','bronrecord_id':row['id'],'record_id':None,'officiele_code':None,'veld':'tekst','bronwaarde':text,'ruwe_extractie_json':json.dumps(raw,ensure_ascii=True),'bron_id':SOURCE_IDS[y],'bron_sha256':source[y]['sha256'],'pdf_pagina':pg,'gedrukt_paginanummer':pp,'bbox':list(page.rect),'verwerking':'volledige pagina, inclusief context; geen regels toegepast op specifieke resultaten'})
   for bi,block in enumerate(page.get_text('blocks')):
    inventory.append({'selectielijst':y,'inventaris_type':'onafhankelijk_tekstblok_inclusief_voetnoten_en_bijlagen','bronrecord_id':f'{y}:pdf:{pg}:blok:{bi}','record_id':None,'officiele_code':None,'veld':'letterlijke_brontekst','bronwaarde':block[4],'ruwe_extractie_json':None,'bron_id':SOURCE_IDS[y],'bron_sha256':source[y]['sha256'],'pdf_pagina':pg,'gedrukt_paginanummer':pp,'bbox':list(block[:4]),'verwerking':'volledige onafhankelijke blokinventaris; geen normatieve toepassing op resultaat afgeleid'})
  path=f'datasets/{y}/bepalingen.json';old=data(path)
  if old!=page_records:emit(path,page_records);change(path,'Volledige pagina-inventaris uit uitsluitend aangewezen leidende PDF, inclusief letterlijke glyphdecodering en behoud ruwe tekst.')
  if y in ['2017','2020']:
   # Geen afgeleide wijzigingen per code: alleen gehele bronpagina's met letterlijke tekst.
   first=88 if y=='2020'else 89
   path=f'datasets/{y}/wijzigingen.json';new=[r for r in page_records if r['bron']['pdf_pagina']>=first];emit(path,new);change(path,'Wijzigingscontext afkomstig uit de aangewezen PDF; geen zelfstandige concordansrelaties afgeleid.')
 # 2017/2020: bestaande geometrische extractor, zonder datasets als invoer.
 spec=importlib.util.spec_from_file_location('pdfextract',R/'scripts/bronopbouw/extract_tables.py');ex=importlib.util.module_from_spec(spec);spec.loader.exec_module(ex)
 independent={};fieldcounts=collections.Counter();unresolved=[];cell_cache={}
 def cell_literal(y,pg,bbox):
  key=(y,pg)
  if key not in cell_cache:
   cell_cache[key]=[c for b in docs[y][pg-1].get_text('rawdict')['blocks']for line in b.get('lines',[])for span in line['spans']for c in span['chars']]
  x0,y0,x1,y1=bbox;lines=collections.defaultdict(list)
  for c in cell_cache[key]:
   if x0<=c['bbox'][0]<x1 and y0<=c['bbox'][1]<y1:lines[round(c['bbox'][1],3)].append(c)
  return '\n'.join(''.join(c['c']for c in sorted(chars,key=lambda c:c['bbox'][0])).strip()for top,chars in sorted(lines.items())).strip()

 for y in ['2017','2020']:
  print('Inventariseer tabel',y,flush=True)
  rows=ex.extract(a.bronmap/source[y]['bestandsnaam'],'2017-upload'if y=='2017'else'2020');independent[y]=rows
  assert len({r['code']for r in rows})==len(rows),'Dubbele PDF-code'
  # Tweede inventaris op procesnummerkolom: geen resultaatcode-regex of databaserecords.
  process_marks=[{'pdf_pagina':i+1,'procestypenummer':w[4],'bbox':list(w[:4])}for i,page in enumerate(docs[y])if page.rect.width>1000 and'Procestypenaam'in page.get_text()for w in page.get_text('words')if 29<=w[0]<32 and 55<w[1]<805 and re.fullmatch(r'(?:[1-9]|[12]\d)',w[4])]
  assert len(process_marks)==len(rows),(y,'Proceskolom en resultaatkolom wijken af')
  emit(DOC+f'proceskolominventaris-{y}.json',process_marks)
  db={r['code']:r for r in packs[y]['selectiegegevens']};codes={r['code']for r in rows}
  assert set(db)==codes,(y,'Afwijkende codeverzameling; stop voor identiteitsbesluit')
  cols={name:(x0,x1)for name,x0,x1 in(COLS17 if y=='2017'else COLS20)}
  for row in rows:
   code=row['code'];d=db[code];pg=row['pagina'];rowloc=loc(y,pg,row['bbox'])
   for name,value in row.items():
    if name in ['pagina','bbox']:continue
    x0,x1=cols[name];bbox=[x0,row['bbox'][1],x1,row['bbox'][3]]
    # Oude extractor negeert SHY. Bewaar ook de oorspronkelijke PDF-celtekens.
    literal=cell_literal(y,pg,bbox)
    inventory.append({'selectielijst':y,'inventaris_type':'onafhankelijke_resultaatcel','bronrecord_id':f'{y}:pdf:{pg}:{code}:{name}','record_id':d['id'],'officiele_code':code,'veld':name,'bronwaarde':value,'ruwe_extractie_json':json.dumps(literal,ensure_ascii=True),'bron_id':SOURCE_IDS[y],'bron_sha256':source[y]['sha256'],'pdf_pagina':pg,'gedrukt_paginanummer':printed(docs[y][pg-1]),'bbox':bbox,'verwerking':'enkel exacte code-identiteit; karakterposities; geen semantische koppeling'})
   for path,field in [*FIELDS.items(),('officiele_benaming','__benaming')]:
    old=pathget(d,path);new=(row['omschrijving']or row['resultaat'])if field=='__benaming'else(row[field]or None);kind=category(old,new);fieldcounts[kind]+=1
    if not kind.startswith('exact'):
     diff={'selectielijst':y,'record_id':d['id'],'officiele_code':code,'veld':path,'huidige_waarde':old,'bronwaarde':new,'bronlocatie':rowloc,'bron_sha256':source[y]['sha256'],'type_afwijking':kind,'technische_verwerking':'bronwaarden behouden; presentatieverschil gedocumenteerd'if kind=='alleen technisch presentatieverschil'else'behoud bestaand gegeven en bestaande bronkeuze; menselijke beoordeling','reden_geen_automatische_correctie':None if kind=='alleen technisch presentatieverschil'else'Bronwaarde wijkt letterlijk af; geen inhoudelijke betekenis of alternatieve koppeling afgeleid.'}
     differences.append(diff)
     if kind!='alleen technisch presentatieverschil':
      reviews.append(diff)
      if path=='procestermijn.officiele_tekst'and new is None:unresolved.append(d['id'])
   if d['id']in unresolved:
    f=f'datasets/{y}/selectiegegevens.json';note='Bronherijking 2026-11-25: Nihil is niet opnieuw bevestigd in de lege cel van de aangewezen leidende PDF. Eerdere expliciete XLS-bronkeuze en bronannotaties behouden; beoordeling nodig vóór een inhoudelijke wijziging.'
    patch(f,d['procestermijn'],'status','niet_opnieuw_bevestigd_uit_leidende_pdf',d['id'],'procestermijn.status',rowloc,'Bronstatus zichtbaar maken; normatieve waarde en historisch besluit niet gewijzigd.')
    patch(f,d['verificatie'],'bevindingen',d['verificatie']['bevindingen']+[note],d['id'],'verificatie.bevindingen',rowloc,'Nieuwe bronvoorrang en resterend beoordelingsgeval expliciet; eerdere bevindingen behouden.')
    previous=d['verificatie']['bronannotaties'][0]
    annotation={**copy.deepcopy(previous),'id':y+':bronherijking:'+code,'bevinding':'De voor herijking aangewezen PDF-cel voor de procestermijn is leeg; de bestaande Nihil-waarde berust op een eerder expliciet vastgelegde XLS-bronkeuze.','verwerking':'De waarde Nihil en de eerdere bronannotatie blijven behouden. De waarde is niet opnieuw uit de leidende PDF bevestigd; geen automatische wijziging of betekenis aan de lege cel toegekend.','status_verwerking':'herijking_beoordeling_nodig','controleopdracht_gebruiker':'Beoordeel de bestaande bronkeuze tegenover de nieuwe PDF-bronvoorrang. Geen vooraf ingevuld inhoudelijk oordeel.','bron':rowloc,'aanvullende_bronnen':[]}
    annotation.pop('menselijke_bevestiging',None)
    patch(f,d['verificatie'],'bronannotaties',d['verificatie']['bronannotaties']+[annotation],d['id'],'verificatie.bronannotaties',rowloc,'Nieuwe herijkingsonzekerheid zichtbaar via bestaande annotatievoorziening; eerdere annotatie volledig behouden.')
    packs[y]['bronannotaties'].append(annotation)

   # Legenda letterlijk lokaliseren, geen nieuwe categorie toewijzen.
   a_old=d['aanvangsmoment'].get('bron');value=d['aanvangsmoment']['officiele_tekst'];legend_page=26 if y=='2017'else 25
   if a_old and value and n3(value)in n3(docs[y][legend_page-1].get_text()):
    patch(f'datasets/{y}/selectiegegevens.json',d['aanvangsmoment'],'bron',loc(y,legend_page),d['id'],'aanvangsmoment.bron',loc(y,legend_page),'Bestaande letterlijke legenda krijgt de werkelijk gebruikte leidende bronpagina; geen nieuwe termijninterpretatie.')
 # 1996/2012: tabelgroepen en waarderingsankers onafhankelijk van concordans/datasets.
 y='1996-2012';d=docs[y];terms=[];groups=[];source_spans=[]
 print('Inventariseer 2012-tabel onafhankelijk',flush=True)
 for pi in range(17,73):
  page=d[pi]
  for block in page.get_text('dict')['blocks']:
   for line in block.get('lines',[]):
    for span in line['spans']:
     x0,y0,x1,y1=span['bbox'];text=span['text'].strip()
     if x0>=400 and y0<745 and(text=='B'or re.match(r'^(?:\d+(?:[,.]\d+)?\s+(?:jaar|maand|dag|week)|[Nn]a |[Dd]irect|[Vv]ernietig)',text)):
      terms.append({'pdf_pagina':pi+1,'bbox':list(span['bbox']),'letterlijke_aanvang_waarderingscel':text})
  for table in page.find_tables().tables:
   if table.col_count!=3 or table.bbox[0]>150 or table.bbox[2]<500 or table.bbox[2]-table.bbox[0]<400:continue
   for row in table.rows:
    if row.cells[2]is None:continue
    cells=[page.get_text(clip=fitz.Rect(box)).strip()if box else None for box in row.cells]
    groups.append({'pdf_pagina':pi+1,'cellen':cells,'cel_bboxes':row.cells})
    for index,(text,box)in enumerate(zip(cells,row.cells)):
     inventory.append({'selectielijst':y,'inventaris_type':'onafhankelijke_tabelgroep_meerdere_voorschriften_mogelijk','bronrecord_id':f'{y}:pdf:{pi+1}:groep:{len(groups)}:cel:{index}','record_id':None,'officiele_code':cells[0],'veld':['rubriekopschrift','omschrijving_met_voorwaarden','waardering_en_termijn'][index],'bronwaarde':text,'ruwe_extractie_json':None,'bron_id':SOURCE_IDS[y],'bron_sha256':source[y]['sha256'],'pdf_pagina':pi+1,'gedrukt_paginanummer':printed(page),'bbox':list(box)if box else None,'verwerking':'broncelgrenzen behouden; geen nieuw individueel voorschrift geconstrueerd'})
 emit(DOC+'onafhankelijke-tabelgroepen-1996-2012.json',groups)
 # Controleer álle bestaande segmentlocaties opnieuw rechtstreeks in de leidende PDF.
 segment_checks=[];identified=set()
 for r in packs[y]['selectiegegevens']:
  for field in ['beschrijving_segmenten','termijn_segmenten']:
   segs=r['officiele_bronrij'][field]
   observed=[]
   for s in segs:
    pg=s['pagina'];box=s['bbox'];literal=d[pg-1].get_text(clip=fitz.Rect(box)).strip();old=s['tekst'].strip();equal=n2(literal)==n2(old)
    # Drie oude bronvensters omvatten ook een expliciet rubriekprefix; niet afknippen uit bronwaarde.
    status='exacte karakterinhoud na witruimtevergelijking'if equal else'oud segment is letterlijk deel van bronvenster'if n2(old)in n2(literal)else'niet eenduidig bevestigd'
    segment_checks.append({'record_id':r['id'],'veld':field,'pdf_pagina':pg,'bbox':box,'bestaand_segment':old,'bronvenster_letterlijk':literal,'uitkomst':status})
    if status=='niet eenduidig bevestigd':reviews.append({'selectielijst':y,'record_id':r['id'],'officiele_code':r['code'],'veld':field,'huidige_waarde':old,'bronwaarde':literal,'bronlocatie':loc(y,pg,box),'bron_sha256':source[y]['sha256'],'type_afwijking':'niet eenduidig gekoppeld segment','technische_verwerking':'behouden','reden_geen_automatische_correctie':'Bronvenster bevat niet exact het geregistreerde segment.'})
    observed.append(old if status!='niet eenduidig bevestigd'else literal)
   value=r['officiele_omschrijving']if field=='beschrijving_segmenten'else r['bewaartermijn']['officiele_tekst'];kind=category(value,'\n'.join(observed))
   # Twee direct vastgestelde weglatingen, zonder wijziging van recordafbakening.
   direct=r['id'] in ['1996-2012:2.11::003','1996-2012:3.1.2::001'] and field=='beschrijving_segmenten'
   if direct:
    actual=n1('\n'.join(observed))
    if r['id']=='1996-2012:2.11::003':assert n1(value).replace('metadata)','(metadata)')==actual
    else:assert n1(value)+' (zie ook 2.10)'==actual
    for k in ['officiele_omschrijving','officiele_benaming']:
     patch(f'datasets/{y}/selectiegegevens.json',r,k,actual,r['id'],k,[loc(y,z['pagina'],z['bbox'])for z in segs],'Eenduidige ontbrekende broninterpunctie/verwijzing hersteld uit opnieuw gecontroleerde bronsegmenten; identiteit ongewijzigd.')
    kind='aantoonbare extractiefout; rechtstreeks gecorrigeerd'
   fieldcounts[kind]+=1
   inventory.append({'selectielijst':y,'inventaris_type':'bestaand_voorschrift_naast_onafhankelijke_pdfinventaris','bronrecord_id':r['id']+':'+field,'record_id':r['id'],'officiele_code':r['code'],'veld':'officiele_omschrijving'if field=='beschrijving_segmenten'else'bewaartermijn.officiele_tekst','bronwaarde':'\n'.join(observed),'ruwe_extractie_json':None,'bron_id':SOURCE_IDS[y],'bron_sha256':source[y]['sha256'],'pdf_pagina':segs[0]['pagina'],'gedrukt_paginanummer':printed(d[segs[0]['pagina']-1]),'bbox':[s['bbox']for s in segs],'verwerking':'bestaande recordidentiteit uitsluitend gecontroleerd aan geregistreerde geometrie; geen concordans als extractie-invoer'})
   if not kind.startswith('exact'):
    differences.append({'selectielijst':y,'record_id':r['id'],'officiele_code':r['code'],'veld':field,'huidige_waarde':value,'bronwaarde':'\n'.join(observed),'bronlocatie':[loc(y,s['pagina'],s['bbox'])for s in segs],'bron_sha256':source[y]['sha256'],'type_afwijking':kind,'technische_verwerking':'bestaande tekst behouden; bronvensters en volledige context beschikbaar','reden_geen_automatische_correctie':None})
    if kind not in ['alleen technisch presentatieverschil','aantoonbare extractiefout; rechtstreeks gecorrigeerd']:
     reviews.append({**differences[-1],'technische_verwerking':'bestaande waarde behouden; geen zelfstandige afbakening/interpunctie-interpretatie','reden_geen_automatische_correctie':'Bronsegment kan ook opsommingsmarkering of aanvullende recordcontext bevatten; geen onbewezen tekstcorrectie.'})
  # Nieuwe bronidentiteit, dezelfde opnieuw getoetste pagina-/segmentlocaties.
  patch(f'datasets/{y}/selectiegegevens.json',r['bron'],'bron_id',SOURCE_IDS[y],r['id'],'bron.bron_id',r['bron'],'De aangewezen 2012-PDF vervangt uitsluitend de primaire bronverwijzing na segmentcontrole.')
  for j,b in enumerate(r['aanvullende_bronnen']):
   if b['bron_id']=='1996-2012-officieel':patch(f'datasets/{y}/selectiegegevens.json',b,'bron_id',SOURCE_IDS[y],r['id'],f'aanvullende_bronnen.{j}.bron_id',b,'Termijnsegment rechtstreeks opnieuw in leidende PDF gecontroleerd.')
 for term in terms:
  pg=term['pdf_pagina'];box=term['bbox'];matches=sorted({r['id']for r in packs[y]['selectiegegevens']for s in r['officiele_bronrij']['termijn_segmenten']if s['pagina']==pg and abs(s['bbox'][1]-box[1])<1.5 and abs(s['bbox'][0]-box[0])<6})
  term['bestaande_record_ids_op_dezelfde_bronlocatie']=matches;identified.update(matches)
  if not matches:reviews.append({'selectielijst':y,'record_id':None,'officiele_code':None,'veld':'waarderingscel','huidige_waarde':None,'bronwaarde':term['letterlijke_aanvang_waarderingscel'],'bronlocatie':loc(y,pg,box),'bron_sha256':source[y]['sha256'],'type_afwijking':'onafhankelijk bronanker zonder bestaand record','technische_verwerking':'geen record geconstrueerd','reden_geen_automatische_correctie':'Identiteit/afbakening vereist beoordeling.'})
 assert identified=={r['id']for r in packs[y]['selectiegegevens']},'Niet alle 2012-records door onafhankelijke ankers verantwoord'
 emit(DOC+'onafhankelijke-waarderingsankers-1996-2012.json',terms);csvout(DOC+'bronsegmentcontrole-1996-2012.csv',segment_checks)
 # Structurele gegevens opnieuw tegen letterlijke bronlocatie; geen structuurherontwerp.
 structure_checks=[]
 print('Controleer structuur',flush=True)
 for y,pack in packs.items():
  for r in pack['structuur']:
   b=r['bron'];pg=b['pdf_pagina'];bbox=b.get('bbox');snippet=docs[y][pg-1].get_text(clip=fitz.Rect(bbox))if bbox else docs[y][pg-1].get_text()
   ok=n2(r['benaming'])in n2(snippet)or n3(r['benaming'])in n3(snippet)
   if not ok:
    full=PAGE_TEXT[y][pg-1]
    if n2(r['benaming'])in n2(full)or n3(r['benaming'])in n3(full):bbox=None;snippet=full;ok=True
   if not ok and y in independent:
    matching=[rr for rr in independent[y]if rr['code']==r['code']]
    if matching:
     rr=matching[0];name=rr['omschrijving']or rr['resultaat']
     if category(r['benaming'],name).startswith(('exact','alleen technisch')):pg=rr['pagina'];bbox=rr['bbox'];snippet=name;ok=True
   if not ok:
    literal_pages=[i+1 for i,text in enumerate(PAGE_N3[y])if n3(r['benaming'])in text]
    if len(literal_pages)==1:pg=literal_pages[0];bbox=None;snippet=PAGE_TEXT[y][pg-1];ok=True
   if ok:patch(f'datasets/{y}/structuur.json',r,'bron',loc(y,pg,bbox),r['id'],'bron',loc(y,pg,bbox),'Naam letterlijk bevestigd op bronpagina; een te klein oud venster wordt niet als volledig citaat gepresenteerd.')
   if y in independent:
    pc=r['code'];candidates=[rr for rr in independent[y]if rr['code']==pc]if r['type']!='procestype'else[rr for rr in independent[y]if rr['procestype']==pc]
    field='procestoelichting'if r['type']=='procestype'else'toelichting'
    if candidates:
     expected=candidates[0][field]or None;kind=category(r['toelichting'],expected);fieldcounts[kind]+=1
     if not kind.startswith('exact'):
      df={'selectielijst':y,'record_id':r['id'],'officiele_code':r['code'],'veld':'structuur.toelichting','huidige_waarde':r['toelichting'],'bronwaarde':expected,'bronlocatie':loc(y,candidates[0]['pagina'],candidates[0]['bbox']),'bron_sha256':source[y]['sha256'],'type_afwijking':kind,'technische_verwerking':'bestaande toelichting behouden','reden_geen_automatische_correctie':None if kind=='alleen technisch presentatieverschil'else'Geen inhoudelijke interpretatie of automatische alternatieve tekst gekozen.'}
      differences.append(df)
      if kind!='alleen technisch presentatieverschil':reviews.append(df)
   structure_checks.append({'selectielijst':y,'record_id':r['id'],'code':r['code'],'benaming':r['benaming'],'bronlocatie':loc(y,pg,bbox),'letterlijke_broncontext':snippet,'letterlijk_aangetroffen_na_technische_vergelijking':ok})
   if y=='1996-2012'and ok:patch(f'datasets/{y}/structuur.json',r['bron'],'bron_id',SOURCE_IDS[y],r['id'],'bron.bron_id',loc(y,pg,bbox),'Structuurnaam letterlijk in aangewezen bronvenster bevestigd; bronidentiteit bijgewerkt.')
   if not ok:
    reviews.append({'selectielijst':y,'record_id':r['id'],'officiele_code':r['code'],'veld':'structuur.benaming','huidige_waarde':r['benaming'],'bronwaarde':snippet,'bronlocatie':loc(y,pg,bbox),'bron_sha256':source[y]['sha256'],'type_afwijking':'structuurnaam niet als exacte tekst bevestigd in bestaand venster','technische_verwerking':'identiteit en naam behouden','reden_geen_automatische_correctie':'Geen semantische of fuzzy koppeling toegestaan.'})
 csvout(DOC+'structuurcontrole.csv',structure_checks)
 # Complete rubriccontext blijft per bronvenster beschikbaar, nu met leesbare brontekens.
 contexts=data('datasets/1996-2012/rubriekcontext.json')
 for c in contexts:
  for fragment in c['primaire_fragmenten']:
   b=fragment['bron'];pg=b['pdf_pagina'];box=b.get('bbox');fragment['tekst']=docs['1996-2012'][pg-1].get_text(clip=fitz.Rect(box),sort=True)if box else docs['1996-2012'][pg-1].get_text(sort=True);b['bron_id']=SOURCE_IDS['1996-2012']
  # Oude andere leesversie niet als normatieve fallback behouden.
  c['leesbare_paginakopie']=[{'bron':loc('1996-2012',p['bron']['pdf_pagina']),'tekst':docs['1996-2012'][p['bron']['pdf_pagina']-1].get_text(sort=True),'functie':'paginakopie uit dezelfde aangewezen leidende PDF'}for p in c['leesbare_paginakopie']]
  c['opmerking']='Uitsluitend aangewezen leidende PDF; Verdana-ToUnicode technisch en visueel gecontroleerd. Volledige context, geen algemene regels zelfstandig toegepast.'
 emit('datasets/1996-2012/rubriekcontext.json',contexts);change('datasets/1996-2012/rubriekcontext.json','Rubriekcontext uit dezelfde leidende bron; defecte glyphcodering hersteld, alternatieve PDF-fallback vervangen.')
 # Twee letterlijk uit officiële recordvelden afgeleide termen volgen de broncorrectie.
 # IDs, doelen, herkomsttype en alle niet-officiële zoekrelaties blijven behouden.
 corrected_terms=set()
 record_map={r['id']:r for r in packs['1996-2012']['selectiegegevens']}
 for term in packs['1996-2012']['zoeklexicon']:
  if term['herkomsttype']!='officieel' or term['onderdeel_id']not in ['1996-2012:2.11::003','1996-2012:3.1.2::001']:continue
  target=record_map[term['onderdeel_id']];before=next(r for r in data('datasets/1996-2012/selectiegegevens.json')if r['id']==target['id'])
  assert term['zoekterm']==before['officiele_benaming'],'Geen afgeleid of semantisch alternatief vervangen'
  f='datasets/1996-2012/zoeklexicon.json'
  for k,v in [('zoekterm',target['officiele_benaming']),('genormaliseerde_zoekterm',target['officiele_benaming'].casefold()),('bron',target['bron'])]:patch(f,term,k,v,term['id'],k,target['bron'],'Bestaande letterlijke officiële term volgt uitsluitend de expliciete broncorrectie; geen nieuwe zoekrelatie.')
  corrected_terms.add(term['id'])
 for edge in packs['1996-2012']['relaties']:
  if edge['van']in corrected_terms:patch('datasets/1996-2012/relaties.json',edge,'bron',record_map[edge['naar']]['bron'],edge['id'],'bron',record_map[edge['naar']]['bron'],'Bestaand relatie-ID en doel behouden; bronverwijzing volgt letterlijk gecorrigeerde officiële term.')
 # Zoekrelaties en oorspronkelijke concordans blijven qua identiteit behouden.

 lex_checks=[]
 for y,pack in packs.items():
  ids={r['id']for r in pack['structuur']}|{r['id']for r in pack['selectiegegevens']}
  for row in pack['zoeklexicon']:
   assert row['onderdeel_id']in ids
   lex_checks.append({'selectielijst':y,'zoekterm_id':row['id'],'onderdeel_id':row['onderdeel_id'],'zoekterm':row['zoekterm'],'herkomsttype':row['herkomsttype'],'doel_bestaat':True,'brononderbouwing_opnieuw_bevestigd':False if row['herkomsttype']!='officieel'else None,'status':'bestaande niet-officiële relatie behouden; geen nieuwe inhoudelijke acceptatie'if row['herkomsttype']!='officieel'else'letterlijke officiële term volgt expliciete broncorrectie; ID/doel behouden'if row['id']in corrected_terms else'officiële termrelatie ongewijzigd'})
 csvout(DOC+'zoekrelatiecontrole.csv',lex_checks)
 concordans=data('publicatie/concordans.json');assert len(concordans['rijen'])==716
 original_cells=copy.deepcopy([r['waarden']for r in concordans['rijen']]);original_links=[[{k:v for k,v in c.items()if k!='benaming'}for c in r['koppelingen']]for r in concordans['rijen']]
 labels={r['id']:r.get('officiele_benaming',r.get('benaming'))for pack in packs.values()for typ in ['structuur','selectiegegevens']for r in pack[typ]}
 for row in concordans['rijen']:
  for j,c in enumerate(row['koppelingen']):
   assert c['id']in labels
   patch('publicatie/concordans.json',c,'benaming',labels[c['id']],row['id'],f'koppelingen.{j}.benaming',c['id'],'Uitsluitend de gecorrigeerde officiële naam van hetzelfde record actualiseren; broncellen en relatie-identiteit ongewijzigd.')
 assert [r['waarden']for r in concordans['rijen']]==original_cells
 assert [[{k:v for k,v in c.items()if k!='benaming'}for c in r['koppelingen']]for r in concordans['rijen']]==original_links
 out['publicatie/concordans.json']=(json.dumps(concordans,ensure_ascii=False,separators=(',',':'))+'\n').encode()
 emit(DOC+'concordans-integriteit.json',{'rijen':716,'oorspronkelijke_cellen':7876,'sha256_bestand_voor':sha(original('publicatie/concordans.json')),'sha256_bestand_na':sha(out['publicatie/concordans.json']),'originele_cellen_sha256':sha(canon([r['waarden']for r in concordans['rijen']]).encode()),'geen_nieuwe_relaties':True,'517_kandidaten_niet_toegevoegd':True,'bestaande_record_ids_en_codes_ongewijzigd':True})
 # Leidende bronregistraties: oude bronbeschrijvingen blijven volledig behouden.
 for y,s in source.items():
  id=SOURCE_IDS[y];path=f'bronnen/{id}.bron.json';old=data(path)if path in tracked else{}
  descriptor={**old,'bron_id':id,'oorspronkelijke_bestandsnaam':old.get('oorspronkelijke_bestandsnaam',s['bestandsnaam']),'oorspronkelijke_sha256':s['sha256'],'bronstatus':'leidend_voor_herijking_opdracht_2026-11-25','inhoud_meegeleverd':False,'classificatie':'door_projecteigenaar_aangewezen_leidende_pdf','controle_datum':'2026-11-25'}
  if not old:descriptor.update(url=None,reden_niet_meegeleverd='Externe bron-PDF niet opgenomen; herijking reproduceerbaar met exact gehashte upload.',rechtenbeoordeling='Geen nieuwe rechtenbeoordeling; bestaande afbakening behouden.')
  emit(path,descriptor);change(path,'Leidende rol en exact gecontroleerde uploadidentiteit vastleggen; geen PDF-bytes gepubliceerd.')
 # Elk niet opnieuw letterlijk bevestigd selectieveld krijgt ook een expliciete technische bronstatus.
 # Bestaande normwaarden, annotaties en eerdere besluiten blijven onveranderd aanwezig.
 for y,pack in packs.items():
  for record in pack['selectiegegevens']:
   pending=[r for r in reviews if r['record_id']==record['id']]
   if not pending:continue
   patch(f'datasets/{y}/selectiegegevens.json',record['verificatie'],'status','bronherijking_niet_volledig_letterlijk_bevestigd',record['id'],'verificatie.status',record['bron'],'Actuele technische bronstatus begrenzen; eerdere bronstatus blijft in het wijzigingsregister bewaard.')
   note='Bronherijking 2026-11-25: niet opnieuw letterlijk bevestigd voor '+', '.join(sorted({r['veld']for r in pending}))+'. Bestaande waarden behouden; zie bronherijking-beoordeling.csv. Geen inhoudelijke gelijkwaardigheid of nieuwe termijnbeslissing vastgesteld.'
   patch(f'datasets/{y}/selectiegegevens.json',record['verificatie'],'bevindingen',record['verificatie']['bevindingen']+[note],record['id'],'verificatie.bevindingen',record['bron'],'Behouden bronverschillen ook op recordniveau zichtbaar in controlegegevens.')
  for node in pack['structuur']:
   if 'verificatie'in node and any(r['record_id']==node['id']and r['veld']=='structuur.benaming'for r in reviews):patch(f'datasets/{y}/structuur.json',node,'verificatie','bronherijking_naam_niet_opnieuw_letterlijk_bevestigd',node['id'],'verificatie',node['bron'],'Niet-eenduidig bevestigde naam expliciet markeren; geen naam/identiteit wijzigen.')
 # Datasetvelden, CSV en manifesten deterministisch bijwerken; overige selectiewaarden blijven gelijk.
 for y,pack in packs.items():
  for name in ['structuur','selectiegegevens','zoeklexicon','relaties']:
   path=f'datasets/{y}/{name}.json'
   emit(path,pack[name])
   f=io.StringIO(newline='');w=csv.DictWriter(f,fieldnames=sorted(set().union(*(r.keys()for r in pack[name]))));w.writeheader();w.writerows({k:json.dumps(v,ensure_ascii=False)if isinstance(v,(dict,list))else v for k,v in r.items()}for r in pack[name]);b=b'\xef\xbb\xbf'+f.getvalue().encode()
   out[f'datasets/{y}/{name}.csv']=b
  if pack['bronannotaties']!=data(f'datasets/{y}/bronannotaties.json'):emit(f'datasets/{y}/bronannotaties.json',pack['bronannotaties'])
  m=pack['manifest'];m['aantallen']['bronannotaties']=len(pack['bronannotaties']);m['aantallen']['records_met_open_bronvraag']=m['aantallen']['records_met_open_bronvraag']+len({r['record_id']for r in reviews if r['selectielijst']==y and r['record_id']in {record['id']for record in pack['selectiegegevens']}});m['datasetversie']='1.0.0-bronherijking-2026-11-25';m['generatiedatum']='2026-11-25'
  id=SOURCE_IDS[y];path=f'bronnen/{id}.bron.json';reg=next((r for r in m['bronnenregister']if r['id']==id),None)
  if reg is None:
   reg={'id':id,'bestand':'../../'+path,'sha256':sha(out[path]),'status':'leidend_voor_herijking_opdracht_2026-11-25','oorspronkelijk_bestand':'extern/'+source[y]['bestandsnaam'],'oorspronkelijke_sha256':source[y]['sha256'],'bestand_type':'bronbeschrijving_geen_brondocument','inhoud_extern':True};m['bronnenregister'].append(reg)
  else:reg.update(sha256=sha(out[path]),status='leidend_voor_herijking_opdracht_2026-11-25')
  m['beperkingen'].append('Bronherijking 2026-11-25: uitsluitend aangewezen PDF inhoudelijk leidend; eerdere bronvarianten/besluiten blijven historisch behouden. Zie documentatie/bronherijking/bronherijking-beoordeling.csv; geen juridische of archivistische acceptatie afgeleid.')
  if y=='2017':m['beperkingen'].append('Vier Nihil-waarden uit eerdere XLS-bronkeuze zijn niet opnieuw bevestigd in de lege leidende PDF-cellen; waarden en besluiten behouden voor menselijke beoordeling.')
  val=pack['validatie'];val['open_bronvragen']=val['open_bronvragen']+sum(r['selectielijst']==y for r in reviews);val['bronverificatie']='bronherijking_2026_11_25_volledige_pagina_en_tabelinventaris_met_open_beoordelingsregister';val['volledigheidscontrole']='onafhankelijke_waarderingsankers_en_bestaande_segmentlocaties'if y=='1996-2012'else'onafhankelijke_resultaatcode_en_proceskolominventaris';val['status']='technische_bronherijking_met_behouden_brononzekerheden';val['opleverstatus']='bronherijking_ter_beoordeling';m['opleverstatus']='bronherijking_ter_beoordeling';emit(f'datasets/{y}/validatie.json',val);m['validatiestatus']=val
  for name in list(m['sha256']):
   f=f'datasets/{y}/{name}';m['sha256'][name]=sha(out.get(f,original(f)))
  emit(f'datasets/{y}/manifest.json',m)
 # Historische integriteitsreferenties worden niet gewist; nieuwe bronversie krijgt controleerbare nieuwe fingerprints.
 integrity=data('documentatie/inhoudelijke-integriteit.json');emit(DOC+'integriteitsreferentie-voor.json',integrity)
 for y in KEYS:
  for name in integrity['inhoudelijke_hashes'][y]:
   f=f'datasets/{y}/{name}.json';obj=json.loads(out[f])if f in out else data(f)
   if name=='selectiegegevens':obj=[{k:v for k,v in r.items()if k!='verificatie'}for r in obj]
   integrity['inhoudelijke_hashes'][y][name]=sha(canon(obj).encode())
 emit('documentatie/inhoudelijke-integriteit.json',integrity)
 # Historische woordafbrekingstest kan bronmetadatawijzigingen exact terugdraaien, zonder oude bewijzen te herschrijven.
 emit(DOC+'veldmutaties.json',patches)
 wordlog=data('documentatie/woordafbrekingen-correcties.json');wordproof=[]
 for y,v in wordlog['lijsten'].items():
  for item in v['regels']:
   token=item['correct'];pat=re.compile(r'(?<!\w)'+re.escape(token)+r'(?!\w)',re.I)
   matches=[i+1 for i,text in enumerate(PAGE_TEXT[y])if pat.search(re.sub(r'-[ \t]*\n[ \t]*','-',text))];assert matches,(y,token,'Woordvorm niet bevestigd')
   wordproof.append({'selectielijst':y,'woordvorm':token,'bron_id':SOURCE_IDS[y],'bron_sha256':source[y]['sha256'],'pdf_paginas':matches,'vergelijkingsregel':'Woordgrenzen behouden; uitsluitend regeleinde na bestaand koppelteken negeren, koppelteken behouden.'})
 emit(DOC+'woordvormbewijs.json',wordproof)
 csvout(DOC+'bronherijking-inventarisatie.csv',inventory)
 dc=['selectielijst','record_id','officiele_code','veld','huidige_waarde','bronwaarde','bronlocatie','bron_sha256','type_afwijking','technische_verwerking','reden_geen_automatische_correctie']
 csvout(DOC+'bronherijking-afwijkingen.csv',differences,dc);csvout(DOC+'bronherijking-beoordeling.csv',reviews,dc)
 csvout(DOC+'bronherijking-correcties.csv',corrections,['bestand','selectielijst','record_id','veld','oude_waarde','nieuwe_waarde','bronverwijzing','reden'])
 new_annotations=data('documentatie/bronannotaties.json')+[r for pack in packs.values()for r in pack['bronannotaties']if ':bronherijking:'in r['id']]
 emit('documentatie/bronannotaties.json',new_annotations)
 # Geaggregeerd bronnenregister volgt de actuele datasetmanifesten.
 register=data('documentatie/bronnenregister.json');byid={r['id']:r for r in register}
 for pack in packs.values():
  for r in pack['manifest']['bronnenregister']:byid[r['id']]=r
 emit('documentatie/bronnenregister.json',list(byid.values()))
 for y,pack in packs.items():
  before=data(f'datasets/{y}/selectiegegevens.json');assert len(pack['selectiegegevens'])==len(before)
  for a0,b0 in zip(before,pack['selectiegegevens']):
   assert a0['id']==b0['id']and a0['code']==b0['code']
   # Geen normatieve tekst gewijzigd; alleen bronverwijzingen/controlemetadata.
   for k in a0:
    if k not in ['bron','aanvullende_bronnen','verificatie','aanvangsmoment','procestermijn']:
     if a0['id']in ['1996-2012:2.11::003','1996-2012:3.1.2::001']and k in ['officiele_benaming','officiele_omschrijving']:continue
     assert a0[k]==b0[k],(y,a0['id'],k)
   assert a0['aanvangsmoment']['officiele_tekst']==b0['aanvangsmoment']['officiele_tekst']
   assert a0['procestermijn']['officiele_tekst']==b0['procestermijn']['officiele_tekst']
  for name in ['zoeklexicon','relaties','testvragen']:
   f=f'datasets/{y}/{name}.json';restored=copy.deepcopy(pack[name])
   for op in reversed(patches.get(f,[])):
    row=next(r for r in restored if r['id']==op['record_id']);assert row[op['veld']]==op['na'];row[op['veld']]=op['voor']
   assert restored==data(f)
  old_annotations=data(f'datasets/{y}/bronannotaties.json');assert pack['bronannotaties'][:len(old_annotations)]==old_annotations
 report={'basiscommit':BASIS,'bronidentiteiten':verification,'volledige_pdf_paginas':sum(len(d)for d in docs.values()),'visueel_getranscribeerde_rasterfiguren':len(FIGURES),'resultaatcodes':{y:len(v['selectiegegevens'])for y,v in packs.items()},'onafhankelijke_resultaatcodes':{y:len(rs)for y,rs in independent.items()},'onafhankelijke_waarderingsankers_1996_2012':len(terms),'2012_bestaande_voorschriften_aan_ankers_verantwoord':len(identified),'onafhankelijke_tabelgroepen_1996_2012':len(groups),'gecontroleerde_selectieveldparen':sum(fieldcounts.values()),'vergelijkingscategorieen':dict(fieldcounts),'vastgelegde_afwijkingen':len(differences),'bron_en_metadatacorrecties':len(corrections),'gewijzigde_normatieve_selectieveldwaarden':sum(c['veld']in ['officiele_omschrijving','officiele_benaming']for c in corrections),'open_beoordelingsgevallen':len(reviews),'beoordeling_per_type':dict(collections.Counter(r['type_afwijking']for r in reviews)),'bestaande_bronannotaties_ongewijzigd':True,'bestaande_codes_en_ids_ongewijzigd':True,'concordans_716_rijen_7876_cellen_ongewijzigd':True,'zoekrelatie_identiteiten_en_niet_officiele_gegevens_ongewijzigd':True,'letterlijk_bijgewerkte_officiele_zoektermen':len(corrected_terms),'517_kandidaatrelaties_niet_toegevoegd':True,'inhoudelijke_of_juridische_besluiten_genomen':0,'integrale_menselijke_tweede_lezing':False,'beperkingen':['Geometrische en letterlijke inventarisatie; geen archivistische interpretatie.','Niet-exact bevestigde structuurnamen en vier eerdere XLS-bronkeuzes blijven ter beoordeling.','2012-voorschriftidentiteiten niet opnieuw afgebakend: 489 bronankers verantwoorden 494 bestaande technische regels, met gedeelde broncellen.','Bijlagen en voetnoten volledig als letterlijke pagina-/tekstlocaties behouden; toepasselijkheid niet op afzonderlijke resultaten geïnterpreteerd.','Praktijktoetsen en bronacceptatie niet uitgevoerd.']}
 emit(DOC+'bronherijking-tellingen.json',report)
 # Manifest guard: overige velden blijven via oorspronkelijke nulmeting te reconstrueren.
 metadata={}
 for y in KEYS:
  before=data(f'datasets/{y}/manifest.json');after=json.loads(out[f'datasets/{y}/manifest.json']);metadata[y]={'voor':{k:v for k,v in before.items()if k!='sha256'},'na':{k:v for k,v in after.items()if k!='sha256'}}
 emit(DOC+'manifestmetadata.json',metadata)
 guards={p:{'voor_sha256':sha(original(p)),'na_sha256':sha(b)}for p,b in out.items()if p in tracked and original(p)!=b}
 emit(DOC+'bestandsmutaties.json',guards)
 a.output.mkdir(parents=True,exist_ok=True)
 for path,b in out.items():
  f=a.output/path;f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(b)
 if a.apply:
  for path in out:
   f=R/path;f.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(a.output/path,f)
 print(json.dumps(report,ensure_ascii=False,indent=2))
if __name__=='__main__':main()
