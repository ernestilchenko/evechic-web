"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Select } from "@/components/ui/Select";
import { AdminButton, Field, getFieldErrors, Panel, TextArea, TextInput } from "@/features/admin";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";

import { useCategoriesOptions, useSaveProduct } from "../hooks/useProducts";
import type { Product, ProductStatus, ProductWrite } from "../types";
import { CategorySelect } from "./CategorySelect";

type FormState = {
  name: string;
  sku: string;
  slug: string;
  category: string;
  price: string;
  old_price: string;
  description: string;
  composition_care: string;
  status: ProductStatus;
};

function initialState(product: Product | null): FormState {
  return {
    name: product?.name ?? "",
    sku: product?.sku ?? "",
    slug: product?.slug ?? "",
    category: product ? String(product.category) : "",
    price: product?.price ?? "",
    old_price: product?.old_price ?? "",
    description: product?.description ?? "",
    composition_care: product?.composition_care ?? "",
    status: product?.status ?? "draft",
  };
}

export function ProductForm({ product }: { product: Product | null }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => initialState(product));
  const { data: categories = [] } = useCategoriesOptions();
  const mutation = useSaveProduct(product?.id ?? null);
  const errors = getFieldErrors(mutation.error);
  const set = (patch: Partial<FormState>) => setForm((state) => ({ ...state, ...patch }));

  return (
    <Panel title={t("adminProducts.form.main")} titleId="product-main">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          const body: ProductWrite = {
            name: form.name.trim(),
            sku: form.sku.trim(),
            category: Number(form.category),
            price: form.price,
            old_price: form.old_price ? form.old_price : null,
            description: form.description,
            composition_care: form.composition_care,
            ...(form.slug.trim() ? { slug: form.slug.trim() } : {}),
            ...(product ? {} : { status: form.status }),
          };
          mutation.mutate(body, {
            onSuccess: (saved) => {
              if (!product) router.replace(routes.admin.product(saved.id));
            },
          });
        }}
      >
        <Field label={t("adminProducts.form.name")} error={errors.name} className="sm:col-span-2">
          {(props) => (
            <TextInput
              {...props}
              required
              maxLength={200}
              value={form.name}
              onChange={(event) => set({ name: event.target.value })}
            />
          )}
        </Field>
        <Field label={t("adminProducts.form.sku")} error={errors.sku}>
          {(props) => (
            <TextInput
              {...props}
              required
              maxLength={40}
              value={form.sku}
              onChange={(event) => set({ sku: event.target.value })}
            />
          )}
        </Field>
        <Field
          label={t("adminProducts.form.slug")}
          hint={t("adminProducts.form.slugHint")}
          error={errors.slug}
        >
          {(props) => (
            <TextInput
              {...props}
              maxLength={220}
              value={form.slug}
              onChange={(event) => set({ slug: event.target.value })}
            />
          )}
        </Field>
        <Field label={t("adminProducts.form.category")} error={errors.category}>
          {(props) => (
            <CategorySelect
              {...props}
              required
              categories={categories}
              emptyLabel={t("adminProducts.form.chooseCategory")}
              value={form.category}
              onChange={(event) => set({ category: event.target.value })}
            />
          )}
        </Field>
        {!product ? (
          <Field label={t("adminProducts.form.status")} hint={t("adminProducts.form.statusHint")}>
            {(props) => (
              <Select
                {...props}
                value={form.status}
                onChange={(event) => set({ status: event.target.value as ProductStatus })}
              >
                <option value="draft">{t("adminProducts.chip.draft")}</option>
                <option value="archived">{t("adminProducts.chip.archived")}</option>
              </Select>
            )}
          </Field>
        ) : (
          <div />
        )}
        <Field label={t("adminProducts.form.price")} error={errors.price}>
          {(props) => (
            <TextInput
              {...props}
              required
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              value={form.price}
              onChange={(event) => set({ price: event.target.value })}
            />
          )}
        </Field>
        <Field
          label={t("adminProducts.form.oldPrice")}
          hint={t("adminProducts.form.oldPriceHint")}
          error={errors.old_price}
        >
          {(props) => (
            <TextInput
              {...props}
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              value={form.old_price}
              onChange={(event) => set({ old_price: event.target.value })}
            />
          )}
        </Field>
        <Field
          label={t("adminProducts.form.description")}
          error={errors.description}
          className="sm:col-span-2"
        >
          {(props) => (
            <TextArea
              {...props}
              rows={6}
              value={form.description}
              onChange={(event) => set({ description: event.target.value })}
            />
          )}
        </Field>
        <Field
          label={t("adminProducts.form.composition")}
          error={errors.composition_care}
          className="sm:col-span-2"
        >
          {(props) => (
            <TextArea
              {...props}
              rows={4}
              value={form.composition_care}
              onChange={(event) => set({ composition_care: event.target.value })}
            />
          )}
        </Field>
        <div className="sm:col-span-2">
          <AdminButton type="submit" disabled={mutation.isPending}>
            {mutation.isPending
              ? t("adminProducts.saving")
              : product
                ? t("adminProducts.save")
                : t("adminProducts.form.createSubmit")}
          </AdminButton>
        </div>
      </form>
    </Panel>
  );
}
