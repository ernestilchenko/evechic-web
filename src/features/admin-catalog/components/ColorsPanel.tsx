"use client";

import { useState } from "react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { AdminButton, ErrorBlock, LoadingBlock, Panel } from "@/features/admin";
import { t, tPlural } from "@/lib/i18n";

import { useColors, useDeleteColor } from "../hooks/useCatalog";
import type { AdminColor } from "../types";
import { ColorDialog } from "./ColorDialog";

export function ColorsPanel() {
  const { data: colors, error, isLoading, refetch } = useColors();
  const remove = useDeleteColor();
  const [editing, setEditing] = useState<AdminColor | null | undefined>(undefined);
  const [toDelete, setToDelete] = useState<AdminColor | null>(null);

  return (
    <Panel
      title={t("adminCatalog.colors.title")}
      titleId="colors-title"
      action={
        <AdminButton variant="outline" onClick={() => setEditing(null)}>
          + {t("adminCatalog.colors.add")}
        </AdminButton>
      }
    >
      {isLoading ? <LoadingBlock /> : null}
      {error ? <ErrorBlock error={error} onRetry={() => refetch()} /> : null}
      {colors ? (
        <ul className="flex flex-col">
          {colors.map((color) => (
            <li
              key={color.id}
              className="border-admin-row flex items-center gap-3 border-t py-3 first:border-t-0"
            >
              <span
                className="size-6 shrink-0 rounded-full border border-black/10"
                style={{ backgroundColor: color.hex }}
                aria-hidden
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-[12.5px] font-medium">{color.name}</span>
                <span className="text-placeholder text-[11px]">
                  {color.hex} · {tPlural("adminCatalog.colors.variants", color.variants_count)}
                </span>
              </div>
              <button type="button" className="text-[11px] hover:underline" onClick={() => setEditing(color)}>
                {t("adminCatalog.edit")}
              </button>
              <button
                type="button"
                className="text-sale text-[11px] hover:underline disabled:opacity-40 disabled:hover:no-underline"
                disabled={color.variants_count > 0}
                title={color.variants_count > 0 ? t("adminCatalog.colors.inUse") : undefined}
                onClick={() => setToDelete(color)}
              >
                {t("adminCatalog.delete")}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {editing !== undefined ? <ColorDialog color={editing} onClose={() => setEditing(undefined)} /> : null}
      <ConfirmDialog
        open={toDelete !== null}
        tone="danger"
        title={t("adminCatalog.colors.confirmDelete", { name: toDelete?.name ?? "" })}
        confirmLabel={t("adminCatalog.delete")}
        cancelLabel={t("adminCatalog.cancel")}
        pending={remove.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate(toDelete.id, { onSettled: () => setToDelete(null) })}
      />
    </Panel>
  );
}
