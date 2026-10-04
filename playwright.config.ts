import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: { baseURL: "http://localhost:3000", trace: "on-first-retry", viewport: { width: 1440, height: 900 } },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } }],
  webServer: {
    command: process.env.CI ? "pnpm start -p 3000" : "pnpm dev -p 3000",
    url: "http://localhost:3000/en/editor",
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
  },
});
