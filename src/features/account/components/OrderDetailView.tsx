"use client";

import Image from "next/image";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { routes } from "@/data/routes";
import { ApiError } from "@/lib/api/client";
import type { OrderDetail, OrderItem } from "@/lib/api/types";
import { formatDate, formatPrice } from "@/lib/format";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";

import { useOrder } from "../hooks/useAccountQueries";

import { OrderActions } from "./OrderActions";
import { OrderStatusChip } from "./OrderStatusChip";
import { ReturnShipment } from "./ReturnShipment";

const blockClass = "border-line flex flex-col gap-4 border bg-white px-5 py-6 sm:px-[30px] sm:py-7";
const blockTitleClass = "text-[11px] font-semibold tracking-[0.2em] uppercase";

function ItemRow({ item }: { item: OrderItem }) {
  const name = item.product_slug ? (
    <Link href={routes.product(item.product_slug)} className="hover:text-gold">
      {item.product_name}
    </Link>
  ) : (
    item.product_name
  );

  return (
    <li className="border-line flex gap-4 border-t pt-4 first:border-t-0 first:pt-0">
      <div className="bg-sand relative h-[96px] w-[74px] shrink-0 overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.product_name}
            fill
            sizes="74px"
            className="object-cover object-top"
          />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-muted text-xs">
          {item.color_name
            ? t("account.order.variant", { color: item.color_name, size: item.size, quantity: item.quantity })
            : t("account.order.variantNoColor", { size: item.size, quantity: item.quantity })}
        </p>
        <p className="text-placeholder text-[11px]">{item.sku}</p>
      </div>
      <div className="flex flex-col items-end gap-1 text-right">
        <p className="text-sm font-semibold whitespace-nowrap">{formatPrice(item.line_total)}</p>
        {item.old_price && Number(item.old_price) > Number(item.unit_price) ? (
          <s className="text-muted text-xs">{formatPrice(Number(item.old_price) * item.quantity)}</s>
        ) : null}
      </div>
    </li>
  );
}

function TotalRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div
      className={cn(
        "flex justify-between gap-4",
        strong ? "border-line border-t pt-3 text-base font-semibold" : "text-[13px]",
      )}
    >
      <dt className={strong ? undefined : "text-muted"}>{label}</dt>
      <dd className="whitespace-nowrap">{value}</dd>
    </div>
  );
}

function Totals({ order }: { order: OrderDetail }) {
  const { totals } = order;
  const minus = (value: string) => `−${formatPrice(value)}`;

  return (
    <section aria-labelledby="order-totals-title" className={blockClass}>
      <h2 id="order-totals-title" className={blockTitleClass}>
        {t("account.order.totalsTitle")}
      </h2>
      <dl className="flex flex-col gap-2.5">
        <TotalRow label={t("account.order.subtotal")} value={formatPrice(totals.subtotal)} />
        {Number(totals.promo_discount) > 0 ? (
          <TotalRow
            label={
              totals.promo_code
                ? t("account.order.promo", { code: totals.promo_code })
                : t("account.order.promoNoCode")
            }
            value={minus(totals.promo_discount)}
          />
        ) : null}
        {Number(totals.loyalty_discount) > 0 ? (
          <TotalRow label={t("account.order.loyalty")} value={minus(totals.loyalty_discount)} />
        ) : null}
        {Number(totals.bonuses_spent) > 0 ? (
          <TotalRow label={t("account.order.bonusesSpent")} value={minus(totals.bonuses_spent)} />
        ) : null}
        <TotalRow
          label={t("account.order.delivery")}
          value={totals.free_delivery ? t("account.order.deliveryFree") : t("account.order.deliveryCarrier")}
        />
        <TotalRow label={t("account.order.total")} value={formatPrice(totals.total)} strong />
        {Number(totals.bonuses_earned) > 0 ? (
          <TotalRow
            label={t("account.order.bonusesEarned")}
            value={`+${formatPrice(totals.bonuses_earned)}`}
          />
        ) : null}
      </dl>
    </section>
  );
}

function Info({ order }: { order: OrderDetail }) {
  const recipient = [`${order.first_name} ${order.last_name}`.trim(), order.phone, order.email].filter(
    Boolean,
  );

  return (
    <section aria-label={t("account.order.recipient")} className={cn(blockClass, "gap-5")}>
      <div className="flex flex-col gap-1.5">
        <h2 className={blockTitleClass}>{t("account.delivery.label")}</h2>
        <p className="text-[13px]">{t(`account.delivery.methods.${order.delivery_method}`)}</p>
        {order.delivery_summary ? <p className="text-muted text-[13px]">{order.delivery_summary}</p> : null}
        {order.tracking_number ? (
          <p className="text-muted text-[13px]">
            {t("account.delivery.tracking", { number: order.tracking_number })}
          </p>
        ) : null}
        {order.tracking_status ? <p className="text-[13px]">{order.tracking_status}</p> : null}
        {order.tracking_url ? (
          <a
            href={order.tracking_url}
            target="_blank"
            rel="noreferrer"
            className="text-gold hover:text-ink self-start text-[12.5px]"
          >
            {t("account.delivery.track")} ↗
          </a>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <h2 className={blockTitleClass}>{t("account.payment.label")}</h2>
        <p className="text-[13px]">{t(`account.payment.${order.payment_method}`)}</p>
        <p
          className={cn(
            "text-[13px]",
            order.payment_status === "paid"
              ? "text-success"
              : order.payment_status === "failed"
                ? "text-sale"
                : "text-muted",
          )}
        >
          {t(`account.payment.status.${order.payment_status}`)}
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <h2 className={blockTitleClass}>{t("account.order.recipient")}</h2>
        {recipient.map((line) => (
          <p key={line} className="text-muted text-[13px]">
            {line}
          </p>
        ))}
      </div>
      {order.comment ? (
        <div className="flex flex-col gap-1.5">
          <h2 className={blockTitleClass}>{t("account.order.comment")}</h2>
          <p className="text-muted text-[13px] whitespace-pre-line">{order.comment}</p>
        </div>
      ) : null}
    </section>
  );
}

export function OrderDetailView({ number }: { number: string }) {
  const query = useOrder(number);

  if (query.isLoading) {
    return (
      <div className="text-muted flex justify-center py-14">
        <Spinner label={t("common.loading")} />
      </div>
    );
  }

  if (!query.data) {
    const notFound = query.error instanceof ApiError && query.error.status === 404;
    return (
      <EmptyState
        title={notFound ? t("account.order.notFound") : t("account.order.loadError")}
        className="border-line border bg-white"
        action={<ButtonLink href={routes.account}>{t("account.order.back")}</ButtonLink>}
      />
    );
  }

  const order = query.data;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={routes.account}
        className="text-muted hover:text-ink self-start text-[10.5px] font-semibold tracking-[0.18em] uppercase"
      >
        {t("account.order.back")}
      </Link>
      <div className="flex flex-wrap items-center gap-3.5">
        <OrderStatusChip status={order.status} />
        <p className="text-muted text-[13px]">
          {t("account.order.placed", { date: formatDate(order.created_at) })}
        </p>
      </div>
      <OrderActions order={order} />
      <ReturnShipment order={order} />
      <div className="grid gap-6 xl:grid-cols-[1fr_340px] xl:items-start">
        <section aria-labelledby="order-items-title" className={blockClass}>
          <h2 id="order-items-title" className={blockTitleClass}>
            {t("account.order.itemsTitle")}
          </h2>
          <ul className="flex flex-col gap-4">
            {order.items.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </ul>
        </section>
        <div className="flex flex-col gap-6">
          <Totals order={order} />
          <Info order={order} />
        </div>
      </div>
    </div>
  );
}
