"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui/Dialog";
import { AdminButton, Field, getErrorMessage, getFieldErrors, TextInput } from "@/features/admin";
import { t } from "@/lib/i18n";

import { useSaveColor } from "../hooks/useCatalog";
import type { AdminColor } from "../types";

export function ColorDialog({ color, onClose }: { color: AdminColor | null; onClose: () => void }) {
  const mutation = useSaveColor();
  const [name, setName] = useState(color?.name ?? "");
  const [hex, setHex] = useState(color?.hex ?? "#000000");
  const errors = getFieldErrors(mutation.error);
  const formId = "color-form";

  return (
    <Dialog
      open
      size="sm"
      onClose={onClose}
      title={color ? t("adminCatalog.colors.editTitle") : t("adminCatalog.colors.createTitle")}
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
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate(
            { id: color?.id ?? null, body: { name: name.trim(), hex: hex.toUpperCase() } },
            { onSuccess: onClose },
          );
        }}
      >
        <Field label={t("adminCatalog.colors.name")} error={errors.name}>
          {(props) => (
            <TextInput
              {...props}
              required
              maxLength={60}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          )}
        </Field>
        <Field label={t("adminCatalog.colors.hex")} error={errors.hex}>
          {(props) => (
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={hex}
                onChange={(event) => setHex(event.target.value)}
                aria-label={t("adminCatalog.colors.picker")}
                className="border-admin-line h-10 w-12 rounded border bg-white p-1"
              />
              <TextInput
                {...props}
                required
                pattern="^#[0-9A-Fa-f]{6}$"
                value={hex}
                onChange={(event) => setHex(event.target.value)}
              />
            </div>
          )}
        </Field>
        {mutation.error && Object.keys(errors).length === 0 ? (
          <p role="alert" className="text-sale text-[12px]">
            {getErrorMessage(mutation.error, t("adminCatalog.toast.saveFailed"))}
          </p>
        ) : null}
      </form>
    </Dialog>
  );
}
