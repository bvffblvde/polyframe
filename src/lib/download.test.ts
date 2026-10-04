import { describe, expect, it } from "vitest";
import { slugify } from "./download";

describe("slugify", () => {
  it("keeps letters in any script", () => {
    expect(slugify("My Project #1")).toBe("my-project-1");
    expect(slugify("Мій проєкт")).toBe("мій-проєкт");
    expect(slugify("!!!")).toBe("untitled");
  });
});
