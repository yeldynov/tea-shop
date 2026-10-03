"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { FormField, FormMessage } from "@/components/form-field";
import { authClient } from "@/lib/auth-client";

type Errors = Partial<Record<"form" | "name" | "email" | "password", string>>;
type Values = Record<string, string>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Better Auth's defaults; the server enforces them too.
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 128;

function emailError(email: string) {
  if (!email) return "Enter your email address.";
  if (!EMAIL.test(email)) return "Enter a valid email address, like name@example.com.";
}

/** Better Auth error → message on the right field. Unknown errors stay generic. */
function fromAuthError(error: { code?: string; status: number }): Errors {
  if (error.status === 429) return { form: "Too many attempts. Wait a minute, then try again." };
  switch (error.code) {
    case "INVALID_EMAIL_OR_PASSWORD":
      return { form: "That email and password don’t match. Check them and try again." };
    case "USER_ALREADY_EXISTS":
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
      return { email: "An account with this email already exists. Sign in instead." };
    case "INVALID_EMAIL":
      return { email: "Enter a valid email address, like name@example.com." };
    case "PASSWORD_TOO_SHORT":
      return { password: `Use at least ${PASSWORD_MIN} characters.` };
    case "PASSWORD_TOO_LONG":
      return { password: `Use ${PASSWORD_MAX} characters or fewer.` };
  }
  return { form: "Something went wrong on our side. Please try again." };
}

/**
 * Shared submit flow: validate locally, call Better Auth over HTTP (so its rate
 * limiting and origin checks apply), then navigate to `next`.
 */
function useAuthForm(
  next: string,
  validate: (values: Values) => Errors,
  submit: (values: Values) => Promise<{ error: { code?: string; status: number } | null }>,
) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [failures, setFailures] = useState(0);
  const [pending, startTransition] = useTransition();

  // After a failed submit, move focus to the first invalid field. Form-level
  // errors are announced via role="alert" instead.
  useEffect(() => {
    if (failures) formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [failures]);

  function fail(next: Errors) {
    setErrors(next);
    setFailures((n) => n + 1);
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget)) as Values;
    const invalid = validate(values);
    if (Object.values(invalid).some(Boolean)) return fail(invalid);

    startTransition(async () => {
      try {
        const { error } = await submit(values);
        if (error) return fail(fromAuthError(error));
      } catch {
        return fail({ form: "We couldn’t reach the server. Check your connection and try again." });
      }
      // Full navigation: fresh server render with the new session, scrolled to the top.
      // `pending` stays true until the page unloads.
      window.location.assign(next);
    });
  }

  // Clear a field's error as soon as it's edited.
  function onInput(event: React.FormEvent<HTMLFormElement>) {
    const name = (event.target as HTMLInputElement).name as keyof Errors;
    if (errors[name] || errors.form)
      setErrors((e) => ({ ...e, [name]: undefined, form: undefined }));
  }

  return { formRef, errors, pending, onSubmit, onInput };
}

const formClass = "flex flex-col gap-5";

export function SignInForm({ next }: { next: string }) {
  const { formRef, errors, pending, onSubmit, onInput } = useAuthForm(
    next,
    (v) => ({
      email: emailError(v.email.trim()),
      password: v.password ? undefined : "Enter your password.",
    }),
    (v) => authClient.signIn.email({ email: v.email.trim(), password: v.password }),
  );

  return (
    <form ref={formRef} onSubmit={onSubmit} onInput={onInput} noValidate className={formClass}>
      {errors.form && <FormMessage tone="error">{errors.form}</FormMessage>}
      <fieldset disabled={pending} className={formClass}>
        <FormField
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email}
        />
        <FormField
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password}
        />
        <button type="submit" className="btn-primary" aria-busy={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </fieldset>
    </form>
  );
}

export function SignUpForm({ next }: { next: string }) {
  const { formRef, errors, pending, onSubmit, onInput } = useAuthForm(
    next,
    (v) => ({
      name: !v.name.trim()
        ? "Enter your name."
        : v.name.trim().length > 100
          ? "Use 100 characters or fewer."
          : undefined,
      email: emailError(v.email.trim()),
      password:
        v.password.length < PASSWORD_MIN
          ? `Use at least ${PASSWORD_MIN} characters.`
          : v.password.length > PASSWORD_MAX
            ? `Use ${PASSWORD_MAX} characters or fewer.`
            : undefined,
    }),
    (v) =>
      authClient.signUp.email({ name: v.name.trim(), email: v.email.trim(), password: v.password }),
  );

  return (
    <form ref={formRef} onSubmit={onSubmit} onInput={onInput} noValidate className={formClass}>
      {errors.form && <FormMessage tone="error">{errors.form}</FormMessage>}
      <fieldset disabled={pending} className={formClass}>
        <FormField
          name="name"
          label="Name"
          autoComplete="name"
          maxLength={100}
          error={errors.name}
        />
        <FormField
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email}
        />
        <FormField
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          hint={`At least ${PASSWORD_MIN} characters.`}
          error={errors.password}
        />
        <button type="submit" className="btn-primary" aria-busy={pending}>
          {pending ? "Creating your account…" : "Create account"}
        </button>
      </fieldset>
    </form>
  );
}

export function GoogleButton({ next }: { next: string }) {
  // Stays true on success: the browser is leaving for Google.
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string>();

  async function onClick() {
    setRedirecting(true);
    setError(undefined);
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: next,
        errorCallbackURL: "/sign-in",
      });
      if (error) throw error;
    } catch {
      setRedirecting(false);
      setError("Google sign-in isn’t available right now. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <FormMessage tone="error">{error}</FormMessage>}
      <button
        type="button"
        onClick={onClick}
        disabled={redirecting}
        aria-busy={redirecting}
        className="btn-outline w-full"
      >
        {redirecting ? "Redirecting to Google…" : "Continue with Google"}
      </button>
    </div>
  );
}
