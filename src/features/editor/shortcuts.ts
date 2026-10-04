"use client";

import { useEffect } from "react";
import { nudgeStep } from "@/core/geometry/snap";
import { useDocumentStore } from "@/stores/document-store";
import { useEditorStore } from "@/stores/editor-store";
import * as commands from "./commands";
import type { useCommands } from "./use-commands";

const COMPOSITE = "[aria-roledescription=sortable],[role=dialog],[role=menu],[role=listbox],[role=tablist],[role=radiogroup],[role=slider],[role=alertdialog]";

export function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  return el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
}

function inComposite(el: EventTarget | null): boolean {
  return el instanceof HTMLElement && Boolean(el.closest(COMPOSITE));
}

const ARROWS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

export function useShortcuts(cmd: ReturnType<typeof useCommands>) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (useEditorStore.getState().tour !== null) return;
      if (mod && e.code === "KeyK") {
        e.preventDefault();
        const ed0 = useEditorStore.getState();
        ed0.set({ dialog: ed0.dialog === "command" ? null : "command" });
        return;
      }
      if (isTypingTarget(e.target) || inComposite(e.target) || useEditorStore.getState().dialog) return;
      const ed = useEditorStore.getState();
      const run = (fn: () => void) => {
        e.preventDefault();
        fn();
      };
      if (e.code === "Space" && !mod) {
        const target = e.target as HTMLElement;
        if (target === document.body || target.closest("[data-testid=canvas]")) {
          e.preventDefault();
          if (!ed.spaceDown) ed.set({ spaceDown: true });
        }
        return;
      }
      if (mod) {
        switch (e.code) {
          case "KeyZ":
            return run(e.shiftKey ? cmd.redo : cmd.undo);
          case "KeyG":
            return run(e.shiftKey ? cmd.ungroup : cmd.group);
          case "KeyY":
            return run(cmd.redo);
          case "KeyD":
            return run(cmd.duplicate);
          case "KeyC":
            return run(cmd.copy);
          case "KeyV":
            return run(cmd.paste);
          case "KeyA":
            return run(cmd.selectAll);
          case "BracketRight":
            return run(() => commands.reorder(e.shiftKey ? "front" : "forward"));
          case "BracketLeft":
            return run(() => commands.reorder(e.shiftKey ? "back" : "backward"));
          case "Digit0":
            return run(commands.fitAll);
          case "Digit1":
            return run(() => commands.zoomTo(1));
          case "Equal":
          case "NumpadAdd":
            return run(() => commands.zoomStep(1));
          case "Minus":
          case "NumpadSubtract":
            return run(() => commands.zoomStep(-1));
        }
        return;
      }
      if (e.altKey) return;
      if (e.key === "Delete" || e.key === "Backspace") return run(cmd.remove);
      if (e.key === "Escape") return run(commands.clearSelection);
      if (e.key === "?" || (e.code === "Slash" && e.shiftKey)) return run(() => ed.set({ dialog: "shortcuts" }));
      if (e.code === "KeyG") return run(cmd.toggleSnap);
      if (e.code === "KeyM") return run(cmd.toggleMode);
      const arrow = ARROWS[e.key];
      if (arrow && ed.selection.length) {
        const grid = useDocumentStore.getState().project?.settings.grid ?? { enabled: false, size: 8 };
        const step = nudgeStep(e.shiftKey, grid);
        return run(() => commands.nudge(arrow[0] * step, arrow[1] * step));
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" && useEditorStore.getState().spaceDown) useEditorStore.getState().set({ spaceDown: false });
    };
    const onBlur = () => useEditorStore.getState().set({ spaceDown: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [cmd]);
}
