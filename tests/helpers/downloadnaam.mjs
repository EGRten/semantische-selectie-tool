import {expect} from '@playwright/test';
// Observeer de aangeboden naam vóór native click; verander downloadgedrag niet.
export async function observeerDownloadnaam(page){await page.evaluate(()=>{
 const klik=HTMLAnchorElement.prototype.click;window.__downloadnamen=[];
 HTMLAnchorElement.prototype.click=function(...args){if(this.hasAttribute('download'))window.__downloadnamen.push(this.download);return klik.apply(this,args);};
});}
export function geldigeBrowsernaam(browser,bedoeld,voorgesteld){return voorgesteld===bedoeld||(browser==='webkit'&&voorgesteld===bedoeld.replaceAll(' ','_'));}
export async function controleerDownloadnaam(page,download,bedoeld,browser){
 const aangeboden=await page.evaluate(()=>window.__downloadnamen.at(-1));
 expect(aangeboden,'De applicatie moet de exacte voorgeschreven naam aanbieden').toBe(bedoeld);
 expect(geldigeBrowsernaam(browser,bedoeld,download.suggestedFilename()),JSON.stringify({browser,aangeboden,voorgesteld:download.suggestedFilename()})).toBe(true);
 return aangeboden;
}
