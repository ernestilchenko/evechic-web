"use client";

import { Spinner } from "@/components/ui/Spinner";
import { formatPrice } from "@/lib/format";
import { t } from "@/lib/i18n";

import { useAccountSummary } from "../hooks/useAccountQueries";
import { formatPercent, loyaltyLevelLabel } from "../utils/format";

type NextLevel = { level: string; percent: string | number; amount_left: string | number };

const blockClass = "border-line flex flex-col gap-4 border bg-white px-5 py-6 sm:px-[30px] sm:py-7";
const titleClass = "text-[11px] font-semibold tracking-[0.2em] uppercase";

export function BonusesSection() {
  const { data, isLoading, isError } = useAccountSummary();

  if (isLoading) {
    return (
      <div className="text-muted flex justify-center py-14">
        <Spinner label={t("common.loading")} />
      </div>
    );
  }
  if (isError || !data) {
    return (
      <p role="alert" className="text-sale text-[13px]">
        {t("account.bonuses.error")}
      </p>
    );
  }

  const { loyalty } = data;
  const next = loyalty.next_level as NextLevel | null;
  const completed = Number(loyalty.completed_total);
  const target = next ? completed + Number(next.amount_left) : completed;
  const progress = next && target > 0 ? Math.min(100, Math.round((completed / target) * 100)) : 100;
  const hasDiscount = Number(loyalty.percent) > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <section
          aria-labelledby="bonus-balance-title"
          className="bg-sand flex flex-col gap-3 p-6 sm:p-[26px]"
        >
          <h2 id="bonus-balance-title" className={titleClass}>
            {t("account.bonuses.balanceTitle")}
          </h2>
          <p className="text-gold font-serif text-5xl leading-none font-light">
            {formatPrice(data.bonus_balance)}
          </p>
          <p className="text-muted text-[12.5px] leading-[1.65]">{t("account.bonuses.balanceText")}</p>
        </section>
        <section aria-labelledby="bonus-level-title" className="bg-sand flex flex-col gap-3 p-6 sm:p-[26px]">
          <h2 id="bonus-level-title" className={titleClass}>
            {t("account.bonuses.levelTitle")}
          </h2>
          <p className="font-serif text-5xl leading-none font-light">{loyaltyLevelLabel(loyalty.level)}</p>
          <p className="text-muted text-[12.5px] leading-[1.65]">
            {hasDiscount
              ? t("account.bonuses.levelDiscount", {
                  percent: formatPercent(loyalty.percent).replace("%", ""),
                })
              : t("account.bonuses.levelNoDiscount")}
          </p>
        </section>
      </div>
      <section aria-labelledby="bonus-progress-title" className={blockClass}>
        <h2 id="bonus-progress-title" className={titleClass}>
          {t("account.bonuses.progressLabel")}
        </h2>
        <p className="text-muted text-[13px]">
          {t("account.bonuses.completedTotal", { amount: formatPrice(loyalty.completed_total) })}
        </p>
        <div
          role="progressbar"
          aria-label={t("account.bonuses.progressLabel")}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="bg-sand h-2 w-full overflow-hidden"
        >
          <div className="bg-gold h-full transition-[width]" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-[13px]">
          {next
            ? t("account.bonuses.nextLevel", {
                level: loyaltyLevelLabel(next.level),
                percent: formatPercent(next.percent).replace("%", ""),
                amount: formatPrice(next.amount_left),
              })
            : t("account.bonuses.maxLevel")}
        </p>
      </section>
      <section aria-labelledby="bonus-how-title" className={blockClass}>
        <h2 id="bonus-how-title" className={titleClass}>
          {t("account.bonuses.howTitle")}
        </h2>
        <ul className="text-muted flex list-disc flex-col gap-2.5 pl-5 text-[13px] leading-[1.65]">
          <li>{t("account.bonuses.howEarn")}</li>
          <li>{t("account.bonuses.howSpend")}</li>
          <li>{t("account.bonuses.howLevels")}</li>
          <li>{t("account.bonuses.howReturn")}</li>
        </ul>
      </section>
    </div>
  );
}
