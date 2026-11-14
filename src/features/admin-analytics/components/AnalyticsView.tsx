"use client";

import { Select } from "@/components/ui/Select";
import {
  AdminPageBody,
  AdminPageHeader,
  ErrorBlock,
  formatDateTime,
  LoadingBlock,
  Panel,
  Thumb,
  useUrlState,
} from "@/features/admin";
import { formatPrice } from "@/lib/format";
import { t, type MessageKey } from "@/lib/i18n";
import { cn } from "@/lib/cn";

import type { AnalyticsOverview, Breakdown, SalesRow } from "../types";
import { useAnalytics } from "../useAnalytics";

const PERIODS = [7, 30, 90] as const;
const DEFAULT_PERIOD = 30;
const EMPTY = "—";

const numberFormat = new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 1 });

function formatNumber(value: number | string | null | undefined) {
  return value === null || value === undefined ? EMPTY : numberFormat.format(Number(value));
}

function formatPercent(value: number | null | undefined) {
  return value === null || value === undefined ? EMPTY : `${numberFormat.format(value)}%`;
}

function Delta({ value }: { value: number | null | undefined }) {
  if (value === null || value === undefined)
    return <span className="text-placeholder text-[11px]">{EMPTY}</span>;
  const up = value >= 0;
  return (
    <span className={cn("text-[11px] font-semibold", up ? "text-admin-up" : "text-sale")}>
      {up ? "↑ +" : "↓ −"}
      {formatPercent(Math.abs(value))}
    </span>
  );
}

type Kpis = AnalyticsOverview["kpis"];
const KPI_KEYS: (keyof Kpis)[] = [
  "visitors",
  "visits",
  "page_views",
  "pages_per_visit",
  "bounce_rate",
  "orders",
  "revenue",
  "conversion",
];

function kpiValue(key: keyof Kpis, kpis: Kpis) {
  const value = kpis[key].value;
  if (key === "revenue") return formatPrice(String(value));
  if (key === "bounce_rate" || key === "conversion") return formatPercent(value as number | null);
  return formatNumber(value as number | null);
}

function KpiGrid({ kpis }: { kpis: Kpis }) {
  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {KPI_KEYS.map((key) => (
        <div
          key={key}
          className="border-admin-line flex flex-col gap-2.5 rounded-md border bg-white px-5 py-[18px]"
        >
          <dt className="text-placeholder text-[9.5px] font-semibold tracking-[0.2em] uppercase">
            {t(`adminAnalytics.kpi.${key}` as MessageKey)}
          </dt>
          <dd className="text-[22px] leading-none font-semibold">{kpiValue(key, kpis)}</dd>
          <dd className="flex flex-wrap items-center gap-1.5">
            <Delta value={kpis[key].delta_percent} />
            <span className="text-placeholder text-[10.5px]">{t("adminAnalytics.vsPrevious")}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function DailyChart({ days }: { days: AnalyticsOverview["daily"] }) {
  const max = Math.max(...days.map((day) => day.visitors), 1);
  const step = Math.max(1, Math.ceil(days.length / 7));
  return (
    <Panel title={t("adminAnalytics.chart.title")} titleId="analytics-daily">
      <div className="flex items-center gap-4 pb-3 text-[11px]">
        <span className="flex items-center gap-1.5">
          <span className="bg-gold size-2.5 rounded-sm" /> {t("adminAnalytics.chart.visitors")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="bg-ink size-2.5 rounded-full" /> {t("adminAnalytics.chart.orders")}
        </span>
      </div>
      <div className="flex h-44 items-end gap-[3px]" role="img" aria-label={t("adminAnalytics.chart.title")}>
        {days.map((day) => (
          <div key={day.date} className="group relative flex h-full flex-1 flex-col justify-end">
            <div
              className="bg-gold/70 group-hover:bg-gold w-full rounded-t-sm transition-colors"
              style={{ height: `${(day.visitors / max) * 100}%`, minHeight: day.visitors ? 3 : 1 }}
            />
            {day.orders > 0 ? (
              <span
                className="bg-ink absolute left-1/2 size-2 -translate-x-1/2 rounded-full"
                style={{ bottom: `calc(${(day.visitors / max) * 100}% + 4px)` }}
              />
            ) : null}
            <span className="bg-ink text-cream pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 rounded px-2 py-1 text-[10.5px] whitespace-nowrap group-hover:block">
              {new Date(day.date).toLocaleDateString("uk-UA", { day: "numeric", month: "short" })}:{" "}
              {day.visitors} / {day.orders}
            </span>
          </div>
        ))}
      </div>
      <div className="text-placeholder flex justify-between pt-2 text-[10px]">
        {days
          .filter((_, index) => index % step === 0)
          .map((day) => (
            <span key={day.date}>
              {new Date(day.date).toLocaleDateString("uk-UA", { day: "numeric", month: "short" })}
            </span>
          ))}
      </div>
    </Panel>
  );
}

function Funnel({ steps }: { steps: AnalyticsOverview["funnel"] }) {
  return (
    <Panel title={t("adminAnalytics.funnel.title")} titleId="analytics-funnel">
      <ol className="flex flex-col gap-3">
        {steps.map((step) => (
          <li key={step.step} className="flex flex-col gap-1.5">
            <div className="flex justify-between text-[12px]">
              <span>{t(`adminAnalytics.funnel.${step.step}` as MessageKey)}</span>
              <span className="font-semibold tabular-nums">
                {formatNumber(step.visits)}{" "}
                <span className="text-muted font-normal">· {formatPercent(step.percent)}</span>
              </span>
            </div>
            <div className="bg-admin-bg h-2 overflow-hidden rounded-full">
              <div className="bg-gold h-full rounded-full" style={{ width: `${step.percent ?? 0}%` }} />
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

const cellClass = "border-admin-row border-t px-3 py-2.5 text-[12px] first:pl-0 last:pr-0";
const headClass =
  "text-placeholder px-3 pb-2 text-left text-[9.5px] font-semibold tracking-[0.14em] uppercase first:pl-0 last:pr-0";

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  if (rows.length === 0) return <p className="text-muted text-[12px]">{EMPTY}</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max">
        <thead>
          <tr>
            {head.map((label, index) => (
              <th key={label} className={cn(headClass, index > 0 && "text-right")}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, index) => (
                <td key={index} className={cn(cellClass, index > 0 && "text-right tabular-nums")}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function breakdownLabel(kind: "sources" | "devices" | "countries" | "browsers", key: string) {
  if (!key) return t("adminAnalytics.unknown");
  if (kind === "sources" && key === "direct") return t("adminAnalytics.direct");
  if (kind === "devices") return t(`adminAnalytics.device.${key}` as MessageKey);
  return key;
}

function BreakdownPanel({
  kind,
  rows,
}: {
  kind: "sources" | "devices" | "countries" | "browsers";
  rows: Breakdown[];
}) {
  return (
    <Panel title={t(`adminAnalytics.${kind}` as MessageKey)} titleId={`analytics-${kind}`}>
      <Table
        head={[
          t(`adminAnalytics.${kind}` as MessageKey),
          t("adminAnalytics.table.visits"),
          t("adminAnalytics.table.share"),
          t("adminAnalytics.table.orders"),
          t("adminAnalytics.table.conversion"),
        ]}
        rows={rows.map((row) => [
          breakdownLabel(kind, row.key),
          formatNumber(row.visits),
          formatPercent(row.share),
          formatNumber(row.orders),
          formatPercent(row.conversion),
        ])}
      />
    </Panel>
  );
}

function SalesPanel({ title, id, rows }: { title: string; id: string; rows: SalesRow[] }) {
  return (
    <Panel title={title} titleId={id}>
      <Table
        head={[title, t("adminAnalytics.table.quantity"), t("adminAnalytics.table.revenue")]}
        rows={rows.map((row) => [row.key, formatNumber(row.quantity), formatPrice(row.revenue)])}
      />
    </Panel>
  );
}

function Customers({ data }: { data: AnalyticsOverview["customers"] }) {
  const keys = ["customers", "new", "returning", "registered", "guests"] as const;
  return (
    <Panel title={t("adminAnalytics.customers.title")} titleId="analytics-customers">
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {keys.map((key) => (
          <div key={key} className="flex flex-col gap-1">
            <dt className="text-muted text-[11px]">{t(`adminAnalytics.customers.${key}`)}</dt>
            <dd className="text-[20px] font-semibold">{formatNumber(data[key])}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

export function AnalyticsView() {
  const url = useUrlState();
  const requested = url.getNumber("days", DEFAULT_PERIOD);
  const days = (PERIODS as readonly number[]).includes(requested) ? requested : DEFAULT_PERIOD;
  const { data, error, isLoading, refetch } = useAnalytics(days);

  return (
    <>
      <AdminPageHeader title={t("adminAnalytics.title")}>
        <label className="sr-only" htmlFor="analytics-period">
          {t("adminAnalytics.periodLabel")}
        </label>
        <Select
          id="analytics-period"
          value={days}
          onChange={(event) =>
            url.set({ days: Number(event.target.value) === DEFAULT_PERIOD ? null : event.target.value })
          }
          className="text-[10px] font-semibold tracking-[0.14em] uppercase"
        >
          {PERIODS.map((period) => (
            <option key={period} value={period}>
              {t("adminAnalytics.period", { days: period })}
            </option>
          ))}
        </Select>
      </AdminPageHeader>
      <AdminPageBody>
        {isLoading ? <LoadingBlock /> : null}
        {error && !data ? <ErrorBlock error={error} onRetry={() => refetch()} /> : null}
        {data ? (
          <div className="flex flex-col gap-4">
            {data.kpis.visits.value === 0 ? (
              <p role="note" className="bg-admin-bg text-muted rounded px-4 py-3 text-[12.5px]">
                {t("adminAnalytics.empty")}
              </p>
            ) : null}
            <KpiGrid kpis={data.kpis} />
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
              <DailyChart days={data.daily} />
              <Funnel steps={data.funnel} />
            </div>
            <Panel title={t("adminAnalytics.products")} titleId="analytics-products">
              <Table
                head={[
                  t("adminAnalytics.products"),
                  t("adminAnalytics.table.views"),
                  t("adminAnalytics.table.addToCart"),
                  t("adminAnalytics.table.sold"),
                  t("adminAnalytics.table.revenue"),
                  t("adminAnalytics.table.viewToOrder"),
                ]}
                rows={data.products.map((product) => [
                  <span key="name" className="flex items-center gap-3">
                    <Thumb src={product.image} alt={product.name} className="h-10 w-8" />
                    {product.name}
                  </span>,
                  formatNumber(product.views),
                  formatNumber(product.add_to_cart),
                  formatNumber(product.quantity),
                  formatPrice(product.revenue),
                  formatPercent(product.view_to_order),
                ])}
              />
            </Panel>
            <div className="grid gap-4 lg:grid-cols-2">
              <BreakdownPanel kind="sources" rows={data.sources} />
              <BreakdownPanel kind="devices" rows={data.devices} />
              <BreakdownPanel kind="countries" rows={data.countries} />
              <BreakdownPanel kind="browsers" rows={data.browsers} />
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <SalesPanel
                title={t("adminAnalytics.salesByCategory")}
                id="analytics-category"
                rows={data.sales_by_category}
              />
              <SalesPanel
                title={t("adminAnalytics.salesByColor")}
                id="analytics-color"
                rows={data.sales_by_color}
              />
              <SalesPanel
                title={t("adminAnalytics.salesBySize")}
                id="analytics-size"
                rows={data.sales_by_size}
              />
            </div>
            <Customers data={data.customers} />
            <Panel title={t("adminAnalytics.pages")} titleId="analytics-pages">
              <Table
                head={[
                  t("adminAnalytics.table.page"),
                  t("adminAnalytics.table.views"),
                  t("adminAnalytics.table.visitors"),
                ]}
                rows={data.top_pages.map((page) => [
                  page.path,
                  formatNumber(page.views),
                  formatNumber(page.visitors),
                ])}
              />
            </Panel>
            <Panel title={t("adminAnalytics.recent")} titleId="analytics-recent">
              <Table
                head={[
                  t("adminAnalytics.table.time"),
                  t("adminAnalytics.table.source"),
                  t("adminAnalytics.table.device"),
                  t("adminAnalytics.table.country"),
                  t("adminAnalytics.table.landing"),
                  t("adminAnalytics.table.pages"),
                  t("adminAnalytics.table.customer"),
                  t("adminAnalytics.table.ordered"),
                ]}
                rows={data.recent_visits.map((visit) => [
                  formatDateTime(visit.started_at),
                  breakdownLabel("sources", visit.source),
                  `${breakdownLabel("devices", visit.device)} · ${visit.browser}`,
                  visit.country || EMPTY,
                  visit.landing_path,
                  formatNumber(visit.page_views),
                  visit.customer ?? EMPTY,
                  visit.ordered ? t("adminAnalytics.yes") : EMPTY,
                ])}
              />
            </Panel>
          </div>
        ) : null}
      </AdminPageBody>
    </>
  );
}
