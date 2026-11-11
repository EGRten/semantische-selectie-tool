// Alleen een lokale statische ontwikkel-/testserver; geen applicatiebackend.
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { parseArgs } from 'node:util';
const { values } = parseArgs({ options: {
  port: { type: 'string', default: '4173' },
  base: { type: 'string', default: '/' },
  'concordans-env': {type:'boolean',default:false},
} });
let concordans;
if(values['concordans-env']){
  if(!process.env.CONCORDANS_BRON_JSON)throw Error('CONCORDANS_BRON_JSON ontbreekt');
  concordans=await readFile(process.env.CONCORDANS_BRON_JSON);
  if(createHash('sha256').update(concordans).digest('hex')!=='b01cff07c7bfeeb6f562d467373615f5a18cfc7ab9777f11fcd5cb1ed7de73dd')throw Error('Onverwachte concordansbron; controleer eerst identiteit en bronversie');
}
const root = resolve('dist/site');
const base = values.base;
if (!base.startsWith('/') || !base.endsWith('/')) throw new Error('base moet met / beginnen en eindigen');
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8', '.md':'text/plain; charset=utf-8' };
createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    if (!url.pathname.startsWith(base)) { response.writeHead(404).end(); return; }
    const relative = decodeURIComponent(url.pathname.slice(base.length));
    if(concordans&&relative==='concordans/concordans.json'){response.setHeader('Content-Type',mime['.json']);response.setHeader('Cache-Control','no-store');response.end(concordans);return;}
    let path = resolve(root, relative || 'index.html');
    if (!path.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
    response.setHeader('Content-Type', mime[extname(path)] ?? 'application/octet-stream');
    response.setHeader('Cache-Control', 'no-store');
    response.end(await readFile(path));
  } catch { response.writeHead(404).end('Bestand niet gevonden'); }
}).listen(Number(values.port), '127.0.0.1', () => {
  console.log(`Statische preview: http://127.0.0.1:${values.port}${base}`);
});
