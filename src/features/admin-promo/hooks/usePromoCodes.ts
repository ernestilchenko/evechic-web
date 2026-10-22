"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getErrorMessage, useAdminToast } from "@/features/admin";
import { t } from "@/lib/i18n";

import { promoKeys } from "../constants/promo";
import { deletePromoCode, fetchPromoCode, fetchPromoCodes, savePromoCode } from "../services/promoService";
import type { ActiveFilter, PromoWrite } from "../types";

export function usePromoCodes(params: { q: string; active: ActiveFilter; page: number }) {
  return useQuery({
    queryKey: promoKeys.list(params),
    queryFn: () => fetchPromoCodes(params),
    placeholderData: keepPreviousData,
  });
}

export function usePromoCode(id: number | null) {
  return useQuery({
    queryKey: promoKeys.detail(id ?? 0),
    queryFn: () => fetchPromoCode(id ?? 0),
    enabled: id !== null,
  });
}

export function useSavePromoCode() {
  const queryClient = useQueryClient();
  const toast = useAdminToast();
  return useMutation({
    mutationFn: ({ id, body }: { id: number | null; body: PromoWrite }) => savePromoCode(id, body),
    onSuccess: (promo) => {
      queryClient.setQueryData(promoKeys.detail(promo.id), promo);
      toast.success(t("adminPromo.toast.saved", { code: promo.code }));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: [...promoKeys.all, "list"] }),
  });
}

export function useDeletePromoCode() {
  const queryClient = useQueryClient();
  const toast = useAdminToast();
  return useMutation({
    mutationFn: deletePromoCode,
    onSuccess: () => toast.success(t("adminPromo.toast.deleted")),
    onError: (error) => toast.error(getErrorMessage(error, t("adminPromo.toast.deleteFailed"))),
    onSettled: () => queryClient.invalidateQueries({ queryKey: promoKeys.all }),
  });
}
