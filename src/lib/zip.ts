import { zipSync } from "fflate";

export async function zipBlobs(files: { name: string; blob: Blob }[]): Promise<Blob> {
  const entries: Record<string, Uint8Array> = {};
  for (const f of files) entries[f.name] = new Uint8Array(await f.blob.arrayBuffer());
  const data = zipSync(entries, { level: 0 });
  return new Blob([data.slice().buffer], { type: "application/zip" });
}
