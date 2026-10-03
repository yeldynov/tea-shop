"use client";

import { startTransition, useActionState } from "react";

import type { AdminFormState } from "./actions";

/**
 * useActionState, submitted from onSubmit instead of `<form action>`: React
 * resets a form after every action, which would wipe the admin's input when
 * validation fails.
 */
export function useAdminForm(
  action: (state: AdminFormState, formData: FormData) => Promise<AdminFormState>,
) {
  const [state, dispatch, pending] = useActionState(action, null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => dispatch(formData));
  }

  return { state, pending, onSubmit, error: (name: string) => state?.errors?.[name] };
}
