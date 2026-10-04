import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import type { Project } from "../document/types";
import { parseProjectJson, type ParseResult } from "./json";

export const SHARE_PREFIX = "#/share/";
export const SHARE_WARN_LENGTH = 64 * 1024;

export function encodeShare(p: Project): string {
  return compressToEncodedURIComponent(JSON.stringify(p));
}

export function isShareHash(hash: string): boolean {
  return hash.startsWith(SHARE_PREFIX);
}

export function decodeShare(hash: string): ParseResult | null {
  if (!isShareHash(hash)) return null;
  const json = decompressFromEncodedURIComponent(hash.slice(SHARE_PREFIX.length));
  if (!json) return { ok: false, error: { code: "invalidJson", params: {} } };
  return parseProjectJson(json);
}
