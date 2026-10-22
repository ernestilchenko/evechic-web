import { DEFAULT_SORT, LISTING_PAGE_SIZE, LISTING_PARAMS, SORT_OPTIONS } from "../constants/listing";
import type { CatalogSort, ListingSearchParams, ListingState, ProductListQuery } from "../types";

export function toSearchParams(params: ListingSearchParams) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    const first = Array.isArray(value) ? value[0] : value;
    if (first !== undefined && first !== "") search.set(key, first);
  });
  return search;
}

function splitList(value: string | null) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toNumber(value: string | null) {
  if (value === null || value.trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

export function parseListingParams(search: URLSearchParams): ListingState {
  const sort = search.get(LISTING_PARAMS.sort) as CatalogSort | null;
  const page = Math.floor(Number(search.get(LISTING_PARAMS.page)));
  return {
    categories: splitList(search.get(LISTING_PARAMS.category)),
    sizes: splitList(search.get(LISTING_PARAMS.size)),
    colors: splitList(search.get(LISTING_PARAMS.color))
      .map(Number)
      .filter((value) => Number.isInteger(value) && value > 0),
    priceMin: toNumber(search.get(LISTING_PARAMS.priceMin)),
    priceMax: toNumber(search.get(LISTING_PARAMS.priceMax)),
    inStock: ["1", "true"].includes(search.get(LISTING_PARAMS.inStock) ?? ""),
    sort: sort && SORT_OPTIONS.includes(sort) ? sort : DEFAULT_SORT,
    page: Number.isFinite(page) && page > 1 ? page : 1,
    q: (search.get(LISTING_PARAMS.q) ?? "").trim().slice(0, 100),
  };
}

export function buildProductQuery(state: ListingState, base: ProductListQuery = {}): ProductListQuery {
  return {
    sort: state.sort,
    page: state.page,
    page_size: LISTING_PAGE_SIZE,
    size: state.sizes.length ? state.sizes : undefined,
    color: state.colors.length ? state.colors : undefined,
    price_min: state.priceMin ?? undefined,
    price_max: state.priceMax ?? undefined,
    in_stock: state.inStock || undefined,
    category: state.categories.length ? state.categories.join(",") : undefined,
    q: state.q || undefined,
    ...base,
  };
}

export function countActiveFilters(state: ListingState, includeCategories: boolean) {
  return (
    (includeCategories ? state.categories.length : 0) +
    state.sizes.length +
    state.colors.length +
    (state.priceMin !== null || state.priceMax !== null ? 1 : 0) +
    (state.inStock ? 1 : 0)
  );
}

export function listingHref(path: string, search: URLSearchParams, page: number) {
  const next = new URLSearchParams(search);
  if (page > 1) next.set(LISTING_PARAMS.page, String(page));
  else next.delete(LISTING_PARAMS.page);
  const query = next.toString();
  return query ? `${path}?${query}` : path;
}

export function canonicalPath(path: string, page: number) {
  return page > 1 ? `${path}?${LISTING_PARAMS.page}=${page}` : path;
}
