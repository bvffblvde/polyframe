export type PageItem = number | "ellipsis";

export function pageList(total: number, current: number, siblings = 1): PageItem[] {
  const pages = Math.max(1, Math.round(total));
  const cur = Math.min(pages, Math.max(1, Math.round(current)));
  if (pages <= 5 + siblings * 2) return Array.from({ length: pages }, (_, i) => i + 1);
  const start = Math.max(2, cur - siblings);
  const end = Math.min(pages - 1, cur + siblings);
  const out: PageItem[] = [1];
  if (start > 2) out.push("ellipsis");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < pages - 1) out.push("ellipsis");
  out.push(pages);
  return out;
}
