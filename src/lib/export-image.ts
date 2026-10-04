import { toBlob } from "html-to-image";

export interface ImageExportOptions {
  scale: 1 | 2 | 3;
  transparent: boolean;
}

export async function exportElementPng(el: HTMLElement, opts: ImageExportOptions): Promise<Blob> {
  const width = el.offsetWidth;
  const height = el.offsetHeight;
  const blob = await toBlob(el, {
    width,
    height,
    pixelRatio: opts.scale,
    cacheBust: true,
    style: opts.transparent ? { background: "transparent" } : undefined,
    filter: (node) => !(node instanceof HTMLElement && node.dataset.overlay !== undefined),
  });
  if (!blob) throw new Error("Empty image");
  return blob;
}

export function findArtboardElement(id: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-export-root="${CSS.escape(id)}"]`);
}
