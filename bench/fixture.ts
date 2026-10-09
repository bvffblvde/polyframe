import en from "../messages/en.json";
import { createProject } from "../src/core/document/ops";
import type { ComponentType, Node, Project } from "../src/core/document/types";
import { createNode } from "../src/core/registry/create-node";
import type { Translator } from "../src/core/registry/types";

const MIX: ComponentType[] = [
  "button",
  "input",
  "heading",
  "text",
  "checkbox",
  "badge",
  "avatar",
  "card",
  "progress",
  "switch",
];
const CELL = { w: 160, h: 72, gap: 16 };

const t: Translator = (key) => {
  let cur: unknown = en.defaults;
  for (const part of key.split(".")) cur = (cur as Record<string, unknown>)[part];
  return typeof cur === "string" ? cur : key;
};

export function benchProject(count: number): Project {
  const cols = Math.ceil(Math.sqrt(count * 0.6));
  const rows = Math.ceil(count / cols);
  const width = cols * (CELL.w + CELL.gap) + CELL.gap;
  const height = rows * (CELL.h + CELL.gap) + CELL.gap;
  const artboard = {
    id: "ab",
    name: "Bench",
    x: 0,
    y: 0,
    width,
    height,
    preset: "custom" as const,
    childOrder: [],
  };
  const project = createProject({
    id: "bench",
    name: `Bench ${count}`,
    now: "2026-01-01T00:00:00.000Z",
    artboard,
  });
  const nodes: Record<string, Node> = {};
  const order: string[] = [];
  for (let i = 0; i < count; i++) {
    const id = `n${i}`;
    const type = MIX[i % MIX.length];
    nodes[id] = createNode({
      id,
      type,
      artboardId: "ab",
      name: `${type} ${i}`,
      rect: {
        x: CELL.gap + (i % cols) * (CELL.w + CELL.gap),
        y: CELL.gap + Math.floor(i / cols) * (CELL.h + CELL.gap),
        w: CELL.w,
        h: CELL.h,
      },
      t,
    });
    order.push(id);
  }
  return { ...project, nodes, artboards: { ab: { ...artboard, childOrder: order } } };
}
