import { normaliseer, zoekwoorden } from './normalisatie.js';
export const BREDE_TERMEN: ReadonlySet<string> = new Set('aanvraag aanvragen vergunning vergunningen besluit besluiten dossier dossiers zaak zaken rapport rapporten stukken gemeente bewaren vernietigen'.split(' '));
const FUNCTIE = new Set('de het een en of van voor met in op aan bij om te is zijn ik we wij je jij u waar hoe welke welk wat onder over waarin staat vallen valt vind vinden zoek zoeken doe doet doen moet moeten wordt worden door uit als tot die dat dit deze er ze hun ons lang past nieuw nieuwe oude'.split(' '));
const KADER = new Set('stuk stukken document documenten gegevens dossier dossiers gemeente gemeentelijke bewaar bewaren bewaard vernietigen zoekrichting procestype'.split(' '));
export const NEGATIES = new Set(['niet','geen','zonder']);
export function analyseerVraag(vraag: string) {
  const alle = zoekwoorden(vraag);
  let woorden = alle.filter(w => !FUNCTIE.has(w));
  if (woorden.some(w => !KADER.has(w) && !NEGATIES.has(w))) woorden = woorden.filter(w => !KADER.has(w));
  const verwijderd = alle.filter(w => !woorden.includes(w));
  return { normaal: normaliseer(vraag), woorden, verwijderd, negaties: woorden.filter(w=>NEGATIES.has(w)),
    breed: woorden.filter(w=>BREDE_TERMEN.has(w)) };
}
/** Beperkte vormvergelijking, geen synoniemen of woordenboek. */
export function woordstam(woord: string): string {
  if (woord.length >= 7 && woord.endsWith('en')) return woord.slice(0,-2);
  if (woord.length >= 7 && woord.endsWith('s')) return woord.slice(0,-1);
  if (woord.length >= 8 && woord.endsWith('e')) return woord.slice(0,-1);
  return woord;
}
/** Negatieve resultaatlabels niet met een positieve naam gelijkstellen. */
export function pastPolariteit(vraag: string, labels: readonly string[], context: readonly string[] = labels): boolean {
  const q = normaliseer(vraag); const neg = zoekwoorden(q).filter(w=>NEGATIES.has(w));
  const teksten = labels.map(normaliseer);
  if (neg.length) {
    const positiefLabel = teksten.some(t=>t.length>=4&&!t.split(' ').some(w=>NEGATIES.has(w))&&` ${q} `.includes(` ${t} `));
    if(positiefLabel&&!teksten.some(t=>t.split(' ').some(w=>NEGATIES.has(w))))return false;
    return neg.every(w=>context.map(normaliseer).some(t=>t.split(' ').includes(w)));
  }
  return !teksten.some(t => {
    if (!t.split(' ').some(w=>NEGATIES.has(w))) return false;
    const positief = t.split(' ').filter(w=>!NEGATIES.has(w)).join(' ');
    return positief.length >= 4 && (` ${q} `.includes(` ${positief} `) || q.split(' ').includes(positief.replace(/ /g,'')));
  });
}
