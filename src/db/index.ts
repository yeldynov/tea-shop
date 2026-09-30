import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

function createDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  return drizzle({ client: neon(process.env.DATABASE_URL), schema });
}

type Db = ReturnType<typeof createDb>;

let instance: Db | undefined;

// Connect on first use, not at import: `next build` loads this module (via the
// auth route) and must succeed without database credentials.
export const db = new Proxy({} as Db, {
  get(_, prop) {
    instance ??= createDb();
    const value = Reflect.get(instance, prop, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
