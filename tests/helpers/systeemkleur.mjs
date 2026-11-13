import {expect} from '@playwright/test';
export async function controleerSysteemkleurAanpassing(doel){
 const r=await doel.evaluate(e=>({ondersteund:CSS.supports('forced-color-adjust','auto'),computed:getComputedStyle(e).getPropertyValue('forced-color-adjust')}));
 console.log('CSS-systeemkleurondersteuning '+JSON.stringify(r));
 // Een niet-ondersteunde CSS-eigenschap heeft geen computed waarde. Overige selectie-/focustests blijven strikt.
 if(r.ondersteund)expect(r.computed).toBe('auto');else expect(r.computed).toBe('');
}
