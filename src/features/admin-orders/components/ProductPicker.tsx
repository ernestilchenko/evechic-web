"use client";

import { useState } from "react";

import { AdminButton, LoadingBlock, SearchField, Thumb } from "@/features/admin";
import { formatPrice } from "@/lib/format";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";

import { useProductSearch, useProductVariants } from "../hooks/useCreateOrder";
import type { DraftLine } from "../types";

type ProductPickerProps = {
  lines: DraftLine[];
  onAdd: (line: DraftLine) => void;
};

function VariantList({
  productId,
  lines,
  onAdd,
}: {
  productId: number;
  lines: DraftLine[];
  onAdd: (line: DraftLine) => void;
}) {
  const { data: product, isLoading } = useProductVariants(productId);
  if (isLoading || !product) return <LoadingBlock />;
  if (product.variants.length === 0)
    return <p className="text-placeholder px-4 py-3 text-[12px]">{t("adminOrders.new.noVariants")}</p>;

  return (
    <ul className="bg-admin-head flex flex-col">
      {product.variants.map((variant) => {
        const added = lines.some((line) => line.variantId === variant.id);
        return (
          <li
            key={variant.id}
            className="border-admin-row flex items-center gap-3 border-t px-4 py-2.5 text-[12px]"
          >
            <span
              className="size-3 rounded-full border border-black/10"
              style={{ backgroundColor: variant.color.hex }}
              aria-hidden
            />
            <span className="flex-1">
              {variant.color.name} · {variant.size}
            </span>
            <span className={cn("text-[11px]", variant.stock === 0 ? "text-sale" : "text-muted")}>
              {t("admin.dashboard.pieces", { count: variant.stock })}
            </span>
            <AdminButton
              variant="outline"
              className="px-3 py-2"
              disabled={variant.stock === 0 || added}
              onClick={() =>
                onAdd({
                  variantId: variant.id,
                  productName: product.name,
                  sku: product.sku,
                  color: variant.color.name,
                  size: variant.size,
                  price: product.price,
                  stock: variant.stock,
                  quantity: 1,
                })
              }
            >
              {added ? t("adminOrders.new.added") : t("adminOrders.new.add")}
            </AdminButton>
          </li>
        );
      })}
    </ul>
  );
}

export function ProductPicker({ lines, onAdd }: ProductPickerProps) {
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const { data: products, isFetching } = useProductSearch(q);

  return (
    <div className="flex flex-col gap-3">
      <SearchField
        value={q}
        onChange={setQ}
        label={t("adminOrders.new.searchLabel")}
        placeholder={t("adminOrders.new.searchPlaceholder")}
        className="sm:w-full"
      />
      <div aria-live="polite" aria-busy={isFetching}>
        {q.length >= 2 && products && products.length === 0 ? (
          <p className="text-placeholder text-[12px]">{t("adminOrders.new.noProducts")}</p>
        ) : null}
        {products && products.length > 0 ? (
          <ul className="border-admin-line overflow-hidden rounded border">
            {products.map((product) => (
              <li key={product.id} className="border-admin-row border-t first:border-t-0">
                <button
                  type="button"
                  aria-expanded={expanded === product.id}
                  onClick={() => setExpanded(expanded === product.id ? null : product.id)}
                  className="hover:bg-admin-bg flex w-full items-center gap-3 px-4 py-2.5 text-left"
                >
                  <Thumb src={product.main_image} alt={product.name} className="h-11 w-9" />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-[12.5px] font-medium">{product.name}</span>
                    <span className="text-placeholder text-[11px]">
                      {product.sku} · {t("admin.dashboard.pieces", { count: product.total_stock })}
                    </span>
                  </span>
                  <span className="text-[12.5px] font-semibold">{formatPrice(product.price)}</span>
                </button>
                {expanded === product.id ? (
                  <VariantList productId={product.id} lines={lines} onAdd={onAdd} />
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
