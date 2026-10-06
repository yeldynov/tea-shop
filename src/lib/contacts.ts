import { isNull, sql } from "drizzle-orm";

import { db } from "@/db";
import { contacts } from "@/db/schema";

/** Opts an email into the newsletter. True only when it wasn't subscribed before. */
export async function addSubscriber(email: string) {
  const rows = await db
    .insert(contacts)
    .values({ email, subscribedAt: sql`now()` })
    .onConflictDoUpdate({
      target: contacts.email,
      set: { subscribedAt: sql`now()` },
      setWhere: isNull(contacts.subscribedAt),
    })
    .returning({ id: contacts.id });
  return rows.length > 0;
}

/** Records a newly registered user, linking an existing subscriber row if there is one. */
export async function addRegisteredUser(userId: string, email: string) {
  await db
    .insert(contacts)
    .values({ email: email.toLowerCase(), userId })
    .onConflictDoUpdate({ target: contacts.email, set: { userId } });
}
