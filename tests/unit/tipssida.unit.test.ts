import { describe, it, expect } from "vitest";

describe("Tipssida - unit test", () => {
  it("creates payload correctly", () => {
    const formData = new FormData();
    formData.set("name", "Abel");
    formData.set("description", "Bra Kosher ställe");
    formData.set("email", "abel@test.com");

    const payload = {
      name: formData.get("name")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      status: "pending",
    };

    expect(payload.name).toBe("Abel");
    expect(payload.description).toBe("Bra Kosher ställe");
    expect(payload.email).toBe("abel@test.com");
  });
});