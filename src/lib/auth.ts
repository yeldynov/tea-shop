import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/db";
import * as schema from "@/db/schema";

const google = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
};

/** Google sign-in is offered only when its credentials are configured. */
export const googleEnabled = Boolean(google.clientId && google.clientSecret);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: { enabled: true },
  socialProviders: googleEnabled
    ? { google: { clientId: google.clientId!, clientSecret: google.clientSecret! } }
    : {},
  user: {
    additionalFields: {
      // input: false: sign-up can't set it. Promote admins in the database.
      role: { type: "string", required: false, defaultValue: "customer", input: false },
    },
  },
  plugins: [nextCookies()], // keep nextCookies last
});

export type Session = typeof auth.$Infer.Session;
