"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adminFetch, adminFetchPage, useAdminToast } from "@/features/admin";
import { apiErrorText } from "@/lib/apiMessage";
import type { AdminGiftCard } from "@/lib/api/types";
import { t } from "@/lib/i18n";

export type { AdminGiftCard };
export type GiftCardFilter = "" | "pending" | "active" | "cancelled";

const PAGE_SIZE = 20;
const keys = {
  all: ["admin", "gift-cards"] as const,
  list: (params: object) => [...keys.all, "list", params] as const,
};

export function useGiftCards(params: { q: string; status: GiftCardFilter; page: number }) {
  return useQuery({
    queryKey: keys.list(params),
    queryFn: () =>
      adminFetchPage<AdminGiftCard[]>("gift-cards", {
        query: { q: params.q, status: params.status || undefined, page: params.page, page_size: PAGE_SIZE },
      }),
    placeholderData: keepPreviousData,
  });
}

export function useRefundGiftCard() {
  const queryClient = useQueryClient();
  const toast = useAdminToast();
  return useMutation({
    mutationFn: (id: number) => adminFetch<AdminGiftCard>(`gift-cards/${id}/refund`, { method: "POST" }),
    onSuccess: (card) => toast.success(t("adminGiftCards.toast.refunded", { code: card.code })),
    onError: (error) => toast.error(apiErrorText(error, "adminGiftCards.toast.refundFailed")),
    onSettled: () => queryClient.invalidateQueries({ queryKey: keys.all }),
  });
}
