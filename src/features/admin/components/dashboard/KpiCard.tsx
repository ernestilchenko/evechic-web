import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";

import { EMPTY_VALUE, formatPercent } from "../../utils/format";

type KpiCardProps = {
  label: string;
  value: string;
  delta: number | null;
};

export function KpiCard({ label, value, delta }: KpiCardProps) {
  const up = delta !== null && delta >= 0;
  return (
    <div className="border-admin-line flex flex-col gap-3 rounded-md border bg-white px-6 py-[22px]">
      <dt className="text-placeholder text-[9.5px] font-semibold tracking-[0.22em] uppercase">{label}</dt>
      <dd className="text-[26px] leading-none font-semibold">{value}</dd>
      <dd className="flex flex-wrap items-center gap-1.5">
        <span
          className={cn(
            "text-[11px] font-semibold",
            delta === null ? "text-placeholder" : up ? "text-admin-up" : "text-sale",
          )}
        >
          {delta === null ? EMPTY_VALUE : `${up ? "↑ +" : "↓ −"}${formatPercent(Math.abs(delta))}`}
        </span>
        <span className="text-placeholder text-[10.5px]">{t("admin.dashboard.vsPrevious")}</span>
      </dd>
    </div>
  );
}
