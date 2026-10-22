import type { MessageKey } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export function loyaltyLevelLabel(level: string) {
  const key = `account.levels.${level}` as MessageKey;
  const label = t(key);
  return label === key ? level : label;
}

export function formatPercent(value: string | number) {
  return `${Number(value).toLocaleString("uk-UA", { maximumFractionDigits: 2 })}%`;
}
