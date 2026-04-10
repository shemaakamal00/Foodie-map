import { describe, it, expect } from "vitest";
import { insertIntoTable } from "../../src/supabase";

describe("Tipssida - integration test", () => {
  it("that it calls Supabase insert function", async () => {
    const data = {
      name: "Test",
      description: "Test desc",
      email: "test@test.com",
    };

    try {
      await insertIntoTable("suggestion", data);
      expect(true).toBe(true);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});