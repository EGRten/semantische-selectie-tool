import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {maakGegevenslaag} from '../dist/gegevenslaag/index.js';
import {maakZoekindex} from '../dist/zoeken/index.js';
import {maakBegripsindex,toelating} from '../dist/begripszoeken/index.js';
const root=new URL('../datasets/',import.meta.url);
const laag=maakGegevenslaag({datasetsUrl:root,ophalen:async u=>new Response(await readFile(u,'utf8'))});
const lijsten=['1996-2012','2017','2020'];
const datasets={},verrijkingen={},indices={};
for(const id of lijsten){datasets[id]=await laag.laadDataset(id);verrijkingen[id]=await laag.laadZoekverrijking(id);indices[id]=maakBegripsindex(datasets[id],verrijkingen[id]);}
const bewijzen=rs=>rs.flatMap(r=>r.verklaringen.filter(v=>v.soort==='lexicon'));
function klein(id,type){const v=verrijkingen[id];const t=v.zoeklexicon.find(t=>t.relatietype===type);const r=v.relaties.find(r=>r.van===t.id&&r.type===type);return {t,r,data:{selectielijst:id,zoeklexicon:[t],relaties:[r]}};}

test('afkortingen en volledige bronbenaming leiden via opgeslagen kanten naar dezelfde doelen',()=>{
  for(const q of ['WABO','Wet algemene bepalingen omgevingsrecht']){
    const rs=indices['1996-2012'].zoek(q);assert.ok(rs.some(r=>r.id==='1996-2012:2.7'&&r.verklaringen.some(v=>v.term?.zoekterm===q)));
  }
  assert.ok(bewijzen(indices['2017'].zoek('RI&E')).some(v=>v.relatie.type==='afkorting'));
});
test('schrijfvarianten uit alle lijsten en historische brononderbouwde alternatieven',()=>{
  for(const id of lijsten){const {t,r,data}=klein(id,'spellingvariant');const rs=maakBegripsindex(datasets[id],data).zoek(t.zoekterm);assert.ok(bewijzen(rs).some(v=>v.relatie.id===r.id));}
  for(const q of ['Monumentenverordening','Erfgoedverordening'])assert.ok(bewijzen(indices['1996-2012'].zoek(q)).some(v=>v.relatie.type==='historische_benaming'));
});
test('brononderbouwde verwante begrippen en beoordeelde praktijkformuleringen blijven onderscheiden',()=>{
  const rs=indices['1996-2012'].zoek('metadata');assert.ok(bewijzen(rs).some(v=>v.relatie.type==='verwant_begrip'&&v.term.herkomsttype==='brononderbouwd_alternatief'));
  const notulen=indices['2020'].zoek('Waar vind ik notulen van vergaderingen?');
  assert.ok(notulen.some(r=>r.id==='2020:19'&&r.verklaringen.some(v=>v.term?.beoordelingsstatus==='voorstel_inhoudelijk_beoordeeld_zoekrichting')));
  assert.ok(bewijzen(notulen).every(v=>!v.onbevestigd));
});
test('onbevestigde voorstellen standaard geblokkeerd, expliciet inschakelen voegt verklaring toe',()=>{
  for(const id of lijsten){const {t,r,data}=klein(id,'verwant_begrip_voorstel');const index=maakBegripsindex(datasets[id],data);
    assert.ok(!bewijzen(index.zoek(t.zoekterm)).some(v=>v.relatie.id===r.id));
    const inclusief=index.zoek(t.zoekterm,{onbevestigdeAi:true});
    assert.ok(bewijzen(inclusief).some(v=>v.relatie.id===r.id&&v.onbevestigd&&v.prioriteit===6));
  }
});
test('beide expliciete statussen zijn nodig; hoge score en bron laten onbekende status niet toe',()=>{
  const {t,r,data}=klein('2020','verwant_begrip_voorstel');
  for(const [statusTerm,statusRel] of [['onbekend',r.status],[t.beoordelingsstatus,'onbekend']]){
    const v={...data,zoeklexicon:[{...t,beoordelingsstatus:statusTerm,betrouwbaarheid:'hoog'}],relaties:[{...r,status:statusRel}]};
    assert.equal(bewijzen(maakBegripsindex(datasets['2020'],v).zoek(t.zoekterm,{onbevestigdeAi:true})).length,0);
  }
});
test('richting is niet omkeerbaar; structurele ouderkant is geen brede betekenisrelatie',()=>{
  const {t,r,data}=klein('1996-2012','afkorting');
  const v={...data,relaties:[{...r,richting:'kind_naar_ouder'}]};
  assert.equal(bewijzen(maakBegripsindex(datasets['1996-2012'],v).zoek(t.zoekterm)).length,0);
  for(const id of lijsten){
    assert.ok(verrijkingen[id].relaties.every(r=>!['breder_begrip','smaller_begrip'].includes(r.type)));
    const rs=indices[id].zoek('1.1.1');assert.ok(bewijzen(rs).every(v=>v.relatie.type!=='onderdeel_van'));
  }
});
test('meerdere termen met hetzelfde doel blijven één resultaat met alle bewijzen',()=>{
  const v=klein('1996-2012','afkorting');
  const term2=verrijkingen['1996-2012'].zoeklexicon.find(t=>t.onderdeel_id===v.t.onderdeel_id&&t.relatietype==='afkorting_voluit');
  const rel2=verrijkingen['1996-2012'].relaties.find(r=>r.van===term2.id);
  const rs=maakBegripsindex(datasets['1996-2012'],{selectielijst:'1996-2012',zoeklexicon:[v.t,term2],relaties:[v.r,rel2]}).zoek('WABO Wet algemene bepalingen omgevingsrecht');
  assert.equal(rs.filter(r=>r.id===v.t.onderdeel_id).length,1);
  assert.deepEqual(new Set(bewijzen(rs).map(v=>v.term.id)),new Set([v.t.id,term2.id]));
});
test('rangschikking is deterministisch, exacte officiële code/naam gaat voor',()=>{
  for(const q of ['Gemeentewapen','notulen','WABO','actueel']){
    const id=q==='WABO'?'1996-2012':'2020';const rs=indices[id].zoek(q,{onbevestigdeAi:true});
    assert.ok(rs.every((r,i)=>!i||rs[i-1].begripsrang<=r.begripsrang));assert.deepEqual(rs,indices[id].zoek(q,{onbevestigdeAi:true}));
  }
  assert.equal(indices['2020'].zoek('Gemeentewapen')[0].begripsrang,1);
  assert.equal(indices['2020'].zoek('1.1')[0].id,'2020:1.1');
});
test('1996: directe technische voorschriften worden niet tot alleen de rubriek teruggebracht',()=>{
  const rs=indices['1996-2012'].zoek('3.6.2');assert.equal(rs.filter(r=>r.type==='voorschrift').length,36);
  const {t,r,data}=klein('1996-2012','verwant_begrip_voorstel');assert.match(t.onderdeel_id,/::/);
  const gevonden=maakBegripsindex(datasets['1996-2012'],data).zoek(t.zoekterm,{onbevestigdeAi:true}).find(x=>x.id===r.naar);
  assert.ok(gevonden);assert.ok(!gevonden.code.includes('::'));
});
test('lijstisolatie en ongeldige verwijzingen blokkeren',()=>{
  assert.throws(()=>maakBegripsindex(datasets['2017'],verrijkingen['2020']));
  const {t,r,data}=klein('2020','verwant_begrip_voorstel');assert.throws(()=>maakBegripsindex(datasets['2020'],{...data,relaties:[{...r,naar:'2017:1'}]}));
  for(const id of lijsten)assert.ok(indices[id].zoek('notulen',{onbevestigdeAi:true}).every(r=>r.id.startsWith(`${id}:`)));
});
test('vervallen alleen met expliciete instelling, generiek/specifiek behouden',()=>{
  assert.ok(!indices['2020'].zoek('7.1.20').some(r=>r.id==='2020:7.1.20'));
  assert.ok(indices['2020'].zoek('7.1.20',{vervallenMeenemen:true}).some(r=>r.id==='2020:7.1.20'));
  const rs=indices['2017'].zoek('1.1');assert.equal(rs.find(r=>r.id==='2017:1.1').type,'generiek_resultaat');assert.equal(rs.find(r=>r.id==='2017:1.1.1').type,'specifiek_resultaat');
});
test('lege query en geen betekenisadvies',()=>{assert.deepEqual(indices['2020'].zoek(''),[]);assert.equal(toelating('ai_voorgesteld','brongetoetst','verwant_begrip_voorstel',true),undefined);});

test('brede ingebedde term verdringt geen specifieke volledige tekstovereenkomst binnen dezelfde rang',()=>{
 const q='Notulen bouwvergadering monument';
 const a=maakZoekindex(datasets['1996-2012']).zoek(q);const b=indices['1996-2012'].zoek(q);
 assert.ok(a.length);assert.equal(b[0].id,a[0].id);
});

test('onbevestigde bewijzen kunnen de volgorde van toegelaten resultaten niet opwaarderen',()=>{
 for(const id of lijsten)for(const q of ['actueel','notulen','contract']){
  const b=indices[id].zoek(q);const c=indices[id].zoek(q,{onbevestigdeAi:true});
  assert.deepEqual(c.slice(0,b.length).map(r=>r.id),b.map(r=>r.id));
 }
});
