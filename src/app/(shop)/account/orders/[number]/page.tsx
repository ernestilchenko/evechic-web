import type { Metadata } from "next";
import { Suspense } from "react";

import { OrderDetailView } from "@/features/account";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: t("account.meta.orderTitle"),
  description: t("account.meta.orderDescription"),
  path: routes.account,
  noIndex: true,
});

async function OrderDetailRoute({ params }: PageProps<"/account/orders/[number]">) {
  const { number } = await params;
  return <OrderDetailView number={number} />;
}

export default function AccountOrderPage(props: PageProps<"/account/orders/[number]">) {
  return (
    <Suspense>
      <OrderDetailRoute {...props} />
    </Suspense>
  );
}
