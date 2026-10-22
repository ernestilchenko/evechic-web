"use client";

import { useRouter } from "next/navigation";

import { Select } from "@/components/ui/Select";
import { routes } from "@/data/routes";
import { formatPrice } from "@/lib/format";
import { t } from "@/lib/i18n";

import { DASHBOARD_PERIODS, DEFAULT_PERIOD } from "../../constants/queryKeys";
import { useDashboard } from "../../hooks/useDashboard";
import { useUrlState } from "../../hooks/useUrlState";
import { EMPTY_VALUE, formatNumber, formatPercent } from "../../utils/format";
import { AdminButtonLink } from "../AdminButton";
import { AdminPageBody, AdminPageHeader } from "../AdminPageHeader";
import { ErrorBlock, LoadingBlock } from "../QueryState";
import { SearchField } from "../SearchField";
import { KpiCard } from "./KpiCard";
import { LowStockList } from "./LowStockList";
import { RecentOrders } from "./RecentOrders";
import { SalesChart } from "./SalesChart";
import { TopProducts } from "./TopProducts";

export function AdminDashboard() {
  const router = useRouter();
  const url = useUrlState();
  const requested = url.getNumber("days", DEFAULT_PERIOD);
  const days = (DASHBOARD_PERIODS as readonly number[]).includes(requested) ? requested : DEFAULT_PERIOD;
  const { data, error, isLoading, refetch } = useDashboard(days);

  return (
    <>
      <AdminPageHeader title={t("admin.dashboard.title")}>
        <SearchField
          live={false}
          value=""
          label={t("admin.dashboard.searchLabel")}
          placeholder={t("admin.dashboard.searchPlaceholder")}
          onChange={(value) => {
            if (value) router.push(`${routes.admin.orders}?q=${encodeURIComponent(value)}`);
          }}
        />
        <label className="sr-only" htmlFor="dashboard-period">
          {t("admin.dashboard.periodLabel")}
        </label>
        <Select
          id="dashboard-period"
          value={days}
          onChange={(event) =>
            url.set({ days: Number(event.target.value) === DEFAULT_PERIOD ? null : event.target.value })
          }
          className="text-[10px] font-semibold tracking-[0.14em] uppercase"
        >
          {DASHBOARD_PERIODS.map((period) => (
            <option key={period} value={period}>
              {t("admin.dashboard.period", { days: period })}
            </option>
          ))}
        </Select>
        <AdminButtonLink href={routes.admin.productNew}>+ {t("admin.dashboard.addProduct")}</AdminButtonLink>
      </AdminPageHeader>
      <AdminPageBody>
        {isLoading ? <LoadingBlock /> : null}
        {error && !data ? <ErrorBlock error={error} onRetry={() => refetch()} /> : null}
        {data ? (
          <>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                label={t("admin.dashboard.kpiRevenue")}
                value={formatPrice(data.kpis.revenue.value)}
                delta={data.kpis.revenue.delta_percent}
              />
              <KpiCard
                label={t("admin.dashboard.kpiOrders")}
                value={formatNumber(data.kpis.orders.value)}
                delta={data.kpis.orders.delta_percent}
              />
              <KpiCard
                label={t("admin.dashboard.kpiAverage")}
                value={formatPrice(data.kpis.average_check.value)}
                delta={data.kpis.average_check.delta_percent}
              />
              <KpiCard
                label={t("admin.dashboard.kpiConversion")}
                value={
                  data.kpis.conversion.value === null
                    ? EMPTY_VALUE
                    : formatPercent(data.kpis.conversion.value)
                }
                delta={data.kpis.conversion.delta_percent}
              />
            </dl>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
              <SalesChart days={data.sales_by_day} period={data.period.days} />
              <TopProducts products={data.top_products} />
            </div>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
              <RecentOrders orders={data.recent_orders} />
              <LowStockList items={data.low_stock} />
            </div>
          </>
        ) : null}
      </AdminPageBody>
    </>
  );
}
