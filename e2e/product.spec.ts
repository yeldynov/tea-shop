import { expect, test } from "@playwright/test";

// Seeded by `pnpm db:seed` (src/db/seed-data.ts): $36.00, 24 in stock.
test("product page shows the name, price and an Add to bag button", async ({ page }) => {
  await page.goto("/products/da-hong-pao");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Da Hong Pao");
  await expect(page.getByText("$36.00").first()).toBeVisible();
  await expect(page.getByRole("button", { name: /add to bag/i })).toBeEnabled();
});

// Streamed pages can't change their status after the shell is sent (see admin.spec.ts),
// so an unknown slug shows the not-found page and is kept out of search by noindex.
test("an unknown product slug shows the not-found page, noindexed", async ({ page }) => {
  await page.goto("/products/no-such-tea");

  await expect(page.getByText("This page could not be found.")).toBeVisible();
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(1);
});
