import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingBlock } from "@/features/admin";
import { CustomersList } from "@/features/admin-customers";
import { t } from "@/lib/i18n";

export const metadata: Metadata = { title: t("admin.meta.customers") };

export default function Page() {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <CustomersList />
    </Suspense>
  );
}
