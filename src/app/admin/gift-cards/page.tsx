import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingBlock } from "@/features/admin";
import { GiftCardsList } from "@/features/admin-gift-cards";
import { t } from "@/lib/i18n";

export const metadata: Metadata = { title: t("admin.meta.giftCards") };

export default function Page() {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <GiftCardsList />
    </Suspense>
  );
}
