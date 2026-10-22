import { PROXY_BASE_URL } from "@/features/auth";
import { apiFetch } from "@/lib/api/client";
import type { ProductCard } from "@/lib/api/types";

export function fetchFavorites() {
  return apiFetch<ProductCard[]>("favorites/", { baseUrl: PROXY_BASE_URL });
}

export function addFavorite(productId: number) {
  return apiFetch<unknown>(`favorites/${productId}/add/`, { method: "POST", baseUrl: PROXY_BASE_URL });
}

export function removeFavorite(productId: number) {
  return apiFetch<unknown>(`favorites/${productId}/remove/`, { method: "DELETE", baseUrl: PROXY_BASE_URL });
}
