import type { Metadata } from "next";

import { getAllContacts } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Contacts · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

const addedAt = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

export default async function AdminContactsPage() {
  await requireAdmin("/admin/contacts");
  const contacts = await getAllContacts();
  const subscribed = contacts.filter((c) => c.subscribedAt).length;
  const registered = contacts.filter((c) => c.userId).length;

  return (
    <>
      <header className="flex flex-col gap-3">
        <p className="eyebrow">Admin</p>
        <h1>Contacts</h1>
        <p className="text-ink-soft">
          {contacts.length} {contacts.length === 1 ? "email" : "emails"} · {registered} registered ·{" "}
          {subscribed} subscribed to the newsletter
        </p>
      </header>

      {contacts.length === 0 ? (
        <p className="panel text-ink-soft">No contacts yet.</p>
      ) : (
        <ul className="card flex flex-col">
          {contacts.map((contact) => (
            <li
              key={contact.id}
              className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b p-4 last:border-b-0 sm:px-6"
            >
              <span className="flex min-w-0 flex-col gap-1">
                <a href={`mailto:${contact.email}`} className="truncate text-ink link-quiet">
                  {contact.email}
                </a>
                <span className="text-sm text-ink-faint">
                  {contact.name && <>{contact.name} · </>}
                  Added{" "}
                  <time dateTime={contact.createdAt.toISOString()}>
                    {addedAt.format(contact.createdAt)}
                  </time>
                </span>
              </span>
              <span className="flex gap-2">
                {contact.userId && <span className="badge-soft">Registered</span>}
                {contact.subscribedAt && <span className="badge-yuzu">Subscribed</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
