// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://github.com',
    trace: 'on',
  },
  testDir: './tests',
  timeout: 30 * 1000,
});