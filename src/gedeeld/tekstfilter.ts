/** Eenvoudige tabelmatching, zonder stemming, rangschikking of betekenisuitbreiding. */
export const normaliseerTabeltekst=(s:string)=>s.normalize('NFD').replace(/\p{M}/gu,'').toLocaleLowerCase('nl').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
export function filterTabel<T>(rijen:readonly T[],vraag:string,tekst:(rij:T)=>string):readonly T[]{
 const woorden=normaliseerTabeltekst(vraag).split(/\s+/).filter(Boolean);
 return woorden.length?rijen.filter(r=>{const s=normaliseerTabeltekst(tekst(r));return woorden.every(w=>s.includes(w));}):rijen;
}
