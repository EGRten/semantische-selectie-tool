# Publicatieversie: oorspronkelijke bronopbouwlogica, geen zelfstandige openbare bronbundel.
# Gebruik scripts/bronopbouw_prive.py met een rechtmatig verkregen externe bronmap.
# Alleen deze wrapper kopieert dit script naar de verwachte private werkstructuur.
from pathlib import Path as _PublicPath
if __name__ == "__main__" and _PublicPath(__file__).parent.name == "bronopbouw":
    print("Dit is bronopbouwlogica. Gebruik: python scripts/bronopbouw_prive.py --help")
    raise SystemExit(0)
import fitz,re,json,pathlib,unicodedata,collections
R=pathlib.Path(__file__).resolve().parents[1]
def norm(s):return re.sub(r'[^a-z0-9]','',unicodedata.normalize('NFKD',str(s or '')).casefold())
def extract(path,version):
 D=fitz.open(path);out=[];allcode=[]
 if version=='2020':
  cols=[('procestype',29,54.3),('procesnaam',54.3,95.5),('procesomschrijving',95.5,210.5),('procestoelichting',210.5,325.5),('procesobject',325.5,374.7),('generiek_specifiek',374.7,408.9),('resultaat',408.9,438.2),('code',438.2,456.2),('omschrijving',456.2,504.2),('herkomst',504.2,535.8),('waardering',535.8,567.1),('procestermijn',567.1,624.4),('bewaartermijn',624.4,656.2),('toelichting',656.2,773.3),('taakvelden',773.3,1160)];cx=438.8;mintop=55;bottom=805;first,last=25,69
 elif version=='2017-upload':
  cols=[('procestype',29,54.3),('procesnaam',54.3,95.5),('procesomschrijving',95.5,210.5),('procestoelichting',210.5,325.5),('procesobject',325.5,374.7),('code',374.7,392.6),('generiek_specifiek',392.6,426.9),('resultaat',426.9,456.2),('omschrijving',456.2,504.2),('herkomst',504.2,535.8),('waardering',535.8,567.1),('procestermijn',567.1,624.4),('bewaartermijn',624.4,656.2),('toelichting',656.2,773.3),('taakvelden',773.3,1160)];cx=375.2;mintop=55;bottom=805;first,last=26,66
 else:
  starts=[73,88.1,123.5,170.3,226.1,275.6,290,311.2,339.5,374.9,403.4,431.7,460,488.3,509.6,785]
  names=['procestype','procesnaam','procesomschrijving','procestoelichting','procesobject','code','generiek_specifiek','resultaat','omschrijving','herkomst','waardering','procestermijn','bewaartermijn','toelichting','taakvelden'];cols=list(zip(names,starts,starts[1:]));cx=276.1;mintop=65;bottom=529;first,last=26,47
 for pi,p in enumerate(D):
  if not first<=pi<=last:continue
  words=p.get_text('words');marks=sorted([w for w in words if abs(w[0]-cx)<1.1 and re.fullmatch(r'\d+\.\d+(?:\.\d+)?',w[4]) and w[1]>mintop],key=lambda w:w[1]);allcode.extend(w[4] for w in marks)
  if version=='2017-official':marks=sorted([w for w in words if 75<w[0]<84 and re.fullmatch(r'(?:[1-9]|[12]\d)',w[4]) and 65<w[1]<535],key=lambda w:w[1])
  lines=[]
  for b in p.get_text('rawdict')['blocks']:
   for l in b.get('lines',[]):
    chars=[c for s in l['spans'] for c in s['chars']];lines.append((l['bbox'][1],chars))
  for i,w in enumerate(marks):
   y0=w[1]-.6;y1=marks[i+1][1]-.6 if i+1<len(marks) else bottom;row={'pagina':pi+1,'bbox':[cols[0][1],round(y0,3),cols[-1][2],round(y1,3)]}
   for name,x0,x1 in cols:
    fr=[]
    for y,chars in lines:
     # character bounding boxes, unlike whole spans, respect merged text across columns
     cs=[c for c in chars if x0<=c['bbox'][0]<x1 and y0<=c['bbox'][1]<y1]
     if cs:fr.append((min(c['bbox'][1] for c in cs),min(c['bbox'][0] for c in cs),''.join(c['c'] for c in cs).strip()))
    fr.sort();row[name]='\n'.join(t for y,x,t in fr if t).replace('\xad','')
   if version=='2017-official':row['code']=re.sub(r'\s+','',row['code'])
   else:row['code']=w[4]
   out.append(row)
 return out
if __name__=='__main__':
 for version,path in [('2020','bronnen/2020.pdf'),('2017-upload','upload/Selectielijst 2017.pdf'),('2017-official','bronnen/2017.pdf')]:
  rows=extract(R/path,version);(R/('table-'+version+'.json')).write_text(json.dumps(rows,ensure_ascii=False,indent=2));print(version,len(rows),len(set(r['code'] for r in rows)))
