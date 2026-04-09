import { test, expect } from "@playwright/test";

test("form is submittable", async ({ page }) => {
  await page.goto("/tipssida.html");

  await page.fill('input[name="name"]', "Ali");
  await page.fill('textarea[name="description"]', "Någonting");
  await page.fill('input[name="email"]', "ali@test.com");

  await page.click('button[type="submit"]');

  await expect(page.locator(".form-response")).toBeVisible();
});