# Publicatieversie: oorspronkelijke bronopbouwlogica, geen zelfstandige openbare bronbundel.
# Gebruik scripts/bronopbouw_prive.py met een rechtmatig verkregen externe bronmap.
# Alleen deze wrapper kopieert dit script naar de verwachte private werkstructuur.
from pathlib import Path as _PublicPath
if __name__ == "__main__" and _PublicPath(__file__).parent.name == "bronopbouw":
    print("Dit is bronopbouwlogica. Gebruik: python scripts/bronopbouw_prive.py --help")
    raise SystemExit(0)
from pathlib import Path
import json,csv,hashlib,copy,re
import pandas as pd,openpyxl,jsonschema
from openpyxl.worksheet.table import Table,TableStyleInfo
R=Path(__file__).resolve().parents[1];P=R/'revisie';D=P/'documentatie';C=P/'controle';B=P/'datasets/2017';CODES={'7.1.2','7.1.3','7.1.5','7.1.6'}
def load(p):return json.loads(p.read_text())
def write(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
ss=load(B/'selectiegegevens.json');generic=next(s for s in ss if s['code']=='7.1');assert generic['procestermijn']['officiele_tekst']=='Nihil'
x=pd.read_excel(P/'bronnen/2017-xls.xls',dtype=str).fillna('');xls={r['Nr.']:r for r in x.to_dict('records')}
notes=[]
for s in ss:
 if s['code'] not in CODES:continue
 assert xls[s['code']]['Procestermijn']=='Nihil'
 assert s['officiele_bronrij']['procestermijn']==''
 s['procestermijn']={'officiele_tekst':'Nihil','status':'overgenomen_uit_officiele_xls_bevestigd_door_generiek_resultaat','legendacategorie':'A','bron':{'bron_id':'2017-officiele-xls','werkblad':0,'rij':list(xls).index(s['code'])+2,'kolom':'Procestermijn'},'oorspronkelijke_pdf_cel':None,'generiek_resultaat_id':'2017:7.1','onderbouwing':'De officiële Excel noemt expliciet Nihil; het generieke resultaat 7.1 eveneens. Geen algemene regel leeg = Nihil toegepast.'}
 s['aanvangsmoment']=copy.deepcopy(generic['aanvangsmoment'])
 s['verificatie']['status']='procestermijn_brononderbouwd_vastgesteld';s['verificatie']['bevindingen']=[v for v in s['verificatie']['bevindingen'] if 'PDF-procestermijn is leeg' not in v]+['Correctie 0.3.1: Nihil uit officiële Excel gebruikt, bevestigd door generiek resultaat 7.1. De lege PDF-cel is als oorspronkelijke bronvariant behouden.']
 for a in s['verificatie'].get('bronannotaties',[]):
  a.update(status_verwerking='afgehandeld_door_bronvergelijking',verwerking='Procestermijn Nihil uit de officiële Excel, bevestigd door generiek resultaat 7.1; oorspronkelijke lege PDF-cel bewaard.',controleopdracht_gebruiker='Afgehandeld. Geen verzoek meer om de lege PDF-cel als onopgelost inhoudelijk probleem te controleren.')
 notes.append({'id':s['id'],'code':s['code'],'procestermijn':'Nihil','oorspronkelijke_pdf_cel':None,'bron_xls':s['procestermijn']['bron'],'generiek_resultaat':'2017:7.1','interpretatie':'Gepubliceerde Excel-waarde toegepast, niet een universele overervingsregel.'})
write(B/'selectiegegevens.json',ss)
with (B/'selectiegegevens.csv').open('w',encoding='utf-8-sig',newline='') as f:
 fields=sorted(set().union(*(s.keys() for s in ss)));w=csv.DictWriter(f,fieldnames=fields);w.writeheader();w.writerows({k:json.dumps(v,ensure_ascii=False) if isinstance(v,(dict,list)) else v for k,v in s.items()} for s in ss)
for p in [B/'bronannotaties.json',D/'bronannotaties.json']:
 data=load(p)
 for a in data:
  if a['lijst']=='2017' and a['code'] in CODES:
   corresponding=next(s for s in ss if s['code']==a['code'])['verificatie']['bronannotaties'][0];a.update(corresponding)
 write(p,data)
old=load(D/'openstaande-beoordelingen.json');write(D/'openstaande-beoordelingen.json',[r for r in old if not(r['lijst']=='2017' and r['code'] in CODES)])
write(D/'correctie-procestermijn-2017.json',notes)
# Update the editable handoff. Retain original source differences on a separate information tab.
w=openpyxl.load_workbook(C/'Controlewerkboek.xlsx');ws=w['Selectiecontrole'];bycode={s['code']:s for s in ss}
for row in ws.iter_rows(min_row=2):
 if row[1].value=='2017' and row[2].value in CODES:
  s=bycode[row[2].value];row[10].value='Nihil';row[11].value=s['aanvangsmoment']['officiele_tekst'];row[15].value='Afgehandeld 0.3.1: officiële Excel en generiek resultaat 7.1 bevestigen Nihil. Oorspronkelijke PDF-cel is leeg. Geen open bronvraag.'
source=w['Bronafwijkingen'];done=w.create_sheet('Afgehandeld2017');done.append([c.value for c in source[1]])
for cell,original in zip(done[1],source[1]):cell._style=copy.copy(original._style)
for i in range(source.max_row,1,-1):
 if source.cell(i,2).value=='2017' and source.cell(i,3).value in CODES:
  values=[c.value for c in source[i]];values[7]='Afgehandeld: procestermijn Nihil uit officiële Excel, bevestigd door generiek resultaat 7.1; lege PDF-cel blijft als bronvariant bewaard.';values[8]='Ter informatie. Je hoeft geen juridische betekenis aan de lege PDF-cel toe te kennen.'
  done.append(values)
  for dst,src in zip(done[done.max_row],source[i]):
   dst._style=copy.copy(src._style)
   if src.hyperlink:dst.hyperlink=copy.copy(src.hyperlink)
  done.row_dimensions[done.max_row].height=100;source.delete_rows(i)
for name,dimension in source.column_dimensions.items():done.column_dimensions[name].width=dimension.width
done.freeze_panes='E2';done.auto_filter.ref=done.dimensions
while source.max_row>1 and not any(c.value is not None for c in source[source.max_row]):source.delete_rows(source.max_row)
for t in source.tables.values():t.ref=source.dimensions
source.auto_filter.ref=source.dimensions
for row in w['Controlevolgorde'].iter_rows(min_row=2):
 if row[1].value=='2017' and row[2].value in CODES:row[3].value='Afgehandelde correctie: Nihil is expliciet gepubliceerd in de officiële Excel en staat bij generiek resultaat 7.1. Alleen ter informatie in de controlelijst behouden.'
for row in w['Start'].iter_rows():
 for cell in row:
  if isinstance(cell.value,str):cell.value=cell.value.replace('0.3.0 — opgeleverd met bronannotaties','0.3.1 — procestermijn 2017 gecorrigeerd').replace('Begin bij Bronafwijkingen','Begin bij de zeven resterende Bronafwijkingen')
for row in w['Automatische_checks'].iter_rows(min_row=2):
 if row[0].value=='Bekende bronannotaties':row[1].value='7 resterend; 4 afgehandeld';row[2].value='Vier 2017-gevallen afgehandeld met Nihil uit officiële Excel, bevestigd door generiek resultaat 7.1.'
for sh in [source,done]:
 for row in sh.iter_rows():
  for cell in row:
   if cell.hyperlink:cell.hyperlink.ref=cell.coordinate
w.save(C/'Controlewerkboek.xlsx')
# Remove obsolete tasks from the user instructions, preserving the actual source differences as evidence.
p=C/'Controle-instructie.md';t=p.read_text();t=t.replace('## 2. Eerst de elf bronafwijkingen','## 2. Eerst de zeven resterende bronafwijkingen');t=re.sub(r'^- \*\*2017 — .*\n','',t,flags=re.M);t=t.replace('wanneer de elf bronafwijkingen','wanneer de zeven resterende bronafwijkingen');t+='\n\n## Afgehandelde correctie 2017 — versie 0.3.1\n\nVoor 7.1.2, 7.1.3, 7.1.5 en 7.1.6 wordt nu Nihil gebruikt. Die waarde is expliciet vermeld in de officiële Excel en wordt bevestigd door het generieke resultaat 7.1. De oorspronkelijke lege PDF-cel is bewaard. Deze vier gevallen staan alleen nog ter informatie in Afgehandeld2017 en behoeven geen aparte controle op een vermeend onopgeloste procestermijn. Dit schept geen algemene regel dat iedere lege cel automatisch Nihil of een geërfde waarde betekent.\n';p.write_text(t)
(D/'correctie-procestermijn-2017.md').write_text('''# Correctie procestermijn 2017 — 0.3.1

Bij 7.1.2, 7.1.3, 7.1.5 en 7.1.6 is de gebruikte procestermijn gewijzigd naar **Nihil**. De officiële Excel vermeldt deze waarde expliciet; het bovenliggende generieke resultaat 7.1 vermeldt eveneens Nihil. De bronlegenda definieert Nihil als geen afzonderlijke procestermijn: de bewaartermijn begint direct na de procesfase.

De lege PDF-cellen blijven ongewijzigd als bronvariant in het auditspoor en in officiele_bronrij. De vier gevallen zijn niet langer open inhoudelijke vragen. De oorspronkelijke afwijking in presentatie is niet ontkend, maar was onvoldoende reden om de gepubliceerde Excel-waarde ongebruikt te laten.

De toelichting bij generieke/specifieke resultaten biedt context; zij bevat geen expliciete universele instructie om iedere lege cel automatisch over te erven. Daarom is de gekozen waarde onderbouwd met de **expliciete officiële Excel-cellen**, en niet alleen met een interpretatie van leegte.

De zes afwijkende resultaatlabels en de afgebroken referendumtoelichting uit 2020 blijven apart geannoteerd. De gebruiker hoeft de vier lege PDF-cellen niet meer als onopgelost probleem te controleren.
''')
for name in ['README.md','documentatie/openstaande-beoordelingen.md','documentatie/controleoverdracht.md','documentatie/bronvragen-aan-bronhouder.md','documentatie/validatierapport.md']:
 p=P/name;t=p.read_text();t='# Actuele correctie 0.3.1\n\nDe vier procestermijngevallen uit 2017 zijn afgehandeld: Nihil uit de officiële Excel, bevestigd door generiek resultaat 7.1. Er resteren zeven bronvragen uit 2020. Eerdere passages over elf open vragen of vier onbekende procestermijnen zijn achterhaald; zie documentatie/correctie-procestermijn-2017.md (vanuit de pakketmap).\n\n'+t;p.write_text(t)
(P/'README.md').write_text('''# Gemeentelijke selectielijsten — controlepakket 0.3.1

De drie datasets bevatten 494 technische voorschriftregels voor 1996/2012, 305 resultaten voor 2017 en 346 tabelregels voor 2020, waarvan twee vervallen.

De procestermijn van 2017-resultaten 7.1.2, 7.1.3, 7.1.5 en 7.1.6 is Nihil, expliciet overgenomen uit de officiële Excel en bevestigd door generiek resultaat 7.1. De oorspronkelijke lege PDF-cellen zijn bewaard. Deze vier gevallen zijn afgehandeld.

Er resteren zeven bronannotaties uit 2020. Begin voor je eigen controle bij controle/Controle-instructie.md en controle/Controlewerkboek.xlsx. De vier afgehandelde gevallen staan ter informatie op Afgehandeld2017. Geen menselijke goedkeuring is vooringevuld.

Zie documentatie/correctie-procestermijn-2017.md voor de wijziging en de brononderbouwing. Een lege cel wordt niet automatisch in alle gevallen als Nihil of als geërfde waarde behandeld.
''')
(D/'openstaande-beoordelingen.md').write_text('''# Resterende bronannotaties — 0.3.1

Er resteren zeven bronvragen uit 2020: resultaatlabels bij 19.1.19 t/m 19.1.24 en de afgebroken toelichting bij 22.1.3. Deze zijn expliciet geannoteerd en blokkeren de oplevering niet.

De vier procestermijngevallen uit 2017 zijn afgehandeld met Nihil uit de officiële Excel, bevestigd door generiek resultaat 7.1. De lege PDF-cellen blijven als bronvariant bewaard. Er wordt geen aparte controle op die leegte meer gevraagd.

Controle-instructies staan in controle/Controle-instructie.md. Niet-gevalideerde AI-zoekvoorstellen blijven standaard uitgeschakeld.
''')
(D/'bronvragen-aan-bronhouder.md').write_text('''# Eventuele bronvragen — niet verzonden

De 2017-procestermijnen zijn afgehandeld; daarvoor wordt geen aanvullende bronvraag voorgesteld.

1. Selectielijst 2020, 19.1.19 t/m 19.1.24: de gepubliceerde resultaatkolom vermeldt Archiefvernietiging, terwijl de omschrijvingen andere onderwerpen betreffen. Kan de bedoelde resultaattekst worden bevestigd?
2. Selectielijst 2020, 22.1.3: de toelichting stopt zichtbaar bij geldige of onbruikbaar. Kan de volledige gezaghebbende tekst worden verstrekt?

Dit betreft mogelijke herstelvragen over de officiële bron, geen algemene voorwaarde voor oplevering van het huidige pakket.
''')
p=D/'reproduceerbaarheid.md';p.write_text(p.read_text().replace('10. review_handoff.py','10. review_handoff.py\n11. correct_procestermijn.py'))

# Refresh metadata; history may retain former observations, but the current status is explicit.
val=load(B/'validatie.json');val['open_bronvragen']=0;val['status']='bronextractie_gecontroleerd_procestermijn_gecorrigeerd';val['afgehandelde_bronvragen']=4;write(B/'validatie.json',val)
for key in ['1996-2012','2017','2020']:
 b=P/'datasets'/key;m=load(b/'manifest.json');m['datasetversie']='0.3.1-procestermijn-2017-gecorrigeerd'
 if key=='2017':
  m['validatiestatus']=val;m['aantallen']['records_met_open_bronvraag']=0;m['aantallen']['afgehandelde_bronvragen']=4;m['aantallen']['lege_aanvangsmomentvelden']=sum(s['aanvangsmoment']['officiele_tekst'] is None for s in ss)
 m['sha256']={p.name:sha(p) for p in sorted(b.iterdir()) if p.is_file() and p.name!='manifest.json'};write(b/'manifest.json',m)
v=load(C/'controleversie.json');v.update(datasetversie='0.3.1',open_bronvragen=7,afgehandelde_bronvragen_2017=4)
for key in v['bestandshashes_bij_start']:
 for name in v['bestandshashes_bij_start'][key]:v['bestandshashes_bij_start'][key][name]=sha(P/'datasets'/key/(name+'.json'))
write(C/'controleversie.json',v)
summary=load(D/'validatieresultaten.json')
for row in summary:
 row['datasetversie']='0.3.1'
 if row['selectielijst']=='2017':row.update(records_met_open_bronvraag=0,afgehandelde_bronvragen=4,validatie=val,lege_aanvangsmomentvelden=sum(s['aanvangsmoment']['officiele_tekst'] is None for s in ss))
write(D/'validatieresultaten.json',summary)
# Extend existing schemas only for the new, explicit provenance fields.
sc=load(P/'schemas/selectiegegevens.schema.json');props=sc['items']['properties']['procestermijn']['properties'];props.update({'bron':{'type':'object'},'oorspronkelijke_pdf_cel':{'type':'null'},'generiek_resultaat_id':{'type':'string'},'onderbouwing':{'type':'string'}});write(P/'schemas/selectiegegevens.schema.json',sc)
for name in ['manifest','bronannotaties']:
 sc=load(P/'schemas'/(name+'.schema.json'))
 if name=='manifest':
  sc['properties']['aantallen']['properties']['afgehandelde_bronvragen']={'type':'integer'};sc['properties']['validatiestatus']['properties']['afgehandelde_bronvragen']={'type':'integer'}
 write(P/'schemas'/(name+'.schema.json'),sc)
for key in ['1996-2012','2017','2020']:
 b=P/'datasets'/key
 for name in ['manifest','selectiegegevens','bronannotaties']:jsonschema.Draft202012Validator(load(P/'schemas'/(name+'.schema.json'))).validate(load(b/(name+'.json')))
 for name,h in load(b/'manifest.json')['sha256'].items():assert sha(b/name)==h
for code in CODES:
 s=next(s for s in ss if s['code']==code);assert s['procestermijn']['officiele_tekst']=='Nihil' and s['officiele_bronrij']['procestermijn']==''
wb=openpyxl.load_workbook(C/'Controlewerkboek.xlsx');assert wb['Bronafwijkingen'].max_row==8 and wb['Afgehandeld2017'].max_row==5
write(D/'validatie-correctie-0.3.1.json',{'resultaat':'geslaagd','gecorrigeerde_codes':sorted(CODES),'waarde':'Nihil','bron':'officiele_XLS_en_generiek_resultaat_7.1','oorspronkelijke_pdf_cellen_behouden':True,'resterende_bronvragen':7,'schema_en_hashcontroles':'geslaagd'})
print('Vier procestermijnen gecorrigeerd; zeven bronvragen over; schema en hashes geslaagd.')
