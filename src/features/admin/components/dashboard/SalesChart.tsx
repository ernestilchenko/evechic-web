import { formatPrice } from "@/lib/format";
import { t, tPlural } from "@/lib/i18n";
import { cn } from "@/lib/cn";

import type { SalesDay } from "../../types";
import { formatDayLabel } from "../../utils/format";

type SalesChartProps = {
  days: SalesDay[];
  period: number;
};

const AXIS_LABELS = 7;

export function SalesChart({ days, period }: SalesChartProps) {
  const maxRevenue = Math.max(...days.map((day) => Number(day.revenue)), 0);
  const maxOrders = Math.max(...days.map((day) => day.orders), 0);
  const peakIndex = maxRevenue > 0 ? days.findIndex((day) => Number(day.revenue) === maxRevenue) : -1;
  const step = Math.max(1, Math.ceil(days.length / AXIS_LABELS));
  const axis = days.filter((_, index) => index % step === 0);

  return (
    <section
      aria-labelledby="sales-chart-title"
      className="border-admin-line flex min-w-0 flex-1 flex-col gap-[26px] rounded-md border bg-white px-5 py-6 sm:px-[26px]"
    >
      <div className="flex flex-wrap items-center gap-4">
        <h2 id="sales-chart-title" className="flex-1 text-[14px] font-semibold">
          {t("admin.dashboard.salesTitle", { days: period })}
        </h2>
        <div className="text-muted flex items-center gap-4 text-[11px]" aria-hidden>
          <span className="flex items-center gap-[7px]">
            <span className="bg-ink size-[9px] rounded-[2px]" />
            {t("admin.dashboard.revenue")}
          </span>
          <span className="flex items-center gap-[7px]">
            <span className="bg-admin-bar size-[9px] rounded-[2px]" />
            {t("admin.dashboard.ordersLegend")}
          </span>
        </div>
      </div>
      <div
        aria-hidden
        className={cn("flex h-[230px] items-end", days.length > 40 ? "gap-px" : "gap-1 sm:gap-2")}
      >
        {days.map((day, index) => {
          const revenue = Number(day.revenue);
          const revenueHeight =
            maxRevenue > 0 ? Math.max((revenue / maxRevenue) * 170, revenue > 0 ? 4 : 2) : 2;
          const ordersHeight =
            maxOrders > 0 ? Math.max((day.orders / maxOrders) * 45, day.orders > 0 ? 4 : 2) : 2;
          return (
            <div
              key={day.date}
              title={`${formatDayLabel(day.date)}: ${formatPrice(day.revenue)} · ${tPlural("admin.dashboard.ordersCount", day.orders)}`}
              className="flex min-w-0 flex-1 flex-col items-center gap-1"
            >
              <span
                className={cn("w-full rounded-[3px]", index === peakIndex ? "bg-gold" : "bg-ink")}
                style={{ height: revenueHeight }}
              />
              <span className="bg-admin-bar w-full rounded-[3px]" style={{ height: ordersHeight }} />
            </div>
          );
        })}
      </div>
      <div aria-hidden className="text-placeholder flex text-[10px]">
        {axis.map((day) => (
          <span key={day.date} className="min-w-0 flex-1 truncate">
            {formatDayLabel(day.date)}
          </span>
        ))}
      </div>
      <table className="sr-only">
        <caption>{t("admin.dashboard.salesTitle", { days: period })}</caption>
        <thead>
          <tr>
            <th scope="col">{t("admin.dashboard.date")}</th>
            <th scope="col">{t("admin.dashboard.revenue")}</th>
            <th scope="col">{t("admin.dashboard.ordersLegend")}</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day.date}>
              <td>{formatDayLabel(day.date)}</td>
              <td>{formatPrice(day.revenue)}</td>
              <td>{day.orders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
