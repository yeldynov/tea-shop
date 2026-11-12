import { expect, test } from "@playwright/test";

import { CUSTOMER_STATE } from "./env";

test.use({ storageState: CUSTOMER_STATE });

// Stops at Stripe: paying is Stripe's job, and the webhook is covered in Vitest.
test("checkout hands a signed-in customer over to Stripe", async ({ page }) => {
  await page.goto("/products/da-hong-pao");
  await page.getByRole("button", { name: /add to bag/i }).click();
  await expect(page.getByRole("status")).toHaveText(/added to your bag/i);

  await page.goto("/cart");
  await page.getByRole("button", { name: /checkout/i }).click();

  await page.waitForURL(/^https:\/\/checkout\.stripe\.com\//, { waitUntil: "commit" });
});
