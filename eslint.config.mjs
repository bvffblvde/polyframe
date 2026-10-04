import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const uiLibraries = { regex: "^(@mui|@mantine|@chakra-ui)/|^(antd|bootstrap)(/.*)?$", message: "Skins imitate UI kits, never import them." };
const coreOnly = {
  regex: "^(react|react-dom|next|zustand|zundo)(/.*)?$|^@/(stores|features|components|hooks|app)/",
  allowTypeImports: true,
  message: "src/core is framework-agnostic.",
};

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "no-restricted-imports": ["error", { patterns: [uiLibraries] }],
    },
  },
  {
    files: ["src/core/**/*.{ts,tsx}"],
    ignores: ["src/core/registry/components/**/*.tsx"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [uiLibraries, coreOnly] }],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "coverage/**", "playwright-report/**", "test-results/**"]),
]);
