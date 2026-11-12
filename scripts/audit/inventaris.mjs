// Volledige CSSOM-inventaris inclusief media-context en alle marge-/randvarianten.
import {chromium} from 'playwright';import {mkdir,writeFile} from 'node:fs/promises';import {resolve} from 'node:path';
const uit=resolve(process.env.AUDIT_OUTPUT??'/tmp/semantische-ui-audit');await mkdir(uit,{recursive:true});
const b=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true});try{
 const p=await b.newPage();await p.goto(process.env.AUDIT_URL??'http://127.0.0.1:4229/semantische-selectie-tool/');
 const data=await p.evaluate(()=>{const regels=[],waarden={};function loop(rs,context=[]){for(const r of rs){if(r.style){const declaraties={};for(const prop of r.style){const v=r.style.getPropertyValue(prop);declaraties[prop]=v;waarden[prop]??=[];if(!waarden[prop].includes(v))waarden[prop].push(v);}regels.push({selector:r.selectorText,context,declaraties});}if(r.cssRules)loop(r.cssRules,[...context,r.conditionText??r.cssText.split('{')[0]]);}}for(const s of document.styleSheets)loop(s.cssRules);return {waarden,regels};});
 await writeFile(resolve(uit,'css-volledig.json'),JSON.stringify(data,null,2));console.log(data.regels.length+' CSS-regels, '+Object.keys(data.waarden).length+' eigenschappen');
}finally{await b.close();}
