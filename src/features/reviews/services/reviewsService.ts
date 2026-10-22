"use cache";

import { cacheLife, cacheTag } from "next/cache";

import { apiFetch, isNotFound } from "@/lib/api/client";
import type { ProductReviewList } from "@/lib/api/types";

import { reviewsCacheTags } from "../constants/cache";

export async function getProductReviews(slug: string): Promise<ProductReviewList | null> {
  cacheLife("minutes");
  cacheTag(reviewsCacheTags.all, reviewsCacheTags.product(slug));
  try {
    return await apiFetch<ProductReviewList>(`products/${encodeURIComponent(slug)}/reviews/`);
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}
