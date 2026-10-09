"use client";

import { useEffect } from "react";
import { cullWindow, nextCullRect, sameRect } from "@/core/geometry/culling";
import { useEditorStore } from "@/stores/editor-store";

const SETTLE_MS = 300;

type State = ReturnType<typeof useEditorStore.getState>;

const target = (s: State) =>
  s.renderAll || s.viewSize.width <= 1 ? null : cullWindow(s.viewport, s.viewSize);

export function useCullRect() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const settle = () => {
      const s = useEditorStore.getState();
      const t = target(s);
      if (!sameRect(t, s.cullRect)) s.set({ cullRect: t });
    };
    const update = (s: State) => {
      const { now, settle: later } = nextCullRect(s.cullRect, target(s));
      if (!sameRect(now, s.cullRect)) s.set({ cullRect: now });
      clearTimeout(timer);
      if (later) timer = setTimeout(settle, SETTLE_MS);
    };
    update(useEditorStore.getState());
    const unsub = useEditorStore.subscribe((s, prev) => {
      if (
        s.viewport !== prev.viewport ||
        s.viewSize !== prev.viewSize ||
        s.renderAll !== prev.renderAll
      )
        update(s);
    });
    return () => {
      clearTimeout(timer);
      unsub();
    };
  }, []);
}
