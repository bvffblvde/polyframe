import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  test: {
    setupFiles: ["./vitest.setup.ts"],
    css: false,
    projects: [
      { extends: true, test: { name: "unit", environment: "node", include: ["src/**/*.test.ts", "bench/**/*.test.ts"] } },
      { extends: true, test: { name: "dom", environment: "jsdom", include: ["src/**/*.test.tsx"] } },
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      include: ["src/core/document/ops.ts", "src/core/document/autolayout.ts", "src/core/geometry/**/*.ts"],
      exclude: ["**/*.test.ts"],
      thresholds: { lines: 90, functions: 90, statements: 90, branches: 85 },
    },
  },
});
