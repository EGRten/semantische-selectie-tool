import writeXlsxFile from 'write-excel-file/universal';
import type { Cell, SheetData, Feature } from 'write-excel-file/universal';
import type { Bronrij } from './bronbestand.js';
import { CONCORDANS_KOLOMMEN, CONCORDANS_IDENTITEIT as bron } from './raadplegen.js';
export { CONCORDANS_EXCEL_NAAM, CONCORDANS_EXCEL_KNOP } from './raadplegen.js';
// Expliciete tekstcellen: codes, spaties en formuleachtige brontekst blijven tekst.
const tekst=(value:string|null):Cell=>value===null?null:{type:String,value,wrap:true,alignVertical:'top'};
/** Alleen de volledige oorspronkelijke JSON, nooit de gefilterde viewerresultaten. */
export async function maakConcordansExcel(rijen:readonly Bronrij[],datum=new Date()):Promise<Blob>{
 if(rijen.length!==716||rijen.some((r,i)=>r.bron.rij!==i+3||r.originele_cellen.length!==11||r.samengevoegde_cellen_uitgevouwen.length!==11))throw Error('Volledige concordans van 716 rijen en elf bronkolommen vereist');
 const headers=[...CONCORDANS_KOLOMMEN,...CONCORDANS_KOLOMMEN.map(k=>`Context ${k} (uitgevouwen, geen oorspronkelijke cel)`),'Oorspronkelijke bronrij (Blad1)'];
 const data:SheetData=[headers.map(value=>({type:String,value,fontWeight:'bold',wrap:true})),...rijen.map(r=>[...r.originele_cellen.map(tekst),...r.samengevoegde_cellen_uitgevouwen.map(tekst),{type:Number,value:r.bron.rij}])];
 const informatie:SheetData=[
 ['Titel','Concordans 1996-2020'],['Oorspronkelijk document',bron.titel],['Herkomst','Door de projecteigenaar aangeleverde werkmap en gecontroleerde JSON. Maker, oorspronkelijke publicerende organisatie en rechthebbende zijn niet vastgesteld.'],
 ['Vindplaatscontext (geen bewezen exacte downloadlocatie)',bron.contextUrl],['Excel SHA-256',bron.excelSha256],['JSON SHA-256',bron.jsonSha256],['Gegenereerd op (UTC)',datum.toISOString()],
 ['Omzetting','Aangepaste, bewerkbare representatie vanuit dezelfde gecontroleerde concordans-JSON; geen exacte kopie van de oorspronkelijke werkmap. 716 gegevensrijen, oorspronkelijke volgorde. Geen actieve zoekfilters overgenomen.'],
 ['Bronkolommen A–K','Oorspronkelijke celwaarden ongewijzigd. Lege broncellen blijven leeg. Tekst, codes, spaties, regeleinden en lege tekst worden niet gecorrigeerd of als formules uitgevoerd.'],
 ['Contextkolommen L–V','Volledige uitgevouwen context van A–K, uitsluitend volgens de gecontroleerde samengevoegde Excelbereiken. Deze aanvullende kolommen zijn geen oorspronkelijke cellen; zij mogen voor filteren en sorteren worden gebruikt. Ook niet-samengevoegde bronwaarden zijn hier herhaald zodat context per rij zelfstandig bruikbaar is. Er zijn geen samengevoegde exportcellen.'],
 ['Kolom W','Oorspronkelijk bronrijnummer in Blad1, zodat iedere rij na sorteren herleidbaar blijft. Exportregels 2–717 corresponderen met bronrijen 3–718.'],
 ['Technische interpretaties','Technische correcties, kandidaatrelaties, AI-onderzoeksvoorstellen en beoordelingsbesluiten worden niet in de bronkolommen verwerkt. Correcties 21 en 716 blijven uitsluitend in de afzonderlijke applicatielaag; broncodes 19.1. en 19.21.1 blijven behouden.'],
 ['Hergebruik','Voor integrale openbare distributie van de specifieke concordans en deze afgeleide download is nog geen voldoende onderbouwde hergebruikgrondslag vastgesteld. Geen licentie of toestemming wordt verondersteld; publieke data-opname blijft geblokkeerd totdat die grondslag en toepasselijke voorwaarden zijn vastgelegd. Het niet-commerciële karakter van het project levert op zichzelf geen toestemming.'],
 ['Documentmetadata','Nieuw gegenereerde werkmap. Oorspronkelijke Excel-auteursmetadata worden niet gelezen of overgenomen.'],
 ['Toepasselijkheid','Deze historische concordans en deze export vormen geen zelfstandig juridisch of archivistisch oordeel over de toepasselijkheid van selectievoorschriften. De officiële selectielijst blijft leidend.'],
 ].map(row=>row.map(value=>tekst(value)));
 // AutoFilter hoort na sheetData en vóór eventuele mergeCells/pageMargins volgens de OOXML-elementvolgorde.
 const filter:Feature<Blob>={files:{transform:{'xl/worksheets/sheet{id}.xml':{transform:(xml,options)=>{
  if(options.sheet!=='Concordans 1996-2020')return xml;
  // De schrijver normaliseert lege tekst naar een lege cel; behoud het brononderscheid.
  rijen.forEach((r,i)=>[...r.originele_cellen,...r.samengevoegde_cellen_uitgevouwen].forEach((v,j)=>{
   if(v!=='')return;const adres=`${String.fromCharCode(65+j)}${i+2}`;
   const patroon=new RegExp(`<c( r="${adres}"[^>]*)/>`);
   if(!patroon.test(xml))throw Error('Lege tekstcel ontbreekt in XLSX');
   xml=xml.replace(patroon,'<c$1 t="inlineStr"><is><t xml:space="preserve"></t></is></c>');
  }));
  const einde=xml.indexOf('</sheetData>');const grens=einde+'</sheetData>'.length;
  if(einde<0||xml.includes('<autoFilter'))throw Error('Onverwachte XLSX-structuur bij filterinstelling');
  return xml.slice(0,grens)+'<autoFilter ref="A1:W717"/>'+xml.slice(grens);
 }}}}};
 return writeXlsxFile([
  {sheet:'Concordans 1996-2020',data,stickyRowsCount:1,stickyColumnsCount:1,columns:headers.map((_,i)=>({width:i===22?18:35}))},
  {sheet:'Bronvermelding',data:informatie,columns:[{width:42},{width:115}],stickyRowsCount:0},
 ],{features:[filter],fontFamily:'Calibri',fontSize:11}).toBlob();
}
