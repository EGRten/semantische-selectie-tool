# Publicatieversie: oorspronkelijke bronopbouwlogica, geen zelfstandige openbare bronbundel.
# Gebruik scripts/bronopbouw_prive.py met een rechtmatig verkregen externe bronmap.
# Alleen deze wrapper kopieert dit script naar de verwachte private werkstructuur.
from pathlib import Path as _PublicPath
if __name__ == "__main__" and _PublicPath(__file__).parent.name == "bronopbouw":
    print("Dit is bronopbouwlogica. Gebruik: python scripts/bronopbouw_prive.py --help")
    raise SystemExit(0)
import fitz,re,json,pathlib,difflib,unicodedata,collections
R=pathlib.Path(__file__).resolve().parents[1];A=json.loads((R/'concordance-analysis.json').read_text());D=fitz.open(R/'bronnen/1996.pdf')
def n(s):return re.sub(r'[^a-z0-9]','',unicodedata.normalize('NFKD',str(s)).casefold())
spans=[];terms=[]
for pi in range(17,73):
 candidates=[]
 for bb in D[pi].get_text('dict')['blocks']:
  for ll in bb.get('lines',[]):
   for ss in ll['spans']:
    if ss['bbox'][0]>350 and re.match(r'^(B\s*$|\d+(?:[,.]\d+)? (?:jaar|maand|weken))',ss['text'].strip()):candidates.append(round(ss['bbox'][0]))
 right=min(candidates) if candidates else 429
 for b in D[pi].get_text('dict')['blocks']:
  for l in b.get('lines',[]):
   for s in l['spans']:
    x,y,x1,y1=s['bbox'];t=s['text'].strip()
    if not t or y>745:continue
    if 'Archieftoegangen' in t and x<150:
     x=222.48;t=t[t.index('Archieftoegangen'):]
    forced=(pi+1==33 and t=='4. Salarisadministratie') or (pi+1==36 and t=='3. Verkoop')
    if forced:t=re.sub(r'^\d+\.\s*','',t)
    z={'pagina':pi+1,'bbox':[x,y,x1,y1],'tekst':t}
    if forced or 150<x<right-2:spans.append(z)
    elif right-2<=x<560:terms.append(z)
def ordered(items):
 items.sort(key=lambda z:(z['pagina'],z['bbox'][1],z['bbox'][0]));groups=[]
 for z in items:
  if not groups or z['pagina']!=groups[-1][0]['pagina'] or abs(z['bbox'][1]-groups[-1][0]['bbox'][1])>1.3:groups.append([z])
  else:groups[-1].append(z)
 return [z for g in groups for z in sorted(g,key=lambda z:z['bbox'][0])]
spans=ordered(spans);terms=ordered(terms)
def stream(ss):
 st='';indices=[]
 for i,z in enumerate(ss):
  z['start']=len(st);t=n(z['tekst']);st+=t;indices.extend([i]*len(t));z['end']=len(st)
 return st,indices
st,ix=stream(spans);tt,ti=stream(terms)
def positions(h,q):
 start=0;ps=[]
 while True:
  p=h.find(q,start)
  if p<0:break
  
  if h is st:
   z=spans[ix[p]];prefix=h[z['start']:p]
   offsets={len(n(z['tekst'][:m.start()])) for m in re.finditer(r'\w+',z['tekst']) if not z['tekst'][:m.start()].rstrip().lower().endswith('niet-')}
   if p-z['start'] in offsets:ps.append(p)
  else:
   z=terms[ti[p]]
   if p==z['start'] and (q!='b' or n(z['tekst'])=='b'):ps.append(p)
  start=p+max(1,len(q))
 return ps
cursor=0;previous='';bad=[]
for r in A['records']:
 official_override={50:'Door en aan de gemeente verstrekte statistische opgaven voor zover zij niet van belang zijn',469:'Begraaf- en crematieregisters (inclusief overzicht van geruimde graven)'}
 qtext=official_override.get(r['rij'],r['omschrijving_concordans'])
 if r['rij']==380:qtext=re.sub(r'\[in deze concordans genummerd als p t/m w\]\s*','',qtext)
 r['omschrijving_brongecorrigeerd']=qtext
 q=n(qtext);ps=positions(st,q);forward=[p for p in ps if p>=cursor-2]
 if q==previous and ps:pos=min(ps,key=lambda p:abs(p-cursor))
 elif forward:pos=forward[0]
 elif ps:pos=min(ps,key=lambda p:abs(p-cursor))
 else:
  # use previous record's page and the next exact match to constrain fuzzy search
  target=spans[ix[min(cursor,len(ix)-1)]]['pagina'];win=[z for z in spans if target-1<=z['pagina']<=target+2];ws=''.join(n(z['tekst']) for z in win);matcher=difflib.SequenceMatcher(None,q,ws,autojunk=False);blocks=matcher.get_matching_blocks();score=sum(b.size for b in blocks)/len(q);big=max(blocks,key=lambda b:b.size);start=max(0,big.b-big.a);globalstart=win[0]['start'] if win else 0;pos=globalstart+start
  r['fuzzy_score']=round(score,4);r['primaire_match']='afwijkend';bad.append(r)
 startspan=spans[ix[min(pos,len(ix)-1)]];endpos=min(pos+len(q)-1,len(ix)-1);endspan=spans[ix[endpos]];r['beschrijving_bron']={'pagina':startspan['pagina'],'bbox':startspan['bbox'],'eindpagina':endspan['pagina'],'eindbbox':endspan['bbox']};r['primaire_tekst_segmenten']=[{k:z[k] for k in ['pagina','bbox','tekst']} for z in spans[ix[min(pos,len(ix)-1)]:ix[endpos]+1]];r.setdefault('primaire_match','exact_genormaliseerd')
 pg=startspan['pagina'];yy=startspan['bbox'][1];tq=n(r['termijn_concordans']);tps=positions(tt,tq);cands=[]
 for tp in tps:
  z=terms[ti[tp]]
  endi=ti[min(tp+len(tq)-1,len(ti)-1)]
  nextz=terms[endi+1] if endi+1<len(terms) else None
  if tp+len(tq)!=terms[endi]['end']:continue
  if nextz and nextz['pagina']==terms[endi]['pagina'] and nextz['bbox'][1]-terms[endi]['bbox'][1]<14 and not re.match(r'^(B$|\d|direct)',nextz['tekst'],re.I):continue
  dist=abs(z['pagina']-pg)*850+abs(z['bbox'][1]-yy);cands.append((dist,tp))
 if r['rij'] in [150,546,547,548,549,613]:
  cands=[(di,tp) for di,tp in cands if terms[ti[tp]]['pagina']==pg and terms[ti[tp]]['bbox'][1]>=yy]
 if cands:
  dist,tp=min(cands);tz=terms[ti[tp]];te=terms[ti[min(tp+len(tq)-1,len(ti)-1)]];r['termijn_match_afstand']=round(dist,2);r['termijn_bron']={'pagina':tz['pagina'],'bbox':tz['bbox'],'eindpagina':te['pagina'],'eindbbox':te['bbox']};r['termijn_match']='exact_genormaliseerd_nabij' if dist<18 else 'te_beoordelen';r['termijn_tekst_segmenten']=[{k:z[k] for k in ['pagina','bbox','tekst']} for z in terms[ti[tp]:ti[min(tp+len(tq)-1,len(ti)-1)]+1]]
 else:r['termijn_match']='niet_gevonden'
 cursor=pos;previous=q
(R/'verification1996.json').write_text(json.dumps(A,ensure_ascii=False,indent=2))
print('records',len(A['records']),'beschrijving-afwijkend',len(bad),'term-afwijkend',sum(r['termijn_match']!='exact_genormaliseerd_nabij' for r in A['records']))
for r in A['records']:
 if r['primaire_match']!='exact_genormaliseerd' or r['termijn_match']!='exact_genormaliseerd_nabij':print(r['rij'],r['rubriek'],r['beschrijving_bron']['pagina'],r['primaire_match'],r['termijn_match'],r.get('termijn_match_afstand'),str(r['omschrijving_concordans'])[:65],str(r['termijn_concordans'])[:35])
