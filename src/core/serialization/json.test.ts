import { describe, expect, it } from "vitest";
import { addNodes } from "../document/ops";
import { migrate, MigrationError } from "../document/migrations";
import { makeNode, makeProject } from "../test/fixtures";
import { parseProjectJson, serializeProject } from "./json";

const valid = () =>
  addNodes(makeProject(), [makeNode("n1", "a1", { props: { label: "Go", variant: "solid", size: "md", disabled: false } })]);

describe("json serialization", () => {
  it("round-trips a project", () => {
    const p = valid();
    const r = parseProjectJson(serializeProject(p));
    expect(r).toEqual({ ok: true, project: p });
  });

  it("rejects invalid json", () => {
    expect(parseProjectJson("{nope")).toMatchObject({ ok: false, error: { code: "invalidJson" } });
  });

  it("rejects non-objects and future versions", () => {
    expect(parseProjectJson("[]")).toMatchObject({ ok: false, error: { code: "invalidShape" } });
    expect(parseProjectJson(JSON.stringify({ ...valid(), schemaVersion: 99 }))).toMatchObject({
      ok: false,
      error: { code: "unsupportedVersion" },
    });
  });

  it("reports schema issues with a path", () => {
    const bad = { ...valid(), settings: { ...valid().settings, skin: "chakra" } };
    const r = parseProjectJson(JSON.stringify(bad));
    expect(r).toMatchObject({ ok: false, error: { code: "invalidSchema", params: { path: "settings.skin" } } });
  });

  it("rejects orphan nodes and bad order references", () => {
    const p = valid();
    const orphan = { ...p, artboards: { a1: { ...p.artboards.a1, childOrder: [] } } };
    expect(parseProjectJson(JSON.stringify(orphan))).toMatchObject({ ok: false, error: { code: "invalidSchema" } });
    const badOrder = { ...p, artboardOrder: ["a1", "zz"] };
    expect(parseProjectJson(JSON.stringify(badOrder))).toMatchObject({ ok: false, error: { code: "invalidSchema" } });
  });

  it("validates component props", () => {
    const p = valid();
    p.nodes.n1.props = { label: 5 };
    expect(parseProjectJson(JSON.stringify(p))).toMatchObject({ ok: false, error: { code: "invalidProps" } });
  });
});

describe("migrations", () => {
  it("runs migration steps in order", () => {
    const out = migrate({ schemaVersion: 0, a: 1 }, { 0: (d) => ({ ...d, b: 2 }) });
    expect(out).toEqual({ schemaVersion: 1, a: 1, b: 2 });
  });
  it("fails when a step is missing", () => {
    expect(() => migrate({ a: 1 })).toThrow(MigrationError);
    expect(() => migrate(null)).toThrow(MigrationError);
  });
});
