"use client";

import { useState, useTransition } from "react";

import { FormField, FormMessage, TextareaField } from "@/components/form-field";
import { sendEmailJs } from "@/lib/emailjs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const topics = ["An order", "A tea or brewing", "Teaware", "Something else"];

type Errors = Partial<Record<"form" | "name" | "email" | "message", string>>;

function validate(v: Record<string, string>): Errors {
  return {
    name: v.name ? undefined : "Enter your name.",
    email: !v.email
      ? "Enter your email address."
      : EMAIL.test(v.email)
        ? undefined
        : "Enter a valid email address, like name@example.com.",
    message: !v.message
      ? "Write a message."
      : v.message.length > 5000
        ? "Use 5,000 characters or fewer."
        : undefined,
  };
}

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(
      [...new FormData(form)].map(([k, v]) => [k, String(v).trim()]),
    );
    const invalid = validate(values);
    if (Object.values(invalid).some(Boolean)) {
      setErrors(invalid);
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }

    startTransition(async () => {
      try {
        await sendEmailJs({
          name: values.name,
          email: values.email,
          topic: values.topic,
          order: values.order || "—",
          message: values.message,
        });
      } catch {
        setErrors({ form: "We couldn’t send your message. Please try again, or email us directly." });
        return;
      }
      form.reset();
      setErrors({});
      setSent(true);
    });
  }

  function onInput(event: React.FormEvent<HTMLFormElement>) {
    const name = (event.target as HTMLInputElement).name as keyof Errors;
    setSent(false);
    if (errors[name] || errors.form) setErrors((e) => ({ ...e, [name]: undefined, form: undefined }));
  }

  return (
    <form onSubmit={onSubmit} onInput={onInput} noValidate className="flex flex-col gap-5">
      {errors.form && <FormMessage tone="error">{errors.form}</FormMessage>}
      {sent && (
        <FormMessage tone="success">
          Thank you — your message is on its way. We’ll reply within one working day.
        </FormMessage>
      )}
      <fieldset disabled={pending} className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField name="name" label="Name" autoComplete="name" maxLength={100} error={errors.name} />
          <FormField name="email" label="Email" type="email" autoComplete="email" error={errors.email} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="topic" className="label">
              About
            </label>
            <select id="topic" name="topic" className="input">
              {topics.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <FormField name="order" label="Order number" hint="Optional" maxLength={64} />
        </div>
        <TextareaField name="message" label="Message" rows={6} maxLength={5000} error={errors.message} />
        <button type="submit" className="btn-primary self-start" aria-busy={pending}>
          {pending ? "Sending…" : "Send message"}
        </button>
      </fieldset>
    </form>
  );
}
