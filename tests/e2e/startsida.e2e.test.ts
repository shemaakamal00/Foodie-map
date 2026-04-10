import { test, expect } from "@playwright/test";

test("startsidan laddar", async ({ page }) => {
  await page.goto("/startsida.html");

  await expect(page).toHaveTitle(/Foodie Map/i);
  await expect(page.getByRole("link", { name: /öppna kartan/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /se restauranger/i })).toBeVisible();
});