import { cacheLife, cacheTag } from "next/cache";

import { apiFetch, apiFetchPaginated, isNotFound } from "@/lib/api/client";
import type { CategoryTree, ProductCard, ProductDetail, ProductFilters } from "@/lib/api/types";

import { catalogCacheTags } from "../constants/cache";
import type { ProductListQuery } from "../types";

export async function getCategories() {
  "use cache";
  cacheLife("hours");
  cacheTag(catalogCacheTags.categories);
  return apiFetch<CategoryTree[]>("categories/");
}

export async function getProducts(query: ProductListQuery = {}) {
  "use cache";
  cacheLife("minutes");
  cacheTag(catalogCacheTags.products);
  return apiFetchPaginated<ProductCard>("products/", { query });
}

export async function getProductFilters(category?: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag(catalogCacheTags.products);
  return apiFetch<ProductFilters>("products/filters/", { query: { category } });
}

export async function getProduct(slug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag(catalogCacheTags.products, catalogCacheTags.product(slug));
  try {
    return await apiFetch<ProductDetail>(`products/${encodeURIComponent(slug)}/`);
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

export async function getSimilarProducts(slug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag(catalogCacheTags.products, catalogCacheTags.product(slug));
  try {
    return await apiFetch<ProductCard[]>(`products/${encodeURIComponent(slug)}/similar/`);
  } catch (error) {
    if (isNotFound(error)) return [];
    throw error;
  }
}
