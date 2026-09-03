import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'npx next start -p 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: false,
    timeout: 120_000
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});
