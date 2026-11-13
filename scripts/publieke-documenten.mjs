import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname,join} from 'node:path';
// Alleen deze publieke toelichtingen; geen volledige docs-/controle-/onderzoeksmap.
export const PUBLIEKE_DOCUMENTEN = [
 {bron:'HERGEBRUIK.md',doel:'HERGEBRUIK.md'},
 {bron:'LICENCE.md',doel:'LICENCE.md'},
 {bron:'LICENCE-CC-BY-4.0.md',doel:'LICENCE-CC-BY-4.0.md'},
 {bron:'docs/concordans-hergebruik.md',doel:'docs/concordans-hergebruik.md'},
 {bron:'documentatie/concordans-bronvermelding.md',doel:'concordans-bronvermelding.md',verplaatsteLink:true},
 {bron:'documentatie/privacy-publicatie.md',doel:'privacy-publicatie.md'},
];
export async function kopieerPubliekeDocumenten(root='dist/site'){
 for(const d of PUBLIEKE_DOCUMENTEN){
  let tekst=await readFile(d.bron,'utf8');
  if(d.verplaatsteLink){
   const van='](../HERGEBRUIK.md)';
   if(tekst.split(van).length!==2)throw Error('Controleer de relatieve bronvermeldingslink vóór publicatie');
   tekst=tekst.replace(van,'](./HERGEBRUIK.md)');
  }
  const doel=join(root,d.doel);await mkdir(dirname(doel),{recursive:true});await writeFile(doel,tekst);
 }
}
