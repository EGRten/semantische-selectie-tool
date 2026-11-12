import {controleerPublicatie} from './index.js';
import {indexeerBronconcordans} from '../concordans/index.js';
import type {Dataset,SelectielijstId} from '../gegevenslaag/index.js';
import type {Publicatie} from './projectie.js';
/** Hergebruik dezelfde oorspronkelijke cellen uit de publicatie voor de bestaande index.
 * Geen tweede statische bronspiegel en geen toepassing van correcties op broncellen.
 * De twee ongebruikte inventarisvelden zijn geen brongegevens in dit contract:
 * de bestaande index bepaalt doelverwijzingen zelf uit de uitgevouwen F-cel.
 */
export async function indexeerPubliekeConcordans(p:Publicatie,laag:{laadDataset:(id:SelectielijstId)=>Promise<Dataset>}){
 controleerPublicatie(p,'concordans');
 return indexeerBronconcordans(p.rijen.map(r=>({
  id:r.id,bron:{bron_id:'concordans-aangeleverd',werkblad:'Blad1',rij:r.bronrij!},
  originele_cellen:[...r.waarden],
  samengevoegde_cellen_uitgevouwen:r.waarden.map((v,i)=>r.context?.find(c=>c.kolom===i)?.tekst??v),
  expliciete_2020_codes:[],ongeldige_codes:[],juridische_gelijkwaardigheid:false,'2017_codes_afgeleid':false,
 })),laag);
}
