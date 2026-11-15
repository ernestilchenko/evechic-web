"use client";

import Image from "next/image";
import { useState } from "react";

import { Dialog } from "@/components/ui/Dialog";
import { Select } from "@/components/ui/Select";
import { AdminButton, Checkbox, Field, getErrorMessage, getFieldErrors, TextInput } from "@/features/admin";
import { t } from "@/lib/i18n";

import { useSaveCategory } from "../hooks/useCatalog";
import type { AdminCategory, CategoryDraft, CategoryNode } from "../types";

type CategoryDialogProps = {
  category: AdminCategory | null;
  nodes: CategoryNode[];
  onClose: () => void;
};

function descendants(nodes: CategoryNode[], id: number): Set<number> {
  const result = new Set<number>([id]);
  let grew = true;
  while (grew) {
    grew = false;
    nodes.forEach((node) => {
      if (node.parent !== null && result.has(node.parent) && !result.has(node.id)) {
        result.add(node.id);
        grew = true;
      }
    });
  }
  return result;
}

export function CategoryDialog({ category, nodes, onClose }: CategoryDialogProps) {
  const mutation = useSaveCategory();
  const [draft, setDraft] = useState<CategoryDraft>({
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    parent: category?.parent ? String(category.parent) : "",
    sort_order: String(category?.sort_order ?? 0),
    is_active: category?.is_active ?? true,
    image: null,
  });
  const [preview, setPreview] = useState<string | null>(category?.image ?? null);
  const errors = getFieldErrors(mutation.error);
  const excluded = category ? descendants(nodes, category.id) : new Set<number>();
  const set = (patch: Partial<CategoryDraft>) => setDraft((state) => ({ ...state, ...patch }));
  const formId = "category-form";

  return (
    <Dialog
      open
      onClose={onClose}
      title={category ? t("adminCatalog.categories.editTitle") : t("adminCatalog.categories.createTitle")}
      closeLabel={t("adminCatalog.cancel")}
      footer={
        <>
          <AdminButton variant="outline" onClick={onClose}>
            {t("adminCatalog.cancel")}
          </AdminButton>
          <AdminButton type="submit" form={formId} disabled={mutation.isPending}>
            {mutation.isPending ? t("adminCatalog.saving") : t("adminCatalog.save")}
          </AdminButton>
        </>
      }
    >
      <form
        id={formId}
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate({ id: category?.id ?? null, draft }, { onSuccess: onClose });
        }}
      >
        <Field label={t("adminCatalog.categories.name")} error={errors.name} className="sm:col-span-2">
          {(props) => (
            <TextInput
              {...props}
              required
              maxLength={120}
              value={draft.name}
              onChange={(event) => set({ name: event.target.value })}
            />
          )}
        </Field>
        <Field
          label={t("adminCatalog.categories.slug")}
          hint={t("adminCatalog.categories.slugHint")}
          error={errors.slug}
        >
          {(props) => (
            <TextInput
              {...props}
              maxLength={140}
              value={draft.slug}
              onChange={(event) => set({ slug: event.target.value })}
            />
          )}
        </Field>
        <Field label={t("adminCatalog.categories.parent")} error={errors.parent}>
          {(props) => (
            <Select {...props} value={draft.parent} onChange={(event) => set({ parent: event.target.value })}>
              <option value="">{t("adminCatalog.categories.root")}</option>
              {nodes
                .filter((node) => !excluded.has(node.id))
                .map((node) => (
                  <option key={node.id} value={node.id}>
                    {`${"— ".repeat(node.depth)}${node.name}`}
                  </option>
                ))}
            </Select>
          )}
        </Field>
        <Field label={t("adminCatalog.categories.sortOrder")} error={errors.sort_order}>
          {(props) => (
            <TextInput
              {...props}
              type="number"
              min={0}
              value={draft.sort_order}
              onChange={(event) => set({ sort_order: event.target.value })}
            />
          )}
        </Field>
        <div className="flex items-end pb-2.5">
          <Checkbox
            label={t("adminCatalog.categories.active")}
            checked={draft.is_active}
            onChange={(event) => set({ is_active: event.target.checked })}
          />
        </div>
        <Field label={t("adminCatalog.categories.image")} error={errors.image} className="sm:col-span-2">
          {(props) => (
            <div className="flex items-center gap-4">
              {preview ? (
                <span className="bg-sand relative block h-20 w-16 shrink-0 overflow-hidden rounded">
                  <Image
                    src={preview}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover object-top"
                    unoptimized={preview.startsWith("blob:")}
                  />
                </span>
              ) : null}
              <input
                {...props}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="text-[12px]"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  set({ image: file });
                  setPreview(file ? URL.createObjectURL(file) : (category?.image ?? null));
                }}
              />
            </div>
          )}
        </Field>
        {mutation.error && Object.keys(errors).length === 0 ? (
          <p role="alert" className="text-sale text-[12px] sm:col-span-2">
            {getErrorMessage(mutation.error, t("adminCatalog.toast.saveFailed"))}
          </p>
        ) : null}
      </form>
    </Dialog>
  );
}
