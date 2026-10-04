import type { ColorRole, Node } from "../document/types";

export function str(value: string): string {
  return /^[^"\\{}<>\n&]*$/.test(value) ? `"${value}"` : `{${JSON.stringify(value)}}`;
}

export function text(value: string): string {
  if (value === "") return "";
  return /^[^{}<>&\n`]*$/.test(value) && value.trim() === value ? value : `{${JSON.stringify(value)}}`;
}

export function bool(name: string, value: boolean): string {
  return value ? ` ${name}` : "";
}

export function lines(value: string): string[] {
  return value.split("\n");
}

export function multiline(value: string, tag: (s: string) => string): string {
  const parts = lines(value).filter((l) => l.length);
  return parts.length > 1 ? parts.map(tag).join("") : text(value);
}

export function role(node: Node): ColorRole | undefined {
  return node.style?.colorRole;
}

export function prop<T>(node: Node, key: string, fallback: T): T {
  const v = node.props[key];
  return (v === undefined ? fallback : v) as T;
}
