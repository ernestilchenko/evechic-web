"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { routes } from "@/data/routes";
import { t, tPlural } from "@/lib/i18n";
import { UnpaidOrderNotice } from "@/features/checkout/components/UnpaidOrderNotice";

import { cartQueryKey } from "../constants/storage";
import { useCart } from "../hooks/useCart";
import { adoptCartToken } from "../services/cartService";
import { cartErrorMessage } from "../utils/cartErrorMessage";
import { hasStockProblem } from "../utils/stock";
import { CartItemRow } from "./CartItemRow";
import { CartSummary } from "./CartSummary";
import { EmptyCart } from "./EmptyCart";

function useCartLink() {
  const router = useRouter();
  const queryClient = useQueryClient();
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("cart");
    if (!token) return;
    if (adoptCartToken(token)) void queryClient.invalidateQueries({ queryKey: cartQueryKey });
    router.replace(routes.cart);
  }, [router, queryClient]);
}

export function CartView() {
  useCartLink();
  const { cart, isError, refetch, updateItem, removeItem, applyPromo, removePromo, removeGiftCard } =
    useCart();

  const pendingUpdateId = updateItem.isPending ? updateItem.variables?.itemId : undefined;
  const pendingRemoveId = removeItem.isPending ? removeItem.variables : undefined;
  const mutationError = updateItem.error ?? removeItem.error;
  const busy =
    updateItem.isPending ||
    removeItem.isPending ||
    applyPromo.isPending ||
    removePromo.isPending ||
    removeGiftCard.isPending;
  const items = cart?.items ?? [];

  return (
    <div className="container-page pb-20 lg:pb-[100px]">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-3 pt-10 pb-8 sm:pt-[52px] sm:pb-9">
        <h1 className="font-serif text-[40px] leading-none font-light sm:text-[52px]">{t("cart.title")}</h1>
        <p className="text-muted flex-1 text-[12.5px] tracking-[0.06em]" aria-live="polite">
          {cart && items.length > 0 ? tPlural("cart.itemsCount", cart.totals.items_count) : null}
        </p>
        <Link
          href={routes.catalog}
          className="text-gold hover:text-ink text-[10.5px] font-semibold tracking-[0.16em] uppercase"
        >
          {t("cart.continueShopping")}
        </Link>
      </div>

      {cart === null && !isError ? (
        <div className="border-line text-muted flex items-center justify-center gap-3 border-t py-24 text-[13px]">
          <Spinner label={t("cart.loading")} />
          <span aria-hidden="true">{t("cart.loading")}</span>
        </div>
      ) : null}

      {cart === null && isError ? (
        <div role="alert" className="border-line flex flex-col items-center gap-5 border-t py-20 text-center">
          <p className="text-muted text-[13px]">{t("cart.loadError")}</p>
          <Button variant="outline" onClick={() => refetch()}>
            {t("cart.retry")}
          </Button>
        </div>
      ) : null}

      {cart && items.length === 0 ? (
        <>
          <UnpaidOrderNotice />
          <EmptyCart />
        </>
      ) : null}

      {cart && items.length > 0 ? (
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
          <section aria-label={t("cart.itemsLabel")} className="min-w-0 flex-1">
            <p role="alert" className="text-sale pb-4 text-[12.5px] empty:hidden">
              {mutationError ? cartErrorMessage(mutationError) : null}
            </p>
            <ul>
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  quantity={
                    pendingUpdateId === item.id && updateItem.variables
                      ? updateItem.variables.quantity
                      : item.quantity
                  }
                  busy={pendingUpdateId === item.id || pendingRemoveId === item.id}
                  removing={pendingRemoveId === item.id}
                  onQuantityChange={(quantity) => updateItem.mutate({ itemId: item.id, quantity })}
                  onRemove={() => removeItem.mutate(item.id)}
                />
              ))}
            </ul>
          </section>
          <CartSummary
            totals={cart.totals}
            canCheckout={!items.some(hasStockProblem)}
            busy={busy}
            applyPromo={applyPromo}
            removePromo={removePromo}
            removeGiftCard={removeGiftCard}
          />
        </div>
      ) : null}
    </div>
  );
}
