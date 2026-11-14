"use client";

import { useQuery } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { t } from "@/lib/i18n";

import { fetchPublicOrderStatus } from "../services/checkoutService";
import { readLastOrderRaw } from "../utils/lastOrder";

const subscribe = () => () => {};

export function UnpaidOrderNotice() {
  const raw = useSyncExternalStore(subscribe, readLastOrderRaw, () => null);
  let last: { number: number; access_token?: string; payment_method: string } | null = null;
  try {
    last = raw ? JSON.parse(raw) : null;
  } catch {
    last = null;
  }
  const online =
    last && (last.payment_method === "card" || last.payment_method === "parts") && last.access_token;
  const status = useQuery({
    queryKey: ["order-public", last?.number, last?.access_token],
    queryFn: () => fetchPublicOrderStatus(last!.number, last!.access_token!),
    enabled: Boolean(online),
    retry: false,
  });

  if (!online || !status.data?.can_pay || !last) return null;

  return (
    <div role="status" className="bg-sand mx-auto mb-8 flex max-w-xl flex-col items-start gap-3 p-6">
      <p className="text-[14px] font-semibold">{t("checkout.unpaid.title", { number: last.number })}</p>
      <p className="text-muted text-[13px]">{t("checkout.unpaid.text")}</p>
      <ButtonLink href={`/checkout/success?order=${last.number}&token=${last.access_token}`}>
        {t("checkout.unpaid.cta")}
      </ButtonLink>
    </div>
  );
}
