import type { Artboard, ID, Rect } from "../../document/types";
import type { LayoutStrategy } from "../types";
import { inferRows } from "./rows";

export interface LayoutAdapter {
  absoluteRoot(a: Artboard, children: string): string;
  absoluteItem(r: Rect, opacity: number, child: string): string;
  stackRoot(a: Artboard, children: string): string;
  stackRow(marginTop: number, children: string): string;
  stackItem(marginLeft: number, marginTop: number, r: Rect, opacity: number, child: string): string;
  stackContainer(marginLeft: number, marginTop: number, r: Rect, opacity: number, background: string, children: string): string;
}

export interface LayoutEntry {
  id: ID;
  rect: Rect;
  opacity: number;
  jsx: string;
  container?: boolean;
}

const contains = (outer: Rect, inner: Rect) =>
  inner.x >= outer.x && inner.y >= outer.y && inner.x + inner.w <= outer.x + outer.w && inner.y + inner.h <= outer.y + outer.h;

export function nestEntries(entries: LayoutEntry[]): Map<ID | null, LayoutEntry[]> {
  const tree = new Map<ID | null, LayoutEntry[]>();
  entries.forEach((e, index) => {
    let parent: LayoutEntry | null = null;
    entries.forEach((c, ci) => {
      if (!c.container || c.id === e.id || !contains(c.rect, e.rect)) return;
      const area = c.rect.w * c.rect.h;
      const same = area === e.rect.w * e.rect.h;
      if (same && ci > index) return;
      if (!parent || area < parent.rect.w * parent.rect.h) parent = c;
    });
    const key = parent ? (parent as LayoutEntry).id : null;
    tree.set(key, [...(tree.get(key) ?? []), e]);
  });
  return tree;
}

function stack(tree: Map<ID | null, LayoutEntry[]>, parent: ID | null, origin: { x: number; y: number }, adapter: LayoutAdapter): string {
  const entries = tree.get(parent) ?? [];
  const byId = new Map(entries.map((e) => [e.id, e]));
  let prevBottom = 0;
  return inferRows(entries.map((e) => ({ id: e.id, rect: { ...e.rect, x: e.rect.x - origin.x, y: e.rect.y - origin.y } })))
    .map((row) => {
      let prevRight = 0;
      const items = row.items.map((item) => {
        const e = byId.get(item.id);
        if (!e) return "";
        const ml = Math.max(0, item.rect.x - prevRight);
        const mt = item.rect.y - row.top;
        prevRight = Math.max(prevRight, item.rect.x + item.rect.w);
        const children = tree.get(e.id);
        return children?.length
          ? adapter.stackContainer(ml, mt, e.rect, e.opacity, e.jsx, stack(tree, e.id, e.rect, adapter))
          : adapter.stackItem(ml, mt, e.rect, e.opacity, e.jsx);
      });
      const mt = Math.max(0, row.top - prevBottom);
      prevBottom = row.bottom;
      return adapter.stackRow(mt, items.join("\n"));
    })
    .join("\n");
}

export function applyLayout(strategy: LayoutStrategy, a: Artboard, entries: LayoutEntry[], adapter: LayoutAdapter): string {
  if (strategy === "absolute") {
    return adapter.absoluteRoot(a, entries.map((e) => adapter.absoluteItem(e.rect, e.opacity, e.jsx)).join("\n"));
  }
  return adapter.stackRoot(a, stack(nestEntries(entries), null, { x: 0, y: 0 }, adapter));
}
