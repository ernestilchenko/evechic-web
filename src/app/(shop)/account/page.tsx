import type { Metadata } from "next";

import { OrdersOverview } from "@/features/account";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: t("account.meta.ordersTitle"),
  description: t("account.meta.ordersDescription"),
  path: routes.account,
  noIndex: true,
});

export default function AccountOrdersPage() {
  return <OrdersOverview />;
}
