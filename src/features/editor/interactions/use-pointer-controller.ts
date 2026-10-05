"use client";

import { useEffect, type RefObject } from "react";
import { descendants, insertionIndex, isStack, placeInStack, setParent, stackParent } from "@/core/document/autolayout";
import { groupMembers, moveNodes, setNodeRects } from "@/core/document/ops";
import type { ID, Rect } from "@/core/document/types";
import { snapToGuides } from "@/core/geometry/guides";
import { nodesInRect } from "@/core/geometry/hit-test";
import { boundsOf, normalizeRect, offsetRect, type Point } from "@/core/geometry/rect";
import { resizeRect, type Handle } from "@/core/geometry/resize";
import { snapDelta } from "@/core/geometry/snap";
import { screenToWorld, type Viewport } from "@/core/geometry/viewport";
import { registry } from "@/core/registry";
import { useDocumentStore } from "@/stores/document-store";
import { useEditorStore } from "@/stores/editor-store";

type Gesture =
  | { kind: "pressing"; start: Point; nodeId: ID; wasSelected: boolean; shift: boolean }
  | {
      kind: "dragging";
      start: Point;
      primary: ID;
      ids: ID[];
      rects: Record<ID, Rect>;
      dx: number;
      dy: number;
      drop: { stackId: ID; index: number } | null;
    }
  | { kind: "resizing"; start: Point; id: ID; handle: Handle; rect: Rect; next: Rect }
  | { kind: "marquee"; start: Point; base: ID[] }
  | { kind: "panning"; start: Point; vp: Viewport };

const THRESHOLD = 3;

export function usePointerController(ref: RefObject<HTMLDivElement | null>, readOnly: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let g: Gesture | null = null;
    let frame = 0;
    let pending: (() => void) | null = null;

    const ed = () => useEditorStore.getState();
    const project = () => useDocumentStore.getState().project;
    const local = (e: PointerEvent): Point => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const schedule = (fn: () => void) => {
      pending = fn;
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          pending?.();
          pending = null;
        });
    };
    const flush = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      pending?.();
      pending = null;
    };

    const onDown = (e: PointerEvent) => {
      if (e.button === 2) return;
      const target = e.target as HTMLElement;
      const start = local(e);
      el.focus({ preventScroll: true });
      if (e.button === 1 || ed().spaceDown || (readOnly && e.button === 0)) {
        e.preventDefault();
        g = { kind: "panning", start, vp: ed().viewport };
        ed().set({ interaction: "panning" });
        el.setPointerCapture(e.pointerId);
        return;
      }
      if (e.button !== 0) return;
      const p = project();
      if (!p) return;
      el.setPointerCapture(e.pointerId);
      const handle = target.closest<HTMLElement>("[data-handle]")?.dataset.handle as Handle | undefined;
      const sel = ed().selection;
      if (handle && sel.length === 1 && p.nodes[sel[0]]) {
        const n = p.nodes[sel[0]];
        const rect = { x: n.x, y: n.y, w: n.w, h: n.h };
        g = { kind: "resizing", start, id: n.id, handle, rect, next: rect };
        ed().set({ interaction: "resizing" });
        return;
      }
      const nodeId = target.closest<HTMLElement>("[data-node-id]")?.dataset.nodeId;
      if (nodeId && p.nodes[nodeId]) {
        const wasSelected = sel.includes(nodeId);
        const members = groupMembers(p, [nodeId]);
        if (e.shiftKey) {
          ed().select(wasSelected ? sel.filter((x) => !members.includes(x)) : [...new Set([...sel, ...members])]);
        } else if (!wasSelected) ed().select(members);
        ed().set({ activeArtboardId: p.nodes[nodeId].artboardId });
        g = { kind: "pressing", start, nodeId, wasSelected, shift: e.shiftKey };
        return;
      }
      const artboardId = target.closest<HTMLElement>("[data-artboard-id]")?.dataset.artboardId;
      if (artboardId) ed().set({ activeArtboardId: artboardId });
      const base = e.shiftKey ? sel : [];
      if (!e.shiftKey) ed().select([]);
      g = { kind: "marquee", start, base };
    };

    const onMove = (e: PointerEvent) => {
      const cur = local(e);
      if (!g) {
        if (readOnly) return;
        const id = (e.target as HTMLElement).closest<HTMLElement>("[data-node-id]")?.dataset.nodeId ?? null;
        if (ed().hoveredId !== id) ed().set({ hoveredId: id });
        return;
      }
      const vp = ed().viewport;
      const dx = (cur.x - g.start.x) / vp.zoom;
      const dy = (cur.y - g.start.y) / vp.zoom;
      const p = project();
      if (!p) return;
      const grid = p.settings.grid;
      const snap = grid.enabled && !e.altKey ? grid.size : 0;

      if (g.kind === "pressing") {
        if (Math.hypot(cur.x - g.start.x, cur.y - g.start.y) < THRESHOLD) return;
        const picked = ed().selection.filter((id) => p.nodes[id] && !p.nodes[id].locked);
        const ids = [...new Set([...picked, ...picked.flatMap((id) => descendants(p, id))])];
        if (!ids.includes(g.nodeId)) {
          g = null;
          return;
        }
        const rects: Record<ID, Rect> = {};
        for (const id of ids) {
          const n = p.nodes[id];
          rects[id] = { x: n.x, y: n.y, w: n.w, h: n.h };
        }
        g = { kind: "dragging", start: g.start, primary: g.nodeId, ids, rects, dx: 0, dy: 0, drop: null };
        ed().set({ interaction: "dragging", hoveredId: null });
      }
      if (g.kind === "dragging") {
        const pr = g.rects[g.primary];
        let sx = snap ? snapDelta(pr.x, dx, snap) : Math.round(dx);
        let sy = snap ? snapDelta(pr.y, dy, snap) : Math.round(dy);
        const artboardId = p.nodes[g.primary].artboardId;
        const ab = p.artboards[artboardId];
        const moving = new Set(g.ids);
        const bounds = boundsOf(Object.values(g.rects).map((r) => offsetRect(r, sx, sy)));
        let guides = null;
        if (bounds && !e.altKey) {
          const targets = ab.childOrder
            .filter((id) => !moving.has(id) && !p.nodes[id].hidden)
            .map((id) => p.nodes[id] as Rect);
          targets.push({ x: 0, y: 0, w: ab.width, h: ab.height });
          const res = snapToGuides(bounds, targets, 5 / vp.zoom);
          sx += res.dx;
          sy += res.dy;
          guides = { artboardId, lines: res.lines, labels: res.labels };
        }
        g.dx = sx;
        g.dy = sy;
        const rects = g.rects;
        const world = screenToWorld(cur, vp);
        const point = { x: world.x - ab.x, y: world.y - ab.y };
        const target = ab.childOrder
          .map((id) => p.nodes[id])
          .filter((n) => isStack(n) && !moving.has(n.id) && !n.hidden && point.x >= n.x && point.x <= n.x + n.w && point.y >= n.y && point.y <= n.y + n.h)
          .sort((a, b) => a.w * a.h - b.w * b.h)[0];
        const dropTarget = target ? { stackId: target.id, index: insertionIndex(p, target.id, point, g.ids) } : null;
        g.drop = dropTarget;
        schedule(() => {
          const preview: Record<ID, Rect> = {};
          for (const [id, r] of Object.entries(rects)) preview[id] = offsetRect(r, sx, sy);
          ed().set({ preview, guides, dropTarget });
        });
      } else if (g.kind === "resizing") {
        const n = p.nodes[g.id];
        if (!n) return;
        const next = resizeRect(g.rect, g.handle, dx, dy, {
          keepAspect: e.shiftKey,
          fromCenter: e.altKey,
          minSize: registry[n.type].minSize,
          snap: snap || undefined,
        });
        g.next = next;
        const id = g.id;
        schedule(() => ed().set({ preview: { [id]: next } }));
      } else if (g.kind === "marquee") {
        const a = screenToWorld(g.start, vp);
        const b = screenToWorld(cur, vp);
        const rect = normalizeRect(a, b);
        const base = g.base;
        schedule(() => {
          const hits = new Set(base);
          for (const aid of p.artboardOrder) {
            const ab = p.artboards[aid];
            const local = { x: rect.x - ab.x, y: rect.y - ab.y, w: rect.w, h: rect.h };
            for (const id of nodesInRect(ab.childOrder.map((nid) => p.nodes[nid]), local)) hits.add(id);
          }
          ed().set({ marquee: rect, selection: groupMembers(p, [...hits]) });
        });
      } else if (g.kind === "panning") {
        const { vp: start } = g;
        const nx = start.x + cur.x - g.start.x;
        const ny = start.y + cur.y - g.start.y;
        schedule(() => ed().set({ viewport: { ...start, x: nx, y: ny } }));
      }
    };

    const onUp = (e: PointerEvent) => {
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      flush();
      const cur = g;
      g = null;
      if (!cur) return;
      const apply = useDocumentStore.getState().apply;
      if (cur.kind === "dragging") {
        ed().set({ preview: null, guides: null, dropTarget: null, interaction: "idle" });
        const moving = new Set(cur.ids);
        const drop = cur.drop;
        apply((p) => {
          const roots = cur.ids.filter((id) => !p.nodes[id]?.parentId || !moving.has(p.nodes[id].parentId as ID));
          const moved = cur.dx || cur.dy ? moveNodes(p, cur.ids, cur.dx, cur.dy) : p;
          if (drop) return placeInStack(moved, roots, drop.stackId, drop.index);
          const detach = roots.filter((id) => moved.nodes[id] && stackParent(moved, moved.nodes[id]));
          return detach.length ? setParent(moved, detach, undefined) : moved;
        });
      } else if (cur.kind === "resizing") {
        ed().set({ preview: null, interaction: "idle" });
        const r = cur.rect;
        const n = cur.next;
        if (n.x !== r.x || n.y !== r.y || n.w !== r.w || n.h !== r.h) apply((p) => setNodeRects(p, { [cur.id]: n }));
      } else if (cur.kind === "pressing") {
        const pr = project();
        if (!cur.shift && cur.wasSelected && pr) ed().select(groupMembers(pr, [cur.nodeId]));
      } else {
        ed().set({ marquee: null, interaction: "idle" });
      }
    };

    const onLeave = () => {
      if (!g && ed().hoveredId) ed().set({ hoveredId: null });
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [ref, readOnly]);
}
