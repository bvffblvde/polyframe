"use client";

import { useEffect, type RefObject } from "react";
import { zoomAt } from "@/core/geometry/viewport";
import { useEditorStore } from "@/stores/editor-store";

export function useWheel(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const { viewport, set } = useEditorStore.getState();
      if (e.ctrlKey || e.metaKey) {
        const r = el.getBoundingClientRect();
        const factor = Math.exp(-e.deltaY * 0.01);
        set({ viewport: zoomAt(viewport, viewport.zoom * factor, { x: e.clientX - r.left, y: e.clientY - r.top }) });
      } else {
        set({ viewport: { ...viewport, x: viewport.x - e.deltaX, y: viewport.y - e.deltaY } });
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [ref]);
}

export function useViewSize(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      useEditorStore.getState().set({ viewSize: { width, height } });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
}
