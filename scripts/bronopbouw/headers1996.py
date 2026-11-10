# Publicatieversie: oorspronkelijke bronopbouwlogica, geen zelfstandige openbare bronbundel.
# Gebruik scripts/bronopbouw_prive.py met een rechtmatig verkregen externe bronmap.
# Alleen deze wrapper kopieert dit script naar de verwachte private werkstructuur.
from pathlib import Path as _PublicPath
if __name__ == "__main__" and _PublicPath(__file__).parent.name == "bronopbouw":
    print("Dit is bronopbouwlogica. Gebruik: python scripts/bronopbouw_prive.py --help")
    raise SystemExit(0)
import fitz,json,re,pathlib,difflib,unicodedata
R=pathlib.Path(__file__).resolve().parents[1];A=json.loads((R/'concordance-analysis.json').read_text());D=fitz.open(R/'bronnen/1996.pdf')
def n(s):return re.sub(r'[^a-z0-9]','',unicodedata.normalize('NFKD',str(s)).casefold())
candidates=[]
for pi in range(17,73):
 p=D[pi];sp=[s for b in p.get_text('dict')['blocks'] for l in b.get('lines',[]) for s in l['spans'] if s['text'].strip() and s['bbox'][0]<240];sp.sort(key=lambda s:(s['bbox'][1],s['bbox'][0]))
 for j,s in enumerate(sp):
  x,y=s['bbox'][:2];m=re.match(r'^(\d+(?:\.\d+)?)\.?(?:\s+)(.*)',s['text'].strip())
  if m and x<150 and y<745:
   following=[z for z in sp[j+1:] if z['bbox'][1]-y<100 and z['bbox'][0]<226 and not re.match(r'^\d+\.',z['text'].strip())]
   t=m[2]+' '+' '.join(z['text'].strip() for z in following);candidates.append({'nummer':m[1],'pagina':pi+1,'bbox':list(s['bbox']),'naam':t,'eerste_regel':s['text']})
last=-1;bad=[]
for h in A['headers']:
 num=h['code'] if h['code'].count('.')==1 and h['code'].startswith('3.') else h['code'].split('.')[-1];q=n(h['name']);opts=[]
 for i,z in enumerate(candidates):
  if i<=last or z['nummer']!=num:continue
  t=n(z['naam']);score=difflib.SequenceMatcher(None,q,t[:len(q)],autojunk=False).ratio();opts.append((score,-i,i,z))
 if not opts:bad.append(h);continue
 score,_,i,z=max(opts);last=i;h['bron']={'bron_id':'1996-2012-officieel','pdf_pagina':z['pagina'],'bbox':z['bbox']};h['score']=round(score,3);h['primaire_kopregel']=z['eerste_regel']
 if score<.9:print('LOW',h['code'],h['name'],z['pagina'],z['eerste_regel'],score)
print('HEADERS',len(A['headers']),'missing',bad)
(R/'headers1996.json').write_text(json.dumps(A['headers'],ensure_ascii=False,indent=2))
