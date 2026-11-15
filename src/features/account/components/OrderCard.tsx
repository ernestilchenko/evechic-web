"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { routes } from "@/data/routes";
import type { AccountOrder } from "@/lib/api/types";
import { formatDate, formatPrice } from "@/lib/format";
import { t, tPlural } from "@/lib/i18n";

import { OrderStatusChip } from "./OrderStatusChip";
import { RepeatOrderButton } from "./RepeatOrderButton";

export function OrderCard({ order }: { order: AccountOrder }) {
  const [error, setError] = useState<string | null>(null);
  const meta = [
    formatDate(order.created_at),
    tPlural("account.orders.items", order.items_count),
    order.delivery_summary,
  ].filter(Boolean);

  return (
    <article className="border-line flex flex-col gap-5 border bg-white px-5 py-5 sm:px-[26px] sm:py-6">
      <header className="flex flex-wrap items-center gap-3.5">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <h3 className="text-sm font-semibold">
            <Link href={routes.accountOrder(order.number)} className="hover:text-gold">
              {t("account.orders.number", { number: order.number })}
            </Link>
          </h3>
          <p className="text-muted text-xs">{meta.join(" · ")}</p>
        </div>
        <OrderStatusChip status={order.status} />
        <p className="text-base font-semibold whitespace-nowrap">{formatPrice(order.total)}</p>
      </header>
      <div className="flex flex-wrap items-center gap-3">
        {order.thumbnails.length > 0 ? (
          <ul className="flex gap-2">
            {order.thumbnails.map((src, index) => (
              <li key={`${src}-${index}`} className="bg-sand relative h-[72px] w-14 overflow-hidden">
                <Image
                  src={src}
                  alt={t("account.orders.thumbnailAlt", { number: order.number })}
                  fill
                  sizes="56px"
                  className="object-cover object-top"
                />
              </li>
            ))}
          </ul>
        ) : null}
        <div className="flex-1" />
        <div className="flex w-full flex-wrap gap-3 sm:w-auto">
          <Link
            href={routes.accountOrder(order.number)}
            className="border-line hover:border-ink flex-1 border px-[22px] py-3.5 text-center text-[10.5px] leading-none font-semibold tracking-[0.16em] whitespace-nowrap uppercase transition-colors sm:flex-none"
          >
            {t("account.orders.details")}
          </Link>
          <RepeatOrderButton number={order.number} onError={setError} className="flex-1 sm:flex-none" />
        </div>
      </div>
      {error ? (
        <p role="alert" className="text-sale -mt-2 text-[12.5px]">
          {error}
        </p>
      ) : null}
    </article>
  );
}
