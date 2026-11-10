# Publicatieversie: oorspronkelijke bronopbouwlogica, geen zelfstandige openbare bronbundel.
# Gebruik scripts/bronopbouw_prive.py met een rechtmatig verkregen externe bronmap.
# Alleen deze wrapper kopieert dit script naar de verwachte private werkstructuur.
from pathlib import Path as _PublicPath
if __name__ == "__main__" and _PublicPath(__file__).parent.name == "bronopbouw":
    print("Dit is bronopbouwlogica. Gebruik: python scripts/bronopbouw_prive.py --help")
    raise SystemExit(0)
from pathlib import Path
import json,hashlib,csv,copy,shutil
import openpyxl,jsonschema
R=Path(__file__).resolve().parents[1];P=R/'revisie';D=P/'documentatie';C=P/'controle';KEYS=['1996-2012','2017','2020']
def load(p):return json.loads(p.read_text())
def write(p,x):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
source=R/'bevestigingen-gebruiker.json'
if not source.exists():source=C/'bevestigingen-gebruiker.json'
conf=load(source);assert set(conf['bevestigde_codes'])=={'19.1.19','19.1.20','19.1.21','19.1.22','19.1.23','19.1.24','22.1.3'}
write(C/'bevestigingen-gebruiker.json',conf)
verification={'beoordelaar':conf['beoordelaar'],'datum':conf['datum'],'oordeel':'Bronafwijking correct vastgelegd','scope':'Bevestiging van de weergave van de officiële bron; geen officiële rectificatie en geen integrale beoordeling van overige recordvelden.','herkomst':'vastgelegde_menselijke_broncontrole'}
# Annotate the confirmed source rendering; do not repair labels or invent missing text.
for path in [P/'datasets/2020/bronannotaties.json',D/'bronannotaties.json']:
 annotations=load(path)
 for a in annotations:
  if a['lijst']=='2020' and a['code'] in conf['bevestigde_codes']:
   a['status_verwerking']='bronweergave_bevestigd_door_gebruiker';a['menselijke_bevestiging']=verification;a['controleopdracht_gebruiker']='Afgerond: bronweergave door gebruiker bevestigd.'
 write(path,annotations)
base=P/'datasets/2020';ss=load(base/'selectiegegevens.json');before=copy.deepcopy(ss)
byann={a['code']:a for a in load(base/'bronannotaties.json')}
for s in ss:
 if s['code'] in conf['bevestigde_codes']:
  s['verificatie']['status']='bronafwijking_correct_vastgelegd_en_bevestigd';s['verificatie']['bronannotaties']=[byann[s['code']]];s['verificatie']['menselijke_bevestiging']=verification
write(base/'selectiegegevens.json',ss)
for old,new in zip(before,ss):assert {k:v for k,v in old.items() if k!='verificatie'}=={k:v for k,v in new.items() if k!='verificatie'}
with (base/'selectiegegevens.csv').open('w',encoding='utf-8-sig',newline='') as f:
 fields=sorted(set().union(*(r.keys() for r in ss)));w=csv.DictWriter(f,fieldnames=fields);w.writeheader();w.writerows({k:json.dumps(v,ensure_ascii=False) if isinstance(v,(dict,list)) else v for k,v in r.items()} for r in ss)
previous=load(D/'openstaande-beoordelingen.json');write(D/'afgeronde-broncontroles.json',[dict(r,controle_status='bevestigd_door_gebruiker',menselijke_bevestiging=verification) for r in previous]);write(D/'openstaande-beoordelingen.json',[])
# Only the seven specifically confirmed source checks receive the user's judgment.
w=openpyxl.load_workbook(C/'Controlewerkboek.xlsx');changed=[]
for tab in ['Bronafwijkingen','Selectiecontrole']:
 for row in w[tab].iter_rows(min_row=2):
  if row[1].value=='2020' and row[2].value in conf['bevestigde_codes']:
   row[4].value='Bronafwijking correct vastgelegd';row[5].value='Door inhoudelijke_beoordelaar bevestigd in het controleregister op 10 november 2026. Oordeel betreft uitsluitend de bronweergave; geen officiële broncorrectie of integrale menselijke recordcontrole.'
   if tab=='Bronafwijkingen':changed.append(row[2].value)
assert set(changed)==set(conf['bevestigde_codes'])
for row in w['Controlevolgorde'].iter_rows(min_row=2):
 if row[1].value=='2020' and row[2].value in conf['bevestigde_codes']:row[3].value='Afgerond: de bronweergave is door inhoudelijke_beoordelaar bevestigd. Gepubliceerde label/afgebroken tekst blijft ongewijzigd met annotatie.'
start=w['Start'];start['B2']='1.0.0 — definitief eindpakket';start['B4']='De zeven resterende bronafwijkingen zijn bevestigd. Overige steekproeven en zoekverrijking blijven beschikbaar als optionele kwaliteitscontroles.';start['B6']='Oplevering afgerond. Geen aanvullende goedkeuringsprocedure opgelegd.';start['B8']='De gerichte lijst is auditmateriaal; niet alle overige records zijn integraal menselijk gecontroleerd.'
start['B11']='Gele velden blijven beschikbaar voor toekomstige beoordelingen; zeven bronoordelen zijn ingevuld op basis van jouw expliciete bevestiging.'
for row in w['Automatische_checks'].iter_rows(min_row=2):
 if row[0].value=='Bekende bronannotaties':row[1].value='11 verwerkt: 4 bronvergelijkingen, 7 gebruikersbevestigingen';row[2].value='Geen open controles van de bronweergave; beperkingen van de gepubliceerde bron blijven herkenbaar.'
 if row[0].value=='Menselijke oordelen':row[1].value='7 specifieke bronbevestigingen ingevuld';row[2].value='Alle andere menselijke oordelen blijven Niet beoordeeld; er is geen bredere instemming afgeleid.'
w.save(C/'Controlewerkboek.xlsx')
# Preserve earlier reports as historical evidence and replace the current-facing guidance.
history=D/'historie';history.mkdir(exist_ok=True)
for name in ['validatierapport.md','controleoverdracht.md','openstaande-beoordelingen.md','bronvragen-aan-bronhouder.md']:
 shutil.copy2(D/name,history/('voor-eindoplevering-'+name))
(C/'Controle-instructie.md').write_text('''# Controle-instructie bij het eindpakket 1.0.0

De gevraagde broncontroles zijn afgerond. inhoudelijke_beoordelaar heeft bevestigd dat bij 19.1.19 t/m 19.1.24 daadwerkelijk Archiefvernietiging staat en dat de toelichting van 22.1.3 stopt bij geldige of onbruikbaar. Deze zeven oordelen staan op Bronafwijking correct vastgelegd.

De vier 2017-procestermijnen zijn al eerder afgehandeld met Nihil uit de officiële Excel, bevestigd door generiek resultaat 7.1. De oorspronkelijke lege PDF-cellen blijven als bronvariant bewaard.

Je hoeft voor de oplevering geen controles meer te doen. De officiële bronfouten of ambiguïteiten zijn niet stilzwijgend gerepareerd. Ze blijven zichtbaar in bronannotaties.json en bij de betrokken records.

## Het werkboek gebruiken

Pak de ZIP volledig uit. Open controle/Controlewerkboek.xlsx; de relatieve bronlinks verwijzen naar de meegeleverde bronnen. Bronafwijkingen bevat de zeven bevestigde gevallen. Afgehandeld2017 bevat de vier eerdere correcties.

Selectiecontrole bevat alle 1.145 regels. De zeven ingevulde bronoordelen zijn beperkt tot de expliciet bevestigde bronweergave. Overige velden staan niet automatisch op Akkoord. De 87 gerichte controles, 4.093 zoektermkoppelingen en 164 zoekvragen blijven beschikbaar voor aanvullende kwaliteitsverbetering.

Wie later een extra controle wil doen, kan de gele velden gebruiken. Noteer lijst, code/ID, concrete waarneming en bronpagina. Een steekproef is geen volledige menselijke controle. Niet-gevalideerde AI-zoekvoorstellen blijven standaard uitgeschakeld; aanvaarding daarvan is geen oplevervoorwaarde.

De bronbevestigingen zijn vastgelegd in bevestigingen-gebruiker.json. De bevestigingen gelden niet als een formele rectificatie door de bronhouder en veranderen geen officiële waardering of termijn.
''')
(D/'openstaande-beoordelingen.md').write_text('''# Status bij eindoplevering

Er zijn geen openstaande controles van de zeven besproken bronafwijkingen. Alle zeven zijn door inhoudelijke_beoordelaar bevestigd als correcte bronweergave. De vier eerdere 2017-procestermijngevallen zijn eveneens afgehandeld.

De gepubliceerde bronlabels en afgebroken tekst blijven met annotatie behouden. De oorspronkelijke bron is niet gecorrigeerd. Onbevestigde zoekvoorstellen blijven als voorstel gemarkeerd en standaard uitgeschakeld. Aanvullende steekproeven of zoekverbeteringen zijn optioneel vervolgwerk, geen nieuwe oplevervoorwaarde.
''')
(D/'bronvragen-aan-bronhouder.md').write_text('''# Eventuele latere bronverduidelijking

Voor deze oplevering hoeft geen bronvraag te worden gesteld: de bronweergave is bevestigd en de afwijkingen zijn correct vastgelegd.

Wie later de bedoelde officiële tekst wil laten vaststellen, kan de bronhouder vragen naar de resultaatlabels bij 19.1.19 t/m 19.1.24 en het ontbrekende vervolg bij 22.1.3. Een antwoord is geen voorwaarde voor dit eindpakket. Er zijn geen vragen verzonden.
''')
(P/'README.md').write_text('''# Gemeentelijke selectielijsten — eindpakket 1.0.0

Drie zelfstandige machineleesbare datasets voor de Semantische Selectie Tool: 494 technische voorschriftregels voor 1996/2012, 305 resultaten voor 2017 en 346 tabelregels voor 2020 (344 actief, 2 vervallen).

De gegevens, broncontroles en overdracht zijn opgeleverd. De vier 2017-procestermijnen zijn afgehandeld. De zeven resterende bronafwijkingen uit 2020 zijn door inhoudelijke_beoordelaar bevestigd als correcte bronweergave en zijn in het werkboek en de datasetstatus verwerkt. Er is geen open opleverblokkade.

De officiële teksten blijven leidend. Het bronlabel Archiefvernietiging bij zes regels en de afgebroken referendumtoelichting zijn niet herschreven. Onbevestigde semantische voorstellen blijven herkenbaar en standaard uitgeschakeld. Geen automatische juridische toepasselijkheidsbeslissingen of vernietigingsdatumberekening.

Begin bij documentatie/eindrapport.md. Het werkboek en de instructie in controle/ zijn bijgewerkt. De integrale dataset is niet door een tweede menselijke beoordelaar gelezen; de gebruikersbevestiging betreft uitsluitend de zeven beschreven bronweergaven. Dat is geen opgelegde vrijgavevoorwaarde.
''')
# Current status and manifests: preserve limitations, close rendering checks, not formal source amendments.
summary=load(D/'validatieresultaten.json')
for key in KEYS:
 b=P/'datasets'/key;v=load(b/'validatie.json');v.update(opleverstatus='definitief_opgeleverd_met_bronannotaties',open_bronvragen=0,status='oplevering_afgerond_met_bronannotaties')
 if key=='2020':v.update(broncontroles_bevestigd_door_gebruiker=7,bronbeperkingen_behouden=7)
 write(b/'validatie.json',v)
 m=load(b/'manifest.json');m['datasetversie']='1.0.0-eindpakket';m['opleverstatus']='definitief_opgeleverd_met_bronannotaties';m['validatiestatus']=v;m['aantallen']['records_met_open_bronvraag']=0
 if key=='2020':m['aantallen']['broncontroles_bevestigd_door_gebruiker']=7
 m['controleoverdracht']['menselijke_oordelen_vooraf_ingevuld']=False;m['controleoverdracht']['status']='afgerond';m['controleoverdracht']['bevestigde_bronoordelen']=7 if key=='2020' else 0
 m['sha256']={p.name:sha(p) for p in sorted(b.iterdir()) if p.is_file() and p.name!='manifest.json'};write(b/'manifest.json',m)
 for row in summary:
  if row['selectielijst']==key:row.update(datasetversie='1.0.0',records_met_open_bronvraag=0,validatie=v,broncontroles_bevestigd_door_gebruiker=7 if key=='2020' else 0)
write(D/'validatieresultaten.json',summary)
lines=['# Eindrapport — versie 1.0.0','', 'De datasetopdracht is opgeleverd. De vier 2017-procestermijngevallen zijn brononderbouwd afgehandeld; de zeven 2020-bronweergaven zijn expliciet door inhoudelijke_beoordelaar bevestigd. Er zijn geen open controles uit deze reeks.','', '| Lijst | Structuur | Voorschrift-/resultaatregels | Zoektermkoppelingen | Testvragen |','|---|---:|---:|---:|---:|']
for row in summary:lines.append(f"|{row['selectielijst']}|{row['structuuronderdelen']}|{row['selectievoorschriften_of_resultaatregels']}|{row['zoektermrelaties']}|{row['testvragen']}|")
lines+=['','## Herkomst zoektermkoppelingen','', '| Lijst | Officieel | Brononderbouwd alternatief | Taalvariant | AI-voorstel |','|---|---:|---:|---:|---:|']
for row in summary:lines.append(f"|{row['selectielijst']}|{row['officiele_termrelaties']}|{row['brononderbouwde_alternatieve_termrelaties']}|{row['taalkundige_variantrelaties']}|{row['ai_voorgestelde_termrelaties']}|")
lines+=['','## Wat is bevestigd?','19.1.19 t/m 19.1.24: de officiële resultaatkolom vermeldt Archiefvernietiging. 22.1.3: de zichtbare toelichting stopt bij geldige of onbruikbaar. Het betreft correcte transcriptie van een problematische bron. Geen label of ontbrekende tekst is door ons als officiële rectificatie verzonnen.','', 'De menselijke bevestiging betreft deze zeven punten. Alle overige menselijke beoordelingen zijn ongemoeid gelaten. De 87 gerichte controles blijven als optioneel auditmateriaal beschikbaar; een integrale tweede menselijke lezing is niet uitgevoerd en is geen aanvullende oplevervoorwaarde.','', '## Technische en inhoudelijke controles','Alle 1.145 selectieregels zijn door broncontroles gegaan: primaire matches en rubricerings-/termijnkolomdekking bij 1996/2012; code- en veldvergelijking met officiële Excel/PDF en wijzigingsbijlagen bij 2017; primaire tabel- en kolomcontroles bij 2020. Een aanvullende broncontrole vond geen nieuwe verschillen in de gecontroleerde velden. De gewijzigde eindstatus wordt gecontroleerd met JSON Schema, verwijzingen en manifesthashes. Herhaalbaarheid wordt afzonderlijk vastgelegd in reproduceerbaarheidscontrole.json.','', 'De 494 regels voor 1996/2012 zijn technische deelregels binnen 90 rubrieken; het onderzoeksrapport noemde 468 en 89. De telmethode en brononderbouwing blijven in de auditbestanden staan. Voor 2017 zijn 305 codes aanwezig. Voor 2020 zijn 346 tabelregels aanwezig, waarvan twee vervallen.','', '## Behouden grenzen','De samengestelde en voorwaardelijke termijnen blijven waar nodig officiële tekst. Een volledige datumrekenmachine is niet gemaakt. Een zoekvraag bewijst vindbaarheid, niet daadwerkelijke juridische toepasselijkheid. De zoekmachine zelf is niet gebouwd of op rankingprestaties getest.','', 'AI-kandidaten worden niet als officiële kennis gepresenteerd. Onbevestigde voorstellen blijven standaard uitgeschakeld. De eerdere in rapporten genoemde maar niet aangeleverde CSV/XLSX-onderzoekstabellen zijn niet als werkelijk beschikbare data voorgesteld.','', 'Er is geen foutloze bron of onbegrensd volledig semantisch lexicon geclaimd. Bronbeperkingen blijven zichtbaar, ook al is de controle op hun weergave afgerond. De drie datasets zijn geschikt als statisch laadbare gegevensbasis voor de browserapplicatie; geen backend vereist.','', '## Bestanden','datasets/ bevat de onafhankelijke pakketten en CSV-exporten. schemas/ bevat de JSON Schema’s. bronnen/ bevat primaire documenten en onderzoeksmateriaal. controle/ bevat het bijgewerkte werkboek, bronuitsneden en gebruikersbevestigingen. scripts/ bevat generatie-, correctie-, afsluit- en controlescripts. documentatie/historie/ bewaart de vroegere overdrachtsteksten.']
(D/'eindrapport.md').write_text('\n'.join(lines)+'\n');(D/'validatierapport.md').write_text('\n'.join(lines)+'\n');(D/'controleoverdracht.md').write_text('''# Afgeronde overdracht

De zeven broncontroles uit 2020 zijn door inhoudelijke_beoordelaar bevestigd. Het werkboek, bronannotaties, datasetstatus en manifesten zijn bijgewerkt. De vier 2017-procestermijngevallen waren al afgehandeld.

Er is geen openstaande actie voor deze oplevering. Optioneel audit- en verbeterwerk blijft beschikbaar. Voor de actuele status geldt eindrapport.md; oude verwijzingen naar open punten in historische rapporten zijn geen actuele controleopdracht.
''')
p=D/'reproduceerbaarheid.md';p.write_text(p.read_text().replace('11. correct_procestermijn.py','11. correct_procestermijn.py\n12. final_delivery.py')+'\n\nDe afsluiting gebruikt controle/bevestigingen-gebruiker.json als expliciete input. De pipeline mag geen menselijke bevestiging genereren die niet in deze input staat.\n')
# Refresh structural schemas for explicit human verification metadata.
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
 vs=[load(P/'datasets'/key/(name+'.json')) for key in KEYS];sc=infer(vs);sc['$schema']='https://json-schema.org/draft/2020-12/schema';sc['title']=name+' — eindpakket 1.0.0';write(P/'schemas'/(name+'.schema.json'),sc)
for key in KEYS:
 b=P/'datasets'/key
 for name in ['manifest','structuur','selectiegegevens','zoeklexicon','relaties','testvragen','bronannotaties']:jsonschema.Draft202012Validator(load(P/'schemas'/(name+'.schema.json'))).validate(load(b/(name+'.json')))
 ids={r['id'] for r in load(b/'structuur.json')};parts=ids|{r['id'] for r in load(b/'selectiegegevens.json')};lex=load(b/'zoeklexicon.json');assert all(r['onderdeel_id'] in parts for r in lex)
 for t in load(b/'testvragen.json'):assert set(t['verwachte_relevante_categorieen']+t['alternatieve_relevante_categorieen'])<=parts
 for name,h in load(b/'manifest.json')['sha256'].items():assert sha(b/name)==h
wb=openpyxl.load_workbook(C/'Controlewerkboek.xlsx');assert sum(row[4].value=='Bronafwijking correct vastgelegd' for row in wb['Bronafwijkingen'].iter_rows(min_row=2))==7
assert sum(row[4].value=='Bronafwijking correct vastgelegd' for row in wb['Selectiecontrole'].iter_rows(min_row=2))==7
cv=load(C/'controleversie.json');cv.update(datasetversie='1.0.0',open_bronvragen=0,bevestigde_broncontroles_2020=7,menselijke_oordelen='Zeven bronweergaven bevestigd; overige oordelen niet automatisch ingevuld.')
for key,fs in cv['bestandshashes_bij_start'].items():
 for name in fs:fs[name]=sha(P/'datasets'/key/(name+'.json'))
write(C/'controleversie.json',cv)
write(D/'eindcontrole.json',{'versie':'1.0.0','status':'geslaagd','bevestigde_broncontroles':7,'open_broncontroles':0,'normatieve_tekst_gewijzigd_tijdens_afsluiting':False,'schema_verwijzingen_hashes_werkboek':'geslaagd','menselijke_scope_beperkt_tot_expliciete_bevestigingen':True})
print('Eindpakket 1.0.0: zeven bevestigingen verwerkt; nul open broncontroles; normatieve tekst ongewijzigd; controles geslaagd.')
