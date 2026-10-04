import type { ComponentType } from "react";
import AddComponent from "../../docs/contributing/add-component.md";
import AddExporter from "../../docs/contributing/add-exporter.md";
import AddSkin from "../../docs/contributing/add-skin.md";
import Architecture from "../../docs/developer/architecture.md";
import GettingStarted from "../../docs/developer/getting-started.md";

export const DOC_PAGES = [
  { slug: "getting-started", Content: GettingStarted },
  { slug: "architecture", Content: Architecture },
  { slug: "add-component", Content: AddComponent },
  { slug: "add-skin", Content: AddSkin },
  { slug: "add-exporter", Content: AddExporter },
] as const satisfies { slug: string; Content: ComponentType }[];

export type DocSlug = (typeof DOC_PAGES)[number]["slug"];

export function getDoc(slug: string) {
  return DOC_PAGES.find((p) => p.slug === slug);
}
