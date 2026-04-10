import { describe, it, expect } from "vitest";
import { filterRestaurants } from "../../src/pages/restaurants";
import type { RestaurantWithDiets } from "../../src/types/restaurant";

describe("restaurant filtering flow", () => {
  const restaurants: RestaurantWithDiets[] = [
    {
      id: 1,
      name: "Hermans",
      image_url: "",
      website_url: "",
      description: "Vegansk buffé med utsikt över Stockholm",
      diets: ["Vegansk"],
    },
    {
      id: 2,
      name: "Beirut Café",
      image_url: "",
      website_url: "",
      description: "Libanesisk mat i Stockholm",
      diets: ["Halal"],
    },
    {
      id: 3,
      name: "Kosher Corner",
      image_url: "",
      website_url: "",
      description: "Kosher dishes",
      diets: ["Kosher"],
    },
  ];

  it("shows only halal restaurants when halal filter is selected", () => {
    const result = filterRestaurants(restaurants, "", "halal");

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Beirut Café");
  });

  it("lets the user search for vegan restaurants", () => {
    const result = filterRestaurants(restaurants, "veg", "alla");

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Hermans");
  });

  it("combines search and selected filter", () => {
    const result = filterRestaurants(restaurants, "stockholm", "halal");

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Beirut Café");
  });

  it("returns no restaurants when nothing matches", () => {
    const result = filterRestaurants(restaurants, "sushi", "vegan");

    expect(result).toHaveLength(0);
  });
});