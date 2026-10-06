"use server";

import { after } from "next/server";

import { addSubscriber } from "@/lib/contacts";
import { notifyOwner } from "@/lib/emailjs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SubscribeResult = { ok: true } | { ok: false; error: string };

// Open to guests. Already-subscribed emails get the same success response, so
// the form doesn't reveal who's on the list.
export async function subscribe(formData: FormData): Promise<SubscribeResult> {
  // Honeypot: hidden from people, filled in by bots. Pretend it worked.
  if (formData.get("company")) return { ok: true };

  const raw = formData.get("email");
  const email = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  if (!email) return { ok: false, error: "Enter your email address." };
  if (email.length > 254 || !EMAIL.test(email))
    return { ok: false, error: "Enter a valid email address, like name@example.com." };

  try {
    if (await addSubscriber(email)) after(() => notifyOwner("New subscriber", email));
  } catch (error) {
    console.error("Subscribe failed", error);
    return { ok: false, error: "Something went wrong on our side. Please try again." };
  }
  return { ok: true };
}
