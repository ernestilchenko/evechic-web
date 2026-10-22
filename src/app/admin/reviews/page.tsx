import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingBlock } from "@/features/admin";
import { ReviewsList } from "@/features/admin-reviews";
import { t } from "@/lib/i18n";

export const metadata: Metadata = { title: t("admin.meta.reviews") };

export default function Page() {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <ReviewsList />
    </Suspense>
  );
}
