import { apiFetch } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";

export type PaymentOptions = components["schemas"]["PaymentOptions"];

export const DISABLED_OPTIONS: PaymentOptions = {
  cod: false,
  parts: { enabled: false, min_amount: "0", counts: [] },
};

export function fetchPaymentOptions() {
  return apiFetch<PaymentOptions>("payments/options/", { next: { revalidate: 300 } } as RequestInit);
}

export function partsAvailable(options: PaymentOptions | undefined, total: number) {
  return Boolean(options?.parts.enabled && total >= Number(options.parts.min_amount));
}
