import type { Dataset, Selectiegegeven } from '../gegevenslaag/index.js';

/** Alleen bronwaarden en herkenbaar gelabelde context; geen datum- of termijnberekening. */
export function selectieTekst(dataset: Dataset, regel: Selectiegegeven): string {
  const regels: string[] = [];
  const voeg = (label: string, waarde: string | null | undefined) => { if (waarde?.trim()) regels.push(`${label}: ${waarde}`); };
  voeg('Selectielijst', dataset.manifest.officiele_titel);
  voeg('Vaststelling', `${dataset.manifest.vaststellingsgegevens.publicatie} · ${dataset.manifest.vaststellingsgegevens.datum}`);
  voeg('Datasetversie', dataset.manifest.datasetversie);
  voeg('Officiële code', regel.code);
  voeg('Officiële benaming', regel.officiele_benaming);
  voeg('Context', dataset.padNaar(regel.id)?.map(s => `${s.gegevens.code} ${'benaming' in s.gegevens ? s.gegevens.benaming : s.gegevens.officiele_benaming}`).join(' / '));
  voeg('Status', regel.status === 'vervallen' ? 'Vervallen resultaat' : undefined);
  for (const [label, waarde] of [
    ['Omschrijving', regel.officiele_omschrijving], ['Resultaattype',regel.resultaattype], ['Generiek / specifiek',regel.generiek_specifiek],
    ['Waardering',regel.waardering.officiele_tekst], ['Duiding waardering volgens bronlegenda',regel.waardering.afleiding], ['Bewaartermijn',regel.bewaartermijn.officiele_tekst],
    ['Procestermijn',regel.procestermijn.officiele_tekst], ['Aanvangsmoment',regel.aanvangsmoment.officiele_tekst],
    ['Toelichting',regel.toelichting], ['Uitzonderingen en verwijzingen',regel.uitzonderingen_en_verwijzingen.officiele_tekst],
    ['Procesomschrijving',regel.procesomschrijving], ['Procesobject',regel.procesobject],
    ['Procestoelichting',regel.officiele_bronrij.procestoelichting], ['Taakvelden',regel.taakvelden_brontekst],
    ['Herkomst waardering',regel.herkomst_waardering], ['Onderbouwing procestermijn',regel.procestermijn.onderbouwing],
  ]) voeg(label!,waarde);
  const labels: Record<string,string> = {officiele_omschrijving:'omschrijving',procesomschrijving:'procesomschrijving',toelichting:'toelichting',broncontext:'rubriekcontext',algemene_bepalingen:'algemene bepalingen'};
  voeg('Voorwaarden raadplegen in',regel.toepassingsvoorwaarden.bronvelden.map(v=>labels[v]??v).join(', '));
  if(!regel.waardering.officiele_tekst && ['vernietigen','bewaren'].includes(regel.waardering.type))voeg('Waardering volgens bronlegenda (geen afzonderlijke waarderingsletter)',regel.waardering.type==='vernietigen'?'Vernietigen':'Bewaren');
  voeg('Algemene bepalingen',regel.algemene_bepalingen);
  voeg('Rubriekcontext',regel.broncontext);
  for (const bron of [regel.bron,...regel.aanvullende_bronnen,regel.procestermijn.bron,regel.aanvangsmoment.bron]) {
    if (!bron) continue;
    const registratie=dataset.manifest.bronnenregister.find(b=>b.id===bron.bron_id);
    const plaats: string[] = [bron.bron_id];
    if ('pdf_pagina' in bron) plaats.push(`pagina ${bron.pdf_pagina}${'eindpagina' in bron && bron.eindpagina!==bron.pdf_pagina ? `–${bron.eindpagina}`:''}`);
    if ('werkblad' in bron) plaats.push(`werkblad ${bron.werkblad}`);
    if ('rij' in bron) plaats.push(`rij ${bron.rij}`);
    if ('kolom' in bron) plaats.push(`kolom ${bron.kolom}`);
    voeg('Bron',plaats.join(' · '));
    voeg('Documentbrede bronlink',registratie?.url);
  }
  for(const a of dataset.bronannotatiesBij(regel.id)) {
    voeg(`Bronannotatie bij ${a.code}`,`${a.bevinding}\n${a.verwerking}`);
    if(a.menselijke_bevestiging) voeg('Menselijke bevestiging',`${a.menselijke_bevestiging.oordeel}. ${a.menselijke_bevestiging.scope}`);
  }
  regels.push('Een gevonden voorschrift is geen automatisch selectieadvies. Raadpleeg de officiële bron en de toepassingsvoorwaarden.');
  return regels.join('\n\n');
}
