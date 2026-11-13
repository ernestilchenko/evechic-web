"use client";

import { useSession } from "@/features/auth";
import { EmptyCart, hasStockProblem, useCart } from "@/features/cart";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { t } from "@/lib/i18n";

import { useCheckoutForm } from "../hooks/useCheckoutForm";
import type { UnavailableItem } from "../types";
import { CheckoutSteps } from "./CheckoutSteps";
import { CheckoutSummary } from "./CheckoutSummary";
import { CommentSection } from "./CommentSection";
import { ContactSection } from "./ContactSection";
import { DeliverySection } from "./DeliverySection";
import { PaymentSection } from "./PaymentSection";
import { UnavailableItemsNotice } from "./UnavailableItemsNotice";

function Loading() {
  return (
    <div className="text-muted flex items-center justify-center gap-3 py-24 text-[13px]">
      <Spinner label={t("checkout.loading")} />
      <span aria-hidden="true">{t("checkout.loading")}</span>
    </div>
  );
}

export function CheckoutView() {
  const { cart, isError, refetch } = useCart();
  const { isAuthenticated } = useSession();

  const bonusesAvailable = isAuthenticated && cart ? Number(cart.totals.bonuses_available) : 0;
  const canUseBonuses = bonusesAvailable > 0;
  const form = useCheckoutForm({ canUseBonuses });

  const isRedirecting = form.placedOrder !== null;
  const disabled = form.isSubmitting || isRedirecting;
  const bonusesSpend = cart ? Math.min(bonusesAvailable, Number(cart.totals.total)) : 0;
  const bonusesSpent = canUseBonuses && form.values.use_bonuses ? bonusesSpend : 0;

  const cartProblems: UnavailableItem[] = (cart?.items ?? []).filter(hasStockProblem).map((item) => ({
    variant_id: item.variant_id,
    product_name: item.product.name,
    color_name: item.color.name,
    size: item.size,
    requested: item.quantity,
    available: item.available ? item.stock : 0,
    reason: item.available ? "out_of_stock" : "unavailable",
  }));
  const unavailableItems = form.unavailableItems.length ? form.unavailableItems : cartProblems;

  let content: React.ReactNode;
  if (isRedirecting) {
    content = <Loading />;
  } else if (cart === null && isError) {
    content = (
      <div role="alert" className="flex flex-col items-center gap-5 py-20 text-center">
        <p className="text-muted text-[13px]">{t("cart.loadError")}</p>
        <Button variant="outline" onClick={() => refetch()}>
          {t("cart.retry")}
        </Button>
      </div>
    );
  } else if (cart === null) {
    content = <Loading />;
  } else if (cart.items.length === 0) {
    content = (
      <EmptyCart
        title={t("checkout.empty.title")}
        text={t("checkout.empty.text")}
        cta={t("checkout.empty.cta")}
      />
    );
  } else {
    content = (
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
        <form
          id="checkout-form"
          onSubmit={form.submit}
          noValidate
          aria-busy={form.isSubmitting || undefined}
          className="flex min-w-0 flex-1 flex-col gap-11"
        >
          <div aria-live="assertive" className="flex flex-col gap-4 empty:hidden">
            {unavailableItems.length ? <UnavailableItemsNotice items={unavailableItems} /> : null}
            {form.formMessage ? (
              <p role="alert" className="border-sale/40 bg-sale/5 text-sale border p-4 text-[12.5px]">
                {form.formMessage}
              </p>
            ) : null}
          </div>
          <ContactSection
            values={form.values}
            errors={form.errors}
            setField={form.setField}
            disabled={disabled}
          />
          <DeliverySection
            values={form.values}
            errors={form.errors}
            setField={form.setField}
            setFields={form.setFields}
            addresses={form.addresses}
            activeChoice={form.activeChoice}
            chooseAddress={form.chooseAddress}
            freeDeliveryThreshold={cart.totals.free_delivery_threshold}
            disabled={disabled}
          />
          <PaymentSection values={form.values} setField={form.setField} disabled={disabled} />
          <CommentSection
            values={form.values}
            errors={form.errors}
            setField={form.setField}
            bonuses={canUseBonuses ? { available: bonusesAvailable, spend: bonusesSpend } : null}
            disabled={disabled}
          />
        </form>
        <CheckoutSummary
          cart={cart}
          deliveryMethod={form.values.delivery_method}
          bonusesSpent={bonusesSpent}
          isSubmitting={form.isSubmitting}
          isRedirecting={isRedirecting}
          redirectingToPayment={Boolean(form.placedOrder?.payment_url)}
        />
      </div>
    );
  }

  return (
    <div className="container-page pb-20 lg:pb-[100px]">
      <div className="flex flex-col gap-[22px] pt-10 pb-10 sm:pt-[52px]">
        <h1 className="font-serif text-[36px] leading-tight font-light sm:text-[48px]">
          {t("checkout.title")}
        </h1>
        <CheckoutSteps current={2} />
      </div>
      {content}
    </div>
  );
}
