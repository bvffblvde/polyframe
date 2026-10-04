import type { ID, Rect } from "../../document/types";

export interface RowItem {
  id: ID;
  rect: Rect;
}

export interface Row {
  top: number;
  bottom: number;
  items: RowItem[];
}

export function inferRows(items: RowItem[]): Row[] {
  const sorted = [...items].sort((a, b) => a.rect.y - b.rect.y || a.rect.x - b.rect.x);
  const rows: Row[] = [];
  for (const item of sorted) {
    const last = rows[rows.length - 1];
    if (last && item.rect.y < last.bottom) {
      last.items.push(item);
      last.bottom = Math.max(last.bottom, item.rect.y + item.rect.h);
    } else {
      rows.push({ top: item.rect.y, bottom: item.rect.y + item.rect.h, items: [item] });
    }
  }
  for (const r of rows) r.items.sort((a, b) => a.rect.x - b.rect.x);
  return rows;
}
