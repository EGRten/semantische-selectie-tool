"""Technisch herstel van de in de leidende 2012-PDF gebruikte glyphcodering.

Mapping visueel gecontroleerd op de glyphkaart; uitsluitend in-memory ToUnicode.
Geen PDF-bronbytes of normatieve tekst gereconstrueerd uit andere documenten.
"""
import fitz,re
# Visueel getoetst aan alle gebruikte glyphs uit de aangewezen PDF zelf.
GLYPHS={**{'g'+str(n):chr(n+29)for n in [3,9,10,11,12,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,34,*range(36,52),53,54,55,56,57,58,61,*range(68,94)]},'g112':'é','g115':'ë','g177':'–','g179':'“','g180':'”','g181':'‘','g182':'’'}
def decode(d):
 seen=set()
 for page in d:
  for x,ext,typ,base,name,enc,refer in page.get_fonts(full=True):
   if x in seen or 'Verdana'not in base:continue
   seen.add(x);obj=d.xref_object(x);ref=re.search(r'/Encoding (\d+) 0 R',obj)
   if not ref:continue
   diff=re.search(r'/Differences\s*\[([^]]+)\]',d.xref_object(int(ref[1])),re.S)
   if not diff:continue
   code=0;entries=[]
   for tok in re.findall(r'/[^\s\[\]]+|\d+',diff[1]):
    if tok.isdigit():code=int(tok)
    else:
     assert tok[1:]in GLYPHS,tok
     entries.append(f'<{code:02x}> <{ord(GLYPHS[tok[1:]]):04x}>');code+=1
   stream='/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def\n/CMapName /LeidendeBronGlyphs def\n/CMapType 2 def\n1 begincodespacerange\n<00> <FF>\nendcodespacerange\n'+str(len(entries))+' beginbfchar\n'+'\n'.join(entries)+'\nendbfchar\nendcmap\nCMapName currentdict /CMap defineresource pop\nend\nend'
   u=d.get_new_xref();d.update_object(u,'<<>>');d.update_stream(u,stream.encode());d.xref_set_key(x,'ToUnicode',str(u)+' 0 R')
 # Heropen zodat MuPDF zijn fontcache met de nieuwe, uitsluitend technische mapping opbouwt.
 return fitz.open(stream=d.tobytes(),filetype='pdf')
