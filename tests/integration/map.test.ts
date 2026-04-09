import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const fromTableMock = vi.fn();
const markerMock = vi.fn();
const mapInstance = {
  setView: vi.fn().mockReturnThis(),
  fitBounds: vi.fn(),
  removeLayer: vi.fn(),
  invalidateSize: vi.fn(),
};

vi.mock("../../src/supabase", () => ({
  fromTable: fromTableMock,
}));

vi.mock("leaflet", () => ({
  default: {
    map: vi.fn(() => mapInstance),
    tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
    divIcon: vi.fn((options) => options),
    marker: markerMock,
  },
}));

const flush = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 0));
  await Promise.resolve();
};

describe("map integration", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    markerMock.mockImplementation(() => ({
      addTo: vi.fn().mockReturnThis(),
      bindPopup: vi.fn().mockReturnThis(),
    }));

    fromTableMock.mockImplementation(async (table: string) => {
      if (table === "restaurant") {
        return [
          {
            id: 1,
            name: "Halal House",
            description: "Great halal",
            address: "Street 1",
            latitude: 59.33,
            longitude: 18.06,
            image_url: null,
            category_id: 10,
          },
          {
            id: 2,
            name: "Vegan Spot",
            description: "Plant based",
            address: "Street 2",
            latitude: 59.34,
            longitude: 18.07,
            image_url: null,
            category_id: 11,
          },
        ];
      }
      if (table === "diet") {
        return [
          { id: 1, name: "Halal" },
          { id: 2, name: "Vegan" },
        ];
      }
      if (table === "restaurant_diet") {
        return [
          { restaurant_id: 1, diet_id: 1 },
          { restaurant_id: 2, diet_id: 2 },
        ];
      }
      if (table === "category") {
        return [
          { id: 10, name: "Middle Eastern" },
          { id: 11, name: "Healthy" },
        ];
      }
      return [];
    });

    document.body.innerHTML = `
      <main>
        <input id="search-input" />
        <button id="search-btn">Sök</button>
        <div id="map"></div>
      </main>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("loads map data and filters markers on search", async () => {
    await import("../../src/pages/map");
    await flush();

    expect(fromTableMock).toHaveBeenCalledTimes(4);
    expect(markerMock).toHaveBeenCalledTimes(2);

    const input = document.getElementById("search-input") as HTMLInputElement;
    const button = document.getElementById("search-btn") as HTMLButtonElement;

    input.value = "halal";
    button.click();
    await flush();

    expect(markerMock).toHaveBeenCalledTimes(3);
    expect(mapInstance.removeLayer).toHaveBeenCalledTimes(2);
  });
});
