// Afzonderlijke browsermatrix; de gewone Chromium-regressieconfig blijft intact.
import {defineConfig} from '@playwright/test';
import basis from './playwright.config.mjs';
const alleenChromium=/Systeem is standaard; kleur, contrast|echte 200% en 400% Chromium|echte browserlettervoorkeur|alle paletten blijven bruikbaar/;
export default defineConfig({
 ...basis,
 outputDir:'/tmp/semantische-compatibiliteit',
 use:{...basis.use,baseURL:'http://127.0.0.1:4188/semantische-selectie-tool/',launchOptions:{}},
 webServer:{command:'node scripts/serve.mjs --port 4188 --base /semantische-selectie-tool/',url:'http://127.0.0.1:4188/semantische-selectie-tool/',reuseExistingServer:false},
 projects:['chromium','firefox','webkit'].map(naam=>({
  name:naam,
  use:{browserName:naam,launchOptions:naam==='chromium'&&process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}},
  // Deze bestaande proeven gebruiken Chrome-instellingen/CDP, geen Firefox/WebKit.
  ...(naam==='chromium'?{}:{grepInvert:alleenChromium}),
 })),
});
