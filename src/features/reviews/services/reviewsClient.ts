import { PROXY_BASE_URL } from "@/features/auth";
import { apiFetch } from "@/lib/api/client";
import type { ReviewCreateRequest } from "@/lib/api/types";

export function createReview(slug: string, body: ReviewCreateRequest | FormData) {
  return apiFetch<unknown>(`products/${encodeURIComponent(slug)}/reviews/create/`, {
    method: "POST",
    body,
    baseUrl: PROXY_BASE_URL,
  });
}
