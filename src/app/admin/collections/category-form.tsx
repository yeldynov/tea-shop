"use client";

import { FormField, FormMessage, TextareaField } from "@/components/form-field";

import { createCategory, deleteCategory, updateCategory } from "../actions";
import { useAdminForm } from "../use-admin-form";

export type CategoryFormValues = {
  id: number;
  slug: string;
  name: string;
  nameZh: string;
  blurb: string;
  imageUrl: string;
  imageAlt: string;
  sortOrder: number;
};

export function CategoryForm({ category: v }: { /** Omit to create one. */ category?: CategoryFormValues }) {
  const create = !v;
  const { state, pending, onSubmit, error } = useAdminForm(create ? createCategory : updateCategory);

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      {v && <input type="hidden" name="id" value={v.id} />}
      <fieldset disabled={pending} className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField name="name" label="Name" placeholder="White tea" defaultValue={v?.name} error={error("name")} />
          <FormField
            name="nameZh"
            label="Chinese name"
            lang="zh-Hans"
            placeholder="白茶"
            defaultValue={v?.nameZh}
            error={error("nameZh")}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {create ? (
            <FormField
              name="slug"
              label="Slug"
              placeholder="white-tea"
              hint="Used in /collections/… Can’t be changed later."
              error={error("slug")}
            />
          ) : (
            <FormField name="slug-readonly" label="Slug" defaultValue={v.slug} readOnly hint="Fixed after creation." />
          )}
          <FormField
            name="sortOrder"
            label="Position"
            type="number"
            min={0}
            defaultValue={v?.sortOrder ?? 0}
            hint="Lower comes first."
            error={error("sortOrder")}
          />
        </div>
        <TextareaField name="blurb" label="Blurb" rows={3} defaultValue={v?.blurb} error={error("blurb")} />
        <FormField
          name="imageUrl"
          label="Image URL"
          type="url"
          placeholder="https://images.unsplash.com/photo-…"
          defaultValue={v?.imageUrl}
          error={error("imageUrl")}
        />
        <FormField name="imageAlt" label="Image alt text" defaultValue={v?.imageAlt} error={error("imageAlt")} />
      </fieldset>
      {state && <FormMessage tone={state.tone}>{state.message}</FormMessage>}
      <button type="submit" className="btn-primary self-start" disabled={pending} aria-busy={pending}>
        {pending ? "Saving…" : create ? "Create collection" : "Save changes"}
      </button>
    </form>
  );
}

export function DeleteCategoryForm({ id }: { id: number }) {
  const { state, pending, onSubmit } = useAdminForm(deleteCategory);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={id} />
      {state && <FormMessage tone={state.tone}>{state.message}</FormMessage>}
      <button type="submit" className="btn-outline btn-sm self-start text-danger" disabled={pending} aria-busy={pending}>
        {pending ? "Deleting…" : "Delete collection"}
      </button>
    </form>
  );
}
