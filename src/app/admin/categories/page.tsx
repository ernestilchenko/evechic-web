import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingBlock } from "@/features/admin";
import { CategoriesManager } from "@/features/admin-catalog";
import { t } from "@/lib/i18n";

export const metadata: Metadata = { title: t("admin.meta.categories") };

export default function Page() {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <CategoriesManager />
    </Suspense>
  );
}
