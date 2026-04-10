import { describe, it, expect } from "vitest";

describe("renderFavorites", () => {
  it("renders one restaurant card", async () => {
    
      document.body.innerHTML = `
      <div id="favorites-list"></div>
    `;

    const test = await import("../../src/pages/favorites");
    const renderFavorites = test.renderFavorites;
  
      const testRestaurant1 = [
      {
        id: 1,
        name: "Test Restaurant",
        address: "Street 1",
        description: "Nice food",
        image_url: "test.jpg",
        diets: ["Vegan"],
        website_url: "https://test.com",
        latitude: "0",
        longitude: "0",
      },
    ];

    renderFavorites(testRestaurant1);
    const cards = document.querySelectorAll(".card");
    expect(cards.length).toBe(1);
  });
});