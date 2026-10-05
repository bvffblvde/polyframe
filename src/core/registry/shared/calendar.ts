export type WeekStart = "monday" | "sunday";

export interface DayCell {
  day: number;
  inMonth: boolean;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function monthGrid(year: number, month: number, weekStart: WeekStart): DayCell[] {
  const first = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const offset = weekStart === "monday" ? (first + 6) % 7 : first;
  const total = daysInMonth(year, month);
  const prevTotal = daysInMonth(month === 1 ? year - 1 : year, month === 1 ? 12 : month - 1);
  const cells: DayCell[] = [];
  for (let i = offset; i > 0; i--) cells.push({ day: prevTotal - i + 1, inMonth: false });
  for (let d = 1; d <= total; d++) cells.push({ day: d, inMonth: true });
  let next = 1;
  while (cells.length % 7) cells.push({ day: next++, inMonth: false });
  return cells;
}

export function weekdayNames(locale: string, weekStart: WeekStart): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
  const base = weekStart === "monday" ? 1 : 0;
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(Date.UTC(2024, 0, 7 + base + i))));
}

export function monthTitle(locale: string, year: number, month: number): string {
  const s = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, 1)));
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function formatDate(locale: string, iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return "";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])));
}

export function isoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
