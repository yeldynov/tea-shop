import { expect, test } from "@playwright/test";

// No storageState: a fresh browser context is a signed-out guest.
test("signed-out visitors are sent to sign-in and come back after", async ({ page }) => {
  await page.goto("/account/orders");

  await expect(page).toHaveURL("/sign-in?next=%2Faccount%2Forders");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
