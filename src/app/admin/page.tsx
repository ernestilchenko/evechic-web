import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminDashboard, LoadingBlock } from "@/features/admin";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: { absolute: `${t("admin.meta.dashboard")} · ${t("admin.meta.title")}` },
};

export default function Page() {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <AdminDashboard />
    </Suspense>
  );
}
