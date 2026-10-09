"use client";

import { useTranslations } from "next-intl";
import { memo } from "react";
import { useShallow } from "zustand/react/shallow";
import type { ID } from "@/core/document/types";
import { visibleNodeIds } from "@/core/geometry/culling";
import { cn } from "@/lib/utils";
import { useDocumentStore } from "@/stores/document-store";
import { useEditorStore } from "@/stores/editor-store";
import { ArtboardRoot } from "./artboard-root";
import { NodeView } from "./node-view";
import { useViewSettings } from "./use-view-settings";

export const ArtboardView = memo(function ArtboardView({ id, readOnly }: { id: ID; readOnly?: boolean }) {
  const t = useTranslations("canvas");
  const a = useDocumentStore((s) => s.project?.artboards[id]);
  const grid = useDocumentStore((s) => s.project?.settings.grid);
  const active = useEditorStore((s) => s.activeArtboardId === id);
  const ids = useVisibleIds(id);
  const { mode, skin, structure, sketch } = useViewSettings();
  if (!a) return null;
  return (
    <div
      data-artboard-id={id}
      className={cn("absolute", active && !readOnly && "outline-2 outline-primary/60")}
      style={{ left: a.x, top: a.y, width: a.width, height: a.height }}
    >
      <ArtboardLabel id={id} name={a.name} />
      <ArtboardRoot
        mode={mode}
        skin={skin}
        sketch={sketch}
        data-export-root={id}
        aria-label={t("artboard", { name: a.name })}
        className="size-full shadow-sm"
      >
        {ids.map((nid) => (
          <NodeView key={nid} id={nid} mode={mode} skin={structure} />
        ))}
      </ArtboardRoot>
      {!readOnly && grid?.visible && (
        <div
          className="pf-grid pointer-events-none absolute inset-0"
          style={{ backgroundSize: `${grid.size}px ${grid.size}px` }}
        />
      )}
    </div>
  );
});

function ArtboardLabel({ id, name }: { id: ID; name: string }) {
  const zoom = useEditorStore((s) => s.viewport.zoom);
  return (
    <div
      className="absolute bottom-full left-0 max-w-full truncate pb-1 text-muted-foreground"
      style={{ fontSize: 12 / zoom }}
      data-artboard-label={id}
    >
      {name}
    </div>
  );
}

function useVisibleIds(id: ID): ID[] {
  const win = useEditorStore((s) => s.cullRect);
  return useDocumentStore(
    useShallow((s) => {
      const a = s.project?.artboards[id];
      return a && s.project ? visibleNodeIds(a.childOrder, s.project.nodes, a, win) : [];
    }),
  );
}
