"use client";

import { useRef, useState, useTransition } from "react";

import { subscribe } from "@/app/newsletter/actions";

export function NewsletterForm() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    startTransition(async () => {
      let result;
      try {
        result = await subscribe(formData);
      } catch {
        result = { ok: false, error: "We couldn’t reach the server. Check your connection and try again." } as const;
      }
      if (!result.ok) {
        setError(result.error);
        form.querySelector("input")?.focus();
        return;
      }
      setError(undefined);
      form.reset();
      dialogRef.current?.showModal();
    });
  }

  return (
    <>
      <form onSubmit={onSubmit} noValidate className="flex w-full flex-col gap-2 lg:max-w-md">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            maxLength={254}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "newsletter-error" : undefined}
            onInput={() => setError(undefined)}
            className="input rounded-pill! px-5!"
          />
          {/* Honeypot for bots; hidden from people and assistive tech. */}
          <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          <button type="submit" disabled={pending} aria-busy={pending} className="btn-ink shrink-0">
            {pending ? "Subscribing…" : "Subscribe"}
          </button>
        </div>
        {error && (
          <p id="newsletter-error" role="alert" className="px-5 text-sm text-danger">
            {error}
          </p>
        )}
      </form>

      <dialog
        ref={dialogRef}
        aria-labelledby="newsletter-thanks"
        className="m-auto w-[min(32rem,calc(100%-2rem))] rounded-panel bg-cream p-8 sm:p-12 text-center backdrop:bg-ink/50"
      >
        <div className="flex flex-col items-center gap-4">
          <p className="eyebrow">
            Subscribed <span lang="zh-Hans" className="text-ink-faint not-italic">· 谢谢</span>
          </p>
          <h2 id="newsletter-thanks" className="text-display-md">
            You’re on the list
          </h2>
          <p>
            Next time spring teas arrive or a cake leaves the cellar, you’ll hear about it first.
          </p>
          <form method="dialog">
            <button className="btn-primary" autoFocus>
              Close
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
