type Props = React.ComponentProps<"input"> & {
  name: string;
  label: string;
  hint?: string;
  error?: string;
};

/** Labelled input with an optional hint and inline error, wired up for screen readers. */
export function FormField({ name, label, hint, error, ...input }: Props) {
  // The error replaces the hint; it usually restates it.
  const describedBy = error ? `${name}-error` : hint ? `${name}-hint` : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="label">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className="input"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...input}
      />
      {hint && !error && (
        <p id={`${name}-hint`} className="text-sm text-ink-faint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/** FormField's multi-line sibling. */
export function TextareaField({
  name,
  label,
  hint,
  error,
  ...textarea
}: React.ComponentProps<"textarea"> & { name: string; label: string; hint?: string; error?: string }) {
  const describedBy = error ? `${name}-error` : hint ? `${name}-hint` : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="label">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={4}
        className="input py-3"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...textarea}
      />
      {hint && !error && (
        <p id={`${name}-hint`} className="text-sm text-ink-faint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/** Form-level message. Errors are announced immediately, successes politely. */
export function FormMessage({ tone, children }: { tone: "error" | "success"; children: string }) {
  return tone === "error" ? (
    <p role="alert" className="rounded-md bg-sakura px-4 py-3 text-sm text-danger">
      {children}
    </p>
  ) : (
    <p role="status" className="rounded-md bg-matcha-pale px-4 py-3 text-sm text-matcha-deep">
      {children}
    </p>
  );
}
