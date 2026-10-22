import { adminFetch, adminFetchPage } from "@/features/admin";

import { REVIEWS_PAGE_SIZE } from "../constants/reviews";
import type { AdminReview, ModerateStatus, ReviewListParams, ReviewListResult } from "../types";

export function fetchReviews({ status, q, rating, page }: ReviewListParams) {
  return adminFetchPage<ReviewListResult>("reviews", {
    query: { status, q, rating, page, page_size: REVIEWS_PAGE_SIZE },
  });
}

export function moderateReview(id: number, status: ModerateStatus) {
  return adminFetch<AdminReview>(`reviews/${id}/moderate`, { method: "POST", body: { status } });
}

export function deleteReview(id: number) {
  return adminFetch<null>(`reviews/${id}/delete`, { method: "DELETE" });
}
