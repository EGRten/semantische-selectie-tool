import type { Dataset, SelectielijstId } from '../gegevenslaag/index.js';
import type { Beoordelingsbesluit } from '../concordans/besluiten.js';
import type { indexeerBronconcordans, Concordansrelatie, Bronrij } from '../concordans/index.js';
import { element, knop, lijstnamen } from './dom.js';
import { legeWaarde, bronlocatie } from './details.js';
import { vergelijkvelden } from './vergelijking.js';
type Controle=Awaited<ReturnType<typeof indexeerBronconcordans>>;
type Ref={readonly selectielijst:SelectielijstId;readonly id:string};
type Opties={laad:()=>Promise<Controle>;laadDataset:(lijst:SelectielijstId)=>Promise<Dataset>;navigeer:(lijst:SelectielijstId,id:string)=>void};
const toelichting='Deze vergelijking is gebaseerd op een historische concordans. Een relatie tussen voorschriften betekent niet automatisch dat zij juridisch of inhoudelijk gelijkwaardig zijn.';
const kolommen=['Historisch onderdeel (A)','Concordanssubletter (B, geen officiële code)','Historische omschrijving (C)','Historische termijn (D)','Proces (E)','Doelverwijzing (F)','Resultaat (G)','Omschrijving 2020 (H)','Waardering / termijn 2020 (I)','Opmerking 2017 (J)','Waardering 2017 (K)'];
function bronrij(r:Bronrij):HTMLElement{
  const d=element('details',undefined,'concordans-bron');d.append(element('summary',`Oorspronkelijke bronrij ${r.bron.rij}`),element('p',`Concordans Selectielijst 1996-2020(1).xlsx · ${r.bron.werkblad}, rij ${r.bron.rij}`));
  const dl=element('dl',undefined,'concordans-cellen');r.originele_cellen.forEach((v,i)=>{dl.append(element('dt',kolommen[i]),element('dd',v??'Leeg in de oorspronkelijke bron.','brontekst'));});d.append(dl);
  const samengevoegd=r.samengevoegde_cellen_uitgevouwen.map((v,i)=>v!==r.originele_cellen[i]?`${kolommen[i]}: ${v??'Leeg'}`:null).filter((v):v is string=>v!==null);
  if(samengevoegd.length)d.append(element('h5','Werkelijk samengevoegde broncontext'),element('p',samengevoegd.join('\n'),'brontekst'));
  return d;
}
export function toonBesluit(b:Beoordelingsbesluit):HTMLElement{
 const blok=element('section',undefined,'beoordelingsbesluit');
 blok.append(element('p','Beoordelingsbesluit vastgelegd','koppelstatus'),element('p',b.bevestigd_besluit,'brontekst'),element('p',`${b.beoordelaarsrol} · vastgelegd ${b.datum_vastlegging}. Aangeleverd door de projecteigenaar, technisch verwerkt door Codex.`, 'hulptekst'));
 if(b.technische_verwerking.status==='geen_definitieve_historische_koppeling')blok.append(element('p','Historische relatie niet eenduidig vastgesteld. Geen definitieve historische koppeling; het vastgelegde besluit keurt geen kandidaat goed.','melding'));
 if(b.uitkomst==='technische_interpretatie_besloten')blok.append(element('p','Technische correctie op basis van expliciet besluit: 19.1. → 19.1 — Verwerkt. De oorspronkelijke bedoeling is niet onafhankelijk bewezen.','melding'));
 if(b.uitkomst==='technische_identiteit_behouden')blok.append(element('p',"De officiële selectielijst is leidend: 'Door en aan de gemeente'. De concordans bevat de beperktere formulering 'Door de gemeente'. Niet vastgesteld is of dit een bewuste beperking of redactionele verkorting is. Rijen 50–52 zijn afzonderlijke 2020-verwijzingen met één gedeeld tekstvraagstuk.",'melding'));
 for(const t of b.resterende_onzekerheden)blok.append(element('p',t,'hulptekst'));
 blok.append(element('p',`Behouden AI-onderzoeksvoorstel: ${b.onderzoeksvoorstel.voorgestelde_conclusie.code}. ${b.onderzoeksvoorstel.voorgestelde_conclusie.label}. Dit is geen eigen onafhankelijke inhoudelijke validatie door Codex.`,'hulptekst'));
 return blok;
}
export function maakConcordanspaneel(dataset:Dataset,id:string,opties:Opties):HTMLDetailsElement{
  const paneel=element('details',undefined,'historische-relaties');const samenvatting=element('summary');samenvatting.append(element('h3','Vergelijk met andere selectielijsten'));paneel.append(samenvatting);
  const inhoud=element('div',undefined,'concordans-inhoud');paneel.append(inhoud);let aanvraag=0,vergelijkingAanvraag=0;
  const geldig=(n:number)=>paneel.isConnected&&paneel.open&&aanvraag===n;
  function fout(actie:()=>void){inhoud.replaceChildren(element('p','De concordans kan niet worden geladen of bevat ongeldige verwijzingen. Het bestand is mogelijk niet beschikbaar in deze publicatie. De officiële selectiegegevens blijven raadpleegbaar.','melding fout'),knop('Concordans opnieuw proberen',actie));inhoud.firstElementChild?.setAttribute('role','alert');}
  async function naam(ref:Ref){const ds=await opties.laadDataset(ref.selectielijst),r=ds.selectiegegeven(ref.id),s=ds.structuuronderdeel(ref.id);if(!r&&!s)throw Error('Onbekend concordansrecord');return {dataset:ds,tekst:`${lijstnamen[ref.selectielijst]} · ${r?.code??s?.code} ${r?.officiele_benaming??s?.benaming}`};}
  async function kandidaat(refId:string):Promise<HTMLElement>{const lijst=refId.split(':')[0] as SelectielijstId;const n=await naam({selectielijst:lijst,id:refId});return knop(`Bekijk kandidaat: ${n.tekst}`,()=>opties.navigeer(lijst,refId),'concordans-link');}
  async function verklaring(c:Controle,r:Concordansrelatie):Promise<HTMLElement>{
    const row=c.bronrijen.find(b=>r.oorspronkelijk.id.startsWith(b.id+':1996-2020:'));if(!row)throw Error('Bronrij ontbreekt');
    const d=element('details',undefined,'concordans-verklaring');const viewer=element('a',`Raadpleeg concordansrij ${row.bron.rij}`,'concordans-link');viewer.href=`#concordans=${row.bron.rij}`;d.append(element('summary',`Bronverklaring — rij ${row.bron.rij}`),viewer);
    d.append(element('p',`Oorspronkelijke bronrichting: ${lijstnamen[r.oorspronkelijk.bron.selectielijst]} → ${lijstnamen[r.oorspronkelijk.doel.selectielijst]}.`));
    d.append(element('p',`Technische eindpunten: ${r.bron.record?'gekoppeld':'niet gekoppeld'} → ${r.doel.record?'gekoppeld':'niet gekoppeld'}.`));
    if(r.oorspronkelijk.toelichting)d.append(element('p','Oorspronkelijke concordansverwijzing'),element('blockquote',r.oorspronkelijk.toelichting,'brontekst'));
    const besluit=c.besluitVoor(r.oorspronkelijk.id);if(besluit)d.append(toonBesluit(besluit));
    const beoordeling=c.beoordelingVoor(r.oorspronkelijk.id);
    if(beoordeling){d.append(element('p',besluit?`Oorspronkelijk technisch onderzoek: categorie ${beoordeling.categorie}`:beoordeling.categorie==='B'?'Kandidaat, inhoudelijke beoordeling vereist':'Technische controle: eenduidig herleidbaar'),element('p',beoordeling.onderbouwing,'brontekst'));for(const k of beoordeling.kandidaten)d.append(await kandidaat(k));}
    for(const onzekerheid of r.oorspronkelijk.onzekerheden)d.append(element('p',onzekerheid,'melding'));
    d.append(element('p',r.inhoudelijke_beoordeling?`Inhoudelijke beoordelingsstatus: ${r.inhoudelijke_beoordeling.status}`:'Geen afzonderlijke inhoudelijke goedkeuring geregistreerd.','hulptekst'),bronrij(row));return d;
  }
  async function gecorrigeerd(c:Controle,r:Controle['rijen'][number]):Promise<HTMLElement>{
    const blok=element('article',undefined,'concordans-correctie');blok.dataset.correctierij=String(r.rij);
    blok.append(element('h4',r.beoordelingsbesluit?`Technische correctie op basis van expliciet besluit — rij ${r.rij}`:`Technisch gecorrigeerde verwijzing — rij ${r.rij}`));
    if(r.rij===716)blok.append(element('p','Nieuw in 2020; dit is geen historische 1996–2020-relatie.','melding'));
    if(r.beoordelingsbesluit)blok.append(toonBesluit(r.beoordelingsbesluit));
    for(const k of r.doel2020.koppelingen)if(k.record_id){const n=await naam({selectielijst:'2020',id:k.record_id});blok.append(element('p',`Oorspronkelijke concordanswaarde: ${k.code}. Technische verwijzing: ${n.tekst}.`),knop(`Open officieel voorschrift: ${n.tekst}`,()=>opties.navigeer('2020',k.record_id!),'concordans-link'));}
    if(r.rij===21){const rel=c.concordans.relaties.find(v=>r.interpretatie_ids.includes(v.oorspronkelijk.id));const bron=rel?.bron.record,doel=rel?.doel.record;if(bron&&doel){const ander=dataset.id===bron.selectielijst&&id===bron.id?doel:dataset.id===doel.selectielijst&&id===doel.id?bron:null;if(ander)blok.append(knop('Vergelijk officiële gegevens van rij 21',()=>{const out=element('div');blok.append(out);void vergelijken(out,ander,aanvraag);},'concordans-link'));else blok.append(knop('Open historische bron van rij 21 voor vergelijking',()=>opties.navigeer(bron.selectielijst,bron.id),'concordans-link'));}}
    if(r.beoordeling)blok.append(element('p','Oorspronkelijk technisch onderzoek (behouden):'),element('p',r.beoordeling.onderbouwing,'brontekst'));const b=c.bronrijen.find(b=>b.id===r.bronrij_id);if(b)blok.append(bronrij(b));return blok;
  }
  async function overzicht(c:Controle,doel:HTMLElement,n:number){
    const blok=element('section',undefined,'concordans-overzicht');const titel=element('h4','Openstaande en gecorrigeerde verwijzingen');titel.tabIndex=-1;blok.append(titel,element('p',`${c.concordans.onopgelost().length} historische interpretaties hebben een onopgelost eindpunt. Kandidaten zijn niet vastgesteld. Dit overzicht is geen beoordelingssysteem.`));
    for(const r of c.concordans.onopgelost()){const art=element('article');const row=c.bronrijen.find(b=>r.oorspronkelijk.id.startsWith(b.id+':1996-2020:'))!;art.dataset.bronrij=String(row.bron.rij);art.append(element('h5',`Concordansrij ${row.bron.rij}`),element('p',c.besluitVoor(r.oorspronkelijk.id)?'Niet gekoppeld — beoordelingsbesluit vastgelegd; geen definitieve historische koppeling.':'Niet gekoppeld — kandidaat, inhoudelijke beoordeling vereist.'));for(const ref of [r.bron.record,r.doel.record])if(ref){const v=await naam(ref);art.append(element('p',`Bekend eindpunt: ${v.tekst}`),knop(`Open bekend eindpunt: ${v.tekst}`,()=>opties.navigeer(ref.selectielijst,ref.id),'concordans-link'));}art.append(await verklaring(c,r));blok.append(art);}
    for(const r of c.rijen.filter(r=>r.doel2020.koppelingen.some(k=>k.status.startsWith('technisch_gecorrigeerd'))))blok.append(await gecorrigeerd(c,r));
    const context=element('details',undefined,'concordans-2017');context.append(element('summary','Beschrijvende 2017-aantekeningen (geen vastgestelde relaties)'));
    for(const r of c.rijen.filter(r=>r.context2017.omschrijving||r.context2017.waardering)){const art=element('article');art.append(element('h5',`Concordansrij ${r.rij}`),element('p',r.context2017.omschrijving??'Geen afzonderlijke omschrijving in kolom J.','brontekst'));if(r.context2017.waardering)art.append(element('p',r.context2017.waardering,'brontekst'));art.append(element('p','Broncontext uit kolommen J/K; geen rechtstreeks vastgestelde officiële 2017-code.','hulptekst'));context.append(art);}blok.append(context);
    if(geldig(n)){doel.replaceChildren(blok);titel.focus();}
  }
  async function vergelijken(doel:HTMLElement,ref:Ref,n:number){
    const versie=++vergelijkingAanvraag;
    doel.replaceChildren(element('p','Officiële gegevens laden…'));try{const andere=await naam(ref);if(!geldig(n)||versie!==vergelijkingAanvraag)return;
      const blok=element('section',undefined,'concordans-vergelijking');const titel=element('h4','Officiële selectiegegevens naast elkaar');titel.tabIndex=-1;blok.append(titel,element('p','Markeringen tonen uitsluitend letterlijke verschillen. Een andere termijn bewijst geen juridische wijziging.','hulptekst'),knop('Sluit vergelijking',()=>{++vergelijkingAanvraag;doel.replaceChildren();paneel.querySelector('summary')?.focus();},'concordans-link'));
      const table=element('table',undefined,'vergelijkingstabel');const caption=element('caption','Geselecteerd voorschrift en gerelateerd voorschrift');table.append(caption);const head=element('thead'),hr=element('tr');for(const t of ['Onderdeel','Geselecteerd voorschrift','Gerelateerd voorschrift']){const th=element('th',t);th.scope='col';hr.append(th);}head.append(hr);const body=element('tbody');
      for(const v of vergelijkvelden(dataset,id,andere.dataset,ref.id)){const tr=element('tr');const th=element('th',v.label);th.scope='row';tr.append(th);if(v.links!==v.rechts){tr.className='letterlijk-verschil';th.append(element('span','Letterlijk verschil','verschil-label'));}for(const [waarde,status] of [[v.links,v.linksStatus],[v.rechts,v.rechtsStatus]] as const)tr.append(element('td',waarde?.trim()?waarde:legeWaarde(status),'brontekst'));body.append(tr);}
      const tr=element('tr'),th=element('th','Bronlocatie');th.scope='row';tr.append(th);
      for(const [ds,recordId] of [[dataset,id],[andere.dataset,ref.id]] as const){const td=element('td');const r=ds.selectiegegeven(recordId),s=ds.structuuronderdeel(recordId);if(r){td.append(bronlocatie(ds,r.bron));for(const b of r.aanvullende_bronnen.filter(b=>b.bron_id.endsWith('-officieel')))td.append(bronlocatie(ds,b));for(const [bestand,label] of [['bepalingen.json','Algemene bepalingen'],...(r.broncontext?[['rubriekcontext.json','Rubriekcontext']]:[])]){const a=element('a',`${label} (bronbestand)`);a.href=new URL(`./datasets/${ds.id}/${bestand}`,document.baseURI).href;a.target='_blank';a.rel='noopener noreferrer';td.append(a);}}else if(s)td.append(bronlocatie(ds,s.bron));tr.append(td);}body.append(tr);table.append(head,body);body.querySelectorAll('tr').forEach(r=>r.querySelectorAll('td').forEach((td,i)=>{td.dataset.kolom=i===0?'Geselecteerd voorschrift':'Gerelateerd voorschrift';}));blok.append(table,knop(`Open gerelateerd voorschrift: ${andere.tekst}`,()=>opties.navigeer(ref.selectielijst,ref.id),'concordans-link'));doel.replaceChildren(blok);titel.focus();
    }catch{if(geldig(n)&&versie===vergelijkingAanvraag){const p=element('p','De officiële vergelijkingsgegevens kunnen niet worden geladen. Probeer deze relatie opnieuw te openen.','melding fout');p.setAttribute('role','alert');doel.replaceChildren(p);}}
  }
  async function laden(alleenOverzicht=false){const n=++aanvraag;inhoud.replaceChildren(element('p','Concordans laden…','hulptekst'));inhoud.setAttribute('aria-busy','true');
    try{const c=await opties.laad();if(!geldig(n))return;inhoud.replaceChildren(element('p',toelichting,'melding'));
      if(dataset.id==='2020')inhoud.append(element('p','Inkomende verwijzingen volgen de oorspronkelijke richting 1996 → 2020; dit is geen omgekeerd vastgestelde opvolgingsrelatie.','hulptekst'));
      if(dataset.id==='2017')inhoud.append(element('p','Deze bron bevat geen rechtstreeks vastgestelde 2017-codemapping. Beschrijvende opmerkingen vormen geen vastgestelde relaties.'));
      const bron=element('p','Bron: Concordans Selectielijst 1996-2020(1).xlsx. Oorspronkelijke publicerende organisatie en rechthebbenden zijn niet vastgesteld in de beschikbare registratie.','hulptekst');const link=element('a','Bronmetadata');link.href=new URL('./bronnen/concordans-aangeleverd.bron.json',document.baseURI).href;link.target='_blank';link.rel='noopener noreferrer';bron.append(document.createTextNode(' '),link);inhoud.append(bron);
      const controle=element('div'),vergelijking=element('div');inhoud.append(knop('Openstaande en gecorrigeerde verwijzingen',()=>{void overzicht(c,controle,n).catch(()=>{if(geldig(n)){const p=element('p','Het controleoverzicht bevat een ongeldige verwijzing.','melding fout');p.setAttribute('role','alert');controle.replaceChildren(p);}});},'concordans-link'),controle,vergelijking);
      if(alleenOverzicht){await overzicht(c,controle,n);return;}
      const methode=dataset.selectiegegeven(id)?c.concordans.vanuitSelectiegegeven:c.concordans.vanuitStructuur;
      const rs=[...methode(dataset.id,id),...methode(dataset.id,id,'inkomend')];const uniek=[...new Map(rs.map(r=>[r.oorspronkelijk.id,r])).values()];
      const groepen=new Map<string,Concordansrelatie[]>();for(const r of uniek){const key=r.bron.record&&r.doel.record?JSON.stringify([r.bron.record.id,r.doel.record.id]):r.oorspronkelijk.id;groepen.set(key,[...(groepen.get(key)??[]),r]);}
      const lijst=element('div',undefined,'concordans-resultaten');if(!groepen.size)lijst.append(element('p','Geen rechtstreeks technisch gekoppelde historische relaties bij dit onderdeel. Dit bewijst niet dat er geen historische samenhang bestaat.','hulptekst'));
      if(groepen.size>1)lijst.append(element('p',`${groepen.size} recordparen of onvolledige verwijzingen. Er is niet automatisch één juiste relatie.`, 'hulptekst'));
      for(const groep of groepen.values()){const r=groep[0]!;const andere=dataset.id===r.oorspronkelijk.bron.selectielijst?r.doel.record:r.bron.record;const art=element('article',undefined,'concordans-relatie');art.dataset.bronrijen=groep.map(v=>v.oorspronkelijk.bronlocatie).join('; ');
        art.append(element('h4',andere?(await naam(andere)).tekst:'Geen vastgesteld gerelateerd voorschrift'));
        art.append(element('p',r.doel.status==='technisch_gecorrigeerd'?'Technische correctie op basis van expliciet besluit':r.bron.record&&r.doel.record?'Technische koppeling vastgesteld':'Niet gekoppeld','koppelstatus'));
        if(groep.some(r=>c.beoordelingVoor(r.oorspronkelijk.id)?.categorie==='B'&&!c.besluitVoor(r.oorspronkelijk.id)))art.append(element('p','Kandidaat, inhoudelijke beoordeling vereist — de betekenis van de bronverklaring is nog onzeker.','melding'));
        for(const row of groep){const b=c.besluitVoor(row.oorspronkelijk.id);if(b)art.append(toonBesluit(b));}
        art.append(element('p',`Bronselectielijst: ${lijstnamen[r.oorspronkelijk.bron.selectielijst]} · Doelselectielijst: ${lijstnamen[r.oorspronkelijk.doel.selectielijst]}.`));
        if(andere)art.append(knop('Vergelijk officiële gegevens',()=>{void vergelijken(vergelijking,andere,n);},'concordans-link'),knop('Open gerelateerd voorschrift',()=>opties.navigeer(andere.selectielijst,andere.id),'concordans-link'));
        if(groep.length>1)art.append(element('p',`${groep.length} afzonderlijke oorspronkelijke bronrijverklaringen bij ditzelfde recordpaar.`));for(const row of groep)art.append(await verklaring(c,row));lijst.append(art);}
      if(geldig(n)){const bronnen=element('nav',undefined,'concordans-bronrijlinks');bronnen.setAttribute('aria-label','Oorspronkelijke concordansrijen bij dit onderdeel');for(const row of c.rijen.filter(row=>dataset.id==='1996-2012'?row.bron1996.record_ids.includes(id):dataset.id==='2020'&&row.doel2020.koppelingen.some(k=>k.record_id===id))){const a=element('a',`Bronrij ${row.rij} raadplegen`,'concordans-link');a.href=`#concordans=${row.rij}`;bronnen.append(a);}inhoud.append(bronnen,lijst);for(const r of c.rijen.filter(r=>r.doel2020.koppelingen.some(k=>k.status.startsWith('technisch_gecorrigeerd')&&k.record_id===id)&&dataset.id==='2020'))inhoud.append(await gecorrigeerd(c,r));}
    }catch{if(geldig(n))fout(()=>{void laden(alleenOverzicht);});}finally{if(geldig(n))inhoud.setAttribute('aria-busy','false');}
  }
  paneel.addEventListener('toggle',()=>{if(!paneel.open){++aanvraag;return;}if(dataset.id==='2017'){inhoud.replaceChildren(element('p','Deze concordans bevat geen rechtstreeks vastgestelde 2017-codemapping. Beschrijvende opmerkingen zijn geen historische recordrelaties.'),knop('Open concordansoverzicht',()=>{void laden(true);},'concordans-link'));}else void laden();});
  return paneel;
}
