import { schrijfNaslagExcel } from '../gedeeld/excel.js';
import type { Bronrij } from './bronbestand.js';
import { CONCORDANS_KOLOMMEN, CONCORDANS_IDENTITEIT as bron } from './raadplegen.js';
export { CONCORDANS_EXCEL_NAAM, CONCORDANS_EXCEL_KNOP } from './raadplegen.js';
/** Alleen de volledige oorspronkelijke JSON, nooit de gefilterde viewerresultaten. */
export async function maakConcordansExcel(rijen:readonly Bronrij[],datum=new Date()):Promise<Blob>{
 if(rijen.length!==716||rijen.some((r,i)=>r.bron.rij!==i+3||r.originele_cellen.length!==11||r.samengevoegde_cellen_uitgevouwen.length!==11))throw Error('Volledige concordans van 716 rijen en elf bronkolommen vereist');
 const headers=[...CONCORDANS_KOLOMMEN,...CONCORDANS_KOLOMMEN.map(k=>`Context ${k} (uitgevouwen, geen oorspronkelijke cel)`),'Oorspronkelijke bronrij (Blad1)'];
 const data=rijen.map(r=>[...r.originele_cellen,...r.samengevoegde_cellen_uitgevouwen,r.bron.rij]);
 const informatie=[
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
 ];
 return schrijfNaslagExcel('Concordans 1996-2020',headers,data,informatie);
}
