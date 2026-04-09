import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fromTable, fromTableFiltered } from "../../src/supabase";
import { SUPABASE_URL, SUPABASE_KEY } from "../../src/database";

describe("supabase api unit", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("fromTable builds request and returns json", async () => {
    const data = [{ id: 1, name: "A" }];
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => data,
    });

    const result = await fromTable("restaurant", "id,name");

    expect(fetch).toHaveBeenCalledWith(
      `${SUPABASE_URL}/rest/v1/restaurant?select=id,name`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    expect(result).toEqual(data);
  });

  it("fromTableFiltered appends filters", async () => {
    const data: Array<{ id: number }> = [];
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => data,
    });

    await fromTableFiltered(
      "restaurant",
      { name: "ilike.*veg*", category_id: "eq.2" },
      "id,name"
    );

    const calledUrl = (
      (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0] as string
    );
    expect(calledUrl).toContain(`${SUPABASE_URL}/rest/v1/restaurant?`);
    expect(calledUrl).toContain("select=id%2Cname");
    expect(calledUrl).toContain("name=ilike.*veg*");
    expect(calledUrl).toContain("category_id=eq.2");
  });
});
