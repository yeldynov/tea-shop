import { expect, test } from "@playwright/test";

// Seeded by `pnpm db:seed` (src/db/seed-data.ts): $36.00, 24 in stock.
test("product page shows the name, price and an Add to bag button", async ({ page }) => {
  await page.goto("/products/da-hong-pao");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Da Hong Pao");
  await expect(page.getByText("$36.00").first()).toBeVisible();
  await expect(page.getByRole("button", { name: /add to bag/i })).toBeEnabled();
});
