import { expect, test as setup } from "@playwright/test";

import { CUSTOMER_STATE } from "./env";

// Signs up a fresh customer once per run and saves the session cookies, so specs
// that need a signed-in user start from `storageState` instead of the form.
setup("sign up a customer", async ({ page }) => {
  await page.goto("/sign-up?next=/account");

  await page.getByLabel("Name").fill("E2E Customer");
  await page.getByLabel("Email").fill(`e2e-${Date.now()}@example.com`);
  await page.getByLabel("Password").fill("e2e-password-123");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL("/account");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hello, E2E");

  await page.context().storageState({ path: CUSTOMER_STATE });
});
