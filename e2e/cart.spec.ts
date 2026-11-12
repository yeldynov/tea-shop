import { expect, test } from "@playwright/test";

// A guest: the cart is a cookie, so no sign-in is needed.
test("adds two to the bag and shows them in the cart", async ({ page }) => {
  await page.goto("/products/da-hong-pao");

  await page.getByLabel("Quantity").selectOption("2");
  await page.getByRole("button", { name: /add to bag/i }).click();
  await expect(page.getByRole("status")).toHaveText("Added to your bag. You have 2.");

  await page.goto("/cart");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("2 items");
  await expect(page.getByRole("listitem").filter({ hasText: "Da Hong Pao" })).toBeVisible();
  await expect(page.locator("dl", { hasText: "Subtotal" })).toContainText("$72.00");
});
