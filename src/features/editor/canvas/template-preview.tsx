"use client";

import { useTranslations } from "next-intl";
import { memo, useMemo } from "react";
import type { Mode, SkinChoice, SkinId } from "@/core/document/types";
import { registry } from "@/core/registry";
import { getTemplate, instantiateTemplate } from "@/core/templates";
import { ArtboardRoot } from "./artboard-root";

interface TemplatePreviewProps {
  templateId: string;
  width: number;
  mode: Mode;
  skin: SkinChoice;
  structure: SkinId;
  label: string;
}

export const TemplatePreview = memo(function TemplatePreview({ templateId, width, mode, skin, structure, label }: TemplatePreviewProps) {
  const t = useTranslations();
  const project = useMemo(() => {
    const tpl = getTemplate(templateId);
    if (!tpl) return null;
    let i = 0;
    return instantiateTemplate(tpl, { t: (k) => t(k), genId: () => `tp-${++i}`, now: "", projectName: "", artboardName: "" });
  }, [templateId, t]);
  if (!project) return null;
  const a = project.artboards[project.artboardOrder[0]];
  const maxH = width * 0.75;
  const scale = Math.min(width / a.width, maxH / a.height);
  return (
    <div role="img" aria-label={label} className="relative mx-auto overflow-hidden rounded-md border bg-background" style={{ width: a.width * scale, height: a.height * scale }}>
      <div className="absolute top-0 left-0 origin-top-left" style={{ transform: `scale(${scale})` }}>
        <ArtboardRoot mode={mode} skin={skin} style={{ width: a.width, height: a.height }}>
          {a.childOrder.map((id) => {
            const n = project.nodes[id];
            const Render = registry[n.type].Render;
            return (
              <div key={id} className="pf-node" data-role={n.style?.colorRole} data-shadow={n.style?.shadow} style={{ left: n.x, top: n.y, width: n.w, height: n.h }}>
                <Render props={n.props} node={n} mode={mode} skin={structure} />
              </div>
            );
          })}
        </ArtboardRoot>
      </div>
    </div>
  );
});
