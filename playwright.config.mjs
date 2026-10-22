import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  retries: 0,
  workers: 2,
  reporter: process.env.PLAYWRIGHT_JSON_OUTPUT_NAME ? [['json', { outputFile: process.env.PLAYWRIGHT_JSON_OUTPUT_NAME }]] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:48137',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {},
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node scripts/build-fixtures.mjs && node tests/server.mjs',
    url: 'http://127.0.0.1:48137/fuse/blog/',
    timeout: 120_000,
    reuseExistingServer: false,
  },
});
