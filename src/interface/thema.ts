// Eén mechanisme voor eerste paint én latere wijzigingen. Geen data- of UI-herbouw.
export {};
type Voorkeur = 'system' | 'light' | 'dark' | 'high-contrast';
const sleutel = 'sst.theme.v1';
const geldig = (waarde: unknown): waarde is Voorkeur => ['system','light','dark','high-contrast'].includes(waarde as string);
const donker = matchMedia('(prefers-color-scheme: dark)');
const contrast = matchMedia('(prefers-contrast: more)');
const geforceerd = matchMedia('(forced-colors: active)');
let voorkeur: Voorkeur = 'system';
let opslagBeschikbaar = true;
try { const opgeslagen = localStorage.getItem(sleutel); if (geldig(opgeslagen)) voorkeur = opgeslagen; }
catch { opslagBeschikbaar = false; }
function pasToe() {
  const thema = geforceerd.matches ? 'forced' : voorkeur !== 'system' ? voorkeur : contrast.matches ? 'high-contrast' : donker.matches ? 'dark' : 'light';
  if(document.documentElement.dataset.thema !== thema) document.documentElement.dataset.thema = thema;
}
pasToe();
for (const media of [donker,contrast,geforceerd]) media.addEventListener('change',pasToe);
function sluitAan() {
  const keuze = document.querySelector<HTMLSelectElement>('#thema-keuze');
  const uitleg = document.querySelector<HTMLElement>('#thema-uitleg');
  if (!keuze) return;
  const meldOpslag = () => { const tekst = opslagBeschikbaar ? 'Alleen de weergave van deze website. Uw keuze wordt lokaal in deze browser onthouden.' : 'Lokale opslag is niet beschikbaar. Deze weergavekeuze geldt zolang de pagina openstaat.'; if(uitleg && uitleg.textContent !== tekst) uitleg.textContent = tekst; };
  keuze.value = voorkeur; keuze.disabled = false; meldOpslag();
  keuze.addEventListener('change',()=>{
    voorkeur = geldig(keuze.value) ? keuze.value : 'system';
    try { localStorage.setItem(sleutel,voorkeur); opslagBeschikbaar = true; }
    catch { opslagBeschikbaar = false; }
    pasToe(); meldOpslag();
  });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',sluitAan,{once:true});
else sluitAan();
