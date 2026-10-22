import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminShellFallback } from "@/features/admin";
import { AdminGate } from "@/features/admin/server";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: { default: t("admin.meta.title"), template: `%s · ${t("admin.meta.title")}` },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<AdminShellFallback />}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}
