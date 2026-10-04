# Add an export target

1. Add the id to `EXPORT_TARGETS` in `src/core/exporters/types.ts`.
2. Create `src/core/exporters/targets/<id>.ts` with a `LayoutAdapter` (absolute and stacked wrappers) and a header function that lists dependencies to install.
3. Register it in `targets` in `src/core/exporters/index.ts`.
4. Add an exporter for the new target to every component's `exporters.ts`. Missing exporters fall back to a placeholder with a warning, and a test fails until all are present.
5. Run `pnpm test`, review the new snapshots, then add the library to `exporter-check/package.json` and run the type check from `exporter-check/README.md`. Generated code must compile.
