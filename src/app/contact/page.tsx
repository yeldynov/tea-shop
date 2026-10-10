import type { Metadata } from "next";
import Link from "next/link";

import { HelpNav } from "@/components/help-nav";
import { MotionVideo } from "@/components/motion-video";

import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about an order, a tea or brewing? Write to us.",
};

const shortcuts = [
  { title: "Where’s my order?", body: "Every order and its status is in your account.", href: "/account/orders", cta: "Your orders" },
  { title: "Returning something", body: "Unopened tea and unused teaware, within 30 days.", href: "/help/shipping", cta: "Shipping & returns" },
  { title: "Brewing help", body: "Leaf, water and timings for every kind of tea.", href: "/journal/brewing", cta: "Brewing guide" },
];

export default function ContactPage() {
  return (
    <div className="container-page pt-6 pb-section lg:pt-8">
      <HelpNav current="/contact" />

      <div className="split items-start">
        <div className="flex flex-col gap-10">
          <header className="flex flex-col gap-4">
            <p className="eyebrow">
              Contact <span lang="zh-Hans" className="text-ink-faint not-italic">· 联系我们</span>
            </p>
            <h1>Write to us</h1>
            <p className="lead max-w-xl">
              A question about an order, a tea that isn’t brewing the way you hoped, or just something
              you’re curious about: we read every message and answer within one working day.
            </p>
          </header>
          <ContactForm />
        </div>

        <div className="media hidden lg:block">
          <MotionVideo src="/motion/gaiwan-pour" sizes="50vw" />
        </div>
      </div>

      <section className="mt-section-sm border-t pt-section-sm">
        <h2 className="mb-8 text-display-md">Answers you might need first</h2>
        <ul className="grid-cards">
          {shortcuts.map((s) => (
            <li key={s.href} className="card flex flex-col gap-3 p-6">
              <h3 className="text-display-sm">{s.title}</h3>
              <p>{s.body}</p>
              <Link href={s.href} className="link-arrow mt-auto pt-2">
                {s.cta} <span aria-hidden>→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
