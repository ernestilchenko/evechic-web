import type { Metadata } from "next";

import { BonusesSection } from "@/features/account";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: t("account.meta.bonusesTitle"),
  description: t("account.meta.bonusesDescription"),
  path: routes.accountBonuses,
  noIndex: true,
});

export default function AccountBonusesPage() {
  return <BonusesSection />;
}
