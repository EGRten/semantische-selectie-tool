"""Onafhankelijke XLSX-terugleescontrole; geen uitvoerbestand of extra dependency."""
import json
import re
import sys
import xml.etree.ElementTree as ET
from zipfile import ZipFile

NS = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}

def lees(pad):
    with ZipFile(pad) as z:
        if z.testzip(): raise ValueError('Beschadigde XLSX-ZIP')
        strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            strings = [re.sub(r'_x([0-9a-fA-F]{4})_', lambda m: chr(int(m[1], 16)), ''.join(e.itertext())) for e in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('s:si', NS)]
        boek = ET.fromstring(z.read('xl/workbook.xml'))
        rels = {e.get('Id'): e.get('Target') for e in ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))}
        sheets = []
        for s in boek.findall('s:sheets/s:sheet', NS):
            target = rels[s.get('{'+NS['r']+'}id')]
            target = target.lstrip('/') if target.startswith('/') else 'xl/'+target
            root = ET.fromstring(z.read(target))
            data = []
            for r in root.findall('s:sheetData/s:row', NS):
                row = []
                for c in r.findall('s:c', NS):
                    if c.find('s:f', NS) is not None: raise ValueError('Onbedoelde formule')
                    n = 0
                    for letter in c.get('r'):
                        if letter.isalpha(): n = n*26+ord(letter.upper())-64
                    while len(row) < n: row.append(None)
                    v = c.find('s:v', NS)
                    if c.get('t') == 's': value = strings[int(v.text)]
                    elif c.get('t') == 'inlineStr': value = re.sub(r'_x([0-9a-fA-F]{4})_', lambda m: chr(int(m[1], 16)), ''.join(c.find('s:is', NS).itertext()))
                    else: value = None if v is None else v.text
                    row[n-1] = value
                data.append(row)
            filt = root.find('s:autoFilter', NS)
            pane = root.find('s:sheetViews/s:sheetView/s:pane', NS)
            sheets.append({'naam': s.get('name'), 'rijen': data, 'autofilter': None if filt is None else filt.get('ref'),
                           'elementvolgorde': [e.tag.split('}')[-1] for e in root],
                           'freeze': None if pane is None else pane.attrib, 'merges': len(root.findall('s:mergeCells/s:mergeCell', NS))})
        return {'werkbladen': sheets, 'metadata': [n for n in z.namelist() if n.startswith('docProps/')],
                'macros': any(n.endswith('.bin') for n in z.namelist()),
                'externe_links': any('externalLinks/' in n for n in z.namelist())}

if __name__ == '__main__':
    print(json.dumps(lees(sys.argv[1]), ensure_ascii=False))
