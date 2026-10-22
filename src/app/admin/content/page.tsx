import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingBlock } from "@/features/admin";
import { ContentManager } from "@/features/admin-content";
import { t } from "@/lib/i18n";

export const metadata: Metadata = { title: t("admin.meta.content") };

export default function Page() {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <ContentManager />
    </Suspense>
  );
}
