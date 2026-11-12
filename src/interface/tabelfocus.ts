const ruimte = 7; // Vrije ruimte voor de bestaande 3px-outline met 3px-offset.
function kophoogte(gebied: HTMLElement) {
  return Math.max(0, ...Array.from(gebied.querySelectorAll('thead th'), e => e.getBoundingClientRect().height));
}
/** Behoud een rijlocatie zonder een vaste aanname over kophoogte of rijhoogte. */
export function scrollNaarTabelrij(gebied: HTMLElement, rij: HTMLElement) {
  gebied.scrollTop += rij.getBoundingClientRect().top - gebied.getBoundingClientRect().top - gebied.clientTop - kophoogte(gebied) - ruimte;
}
/** Corrigeer native focus-scroll na layout; deelbaar door alle vier naslagwerken. */
export function beveiligTabelfocus(gebied: HTMLElement): () => void {
  let frame = 0;
  function padding() {
    const eerste = gebied.querySelector('thead th:first-child');
    gebied.style.scrollPaddingTop = `${kophoogte(gebied) + ruimte}px`;
    gebied.style.scrollPaddingLeft = `${(eerste?.getBoundingClientRect().width ?? 0) + ruimte}px`;
  }
  function herstel() {
    const doel = document.activeElement;
    if (!(doel instanceof HTMLElement) || doel === gebied || !gebied.contains(doel)) return;
    doel.scrollIntoView({block:'nearest',inline:'nearest'});
    const b = gebied.getBoundingClientRect();
    const boven = b.top + gebied.clientTop + kophoogte(gebied) + ruimte;
    const onder = b.top + gebied.clientTop + gebied.clientHeight - ruimte;
    let r = doel.getBoundingClientRect();
    if (r.top < boven) gebied.scrollTop += r.top - boven;
    else if (r.bottom > onder) gebied.scrollTop += r.bottom - onder;
    const cel = doel.closest('th,td');
    const vast = gebied.querySelector('thead th:first-child');
    const eigenVasteKolom = cel?.matches('tbody th:first-child');
    const links = Math.max(b.left + gebied.clientLeft, eigenVasteKolom ? b.left : (vast?.getBoundingClientRect().right ?? b.left)) + ruimte;
    const rechts = b.left + gebied.clientLeft + gebied.clientWidth - ruimte;
    r = doel.getBoundingClientRect();
    if (r.left < links) gebied.scrollLeft += r.left - links;
    else if (r.right > rechts) gebied.scrollLeft += r.right - rechts;
  }
  function plan() { cancelAnimationFrame(frame); frame = requestAnimationFrame(herstel); }
  const observer = new ResizeObserver(() => { padding(); plan(); });
  observer.observe(gebied);
  const kop = gebied.querySelector('thead'); if (kop) observer.observe(kop);
  gebied.addEventListener('focusin', plan);
  padding();
  return () => { observer.disconnect(); cancelAnimationFrame(frame); gebied.removeEventListener('focusin', plan); };
}
