"use client";

import Link from "next/link";

import {
  AdminButton,
  AdminPageBody,
  AdminPageHeader,
  ErrorBlock,
  formatDateTime,
  LoadingBlock,
  OrderStatusChip,
  Panel,
  StatusChip,
  Thumb,
} from "@/features/admin";
import { routes } from "@/data/routes";
import { formatPrice } from "@/lib/format";
import { t } from "@/lib/i18n";

import { ORDER_TRANSITIONS } from "../constants/orders";
import { useOrder } from "../hooks/useOrders";
import type { AdminOrder } from "../types";
import { OrderContactForm } from "./OrderContactForm";
import { OrderInvoices } from "./OrderInvoices";
import { OrderNotesForm } from "./OrderNotesForm";
import { useStatusFlow } from "./useStatusFlow";

function TotalsRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div
      className={
        strong
          ? "border-admin-row flex justify-between border-t pt-3 text-[14px] font-semibold"
          : "flex justify-between"
      }
    >
      <dt className={strong ? undefined : "text-muted"}>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function OrderItems({ order }: { order: AdminOrder }) {
  const { totals } = order;
  return (
    <Panel title={t("adminOrders.detail.items")} titleId="order-items">
      <ul className="flex flex-col">
        {order.items.map((item) => (
          <li
            key={item.id}
            className="border-admin-row flex items-center gap-4 border-t py-3 first:border-t-0 first:pt-0"
          >
            <Thumb src={item.image} alt={item.product_name} />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              {item.product_id ? (
                <Link
                  href={routes.admin.product(item.product_id)}
                  className="hover:text-gold text-[12.5px] font-medium"
                >
                  {item.product_name}
                </Link>
              ) : (
                <span className="text-[12.5px] font-medium">{item.product_name}</span>
              )}
              <span className="text-placeholder text-[11px]">
                {t("adminOrders.detail.itemMeta", { sku: item.sku, color: item.color_name, size: item.size })}
              </span>
            </div>
            <span className="text-muted text-[12px] whitespace-nowrap">
              {item.quantity} × {formatPrice(item.unit_price)}
            </span>
            <span className="w-[90px] text-right text-[12.5px] font-semibold whitespace-nowrap">
              {formatPrice(item.line_total)}
            </span>
          </li>
        ))}
      </ul>
      <dl className="border-admin-row mt-4 flex flex-col gap-2 border-t pt-4 text-[12.5px]">
        <TotalsRow label={t("adminOrders.detail.subtotal")} value={formatPrice(totals.subtotal)} />
        {Number(totals.promo_discount) > 0 ? (
          <TotalsRow
            label={t("adminOrders.detail.promo", { code: totals.promo_code ?? "" })}
            value={`−${formatPrice(totals.promo_discount)}`}
          />
        ) : null}
        {Number(totals.loyalty_discount) > 0 ? (
          <TotalsRow
            label={t("adminOrders.detail.loyalty")}
            value={`−${formatPrice(totals.loyalty_discount)}`}
          />
        ) : null}
        {Number(totals.bonuses_spent) > 0 ? (
          <TotalsRow
            label={t("adminOrders.detail.bonusesSpent")}
            value={`−${formatPrice(totals.bonuses_spent)}`}
          />
        ) : null}
        <TotalsRow
          label={t("adminOrders.detail.delivery")}
          value={
            totals.free_delivery ? t("adminOrders.detail.freeDelivery") : t("adminOrders.detail.carrierRates")
          }
        />
        <TotalsRow label={t("adminOrders.detail.total")} value={formatPrice(totals.total)} strong />
        {Number(totals.bonuses_earned) > 0 ? (
          <TotalsRow
            label={t("adminOrders.detail.bonusesEarned")}
            value={`+${formatPrice(totals.bonuses_earned)}`}
          />
        ) : null}
      </dl>
    </Panel>
  );
}

export function OrderDetail({ number }: { number: number }) {
  const { data: order, error, isLoading, refetch } = useOrder(number);
  const statusFlow = useStatusFlow();
  const back = { href: routes.admin.orders, label: t("adminOrders.title") };

  if (isLoading || !order) {
    return (
      <>
        <AdminPageHeader title={t("adminOrders.detail.title", { number })} back={back} />
        <AdminPageBody>
          {error ? <ErrorBlock error={error} onRetry={() => refetch()} /> : <LoadingBlock />}
        </AdminPageBody>
      </>
    );
  }

  const transitions = ORDER_TRANSITIONS[order.status];

  return (
    <>
      <AdminPageHeader
        title={t("adminOrders.detail.title", { number: order.number })}
        back={back}
        meta={
          <>
            <OrderStatusChip status={order.status} />
            <span className="text-placeholder text-[11.5px]">{formatDateTime(order.created_at)}</span>
          </>
        }
      >
        {transitions.map((status) => (
          <AdminButton
            key={status}
            variant={status === "cancelled" || status === "returned" ? "danger" : "primary"}
            disabled={statusFlow.isPending}
            onClick={() => statusFlow.request(order.number, status)}
          >
            {t(`adminOrders.transition.${status}`)}
          </AdminButton>
        ))}
      </AdminPageHeader>
      <AdminPageBody>
        {order.return_reason ? (
          <p role="note" className="bg-admin-violet-bg text-admin-violet rounded px-4 py-3 text-[12.5px]">
            {t("adminOrders.detail.returnReason")}: {order.return_reason}
          </p>
        ) : null}
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="flex min-w-0 flex-col gap-4">
            <OrderItems order={order} />
            <Panel title={t("adminOrders.detail.payment")} titleId="order-payment">
              <dl className="grid grid-cols-1 gap-3 text-[12.5px] sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <dt className="text-muted">{t("adminOrders.detail.paymentMethod")}</dt>
                  <dd>{t(`adminOrders.payment.${order.payment_method}`)}</dd>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <dt className="text-muted">{t("adminOrders.detail.paymentStatus")}</dt>
                  <dd>
                    <StatusChip
                      tone={
                        order.payment_status === "paid"
                          ? "success"
                          : order.payment_status === "failed"
                            ? "danger"
                            : order.payment_status === "refunded"
                              ? "violet"
                              : "neutral"
                      }
                    >
                      {t(`adminOrders.paymentStatus.${order.payment_status}`)}
                    </StatusChip>
                  </dd>
                </div>
              </dl>
              <OrderInvoices invoices={order.invoices} />
            </Panel>
          </div>
          <div className="flex min-w-0 flex-col gap-4">
            {order.user_id ? (
              <Link
                href={routes.admin.customer(order.user_id)}
                className="border-admin-line hover:border-ink rounded-md border bg-white px-5 py-4 text-[12.5px]"
              >
                {t("adminOrders.detail.customerProfile")} →
              </Link>
            ) : null}
            <OrderNotesForm key={`notes-${order.updated_at}`} order={order} />
            <OrderContactForm key={`contact-${order.updated_at}`} order={order} />
          </div>
        </div>
      </AdminPageBody>
      {statusFlow.dialog}
    </>
  );
}
