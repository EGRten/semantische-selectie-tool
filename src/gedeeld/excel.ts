import writeXlsxFile from 'write-excel-file/universal';
import type { Cell, Feature } from 'write-excel-file/universal';
export type ExcelWaarde=string|number|null;
function kolom(index:number){let s='';for(let n=index+1;n>0;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s;}
// OOXML ST_Xstring: behoud XML-onmogelijke controletekens en letterlijke escapevormen.
const xlsxTekst=(s:string)=>s.replace(/_x[0-9a-fA-F]{4}_/g,m=>'_x005F_'+m.slice(1)).replace(/[\u0000-\u0008\u000B\u000C\u000D\u000E-\u001F\uFFFE\uFFFF]/g,c=>'_x'+c.charCodeAt(0).toString(16).toUpperCase().padStart(4,'0')+'_');
const cel=(value:ExcelWaarde):Cell=>value===null?null:{type:typeof value==='number'?Number:String,value:typeof value==='string'?xlsxTekst(value):value,wrap:true,alignVertical:'top'};
/** Gedeelde schrijver: tekst blijft tekst; geen bronmetadata of formules. */
export async function schrijfNaslagExcel(titel:string,headers:readonly string[],rijen:readonly (readonly ExcelWaarde[])[],bronvermelding:readonly (readonly string[])[],toelichtingen?:readonly (readonly ExcelWaarde[])[]):Promise<Blob>{
 if(rijen.some(r=>r.length!==headers.length))throw Error('Onvolledige exportkolommen');
 for(const r of [...rijen,...bronvermelding,...toelichtingen??[]])for(const v of r)if(typeof v==='string'&&v.length>32767)throw Error('Te lange Excel-cel; splits brongetrouw in afzonderlijke delen');
 const filter:Feature<Blob>={files:{transform:{'xl/worksheets/sheet{id}.xml':{transform:(xml,options)=>{
  const waarden=options.sheet===titel?rijen:options.sheet==='Toelichtingen'?toelichtingen!:bronvermelding;
  waarden.forEach((r,i)=>r.forEach((v,j)=>{if(v!=='')return;const adres=`${kolom(j)}${i+(options.sheet===titel?2:1)}`;const p=new RegExp(`<c( r="${adres}"[^>]*)/>`);if(!p.test(xml))throw Error('Lege tekstcel ontbreekt in XLSX');xml=xml.replace(p,'<c$1 t="inlineStr"><is><t xml:space="preserve"></t></is></c>');}));
  if(options.sheet!==titel)return xml;
  const einde=xml.indexOf('</sheetData>'),grens=einde+'</sheetData>'.length;
  if(einde<0||xml.includes('<autoFilter'))throw Error('Onverwachte XLSX-structuur');
  return xml.slice(0,grens)+`<autoFilter ref="A1:${kolom(headers.length-1)}${rijen.length+1}"/>`+xml.slice(grens);
 }}}}};
 return writeXlsxFile([{sheet:titel,data:[headers.map(value=>({type:String,value,fontWeight:'bold' as const,wrap:true})),...rijen.map(r=>r.map(cel))],stickyRowsCount:1,stickyColumnsCount:1,columns:headers.map(()=>({width:35}))},...(toelichtingen?[{sheet:'Toelichtingen',data:toelichtingen.map(r=>r.map(cel)),columns:[{width:18},{width:45},{width:35},{width:100},{width:70}]}]:[]),{sheet:'Bronvermelding',data:bronvermelding.map(r=>r.map(cel)),columns:[{width:42},{width:115}]}],{features:[filter],fontFamily:'Calibri',fontSize:11}).toBlob();
}
