# Publicatieversie: oorspronkelijke bronopbouwlogica, geen zelfstandige openbare bronbundel.
# Gebruik scripts/bronopbouw_prive.py met een rechtmatig verkregen externe bronmap.
# Alleen deze wrapper kopieert dit script naar de verwachte private werkstructuur.
from pathlib import Path as _PublicPath
if __name__ == "__main__" and _PublicPath(__file__).parent.name == "bronopbouw":
    print("Dit is bronopbouwlogica. Gebruik: python scripts/bronopbouw_prive.py --help")
    raise SystemExit(0)
"""Additional source audit and an editable, non-mandatory human review handoff."""
from pathlib import Path
import json,re,hashlib,collections,unicodedata,copy,csv
import fitz,openpyxl,jsonschema
from openpyxl.styles import Font,PatternFill,Alignment
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.worksheet.table import Table,TableStyleInfo
from openpyxl.workbook.properties import CalcProperties
R=Path(__file__).resolve().parents[1];P=R/'revisie';D=P/'documentatie';C=P/'controle';C.mkdir(exist_ok=True)
def load(p):return json.loads(p.read_text())
def write(p,x):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def compact(v):return re.sub(r'[^a-z0-9]','',unicodedata.normalize('NFKD',str(v or '')).casefold())
def short(v):return re.sub(r'\s+',' ',str(v or '')).strip()
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
KEYS=['1996-2012','2017','2020'];DATA={key:{name:load(P/'datasets'/key/(name+'.json')) for name in ['structuur','selectiegegevens','zoeklexicon','relaties','testvragen']} for key in KEYS};REVS=load(D/'openstaande-beoordelingen.json');REVMAP={(r['lijst'],r['code']):r for r in REVS}
PDFS={key:fitz.open(P/'bronnen'/('1996.pdf' if key=='1996-2012' else key+'.pdf')) for key in KEYS}
# A different extraction view (words) checks categorical and numeric fields against the official PDF.
AUDIT=[];ERRORS=[]
def words_cell(pg,box,x0,x1):
 return ' '.join(w[4] for w in pg.get_text('words') if x0<=w[0]<x1 and box[1]-.2<=w[1]<box[3]-.2)
for key,pk in DATA.items():
 sels=pk['selectiegegevens'];indices={s['id']:s for s in sels}
 for s in sels:
  assert s['id'].startswith(key+':') and s['structuur_id'].startswith(key+':')
  if key=='1996-2012':
   # Re-read actual source pages, rather than trusting a copied evidence string alone.
   for typ,segments in s['officiele_bronrij'].items():
    for seg in segments:
     p=PDFS[key][seg['pagina']-1];text=p.get_text(clip=fitz.Rect(*seg['bbox'])+(-.3,-.3,.3,.3))
     if compact(seg['tekst']) not in compact(text):
      # Tight glyph bounding boxes occasionally omit a character. Inspect full page extraction before flagging.
      if compact(seg['tekst']) not in compact(p.get_text()):ERRORS.append({'id':s['id'],'veld':typ,'reden':'bronsegment niet teruggevonden','tekst':seg['tekst']})
   AUDIT.append({'lijst':key,'id':s['id'],'controle':'bronsegmenten_opnieuw_gelezen','resultaat':'geslaagd' if not any(e['id']==s['id'] for e in ERRORS) else 'afwijking'})
  else:
   ref=s['bron'] if key=='2020' else next(z for z in s['aanvullende_bronnen'] if z['bron_id']=='2017-officieel' and z.get('bbox'))
   p=PDFS[key][ref['pdf_pagina']-1];box=ref['bbox'];valu=words_cell(p,box,535.6,567.0) if key=='2020' else words_cell(p,box,403.2,431.6)
   if s['waardering']['type'] in ['bewaren','vernietigen'] and compact(valu)!=compact(s['waardering']['officiele_tekst']):ERRORS.append({'id':s['id'],'veld':'waardering','dataset':s['waardering']['officiele_tekst'],'woordextractie':valu})
   tech=s['bewaartermijn']['technisch']
   if tech:
    dur=words_cell(p,box,624.3,656.1) if key=='2020' else words_cell(p,box,459.9,488.2)
    if key=='2017' and s['code']=='16.2.2':
     amendment=PDFS[key][152].get_text();ok='4jaarschrappenenvervangendoor3jaar' in compact(amendment)
     if not ok:ERRORS.append({'id':s['id'],'veld':'bewaartermijn','reden':'wijzigingsinstructie niet bevestigd'})
    elif compact(dur)!=compact(s['bewaartermijn']['officiele_tekst']):ERRORS.append({'id':s['id'],'veld':'bewaartermijn','dataset':s['bewaartermijn']['officiele_tekst'],'woordextractie':dur})
   AUDIT.append({'lijst':key,'id':s['id'],'controle':'waardering_en_enkelvoudige_termijn_via_woordextractie','resultaat':'geslaagd' if not any(e['id']==s['id'] for e in ERRORS) else 'afwijking'})
  # No record can acquire a numerical duration that its full literal text does not support.
  tech=s['bewaartermijn']['technisch']
  if tech:
   assert re.fullmatch(r'\d+(?:[,.]\d+)?\s+(jaar|jaren|maand|maanden|dag|dagen)',short(s['bewaartermijn']['officiele_tekst']),re.I)
  if s['waardering']['type']=='vernietigen':assert s['bewaartermijn']['officiele_tekst']
write(D/'aanvullende-broncontrole.json',{'methode':'Extra woordextractie voor categorie/duur en opnieuw lezen van gelokaliseerde 1996-bronsegmenten; geen onafhankelijke menselijke tweede lezing.','aantal_records':len(AUDIT),'controles':AUDIT,'afwijkingen':ERRORS})
if ERRORS:
 print(json.dumps(ERRORS[:30],ensure_ascii=False,indent=2));raise SystemExit('Aanvullende broncontrole: afwijkingen eerst onderzoeken')
# All eleven differences are resolved as faithful source annotations; the unknown intended correction is not invented.
ANNOT=[]
for rev in REVS:
 key,c=rev['lijst'],rev['code'];s=next(s for s in DATA[key]['selectiegegevens'] if s['code']==c)
 if key=='2017':
  field='procestermijn';variants=[{'bron_id':'2017-officieel','waarde':None,'betekenis':'Lege PDF-cel, niet gelijkgesteld aan Nihil.'},{'bron_id':'2017-officiele-xls','waarde':'Nihil','betekenis':'Gepubliceerde Excel-variant.'}];decision='De PDF-cel blijft leeg; de Excel-variant is afzonderlijk vastgelegd.';question='Is de PDF-cel leeg en vermeldt de officiële XLS Nihil? Bevestig de vastlegging; kies geen nieuwe termijn zonder bron.'
 elif c=='22.1.3':
  field='toelichting';variants=[{'bron_id':'2020-officieel','waarde':s['toelichting'],'betekenis':'Zichtbaar afgebroken bronpassage.'}];decision='Alle zichtbare tekst is behouden; de ontbrekende opsomming is niet aangevuld.';question='Eindigt de zichtbare officiële toelichting bij geldige of onbruikbaar, en geeft de dataset precies die beperking weer?'
 else:
  field='resultaattype';variants=[{'bron_id':'2020-officieel','waarde':s['resultaattype'],'betekenis':'Letterlijk gepubliceerd resultaatlabel, ook al is de omschrijving inhoudelijk anders.'}];decision='Archiefvernietiging is als gepubliceerd label behouden. Geen vervanging door Verwerkt.';question='Staat Archiefvernietiging daadwerkelijk in de resultaatkolom? Bevestig de transcriptie en de waarschuwing; de bedoelde tekst hoeft niet te worden geraden.'
 ann={'id':key+':bronannotatie:'+c,'lijst':key,'onderdeel_id':s['id'],'code':c,'veld':field,'bronvarianten':variants,'bevinding':rev['bevinding'],'verwerking':decision,'status_verwerking':'vastgelegd','belemmert_oplevering_dataset':False,'bedoelde_broncorrectie':'niet_zelfstandig_vastgesteld','controleopdracht_gebruiker':question,'bron':s['bron'],'aanvullende_bronnen':s['aanvullende_bronnen']}
 ANNOT.append(ann);s['verificatie']['bronannotaties']=[ann];s['verificatie']['oplevering']='opgeleverd_met_bronannotatie'
for key in KEYS:
 DATA[key]['bronannotaties']=[a for a in ANNOT if a['lijst']==key]
write(D/'bronannotaties.json',ANNOT)
# Focus list: all known differences, documented extraction risks, changed annex rules, and a reproducible ordinary sample.
FOCUS={};REASON={}
def focus(s,key,reason):FOCUS[s['id']]=key;REASON.setdefault(s['id'],[]).append(reason)
for key,pk in DATA.items():
 for s in pk['selectiegegevens']:
  if (key,s['code']) in REVMAP:focus(s,key,'Bronafwijking: controleer de juiste vastlegging, niet een zelfbedachte reparatie.')
  if key=='1996-2012' and s['verificatie']['bevindingen']:focus(s,key,'Gerichte bron-/layoutcontrole: '+' '.join(s['verificatie']['bevindingen']))
  if key=='2017' and s['code'] in ['16.2.2','20.1.7','19.1.18','4.1.6','7.1.20']:focus(s,key,'Wijzigingsbijlage of tekstuele termijn: vergelijk met aanvullende bronverwijzing.')
  if s['waardering']['type']=='samengesteld':focus(s,key,'Samengestelde waardering: voorkom dat een deeltermijn voor de hele categorie gaat gelden.')
  if s['status']=='vervallen':focus(s,key,'Vervallen resultaat: de regel mag geen nieuwe waardering of termijn krijgen.')
 for s in sorted(pk['selectiegegevens'],key=lambda s:hashlib.sha256(s['id'].encode()).hexdigest())[:15]:focus(s,key,'Reproduceerbare gewone steekproef; geen bewijs voor alle niet-beoordeelde records.')
 # Include different task/process contexts in the risk-based subset.
 complexs=[s for s in pk['selectiegegevens'] if s['status']=='actief' and s['waardering']['type']=='vernietigen' and s['bewaartermijn']['technisch'] is None]
 for s in sorted(complexs,key=lambda s:hashlib.sha256(('duur'+s['id']).encode()).hexdigest())[:5]:focus(s,key,'Voorwaardelijke of niet-numerieke termijn: lees context en aanvangsmoment mee.')
# Editable workbook: no verdict is prefilled as user approval.
wb=openpyxl.Workbook();wb.remove(wb.active);wb.calculation=CalcProperties(fullCalcOnLoad=True)
NAVY='17365D';BLUE='D9EAF7';YELLOW='FFF2CC';GREEN='E2F0D9';GRAY='F2F2F2';WHITE='FFFFFF'
DECISIONS=['Niet beoordeeld','Akkoord','Correctie nodig','Bronafwijking correct vastgelegd','Nader onderzoek','Niet van toepassing']
def cellvalue(v):
 if isinstance(v,(dict,list)):v=json.dumps(v,ensure_ascii=False)
 if v is None:return ''
 return str(v)[:32700]
def sheet(name,headers,rows,widths,editable=(),heights=54):
 ws=wb.create_sheet(name);ws.append(headers)
 for r in rows:
  ws.append([cellvalue(v) for v in r])
  for cell in ws[ws.max_row]:
   if isinstance(cell.value,str) and cell.value.startswith('='):cell.data_type='s'
 for c in ws[1]:c.fill=PatternFill('solid',fgColor=NAVY);c.font=Font(bold=True,color=WHITE);c.alignment=Alignment(wrap_text=True,vertical='center')
 ws.row_dimensions[1].height=32
 for row in ws.iter_rows(min_row=2):
  ws.row_dimensions[row[0].row].height=heights
  for c in row:
   c.alignment=Alignment(wrap_text=True,vertical='top');c.font=Font(name='Calibri',size=11)
   if c.column in editable:c.fill=PatternFill('solid',fgColor=YELLOW)
 for i,width in enumerate(widths,1):ws.column_dimensions[openpyxl.utils.get_column_letter(i)].width=width
 ws.freeze_panes='E2' if len(headers)>5 else 'A2';ws.auto_filter.ref=ws.dimensions;ws.sheet_view.zoomScale=85
 if len(rows):
  table=Table(displayName='T'+re.sub(r'[^a-zA-Z0-9]','',name),ref=ws.dimensions);table.tableStyleInfo=TableStyleInfo(name='TableStyleMedium2',showRowStripes=True);ws.add_table(table)
 for col in editable:
  if headers[col-1]=='Oordeel':
   dv=DataValidation(type='list',formula1='"'+','.join(DECISIONS)+'"');dv.error='Kies een oordeel uit de lijst.';dv.showErrorMessage=True;ws.add_data_validation(dv);dv.add(f'{openpyxl.utils.get_column_letter(col)}2:{openpyxl.utils.get_column_letter(col)}{max(2,ws.max_row)}')
 return ws
allselections=[(key,s) for key in KEYS for s in DATA[key]['selectiegegevens']];selrow={s['id']:i+2 for i,(key,s) in enumerate(allselections)}
reg={key:{z['id']:z for z in load(P/'datasets'/key/'manifest.json')['bronnenregister']} for key in KEYS}
def source_link(key,s):
 z=s['bron'];src=reg[key].get(z['bron_id']);file=src['bestand'].replace('../../','../') if src else '../bronnen/'+('1996.pdf' if key=='1996-2012' else key+'.pdf')
 return file+'#page='+str(z['pdf_pagina'])
def srctext(key,s):
 src=s['bron'];parts=[f"{src['bron_id']}, PDF-pagina {src['pdf_pagina']}"]
 for a in s['aanvullende_bronnen']:
  if a.get('pdf_pagina'):parts.append(f"{a['bron_id']}, PDF-pagina {a['pdf_pagina']}")
  elif a.get('rij'):parts.append(f"Concordans Blad1, rij {a['rij']}")
 return '\n'.join(parts)
start=wb.create_sheet('Start',0);start.append(['Controlewerkboek gemeentelijke selectielijsten','']);start.append(['Versie','0.3.0 — opgeleverd met bronannotaties']);start.append(['Wat is al gedaan?','Alle 1.145 selectieregels zijn aanvullend automatisch getoetst. De bekende bronafwijkingen zijn expliciet vastgelegd.']);start.append(['Wat doe jij?','Begin bij Bronafwijkingen, volg daarna Controlevolgorde. Noteer uitsluitend jouw eigen oordeel in de gele velden.']);start.append(['Bronbestanden','Pak eerst de ZIP uit. Dit werkboek blijft in controle/, naast de map bronnen/. Bronlinks gebruiken fysieke PDF-paginanummers vanaf 1.']);start.append(['Geen extra goedkeuringsvereiste','Jouw controle is een inhoudelijke kwaliteitsstap. Een tweede beoordelaar of antwoord van de bronhouder is geen algemene voorwaarde voor oplevering.']);start.append(['Verschil versus fout','Een juist vastgelegde bronafwijking kan worden beoordeeld als Bronafwijking correct vastgelegd. Los de bedoelde officiële tekst niet op door te gokken.']);start.append(['Steekproef','De gerichte controlelijst is een voorstel, geen volledige menselijke controle. Alle 1.145 regels staan in Selectiecontrole voor wie integraal wil controleren.']);start.append(['Zoekvoorstellen','Beoordeel eerst de 40 gerichte verrijkingen. Niet-gevalideerde voorstellen blijven standaard uit; je hoeft ze niet te accepteren om de dataset te gebruiken.']);start.append(['Teruggeven','Sla een eigen kopie op en lever het ingevulde werkboek terug. De datasets veranderen niet wanneer je in dit werkboek een oordeel invult.']);start.append(['Legenda geel','Invulvelden voor oordeel, correctie en opmerkingen. Niet geel = bron-/controle-informatie.']);start.append(['Beoordeeld in Selectiecontrole',None]);start['B12']='=COUNTA(Selectiecontrole!A2:A1146)-COUNTIF(Selectiecontrole!E2:E1146,"Niet beoordeeld")';start.append(['Akkoord',None]);start['B13']='=COUNTIF(Selectiecontrole!E2:E1146,"Akkoord")';start.append(['Correctie nodig',None]);start['B14']='=COUNTIF(Selectiecontrole!E2:E1146,"Correctie nodig")';start.append(['Aantal gerichte controles',str(len(FOCUS))]);start.append(['Uitgebreide instructie','Controle-instructie.md in dezelfde map.'])
start.column_dimensions['A'].width=34;start.column_dimensions['B'].width=115
for row in start:
 start.row_dimensions[row[0].row].height=48
 for c in row:c.alignment=Alignment(wrap_text=True,vertical='top');c.font=Font(name='Calibri',size=11)
for c in start[1]:c.fill=PatternFill('solid',fgColor=NAVY);c.font=Font(color=WHITE,bold=True,size=14)
selrows=[]
for key,s in allselections:
 reason='\n'.join(REASON.get(s['id'],[]));selrows.append([s['id'],key,s['code'],'Gerichte controle' if s['id'] in FOCUS else 'Overige regel','Niet beoordeeld','',s['officiele_benaming'],s['officiele_omschrijving'],s['waardering']['officiele_tekst'] or s['waardering']['type'],s['bewaartermijn']['officiele_tekst'],s['procestermijn']['officiele_tekst'],s['aanvangsmoment']['officiele_tekst'],s['toelichting'],srctext(key,s),source_link(key,s),reason,s['broncontext'] if 'broncontext' in s else 'Algemene bepalingen en volledige bronrij raadplegen.'])
ws=sheet('Selectiecontrole',['ID','Lijst','Code','Controleprioriteit','Oordeel','Jouw correctie of waarneming','Benaming','Officiële omschrijving','Waardering','Bewaartermijn — letterlijk','Procestermijn — letterlijk','Aanvangsmoment/legenda','Toelichting','Bronlocaties','Open bron','Waarom in gerichte controle?','Context'],selrows,[35,14,13,24,32,55,55,75,32,55,50,75,75,55,20,65,60],editable=(5,6))
for i,(key,s) in enumerate(allselections,2):ws.cell(i,15).hyperlink=source_link(key,s);ws.cell(i,15).value='Open PDF-pagina';ws.cell(i,15).font=Font(color='0563C1',underline='single')
controlrows=[]
for id,key in FOCUS.items():
 s=next(s for s in DATA[key]['selectiegegevens'] if s['id']==id);controlrows.append([id,key,s['code'],'\n'.join(REASON[id]),'Bekijk record',srctext(key,s),'Controleer code/context, omschrijving, waardering, volledige termijn en startmoment. Noteer het oordeel in Selectiecontrole.'])
ws=sheet('Controlevolgorde',['ID','Lijst','Code','Aanleiding','Naar record','Bronlocaties','Werkwijze'],controlrows,[36,14,13,90,22,65,95],heights=65)
for i,row in enumerate(controlrows,2):ws.cell(i,5).hyperlink="#'Selectiecontrole'!A"+str(selrow[row[0]]);ws.cell(i,5).font=Font(color='0563C1',underline='single')
# Visible PDF excerpts for all known source issues; these are evidence extracts, not corrected sources.
image_dir=C/'bronbeelden';image_dir.mkdir(exist_ok=True);annrows=[]
for ann in ANNOT:
 key=ann['lijst'];s=next(s for s in DATA[key]['selectiegegevens'] if s['id']==ann['onderdeel_id']);ref=s['bron'] if key=='2020' else next(z for z in s['aanvullende_bronnen'] if z['bron_id']=='2017-officieel' and z.get('bbox'));p=PDFS[key][ref['pdf_pagina']-1];b=ref['bbox'];clip=fitz.Rect(270 if key=='2017' else 374,max(0,b[1]-1),min(p.rect.width,785 if key=='2017' else 775),min(p.rect.height,b[3]+1));img=image_dir/(key+'-'+ann['code']+'.png');p.get_pixmap(matrix=fitz.Matrix(4,4),clip=clip).save(img)
 annrows.append([ann['id'],key,ann['code'],ann['veld'],'Niet beoordeeld','',ann['bevinding'],ann['verwerking'],ann['controleopdracht_gebruiker'],srctext(key,s),'bronbeelden/'+img.name,'Naar selectiecontrole'])
ws=sheet('Bronafwijkingen',['Annotatie-ID','Lijst','Code','Veld','Oordeel','Jouw waarneming of bron','Bronbevinding','Verwerking in dataset','Jouw controleopdracht','Bronlocaties','Bronuitsnede','Naar record'],annrows,[37,14,13,25,32,60,85,85,100,65,24,24],editable=(5,6),heights=95)
for i,(row,ann) in enumerate(zip(annrows,ANNOT),2):
 ws.cell(i,11).hyperlink=row[10];ws.cell(i,11).value='Open bronuitsnede';ws.cell(i,12).hyperlink="#'Selectiecontrole'!A"+str(selrow[ann['onderdeel_id']])
curated={z['id'] for z in load(D/'zoekverrijking-beoordelingen.json')};lexrows=[]
for key in KEYS:
 for z in DATA[key]['zoeklexicon']:
  priority='1 — gerichte verrijking' if z['id'] in curated else '2 — onbevestigd voorstel' if z['beoordelingsstatus']=='voorstel_niet_activeren' else '3 — bronterm of variant';lexrows.append([z['id'],key,z['onderdeel_id'],priority,'Niet beoordeeld','',z['zoekterm'],z['relatietype'],z['herkomsttype'],z['beoordelingsstatus'],z['onderbouwing'],z['risico_op_verwarring'],z['bron']])
ws=sheet('Zoekverrijking',['Term-ID','Lijst','Doel-ID','Controleprioriteit','Oordeel','Jouw correctie of opmerking','Zoekterm','Relatie','Herkomst','Bestaande status','Onderbouwing','Verwarringsrisico','Bron'],lexrows,[34,14,36,28,32,65,70,30,32,45,100,80,80],editable=(5,6))
testrows=[]
for key in KEYS:
 for q in DATA[key]['testvragen']:testrows.append([q['id'],key,q['type_zoekvraag'],'Vindbaarheid, geen toepasselijkheidsbesluit','Niet beoordeeld','',q['zoekvraag'],q['verwachte_relevante_categorieen'],q['alternatieve_relevante_categorieen'],q['onzekerheden'],q['controleerbaar_bronfragment'],q['bron']])
ws=sheet('Zoekvragen',['Vraag-ID','Lijst','Type','Betekenis test','Oordeel','Jouw alternatief of opmerking','Zoekvraag','Verwachte richtingen','Andere richtingen','Onzekerheid','Bronfragment','Bron'],testrows,[34,14,28,45,32,65,100,80,80,95,80,70],editable=(5,6),heights=72)
sheet('Bevindingen',['Bevinding-ID','Lijst','Record/term/vraag-ID','Onderwerp','Oordeel','Beschrijving','Voorgestelde correctie','Bron met pagina','Reden','Naam beoordelaar','Datum'],[[f'B-{i:03}','', '', '', 'Niet beoordeeld','','','','','',''] for i in range(1,51)],[18,14,40,35,32,90,90,65,75,30,20],editable=(2,3,4,5,6,7,8,9,10,11))
summary=collections.Counter(a['resultaat'] for a in AUDIT)
sheet('Automatische_checks',['Controle','Aantal/uitkomst','Betekenis'],[['Aanvullend getoetste selectieregels',len(AUDIT),'Hercontrole met aanwezige primaire bronbestanden.'],['Gevonden afwijkingen in deze extra controle',len(ERRORS),'Afwijkingen tussen de dataset en de aanvullende controlemethode, niet de elf bekende bronafwijkingen.'],['Bekende bronannotaties',len(ANNOT),'Als bronafwijking verwerkt; geen algemene opleverblokkade.'],['Gerichte controlelijst',len(FOCUS),'Risico- en steekproefselectie; geen vervanging van een integrale menselijke controle.'],['Zoektermkoppelingen',len(lexrows),'Meerdere termen mogen naar hetzelfde onderdeel verwijzen en andersom.'],['Zoekvragen',len(testrows),'Nog geen zoekmachineprestatiemeting.'],['Menselijke oordelen','Allemaal Niet beoordeeld','Er is geen menselijke instemming vooringevuld.']],[48,40,115],heights=52)
wb.save(C/'Controlewerkboek.xlsx')
# Plain-language instructions and corrected delivery status.
instruction=f'''# Controle-instructie gemeentelijke selectielijsten

Het pakket is opgeleverd met gedocumenteerde bronafwijkingen. Er is geen algemene blokkade op oplevering. Jouw controle is bedoeld om transcriptie, afbakening en bruikbaarheid te toetsen; een tweede beoordelaar of antwoord van een bronhouder is geen door mij opgelegde voorwaarde.

## 1. Beginnen

1. Download de bijgewerkte ZIP en pak deze volledig uit. Laat de mappen naast elkaar staan.
2. Open `controle/Controlewerkboek.xlsx` in Excel. Er zijn geen macro's. Relatieve bronlinks werken het beste vanuit de uitgepakte map.
3. Lees het tabblad **Start**. Gele cellen zijn voor jouw oordeel en opmerkingen. Alle oordelen beginnen met **Niet beoordeeld**.
4. PDF-pagina betekent de fysieke pagina vanaf 1 in de PDF-lezer. Dat nummer kan verschillen van het gedrukte paginanummer.
5. Een bronlink opent de PDF of de uitsnede; als een PDF-programma de pagina niet automatisch volgt, navigeer naar de pagina die daarnaast staat.

## 2. Eerst de elf bronafwijkingen

Open **Bronafwijkingen**. Per rij staan de geconstateerde afwijking, mijn verwerking, jouw concrete vraag, de bronlocatie en een bronuitsnede.

- **2017 — 7.1.2, 7.1.3, 7.1.5, 7.1.6:** vergelijk de lege procestermijncel in de officiële PDF (fysieke pagina 32) met `bronnen/2017-xls.xls`. Filter in dat bestand de kolom **Nr.** op de betreffende code. De XLS vermeldt Nihil. Controleer dat de dataset de lege PDF-cel en de Excel-variant afzonderlijk vastlegt. Je hoeft de bedoelde juridische waarde niet te raden.
- **2020 — 19.1.19 t/m 19.1.24:** open de officiële PDF, fysieke pagina 38. Controleer code, omschrijving en de resultaatkolom. Het gepubliceerde label Archiefvernietiging is letterlijk behouden; beoordeel of de bronafwijking duidelijk is vastgelegd.
- **2020 — 22.1.3:** open fysieke pagina 39. Controleer waar de zichtbare toelichting stopt. De ontbrekende tekst is niet uit 2017 gekopieerd. Bevestig de correcte vastlegging of wijs een daadwerkelijk aanwezige vervolgpassage aan.

Als de afwijking klopt en correct is weergegeven, kies **Bronafwijking correct vastgelegd**. Een record kan zo correct zijn overgenomen terwijl de officiële bron zelf onduidelijk is. Kies **Correctie nodig** wanneer de dataset afwijkt van de bron; noteer de exacte vervangende tekst en de bronpagina. Gebruik **Nader onderzoek** wanneer je nog niet kunt oordelen. Een verduidelijking door de bronhouder is alleen nodig als we de bedoelde officiële tekst willen herstellen, niet om de huidige transcriptie te leveren.

## 3. Daarna de gerichte selectiecontrole

Tabblad **Controlevolgorde** bevat {len(FOCUS)} voorgeselecteerde records: bronafwijkingen, gedeelde/verschoven cellen, gewijzigde regels, samengestelde en tekstuele termijnen, vervallen resultaten en vijftien gewone steekproefregels per lijst. De selectie is reproduceerbaar. Klik op **Naar record** en leg je oordeel vast op **Selectiecontrole**, zodat het oordeel één vaste plaats heeft.

Loop per record deze vijf punten na:

1. **Plaats en context:** klopt selectielijst, officiële code en bovenliggende rubriek/procescontext? Bij 1996/2012 is ::001 een technische subregel, geen nieuwe officiële code.
2. **Omschrijving:** klopt het beschreven geval? Lees ook de bovenliggende kop en eventuele doorlopende tekst op de volgende pagina. Een korte subregel zoals uitvoering is zonder context onvoldoende.
3. **Waardering:** staat er bewaren, vernietigen of een samengestelde waardering? Bij bewaren met uitzonderingen geldt een vernietigingstermijn voor een deelverzameling, niet vanzelf voor het hele dossier.
4. **Volledige termijn en begin:** zijn duur, gebeurtenis, voorwaarden en uitzonderingen behouden? Maak van na vervallen geen termijn van een vast aantal jaren. Lees procestermijn en legenda mee.
5. **Herkomst:** kun je de formulering op de opgegeven bronpagina terugvinden? Een ander geformuleerd document is een bronverschil, geen reden om ongemerkt een waarde te vervangen.

Gebruik bij 1996/2012 ook `datasets/1996-2012/rubriekcontext.json` of de volledige PDF om gedeelde voorwaarden te zien. Sommige tekstcodering in de officiële PDF is defect; de PDF-weergave en gelabelde leesbare paginakopie zijn daarom beschikbaar. Controleer de zichtbare bron, niet alleen kopieerbare tekst.

De gerichte selectie is een werkbare start. Zij levert geen integrale menselijke controleclaim op. Voor volledige menselijke recordcontrole staan alle **1.145 regels** in **Selectiecontrole**; behandel ook de overige regels als je dat niveau van controle wilt uitvoeren. Als een steekproef een systematisch probleem toont, breid uit naar de betreffende rubriek, het proces of het extractietype.

## 4. Zoekverrijking beoordelen

Filter **Zoekverrijking** eerst op **1 — gerichte verrijking**: dit zijn de veertig extra beoordeelde koppelingen. Controleer of de term naar een relevante zoekrichting verwijst en of het relatietype niet te sterk is. Bedenk: een zoekterm mag meerdere relevante categorieën vinden.

- **Akkoord:** bruikbare zoekrichting met correct herkomst- en relatielabel. Dat betekent geen juridische gelijkwaardigheid.
- **Correctie nodig:** noteer een ander doel, een zwakker relatietype of dat de koppeling moet worden verwijderd.
- **Niet van toepassing:** bijvoorbeeld een voorgestelde ingang die je niet in het zoekprofiel wilt gebruiken; licht dit toe.
- **Nader onderzoek:** onvoldoende onderbouwing om de koppeling te activeren.

Filter daarna desgewenst op **2 — onbevestigd voorstel**. Deze voorstellen blijven standaard uitgeschakeld zolang ze niet zijn beoordeeld. Je hoeft ze niet te accepteren om de officiële gegevens te gebruiken. Controleer ook enkele officiële termen en taalkundige varianten op verkeerde afbakening of misleidende fragmenten.

## 5. Zoekvragen nalopen

Lees **Zoekvragen**: past de verwachte categorie bij de beschreven handeling, het onderwerp en de rol van de gemeente? Voeg gemiste alternatieven toe. Beoordeel vindbaarheid, niet meteen de bewaartermijn. Zolang er geen zoekmachine is, beoordeel je de verwachting zelf; je kunt nog geen rangschikking of zoekprestatie testen.

## 6. Teruggeven en verwerken

Sla het werkboek op als bijvoorbeeld `Controlewerkboek_inhoudelijke_beoordelaar_2026-11-10.xlsx` en lever dat terug. Gebruik **Bevindingen** voor punten over meerdere records. Vermeld altijd lijst, ID/code, huidige tekst, gewenste correctie en bronpagina. Bewerk de JSON-bestanden niet tegelijk: jouw opmerkingen worden dan controleerbaar verwerkt tot een volgende datasetversie met nieuwe hashes en controles.

Een nuttig eerste controlemoment is afgerond wanneer de elf bronafwijkingen en de gerichte controlelijst zijn beoordeeld, en je de veertig gerichte zoekkoppelingen hebt bekeken. Dat is een gekozen controlescope, geen formele vrijgaveplicht en geen claim dat alle overige regels menselijk zijn gecontroleerd.
'''
(C/'Controle-instructie.md').write_text(instruction)
(D/'controleoverdracht.md').write_text(f'''# Uitgevoerde controles en overdracht — 0.3.0

Aanvullend zijn alle {len(AUDIT)} selectieregels gecontroleerd: 1996-bronsegmenten opnieuw gelezen uit de bron-PDF; bij 2017/2020 waarderingen en enkelvoudige termijnen vergeleken via woordextractie. De uitzondering 16.2.2 is getoetst aan de wijzigingsinstructie. Deze controle vond {len(ERRORS)} nieuwe verschillen tussen dataset en gecontroleerde bronvelden.

De elf eerder gevonden bronverschillen zijn expliciete bronannotaties geworden, inclusief bronvarianten, gekozen transcriptie en een controleopdracht. De bedoelde officiële correctie is niet verzonnen. Zij blokkeren de oplevering van het pakket niet. Voorwaarden en bronwaarschuwingen blijven relevant bij toepassing.

Een controlewerkboek bevat 1.145 selectieregels, {len(FOCUS)} gerichte controles, {len(lexrows)} zoektermkoppelingen en {len(testrows)} zoekvragen. Alle menselijke oordelen zijn leeg/ongecontroleerd; er is geen menselijke beoordeling gefingeerd. De controlescope wordt door de gebruiker gekozen.

Begin bij controle/Controle-instructie.md en controle/Controlewerkboek.xlsx. De resultaten van eerdere controles blijven bewaard. Een onafhankelijke tweede menselijke lezing is een mogelijke kwaliteitsstap, geen oplevervoorwaarde in deze opdracht.
''')
(P/'README.md').write_text('''# Gemeentelijke selectielijsten — opgeleverd met bronannotaties, versie 0.3.0

Drie zelfstandige datasets: 494 technische voorschriftregels voor 1996/2012, 305 resultaten voor 2017 en 346 tabelregels voor 2020, waaronder twee vervallen regels.

De bronextractie en geautomatiseerde controles zijn uitgevoerd. Elf bekende verschillen/gebreken in de officiële bronnen zijn expliciet als bronannotatie bewaard; zij vormen geen algemene blokkade voor oplevering. De bedoelde officiële correctie is niet gegokt. De officiële gegevens blijven leidend en een semantische zoekrelatie bepaalt geen juridische toepasselijkheid.

Voor je eigen controle: open controle/Controle-instructie.md en controle/Controlewerkboek.xlsx. Alle menselijke oordelen staan op Niet beoordeeld. Een tweede beoordelaar of antwoord van de bronhouder is geen door deze opdracht vereiste vrijgaveprocedure.

De eerdere rapporten blijven beschikbaar als auditspoor. Voor de actuele opleverstatus geldt documentatie/controleoverdracht.md, samen met de nieuwe manifesten en bronannotaties.
''')
# Replace the misleading general release gate in the current-facing documents; retain the observations.
(D/'openstaande-beoordelingen.md').write_text('''# Bronannotaties en mogelijke vervolgbeoordelingen

De elf bronvragen zijn als bronafwijking vastgelegd in bronannotaties.json. Dat rondt hun verwerking in deze transcriptie af. De bedoelde officiële correctie is nog niet vastgesteld. Dit blokkeert de oplevering van de drie datasets niet.

Voor de controleopdracht, bronlocaties en invulvelden: controle/Controle-instructie.md en controle/Controlewerkboek.xlsx. Bevestig of een afwijking correct is vastgelegd; een bronhouder hoeft alleen te worden bevraagd als de bedoelde officiële tekst moet worden vastgesteld of aangevuld.

Een aanvullende menselijke beoordeling is een aanbevolen mogelijkheid en geen automatisch opgelegde goedkeuringsvoorwaarde. Niet-gevalideerde AI-zoekvoorstellen blijven herkenbaar en standaard uitgeschakeld.
''')
# Adjust current-facing report language without erasing the historical observations or inventing sign-off.
p=D/'validatierapport.md';txt=p.read_text();txt=txt.replace('De elf bronvragen verhinderen een verklaring dat alle officiële gegevens eenduidig en volledig inhoudelijk vrijgegeven zijn.','De elf bronafwijkingen zijn in versie 0.3.0 als bronannotaties verwerkt. De bron zelf wordt daarmee niet eenduidig gemaakt; de oplevering van de dataset is hierdoor niet geblokkeerd. Een formele vrijgaveprocedure is geen onderdeel van deze opdracht.');txt+='\n\n## Aanvullende controle en overdracht 0.3.0\n\nZie controleoverdracht.md en aanvullende-broncontrole.json. Alle 1.145 selectieregels zijn aanvullend gecontroleerd. Het controlewerkboek biedt een risicogerichte volgorde en bevat ook alle regels voor een eventuele integrale controle. Dit voegt geen verplichte tweede beoordelaar toe.\n';p.write_text(txt)
p=D/'implementatieadvies.md';txt=p.read_text().replace('geef bij de betrokken records geen automatische termijnuitkomst.','leid bij de betrokken records geen eenduidige termijnuitkomst af uit een leeg, tegenstrijdig of onvolledig bronveld. De officiële brontekst en bronvarianten mogen wel worden getoond.');p.write_text(txt)
# Export annotated data and update manifests and structural schemas.
for key,pk in DATA.items():
 base=P/'datasets'/key
 for name in ['selectiegegevens','bronannotaties']:
  write(base/(name+'.json'),pk[name])
 sels=pk['selectiegegevens']
 with (base/'selectiegegevens.csv').open('w',encoding='utf-8-sig',newline='') as f:
  fields=sorted(set().union(*(r.keys() for r in sels)));w=csv.DictWriter(f,fieldnames=fields);w.writeheader();w.writerows({k:json.dumps(v,ensure_ascii=False) if isinstance(v,(dict,list)) else v for k,v in r.items()} for r in sels)
 val=load(base/'validatie.json');val['aanvullende_controle']={'records':len(sels),'nieuwe_extractieafwijkingen':0,'methode':'zie_documentatie_aanvullende_broncontrole'};val['opleverstatus']='opgeleverd_met_bronannotaties';val['verplichte_tweede_beoordelaar']=False;val['status']='bronextractie_gecontroleerd_met_bronannotaties' if pk['bronannotaties'] else 'bronextractie_gecontroleerd';write(base/'validatie.json',val)
 m=load(base/'manifest.json');m['datasetversie']='0.3.0-opgeleverd-met-bronannotaties';m['opleverstatus']='opgeleverd_met_bronannotaties';m['validatiestatus']=val;m['aantallen']['bronannotaties']=len(pk['bronannotaties']);m['controleoverdracht']={'werkboek':'../../controle/Controlewerkboek.xlsx','instructie':'../../controle/Controle-instructie.md','menselijke_oordelen_vooraf_ingevuld':False,'formele_vrijgave_vereist_voor_oplevering':False};m['sha256']={p.name:sha(p) for p in sorted(base.iterdir()) if p.is_file() and p.name!='manifest.json'};write(base/'manifest.json',m)
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
for name in ['manifest','selectiegegevens','bronannotaties']:
 paths=sorted((P/'datasets').glob('*/'+name+'.json'));vs=[load(p) for p in paths];sc=infer(vs);sc['$schema']='https://json-schema.org/draft/2020-12/schema';sc['title']=name+' — datasetformaat 0.3';write(P/'schemas'/(name+'.schema.json'),sc)
for key in KEYS:
 base=P/'datasets'/key
 for name in ['manifest','structuur','selectiegegevens','zoeklexicon','relaties','testvragen','bronannotaties']:jsonschema.Draft202012Validator(load(P/'schemas'/(name+'.schema.json'))).validate(load(base/(name+'.json')))
 for name,h in load(base/'manifest.json')['sha256'].items():assert sha(base/name)==h
# Current summaries and instructions must describe the current delivery, not the previous release gate.
summary=load(D/'validatieresultaten.json')
for row in summary:
 key=row['selectielijst'];row['validatie']=load(P/'datasets'/key/'validatie.json');row['datasetversie']='0.3.0';row['bronannotaties']=len(DATA[key]['bronannotaties'])
write(D/'validatieresultaten.json',summary)
p=D/'gegevensspecificatie.md';p.write_text(p.read_text().replace('# Gegevensspecificatie — 0.2.0','# Gegevensspecificatie — 0.3.0')+'\n\n## Aanvulling 0.3.0\n\nbronannotaties.json bevat per afwijking bronvarianten en de gekozen transcriptie. Dezelfde annotatie is bij het betrokken selectierecord opgenomen. Manifest.opleverstatus beschrijft de oplevering; een bronafwijking is geen algemene vrijgaveblokkade. Het controlewerkboek bevat uitsluitend onbeoordeelde menselijke invulvelden.\n')
p=D/'validatierapport.md';p.write_text(p.read_text().replace('# Validatierapport — brongecontroleerde revisie 0.2.0','# Validatierapport — oplevering 0.3.0 met bronannotaties'))
p=D/'reproduceerbaarheid.md';p.write_text(p.read_text().replace('schemas en reproduceerbare auditbestanden.','schema’s. Auditbestanden worden opnieuw gegenereerd maar niet allemaal byte voor byte vergeleken.').replace('9. document_revision.py','9. document_revision.py\n10. review_handoff.py')+'\n\nDe menselijke invulvelden worden tijdens hergeneratie leeg/Niet beoordeeld aangemaakt. Het ingevulde gebruikerswerkboek wordt niet als vastgestelde waarheid in de generatiepipeline gebruikt. De binaire identiteitscontrole betreft de dataset-JSON en schema’s; een Excel-bestand kan tijdstempels bevatten en valt niet onder die bytevergelijking.\n')

# Verify workbook integrity and that no reviewer verdict has been filled on the user's behalf.
w=openpyxl.load_workbook(C/'Controlewerkboek.xlsx',data_only=False)
for tab in ['Selectiecontrole','Bronafwijkingen','Zoekverrijking','Zoekvragen']:
 for row in w[tab].iter_rows(min_row=2):assert row[4].value=='Niet beoordeeld'
assert w['Selectiecontrole'].max_row==1146 and w['Bronafwijkingen'].max_row==12
assert w['Zoekverrijking'].max_row==len(lexrows)+1 and w['Zoekvragen'].max_row==len(testrows)+1
write(C/'controleversie.json',{'datasetversie':'0.3.0','aantal_selectieregels':len(allselections),'gerichte_controles':len(FOCUS),'bronannotaties':len(ANNOT),'zoektermkoppelingen':len(lexrows),'zoekvragen':len(testrows),'menselijke_oordelen':'Niet beoordeeld','bronbestanden_gewijzigd':False,'bestandshashes_bij_start':{key:{name:sha(P/'datasets'/key/(name+'.json')) for name in ['manifest','selectiegegevens','zoeklexicon','testvragen']} for key in KEYS}})
print(json.dumps({'extra_broncontrole_records':len(AUDIT),'nieuwe_verschillen':len(ERRORS),'gerichte_controles':len(FOCUS),'selectieregels':len(allselections),'zoektermkoppelingen':len(lexrows),'zoekvragen':len(testrows),'menselijke_oordelen_allemaal_onbeoordeeld':True},ensure_ascii=False))
