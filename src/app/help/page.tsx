import type { Metadata } from "next";
import Link from "next/link";

import { Disclosure } from "@/components/disclosure";
import { HelpNav } from "@/components/help-nav";
import { MotionVideo } from "@/components/motion-video";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about ordering, shipping, storing and brewing our teas.",
};

const groups: { title: string; faqs: { q: string; a: React.ReactNode }[] }[] = [
  {
    title: "Ordering",
    faqs: [
      {
        q: "Do I need an account to order?",
        a: (
          <p>
            You can fill your bag as a guest, but you’ll need to{" "}
            <Link href="/sign-up" className="link">
              create an account
            </Link>{" "}
            or sign in at checkout, so your orders and their status are kept in one place.
          </p>
        ),
      },
      {
        q: "How do I pay?",
        a: (
          <p>
            Checkout runs on Stripe’s secure payment page, which takes all major cards and, where
            available, Apple Pay and Google Pay. We never see or store your card details.
          </p>
        ),
      },
      {
        q: "Is an item in my bag reserved for me?",
        a: (
          <p>
            Not while it’s in the bag: small lots can sell out. Once you start checkout we hold the
            stock for you for 30 minutes while you pay. If you leave or the payment fails, it goes
            back on the shelf.
          </p>
        ),
      },
      {
        q: "Can I change or cancel an order?",
        a: (
          <p>
            Write to us as soon as possible at{" "}
            <a href={`mailto:${site.email}`} className="link">
              {site.email}
            </a>{" "}
            with your order number. If it hasn’t been packed yet we’ll change it or refund it in
            full.
          </p>
        ),
      },
      {
        q: "Where can I see my orders?",
        a: (
          <p>
            Every order and its status is in{" "}
            <Link href="/account/orders" className="link">
              your account
            </Link>
            .
          </p>
        ),
      },
    ],
  },
  {
    title: "Shipping & returns",
    faqs: [
      {
        q: "Where do you ship?",
        a: <p>Within the United States for now. We hope to ship further soon.</p>,
      },
      {
        q: "How long will my tea take?",
        a: (
          <p>
            We pack orders within 2 working days, then they usually arrive in 3–5 working days. Full
            details are on the{" "}
            <Link href="/help/shipping" className="link">
              shipping &amp; returns
            </Link>{" "}
            page.
          </p>
        ),
      },
      {
        q: "Can I return something?",
        a: (
          <p>
            Unopened tea and unused teaware can come back within 30 days. Opened tea can’t, for
            hygiene reasons, but if you’re disappointed by a tea, tell us anyway.
          </p>
        ),
      },
    ],
  },
  {
    title: "Tea & teaware",
    faqs: [
      {
        q: "How should I store my tea?",
        a: (
          <p>
            Most teas want an airtight tin away from light, heat and strong smells, and are best
            within a year of opening. Pu’er is different: keep it with a little airflow and steady
            humidity, and it will keep improving for years.
          </p>
        ),
      },
      {
        q: "How do I break up a pu’er cake?",
        a: (
          <p>
            Slide a pu’er knife or a blunt butter knife into the edge of the cake, parallel to the
            layers, and lever gently so the leaves come away in flakes rather than crumbs. Take
            5–8 g for a session.
          </p>
        ),
      },
      {
        q: "I’m new to Chinese tea. Where should I start?",
        a: (
          <p>
            A ripe (shou) pu’er or a medium-roast rock oolong: both are rich and hard to over-brew.
            Our{" "}
            <Link href="/journal/brewing" className="link">
              gongfu brewing guide
            </Link>{" "}
            and{" "}
            <Link href="/journal/sheng-or-shou" className="link">
              pu’er primer
            </Link>{" "}
            are good next steps.
          </p>
        ),
      },
      {
        q: "Can I brew in a mug instead?",
        a: (
          <p>
            Yes. Use about a third of the gongfu amount of leaf and steep for 3–4 minutes. You can
            usually re-steep the same leaves once or twice.
          </p>
        ),
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="container-page pt-6 pb-section lg:pt-8">
      <HelpNav current="/help" />

      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <header className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">
            Help <span lang="zh-Hans" className="text-ink-faint not-italic">· 常见问题</span>
          </p>
          <h1>Questions, answered</h1>
          <p className="lead max-w-md">
            The things people ask us most. Can’t find yours?{" "}
            <Link href="/contact" className="link">
              Get in touch
            </Link>
            .
          </p>
          <div className="relative mt-4 hidden aspect-video overflow-hidden rounded-card bg-mist lg:block">
            <MotionVideo src="/motion/steam-calligraphy" sizes="40vw" />
          </div>
        </header>

        <div className="flex flex-col gap-12">
          {groups.map((group) => (
            <section key={group.title} className="flex flex-col gap-4">
              <h2 className="text-display-sm">{group.title}</h2>
              <div>
                {group.faqs.map((faq) => (
                  <Disclosure key={faq.q} title={faq.q}>
                    {faq.a}
                  </Disclosure>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
