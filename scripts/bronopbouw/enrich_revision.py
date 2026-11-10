# Publicatieversie: oorspronkelijke bronopbouwlogica, geen zelfstandige openbare bronbundel.
# Gebruik scripts/bronopbouw_prive.py met een rechtmatig verkregen externe bronmap.
# Alleen deze wrapper kopieert dit script naar de verwachte private werkstructuur.
from pathlib import Path as _PublicPath
if __name__ == "__main__" and _PublicPath(__file__).parent.name == "bronopbouw":
    print("Dit is bronopbouwlogica. Gebruik: python scripts/bronopbouw_prive.py --help")
    raise SystemExit(0)
import pathlib,json,re,csv
R=pathlib.Path(__file__).resolve().parents[1];P=R/'revisie'
def load(p):return json.loads(p.read_text())
def write(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
curation=[]
for key in ['1996-2012','2017','2020']:
 base=P/'datasets'/key;lex=load(base/'zoeklexicon.json');rels=load(base/'relaties.json');nodes=load(base/'structuur.json');sels=load(base/'selectiegegevens.json');ids={n['id'] for n in nodes}|{s['id'] for s in sels}
 def add(term,target,typ,kind,why,source,status='brononderbouwd_gecontroleerd',risk='Context blijft bepalend.'):
  if target not in ids:return None
  existing=next((z for z in lex if z['zoekterm']==term and z['onderdeel_id']==target and z['relatietype']==typ),None)
  if existing:return existing['id']
  id=key+':term:'+str(len(lex)+1).zfill(5)
  rec={'id':id,'zoekterm':term,'genormaliseerde_zoekterm':term.casefold(),'onderdeel_id':target,'relatietype':typ,'herkomsttype':kind,'onderbouwing':why,'betrouwbaarheid':'hoog_voor_zoekverband' if kind=='brononderbouwd_alternatief' else 'midden_voor_zoekrichting','beoordelingsstatus':status,'risico_op_verwarring':risk,'bron':source,'juridische_gelijkwaardigheid':False};lex.append(rec)
  rels.append({'id':key+':rel:'+str(len(rels)+1).zfill(5),'van':id,'van_type':'zoekterm','naar':target,'naar_type':'onderdeel','type':typ,'richting':'zoekterm_naar_onderdeel','herkomsttype':kind,'onderbouwing':why,'status':status,'bron':source,'juridische_gelijkwaardigheid':False});curation.append(rec);return id
 if key=='1996-2012':
  for target in ['2.7','3.6.2','3.9.1','3.16.1']:
   add('WABO',key+':'+target,'afkorting','brononderbouwd_alternatief','De bron schrijft Wet algemene bepalingen omgevingsrecht (WABO), p. 3. Zoekverband met vergunningrubrieken; geen gelijkstelling van vergunningsoorten.',{'bron_id':key+'-officieel','pdf_pagina':3})
   add('Wet algemene bepalingen omgevingsrecht',key+':'+target,'afkorting_voluit','brononderbouwd_alternatief','Voluit geschreven WABO volgens bron p. 3.',{'bron_id':key+'-officieel','pdf_pagina':3})
  add('metadata',key+':2.11','verwant_begrip','brononderbouwd_alternatief','Toelichting bij Gegevens over gegevens noemt metadata. Geen historische naamswijziging geclaimd.',{'bron_id':key+'-opgemaakt','pdf_pagina':23},risk='Metadata bij te bewaren en bij vernietigbare gegevens hebben verschillende waarderingen.')
  for t in ['Monumentenverordening','Erfgoedverordening']:
   add(t,key+':3.16.1','historische_benaming','brononderbouwd_alternatief','Bronregel luidt Monumentenverordening (sinds 2008 Erfgoedverordening). De tijdsafbakening blijft bij toepassing nodig.',{'bron_id':key+'-officieel','pdf_pagina':72},risk='Historische naamrelatie, geen onbeperkte juridische equivalentie.')
  source={'bron_id':key+'-officieel','pdf_pagina':68}
  add('Wvg',key+':3.14.3','verwant_begrip','brononderbouwd_alternatief','De bron noemt de Wet voorzieningen gehandicapten (Wvg), per 1 januari 2007 Wet maatschappelijke ondersteuning (Wmo). Opvolgende wettelijke kaders worden niet als exacte synoniemen behandeld.',source,risk='Historische wetsopvolging; toepasselijk tijdvak controleren.')
  add('Wmo',key+':3.14.3','afkorting','brononderbouwd_alternatief','De bron noemt Wet maatschappelijke ondersteuning (Wmo).',source)
  practices=[('notulen',['2.2'],'Verslaglegging van vergaderingen is een vindrichting; beleidsinhoud en herkomst bepalen de concrete regel.'),('personeelsdossier',['3.2.1'],'Zoekrichting naar verschillende voorschriften voor individuele personeelsleden; één dossier kan meerdere termijnen bevatten.'),('subsidiedossier',['2.20'],'Zoekrichting subsidievoorschriften; verlening en overige stukken niet gelijkstellen.'),('bouwvergunning',['3.6.2'],'Zoekrichting bouw, aanleg en gebruik; geen synoniem voor iedere omgevingsvergunning.'),('omgevingsvergunning',['3.6.2','3.9.1','3.16.1'],'Meerdere activiteitcontexten; een zoekterm bepaalt geen waardering.'),('contract',['2.17','3.3.4'],'Privaatrechtelijke regeling of gebruiksrelatie kan relevant zijn; context is nodig.')]
 else:
  # RI&E is explicitly expanded in the 2017 amendment, and occurs in the source for evaluation.
  if key=='2017':
   for t in ['RI&E','Risico-inventarisatie en -evaluatie']:
    add(t,key+':4.1.6','afkorting','brononderbouwd_alternatief','De wijzigingsbijlage bij 4.1.6 schrijft Risico-inventarisatie & -evaluatie (RI&E) voor.',{'bron_id':'2017-officieel','pdf_pagina':150})
  practices=[('notulen',['19'],'Zoekrichting verslaglegging; bestuurlijke en overige vergaderingen niet automatisch gelijk waarderen.'),('personeelsdossier',['17'],'Zoekrichting Personen aanstellen; documenten kunnen ook uit andere processen voortkomen.'),('subsidiedossier',['8','23'],'Verstrekken door de gemeente en aanvragen door de gemeente zijn verschillende procesrollen.'),('bouwvergunning',['11'],'Zoekrichting toestemming verlenen; niet ieder toestemmingsresultaat betreft bouw.'),('omgevingsvergunning',['11'],'Zoekrichting toestemming verlenen; geen exacte equivalentie met bouwvergunning.'),('contract',['16'],'Zoekrichting Overeenkomsten aangaan; nog geen resultaatkeuze.'),('OZB',['10'],'Voorgestelde praktijkingang naar Heffen; geen juridische termijn uit de afkorting afgeleid.')]
 for term,targets,why in practices:
  for code in targets:
   n=next((n for n in nodes if n['id']==key+':'+code),None)
   if n:add(term,n['id'],'praktijkformulering','ai_voorgesteld',why,n['bron'],status='voorstel_inhoudelijk_beoordeeld_zoekrichting',risk='Geen exact synoniem; menselijke selectie van proces en resultaat vereist.')
 for name,data in [('zoeklexicon',lex),('relaties',rels)]:
  write(base/(name+'.json'),data)
  with (base/(name+'.csv')).open('w',encoding='utf-8-sig',newline='') as f:
   w=csv.DictWriter(f,fieldnames=sorted(set().union(*(r.keys() for r in data))));w.writeheader();w.writerows({k:json.dumps(v,ensure_ascii=False) if isinstance(v,(dict,list)) else v for k,v in r.items()} for r in data)
write(P/'documentatie/zoekverrijking-beoordelingen.json',curation)
print('gerichte verrijkingen',len(curation))
