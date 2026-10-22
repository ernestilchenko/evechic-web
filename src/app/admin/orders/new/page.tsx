import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingBlock } from "@/features/admin";
import { OrderCreateForm } from "@/features/admin-orders";
import { t } from "@/lib/i18n";

export const metadata: Metadata = { title: t("admin.meta.orderNew") };

export default function Page() {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <OrderCreateForm />
    </Suspense>
  );
}
