import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: "*.spec.ts",
  workers: process.env.CI ? 2 : 4,
  timeout: 120000,
  reporter: [["list"]],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 2600, height: 1600 } },
    },
  ],
  webServer: [
    {
      command: "node_modules/.bin/vite --config fidelity/vite.config.ts",
      cwd: "..",
      url: "http://localhost:5174",
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: "pnpm start -p 3100",
      cwd: "../..",
      url: "http://localhost:3100/en/editor",
      reuseExistingServer: !process.env.CI,
      timeout: 180000,
    },
  ],
});
