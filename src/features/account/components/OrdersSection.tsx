"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useId } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";

import { ORDER_PERIODS, type OrderPeriod } from "../constants/account";
import { useOrders } from "../hooks/useAccountQueries";

import { OrderCard } from "./OrderCard";

function parsePeriod(value: string | null): OrderPeriod {
  return ORDER_PERIODS.includes(value as OrderPeriod) ? (value as OrderPeriod) : "all";
}

export function OrdersSection() {
  const selectId = useId();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const period = parsePeriod(searchParams.get("period"));
  const query = useOrders(period);
  const orders = query.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <section aria-labelledby="orders-title" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4 pb-1.5">
        <h2 id="orders-title" className="flex-1 font-serif text-[32px] font-light">
          {t("account.orders.title")}
        </h2>
        <label htmlFor={selectId} className="sr-only">
          {t("account.orders.periodLabel")}
        </label>
        <span className="text-muted hover:text-ink focus-within:text-ink relative inline-flex h-11 items-center pr-5">
          <span
            aria-hidden
            className="pointer-events-none text-[10.5px] font-semibold tracking-[0.16em] whitespace-nowrap uppercase"
          >
            {t(`account.orders.periods.${period}`)}
          </span>
          <select
            id={selectId}
            value={period}
            onChange={(event) => {
              const params = new URLSearchParams(searchParams.toString());
              if (event.target.value === "all") params.delete("period");
              else params.set("period", event.target.value);
              const search = params.toString();
              router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
            }}
            className="absolute inset-0 size-full cursor-pointer appearance-none opacity-0"
          >
            {ORDER_PERIODS.map((value) => (
              <option key={value} value={value}>
                {t(`account.orders.periods.${value}`)}
              </option>
            ))}
          </select>
          <span
            aria-hidden
            className="text-muted pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 text-[10px]"
          >
            ▾
          </span>
        </span>
      </div>
      <div aria-live="polite" aria-busy={query.isLoading} className="flex flex-col gap-4">
        {query.isLoading ? (
          <div className="text-muted flex justify-center py-14">
            <Spinner label={t("common.loading")} />
          </div>
        ) : query.isError ? (
          <p role="alert" className="text-sale text-[13px]">
            {t("account.orders.error")}
          </p>
        ) : orders.length === 0 ? (
          <EmptyState
            title={t("account.orders.empty")}
            className="border-line border bg-white"
            action={<ButtonLink href={routes.catalog}>{t("account.orders.emptyCta")}</ButtonLink>}
          />
        ) : (
          <>
            {orders.map((order) => (
              <OrderCard key={order.number} order={order} />
            ))}
            {query.hasNextPage ? (
              <button
                type="button"
                onClick={() => query.fetchNextPage()}
                disabled={query.isFetchingNextPage}
                className="border-ink hover:bg-ink hover:text-cream self-center border px-9 py-4 text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors disabled:opacity-60"
              >
                {query.isFetchingNextPage ? t("common.loading") : t("account.orders.loadMore")}
              </button>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
