#!/usr/bin/env python3
"""Controleer lokaal bron-Excel tegen rij-JSON; geen bronextractie naar publieke paden."""
import argparse
import hashlib
import json
from pathlib import Path
from zipfile import ZipFile
import xml.etree.ElementTree as ET

EXPECTED = '7dfda792ce61c1a6fa28c5c116155a429560153178c6c58987eabbbe6cdf708c'
NS = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

def kolom(ref):
    n = 0
    for c in ref:
        if c.isalpha(): n = n * 26 + ord(c.upper()) - 64
    return n

def controleer(excel, rijjson):
    digest = hashlib.sha256(excel.read_bytes()).hexdigest()
    if digest != EXPECTED: raise ValueError('Excel-hash wijkt af van geregistreerde oorspronkelijke bron')
    with ZipFile(excel) as z:
        if z.testzip(): raise ValueError('Beschadigde Excel-ZIP')
        boek = ET.fromstring(z.read('xl/workbook.xml'))
        sheets = boek.findall('s:sheets/s:sheet', NS)
        if len(sheets) != 1 or sheets[0].get('name') != 'Blad1': raise ValueError('Onverwachte werkbladindeling')
        strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            strings = [''.join(e.itertext()) for e in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('s:si', NS)]
        tree = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
        cellen = {}
        for c in tree.findall('.//s:sheetData/s:row/s:c', NS):
            if c.find('s:f', NS) is not None: raise ValueError('Formules vereisen afzonderlijke beoordeling')
            ref = c.get('r'); typ = c.get('t'); v = c.find('s:v', NS)
            if typ == 'inlineStr': value = ''.join(c.find('s:is', NS).itertext())
            elif v is None: value = None
            elif typ == 's': value = strings[int(v.text)]
            else: raise ValueError('Onverwachte niet-tekstcel')
            cellen[ref] = value
        expanded = dict(cellen)
        merges = tree.findall('s:mergeCells/s:mergeCell', NS)
        for m in merges:
            a, b = m.get('ref').split(':'); value = cellen.get(a)
            rowa = int(''.join(filter(str.isdigit, a))); rowb = int(''.join(filter(str.isdigit, b)))
            for r in range(rowa, rowb + 1):
                for c in range(kolom(a), kolom(b) + 1):
                    if c > 11: raise ValueError('Onverwachte kolom buiten A:K')
                    expanded[f'{chr(64+c)}{r}'] = value
        rows = json.loads(rijjson.read_text())
        bronrijen = {r['bron']['rij']: r for r in rows}
        nonempty = {int(''.join(filter(str.isdigit, k))) for k, v in cellen.items() if v is not None}
        verwacht = sorted(r for r in nonempty if r >= 3)
        if len(bronrijen) != len(rows) or sorted(bronrijen) != verwacht: raise ValueError('JSON is geen volledige rijspiegel van Excel')
        for rij, record in bronrijen.items():
            if record['bron'] != {'bron_id': 'concordans-aangeleverd', 'werkblad': 'Blad1', 'rij': rij}: raise ValueError('Onjuiste bronpositie')
            for veld, tabel in [('originele_cellen', cellen), ('samengevoegde_cellen_uitgevouwen', expanded)]:
                verwacht_cellen = [tabel.get(f'{chr(65+c)}{rij}') for c in range(11)]
                if record[veld] != verwacht_cellen: raise ValueError(f'Celafwijking bij {veld}, rij {rij}')
        return {'excel_sha256': digest, 'json_sha256': hashlib.sha256(rijjson.read_bytes()).hexdigest(),
                'werkbladen': ['Blad1'], 'gegevensrijen': len(rows), 'kolommen': 11, 'samengevoegde_bereiken': len(merges),
                'originele_cellen_gecontroleerd': len(rows)*11, 'uitgevouwen_cellen_gecontroleerd': len(rows)*11,
                'kolomkoppen': [[cellen.get(f'{chr(65+c)}{r}') for c in range(11)] for r in [1, 2]],
                'status': 'byte-identiteit_excel_en_volledige_celvergelijking_geslaagd'}

if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__); p.add_argument('--excel', type=Path, required=True); p.add_argument('--json', type=Path, required=True); p.add_argument('--output', type=Path, required=True)
    a = p.parse_args()
    # Uitvoer bevat kolomkoppen: ook die blijft expliciet buiten publieke projectpaden.
    root = Path(__file__).resolve().parents[1]
    out = a.output.resolve()
    if out.is_relative_to(root) and not out.is_relative_to(root / '.private-inputs'): p.error('Gebruik /tmp of .private-inputs voor lokale bronrapportage')
    result = controleer(a.excel, a.json); out.parent.mkdir(parents=True, exist_ok=True); out.write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps({k:v for k,v in result.items() if k != 'kolomkoppen'}, ensure_ascii=False))
