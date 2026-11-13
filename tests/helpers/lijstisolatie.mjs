import {expect} from '@playwright/test';

export function isolatieLocators(paneel,lijst){
 if(!['1996-2012','2017','2020'].includes(lijst))throw Error('Onbekende testselectielijst');
 return {alle:paneel.locator('[data-zoekresultaat]'),vreemd:paneel.locator(`[data-zoekresultaat]:not([data-zoekresultaat^="${lijst}:"])`)};
}
// Zelfde eis als every(startsWith): geen enkel resultaat buiten de actieve lijst.
// Bovendien mag de controle niet vacuüm slagen op een lege verzameling.
export async function controleerLijstisolatie(paneel,lijst){
 const {alle,vreemd}=isolatieLocators(paneel,lijst);
 expect(await alle.count(),'Isolatie vereist daadwerkelijk gevonden resultaten').toBeGreaterThan(0);
 expect(await vreemd.count(),'Alle resultaatattributen moeten bij de actieve lijst horen').toBe(0);
}
