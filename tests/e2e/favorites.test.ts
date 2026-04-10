import { test, expect } from "@playwright/test";

test("user can open restaurant and go back through box right and left", async ({ page }) => {
  await page.goto("http://localhost:5173/favoritsida.html");
  await expect(page.locator("body")).toBeVisible();
  await page.waitForTimeout(2000);
  
   const testCards = page.locator(".card");
   if (await testCards.count() === 0) {
    test.skip(); 
  }
  await testCards.first().click();
  await expect(page.locator(".box-right")).toBeVisible();
  await page.locator("#back-button").click();
  await expect(page.locator(".box-left")).toBeVisible();
});