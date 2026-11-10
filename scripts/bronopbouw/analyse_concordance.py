# Publicatieversie: oorspronkelijke bronopbouwlogica, geen zelfstandige openbare bronbundel.
# Gebruik scripts/bronopbouw_prive.py met een rechtmatig verkregen externe bronmap.
# Alleen deze wrapper kopieert dit script naar de verwachte private werkstructuur.
from pathlib import Path as _PublicPath
if __name__ == "__main__" and _PublicPath(__file__).parent.name == "bronopbouw":
    print("Dit is bronopbouwlogica. Gebruik: python scripts/bronopbouw_prive.py --help")
    raise SystemExit(0)
import openpyxl,fitz,re,json,difflib,pathlib,unicodedata
R=pathlib.Path(__file__).resolve().parents[1]
def n(s):return re.sub(r'[^a-z0-9]','',unicodedata.normalize('NFKD',str(s)).casefold())
w=openpyxl.load_workbook(R/'upload/Concordans Selectielijst 1996-2020(1).xlsx',data_only=True);s=w.active
orig={(c.row,c.column):c.value for row in s for c in row};v=orig.copy()
for rg in s.merged_cells.ranges:
 value=s.cell(rg.min_row,rg.min_col).value
 for row in range(rg.min_row,rg.max_row+1):
  for col in range(rg.min_col,rg.max_col+1):v[row,col]=value
section='2';rub=None;records=[];headers=[];seen=set();context=''
for row in range(3,706):
 a,b,c,d=[v.get((row,col)) for col in range(1,5)];oa,ob,oc,od=[orig.get((row,col)) for col in range(1,5)]
 if oa and str(oa).startswith('Hoofdstuk'):continue
 m=re.match(r'(3\.\d+)\s+(.+)',str(oa))
 if m:section=m[1];headers.append({'code':section,'name':m[2],'row':row});rub=None;context='';continue
 m=re.match(r'(\d+)\.\s+(.+)',str(a),re.S)
 if m:
  newrub=section+'.'+m[1]
  if newrub!=rub:rub=newrub;context='';headers.append({'code':rub,'name':m[2].replace('\n',' '),'row':row})
 if oc and not d:context=str(c);continue
 if d and not c and oa and rub:c=re.sub(r'^\d+\.\s*','',str(oa));b=None
 if d and c and rub:
  k=(rub,str(b),str(c),str(d))
  if k in seen:continue
  seen.add(k);records.append({'rubriek':rub,'subletter_concordans':b,'omschrijving_concordans':c,'termijn_concordans':d,'context_concordans':context,'rij':row})
D=fitz.open(R/'upload/Selectielijst 1996.pdf');pages=[]
for pi in range(17,73):
 p=D[pi];tx=p.get_text(clip=fitz.Rect(220,0,444,790),sort=True);pages.append((pi+1,tx,n(tx)))
for r in records:
 q=n(r['omschrijving_concordans']);scores=[]
 for pg,t,nt in pages:
  if q in nt:score=1.0
  else:
   matches=difflib.SequenceMatcher(None,q,nt,autojunk=False).get_matching_blocks();score=sum(m.size for m in matches)/max(1,len(q))
  scores.append((score,pg))
 scores.sort(reverse=True);score,pg=scores[0];r.update(matchscore=round(score,4),pagina=pg,alternatieve_paginas=[p for sc,p in scores[1:4] if sc>=score-.01])
path=R/'concordance-analysis.json';path.write_text(json.dumps({'headers':headers,'records':records},ensure_ascii=False,indent=2))
print('records',len(records),'headers',len(headers),'exact',sum(r['matchscore']==1 for r in records),'low',sum(r['matchscore']<.97 for r in records))
for r in records:
 if r['matchscore']<.97:print(r['rij'],r['rubriek'],r['matchscore'],r['pagina'],str(r['omschrijving_concordans'])[:100])
