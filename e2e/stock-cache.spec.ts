import { neon } from "@neondatabase/serverless";
import { expect, test } from "@playwright/test";

import { CUSTOMER_STATE, TEST_DATABASE_URL } from "./env";

test.use({ storageState: CUSTOMER_STATE });

// Product pages are cached per product (`product-<slug>` tag) and every stock
// write must expire that tag. Seeded stock for dian-hong is 18 ("In stock"); no
// other spec touches this product.
test("a cached product page refreshes after checkout reserves stock", async ({ page }) => {
  const sql = neon(TEST_DATABASE_URL);
  const url = "/products/dian-hong";

  await page.goto(url);
  await expect(page.getByText("In stock").first()).toBeVisible();

  // Raw SQL bypasses the app, so nothing expires the tag: the page must keep serving the cache.
  await sql`update product_stock set quantity = 3 where product_id = (select id from products where slug = 'dian-hong')`;
  await page.reload();
  await expect(page.getByText("In stock").first()).toBeVisible();

  // Checkout reserves 1 (3 -> 2) and expires the tag, so the next visit is fresh.
  await page.getByRole("button", { name: /add to bag/i }).click();
  await expect(page.getByRole("status")).toHaveText(/added to your bag/i);
  await page.goto("/cart");
  await page.getByRole("button", { name: /checkout/i }).click();
  await page.waitForURL(/^https:\/\/checkout\.stripe\.com\//, { waitUntil: "commit" });

  await page.goto(url);
  await expect(page.getByText("Only 2 left").first()).toBeVisible();
});
