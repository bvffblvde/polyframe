"use client";

import { useShallow } from "zustand/react/shallow";
import type { Rect } from "@/core/document/types";
import { boundsOf } from "@/core/geometry/rect";
import { HANDLES, type Handle } from "@/core/geometry/resize";
import type { Viewport } from "@/core/geometry/viewport";
import { useDocumentStore } from "@/stores/document-store";
import { useEditorStore } from "@/stores/editor-store";

const CURSORS: Record<Handle, string> = {
  nw: "nwse-resize",
  se: "nwse-resize",
  ne: "nesw-resize",
  sw: "nesw-resize",
  n: "ns-resize",
  s: "ns-resize",
  e: "ew-resize",
  w: "ew-resize",
};

function toScreen(r: Rect, vp: Viewport): Rect {
  return { x: r.x * vp.zoom + vp.x, y: r.y * vp.zoom + vp.y, w: r.w * vp.zoom, h: r.h * vp.zoom };
}

function handlePos(r: Rect, h: Handle) {
  const x = h.includes("w") ? r.x : h.includes("e") ? r.x + r.w : r.x + r.w / 2;
  const y = h.includes("n") ? r.y : h.includes("s") ? r.y + r.h : r.y + r.h / 2;
  return { left: x - 4, top: y - 4 };
}

export function SelectionOverlay() {
  const vp = useEditorStore((s) => s.viewport);
  const selection = useEditorStore((s) => s.selection);
  const hoveredId = useEditorStore((s) => s.hoveredId);
  const preview = useEditorStore((s) => s.preview);
  const marquee = useEditorStore((s) => s.marquee);
  const interaction = useEditorStore((s) => s.interaction);
  const ids = hoveredId && !selection.includes(hoveredId) ? [...selection, hoveredId] : selection;
  const nodes = useDocumentStore(useShallow((s) => ids.map((id) => s.project?.nodes[id])));
  const artboards = useDocumentStore((s) => s.project?.artboards);
  if (!artboards) return null;

  const rects = nodes.flatMap((n) => {
    if (!n || n.hidden || !artboards[n.artboardId]) return [];
    const a = artboards[n.artboardId];
    const r = preview?.[n.id] ?? n;
    return [{ id: n.id, locked: n.locked, world: { x: a.x + r.x, y: a.y + r.y, w: r.w, h: r.h } }];
  });
  const selected = rects.filter((r) => selection.includes(r.id));
  const hovered = rects.find((r) => r.id === hoveredId && !selection.includes(r.id));
  const single = selected.length === 1 && !selected[0].locked ? selected[0] : null;
  const group = selected.length > 1 ? boundsOf(selected.map((r) => r.world)) : null;
  const showHandles = single && (interaction === "idle" || interaction === "resizing");

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" data-overlay>
      {hovered && interaction === "idle" && (
        <Box rect={toScreen(hovered.world, vp)} className="border border-sky-500/70" />
      )}
      {selected.map((r) => (
        <Box key={r.id} rect={toScreen(r.world, vp)} className="border-[1.5px] border-sky-500" />
      ))}
      {group && <Box rect={toScreen(group, vp)} className="border border-dashed border-sky-500" />}
      {showHandles &&
        HANDLES.map((h) => {
          const s = toScreen(single.world, vp);
          return (
            <div
              key={h}
              data-handle={h}
              className="pointer-events-auto absolute size-2 border border-sky-500 bg-white"
              style={{ ...handlePos(s, h), cursor: CURSORS[h] }}
            />
          );
        })}
      {single && interaction === "resizing" && (
        <SizeLabel rect={toScreen(single.world, vp)} w={single.world.w} h={single.world.h} />
      )}
      {marquee && <Box rect={toScreen(marquee, vp)} className="border border-sky-500 bg-sky-500/10" />}
    </div>
  );
}

function Box({ rect, className }: { rect: Rect; className: string }) {
  return (
    <div
      className={`absolute ${className}`}
      style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
    />
  );
}

function SizeLabel({ rect, w, h }: { rect: Rect; w: number; h: number }) {
  return (
    <div
      className="absolute rounded bg-sky-500 px-1.5 py-0.5 text-[11px] text-white tabular-nums"
      style={{ left: rect.x + rect.w / 2, top: rect.y + rect.h + 8, transform: "translateX(-50%)" }}
    >
      {Math.round(w)} × {Math.round(h)}
    </div>
  );
}
