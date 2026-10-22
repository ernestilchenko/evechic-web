import { adminFetch, adminFetchPage } from "@/features/admin";

import { PROMO_PAGE_SIZE } from "../constants/promo";
import type { ActiveFilter, PromoDetail, PromoRow, PromoWrite } from "../types";

export function fetchPromoCodes(params: { q: string; active: ActiveFilter; page: number }) {
  return adminFetchPage<PromoRow[]>("promo-codes", {
    query: { q: params.q, active: params.active || undefined, page: params.page, page_size: PROMO_PAGE_SIZE },
  });
}

export function fetchPromoCode(id: number) {
  return adminFetch<PromoDetail>(`promo-codes/${id}`);
}

export function savePromoCode(id: number | null, body: PromoWrite) {
  return id === null
    ? adminFetch<PromoDetail>("promo-codes/create", { method: "POST", body })
    : adminFetch<PromoDetail>(`promo-codes/${id}/update`, { method: "PATCH", body });
}

export function deletePromoCode(id: number) {
  return adminFetch<null>(`promo-codes/${id}/delete`, { method: "DELETE" });
}
