import type { ChipTone } from "@/features/admin";

import type { ReviewStatus, ReviewTab } from "../types";

export const REVIEW_TABS: ReviewTab[] = ["pending", "approved", "rejected", "all"];
export const REVIEWS_PAGE_SIZE = 20;
export const RATINGS = [5, 4, 3, 2, 1];

export const REVIEW_TONES: Record<ReviewStatus, ChipTone> = {
  pending: "warn",
  approved: "success",
  rejected: "danger",
};

export const reviewKeys = {
  all: ["admin", "reviews"] as const,
  list: (params: object) => ["admin", "reviews", "list", params] as const,
};
