import type { Metadata } from "next";
import Link from "next/link";

import { HelpNav } from "@/components/help-nav";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shipping & returns",
  description: "How and when we ship, what it costs, and how to return an order.",
};

const facts = [
  { label: "Packed", value: "2 days", hint: "working days, often sooner" },
  { label: "Delivery", value: "3–5 days", hint: "anywhere in the US" },
  { label: "Shipping", value: "Free", hint: "on orders over $60" },
  { label: "Returns", value: "30 days", hint: "unopened tea, unused teaware" },
];

export default function ShippingPage() {
  return (
    <div className="container-page pt-6 pb-section lg:pt-8">
      <HelpNav current="/help/shipping" />

      <header className="mb-10 flex flex-col gap-4 md:mb-14">
        <p className="eyebrow">
          Help <span lang="zh-Hans" className="text-ink-faint not-italic">· 配送与退货</span>
        </p>
        <h1>Shipping &amp; returns</h1>
        <p className="lead max-w-2xl">
          Packed by hand in recyclable packaging, with a tasting sample in every box.
        </p>
      </header>

      <dl className="mb-section-sm grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
        {facts.map((f) => (
          <div key={f.label} className="flex flex-col gap-2 border-t pt-5">
            <dt className="label text-ink-faint">{f.label}</dt>
            <dd className="font-display text-display-md text-matcha">{f.value}</dd>
            <dd className="text-sm">{f.hint}</dd>
          </div>
        ))}
      </dl>

      <div className="prose-tea">
        <h2>Shipping</h2>
        <p>
          We ship to addresses in the United States. Orders are packed within 2 working days of
          payment, usually the next day, and leave with a tracked carrier. Most arrive 3–5 working
          days later. Orders over $60 ship free.
        </p>
        <p>
          Tea is sealed in foil or its original wrapper and cushioned in recycled paper; teaware is
          double-boxed. Every order includes a tasting sample of something we’re drinking that
          month.
        </p>

        <h2>Returns</h2>
        <p>
          If something isn’t right, you can return unopened tea and unused teaware within 30 days of
          delivery for a full refund to your original payment method.
        </p>
        <ol>
          <li>
            Email{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a> with your order number and what you’d
            like to send back.
          </li>
          <li>We’ll reply with the return address, usually within one working day.</li>
          <li>
            Send it back well packed. We refund within 5 working days of it arriving with us.
          </li>
        </ol>
        <p>
          For hygiene reasons we can’t take back opened tea. If a tea disappointed you, please tell
          us anyway: we taste every lot and want to know.
        </p>

        <h2>Damaged or missing</h2>
        <p>
          If something arrives broken or doesn’t arrive at all, send us a photo or your order
          number within 14 days. We’ll replace it or refund it, and you won’t need to send anything
          back.
        </p>

        <p>
          More questions? See the <Link href="/help">FAQ</Link> or{" "}
          <Link href="/contact">get in touch</Link>.
        </p>
      </div>
    </div>
  );
}
