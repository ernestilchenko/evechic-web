import type { ChipTone } from "@/features/admin";

import type { PromoState } from "../types";

export const PROMO_PAGE_SIZE = 20;

export const PROMO_STATE_TONES: Record<PromoState, ChipTone> = {
  active: "success",
  scheduled: "info",
  expired: "neutral",
  exhausted: "warn",
  inactive: "danger",
};

export const promoKeys = {
  all: ["admin", "promo-codes"] as const,
  list: (params: object) => ["admin", "promo-codes", "list", params] as const,
  detail: (id: number) => ["admin", "promo-codes", "detail", id] as const,
};
