import type { Dataset, Zoekverrijking, SelectielijstId } from '../gegevenslaag/index.js';
import { maakZoekpaneel } from './zoeken.js';
import { maakBegripspaneel } from './begripszoeken.js';
import { element, knop } from './dom.js';

export function maakZoekmodi(selecteer:(id:string)=>void,laden:(id:SelectielijstId)=>Promise<Zoekverrijking>) {
  const root=element('section',undefined,'zoekmodi');
  const tabs=element('div',undefined,'zoektabs');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','Zoekmethode');
  const klassiek=maakZoekpaneel(selecteer);const begrip=maakBegripspaneel(selecteer,laden);
  const panelen=[klassiek.element,begrip.element];
  let modus=0;let dataset:Dataset|undefined;
  const knoppen=['Trefwoordzoeken','Begripsgericht zoeken'].map((naam,i)=>{
    const b=knop(naam,()=>activeer(i));b.id=`zoekmodus-${i}`;b.setAttribute('role','tab');b.setAttribute('aria-controls',`zoekpaneel-${i}`);
    b.addEventListener('keydown',e=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
      e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?1:1-i;activeer(next);knoppen[next]!.focus();
    });return b;
  });
  function activeer(nummer:number) {
    modus=nummer;
    methodehulp.textContent=modus===0?'Trefwoord — zoek op een officiële code of tekst.':'Begripsgericht — zoek met verwante termen. Zoekverrijking is geen officieel selectievoorschrift.';
    knoppen.forEach((b,i)=>{b.setAttribute('aria-selected',String(i===modus));b.tabIndex=i===modus?0:-1;panelen[i]!.hidden=i!==modus;});
    klassiek.koppel(dataset);begrip.koppel(dataset,modus===1);
  }
  panelen.forEach((p,i)=>{p.id=`zoekpaneel-${i}`;p.setAttribute('role','tabpanel');p.setAttribute('aria-labelledby',`zoekmodus-${i}`);});
  const methodehulp=element('p',undefined,'methodehulp');methodehulp.id='zoekmethode-hulp';
  tabs.setAttribute('aria-describedby',methodehulp.id);
  tabs.append(...knoppen);root.append(tabs,methodehulp,...panelen);activeer(0);
  return {element:root,koppel(nieuw:Dataset|undefined){dataset=nieuw;klassiek.koppel(nieuw);begrip.koppel(nieuw,modus===1);}};
}
