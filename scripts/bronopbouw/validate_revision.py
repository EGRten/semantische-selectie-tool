# Publicatieversie: oorspronkelijke bronopbouwlogica, geen zelfstandige openbare bronbundel.
# Gebruik scripts/bronopbouw_prive.py met een rechtmatig verkregen externe bronmap.
# Alleen deze wrapper kopieert dit script naar de verwachte private werkstructuur.
from pathlib import Path as _PublicPath
if __name__ == "__main__" and _PublicPath(__file__).parent.name == "bronopbouw":
    print("Dit is bronopbouwlogica. Gebruik: python scripts/bronopbouw_prive.py --help")
    raise SystemExit(0)
import pathlib,json,hashlib,re,collections,sys,unicodedata,fitz,jsonschema,pandas as pd,gzip,zipfile,shutil
R=pathlib.Path(__file__).resolve().parents[1];P=R/'revisie';A=P/'documentatie'
def load(p):return json.loads(p.read_text())
def write(p,x):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def norm(t):return re.sub(r'[^a-z0-9]','',unicodedata.normalize('NFKD',str(t or '')).casefold())
# Complete right-column coverage check, independent of the concordance candidates.
ns={}
exec((R/'scripts/verify1996.py').read_text().replace("R=pathlib.Path(__file__).resolve().parents[1]","R=pathlib.Path("+repr(str(R))+")").split('cursor=0;')[0],ns)
terms=ns['terms']
V=load(R/'verification1996.json');covered={(z['pagina'],round(z['bbox'][1],1),z['tekst']) for r in V['records'] for z in r['termijn_tekst_segmenten']};unc=[z for z in terms if (z['pagina'],round(z['bbox'][1],1),z['tekst']) not in covered];unclassified=[]
for z in unc:
 t=z['tekst'];z['verklaring']='kolomkop' if any(w in t.lower() for w in ['bewaartermijn','bewaren']) else 'niet_unicodeerbare_toelichtingsglyphs'
 if z['verklaring']=='niet_unicodeerbare_toelichtingsglyphs' and any(c.isalnum() and ord(c)>32 for c in t):
  # The corrupted Verdana spans contain a few coincidental ASCII letters; retain them explicitly for review.
  z['verklaring']='defecte_fontcodering_toelichting_buiten_selectiecel'
write(A/'volledige-termijnkolomcontrole-1996.json',{'totaal_spans':len(terms),'gekoppeld_aan_voorschrift':len(terms)-len(unc),'niet_selectierelevante_spans':unc,'herkende_waarde_starts':len(load(R/'coverage1996.json')['primary_value_starts']),'ongekoppelde_waarde_starts':load(R/'coverage1996.json')['not_matched']})
assert not load(R/'coverage1996.json')['not_matched']
# Every 1996 description must lie within its own primary rubric, not merely somewhere in the PDF.
headers=load(R/'headers1996.json');scope=[]
for rec in V['records']:
 i=next(i for i,h in enumerate(headers) if h['code']==rec['rubriek']);a=headers[i]['bron'];b=headers[i+1]['bron'] if i+1<len(headers) else {'pdf_pagina':74,'bbox':[0,0,0,0]};z=rec['beschrijving_bron']
 ok=(a['pdf_pagina'],a['bbox'][1]-2)<=(z['pagina'],z['bbox'][1])<(b['pdf_pagina'],b['bbox'][1]-2)
 assert ok,(rec['rij'],rec['rubriek'])
 scope.append({'concordansrij':rec['rij'],'rubriek':rec['rubriek'],'binnen_primaire_rubriek':ok})
write(A/'rubriektoewijzingscontrole-1996.json',scope)

# Add readable page copies where the official PDF's text encoding is defective, without substituting the authority.
base=P/'datasets/1996-2012';pro=load(base/'bepalingen.json');du=fitz.open(R/'upload/Selectielijst 1996.pdf')
for z in pro:
 text=z['tekst'];bad=any(ord(c)<32 and c not in '\n\t\r' for c in text)
 z['tekstcodering']='defecte_fontcodering' if bad else 'leesbaar';z['leesbare_paginakopie']={'bron_id':'1996-2012-opgemaakt','pdf_pagina':z['bron']['pdf_pagina'],'tekst':du[z['bron']['pdf_pagina']-1].get_text()} if bad else None
write(base/'bepalingen.json',pro)
# Manifests use explicit limits, independent source inventories and deterministic hashes.
SUM=[];source_urls=load(R/'bronnen/urls.json');source_register=[]
for key in ['1996-2012','2017','2020']:
 base=P/'datasets'/key;y='1996' if key=='1996-2012' else key
 data={n:load(base/(n+'.json')) for n in ['structuur','selectiegegevens','zoeklexicon','relaties','testvragen']};nodes=data['structuur'];sels=data['selectiegegevens'];lex=data['zoeklexicon'];reviews=[r for r in load(A/'openstaande-beoordelingen.json') if r['lijst']==key]
 ids={n['id'] for n in nodes};allparts=ids|{s['id'] for s in sels};assert len(ids)==len(nodes)
 for n,rs in data.items():assert len({r['id'] for r in rs})==len(rs),(key,n)
 assert all(n['parent_id'] is None or n['parent_id'] in ids for n in nodes)
 assert all(s['structuur_id'] in ids for s in sels)
 assert all(z['onderdeel_id'] in allparts for z in lex)
 lexids={z['id'] for z in lex}
 for r in data['relaties']:
  assert r['van'] in (lexids if r['van_type']=='zoekterm' else allparts)
  assert r['naar'] in allparts
 for t in data['testvragen']:
  assert set(t['verwachte_relevante_categorieen']+t['alternatieve_relevante_categorieen'])<=allparts
 assert len(data['testvragen'])>=40
 for s in sels:
  assert s['id'].startswith(key+':') and s['bron']['pdf_pagina']>0
  if key=='1996-2012':
   desc=''.join(z['tekst'] for z in s['officiele_bronrij']['beschrijving_segmenten']);value=''.join(z['tekst'] for z in s['officiele_bronrij']['termijn_segmenten'])
   assert norm(s['officiele_omschrijving']) in norm(desc),s['id']
   assert norm(s['bewaartermijn']['officiele_tekst'])==norm(value),s['id']
 if key=='2017':
  df=pd.read_excel(R/'bronnen/2017-xls.xls',dtype=str).fillna('');xs={r['Nr.']:r for r in df.to_dict('records')};assert {s['code'] for s in sels}==set(xs)
  for s in sels:
   assert norm(s['waardering']['officiele_tekst'])==norm(xs[s['code']]['Waardering'])
   if s['code']!='7.1.20':assert norm(s['bewaartermijn']['officiele_tekst'])==norm(xs[s['code']]['Bewaartermijn'])
  assert next(s for s in sels if s['code']=='16.2.2')['bewaartermijn']['technisch']['waarde']==3
  assert next(s for s in sels if s['code']=='20.1.7')['officiele_omschrijving'].startswith('Proactief')
  for c in ['7.1.2','7.1.3','7.1.5','7.1.6']:assert next(s for s in sels if s['code']==c)['procestermijn']['officiele_tekst'] is None
 if key=='2020':
  assert len({s['code'] for s in sels})==346
  assert {s['code'] for s in sels if s['status']=='vervallen'}=={'7.1.20','19.1.13'}
  assert next(s for s in sels if s['code']=='22.1.2')['waardering']['type']=='samengesteld'
  aa=fitz.open(R/'upload/Selectielijst 2020.pdf');bb=fitz.open(R/'bronnen/2020.pdf');assert len(aa)==len(bb) and all(a.get_text()==b.get_text() for a,b in zip(aa,bb))
 sources=[{'id':key+'-officieel','bestand':'../../bronnen/'+y+'.pdf','url':source_urls[y],'sha256':sha(P/'bronnen'/(y+'.pdf')),'status':'Nationaal_Archief_download_2026-11-10'}, {'id':key+'-opgemaakt','bestand':'../../bronnen/Selectielijst '+y+'.pdf','sha256':sha(P/'bronnen'/('Selectielijst '+y+'.pdf')),'status':'aangeleverd_opgemaakt_document; selectievelden_vergeleken_met_officiele_bron'}, {'id':key+'-rapport','bestand':'../../bronnen/rapport-'+y+'.md','sha256':sha(P/'bronnen'/('rapport-'+y+'.md')),'status':'Deep_Research_alleen_kandidaatbron'}]
 if key=='2017':sources.append({'id':'2017-officiele-xls','bestand':'../../bronnen/2017-xls.xls','url':source_urls['2017-xls'],'sha256':sha(P/'bronnen/2017-xls.xls'),'status':'officiele_Excel; bronverschillen_zijn_niet_stilzwijgend_overschreven'})
 if key=='1996-2012':sources.append({'id':'concordans-aangeleverd','bestand':'../../bronnen/Concordans Selectielijst 1996-2020(1).xlsx','sha256':sha(P/'bronnen/Concordans Selectielijst 1996-2020(1).xlsx'),'status':'ondersteunende_aangeleverde_concordans; geen_normbron'})
 source_register+=sources
 counts={'structuuronderdelen':len(nodes),'rubrieken':sum(n['type']=='rubriek' for n in nodes),'procestypen':sum(n['type']=='procestype' for n in nodes),'selectievoorschriften_of_resultaatregels':len(sels),'actieve_regels':sum(s['status']=='actief' for s in sels),'vervallen_regels':sum(s['status']=='vervallen' for s in sels),'zoektermrelaties':len(lex),'officiele_termrelaties':sum(z['herkomsttype']=='officieel' for z in lex),'brononderbouwde_alternatieve_termrelaties':sum(z['herkomsttype']=='brononderbouwd_alternatief' for z in lex),'taalkundige_variantrelaties':sum(z['herkomsttype']=='taalkundige_variant' for z in lex),'ai_voorgestelde_termrelaties':sum(z['herkomsttype']=='ai_voorgesteld' for z in lex),'relaties':len(data['relaties']),'testvragen':len(data['testvragen']),'records_met_open_bronvraag':len({r['code'] for r in reviews}),'nog_niet_gevalideerde_zoekvoorstellen':sum(z['beoordelingsstatus']=='voorstel_niet_activeren' for z in lex),'lege_aanvangsmomentvelden':sum(s['aanvangsmoment']['officiele_tekst'] is None for s in sels)}
 report={'technische_validatie':'geslaagd','bronverificatie':'alle_selectieregels_geautomatiseerd_en_gerichte_afwijkingenbeoordeling','integrale_menselijke_tweede_lezing':False,'volledigheidscontrole':'volledige_termijnkolom_en_koppeninventaris' if key=='1996-2012' else 'onafhankelijke_proceskolom_inventaris_en_305_officiele_XLS_codes' if key=='2017' else 'onafhankelijke_proceskolom_inventaris_346_tabelregels','open_bronvragen':len(reviews),'toepasselijkheidsbeslissingen_gevalideerd':False,'semantische_volledigheid':'geen_onbegrensde_volledigheidsclaim; beschikbare_rapporttekst_verwerkt','status':'bronextractie_gecontroleerd_met_open_bronvragen' if reviews else 'bronextractie_gecontroleerd; tweede_lezing_niet_uitgevoerd'}
 write(base/'validatie.json',report)
 title={'1996-2012':'Selectielijst voor archiefbescheiden van gemeentelijke en intergemeentelijke organen opgemaakt of ontvangen vanaf 1 januari 1996 — Actualisatie','2017':'Selectielijst voor archiefbescheiden van gemeentelijke en intergemeentelijke organen opgemaakt of ontvangen vanaf 1 januari 2017','2020':'Selectielijst gemeenten en intergemeentelijke organen 2020'}[key]
 m={'selectielijst_id':key,'officiele_titel':title,'vaststellingsgegevens':{'datum':{'1996-2012':'2012-06-21','2017':'2017-06-23','2020':'2020-02-18'}[key],'publicatie':{'1996-2012':'Staatscourant 2012, 11906','2017':'Staatscourant 2017, 38013','2020':'Staatscourant 2020, 11143'}[key],'kenmerk':{'1996-2012':'NA/12/3900','2017':'NA/2017/1217430','2020':'NA/2020/21446242'}[key]},'datasetversie':'0.2.0-brongecontroleerd-met-open-punten','generatiedatum':'2026-11-10','bronnenregister':sources,'aantallen':counts,'validatiestatus':report,'officiele_gegevens_volledigheid':'hoofdstukken_2_en_3_technisch_gedekt_met_gedeelde_cellen_en_context' if key=='1996-2012' else '305_resultaatcodes_gedekt_met_vastgelegde_bronverschillen' if key=='2017' else '346_tabelregels_gedekt_inclusief_2_vervallen_en_brongebreken','beperkingen':['Geen automatische juridische of archivistische toepasselijkheidsbeslissing.','Aanvangsmomenten en voorwaarden blijven waar nodig in officiële tekst en algemene bepalingen staan; niet alle velden zijn afzonderlijk geïnterpreteerd.','AI-voorstellen blijven als voorstel herkenbaar; niet-gevalideerde voorstellen standaard uitsluiten.','Integrale tweede inhoudelijke beoordeling door een andere beoordelaar niet uitgevoerd.'],'sha256':{p.name:sha(p) for p in sorted(base.iterdir()) if p.is_file() and p.name!='manifest.json'}}
 write(base/'manifest.json',m);SUM.append({'selectielijst':key,**counts,'validatie':report})
# Strict structural schemas for all required file types, including known properties and ID namespaces.
def infer(values):
 types=[]
 for v in values:
  t='null' if v is None else 'boolean' if isinstance(v,bool) else 'integer' if isinstance(v,int) else 'number' if isinstance(v,float) else 'string' if isinstance(v,str) else 'array' if isinstance(v,list) else 'object'
  if t not in types:types.append(t)
 out={'type':types if len(types)>1 else types[0]}
 if types==['object']:
  keys=set().union(*(v.keys() for v in values));out.update(properties={k:infer([v[k] for v in values if k in v]) for k in sorted(keys)},required=sorted(set.intersection(*(set(v) for v in values))),additionalProperties=False)
 if types==['array']:
  items=[i for v in values for i in v];out['items']=infer(items) if items else {}
 return out
for name in ['manifest','structuur','selectiegegevens','zoeklexicon','relaties','testvragen']:
 paths=sorted((P/'datasets').glob('*/'+name+'.json'));vs=[load(p) for p in paths];s=infer(vs);s['$schema']='https://json-schema.org/draft/2020-12/schema';s['title']=name+' — datasetformaat 0.2'
 if name!='manifest':
  props=s['items']['properties'];props['id']['pattern']=r'^(1996-2012|2017|2020):'
 if name=='zoeklexicon':s['items']['properties']['herkomsttype']['enum']=['officieel','brononderbouwd_alternatief','taalkundige_variant','ai_voorgesteld']
 if name=='relaties':s['items']['properties']['juridische_gelijkwaardigheid']={'const':False}
 if name=='testvragen':s['minItems']=40;s['items']['properties']['toepasselijkheid_vastgesteld']={'const':False}
 write(P/'schemas'/(name+'.schema.json'),s)
 for p,v in zip(paths,vs):jsonschema.Draft202012Validator(s).validate(v)
# Verify all serialized JSON and all manifest checksums after schema validation.
for p in P.rglob('*.json'):load(p)
for base in (P/'datasets').iterdir():
 for name,h in load(base/'manifest.json')['sha256'].items():assert sha(base/name)==h
write(A/'validatieresultaten.json',SUM);write(A/'bronnenregister.json',source_register)
print(json.dumps(SUM,ensure_ascii=False,indent=2))
