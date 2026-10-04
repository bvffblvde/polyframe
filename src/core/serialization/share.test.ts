import { describe, expect, it } from "vitest";
import { makeProject } from "../test/fixtures";
import { decodeShare, encodeShare, isShareHash, SHARE_PREFIX } from "./share";

describe("share links", () => {
  it("round-trips a project through the hash", () => {
    const p = makeProject();
    const hash = SHARE_PREFIX + encodeShare(p);
    expect(isShareHash(hash)).toBe(true);
    expect(decodeShare(hash)).toEqual({ ok: true, project: p });
  });

  it("ignores other hashes and rejects garbage", () => {
    expect(decodeShare("#/other")).toBeNull();
    expect(decodeShare(SHARE_PREFIX + "%%%")).toMatchObject({ ok: false });
  });

  it("validates decoded data", () => {
    const hash = SHARE_PREFIX + encodeShare({ ...makeProject(), schemaVersion: 7 } as never);
    expect(decodeShare(hash)).toMatchObject({ ok: false, error: { code: "unsupportedVersion" } });
  });
});
