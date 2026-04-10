import { describe, it, expect } from "vitest";
import {
  normalizeDiet,
  normalizeFilter,
  getDietClass,
} from "../../src/pages/restaurants";

describe("restaurant helper functions", () => {
  describe("normalizeDiet", () => {
    it("returns vegan for Vegansk", () => {
      expect(normalizeDiet("Vegansk")).toBe("vegan");
    });

    it("returns vegetarian for Vegetarisk", () => {
      expect(normalizeDiet("Vegetarisk")).toBe("vegetarian");
    });

    it("returns halal for Halal", () => {
      expect(normalizeDiet("Halal")).toBe("halal");
    });

    it("returns glutenfree for Glutenfri", () => {
      expect(normalizeDiet("Glutenfri")).toBe("glutenfree");
    });

    it("returns kosher for Kosher", () => {
      expect(normalizeDiet("Kosher")).toBe("kosher");
    });

    it("returns unknown for unsupported values", () => {
      expect(normalizeDiet("Pizza")).toBe("unknown");
    });
  });

  describe("normalizeFilter", () => {
    it("returns alla for Alla", () => {
      expect(normalizeFilter("Alla")).toBe("alla");
    });

    it("returns vegan for Vegansk", () => {
      expect(normalizeFilter("Vegansk")).toBe("vegan");
    });

    it("returns glutenfree for Glutenfri", () => {
      expect(normalizeFilter("Glutenfri")).toBe("glutenfree");
    });
  });

  describe("getDietClass", () => {
    it("returns tag-halal for Halal", () => {
      expect(getDietClass("Halal")).toBe("tag-halal");
    });

    it("returns tag-vegan for Vegansk", () => {
      expect(getDietClass("Vegansk")).toBe("tag-vegan");
    });

    it("returns tag-vegetarian for Vegetarisk", () => {
      expect(getDietClass("Vegetarisk")).toBe("tag-vegetarian");
    });

    it("returns tag-unknown for unknown values", () => {
      expect(getDietClass("Random")).toBe("tag-unknown");
    });
  });
});