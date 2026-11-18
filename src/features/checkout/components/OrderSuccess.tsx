"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useSyncExternalStore } from "react";

import { CustomerReviewsOptIn, reportPurchase } from "@/features/analytics";
import { useSession } from "@/features/auth";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { routes } from "@/data/routes";
import { siteConfig } from "@/data/site";
import { formatPrice } from "@/lib/format";
import { t, type MessageKey } from "@/lib/i18n";

import { orderQueryKey } from "../constants/options";
import { fetchAccountOrder, fetchPublicOrderStatus, payOrder } from "../services/checkoutService";
import { checkoutErrorMessage } from "../utils/apiErrors";
import { parseLastOrder, readLastOrderRaw } from "../utils/lastOrder";
import { CheckoutSteps } from "./CheckoutSteps";

const subscribe = () => () => {};

const AWAITING_POLL_MS = 5000;

function awaitingOnline(method: string | null | undefined, status: string | null | undefined) {
  return (method === "card" || method === "parts") && status === "pending";
}

export function OrderSuccess({
  orderNumber,
  token: tokenParam = null,
}: {
  orderNumber: number | null;
  token?: string | null;
}) {
  const { isAuthenticated } = useSession();
  const raw = useSyncExternalStore(subscribe, readLastOrderRaw, () => null);
  const lastOrder = parseLastOrder(raw, orderNumber);
  const token = tokenParam ?? lastOrder?.access_token ?? null;

  const publicQuery = useQuery({
    queryKey: ["order-public", orderNumber, token],
    queryFn: () => fetchPublicOrderStatus(orderNumber ?? 0, token ?? ""),
    enabled: orderNumber !== null && Boolean(token),
    retry: false,
    refetchInterval: (query) =>
      awaitingOnline(query.state.data?.payment_method, query.state.data?.payment_status)
        ? AWAITING_POLL_MS
        : false,
  });

  const orderQuery = useQuery({
    queryKey: orderQueryKey(orderNumber ?? 0),
    queryFn: () => fetchAccountOrder(orderNumber ?? 0),
    enabled: isAuthenticated && orderNumber !== null && !token,
    retry: false,
    refetchInterval: (query) =>
      (query.state.data?.payment_method === "card" || query.state.data?.payment_method === "parts") &&
      query.state.data.payment_status === "pending"
        ? 5000
        : false,
  });
  const order = publicQuery.data ?? orderQuery.data ?? null;

  const pay = useMutation({
    mutationFn: () => payOrder(orderNumber ?? 0, token),
    onSuccess: (link) => {
      if (link.payment_url) window.location.assign(link.payment_url);
      else if (token) publicQuery.refetch();
      else orderQuery.refetch();
    },
  });

  const email = order?.email ?? lastOrder?.email ?? null;
  const fullEmail = orderQuery.data?.email ?? lastOrder?.email ?? null;
  const total = order?.total ?? lastOrder?.total ?? null;
  const paymentMethod = order?.payment_method ?? lastOrder?.payment_method ?? null;
  const paymentStatus = order?.payment_status ?? lastOrder?.payment_status ?? null;
  const skipCall = order?.skip_confirmation_call ?? lastOrder?.skip_confirmation_call ?? false;
  const paymentNotStarted = !order && lastOrder?.payment_method === "card" && !lastOrder.payment_started;

  let paymentKey: MessageKey | null = null;
  if (paymentMethod === "card") {
    if (paymentStatus === "paid") paymentKey = "checkout.success.paymentPaid";
    else if (paymentStatus === "failed") paymentKey = "checkout.success.paymentFailed";
    else if (paymentNotStarted) paymentKey = "checkout.success.paymentNotStarted";
    else paymentKey = "checkout.success.paymentPending";
  } else if (paymentMethod === "parts") {
    if (paymentStatus === "paid") paymentKey = "checkout.success.paymentPaid";
    else if (paymentStatus === "failed") paymentKey = "checkout.success.paymentPartsFailed";
    else paymentKey = "checkout.success.paymentPartsPending";
  }
  const canPay =
    order !== null &&
    (publicQuery.data
      ? publicQuery.data.can_pay
      : isAuthenticated &&
        orderQuery.data !== undefined &&
        (order.payment_method === "card" ||
          (order.payment_method === "parts" && order.payment_status === "failed")) &&
        order.payment_status !== "paid" &&
        orderQuery.data.status !== "cancelled");
  const awaitingPayment =
    (paymentMethod === "card" || paymentMethod === "parts") &&
    paymentStatus !== "paid" &&
    Number(total ?? 0) > 0;

  const isPaid = paymentStatus === "paid";
  const confirmedPaid = order?.payment_status === "paid" ? order : null;

  useEffect(() => {
    if (confirmedPaid && orderNumber !== null)
      reportPurchase(orderNumber, confirmedPaid.total, confirmedPaid.items ?? []);
  }, [confirmedPaid, orderNumber]);
  const steps: MessageKey[] = [
    awaitingPayment
      ? paymentMethod === "parts"
        ? "checkout.success.nextSteps.confirmParts"
        : "checkout.success.nextSteps.pay"
      : skipCall
        ? "checkout.success.nextSteps.confirmSkipped"
        : "checkout.success.nextSteps.confirm",
    "checkout.success.nextSteps.ship",
    "checkout.success.nextSteps.returns",
  ];

  return (
    <div className="container-page pb-20 lg:pb-[100px]">
      {order && fullEmail && orderNumber !== null && !awaitingPayment ? (
        <CustomerReviewsOptIn orderNumber={orderNumber} email={fullEmail} />
      ) : null}
      <div className="pt-10 pb-10 sm:pt-[52px]">
        <CheckoutSteps current={3} />
      </div>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12">
        <section className="flex flex-col gap-6">
          <p className="text-gold text-[10.5px] font-semibold tracking-[0.22em] uppercase">
            {orderNumber !== null
              ? t("checkout.success.number", { number: orderNumber })
              : t("checkout.success.noNumber")}
          </p>
          <h1 className="font-serif text-[40px] leading-tight font-light sm:text-[52px]">
            {awaitingPayment ? t("checkout.success.titleAwaiting") : t("checkout.success.title")}
          </h1>
          <p className="text-muted max-w-xl text-[14px] leading-[1.75]">
            {awaitingPayment
              ? t(
                  paymentMethod === "parts"
                    ? "checkout.success.leadAwaitingParts"
                    : "checkout.success.leadAwaiting",
                  {
                    email: email ?? "",
                  },
                )
              : email
                ? t("checkout.success.lead", { email })
                : t("checkout.success.leadNoEmail")}
          </p>
          {Number(total ?? 0) > 0 ? (
            <p className="text-[15px] font-semibold">
              {t(isPaid ? "checkout.success.totalPaid" : "checkout.success.total", {
                amount: formatPrice(total ?? 0),
              })}
            </p>
          ) : null}
          <div aria-live="polite" className="flex flex-col items-start gap-4 empty:hidden">
            {paymentKey ? (
              <p className={paymentStatus === "paid" ? "text-success text-[13px]" : "text-[13px]"}>
                {t(paymentKey)}
              </p>
            ) : null}
            {pay.error ? (
              <p role="alert" className="text-sale text-[12.5px]">
                {checkoutErrorMessage(pay.error)}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            {canPay ? (
              <Button onClick={() => pay.mutate()} disabled={pay.isPending} className="gap-3">
                {pay.isPending ? <Spinner className="size-3.5" /> : null}
                {pay.isPending
                  ? t("checkout.success.paying")
                  : paymentMethod === "parts"
                    ? t("checkout.success.resendParts")
                    : t("checkout.success.pay")}
              </Button>
            ) : null}
            <ButtonLink href={routes.catalog} variant={canPay ? "outline" : "primary"}>
              {t("checkout.success.continue")}
            </ButtonLink>
            {isAuthenticated ? (
              <ButtonLink
                href={orderNumber !== null ? routes.accountOrder(orderNumber) : routes.account}
                variant="outline"
              >
                {t("checkout.success.orders")}
              </ButtonLink>
            ) : null}
          </div>
        </section>
        <aside aria-labelledby="success-next-title" className="bg-sand flex flex-col gap-5 p-6 sm:p-8">
          <h2
            id="success-next-title"
            className="text-muted text-[10.5px] font-semibold tracking-[0.22em] uppercase"
          >
            {t("checkout.success.nextTitle")}
          </h2>
          <ol className="flex flex-col gap-4">
            {steps.map((key, index) => (
              <li key={key} className="flex gap-3.5 text-[13px] leading-[1.6]">
                <span
                  aria-hidden="true"
                  className="border-gold text-gold flex size-[22px] shrink-0 items-center justify-center rounded-full border text-[10.5px] font-semibold"
                >
                  {index + 1}
                </span>
                <span>{t(key)}</span>
              </li>
            ))}
          </ol>
          <p className="text-muted border-field border-t pt-5 text-[12px]">
            {t("checkout.success.help", { phone: siteConfig.phoneDisplay })}
          </p>
        </aside>
      </div>
    </div>
  );
}
