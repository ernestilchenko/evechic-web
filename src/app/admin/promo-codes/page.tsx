import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingBlock } from "@/features/admin";
import { PromoCodesList } from "@/features/admin-promo";
import { t } from "@/lib/i18n";

export const metadata: Metadata = { title: t("admin.meta.promoCodes") };

export default function Page() {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <PromoCodesList />
    </Suspense>
  );
}
