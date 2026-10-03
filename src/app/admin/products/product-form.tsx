"use client";

import { FormField, FormMessage, TextareaField } from "@/components/form-field";

import { createProduct, updateProduct } from "../actions";
import { useAdminForm } from "../use-admin-form";

/** Form-ready strings, built by the page from the product row. */
export type ProductFormValues = {
  id: number;
  slug: string;
  name: string;
  nameZh: string;
  categoryId: number;
  origin: string;
  description: string;
  notes: string;
  price: string;
  unit: string;
  badge: string;
  details: string;
  brew: { leaf: string; water: string; time: string; infusions: string };
  imageUrl: string;
  imageAlt: string;
  gallery: string;
};

const badges = ["New", "Limited", "Bestseller"];

export function ProductForm({
  product: v,
  categories,
}: {
  /** Omit to create a product. */
  product?: ProductFormValues;
  categories: { id: number; name: string }[];
}) {
  const create = !v;
  const { state, pending, onSubmit, error } = useAdminForm(create ? createProduct : updateProduct);

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
      {v && <input type="hidden" name="id" value={v.id} />}
      <fieldset disabled={pending} className="flex flex-col gap-8">
        <section className="card flex flex-col gap-5 p-6 sm:p-8">
          <h2 className="text-display-sm">Basics</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField name="name" label="Name" defaultValue={v?.name} maxLength={120} error={error("name")} />
            <FormField
              name="nameZh"
              label="Chinese name (optional)"
              lang="zh-Hans"
              defaultValue={v?.nameZh}
              maxLength={40}
              error={error("nameZh")}
            />
          </div>
          {create ? (
            <FormField
              name="slug"
              label="Slug"
              hint="Used in the product URL. Can’t be changed later."
              placeholder="da-hong-pao"
              error={error("slug")}
            />
          ) : (
            <FormField
              name="slug-readonly"
              label="Slug"
              defaultValue={v.slug}
              readOnly
              hint="Fixed after creation: URLs and shoppers’ bags use it."
            />
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              name="categoryId"
              label="Collection"
              defaultValue={v?.categoryId ?? ""}
              error={error("categoryId")}
            >
              <option value="" disabled>
                Choose…
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </SelectField>
            <SelectField name="badge" label="Badge" defaultValue={v?.badge ?? ""} error={error("badge")}>
              <option value="">None</option>
              {badges.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </SelectField>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <FormField
              name="price"
              label="Price (USD)"
              inputMode="decimal"
              placeholder="18.50"
              defaultValue={v?.price}
              error={error("price")}
            />
            <FormField name="unit" label="Unit" placeholder="50 g" defaultValue={v?.unit} error={error("unit")} />
            {create && (
              <FormField
                name="stock"
                label="Starting stock"
                type="number"
                min={0}
                defaultValue={0}
                error={error("stock")}
              />
            )}
          </div>
          <FormField
            name="origin"
            label="Origin"
            placeholder="Wuyi, Fujian"
            defaultValue={v?.origin}
            error={error("origin")}
          />
          <TextareaField
            name="description"
            label="Description"
            rows={5}
            maxLength={2000}
            defaultValue={v?.description}
            error={error("description")}
          />
          <FormField
            name="notes"
            label="Tasting notes"
            hint="Comma-separated, up to 8."
            placeholder="Roasted, Stone fruit, Mineral"
            defaultValue={v?.notes}
            error={error("notes")}
          />
          <TextareaField
            name="details"
            label="Details"
            hint="One per line, e.g. “Harvest: Spring 2024”."
            defaultValue={v?.details}
            error={error("details")}
          />
        </section>

        <section className="card flex flex-col gap-5 p-6 sm:p-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-display-sm">Brewing</h2>
            <p className="text-sm text-ink-soft">Teas only. Fill in all four, or leave them empty.</p>
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            <FormField name="brew-leaf" label="Leaf" placeholder="7 g" defaultValue={v?.brew.leaf} />
            <FormField name="brew-water" label="Water" placeholder="100 °C" defaultValue={v?.brew.water} />
            <FormField name="brew-time" label="Time" placeholder="5–10 s" defaultValue={v?.brew.time} />
            <FormField name="brew-infusions" label="Infusions" placeholder="8+" defaultValue={v?.brew.infusions} />
          </div>
          {error("brew") && (
            <p role="alert" className="text-sm text-danger">
              {error("brew")}
            </p>
          )}
        </section>

        <section className="card flex flex-col gap-5 p-6 sm:p-8">
          <h2 className="text-display-sm">Images</h2>
          <FormField
            name="imageUrl"
            label="Main image URL"
            type="url"
            placeholder="https://images.unsplash.com/photo-…"
            defaultValue={v?.imageUrl}
            error={error("imageUrl")}
          />
          <FormField
            name="imageAlt"
            label="Main image alt text"
            defaultValue={v?.imageAlt}
            error={error("imageAlt")}
          />
          <TextareaField
            name="gallery"
            label="Gallery (optional)"
            hint="One per line: image URL | alt text."
            defaultValue={v?.gallery}
            error={error("gallery")}
          />
        </section>
      </fieldset>

      {state && <FormMessage tone={state.tone}>{state.message}</FormMessage>}
      <button type="submit" className="btn-primary self-start" disabled={pending} aria-busy={pending}>
        {pending ? "Saving…" : create ? "Create product" : "Save changes"}
      </button>
    </form>
  );
}

function SelectField({
  name,
  label,
  error,
  ...select
}: React.ComponentProps<"select"> & { name: string; label: string; error?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="label">
        {label}
      </label>
      <select
        id={name}
        name={name}
        className="input cursor-pointer"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        {...select}
      />
      {error && (
        <p id={`${name}-error`} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
