import Stripe from "stripe";

let instance: Stripe | undefined;

// Created on first use, not at import: `next build` must succeed without
// Stripe credentials (same reason as the lazy `db` in src/db/index.ts).
export function getStripe() {
  if (!instance) {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not set");
    instance = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-08-26.dahlia" });
  }
  return instance;
}
