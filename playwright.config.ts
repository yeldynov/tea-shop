import { defineConfig, devices } from "@playwright/test";

import { assertSafeEnv, BASE_URL, PORT, TEST_DATABASE_URL } from "./e2e/env";

// Fail before the ~2 min build if the run would touch the real DB or live Stripe.
assertSafeEnv();

export default defineConfig({
  testDir: "e2e",
  globalSetup: "./e2e/global-setup.ts",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },
  ],
  webServer: {
    // Port 3100, not 3000, so a running `pnpm dev` (real DB) is never reused.
    command: `pnpm build && pnpm start -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      DATABASE_URL: TEST_DATABASE_URL,
      BETTER_AUTH_URL: BASE_URL,
      // Inlined at build time; empty IDs make EmailJS refuse, and notifyOwner
      // swallows that, so test sign-ups don't email the shop.
      NEXT_PUBLIC_EMAILJS_SERVICE_ID: "",
      NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: "",
      EMAILJS_PRIVATE_KEY: "",
    },
  },
});
