import fitz,json,re,pathlib,argparse,subprocess,hashlib
parser=argparse.ArgumentParser(description='Reproduceer de visueel beoordeelde 2020-bronvensters, zonder PDF-wijziging.');parser.add_argument('--bronmap',type=pathlib.Path,required=True);parser.add_argument('--output',type=pathlib.Path,required=True);args=parser.parse_args();args.output.mkdir(parents=True,exist_ok=True)
root=pathlib.Path(__file__).resolve().parents[1]
base='59add247289e3328a2f433ac6c26262d3db0f468'
for source in json.loads((root/'bronnen/semantische-selectie-tool-bronset-2026-11-25.json').read_text())['bronnen']:
 assert hashlib.sha256((args.bronmap/source['bestandsnaam']).read_bytes()).hexdigest()==source['sha256'],source['bestandsnaam']
from PIL import Image,ImageDraw
p={}
for name in ['structuur','selectiegegevens']:
 for r in json.loads(subprocess.check_output(['git','show',f'{base}:datasets/2020/{name}.json'],cwd=root)):
  for key in ['benaming','officiele_benaming','officiele_omschrijving','procesomschrijving','procesobject','resultaattype','toelichting','herkomst_waardering','taakvelden_brontekst']:
   if isinstance(r.get(key),str):
    for m in re.finditer(r'(?<!\w)([^\W\d_]+)-\s+([^\W\d_]+)(?!\w)',r[key]):p.setdefault(m[0],[]).append([name,r['id'],key,r['bron'],r[key]])
keep=['doorge','glad','woningbouw','wegen','certifi','ambulan','gevac','omzet','duur','verant','sta','Gehandicaptenpar','bedrijfshulp','BRP','buitentoepassingsver','vakan','sloop','strij','kinder','geluids','leeg','contractu','accom','waar','automatiseringspro','ingebruikge','garan','Samenwerkingsovereen','schenkings','loontoe','beslag','basisadmi','woning','beschikbaarge','ge','hoogwaar','aansprakelijk']
doc=fitz.open(args.bronmap/'Geactualiseerde Gemeentelijke Selectielijst 2020.pdf');out=[]
for first in keep:
 for key,rs in p.items():
  if not key.startswith(first+'-'):continue
  r=rs[0];page=doc[r[3]['pdf_pagina']-1];hits=page.search_for(first+'-', flags=fitz.TEXT_PRESERVE_WHITESPACE)
  hits=[h for h in hits if r[3]['bbox'][1]-4<h.y0<r[3]['bbox'][3]+4]
  if not hits: print('NOT FOUND',key);break
  h=hits[0];bounds=[29,54.3,95.5,210.5,325.5,374.7,408.9,438.2,456.2,504.2,535.8,567.1,624.4,656.2,773.3,1160]; left=max(x for x in bounds if x<=h.x0); right=min(x for x in bounds if x>h.x0); rect=fitz.Rect(left-2,h.y0-5,right+2,min(page.rect.height,h.y1+32));pix=page.get_pixmap(matrix=fitz.Matrix(3,3),clip=rect);im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
  tile=Image.new('RGB',(410,160),'white');ImageDraw.Draw(tile).text((5,3),f'{r[1]} p{page.number+1}: {key.replace(chr(10)," ")}',fill='black');tile.paste(im,(5,25));out.append(tile);break
for start in range(0,len(out),12):
 sheet=Image.new('RGB',(820,160*6),'#ddd')
 for i,t in enumerate(out[start:start+12]):sheet.paste(t,((i%2)*410,(i//2)*160))
 sheet.save(args.output/f'broncontrole-{start//12+1}.png')
print(len(out))
# Afzonderlijk: behouden BRP-koppelteken en twee bron-eigen taalvoorstellen.
items=[('2017','Gemeentelijke Selectielijst 2017.pdf','BRP-',33),('2017','Gemeentelijke Selectielijst 2017.pdf','voorvoor',26),('2020','Geactualiseerde Gemeentelijke Selectielijst 2020.pdf','verstekken',31)]
images=[]
for year,filename,term,page_number in items:
 source=fitz.open(args.bronmap/filename);page=source[page_number-1];hit=page.search_for(term,flags=fitz.TEXT_PRESERVE_WHITESPACE)[0]
 rect=fitz.Rect(max(0,hit.x0-40),hit.y0-10,min(page.rect.width,hit.x1+70),hit.y1+40)
 pix=page.get_pixmap(matrix=fitz.Matrix(3,3),clip=rect);im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
 tile=Image.new('RGB',(800,200),'white');ImageDraw.Draw(tile).text((4,2),f'{year} p{page_number} {term}',fill='black');tile.paste(im,(0,20));images.append(tile)
sheet=Image.new('RGB',(800,200*len(images)),'white')
for i,im in enumerate(images):sheet.paste(im,(0,i*200))
sheet.save(args.output/'broncontrole-extra.png')
