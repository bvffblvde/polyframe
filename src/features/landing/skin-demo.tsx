"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SKIN_IDS, type SkinId } from "@/core/document/types";
import { registry } from "@/core/registry";
import { SKIN_LABELS } from "@/core/skins";
import { getTemplate, instantiateTemplate } from "@/core/templates";
import { ArtboardRoot } from "../editor/canvas/artboard-root";

type Look = "wireframe" | SkinId;

export function SkinDemo() {
  const t = useTranslations();
  const td = useTranslations("landing.demo");
  const [look, setLook] = useState<Look>("mui");
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(960);
  const project = useMemo(() => {
    const tpl = getTemplate("login");
    if (!tpl) return null;
    let i = 0;
    return instantiateTemplate(tpl, {
      t: (k) => t(k),
      genId: () => `demo-${++i}`,
      now: "",
      projectName: "",
      artboardName: "",
    });
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
  const crop = { x: 360, y: 120, w: 560, h: 540 };
  const scale = Math.min(1, width / crop.w);

  return (
    <div className="flex flex-col items-center gap-6">
      <ToggleGroup
        type="single"
        variant="outline"
        value={look}
        onValueChange={(v) => v && setLook(v as Look)}
        aria-label={td("label")}
        className="flex-wrap justify-center"
      >
        <ToggleGroupItem value="wireframe">{t("modes.wireframe")}</ToggleGroupItem>
        {SKIN_IDS.map((s) => (
          <ToggleGroupItem key={s} value={s}>
            {SKIN_LABELS[s]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div ref={box} className="w-full max-w-[560px]">
        <div
          role="img"
          aria-label={td("preview")}
          className="relative mx-auto overflow-hidden rounded-xl border shadow-lg"
          style={{ width: crop.w * scale, height: crop.h * scale }}
        >
          <div className="absolute top-0 left-0 origin-top-left" style={{ transform: `scale(${scale}) translate(${-crop.x}px, ${-crop.y}px)` }}>
            <ArtboardRoot
              mode={look === "wireframe" ? "wireframe" : "styled"}
              skin={look === "wireframe" ? "shadcn" : look}
              style={{ width: a.width, height: a.height }}
            >
              {a.childOrder.map((id) => {
                const n = project.nodes[id];
                const Render = registry[n.type].Render;
                return (
                  <div key={id} className="pf-node" data-role={n.style?.colorRole} style={{ left: n.x, top: n.y, width: n.w, height: n.h }}>
                    <Render
                      props={n.props}
                      node={n}
                      mode={look === "wireframe" ? "wireframe" : "styled"}
                      skin={look === "wireframe" ? "shadcn" : look}
                    />
                  </div>
                );
              })}
            </ArtboardRoot>
          </div>
        </div>
      </div>
    </div>
  );
}
