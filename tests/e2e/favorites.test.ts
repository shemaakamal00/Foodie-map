import { test, expect } from "@playwright/test";

// Kör test i mobilvy så knappen syns i playwright
test.use({ viewport: { width: 375, height: 667 } });

test("user can open favorite and go back", async ({ page }) => {

 await page.route("**/rest/v1/restaurants*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: 1,
          name: "Test Restaurant",
          address: "Testgatan 1",
          description: "Test",
          image_url: "https://via.placeholder.com/150",
          latitude: 59,
          longitude: 18,
          diets: ["Halal"]
        }
      ])
    });
  });

  await page.route("**/rest/v1/favorites*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          restaurant_id: 1,
          device_id: "test"
        }
      ])
    });
  });

  //Sätt namn "test" i device_id så data kan hittas
  await page.addInitScript(() => {
    localStorage.setItem("device_id", "test");
  });
await page.goto("/favoritsida.html");
await page.waitForSelector(".card");
await page.locator(".card").click();
await page.waitForSelector(".container.show-detail");
await page.locator("#back-button").click();
await expect(page.locator(".container")).not.toHaveClass(/show-detail/);
});