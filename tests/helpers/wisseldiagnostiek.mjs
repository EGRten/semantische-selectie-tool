import {readFile} from 'node:fs/promises';
import {execFile} from 'node:child_process';import {promisify} from 'node:util';
async function geheugen(){let cgroup;try{cgroup=await readFile('/sys/fs/cgroup/memory.events','utf8');}catch{cgroup='niet beschikbaar';}let browserprocessen;try{const {stdout}=await promisify(execFile)('ps',['-eo','comm=,rss=']);const regels=stdout.split('\n').map(l=>l.match(/^(.+?)\s+(\d+)$/)).filter(m=>m&&/firefox|chrom(e|ium)|WebKit|WebContent|Isolated.*Web|RDD Process/i.test(m[1]));browserprocessen={aantal:regels.length,rssSomBytes:regels.reduce((s,m)=>s+Number(m[2])*1024,0)};}catch{browserprocessen='niet beschikbaar';}return {nodeRssBytes:process.memoryUsage().rss,browserprocessen,cgroup};}
export async function wisseldiagnostiek(page,testInfo){
 const voor=await geheugen();
 page.on('crash',()=>{void geheugen().then(na=>console.log('Browsercrashdiagnostiek '+JSON.stringify({test:testInfo.title,engine:testInfo.project.name,versie:page.context().browser()?.version(),voor,na})));});
 return async fase=>{console.log('Lijstwisseldiagnostiek '+JSON.stringify({fase,...await geheugen(),...await page.evaluate(()=>({dom:document.querySelectorAll('*').length,resultaten:document.querySelectorAll('[data-zoekresultaat]').length}))}));};
}
