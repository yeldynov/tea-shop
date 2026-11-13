import { expect, test } from "@playwright/test";

import { CUSTOMER_STATE } from "./env";

test.use({ storageState: CUSTOMER_STATE });

test("a signed-in customer gets a 404 from /admin", async ({ page }) => {
  const response = await page.goto("/admin");

  expect(response?.status()).toBe(404);
  await expect(page.getByText("This page could not be found.")).toBeVisible();
});
