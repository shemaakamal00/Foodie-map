import { test, expect } from "@playwright/test";

test("map page loads and can filter", async ({ page }) => {
  await page.route("**/rest/v1/**", async (route) => {
    const url = route.request().url();

    if (url.includes("/rest/v1/restaurant?")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "Halal House",
            description: "Great halal food",
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
        ]),
      });
      return;
    }

    if (url.includes("/rest/v1/diet?")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: 1, name: "Halal" },
          { id: 2, name: "Vegan" },
        ]),
      });
      return;
    }

    if (url.includes("/rest/v1/restaurant_diet?")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { restaurant_id: 1, diet_id: 1 },
          { restaurant_id: 2, diet_id: 2 },
        ]),
      });
      return;
    }

    if (url.includes("/rest/v1/category?")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: 10, name: "Middle Eastern" },
          { id: 11, name: "Healthy" },
        ]),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });

  await page.goto("/kartsida.html");

  await expect(page).toHaveTitle("Karta - Stockholm Restauranger");
  await expect(page.locator("#map")).toBeVisible();
  await expect(page.locator("#search-input")).toBeVisible();
  await expect(page.locator("#search-btn")).toBeVisible();

  await expect
    .poll(async () => await page.locator(".custom-marker").count())
    .toBe(2);

  await page.fill("#search-input", "halal");
  await page.click("#search-btn");

  await expect
    .poll(async () => await page.locator(".custom-marker").count())
    .toBe(1);
});
