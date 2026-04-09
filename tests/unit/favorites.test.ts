import { describe, it, expect } from "vitest";
import { getDietClass } from "../../src/pages/favorites";

describe("getDietClass", () => {
  it("returns 'tag-halal' for Halal", () => {
    expect(getDietClass("Halal")).toBe("tag-halal");
  });

  it("returns 'tag-vegan' for Vegan", () => {
    expect(getDietClass("Vegan")).toBe("tag-vegan");
  });

  it("returns 'tag-unknown' for unknown diet", () => {
    expect(getDietClass("Pizza")).toBe("tag-unknown");
  });
});