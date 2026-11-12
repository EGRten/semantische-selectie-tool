export function element<K extends keyof HTMLElementTagNameMap>(tag: K, tekst?: string, klasse?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (tekst !== undefined) node.textContent = tekst;
  if (klasse) node.className = klasse;
  return node;
}
export function knop(tekst: string, actie: () => void, klasse = ''): HTMLButtonElement {
  const node = element('button', tekst, klasse);
  node.type = 'button';
  node.addEventListener('click', actie);
  return node;
}
export const lijstnamen = { '1996-2012': '1996, actualisatie 2012', '2017': '2017', '2020': '2020' } as const;
const typen: Record<string, string> = {
  hoofdstuk: 'Hoofdstuk', taakveld: 'Taakveld', rubriek: 'Rubriek', procestype: 'Procestype',
  generiek_resultaat: 'Generiek resultaat', specifiek_resultaat: 'Specifiek resultaat', voorschrift: 'Selectievoorschrift',
};
export function typenaam(type: string): string { return typen[type] ?? type; }

/** Alleen presentatiebreedtes; kolomlabels en bronwaarden blijven ongewijzigd. */
export function tabelKolommen(labels:readonly string[]) {
 const groep=element('colgroup');
 labels.forEach((label,i)=>{const col=element('col'),naam=label.toLowerCase();
 col.className=i===0||naam.startsWith('f —')?'kolom-code':/omschrijving|toelichting|opmerking/.test(naam)?'kolom-omschrijving':/termijn|aanvang/.test(naam)?'kolom-termijn':/status|generiek|waardering|subletter/.test(naam)?'kolom-compact':'kolom-context';groep.append(col);});return groep;
}
export function tabelScrollhulp(id:string) {
 const p=element('p','Deze tabel kan horizontaal en verticaal worden gescrold. Gebruik de schuifbalk of focus het tabelgebied en gebruik de pijltjestoetsen. Tab gaat naar de rijlinks.','scrollhulp');p.id=id;return p;
}
