"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { routes } from "@/data/routes";
import type { CartTotals } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";
import { t, tPlural } from "@/lib/i18n";

import type { useCart } from "../hooks/useCart";
import { PromoCodeForm } from "./PromoCodeForm";
import { SummaryRow } from "./SummaryRow";

type CartMutations = ReturnType<typeof useCart>;

type CartSummaryProps = {
  totals: CartTotals;
  canCheckout: boolean;
  busy: boolean;
  applyPromo: CartMutations["applyPromo"];
  removePromo: CartMutations["removePromo"];
  removeGiftCard: CartMutations["removeGiftCard"];
};

export function CartTotalsList({ totals }: { totals: CartTotals }) {
  const promoDiscount = Number(totals.promo_discount);
  const loyaltyDiscount = Number(totals.loyalty_discount);
  const bonusesSpent = Number(totals.bonuses_spent);
  const quantityDiscount = Number(totals.quantity_discount);
  const giftCardAmount = Number(totals.gift_card_amount);

  return (
    <dl className="flex flex-col gap-5">
      <SummaryRow
        label={t("cart.summary.subtotal", { items: tPlural("cart.itemsCount", totals.items_count) })}
        value={formatPrice(totals.subtotal)}
      />
      {quantityDiscount > 0 ? (
        <SummaryRow
          label={t("cart.summary.quantity", { percent: Number(totals.quantity_discount_percent) })}
          value={`−${formatPrice(quantityDiscount)}`}
          tone="discount"
        />
      ) : null}
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
      {giftCardAmount > 0 ? (
        <SummaryRow
          label={t("cart.summary.giftCard")}
          value={`−${formatPrice(giftCardAmount)}`}
          tone="discount"
        />
      ) : null}
      <SummaryRow
        label={t("cart.summary.delivery")}
        value={totals.free_delivery ? t("cart.summary.deliveryFree") : t("cart.summary.deliveryCarrier")}
      />
    </dl>
  );
}

export function CartSummary({
  totals,
  canCheckout,
  busy,
  applyPromo,
  removePromo,
  removeGiftCard,
}: CartSummaryProps) {
  const toFreeDelivery = totals.items_to_free_delivery;

  return (
    <aside
      aria-labelledby="cart-summary-title"
      className="bg-sand flex w-full flex-col gap-5 p-6 sm:p-8 lg:sticky lg:top-6 lg:w-[400px] lg:shrink-0"
    >
      <h2
        id="cart-summary-title"
        className="text-muted text-[10.5px] font-semibold tracking-[0.22em] uppercase"
      >
        {t("cart.summary.title")}
      </h2>
      <CartTotalsList totals={totals} />
      {totals.next_quantity_discount_items > 0 ? (
        <p className="text-success -mt-2 text-[11.5px] font-medium">
          {tPlural("cart.summary.toQuantityDiscount", totals.next_quantity_discount_items, {
            percent: Number(totals.next_quantity_discount_percent),
          })}
        </p>
      ) : null}
      {!totals.free_delivery && toFreeDelivery > 0 ? (
        <p className="text-muted -mt-2 text-[11.5px]">
          {tPlural("cart.summary.toFreeDelivery", toFreeDelivery)}
        </p>
      ) : null}
      <div className="bg-field h-px" />
      <dl aria-live="polite" aria-busy={busy || undefined}>
        <SummaryRow label={t("cart.summary.total")} value={formatPrice(totals.total)} tone="total" />
      </dl>
      <PromoCodeForm
        totals={totals}
        applyPromo={applyPromo}
        removePromo={removePromo}
        removeGiftCard={removeGiftCard}
      />
      {canCheckout ? (
        <ButtonLink href={routes.checkout} className="h-[58px] w-full py-0">
          {t("cart.summary.checkout")}
        </ButtonLink>
      ) : (
        <>
          <Button disabled className="h-[58px] w-full py-0" aria-describedby="cart-unavailable-note">
            {t("cart.summary.checkout")}
          </Button>
          <p id="cart-unavailable-note" className="text-sale text-[11.5px] leading-[1.68]">
            {t("cart.summary.unavailableNote")}
          </p>
        </>
      )}
      <p className="text-muted text-[11.5px] leading-[1.68]">{t("cart.summary.note")}</p>
    </aside>
  );
}
