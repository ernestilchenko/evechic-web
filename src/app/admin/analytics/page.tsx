import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingBlock } from "@/features/admin";
import { AnalyticsView } from "@/features/admin-analytics";
import { t } from "@/lib/i18n";

export const metadata: Metadata = { title: t("adminAnalytics.meta") };

export default function Page() {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <AnalyticsView />
    </Suspense>
  );
}
