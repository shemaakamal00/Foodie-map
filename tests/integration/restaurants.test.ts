import { describe, it, expect, beforeEach } from "vitest";
import { renderRestaurants } from "../../src/pages/restaurants";
import type { RestaurantWithDiets } from "../../src/types/restaurant";

describe("renderRestaurants", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <p id="results-count"></p>
      <p id="status-message" hidden></p>
      <div id="restaurant-list"></div>
    `;
  });

  it("renders restaurant cards with content and tags", () => {
    const restaurants: RestaurantWithDiets[] = [
      {
        id: 1,
        name: "Hermans",
        image_url: "https://example.com/hermans.jpg",
        website_url: "https://hermans.se",
        description: "Vegansk buffé",
        diets: ["Vegansk"],
      },
      {
        id: 2,
        name: "Beirut Café",
        image_url: "https://example.com/beirut.jpg",
        website_url: "https://beirut.se",
        description: "Libanesisk mat",
        diets: ["Halal"],
      },
    ];

    renderRestaurants(restaurants);

    const cards = document.querySelectorAll(".restaurant-card");
    expect(cards.length).toBe(2);

    expect(document.body.textContent).toContain("Hermans");
    expect(document.body.textContent).toContain("Beirut Café");
    expect(document.body.textContent).toContain("Vegansk");
    expect(document.body.textContent).toContain("Halal");

    const resultsCount = document.getElementById("results-count");
    expect(resultsCount?.textContent).toBe("Visar 2 restauranger");
  });

  it("shows a status message when no restaurants are provided", () => {
    renderRestaurants([]);

    const restaurantList = document.getElementById("restaurant-list");
    const resultsCount = document.getElementById("results-count");
    const statusMessage = document.getElementById("status-message");

    expect(restaurantList?.innerHTML).toBe("");
    expect(resultsCount?.textContent).toBe("Visar 0 restauranger");
    expect(statusMessage?.hidden).toBe(false);
    expect(statusMessage?.textContent).toBe(
      "Inga restauranger matchade din sökning."
    );
  });
});