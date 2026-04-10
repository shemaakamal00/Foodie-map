import { test, expect } from "@playwright/test";

test("startsidan laddar", async ({ page }) => {
  await page.goto("/startsida.html");

  await expect(page.getByText("Foodie Map")).toBeVisible();
});