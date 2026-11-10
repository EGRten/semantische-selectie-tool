# Publicatieversie: oorspronkelijke bronopbouwlogica, geen zelfstandige openbare bronbundel.
# Gebruik scripts/bronopbouw_prive.py met een rechtmatig verkregen externe bronmap.
# Alleen deze wrapper kopieert dit script naar de verwachte private werkstructuur.
from pathlib import Path as _PublicPath
if __name__ == "__main__" and _PublicPath(__file__).parent.name == "bronopbouw":
    print("Dit is bronopbouwlogica. Gebruik: python scripts/bronopbouw_prive.py --help")
    raise SystemExit(0)
import pathlib,json,fitz,re,hashlib,csv,shutil,collections,unicodedata,openpyxl,pandas as pd
from extract_tables import norm
R=pathlib.Path(__file__).resolve().parents[1];P=R/'revisie';P.mkdir(exist_ok=True);AUD=P/'documentatie';AUD.mkdir(exist_ok=True)
def write(p,x):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def read(p):return json.loads(pathlib.Path(p).read_text())
def sha(p):return hashlib.sha256(pathlib.Path(p).read_bytes()).hexdigest()
def clean(t):return re.sub(r'\s+',' ',str(t or '').replace('\xad','')).strip()
def normalized(t):return re.sub(r'\s+',' ',unicodedata.normalize('NFKC',t).casefold()).strip()
def loc(b,pg,box=None):return {'bron_id':b,'pdf_pagina':pg,'bbox':box}
B=P/'bronnen';B.mkdir(exist_ok=True)
for f in (R/'bronnen').iterdir():
 if f.suffix in ['.pdf','.xls','.md','.json']:shutil.copy2(f,B/f.name)
for f in (R/'upload').iterdir():
 if f.suffix in ['.pdf','.xlsx']:shutil.copy2(f,B/f.name)
X=pd.read_excel(R/'bronnen/2017-xls.xls',dtype=str).fillna('').to_dict('records');X={r['Nr.']:r for r in X}
TT={y:read(R/('table-'+y+'.json')) for y in ['2017-upload','2017-official','2020']};TO={r['code'].rstrip('.'):r for r in TT['2017-official']}
DIFF=[];REVIEW=[];PACKS={}
# Independently extracted 2017 table versus official XLS. Retain every discrepancy before resolving.
colmap={'procestype':'Procestypenummer','procesnaam':'Procestypenaam','procesomschrijving':'Procestypeomschrijving','procestoelichting':'Procestypetoelichting','procesobject':'procesobject','generiek_specifiek':'Generiek / specifiek','resultaat':'Resultaat','omschrijving':'Omschrijving','herkomst':'Herkomst','waardering':'Waardering','procestermijn':'Procestermijn','bewaartermijn':'Bewaartermijn','toelichting':'Toelichting'}
for r in TT['2017-upload']:
 for k,col in colmap.items():
  if norm(r[k])!=norm(X[r['code']][col]):DIFF.append({'code':r['code'],'veld':k,'pdf_opgemaakt':r[k],'officiele_xls':X[r['code']][col],'pdf_officieel':TO[r['code']].get(k),'pagina_opgemaakt':r['pagina'],'pagina_officieel':TO[r['code']]['pagina']})
# The annex is part of the official PDF; include all amendment pages as independent evidence.
AD=fitz.open(R/'bronnen/2017.pdf');AM=[]
for pg in range(139,155):
 t=AD[pg].get_text();AM.append({'id':'2017:wijziging-pagina:'+str(pg+1),'tekst':t,'bron':loc('2017-officieel',pg+1),'status':'officiele_wijzigingscontext'})
write(AUD/'wijzigingscontext-2017.json',AM)
for key,ver in [('2017','2017-upload'),('2020','2020')]:
 ns=[];ss=[];seen={};rows=TT[ver];rawdoc=fitz.open(R/('upload/Selectielijst 2017.pdf' if key=='2017' else 'bronnen/2020.pdf'))
 def addnode(code,name,typ,parent,source,explanation=None):
  id=key+':'+code
  if id not in seen:
   z={'id':id,'code':code,'benaming':name,'type':typ,'parent_id':parent,'volgorde':len(ns)+1,'toelichting':explanation,'bron':source};ns.append(z);seen[id]=z
  return id
 for row in rows:
  c=row['code'];pc=c.split('.')[0];r=dict(row);srcid=key+('-opgemaakt' if key=='2017' else '-officieel');source=loc(srcid,row['pagina'],row['bbox']);sources=[source]
  if key=='2017':
   sources.append(loc('2017-officieel',TO[c]['pagina'],TO[c]['bbox']))
   # Process names from official XLS avoid typesetting hyphenation; meaning is cross-checked with PDFs.
   r['procesnaam']=X[c]['Procestypenaam'];r['procesomschrijving']=X[c]['Procestypeomschrijving'];r['procesobject']=X[c]['procesobject']
  parent=addnode(pc,clean(r['procesnaam']),'procestype',None,source,r['procestoelichting'])
  if c.count('.')==2:parent=key+':'+c.rsplit('.',1)[0]
  status='actief';extra=[];statuscheck='brongetoetste_extractie';conflicts=[]
  if key=='2020' and c in ['7.1.20','19.1.13']:status='vervallen'
  if key=='2020' and c=='22.1.3':
   statuscheck='bronprobleem_open';extra.append('De toelichting eindigt in de officiële PDF midden in een opsomming bij "geldige of onbruikbaar". Niet aangevuld vanuit 2017.');REVIEW.append({'lijst':key,'code':c,'ernst':'blokkerend_voor_termijnadvies','bevinding':extra[-1],'bron':source})
  if key=='2020' and c.startswith('19.1.') and int(c.split('.')[-1])>=19:
   statuscheck='bronambiguiteit_open'
   extra.append('De officiële resultaatkolom luidt Archiefvernietiging, terwijl de omschrijving een ander onderwerp noemt. Letterlijk behouden, niet stilzwijgend vervangen door Verwerkt.');REVIEW.append({'lijst':key,'code':c,'ernst':'bronambiguiteit','bevinding':extra[-1],'bron':source})
  if key=='2017':
   if c in ['7.1.2','7.1.3','7.1.5','7.1.6']:
    conflicts.append('PDF-procestermijn is leeg; XLS vermeldt Nihil. Niet automatisch ingevuld.');statuscheck='bronverschil_open';REVIEW.append({'lijst':key,'code':c,'ernst':'bronverschil','bevinding':conflicts[-1],'bron':sources})
   if c=='16.2.2':sources.append(loc('2017-officieel',153));extra.append('Bijlage schrijft wijziging van 4 naar 3 jaar voor; 3 jaar is verwerkt in opgemaakte PDF en XLS.')
   if c=='20.1.7':sources.append(loc('2017-officieel',154));extra.append('Omschrijving en schrappen toelichting volgens wijzigingsbijlage; afwijkende XLS-tekst niet overgenomen.')
   if c=='19.1.18':sources.append(loc('2017-officieel',154));extra.append('Resultaat Archiefvernietiging en lege omschrijving overeenkomstig wijzigingsinstructie; XLS bevat Verwerkt en omschrijving Archiefvernietiging.')
   if c=='4.1.6':sources.append(loc('2017-officieel',150));extra.append('Voluit geschreven Risico-inventarisatie & -evaluatie (RI&E) volgens wijzigingsinstructie.')
   if c=='7.1.20':sources.append(loc('2017-officieel',151));extra.append('Niet-numerieke vernietigingsvoorwaarde letterlijk behouden; geen jaartal geconstrueerd.')
  rid=addnode(c,clean(r['omschrijving'] or r['resultaat']),'specifiek_resultaat' if r['generiek_specifiek']=='Specifiek' else 'generiek_resultaat',parent,source,r['toelichting'] or None)
  d=clean(r['bewaartermijn']);mat=re.fullmatch(r'(\d+(?:[,.]\d+)?)\s+(jaar|jaren|maand|maanden|dag|dagen)',d,re.I);technical={'waarde':float(mat[1].replace(',','.')),'eenheid':mat[2],'type':'enkelvoudige_termijn'} if mat else None
  val=clean(r['waardering']) or None
  ss.append({'id':rid,'code':c,'structuur_id':rid,'officiele_benaming':clean(r['omschrijving'] or r['resultaat']),'officiele_omschrijving':r['omschrijving'] or None,'resultaattype':clean(r['resultaat']),'generiek_specifiek':r['generiek_specifiek'],'procesomschrijving':r['procesomschrijving'],'procesobject':r['procesobject'],'waardering':{'officiele_tekst':val,'type':'vervallen' if status=='vervallen' else 'samengesteld' if val and val not in ['Bewaren','Vernietigen'] else val.casefold() if val else 'niet_ingevuld_in_bron'},'bewaartermijn':{'officiele_tekst':r['bewaartermijn'] or None,'technisch':technical,'status':'niet_van_toepassing_vervallen' if status=='vervallen' else 'letterlijk_overgenomen' if d else 'niet_ingevuld_in_bron'},'procestermijn':{'officiele_tekst':r['procestermijn'] or None,'status':'bronverschil' if conflicts else 'letterlijk_overgenomen' if r['procestermijn'] else 'niet_ingevuld_in_bron'},'aanvangsmoment':{'officiele_tekst':None,'status':'raadpleeg_procestermijn_toelichting_en_algemene_bepalingen'},'toepassingsvoorwaarden':{'bronvelden':['officiele_omschrijving','procesomschrijving','toelichting','algemene_bepalingen'],'status':'officiele_tekst_behouden_geen_juridische_interpretatie'},'uitzonderingen_en_verwijzingen':{'officiele_tekst':r['toelichting'] or None,'algemene_bepalingen':['bepalingen.json'],'status':'tekstueel_behouden'},'toelichting':r['toelichting'] or None,'herkomst_waardering':r['herkomst'] or None,'taakvelden_brontekst':r['taakvelden'],'status':status,'bron':source,'aanvullende_bronnen':sources[1:],'officiele_bronrij':{k:v for k,v in r.items() if k not in ['pagina','bbox']},'verificatie':{'status':statuscheck,'methode':'karakterpositie_extractie_en_bronvergelijking' if key=='2017' else 'karakterpositie_extractie_en_controle_vervallen_en_samengestelde_regels','bevindingen':extra+conflicts},'algemene_bepalingen':'bepalingen.json'})
 # Independent code inventory based on the process-number column (not the result-code regex).
 inventory=[]
 for pi,p in enumerate(rawdoc):
  if p.rect.width<1000:continue
  for w in p.get_text('words'):
   if 29<=w[0]<32 and re.fullmatch(r'(?:[1-9]|[12]\d)',w[4]) and 55<w[1]<805:inventory.append({'pagina':pi+1,'procescode':w[4],'y':w[1]})
 assert len(inventory)==len(rows),(key,len(inventory),len(rows))
 PACKS[key]={'structuur':ns,'selectiegegevens':ss,'codeinventaris':inventory}
# 1996/2012: concordance supplies candidates; each description and value is located separately in the official PDF.
A=read(R/'verification1996.json');H=read(R/'headers1996.json');ns=[];ss=[];counts=collections.Counter();D=fitz.open(R/'bronnen/1996.pdf');DU=fitz.open(R/'upload/Selectielijst 1996.pdf')
for code,name,pg in [('2','Archiefbescheiden die op grond van alle taken gevormd kunnen worden',18),('3','Archiefbescheiden die op grond van één taak gevormd kunnen worden',29)]:ns.append({'id':'1996-2012:'+code,'code':code,'benaming':name,'type':'hoofdstuk','parent_id':None,'volgorde':len(ns)+1,'toelichting':None,'bron':loc('1996-2012-officieel',pg)})
for h in H:
 code=h['code'];parent='3' if code.count('.')==1 and code.startswith('3.') else code.rsplit('.',1)[0]
 ns.append({'id':'1996-2012:'+code,'code':code,'benaming':h['name'],'type':'taakveld' if parent=='3' else 'rubriek','parent_id':'1996-2012:'+parent,'volgorde':len(ns)+1,'toelichting':None,'bron':h['bron'],'codeopbouw':'officiele_hoofdstuk_en_rubrieknummering','verificatie':'kop_in_officiele_pdf_gelokaliseerd'})
for r in A['records']:
 assert r['primaire_match']=='exact_genormaliseerd',(r['rij'],r['primaire_match'])
 counts[r['rubriek']]+=1;rid='1996-2012:'+r['rubriek']+'::'+str(counts[r['rubriek']]).zfill(3);desc=r['omschrijving_brongecorrigeerd'];dt=r['termijn_concordans'];tb=r['termijn_bron'];db=r['beschrijving_bron'];source=loc('1996-2012-officieel',db['pagina'],db['bbox']);source['eindpagina']=db['eindpagina'];source['eindbbox']=db['eindbbox'];term_source=loc('1996-2012-officieel',tb['pagina'],tb['bbox']);term_source['eindpagina']=tb['eindpagina'];term_source['eindbbox']=tb['eindbbox']
 notes=[]
 if r['rij'] in [42,80,82]:notes.append('Gedeelde waarderingscel: toewijzing gecontroleerd aan bovenliggende opsomming in PDF; bronpositie wijkt af van beschrijvingspositie.')
 if r['rij'] in [150,400]:notes.append('Waarderingscel niet op eerste beschrijvingsregel; paginaopmaak gericht gecontroleerd.')
 if r['rij'] in [50,380,469]:notes.append('Concordanstekst gecorrigeerd naar primaire bron; zie afwijkingenregister.')
 term=clean(dt);val='Bewaren' if term=='B' else 'Vernietigen';mat=re.fullmatch(r'(\d+(?:[,.]\d+)?)\s+(jaar|maanden|maand|dagen|dag)',term);technical={'waarde':float(mat[1].replace(',','.')),'eenheid':mat[2],'type':'enkelvoudige_termijn'} if mat else None
 ss.append({'id':rid,'code':r['rubriek'],'structuur_id':'1996-2012:'+r['rubriek'],'officiele_benaming':clean(desc),'officiele_omschrijving':desc,'resultaattype':None,'generiek_specifiek':None,'procesomschrijving':None,'procesobject':None,'waardering':{'officiele_tekst':'B' if val=='Bewaren' else None,'type':val.casefold(),'afleiding':'B betekent bewaren; overige cellen bevatten de vernietigingstermijn volgens tabellegenda'},'bewaartermijn':{'officiele_tekst':dt,'technisch':technical,'status':'letterlijk_overgenomen'},'procestermijn':{'officiele_tekst':None,'status':'geen_afzonderlijke_kolom_in_bron'},'aanvangsmoment':{'officiele_tekst':dt if not mat and val!='Bewaren' else None,'status':'in_termijntekst_behouden' if not mat and val!='Bewaren' else 'raadpleeg_algemene_bepalingen'},'toepassingsvoorwaarden':{'bronvelden':['officiele_omschrijving','broncontext','algemene_bepalingen'],'status':'volledige_rubriekcontext_behouden'},'uitzonderingen_en_verwijzingen':{'officiele_tekst':None,'algemene_bepalingen':['bepalingen.json'],'status':'raadpleeg_broncontext'},'toelichting':None,'herkomst_waardering':None,'taakvelden_brontekst':None,'status':'actief','bron':source,'aanvullende_bronnen':[term_source,{'bron_id':'concordans-aangeleverd','werkblad':'Blad1','rij':r['rij'],'kolommen':['A','B','C','D'],'functie':'kandidaat_en_vergelijking_geen_normbron'}],'officiele_bronrij':{'beschrijving_segmenten':r['primaire_tekst_segmenten'],'termijn_segmenten':r['termijn_tekst_segmenten']},'verificatie':{'status':'beschrijving_en_termijn_brongetoetst','methode':'gescheiden_literale_genormaliseerde_matches_in_officiele_pdf_plus_gerichte_layoutcontrole','bevindingen':notes},'algemene_bepalingen':'bepalingen.json','broncontext':'rubriekcontext.json#'+r['rubriek']})
PACKS['1996-2012']={'structuur':ns,'selectiegegevens':ss,'codeinventaris':read(R/'coverage1996.json')}
# Preserve full rubric context, including conditions and explanations. This is deliberately not reduced to inferred rules.
contexts=[]
for i,h in enumerate(H):
 if h['code'].count('.')==1 and h['code'].startswith('3.'):continue
 start=h['bron'];nex=H[i+1]['bron'] if i+1<len(H) else {'pdf_pagina':74,'bbox':[0,0,0,0]};parts=[];readable=[]
 for pg in range(start['pdf_pagina'],min(nex['pdf_pagina'],73)+1):
  y0=start['bbox'][1]-.5 if pg==start['pdf_pagina'] else 0;y1=nex['bbox'][1]-.5 if pg==nex['pdf_pagina'] else 745
  if y1>y0:parts.append({'bron':loc('1996-2012-officieel',pg,[90,y0,560,y1]),'tekst':D[pg-1].get_text(clip=fitz.Rect(90,y0,560,y1),sort=True)})
  readable.append({'bron':loc('1996-2012-opgemaakt',pg),'tekst':DU[pg-1].get_text(sort=True),'functie':'leesbare_paginakopie; omvat mogelijk andere_rubrieken'})
 contexts.append({'code':h['code'],'primaire_fragmenten':parts,'leesbare_paginakopie':readable,'opmerking':'De officiële PDF heeft voor sommige Verdana-teksten een defecte tekstcodering; raadpleeg de PDF-weergave of de leesbare aangeleverde paginakopie.'})
write(P/'datasets/1996-2012/rubriekcontext.json',contexts)
# Machine-readable general and supplementary provisions: full pages, not paraphrases.
for key,pk in PACKS.items():
 y='1996' if key=='1996-2012' else key;path=R/'bronnen'/(y+'.pdf');d=fitz.open(path);provisions=[]
 tablepages={r['bron']['pdf_pagina'] for r in pk['selectiegegevens']}
 # PDF versions have different pagination in 2017. Include the complete official document as page records.
 for pi,p in enumerate(d):
  provisions.append({'id':key+':bronpagina:'+str(pi+1),'type':'algemene_toelichting_of_bijlage' if (pi<17 if key=='1996-2012' else pi<26 if key=='2017' else pi<25) else 'bronpagina','tekst':p.get_text(),'bron':loc(key+'-officieel',pi+1),'interpretatie':False})
 write(P/'datasets'/key/'bepalingen.json',provisions)
 # Retain annex modification snippets for 2020 too. They are not imported into another list.
 if key=='2017':write(P/'datasets'/key/'wijzigingen.json',AM)
 if key=='2020':write(P/'datasets'/key/'wijzigingen.json',[z for z in provisions if z['bron']['pdf_pagina']>=88])
# Literal legend definitions make start-moment information available without calculating dates.
legend=[('A','Nihil','A Nihil = Er is geen aparte procestermijn, de bewaartermijn start direct.'),('B','De bestaans- of geldigheidsduur van het procesobject','Nadat het procesobject haar geldigheid heeft verloren of niet meer bestaat, gaat de bewaartermijn lopen.'),('C','De ingeschatte maximale bestaans- of geldigheidsduur van het procesobject','Dit kan bijvoorbeeld al vastgelegd worden in het zaaktype, zodat proces- en bewaartermijn samen een bewaartermijn vormen die gaat lopen vanaf het moment van afsluiten van de zaak.'),('D','De tijdens het proces vast te leggen datum waarop de geldigheid van het procesobject komt te vervallen','Tijdens de procesuitvoering wordt de datum bepaald wanneer het procesobject haar geldigheid zal verliezen. Tot dat moment loopt de procestermijn.'),('E','Procestermijn samengevoegd met bewaartermijn','De datum waarop deze termijn moet gaan lopen is benoemd in de toelichting bij de categorie en kan in het verleden liggen.')]
for ky in ['2017','2020']:
 for rec in PACKS[ky]['selectiegegevens']:
  if rec['status']=='vervallen':continue
  pt=rec['procestermijn']['officiele_tekst']
  for code,title,definition in legend:
   if pt and norm(pt)==norm(title):
    rec['procestermijn']['legendacategorie']=code
    rec['aanvangsmoment']={'officiele_tekst':definition,'status':'letterlijke_legenda_bij_procestermijn_geen_datumberekening','bron':loc(ky+'-officieel',25 if ky=='2020' or code in ['A','B','C'] else 26)}
    break

# Source data for concordance kept outside each independent dataset.
wb=openpyxl.load_workbook(R/'upload/Concordans Selectielijst 1996-2020(1).xlsx',data_only=True);sheet=wb.active;expanded={(c.row,c.column):c.value for row in sheet for c in row}
for rg in sheet.merged_cells.ranges:
 for rr in range(rg.min_row,rg.max_row+1):
  for cc in range(rg.min_col,rg.max_col+1):expanded[rr,cc]=sheet.cell(rg.min_row,rg.min_col).value
codes2020={r['code'] for r in PACKS['2020']['selectiegegevens']};cr=[];bad=[]
for rr in range(3,sheet.max_row+1):
 raw=[sheet.cell(rr,cc).value for cc in range(1,12)];vals=[expanded[rr,cc] for cc in range(1,12)]
 if not any(v is not None for v in raw):continue
 rawcode=str(vals[5] or '');targets=re.findall(r'\b\d+\.\d+(?:\.\d+)?\b',rawcode);unknown=[c for c in targets if c not in codes2020]
 if unknown:bad.append({'rij':rr,'bronwaarde':rawcode,'ongeldige_codes':unknown,'voorstel':'19.2.1' if rawcode=='19.21.1' else None,'voorstel_status':'inhoudelijk_brongetoetst_op_omschrijving_Scans_kentekens' if rawcode=='19.21.1' else None})
 cr.append({'id':'concordans:rij:'+str(rr),'bron':{'bron_id':'concordans-aangeleverd','werkblad':'Blad1','rij':rr},'originele_cellen':raw,'samengevoegde_cellen_uitgevouwen':vals,'expliciete_2020_codes':[c for c in targets if c in codes2020],'ongeldige_codes':unknown,'juridische_gelijkwaardigheid':False,'2017_codes_afgeleid':False})
write(P/'concordans/concordans.json',cr);write(AUD/'concordans-afwijkingen.json',bad)
# Search lexicon: primary terms, mechanical variants, and explicitly held-back report proposals.
REJECT=[('omgevingsvergunning','bouwvergunning','Geen exacte equivalentie; omgevingsvergunning kan verschillende activiteiten omvatten.'),('WOZ','WOZ-bezwaar','WOZ is geen afkorting van WOZ-bezwaar.'),('metadata','Gegevens over gegevens','Zoekrelatie kan nuttig zijn; historische_benaming is zonder betekenisgeschiedenis geen bewezen relatietype.'),('vergunning verleend','11.1.1','Onderzoeksvoorbeeld veralgemeniseert een specifiek resultaat; geen koppeling op basis van dit voorbeeld.')]
for key,pk in PACKS.items():
 lx=[];rels=[];dedup=set();allids={n['id'] for n in pk['structuur']}|{s['id'] for s in pk['selectiegegevens']};official_candidates=[]
 def lex(term,target,kind,relation,source,evidence,status='brongetoetst',risk='contextafhankelijk'):
  term=clean(term)
  if not term:return
  k=(term,target,kind,relation)
  if k in dedup:return
  dedup.add(k);id=key+':term:'+str(len(lx)+1).zfill(5)
  z={'id':id,'zoekterm':term,'genormaliseerde_zoekterm':normalized(term),'onderdeel_id':target,'relatietype':relation,'herkomsttype':kind,'onderbouwing':evidence,'betrouwbaarheid':'hoog_voor_tekstvoorkomen' if kind=='officieel' else 'mechanisch' if kind=='taalkundige_variant' else 'laag','beoordelingsstatus':status,'risico_op_verwarring':risk,'bron':source,'juridische_gelijkwaardigheid':False};lx.append(z)
  rels.append({'id':key+':rel:'+str(len(rels)+1).zfill(5),'van':id,'van_type':'zoekterm','naar':target,'naar_type':'onderdeel','type':relation,'richting':'zoekterm_naar_onderdeel','herkomsttype':kind,'onderbouwing':evidence,'status':status,'bron':source,'juridische_gelijkwaardigheid':False})
 for node in pk['structuur']:
  lex(node['benaming'],node['id'],'officieel','officiele_benaming',node['bron'],'Officiële benaming uit de lijst; bij 1996/2012 via koppositie gecontroleerd.')
  if node['parent_id']:rels.append({'id':key+':rel:'+str(len(rels)+1).zfill(5),'van':node['id'],'van_type':'onderdeel','naar':node['parent_id'],'naar_type':'onderdeel','type':'onderdeel_van','richting':'kind_naar_ouder','herkomsttype':'officieel','onderbouwing':'Officiële nummering en tabelstructuur.','status':'brongetoetst','bron':node['bron'],'juridische_gelijkwaardigheid':False})
 for s in pk['selectiegegevens']:
  for field in ['officiele_benaming','officiele_omschrijving','resultaattype','procesobject']:
   term=s.get(field)
   if term:lex(term,s['id'],'officieel','letterlijk_fragment',s['bron'],'Letterlijk tekstfragment uit '+field+'; geen bewijs van unieke toepasselijkheid.')
  context=' '.join(str(s.get(f) or '') for f in ['officiele_omschrijving','toelichting','procesomschrijving','procesobject'])
  for a in sorted(set(re.findall(r'\b[A-Z][A-Z0-9&]{1,7}\b',context))):
   if a not in ['PDF','NB']:lex(a,s['id'],'officieel','letterlijk_fragment',s['bron'],'Afkorting of hoofdletterreeks komt letterlijk in broncontext voor; betekenis niet automatisch uitgebreid.',risk='kan_meerdere_betekenissen_hebben')
 # Separate mechanically derived punctuation variants without inventing conceptual equivalence.
 for z in list(lx):
  if z['herkomsttype']=='officieel' and any(c in z['zoekterm'] for c in ['-','/','&']):
   t=re.sub(r'[-/]', ' ',z['zoekterm']).replace('&','en');t=clean(t)
   if t!=z['zoekterm']:lex(t,z['onderdeel_id'],'taalkundige_variant','spellingvariant',z['bron'],'Mechanische schrijfvariant van officiële ingang: '+z['zoekterm'],status='mechanisch_gecontroleerd',risk='onderscheid_samenstellingen_en_opsommingen_raadplegen')
 # Collect every explicitly quoted candidate in reports. Unknown mappings remain visible in a separate queue.
 y='1996' if key=='1996-2012' else key;report=(R/'bronnen'/('rapport-'+y+'.md')).read_text();candidates=[];queue=[]
 for pat in [r'[“«]([^”»\n]{2,110})[”»]',r'\*([^*\n]{2,90})\*']:
  for m in re.finditer(pat,report):
   term=m[1].strip();
   if term.startswith('#') or 'http' in term:continue
   candidates.append((m.start(),term))
 for pos,term in sorted(set(candidates)):
  # Exact primary text occurrence is a safe finding relation, never a synonym inference.
  hit=[]
  if len(norm(term))>=4:
   for s in pk['selectiegegevens']:
    t=' '.join(str(s.get(f) or '') for f in ['officiele_benaming','officiele_omschrijving','toelichting'])
    if norm(term) in norm(t):hit.append(s)
  source={'bron_id':key+'-rapport','tekenpositie':pos,'fragment':term}
  rejected=any(norm(term)==norm(a) or norm(term)==norm(b) for a,b,_ in REJECT if b in ['bouwvergunning','WOZ-bezwaar'])
  if hit and not rejected:
   for h in hit:lex(term,h['id'],'ai_voorgesteld','verwant_begrip_voorstel',source,'Kandidaat uit onderzoeksrapport met tekstvoorkomen in primaire context. Alleen voorstel; geen synoniemverklaring.',status='voorstel_niet_activeren',risk='betekenisrelatie_niet_gevalideerd')
  else:queue.append({'zoekterm':term,'bron':source,'status':'niet_gekopppeld_of_afgewezen','reden':'Geen eenduidige controleerbare koppeling; geen code verzonnen.' if not rejected else 'Risico op onjuiste equivalentie; zie afwijkingenregister.'})
 pk['zoeklexicon']=lx;pk['relaties']=rels;write(P/'datasets'/key/'kandidaten-ongekoppeld.json',queue)
# Explicit, reviewed finding scenarios for the 29 processes. They ask about finding, not legal selection outcomes.
questions={1:'De gemeente stelt een nieuw organisatieonderdeel in. Waar zoek ik?',2:'Waar vind ik het opstellen van een gemeentelijke verordening?',3:'Waar valt het opstellen van een beleidsplan onder?',4:'Waar zoek ik een evaluatie van uitgevoerd gemeentelijk beleid?',5:'De gemeente levert een product aan een inwoner. Welk procestype past als zoekrichting?',6:'Een inwoner vraagt de gemeente iets te doen of te laten. Waar zoek ik?',7:'Een inwoner doet een wettelijk verplichte aangifte bij de gemeente. Waar zoek ik?',8:'Waar vind ik het verstrekken van een financiële voorziening?',9:'Waar zoek ik het toekennen van een juridische status?',10:'Waar vind ik het opleggen van een gemeentelijke heffing?',11:'Een inwoner vraagt toestemming voor een activiteit. Waar zoek ik?',12:'De gemeente controleert of voorschriften worden nageleefd. Waar zoek ik?',13:'Waar zoek ik het behandelen van een geschil met een inwoner?',14:'Waar vind ik het inrichten van de openbare ruimte?',15:'Waar zoek ik het onderhouden of repareren van een gemeentelijk object?',16:'Waar vind ik het aangaan van een overeenkomst door de gemeente?',17:'Waar zoek ik het aanstellen van een medewerker?',18:'Waar vind ik het betalen van een factuur of innen van een vordering?',19:'Waar zoek ik het administratief verwerken van gegevens zonder inhoudelijke toets?',20:'De gemeente verstrekt informatie. Welk procestype is een zoekrichting?',21:'Waar zoek ik een door de gemeente uitgebracht advies?',22:'De gemeente organiseert een gebeurtenis. Waar zoek ik?',23:'De gemeente vraagt zelf een voorziening aan. Waar zoek ik?',24:'De gemeente vraagt zelf toestemming aan een andere instantie. Waar zoek ik?',25:'Een toezichthouder controleert de gemeente. Waar zoek ik?',26:'De gemeente betwist een besluit van een ander bestuursorgaan. Waar zoek ik?',27:'De gemeente vraagt zelf een status aan. Waar zoek ik?',28:'De gemeente vraagt zelf een product of dienst aan. Waar zoek ik?',29:'De gemeente doet zelf aangifte. Waar zoek ik?'}
scenario_terms=[('subsidie','Waar vind ik stukken over het verstrekken van een subsidie?','gewone_taal'),('jeugdhulp','Waar zoek ik een dossier over jeugdhulp?','domeinterm'),('BRP','Waar zoek ik stukken met de afkorting BRP?','afkorting'),('geboorte','Waar zoek ik documenten over een geboorteaangifte?','gewone_taal'),('overlijden','Waar zoek ik het verwerken van overlijdensgegevens?','gewone_taal'),('verkiezing','Waar vind ik stukken over een verkiezing?','samengestelde_waardering'),('referendum','Waar zoek ik stukken over een referendum?','brononzekerheid'),('bestemmingsplan','Waar vind ik stukken over een bestemmingsplan?','historische_terminologie'),('bodemonderzoek','Waar zoek ik een bodemonderzoek?','documentsoort'),('sanering tanks','Waar zoek ik toestemming voor sanering van tanks?','specifiek_resultaat'),('archiefvernietiging','Waar vind ik de verantwoording van archiefvernietiging?','specifiek_resultaat'),('sollicit','Waar zoek ik stukken van een sollicitatieprocedure?','gewone_taal'),('personeel','Waar zoek ik stukken over personeel?','brede_zoekvraag'),('leerplicht','Waar vind ik stukken over leerplicht?','domeinterm'),('incasso','Waar vind ik een automatische incasso?','specifiek_resultaat'),('reisdocument','Waar zoek ik gegevens over een reisdocument?','meerduidige_zoekvraag'),('Wmo','Waar zoek ik stukken waarin Wmo staat?','afkorting'),('monument','Waar vind ik stukken over een monument?','meerduidige_zoekvraag'),('riolering','Waar zoek ik een rioleringsplan?','documentsoort'),('belasting','Waar vind ik stukken over gemeentelijke belastingen?','domeinterm'),('bezwaar','Waar zoek ik een bezwaarschrift?','documentsoort'),('overeenkomst','Waar zoek ik een contract of overeenkomst?','praktijkformulering'),('register','Waar vind ik stukken over een register?','meerduidige_zoekvraag'),('gegevens','Waar zoek ik stukken over gegevensverwerking?','brede_zoekvraag'),('woning','Waar vind ik stukken over woningen?','brede_zoekvraag'),('vergunning','Waar zoek ik stukken over een vergunning?','meerduidige_zoekvraag')]
for key,pk in PACKS.items():
 tests=[];node_by={n['id']:n for n in pk['structuur']}
 def test(q,intent,expected,alts,source,typ,quote=None,uncertainty=None):
  tests.append({'id':key+':test:'+str(len(tests)+1).zfill(3),'zoekvraag':q,'zoekintentie':intent,'verwachte_relevante_categorieen':expected,'alternatieve_relevante_categorieen':alts,'onzekerheden':uncertainty or ['Procescontext en resultaat moeten afzonderlijk worden vastgesteld; deze verwachting bewijst geen toepasselijkheid.'],'bron':source,'type_zoekvraag':typ,'controleerbaar_bronfragment':quote,'toepasselijkheid_vastgesteld':False,'alternatieven_uitputtend':False,'beoordelingsstatus':'brongetoetste_vindbaarheidsverwachting'})
 if key!='1996-2012':
  for i,q in questions.items():
   n=node_by[key+':'+str(i)];test(q,'Procestype vinden bij beschreven handeling',[n['id']],[],n['bron'],'rol_en_procesonderscheid',n['benaming'])
 else:
  report=(R/'bronnen/rapport-1996.md').read_text();section=report[report.index('| Zoekvraag | Verwacht'):];
  for line in section.splitlines()[2:]:
   if not line.startswith('|'):break
   cells=[c.strip() for c in line.strip('|').split('|')]
   if len(cells)<4:continue
   m=re.search(r'\b(?:2\.\d+|3\.\d+\.\d+)\b',cells[1])
   if m and key+':'+m[0] in node_by:
    n=node_by[key+':'+m[0]];test(cells[0],'Relevante rubriek vinden; onderzoeksverwachting gecontroleerd op bestaande code',[n['id']],[],n['bron'],'onderzoeksscenario',n['benaming'],['Rubriek bevat verschillende waarderingen. Onderzoeksverwachting is een zoekrichting; vraag kan nadere context vereisen.'])
 for term,q,typ in scenario_terms:
  hits=[]
  for s in pk['selectiegegevens']:
   if s['status']!='actief':continue
   txt=' '.join(str(s.get(f) or '') for f in ['officiele_benaming','officiele_omschrijving','toelichting'])
   if norm(term) in norm(txt):hits.append(s)
  if not hits:continue
  targetids=list(dict.fromkeys(s['structuur_id'] for s in hits));source=hits[0]['bron'];test(q,'Mogelijk relevante categorieën vinden bij een onderwerp of documentsoort',targetids[:3],targetids[3:],source,typ,hits[0]['officiele_benaming'])
  if len(tests)>=55:break
 assert len(tests)>=40,(key,len(tests));pk['testvragen']=tests
# Export datasets and inspectable CSV files.
for key,pk in PACKS.items():
 base=P/'datasets'/key
 for name in ['structuur','selectiegegevens','zoeklexicon','relaties','testvragen']:
  data=pk[name];write(base/(name+'.json'),data)
  if data:
   fields=sorted(set().union(*(r.keys() for r in data)))
   with (base/(name+'.csv')).open('w',encoding='utf-8-sig',newline='') as f:
    w=csv.DictWriter(f,fieldnames=fields);w.writeheader();w.writerows({k:json.dumps(v,ensure_ascii=False) if isinstance(v,(dict,list)) else v for k,v in r.items()} for r in data)
 write(base/'codeinventaris.json',pk['codeinventaris'])
write(AUD/'bronverschillen-2017.json',DIFF);write(AUD/'openstaande-beoordelingen.json',REVIEW)
write(AUD/'afgewezen-onderzoeksrelaties.json',[{'term_a':a,'term_b':b,'reden':c,'status':'niet_als_exacte_equivalentie_overgenomen'} for a,b,c in REJECT])
write(AUD/'broncontrole-1996.json',A);write(AUD/'dekking-1996.json',read(R/'coverage1996.json'));write(AUD/'kopcontrole-1996.json',H)
print(json.dumps({k:{name:len(pk[name]) for name in ['structuur','selectiegegevens','zoeklexicon','relaties','testvragen']} for k,pk in PACKS.items()},indent=2));print('reviews',len(REVIEW),'2017differences',len(DIFF))
