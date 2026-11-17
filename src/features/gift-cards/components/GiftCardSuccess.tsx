"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { ButtonLink } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { routes } from "@/data/routes";
import { formatPrice } from "@/lib/format";
import { t } from "@/lib/i18n";

import { fetchGiftCardStatus } from "../services/giftCardsService";
import { GiftCardVisual } from "./GiftCardVisual";

export function GiftCardSuccess() {
  const token = useSearchParams().get("token") ?? "";
  const query = useQuery({
    queryKey: ["gift-card", token],
    queryFn: () => fetchGiftCardStatus(token),
    enabled: Boolean(token),
    retry: false,
    refetchInterval: (state) => (state.state.data?.status === "pending" ? 4000 : false),
  });
  const card = query.data;

  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-6 py-16 text-center">
      {!token || query.isError || card?.status === "cancelled" ? (
        <>
          <h1 className="font-serif text-[40px] font-light">{t("giftCards.success.failedTitle")}</h1>
          <p className="text-muted max-w-[460px] text-[14px]">{t("giftCards.success.failedText")}</p>
          <ButtonLink href={routes.giftCards}>{t("giftCards.success.retry")}</ButtonLink>
        </>
      ) : !card || card.status === "pending" ? (
        <>
          <Spinner className="size-6" label={t("common.loading")} />
          <h1 className="font-serif text-[36px] font-light">{t("giftCards.success.waitingTitle")}</h1>
          <p className="text-muted max-w-[460px] text-[14px]">{t("giftCards.success.waitingText")}</p>
        </>
      ) : (
        <>
          <div className="w-full max-w-[340px]">
            <GiftCardVisual amount={Number(card.amount)} />
          </div>
          <h1 className="font-serif text-[40px] font-light">{t("giftCards.success.title")}</h1>
          <p className="text-[15px]">
            {t("giftCards.success.code")} <strong className="tracking-[0.12em]">{card.code}</strong>
          </p>
          <p className="text-muted max-w-[480px] text-[14px] leading-relaxed">
            {t("giftCards.success.sent", {
              email: card.recipient_email || card.buyer_email,
              amount: formatPrice(card.amount),
            })}
          </p>
          <ButtonLink href={routes.catalog}>{t("giftCards.success.shop")}</ButtonLink>
        </>
      )}
    </section>
  );
}
