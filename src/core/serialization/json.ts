import { migrate, MigrationError } from "../document/migrations";
import { projectSchema } from "../document/schema";
import type { Project } from "../document/types";
import { validateProps } from "../registry";

export type ImportErrorCode =
  | "invalidJson"
  | "invalidShape"
  | "unsupportedVersion"
  | "invalidSchema"
  | "invalidProps";

export interface ImportError {
  code: ImportErrorCode;
  params: Record<string, string>;
}

export type ParseResult = { ok: true; project: Project } | { ok: false; error: ImportError };

export const FILE_EXTENSION = ".polyframe.json";

export function serializeProject(p: Project): string {
  return JSON.stringify(p, null, 2);
}

function formatPath(path: PropertyKey[]): string {
  return path.map(String).join(".") || "root";
}

export function parseProjectData(data: unknown): ParseResult {
  let migrated: unknown;
  try {
    migrated = migrate(data);
  } catch (e) {
    const code = e instanceof MigrationError ? e.code : "invalidShape";
    return { ok: false, error: { code, params: {} } };
  }
  const parsed = projectSchema.safeParse(migrated);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      ok: false,
      error: { code: "invalidSchema", params: { path: formatPath(issue.path), message: issue.message } },
    };
  }
  const project = parsed.data as Project;
  for (const node of Object.values(project.nodes)) {
    const r = validateProps(node.type, node.props);
    if (!r.success) {
      const issue = r.error.issues[0];
      return {
        ok: false,
        error: {
          code: "invalidProps",
          params: { name: node.name, path: formatPath(issue.path), message: issue.message },
        },
      };
    }
    node.props = r.data;
  }
  return { ok: true, project };
}

export function parseProjectJson(text: string): ParseResult {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: { code: "invalidJson", params: {} } };
  }
  return parseProjectData(data);
}
