import { execSync } from "node:child_process";

import { TEST_DATABASE_URL } from "./env";

// Runs once before all tests: migrate and reseed the test branch, so every run
// starts from the same catalog and stock.
export default function globalSetup() {
  execSync("pnpm db:migrate && pnpm db:seed", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
  });
}
