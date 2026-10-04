import { createProject } from "../document/ops";
import type { Artboard, Node, Project } from "../document/types";

export function counterIds(prefix = "id") {
  let i = 0;
  return () => `${prefix}${++i}`;
}

export function makeArtboard(id: string, patch: Partial<Artboard> = {}): Artboard {
  return { id, name: id, x: 0, y: 0, width: 1440, height: 1024, preset: "desktop", childOrder: [], ...patch };
}

export function makeNode(id: string, artboardId = "a1", patch: Partial<Node> = {}): Node {
  return {
    id,
    type: "button",
    artboardId,
    name: id,
    x: 0,
    y: 0,
    w: 100,
    h: 40,
    locked: false,
    hidden: false,
    opacity: 1,
    props: { label: "Go" },
    ...patch,
  };
}

export function makeProject(): Project {
  return createProject({ id: "p1", name: "Test", now: "2026-01-01T00:00:00.000Z", artboard: makeArtboard("a1") });
}
