import { CURRENT_SCHEMA_VERSION } from "./schema";

type Migration = (doc: Record<string, unknown>) => Record<string, unknown>;

export const migrations: Record<number, Migration> = {};

export class MigrationError extends Error {
  constructor(public readonly code: "unsupportedVersion" | "invalidShape") {
    super(code);
  }
}

export function migrate(input: unknown, steps: Record<number, Migration> = migrations): unknown {
  if (typeof input !== "object" || input === null || Array.isArray(input)) throw new MigrationError("invalidShape");
  let doc = input as Record<string, unknown>;
  let version = typeof doc.schemaVersion === "number" ? doc.schemaVersion : 0;
  if (version > CURRENT_SCHEMA_VERSION) throw new MigrationError("unsupportedVersion");
  while (version < CURRENT_SCHEMA_VERSION) {
    const step = steps[version];
    if (!step) throw new MigrationError("unsupportedVersion");
    doc = step(doc);
    version += 1;
    doc = { ...doc, schemaVersion: version };
  }
  return doc;
}
