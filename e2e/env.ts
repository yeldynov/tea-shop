// Shared by playwright.config.ts and global-setup.ts. Files are parsed, not
// loaded into process.env, so the dev DATABASE_URL can never leak into a run.
import { existsSync, readFileSync } from "node:fs";
import { parse } from "dotenv";

function read(file: string): Record<string, string> {
  return existsSync(file) ? parse(readFileSync(file)) : {};
}

const testEnv = read(".env.test.local");
const devEnv = read(".env.local");

export const PORT = 3100;
export const BASE_URL = `http://localhost:${PORT}`;
export const TEST_DATABASE_URL = testEnv.DATABASE_URL ?? "";
export const CUSTOMER_STATE = "e2e/.auth/customer.json";

/** Throws unless the run points at a separate test database and a Stripe test key. */
export function assertSafeEnv() {
  if (!TEST_DATABASE_URL) {
    throw new Error("E2E: set DATABASE_URL for the test Neon branch in .env.test.local");
  }
  if (TEST_DATABASE_URL === devEnv.DATABASE_URL) {
    throw new Error("E2E: .env.test.local points at the same database as .env.local");
  }
  const stripeKey = process.env.STRIPE_SECRET_KEY ?? devEnv.STRIPE_SECRET_KEY ?? "";
  if (!stripeKey.includes("_test_")) {
    throw new Error("E2E: STRIPE_SECRET_KEY must be a test-mode key (sk_test_/rk_test_)");
  }
}
