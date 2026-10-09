"use client";

import { memo, type CSSProperties } from "react";
import type { ID, Mode, SkinId } from "@/core/document/types";
import { registry } from "@/core/registry";
import { useDocumentStore } from "@/stores/document-store";
import { useEditorStore } from "@/stores/editor-store";

export const NodeView = memo(function NodeView({ id, mode, skin }: { id: ID; mode: Mode; skin: SkinId }) {
  const node = useDocumentStore((s) => s.project?.nodes[id]);
  const preview = useEditorStore((s) => s.preview?.[id]);
  if (!node || node.hidden) return null;
  const r = preview ?? node;
  const Render = registry[node.type].Render;
  const style: CSSProperties & Record<string, string | number> = {
    left: node.x,
    top: node.y,
    width: r.w,
    height: r.h,
  };
  if (node.opacity !== 1) style.opacity = node.opacity;
  if (r.x !== node.x || r.y !== node.y) style.transform = `translate(${r.x - node.x}px, ${r.y - node.y}px)`;
  if (node.style?.radius !== undefined) style["--pf-radius-override"] = `${node.style.radius}px`;
  return (
    <div
      className="pf-node"
      data-node-id={id}
      data-type={node.type}
      data-role={node.style?.colorRole}
      data-shadow={node.style?.shadow}
      data-locked={node.locked || undefined}
      style={style}
    >
      <Render props={node.props} node={node} mode={mode} skin={skin} />
    </div>
  );
});
