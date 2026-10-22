import type { ChipTone } from "@/features/admin";

import type { ProductStatus, ProductTab, StockState } from "../types";

export const PRODUCT_TABS: ProductTab[] = ["all", "published", "draft", "out_of_stock", "sale"];
export const PRODUCTS_PAGE_SIZE = 20;
export const BULK_STATUSES: ProductStatus[] = ["published", "draft", "archived"];

export const productKeys = {
  all: ["admin", "products"] as const,
  list: (params: object) => ["admin", "products", "list", params] as const,
  detail: (id: number) => ["admin", "products", "detail", id] as const,
  categories: ["admin", "categories"] as const,
  colors: ["admin", "colors"] as const,
};

export function productChip(
  status: ProductStatus,
  stock: StockState,
): { tone: ChipTone; key: ProductChipKey } {
  if (status === "draft") return { tone: "neutral", key: "draft" };
  if (status === "archived") return { tone: "neutral", key: "archived" };
  if (stock === "out_of_stock") return { tone: "danger", key: "out" };
  if (stock === "low") return { tone: "warn", key: "low" };
  return { tone: "success", key: "published" };
}

export type ProductChipKey = "draft" | "archived" | "out" | "low" | "published";
