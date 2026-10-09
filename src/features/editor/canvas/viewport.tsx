"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useDocumentStore } from "@/stores/document-store";
import { useEditorStore } from "@/stores/editor-store";
import { fitAll } from "../commands";
import { usePointerController } from "../interactions/use-pointer-controller";
import { useViewSize, useWheel } from "../interactions/use-wheel";
import { ArtboardView } from "./artboard-view";
import { SelectionOverlay } from "./selection-overlay";
import { useCullRect } from "./use-cull-rect";

export function Viewport({ readOnly = false, dropRef }: { readOnly?: boolean; dropRef?: (el: HTMLElement | null) => void }) {
  const t = useTranslations("canvas");
  const ref = useRef<HTMLDivElement>(null);
  const vp = useEditorStore((s) => s.viewport);
  const panning = useEditorStore((s) => s.interaction === "panning" || s.spaceDown);
  const fitRequest = useEditorStore((s) => s.fitRequest);
  const ready = useEditorStore((s) => s.viewSize.width > 1);
  const order = useDocumentStore((s) => s.project?.artboardOrder);
  usePointerController(ref, readOnly);
  useWheel(ref);
  useViewSize(ref);
  useCullRect();
  useEffect(() => {
    if (ready && fitRequest) fitAll();
  }, [fitRequest, ready]);

  return (
    <div
      ref={(el) => {
        ref.current = el;
        dropRef?.(el);
      }}
      tabIndex={0}
      role="region"
      aria-label={t("label")}
      data-testid="canvas"
      className={cn(
        "relative size-full touch-none overflow-hidden bg-neutral-100 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset dark:bg-neutral-900",
        (panning || readOnly) && "cursor-grab",
      )}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ transform: `translate(${vp.x}px, ${vp.y}px) scale(${vp.zoom})` }}
      >
        {order?.map((id) => <ArtboardView key={id} id={id} readOnly={readOnly} />)}
      </div>
      {!readOnly && <SelectionOverlay />}
    </div>
  );
}
