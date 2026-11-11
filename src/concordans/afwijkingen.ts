/** Gerichte technische onderzoeksregistratie 10A; geen oorspronkelijke bron of inhoudelijke goedkeuring. */
export type Afwijkingsbeoordeling = {
  readonly bronrij_id:string; readonly categorie:'A'|'B'|'C'; readonly onderwerp:string;
  readonly oorspronkelijke_doelwaarde:string; readonly kandidaten:readonly string[];
  readonly onderbouwing:string; readonly technische_wijziging:string;
};
const geval=(rij:number,categorie:'A'|'B'|'C',onderwerp:string,doelwaarde:string,kandidaten:readonly string[],onderbouwing:string,wijziging='Geen; bestaande bronwaarden en koppelingen behouden.'):Afwijkingsbeoordeling=>({bronrij_id:`concordans:rij:${rij}`,categorie,onderwerp,oorspronkelijke_doelwaarde:doelwaarde,kandidaten,onderbouwing,technische_wijziging:wijziging});
const gevallen:readonly Afwijkingsbeoordeling[]=[
 geval(6,'B','Historisch eindpunt','9.1.1',['1996-2012:2.1::002','1996-2012:2.1::001'],'A4:A7 geeft uitsluitend rubriekcontext; B:D zijn in rij 6 leeg en niet samengevoegd. Tijdelijke status sluit verschillende historische rollen niet uit.'),
 geval(21,'B','Onvolledige doelcode','19.1.',['2020:19.1','2020:19.1.11'],'Generiek 19.1 is plausibel, maar de afsluitende punt kan ook een onvolledige specifieke code aanduiden. Lege H en vijf jaar bewijzen de ontbrekende code niet.'),
 geval(89,'B','Historisch eindpunt','11.1',['1996-2012:2.12::001','1996-2012:2.12::002'],'A87:A91 identificeert rubriek 2.12. Toestemming gebruik maakt niet duidelijk of de onderliggende archiefbescheiden te bewaren zijn; beide voorschriften blijven mogelijk.'),
 geval(90,'B','Historisch eindpunt','3.1',['1996-2012:2.12::001','1996-2012:2.12::002'],'Beveiligingsplan identificeert geen historisch bewaar-/vernietigingsvoorschrift. D is leeg en B:D zijn niet samengevoegd.'),
 geval(293,'B','Historisch eindpunt','9.3.3',['1996-2012:3.5.4::001','1996-2012:3.5.4::002','1996-2012:3.5.4::003'],'A289:A293 en E290:E293 geven context; B:D zijn leeg. Beëindigde delegatie/mandatering kan verschillende actorrelaties betreffen.'),
 geval(434,'B','Historisch eindpunt','7.1.23',['1996-2012:3.7.3::002','1996-2012:3.7.3::001'],'A432:A434 en E433:E434 verbinden het onderwerp, niet B:D. Optieverklaring mag niet zonder beoordeling met naturalisatie of nationaliteitsonderzoek worden gelijkgesteld.'),
 geval(442,'B','Historisch eindpunt','7.1.24',['1996-2012:3.7.6::001','1996-2012:3.7.6::002'],'A440:A443 geeft rijbewijscontext; B:D blijven leeg. Fraudeverwerking kan aanvraag/afgifte of ongeldigverklaring betreffen; nabijheid is onvoldoende.'),
 ...[50,51,52].map((rij,i)=>geval(rij,'B','Historische tekstvariant',['20.1','19.2','20.1.4'][i]!,['1996-2012:2.8::001'],'C50:C52 noemt uitsluitend door de gemeente verstrekte opgaven; de officiële tekst noemt door en aan de gemeente. Dat verschil raakt mogelijk het toepassingsbereik. De unieke rij-/mergekoppeling blijft technisch geldig.')),
 geval(218,'A','Lege historische omschrijving','19.1.1',['1996-2012:3.2.4::001'],'C218 is leeg, A218 noemt Salarisadministratie, D218 zeven jaar en de dataset verwijst rechtstreeks naar rij 218. Geen tekst wordt in C aangevuld.'),
 geval(262,'A','Lege historische omschrijving','16.1.1',['1996-2012:3.4.3::001'],'C262 is leeg, A262 noemt Verkoop en D262 zeven jaar; de bestaande directe rijreferentie is uniek. Geen bronwaarde wordt aangevuld.'),
 geval(380,'A','Concordansredactionele toevoeging','19.1.4',['1996-2012:3.6.2::024'],'Het extra fragment [in deze concordans genummerd als p t/m w] verklaart de eigen subletters. Het is geen officiële codering; de overige verklaring, B-waardering en directe bronrijidentiteit blijven gelijk.'),
 geval(469,'A','Letterlijke tekstvariant','Te bewaren register zoals vermeld in bijlage 4 van de selectielijst',['1996-2012:3.8.5::004'],'Concordans vermeldt verzicht, de officiële tekst overzicht. De oorzaak van de letteromissie is niet bewezen. Titel, B-waardering en directe rijreferentie ondersteunen dezelfde technische recordidentiteit.'),
 geval(716,'A','Afzonderlijke doelcorrectie','19.21.1',['2020:19.2.1'],'F716 heeft een niet-bestaande code; G716 Niet verwerkt en H716 Scans kentekens identificeren samen uitsluitend 2020:19.2.1. A706:D718 sluit een historische 1996-relatie uit. Het eerdere voorstel wordt technisch bevestigd, niet inhoudelijk vrijgegeven.','Alleen de rijgerichte doelkoppeling krijgt technisch_gecorrigeerd; broncode en alle broncellen blijven intact. Geen historische relatie aangemaakt.'),
];
export function beoordelingBij(rij:number):Afwijkingsbeoordeling|undefined{return gevallen.find(g=>g.bronrij_id===`concordans:rij:${rij}`);}
