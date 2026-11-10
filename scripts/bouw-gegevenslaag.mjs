import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { Ajv2020 } from 'ajv/dist/2020.js';
import standaloneCode from 'ajv/dist/standalone/index.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const ajv = new Ajv2020({ strict: false, allErrors: true, code: { source: true, esm: true } });
const schemas = { manifest: 'manifest', structuur: 'structuur', selectiegegevens: 'selectiegegevens', zoeklexicon: 'zoeklexicon', relaties: 'relaties' };
for (const naam of Object.keys(schemas)) {
  ajv.addSchema(JSON.parse(await readFile(new URL(`../schemas/${naam}.schema.json`, import.meta.url), 'utf8')), naam);
}
// Vooraf gegenereerde validators: geen schemafetches, runtimecompiler of eval in de browser.
const validators = standaloneCode(ajv, schemas);
await build({
  absWorkingDir: root,
  entryPoints: ['src/gegevenslaag/index.ts'],
  outfile: 'dist/gegevenslaag/index.js',
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  plugins: [{
    name: 'dataset-validatie',
    setup(plugin) {
      plugin.onResolve({ filter: /^#dataset-validatie$/ }, () => ({ path: 'validators', namespace: 'dataset-validatie' }));
      plugin.onLoad({ filter: /.*/, namespace: 'dataset-validatie' }, () => ({ contents: validators, resolveDir: root }));
    },
  }],
});
