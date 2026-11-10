import type { Dataset } from '../gegevenslaag/index.js';
import { element } from './dom.js';

/** ARIA-boom met één tabstop, expliciete parentrelaties en losse voorschriftbladeren. */
export function maakBoom(dataset: Dataset, selecteer: (id: string) => void) {
  const root = element('ul', undefined, 'boom');
  root.setAttribute('role', 'tree');
  root.setAttribute('aria-label', 'Structuur van de selectielijst');
  const items = new Map<string, HTMLLIElement>();
  const groepen = new Map<string, HTMLUListElement>();
  const ouders = new Map<string, string>();
  let focusId: string | undefined;
  function focus(id: string) {
    if (focusId) items.get(focusId)?.setAttribute('tabindex', '-1');
    focusId = id;
    const item = items.get(id);
    if (item) { item.tabIndex = 0; item.focus({ preventScroll: true }); item.firstElementChild?.scrollIntoView({ block: 'nearest' }); }
  }
  function open(id: string, waarde: boolean) {
    const groep = groepen.get(id);
    if (groep) { groep.hidden = !waarde; items.get(id)?.setAttribute('aria-expanded', String(waarde)); }
  }
  function zichtbaar(): HTMLLIElement[] {
    return Array.from(root.querySelectorAll<HTMLLIElement>('[role=treeitem]')).filter(item => !item.closest('[hidden]'));
  }
  function voegToe(id: string, code: string, naam: string, parent: string | null, niveau: number,
    positie: number, aantal: number, container: HTMLUListElement) {
    const item = element('li');
    item.setAttribute('role', 'treeitem');
    item.setAttribute('aria-label', `${code} ${naam}`);
    item.setAttribute('aria-level', String(niveau));
    item.setAttribute('aria-posinset', String(positie));
    item.setAttribute('aria-setsize', String(aantal));
    item.setAttribute('aria-selected', 'false');
    item.dataset.onderdeel = id;
    item.tabIndex = items.size === 0 ? 0 : -1;
    if (items.size === 0) focusId = id;
    items.set(id, item);
    if (parent) ouders.set(id, parent);
    const rij = element('div', undefined, 'boomrij');
    const pijl = element('span', undefined, 'pijl');
    pijl.setAttribute('aria-hidden', 'true');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 16 16');
    const path = document.createElementNS(svg.namespaceURI, 'path');
    path.setAttribute('d', 'm6 3 5 5-5 5');
    svg.append(path); pijl.append(svg);
    rij.append(pijl, element('span', code, 'code'), element('span', naam, 'boomnaam'));
    item.append(rij); container.append(item);
    rij.addEventListener('click', event => {
      event.stopPropagation(); focus(id);
      if (event.target instanceof Element && event.target.closest('.pijl') && groepen.has(id)) {
        open(id, item.getAttribute('aria-expanded') !== 'true');
      } else selecteer(id);
    });
    item.addEventListener('focus', event => {
      if (event.target !== item) return;
      if (focusId && focusId !== id) items.get(focusId)?.setAttribute('tabindex', '-1');
      focusId = id; item.tabIndex = 0;
    });
    item.addEventListener('keydown', event => {
      if (event.target !== item) return;
      const lijst = zichtbaar(); const index = lijst.indexOf(item);
      const groep = groepen.get(id);
      let doel: string | undefined;
      switch (event.key) {
        case 'ArrowDown': doel = lijst[index + 1]?.dataset.onderdeel; break;
        case 'ArrowUp': doel = lijst[index - 1]?.dataset.onderdeel; break;
        case 'Home': doel = lijst[0]?.dataset.onderdeel; break;
        case 'End': doel = lijst.at(-1)?.dataset.onderdeel; break;
        case 'ArrowRight':
          if (groep?.hidden) open(id, true);
          else doel = groep?.querySelector<HTMLLIElement>('[role=treeitem]')?.dataset.onderdeel;
          break;
        case 'ArrowLeft':
          if (groep && !groep.hidden) open(id, false);
          else doel = ouders.get(id);
          break;
        case 'Enter': case ' ': selecteer(id); break;
        default: return;
      }
      event.preventDefault(); event.stopPropagation(); if (doel) focus(doel);
    });
    return item;
  }
  function structuur(id: string, parent: string | null, niveau: number, positie: number, aantal: number, container: HTMLUListElement) {
    const node = dataset.structuuronderdeel(id);
    if (!node) throw new Error('Een structuuronderdeel ontbreekt.');
    const item = voegToe(id, node.code, node.benaming, parent, niveau, positie, aantal, container);
    const kinderen = dataset.kinderen(id);
    const regels = dataset.selectiegegevensBij(id).filter(r => !dataset.structuuronderdeel(r.id));
    const totaal = kinderen.length + regels.length;
    if (!totaal) return;
    const groep = element('ul'); groep.setAttribute('role', 'group'); groep.hidden = true;
    groepen.set(id, groep); item.setAttribute('aria-expanded', 'false'); item.append(groep);
    kinderen.forEach((kind, i) => structuur(kind.id, id, niveau + 1, i + 1, totaal, groep));
    regels.forEach((r, i) => voegToe(r.id, r.code, r.officiele_benaming, id, niveau + 1, kinderen.length + i + 1, totaal, groep));
  }
  const roots = dataset.hoofdonderdelen();
  roots.forEach((node, i) => structuur(node.id, null, 1, i + 1, roots.length, root));
  return {
    element: root,
    activeer(id: string, verplaatsFocus = false) {
      for (const [key, item] of items) item.setAttribute('aria-selected', String(key === id));
      let parent = ouders.get(id);
      while (parent) { open(parent, true); parent = ouders.get(parent); }
      if (verplaatsFocus) focus(id);
    },
    inklappen() {
      // Houd de roving tabstop zichtbaar, ook als het gefocuste blad verdwijnt.
      let id = focusId;
      while (id && ouders.has(id)) id = ouders.get(id);
      for (const key of groepen.keys()) open(key, false);
      if (focusId) items.get(focusId)?.setAttribute('tabindex', '-1');
      focusId = id; if (id) items.get(id)?.setAttribute('tabindex', '0');
    },
  };
}
