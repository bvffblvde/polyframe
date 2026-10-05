export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function at<T>(items: T[], index: number, fallback: T): T {
  return items[index] ?? fallback;
}
