import { build } from 'esbuild';
import { cp, mkdir, rm } from 'node:fs/promises';
await build({ entryPoints: ['src/zoeken/index.ts'], outfile: 'dist/zoeken/index.js', bundle: true, format: 'esm', platform: 'browser', target: 'es2022' });
await build({ entryPoints: ['src/begripszoeken/index.ts'], outfile: 'dist/begripszoeken/index.js', bundle: true, format: 'esm', platform: 'browser', target: 'es2022' });
for (const soort of ['zoeken', 'begripszoeken']) await build({ entryPoints: [`src/${soort}/oorspronkelijk.ts`], outfile: `dist/${soort}/oorspronkelijk.js`, bundle: true, format: 'esm', platform: 'browser', target: 'es2022' });
// De bronbestanden worden ongewijzigd in de statische publicatiemap gekopieerd.
await rm('dist/site', { recursive: true, force: true });
await mkdir('dist/site/interface', { recursive: true });
await build({
  entryPoints: ['src/interface/main.ts'],
  outfile: 'dist/site/interface/app.js',
  bundle: true, format: 'esm', platform: 'browser', target: 'es2022',
  external: ['../gegevenslaag/index.js'],
});
for (const [bron, doel] of [
  ['src/interface/index.html', 'dist/site/index.html'],
  ['src/interface/style.css', 'dist/site/interface/style.css'],
  ['dist/gegevenslaag', 'dist/site/gegevenslaag'],
  ['datasets', 'dist/site/datasets'],
  ['bronnen', 'dist/site/bronnen'],
  ['HERGEBRUIK.md', 'dist/site/HERGEBRUIK.md'],
  ['documentatie/privacy-publicatie.md', 'dist/site/privacy-publicatie.md'],
]) await cp(bron, doel, { recursive: true });
