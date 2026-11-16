"use client";

import Link from "next/link";

import { SummaryRow } from "@/features/cart";
import { useDeliveryPrice } from "@/features/delivery";
import type { PriceService } from "@/features/delivery/services/novaPoshtaService";
import { Spinner } from "@/components/ui/Spinner";
import { routes } from "@/data/routes";
import type { Cart, DeliveryMethod } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";
import { t, tPlural } from "@/lib/i18n";

import { interpolateNodes } from "../utils/interpolateNodes";

const SERVICE_BY_METHOD: Partial<Record<DeliveryMethod, PriceService>> = {
  np_branch: "branch",
  np_locker: "locker",
  np_courier: "courier",
};

type CheckoutSummaryProps = {
  cart: Cart;
  deliveryMethod: DeliveryMethod;
  cityRef: string;
  bonusesSpent: number;
  isSubmitting: boolean;
  isRedirecting: boolean;
  redirectingToPayment: boolean;
};

export function CheckoutSummary({
  cart,
  deliveryMethod,
  cityRef,
  bonusesSpent,
  isSubmitting,
  isRedirecting,
  redirectingToPayment,
}: CheckoutSummaryProps) {
  const { totals } = cart;
  const promoDiscount = Number(totals.promo_discount);
  const loyaltyDiscount = Number(totals.loyalty_discount);
  const payable = Math.max(0, Number(totals.total) - bonusesSpent);
  const freeDelivery = totals.free_delivery;
  const busy = isSubmitting || isRedirecting;
  const priceService = SERVICE_BY_METHOD[deliveryMethod] ?? null;
  const price = useDeliveryPrice(freeDelivery ? "" : cityRef, priceService, payable);
  const estimate = !freeDelivery && price.data?.cost ? price.data.cost : null;

  const linkClass = "text-ink underline underline-offset-2 hover:text-gold";

  return (
    <aside
      aria-labelledby="checkout-summary-title"
      className="bg-sand flex w-full flex-col gap-[18px] p-6 sm:p-8 lg:sticky lg:top-6 lg:w-[400px] lg:shrink-0"
    >
      <h2
        id="checkout-summary-title"
        className="text-muted text-[10.5px] font-semibold tracking-[0.22em] uppercase"
      >
        {t("checkout.summary.title")}
      </h2>
      <ul className="flex flex-col gap-[18px]">
        {cart.items.map((item) => (
          <li key={item.id} className="flex items-start gap-3.5">
            <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
              <Link
                href={routes.product(item.product.slug)}
                className="hover:text-gold text-[12.5px] font-medium"
              >
                {item.product.name}
              </Link>
              <p className="text-muted text-[11.5px]">
                {t("checkout.summary.itemMeta", {
                  color: item.color.name,
                  size: item.size,
                  quantity: item.quantity,
                })}
              </p>
            </div>
            <p className="text-[13px] font-semibold whitespace-nowrap">{formatPrice(item.line_total)}</p>
          </li>
        ))}
      </ul>
      <div className="bg-field h-px" />
      <dl className="flex flex-col gap-[18px]">
        <SummaryRow
          label={`${t("cart.summary.subtotalShort")} (${tPlural("cart.itemsCount", totals.items_count)})`}
          value={formatPrice(totals.subtotal)}
        />
        {promoDiscount > 0 ? (
          <SummaryRow
            label={
              totals.promo_code
                ? t("cart.summary.promo", { code: totals.promo_code })
                : t("cart.summary.discount")
            }
            value={`−${formatPrice(promoDiscount)}`}
            tone="discount"
          />
        ) : null}
        {loyaltyDiscount > 0 ? (
          <SummaryRow
            label={t("cart.summary.loyalty", { percent: Number(totals.loyalty_percent) })}
            value={`−${formatPrice(loyaltyDiscount)}`}
            tone="discount"
          />
        ) : null}
        {bonusesSpent > 0 ? (
          <SummaryRow
            label={t("cart.summary.bonuses")}
            value={`−${formatPrice(bonusesSpent)}`}
            tone="discount"
          />
        ) : null}
        <SummaryRow
          label={t("cart.summary.delivery")}
          value={
            freeDelivery
              ? t("cart.summary.deliveryFree")
              : estimate
                ? t("checkout.summary.deliveryEstimate", { price: formatPrice(estimate) })
                : t("cart.summary.deliveryCarrier")
          }
        />
        {estimate ? (
          <p className="text-muted -mt-2.5 text-[11px] leading-relaxed">
            {t("checkout.summary.deliveryEstimateHint", { count: totals.free_delivery_min_items })}
          </p>
        ) : null}
      </dl>
      <dl aria-live="polite">
        <SummaryRow label={t("checkout.summary.total")} value={formatPrice(payable)} tone="total" />
      </dl>
      <button
        type="submit"
        form="checkout-form"
        disabled={busy}
        aria-disabled={busy || undefined}
        className="bg-ink text-cream hover:bg-ink/85 inline-flex h-[58px] w-full items-center justify-center gap-3 text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors disabled:cursor-wait disabled:opacity-70"
      >
        {busy ? <Spinner className="size-3.5" /> : null}
        {isRedirecting
          ? redirectingToPayment
            ? t("checkout.summary.redirecting")
            : t("checkout.summary.submitting")
          : isSubmitting
            ? t("checkout.summary.submitting")
            : t("checkout.summary.submit")}
      </button>
      <p className="text-muted text-[11px] leading-[1.68]">
        {interpolateNodes(t("checkout.summary.legal"), {
          offer: (
            <Link href={routes.offer} className={linkClass}>
              {t("checkout.summary.offer")}
            </Link>
          ),
          privacy: (
            <Link href={routes.privacy} className={linkClass}>
              {t("checkout.summary.privacy")}
            </Link>
          ),
        })}
      </p>
    </aside>
  );
}
