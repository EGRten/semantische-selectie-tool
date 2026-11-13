// Afzonderlijke browsermatrix; de gewone Chromium-regressieconfig blijft intact.
import {defineConfig} from '@playwright/test';
import basis from './playwright.config.mjs';
import {join} from 'node:path';
const ci=process.env.CI==='true';
if(ci&&(!process.env.AXE_SOURCE||!process.env.COMPAT_RAW_REPORT_DIR||!['chromium','firefox','webkit'].includes(process.env.COMPAT_BROWSER)))throw Error('CI vereist axe-bron, rapportmap en expliciete browser.');
const alleenChromium=/Systeem is standaard; kleur, contrast|echte 200% en 400% Chromium|echte browserlettervoorkeur|alle paletten blijven bruikbaar/;
export default defineConfig({
 ...basis,
 outputDir:ci?join(process.env.RUNNER_TEMP??'/tmp','compat-uitvoer',process.env.COMPAT_BROWSER):'/tmp/semantische-compatibiliteit',
 retries:ci?1:0,
 forbidOnly:ci,
 failOnFlakyTests:ci,
 reporter:ci?[['list'],['json',{outputFile:join(process.env.COMPAT_RAW_REPORT_DIR,process.env.COMPAT_BROWSER+'.json')}]]:basis.reporter,
 use:{...basis.use,baseURL:'http://127.0.0.1:4188/semantische-selectie-tool/',launchOptions:{},trace:'off',screenshot:'off',video:'off'},
 webServer:{command:'node scripts/serve.mjs --port 4188 --base /semantische-selectie-tool/',url:'http://127.0.0.1:4188/semantische-selectie-tool/',reuseExistingServer:false},
 projects:['chromium','firefox','webkit'].map(naam=>({
  name:naam,
  use:{browserName:naam,launchOptions:naam==='chromium'&&process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}},
  // Deze bestaande proeven gebruiken Chrome-instellingen/CDP, geen Firefox/WebKit.
  ...(naam==='chromium'?{}:{grepInvert:alleenChromium}),
 })),
});
