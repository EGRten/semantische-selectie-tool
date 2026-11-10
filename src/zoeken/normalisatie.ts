export interface Genormaliseerd {
  readonly tekst: string;
  readonly posities: readonly { begin: number; einde: number }[];
}
/** UTF-16-bronposities blijven behouden voor markering zonder bronwijzigingen. */
export function normaliseerMetPosities(bron: string): Genormaliseerd {
  const overslaan = new Set<number>();
  for (const match of bron.matchAll(/(?<=\p{L})[-\u2010\u2011][ \t]*(?:\r\n?|\n|\u2028|\u2029)[ \t]*(?=\p{L})/gu)) {
    for (let i = match.index; i < match.index + match[0].length; i++) overslaan.add(i);
  }
  let tekst = '';
  const posities: { begin: number; einde: number }[] = [];
  let offset = 0;
  for (const teken of bron) {
    const begin = offset; offset += teken.length;
    if (overslaan.has(begin) || teken === '\u00ad') continue;
    const gevouwen = teken.normalize('NFKD').toLowerCase().replace(/\p{M}/gu, '');
    if (!gevouwen && posities.length) { posities[posities.length - 1]!.einde = offset; continue; }
    for (const letter of gevouwen) {
      const waarde = /[\p{L}\p{N}]/u.test(letter) ? letter : ' ';
      if (waarde === ' ' && (!tekst || tekst.endsWith(' '))) continue;
      tekst += waarde;
      // Ook astrale letters tellen in JS-stringindices twee UTF-16-posities.
      for (let i = 0; i < waarde.length; i++) posities.push({ begin, einde: offset });
    }
  }
  if (tekst.endsWith(' ')) { tekst = tekst.slice(0, -1); posities.pop(); }
  return { tekst, posities };
}
export function normaliseer(tekst: string): string { return normaliseerMetPosities(tekst).tekst; }
export function zoekwoorden(tekst: string): readonly string[] {
  return [...new Set(normaliseer(tekst).split(' ').filter(Boolean))];
}
export function markeerbereiken(tekst: string, vraag: string): readonly { begin: number; einde: number }[] {
  const n = normaliseerMetPosities(tekst);
  const bereiken: { begin: number; einde: number }[] = [];
  for (const woord of zoekwoorden(vraag)) {
    let begin = n.tekst.indexOf(woord);
    while (begin !== -1) {
      const a = n.posities[begin]; const b = n.posities[begin + woord.length - 1];
      if (a && b) bereiken.push({ begin: a.begin, einde: b.einde });
      begin = n.tekst.indexOf(woord, begin + woord.length);
    }
  }
  bereiken.sort((a, b) => a.begin - b.begin || a.einde - b.einde);
  const samen: { begin: number; einde: number }[] = [];
  for (const bereik of bereiken) {
    const vorig = samen.at(-1);
    if (vorig && bereik.begin <= vorig.einde) vorig.einde = Math.max(vorig.einde, bereik.einde);
    else samen.push({ ...bereik });
  }
  return samen;
}
