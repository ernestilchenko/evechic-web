import { adminFetch, adminFetchPage } from "@/features/admin";

import { PRODUCTS_PAGE_SIZE } from "../constants/products";
import type {
  AdminCategory,
  AdminColor,
  BulkStatusResult,
  Product,
  ProductImage,
  ProductImageUpdate,
  ProductListParams,
  ProductListResult,
  ProductStatus,
  ProductVariant,
  ProductWrite,
  VariantWrite,
} from "../types";

export function fetchProducts({ tab, q, category, page }: ProductListParams) {
  return adminFetchPage<ProductListResult>("products", {
    query: { tab, q, category, page, page_size: PRODUCTS_PAGE_SIZE },
  });
}

export function fetchProduct(id: number) {
  return adminFetch<Product>(`products/${id}`);
}

export function createProduct(body: ProductWrite) {
  return adminFetch<Product>("products/create", { method: "POST", body });
}

export function updateProduct(id: number, body: Partial<ProductWrite>) {
  return adminFetch<Product>(`products/${id}/update`, { method: "PATCH", body });
}

export function deleteProduct(id: number) {
  return adminFetch<null>(`products/${id}/delete`, { method: "DELETE" });
}

export function publishProduct(id: number, publish: boolean) {
  return adminFetch<Product>(`products/${id}/${publish ? "publish" : "unpublish"}`, { method: "POST" });
}

export function bulkStatus(ids: number[], status: ProductStatus) {
  return adminFetch<BulkStatusResult>("products/bulk-status", { method: "POST", body: { ids, status } });
}

export function uploadImage(id: number, file: File, alt: string) {
  const body = new FormData();
  body.append("image", file);
  if (alt) body.append("alt", alt);
  return adminFetch<ProductImage>(`products/${id}/images/upload`, { method: "POST", body });
}

export function updateImage(id: number, imageId: number, body: ProductImageUpdate) {
  return adminFetch<ProductImage>(`products/${id}/images/${imageId}/update`, { method: "PATCH", body });
}

export function deleteImage(id: number, imageId: number) {
  return adminFetch<null>(`products/${id}/images/${imageId}/delete`, { method: "DELETE" });
}

export function reorderImages(id: number, ids: number[]) {
  return adminFetch<ProductImage[]>(`products/${id}/images/reorder`, { method: "POST", body: { ids } });
}

export function createVariant(id: number, body: VariantWrite) {
  return adminFetch<ProductVariant>(`products/${id}/variants/create`, { method: "POST", body });
}

export function updateVariant(id: number, variantId: number, body: Partial<VariantWrite>) {
  return adminFetch<ProductVariant>(`products/${id}/variants/${variantId}/update`, { method: "PATCH", body });
}

export function deleteVariant(id: number, variantId: number) {
  return adminFetch<null>(`products/${id}/variants/${variantId}/delete`, { method: "DELETE" });
}

export function fetchCategories() {
  return adminFetch<AdminCategory[]>("categories");
}

export function fetchColors() {
  return adminFetch<AdminColor[]>("colors");
}
