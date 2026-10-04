"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Mode, SkinChoice, SkinId } from "@/core/document/types";
import { registry } from "@/core/registry";
import { getTemplate, instantiateTemplate } from "@/core/templates";
import { ArtboardRoot } from "./artboard-root";

const CROP = { x: 360, y: 120, w: 560, h: 540 };

interface LoginPreviewProps {
  mode: Mode;
  skin: SkinChoice | string;
  structure: SkinId;
  label: string;
  maxWidth?: number;
}

export function LoginPreview({ mode, skin, structure, label, maxWidth = CROP.w }: LoginPreviewProps) {
  const t = useTranslations();
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(maxWidth);
  const project = useMemo(() => {
    const tpl = getTemplate("login");
    if (!tpl) return null;
    let i = 0;
    return instantiateTemplate(tpl, { t: (k) => t(k), genId: () => `preview-${++i}`, now: "", projectName: "", artboardName: "" });
  }, [t]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!project) return null;
  const a = project.artboards[project.artboardOrder[0]];
  const scale = Math.min(1, width / CROP.w);
  return (
    <div ref={box} className="w-full" style={{ maxWidth }}>
      <div
        role="img"
        aria-label={label}
        className="relative mx-auto overflow-hidden rounded-xl border shadow-lg"
        style={{ width: CROP.w * scale, height: CROP.h * scale }}
      >
        <div className="absolute top-0 left-0 origin-top-left" style={{ transform: `scale(${scale}) translate(${-CROP.x}px, ${-CROP.y}px)` }}>
          <ArtboardRoot mode={mode} skin={skin as SkinChoice} style={{ width: a.width, height: a.height }}>
            {a.childOrder.map((id) => {
              const n = project.nodes[id];
              const Render = registry[n.type].Render;
              return (
                <div key={id} className="pf-node" data-role={n.style?.colorRole} style={{ left: n.x, top: n.y, width: n.w, height: n.h }}>
                  <Render props={n.props} node={n} mode={mode} skin={structure} />
                </div>
              );
            })}
          </ArtboardRoot>
        </div>
      </div>
    </div>
  );
}
