import path from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-a11y"],
  framework: { name: "@storybook/react-vite", options: {} },
  viteFinal: async (vite) => ({
    ...vite,
    publicDir: false,
    resolve: { ...vite.resolve, alias: { ...vite.resolve?.alias, "@": path.resolve(import.meta.dirname, "../src") } },
  }),
};

export default config;
