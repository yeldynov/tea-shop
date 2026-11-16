import { expect, test } from "@playwright/test";

import { CUSTOMER_STATE } from "./env";

test.use({ storageState: CUSTOMER_STATE });

// The header streams its session/cart menus behind Suspense, so the response
// starts before the page runs and the status is already 200. Next.js then adds
// <meta name="robots" content="noindex"> instead of a 404 status.
test("a signed-in customer gets the not-found page from /admin", async ({ page }) => {
  await page.goto("/admin");

  await expect(page.getByText("This page could not be found.")).toBeVisible();
  // The admin page's own metadata also says noindex, so there can be two.
  await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toBeAttached();
});
