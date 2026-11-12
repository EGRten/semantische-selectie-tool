import {Ajv2020} from 'ajv/dist/2020.js';
import standaloneCode from 'ajv/dist/standalone/index.js';
import { build } from 'esbuild';
import { readFile, writeFile, cp, mkdir, rm, readdir } from 'node:fs/promises';
// Alleen de expliciete besluiten gaan mee; onderzoeksgegevens en broncellen niet.
const register=JSON.parse(await readFile('controle/concordans-inhoudelijke-beoordeling.json','utf8'));
const besluiten=register.beoordelingsbesluiten;
if(!Array.isArray(besluiten)||besluiten.length!==10||besluiten.some(b=>b.beoordelingsstatus!=='beoordelingsbesluit_vastgelegd'||b.relatie_inhoudelijk_goedgekeurd!==false))throw Error('Onvolledige of ongeldige besluitprojectie');
const besluitenPlugin={name:'concordans-besluiten',setup(plugin){
 plugin.onResolve({filter:/^#concordans-besluiten$/},()=>({path:'besluiten',namespace:'concordans-besluiten'}));
 plugin.onLoad({filter:/.*/,namespace:'concordans-besluiten'},()=>({contents:`export default ${JSON.stringify(besluiten)};`,loader:'js'}));
}};
const pubAjv=new Ajv2020({strict:false,code:{source:true,esm:true}});
const pubValidator=standaloneCode(pubAjv,pubAjv.compile(JSON.parse(await readFile('schemas/publicatie.schema.json','utf8'))));
const publicatiePlugin={name:'publicatie-validatie',setup(p){p.onResolve({filter:/^#publicatie-validatie$/},()=>({path:'validator',namespace:'publicatie-validatie'}));p.onLoad({filter:/.*/,namespace:'publicatie-validatie'},()=>({contents:pubValidator,resolveDir:process.cwd()}));}};
await build({entryPoints:['src/publicatie/projectie.ts'],outfile:'dist/publicatie/projectie.js',bundle:true,format:'esm',platform:'browser',target:'es2022'});
await build({entryPoints:['src/publicatie/index.ts'],outfile:'dist/publicatie/index.js',bundle:true,format:'esm',platform:'browser',target:'es2022',plugins:[publicatiePlugin]});
await build({entryPoints:['src/publicatie/excel.ts'],outfile:'dist/publicatie/excel.js',bundle:true,format:'esm',platform:'browser',target:'es2022',plugins:[publicatiePlugin],external:['../gedeeld/excel.js']});
await build({entryPoints:['src/publicatie/concordans.ts'],outfile:'dist/publicatie/concordans.js',bundle:true,format:'esm',platform:'browser',target:'es2022',plugins:[publicatiePlugin,besluitenPlugin]});
await (await import('./genereer-publicaties.mjs')).genereerPublicaties();
if((await readdir('publicatie')).some(f=>!['1996-2012.json','2017.json','2020.json','concordans.json'].includes(f)))throw Error('Onverwacht publicatiebestand');
await build({ entryPoints: ['src/zoeken/index.ts'], outfile: 'dist/zoeken/index.js', bundle: true, format: 'esm', platform: 'browser', target: 'es2022' });
await build({ entryPoints: ['src/begripszoeken/index.ts'], outfile: 'dist/begripszoeken/index.js', bundle: true, format: 'esm', platform: 'browser', target: 'es2022' });
for (const soort of ['zoeken', 'begripszoeken']) await build({ entryPoints: [`src/${soort}/oorspronkelijk.ts`], outfile: `dist/${soort}/oorspronkelijk.js`, bundle: true, format: 'esm', platform: 'browser', target: 'es2022' });
await build({ entryPoints: ['src/gedeeld/excel.ts'], outfile:'dist/gedeeld/excel.js', bundle:true, format:'esm', platform:'browser', target:'es2022', minify:true, legalComments:'eof' });
await build({ entryPoints: ['src/raadplegen/index.ts'], outfile:'dist/raadplegen/index.js', bundle:true, format:'esm', platform:'browser', target:'es2022' });
await build({ entryPoints: ['src/raadplegen/excel.ts'], outfile:'dist/raadplegen/excel.js', bundle:true, format:'esm', platform:'browser', target:'es2022', external:['../gedeeld/excel.js'] });
await build({ entryPoints: ['src/concordans/excel.ts'], outfile: 'dist/concordans/excel.js', external:['../gedeeld/excel.js'], bundle: true, format: 'esm', platform: 'browser', target: 'es2022', minify:true, legalComments:'eof' });
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
  external: ['../gegevenslaag/index.js','../concordans/excel.js','../raadplegen/excel.js','../publicatie/excel.js'],
  plugins:[besluitenPlugin,publicatiePlugin],
});
for (const [bron, doel] of [
  ['src/interface/index.html', 'dist/site/index.html'],
  ['src/interface/style.css', 'dist/site/interface/style.css'],
  ['dist/gegevenslaag', 'dist/site/gegevenslaag'],
  ['dist/publicatie','dist/site/publicatie'],
  ['publicatie','dist/site/publicatie'],
  ['dist/gedeeld','dist/site/gedeeld'],
  ['dist/raadplegen','dist/site/raadplegen'],
  ['dist/concordans', 'dist/site/concordans'],
  ['datasets', 'dist/site/datasets'],
  ['bronnen', 'dist/site/bronnen'],
  ['HERGEBRUIK.md', 'dist/site/HERGEBRUIK.md'],
  ['documentatie/concordans-bronvermelding.md', 'dist/site/concordans-bronvermelding.md'],
  ['documentatie/privacy-publicatie.md', 'dist/site/privacy-publicatie.md'],
]) await cp(bron, doel, { recursive: true });

await writeFile('dist/site/concordans-excel-licenties.txt', 'write-excel-file 4.1.1\n'+await readFile('node_modules/write-excel-file/LICENSE','utf8')+'\n\nfflate\n'+await readFile('node_modules/fflate/LICENSE','utf8'));

// Oude bronlaag-export-API's blijven voor controles bestaan, niet als publiek downloadpad.
await rm('dist/site/raadplegen/excel.js',{force:true});
await rm('dist/site/concordans/excel.js',{force:true});
