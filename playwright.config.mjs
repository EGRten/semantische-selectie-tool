import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  outputDir: '/tmp/semantische-selectie-browserresultaten',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173/testpad/',
    viewport: { width: 1440, height: 1000 },
    launchOptions: process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
  },
  webServer: {
    command: 'node scripts/serve.mjs --base /testpad/' + (process.env.CONCORDANS_BRON_JSON?' --concordans-env':''),
    url: 'http://127.0.0.1:4173/testpad/',
    reuseExistingServer: false,
  },
});
