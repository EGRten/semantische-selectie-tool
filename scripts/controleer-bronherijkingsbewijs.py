#!/usr/bin/env python3
"""Aanvullende controles; alleen JSON-bewijs naar expliciete uitvoermap, nooit bronbytes wijzigen."""
from pathlib import Path
import argparse,hashlib,json
import fitz,openpyxl
from bronherijking_pdf import decode
R=Path(__file__).resolve().parents[1]
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--bronmap',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--concordans-excel',type=Path);a=p.parse_args();a.output.mkdir(parents=True,exist_ok=True)
 def save(name,obj):(a.output/name).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
 manifest=json.loads((R/'bronnen/semantische-selectie-tool-bronset-2026-11-25.json').read_text())
 for s in manifest['bronnen']:assert hashlib.sha256((a.bronmap/s['bestandsnaam']).read_bytes()).hexdigest()==s['sha256']
 source=next(s for s in manifest['bronnen']if s['lijst']=='1996-2012');path=a.bronmap/source['bestandsnaam'];original=fitz.open(path);decoded=decode(fitz.open(path));proof=[]
 for i,(old,new)in enumerate(zip(original,decoded),1):
  before=hashlib.sha256(old.get_pixmap(colorspace=fitz.csGRAY).samples).hexdigest();after=hashlib.sha256(new.get_pixmap(colorspace=fitz.csGRAY).samples).hexdigest();assert before==after,('Visuele wijziging na ToUnicode',i)
  proof.append({'pdf_pagina':i,'rendering_voor_sha256':before,'rendering_na_sha256':after,'identiek':True})
 save('glyph-rendercontrole.json',{'methode':'PyMuPDF 1.26.6, 72 dpi grijs, identieke pixelbytes vóór/na uitsluitend ToUnicode-mapping','alle_120_paginas_identiek':True,'paginas':proof})
 if a.concordans_excel:
  f=a.concordans_excel;b=f.read_bytes();sha=hashlib.sha256(b).hexdigest();assert sha=='7dfda792ce61c1a6fa28c5c116155a429560153178c6c58987eabbbe6cdf708c'
  w=openpyxl.load_workbook(f,data_only=False);sheet=w['Blad1'];data=json.loads((R/'publicatie/concordans.json').read_text());assert len(data['rijen'])==716;expanded={}
  for region in sheet.merged_cells.ranges:
   for row in range(region.min_row,region.max_row+1):
    for col in range(region.min_col,region.max_col+1):expanded[row,col]=sheet.cell(region.min_row,region.min_col).value
  for r in data['rijen']:
   n=r['bronrij'];values=[sheet.cell(n,k).value for k in range(1,12)];assert values==r['waarden'];context={c['kolom']:c['tekst']for c in r.get('context',[])}
   for k in range(11):assert context.get(k,values[k])==expanded.get((n,k+1),values[k])
  assert hashlib.sha256(f.read_bytes()).hexdigest()==sha
  save('concordans-excelcontrole.json',{'bronbestand':'oorspronkelijke concordanswerkmap uit eerder controlepakket; niet als normbron voor selectiegegevens gebruikt','sha256':sha,'werkblad':'Blad1','bronrijen':716,'oorspronkelijke_cellen_geverifieerd':7876,'mergecontext_cellen_geverifieerd':7876,'bronbytes_ongewijzigd':True,'status':'geslaagd'})
 print('Pixelcontrole volledige 2012-PDF geslaagd; eventuele opgegeven concordanswerkmap volledig op broncellen en mergecontext gecontroleerd.')
if __name__=='__main__':main()
