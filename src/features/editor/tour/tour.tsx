"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/stores/editor-store";
import { markTourDone, TOUR_STEPS, type Placement } from "./steps";

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const CARD_W = 340;
const PAD = 8;
const GAP = 16;

function measure(target: string | null): Box | null {
  if (!target) return null;
  const el = document.querySelector(`[data-tour="${target}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left - PAD, y: r.top - PAD, w: r.width + PAD * 2, h: r.height + PAD * 2 };
}

function cardPosition(box: Box | null, placement: Placement, cardH: number): CSSProperties {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const clampX = (x: number) => Math.max(GAP, Math.min(vw - CARD_W - GAP, x));
  const clampY = (y: number) => Math.max(GAP, Math.min(vh - cardH - GAP, y));
  if (!box) return { left: clampX((vw - CARD_W) / 2), top: clampY((vh - cardH) / 2) };
  if (placement === "right") return { left: clampX(box.x + box.w + GAP), top: clampY(box.y + 40) };
  if (placement === "left") return { left: clampX(box.x - CARD_W - GAP), top: clampY(box.y + 40) };
  if (placement === "bottom") return { left: clampX(box.x + box.w / 2 - CARD_W / 2), top: clampY(box.y + box.h + GAP) };
  return { left: clampX(box.x + GAP * 2), top: clampY(box.y + GAP * 2) };
}

export function Tour() {
  const t = useTranslations("tour");
  const locale = useLocale();
  const step = useEditorStore((s) => s.tour);
  const [box, setBox] = useState<Box | null>(null);
  const [cardH, setCardH] = useState(220);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const current = step === null ? null : TOUR_STEPS[step];

  useEffect(() => {
    if (!current) return;
    const update = () => {
      setBox(measure(current.target));
      if (cardRef.current) setCardH(cardRef.current.offsetHeight);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [current]);

  useEffect(() => {
    if (step === null) return;
    const onKey = (e: KeyboardEvent) => {
      const s = useEditorStore.getState();
      if (s.tour === null) return;
      if (e.key === "Escape") {
        e.preventDefault();
        markTourDone();
        s.set({ tour: null, leftTab: "components" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  useEffect(() => {
    if (step === null) return;
    const id = setTimeout(() => cardRef.current?.querySelector<HTMLButtonElement>("[data-primary]")?.focus(), 50);
    return () => clearTimeout(id);
  }, [step]);

  if (step === null || !current) return null;

  const total = TOUR_STEPS.length;
  const last = step === total - 1;
  const go = (n: number) => useEditorStore.getState().set({ tour: n, leftTab: TOUR_STEPS[n]?.id === "layers" ? "layers" : "components" });
  const finish = () => {
    markTourDone();
    useEditorStore.getState().set({ tour: null, leftTab: "components" });
  };

  return createPortal(
    <div className="fixed inset-0 z-[60]">
      {box ? (
        <div
          className="pointer-events-none fixed rounded-lg ring-2 ring-sky-400 transition-all duration-200"
          style={{ left: box.x, top: box.y, width: box.w, height: box.h, boxShadow: "0 0 0 9999px rgb(0 0 0 / 0.5)" }}
        />
      ) : (
        <div className="fixed inset-0 bg-black/50" />
      )}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-testid="tour"
        className="fixed space-y-3 rounded-lg border bg-background p-4 shadow-xl"
        style={{ width: CARD_W, ...cardPosition(box, current.placement, cardH) }}
      >
        <p className="text-xs text-muted-foreground">{t("progress", { current: step + 1, total })}</p>
        <h2 id={titleId} className="text-base font-semibold">
          {t(`${current.id}.title`)}
        </h2>
        <p className="text-sm text-muted-foreground">{t(`${current.id}.body`)}</p>
        {last && (
          <a href={`/${locale}/guide`} target="_blank" rel="noreferrer" className="block text-sm font-medium text-primary underline underline-offset-4">
            {t("openGuide")}
          </a>
        )}
        <div className="flex items-center gap-2 pt-1">
          {!last && (
            <Button variant="ghost" size="sm" onClick={finish}>
              {t("skip")}
            </Button>
          )}
          <div className="ml-auto flex gap-2">
            {step > 0 && (
              <Button variant="outline" size="sm" onClick={() => go(step - 1)}>
                {t("back")}
              </Button>
            )}
            <Button size="sm" data-primary onClick={() => (last ? finish() : go(step + 1))}>
              {last ? t("done") : t("next")}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
