import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingBlock } from "@/features/admin";
import { OrdersList } from "@/features/admin-orders";
import { t } from "@/lib/i18n";

export const metadata: Metadata = { title: t("admin.meta.orders") };

export default function Page() {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <OrdersList />
    </Suspense>
  );
}
