import { test, expect } from "@playwright/test";

test.describe("restaurant page flow", () => {
  test("user can filter restaurants by category", async ({ page }) => {
    await page.goto("/restaurangsida.html");

    await page.waitForSelector(".restaurant-card");

    const initialCount = await page.locator(".restaurant-card").count();

    await page.getByRole("button", { name: "Halal" }).click();

    await expect(page.locator(".restaurant-card").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Halal");

    const filteredCount = await page.locator(".restaurant-card").count();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test("user can search for a restaurant", async ({ page }) => {
    await page.goto("/restaurangsida.html");

    await page.waitForSelector(".restaurant-card");

    const initialCount = await page.locator(".restaurant-card").count();

    await page
      .getByPlaceholder("Sök namn, område eller kategori...")
      .fill("Hermans");

    await expect(page.locator("body")).toContainText("Hermans");

    const filteredCount = await page.locator(".restaurant-card").count();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });
});