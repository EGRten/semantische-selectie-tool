import {test} from 'node:test';import assert from 'node:assert/strict';
import {geldigeBrowsernaam} from './helpers/downloadnaam.mjs';
test('uitsluitend WebKit mag spaties als underscores voorstellen; extensie en overige tekens blijven exact',()=>{
 const naam='Selectielijst 2020.xlsx';for(const engine of ['chromium','firefox','webkit'])assert.equal(geldigeBrowsernaam(engine,naam,naam),true);
 assert.equal(geldigeBrowsernaam('webkit',naam,'Selectielijst_2020.xlsx'),true);
 for(const engine of ['chromium','firefox'])assert.equal(geldigeBrowsernaam(engine,naam,'Selectielijst_2020.xlsx'),false);
 for(const fout of ['Selectielijst_2020.xls','Selectielijst_2020 (1).xlsx','selectielijst_2020.xlsx','andere.xlsx'])assert.equal(geldigeBrowsernaam('webkit',naam,fout),false);
});
