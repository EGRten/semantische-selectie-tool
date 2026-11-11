import besluiten from '#concordans-besluiten';
export type Beoordelingsbesluit = {
  readonly besluit_id:string;readonly bronrij_id:string;readonly probleemgroep:string;
  readonly onderzoeksvoorstel:{readonly bronrij_id:string;readonly voorgestelde_conclusie:{readonly code:number;readonly label:string;readonly status:string}};
  readonly bevestigd_besluit:string;readonly uitkomst:'technische_identiteit_behouden'|'technische_interpretatie_besloten'|'onvoldoende_onderbouwd'|'meerdere_historische_relaties_mogelijk';
  readonly motivering:string;readonly beoordelingsstatus:'beoordelingsbesluit_vastgelegd';readonly beoordelaarsrol:string;readonly datum_vastlegging:string;
  readonly oorspronkelijke_gespreksdatum:null;readonly aangeleverd_door:'projecteigenaar';readonly technisch_verwerkt_door:'Codex';readonly relatie_inhoudelijk_goedgekeurd:false;
  readonly technische_verwerking:{readonly status:string;readonly bronwaarde:string|null;readonly record_id:string|null;readonly relatie_id:string|null};
  readonly resterende_onzekerheden:readonly string[];
};
export function besluitBij(rij:number):Beoordelingsbesluit|undefined{return besluiten.find(b=>b.bronrij_id===`concordans:rij:${rij}`);}
