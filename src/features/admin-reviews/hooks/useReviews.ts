"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adminKeys, getErrorMessage, useAdminToast, type AdminPage } from "@/features/admin";
import { t } from "@/lib/i18n";

import { reviewKeys } from "../constants/reviews";
import { deleteReview, fetchReviews, moderateReview } from "../services/reviewsService";
import type { ModerateStatus, ReviewListParams, ReviewListResult } from "../types";

export function useReviews(params: ReviewListParams) {
  return useQuery({
    queryKey: reviewKeys.list(params),
    queryFn: () => fetchReviews(params),
    placeholderData: keepPreviousData,
  });
}

function useReviewMutation<V>(
  mutationFn: (variables: V) => Promise<unknown>,
  patch: (page: ReviewListResult, variables: V) => ReviewListResult,
  success: string,
) {
  const queryClient = useQueryClient();
  const toast = useAdminToast();
  return useMutation({
    mutationFn,
    onMutate: async (variables: V) => {
      await queryClient.cancelQueries({ queryKey: reviewKeys.all });
      const snapshot = queryClient.getQueriesData<AdminPage<ReviewListResult>>({ queryKey: reviewKeys.all });
      snapshot.forEach(([key, value]) => {
        if (value) queryClient.setQueryData(key, { ...value, data: patch(value.data, variables) });
      });
      return { snapshot };
    },
    onError: (error, _, context) => {
      context?.snapshot.forEach(([key, value]) => queryClient.setQueryData(key, value));
      toast.error(getErrorMessage(error, t("adminReviews.toast.failed")));
    },
    onSuccess: () => toast.success(success),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      queryClient.invalidateQueries({ queryKey: adminKeys.badges });
    },
  });
}

export function useModerateReview() {
  return useReviewMutation(
    ({ id, status }: { id: number; status: ModerateStatus }) => moderateReview(id, status),
    (page, { id, status }) => ({
      ...page,
      items: page.items.map((review) => (review.id === id ? { ...review, status } : review)),
    }),
    t("adminReviews.toast.moderated"),
  );
}

export function useDeleteReview() {
  return useReviewMutation(
    (id: number) => deleteReview(id),
    (page, id) => ({ ...page, items: page.items.filter((review) => review.id !== id) }),
    t("adminReviews.toast.deleted"),
  );
}
