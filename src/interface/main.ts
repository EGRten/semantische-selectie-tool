import { startApplicatie } from './app.js';
const root = document.querySelector<HTMLElement>('#app');
if (root) {
  try { startApplicatie(root); }
  catch { root.textContent='De applicatie kon niet starten. Laad de pagina opnieuw.';root.setAttribute('role','alert'); }
}
