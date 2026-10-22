"use client";

import { useState } from "react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Select } from "@/components/ui/Select";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/Table";
import { AdminButton, Panel, StatusChip, TextInput } from "@/features/admin";
import { t } from "@/lib/i18n";

import { useDeleteVariant, useSaveVariant } from "../hooks/useProductMedia";
import { useColorsOptions } from "../hooks/useProducts";
import type { AdminColor, Product, ProductVariant } from "../types";

type Draft = { color: string; size: string; stock: string };

function VariantRow({
  productId,
  variant,
  colors,
  onDelete,
}: {
  productId: number;
  variant: ProductVariant | null;
  colors: AdminColor[];
  onDelete?: () => void;
}) {
  const initial: Draft = variant
    ? { color: String(variant.color.id), size: variant.size, stock: String(variant.stock) }
    : { color: "", size: "", stock: "0" };
  const [draft, setDraft] = useState<Draft>(initial);
  const save = useSaveVariant(productId);
  const dirty = draft.color !== initial.color || draft.size !== initial.size || draft.stock !== initial.stock;
  const valid = draft.color !== "" && draft.size.trim() !== "" && Number(draft.stock) >= 0;
  const rowLabel = variant ? `${variant.color.name} ${variant.size}` : t("adminProducts.variants.new");

  return (
    <Tr>
      <Td className="py-2.5">
        <Select
          aria-label={t("adminProducts.variants.colorFor", { variant: rowLabel })}
          value={draft.color}
          onChange={(event) => setDraft({ ...draft, color: event.target.value })}
          className="min-w-[140px]"
        >
          <option value="">{t("adminProducts.variants.chooseColor")}</option>
          {colors.map((color) => (
            <option key={color.id} value={color.id}>
              {color.name}
            </option>
          ))}
        </Select>
      </Td>
      <Td className="py-2.5">
        <TextInput
          aria-label={t("adminProducts.variants.sizeFor", { variant: rowLabel })}
          value={draft.size}
          maxLength={10}
          onChange={(event) => setDraft({ ...draft, size: event.target.value.toUpperCase() })}
          className="w-24"
        />
      </Td>
      <Td className="py-2.5">
        <TextInput
          aria-label={t("adminProducts.variants.stockFor", { variant: rowLabel })}
          type="number"
          min={0}
          value={draft.stock}
          onChange={(event) => setDraft({ ...draft, stock: event.target.value })}
          className="w-24"
        />
      </Td>
      <Td className="py-2.5">
        {variant ? (
          <StatusChip
            tone={
              variant.stock_state === "in_stock"
                ? "success"
                : variant.stock_state === "low"
                  ? "warn"
                  : "danger"
            }
          >
            {t(`adminProducts.stock.${variant.stock_state}`)}
          </StatusChip>
        ) : null}
      </Td>
      <Td className="py-2.5 text-right whitespace-nowrap">
        <AdminButton
          variant={variant ? "outline" : "primary"}
          disabled={!dirty || !valid || save.isPending}
          onClick={() =>
            save.mutate(
              {
                variantId: variant?.id ?? null,
                body: { color: Number(draft.color), size: draft.size.trim(), stock: Number(draft.stock) },
              },
              { onSuccess: () => (variant ? undefined : setDraft(initial)) },
            )
          }
        >
          {variant ? t("adminProducts.save") : t("adminProducts.variants.add")}
        </AdminButton>
        {onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            aria-label={t("adminProducts.variants.delete", { variant: rowLabel })}
            className="text-sale hover:bg-admin-danger-bg ml-2 rounded px-2 py-1 text-[14px]"
          >
            ×
          </button>
        ) : null}
      </Td>
    </Tr>
  );
}

export function ProductVariants({ product }: { product: Product }) {
  const { data: colors = [] } = useColorsOptions();
  const remove = useDeleteVariant(product.id);
  const [toDelete, setToDelete] = useState<ProductVariant | null>(null);

  return (
    <Panel title={t("adminProducts.variants.title")} titleId="product-variants" padded={false}>
      <Table>
        <THead>
          <tr>
            <Th>{t("adminProducts.variants.color")}</Th>
            <Th>{t("adminProducts.variants.size")}</Th>
            <Th>{t("adminProducts.variants.stock")}</Th>
            <Th>{t("adminProducts.variants.state")}</Th>
            <Th>
              <span className="sr-only">{t("adminProducts.col.actions")}</span>
            </Th>
          </tr>
        </THead>
        <TBody>
          {product.variants.map((variant) => (
            <VariantRow
              key={`${variant.id}-${variant.stock}-${variant.size}-${variant.color.id}`}
              productId={product.id}
              variant={variant}
              colors={colors}
              onDelete={() => setToDelete(variant)}
            />
          ))}
          <VariantRow productId={product.id} variant={null} colors={colors} />
        </TBody>
      </Table>
      <p className="text-placeholder px-5 py-3 text-[11px] sm:px-[22px]">
        {t("adminProducts.variants.hint")}
      </p>
      <ConfirmDialog
        open={toDelete !== null}
        tone="danger"
        title={t("adminProducts.variants.confirmTitle", {
          variant: toDelete ? `${toDelete.color.name} ${toDelete.size}` : "",
        })}
        message={t("adminProducts.variants.confirmText")}
        confirmLabel={t("adminProducts.delete")}
        cancelLabel={t("adminProducts.cancel")}
        pending={remove.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate(toDelete.id, { onSettled: () => setToDelete(null) })}
      />
    </Panel>
  );
}
