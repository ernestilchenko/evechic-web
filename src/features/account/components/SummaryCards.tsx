"use client";

import { formatPrice } from "@/lib/format";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";

import { useAccountSummary } from "../hooks/useAccountQueries";
import { formatPercent, loyaltyLevelLabel } from "../utils/format";

function Card({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className="bg-sand flex flex-col gap-2 p-5 sm:p-[26px]">
      <dt className="text-muted text-[12.5px]">{label}</dt>
      <dd
        className={cn(
          "order-first font-serif text-[34px] leading-none font-light sm:text-[40px]",
          accent && "text-gold",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

export function SummaryCards() {
  const { data } = useAccountSummary();

  return (
    <dl aria-label={t("account.summary.label")} className="grid gap-4 sm:grid-cols-3" aria-busy={!data}>
      <Card value={data ? String(data.completed_orders_count) : "—"} label={t("account.summary.completed")} />
      <Card
        value={data ? formatPrice(data.bonus_balance) : "—"}
        label={t("account.summary.bonuses")}
        accent
      />
      <Card
        value={
          data
            ? Number(data.loyalty.percent) > 0
              ? `−${formatPercent(data.loyalty.percent)}`
              : formatPercent(0)
            : "—"
        }
        label={t("account.summary.level", { level: data ? loyaltyLevelLabel(data.loyalty.level) : "…" })}
      />
    </dl>
  );
}
