# Publicatieversie: oorspronkelijke bronopbouwlogica, geen zelfstandige openbare bronbundel.
# Gebruik scripts/bronopbouw_prive.py met een rechtmatig verkregen externe bronmap.
# Alleen deze wrapper kopieert dit script naar de verwachte private werkstructuur.
from pathlib import Path as _PublicPath
if __name__ == "__main__" and _PublicPath(__file__).parent.name == "bronopbouw":
    print("Dit is bronopbouwlogica. Gebruik: python scripts/bronopbouw_prive.py --help")
    raise SystemExit(0)
exec(open(__file__.replace('coverage1996.py','verify1996.py')).read().split('cursor=0;')[0])
A=json.loads((R/'verification1996.json').read_text());covered=set()
for r in A['records']:
 z=r.get('termijn_bron',{});covered.add((z.get('pagina'),round(z.get('bbox',[0,0])[1])))
values=[z for z in terms if re.match(r'^(B\s*$|\d+(?:[,.]\d+)?\s*(?:jaar|maanden|maand|weken)|direct)',z['tekst'],re.I)]
unc=[]
for z in values:
 if not any(pg==z['pagina'] and abs(y-z['bbox'][1])<2 for pg,y in covered):unc.append(z)
(R/'coverage1996.json').write_text(json.dumps({'primary_value_starts':values,'not_matched':unc},ensure_ascii=False,indent=2))
print('primarystarts',len(values),'unmatched',len(unc))
for z in unc:print(z['pagina'],round(z['bbox'][1],1),repr(z['tekst']))
