import { defineConfig, devices } from "@playwright/test";

const port = 3100;

export default defineConfig({
  testDir: ".",
  testMatch: "*.bench.ts",
  workers: 1,
  timeout: 300000,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${port}`, viewport: { width: 1440, height: 900 } },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: `pnpm start -p ${port}`,
    url: `http://localhost:${port}/en/editor`,
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
  },
});
