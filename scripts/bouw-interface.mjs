import { build } from 'esbuild';
import { readFile, writeFile, cp, mkdir, rm } from 'node:fs/promises';
// Alleen de expliciete besluiten gaan mee; onderzoeksgegevens en broncellen niet.
const register=JSON.parse(await readFile('controle/concordans-inhoudelijke-beoordeling.json','utf8'));
const besluiten=register.beoordelingsbesluiten;
if(!Array.isArray(besluiten)||besluiten.length!==10||besluiten.some(b=>b.beoordelingsstatus!=='beoordelingsbesluit_vastgelegd'||b.relatie_inhoudelijk_goedgekeurd!==false))throw Error('Onvolledige of ongeldige besluitprojectie');
const besluitenPlugin={name:'concordans-besluiten',setup(plugin){
 plugin.onResolve({filter:/^#concordans-besluiten$/},()=>({path:'besluiten',namespace:'concordans-besluiten'}));
 plugin.onLoad({filter:/.*/,namespace:'concordans-besluiten'},()=>({contents:`export default ${JSON.stringify(besluiten)};`,loader:'js'}));
}};
await build({ entryPoints: ['src/zoeken/index.ts'], outfile: 'dist/zoeken/index.js', bundle: true, format: 'esm', platform: 'browser', target: 'es2022' });
await build({ entryPoints: ['src/begripszoeken/index.ts'], outfile: 'dist/begripszoeken/index.js', bundle: true, format: 'esm', platform: 'browser', target: 'es2022' });
for (const soort of ['zoeken', 'begripszoeken']) await build({ entryPoints: [`src/${soort}/oorspronkelijk.ts`], outfile: `dist/${soort}/oorspronkelijk.js`, bundle: true, format: 'esm', platform: 'browser', target: 'es2022' });
await build({ entryPoints: ['src/concordans/excel.ts'], outfile: 'dist/concordans/excel.js', bundle: true, format: 'esm', platform: 'browser', target: 'es2022', minify:true, legalComments:'eof' });
await build({ entryPoints: ['src/concordans/raadplegen.ts'], outfile: 'dist/concordans/raadplegen.js', bundle: true, format: 'esm', platform: 'browser', target: 'es2022' });
await build({ entryPoints: ['src/interface/vergelijking.ts'], outfile: 'dist/interface/vergelijking.js', bundle: true, format: 'esm', platform: 'browser', target: 'es2022' });
await build({ entryPoints: ['src/interface/kopieer.ts'], outfile: 'dist/interface/kopieer.js', bundle: true, format: 'esm', platform: 'browser', target: 'es2022' });
await build({ entryPoints: ['src/concordans/index.ts'], outfile: 'dist/concordans/index.js', plugins:[besluitenPlugin], bundle: true, format: 'esm', platform: 'browser', target: 'es2022' });
// De bronbestanden worden ongewijzigd in de statische publicatiemap gekopieerd.
await rm('dist/site', { recursive: true, force: true });
await mkdir('dist/site/interface', { recursive: true });
await build({
  entryPoints: ['src/interface/main.ts'],
  outfile: 'dist/site/interface/app.js',
  bundle: true, format: 'esm', platform: 'browser', target: 'es2022',
  external: ['../gegevenslaag/index.js','../concordans/excel.js'],
  plugins:[besluitenPlugin],
});
for (const [bron, doel] of [
  ['src/interface/index.html', 'dist/site/index.html'],
  ['src/interface/style.css', 'dist/site/interface/style.css'],
  ['dist/gegevenslaag', 'dist/site/gegevenslaag'],
  ['dist/concordans', 'dist/site/concordans'],
  ['datasets', 'dist/site/datasets'],
  ['bronnen', 'dist/site/bronnen'],
  ['HERGEBRUIK.md', 'dist/site/HERGEBRUIK.md'],
  ['documentatie/concordans-bronvermelding.md', 'dist/site/concordans-bronvermelding.md'],
  ['documentatie/privacy-publicatie.md', 'dist/site/privacy-publicatie.md'],
]) await cp(bron, doel, { recursive: true });

await writeFile('dist/site/concordans-excel-licenties.txt', 'write-excel-file 4.1.1\n'+await readFile('node_modules/write-excel-file/LICENSE','utf8')+'\n\nfflate\n'+await readFile('node_modules/fflate/LICENSE','utf8'));
