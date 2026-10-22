import type { CatalogSort } from "../types";

export const LISTING_PAGE_SIZE = 12;

export const DEFAULT_SORT: CatalogSort = "newest";

export const SORT_OPTIONS: readonly CatalogSort[] = ["newest", "price_asc", "price_desc", "popular"];

export const LISTING_PARAMS = {
  category: "category",
  size: "size",
  color: "color",
  priceMin: "price_min",
  priceMax: "price_max",
  inStock: "in_stock",
  sort: "sort",
  page: "page",
  q: "q",
} as const;

export const FILTER_PARAM_KEYS = [
  LISTING_PARAMS.category,
  LISTING_PARAMS.size,
  LISTING_PARAMS.color,
  LISTING_PARAMS.priceMin,
  LISTING_PARAMS.priceMax,
  LISTING_PARAMS.inStock,
] as const;
