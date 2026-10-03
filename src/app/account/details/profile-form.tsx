"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { FormField, FormMessage } from "@/components/form-field";
import { authClient } from "@/lib/auth-client";

type Status = { tone: "error" | "success"; message: string } | null;

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const [nameError, setNameError] = useState<string>();
  const [status, setStatus] = useState<Status>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem("name") as HTMLInputElement;
    const value = input.value.trim();
    const error = !value
      ? "Enter your name."
      : value.length > 100
        ? "Use 100 characters or fewer."
        : undefined;
    setNameError(error);
    setStatus(null);
    if (error) return input.focus();
    if (value === name) return setStatus({ tone: "success", message: "No changes to save." });

    startTransition(async () => {
      const { error } = await authClient.updateUser({ name: value }).catch(() => ({ error: true }));
      if (error) {
        setStatus({ tone: "error", message: "We couldn’t save your details. Please try again." });
        return;
      }
      setStatus({ tone: "success", message: "Your details have been saved." });
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <fieldset disabled={pending} className="flex flex-col gap-5">
        <FormField
          name="name"
          label="Name"
          autoComplete="name"
          maxLength={100}
          defaultValue={name}
          error={nameError}
          onInput={() => nameError && setNameError(undefined)}
        />
        <FormField
          name="email"
          label="Email"
          type="email"
          defaultValue={email}
          readOnly
          hint="Contact us if you need to change your email address."
        />
      </fieldset>
      {status && <FormMessage tone={status.tone}>{status.message}</FormMessage>}
      <button
        type="submit"
        className="btn-primary self-start"
        disabled={pending}
        aria-busy={pending}
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
