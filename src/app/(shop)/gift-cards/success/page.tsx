import type { Metadata } from "next";
import { Suspense } from "react";

import { GiftCardSuccess } from "@/features/gift-cards";
import { t } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: t("giftCards.success.title"),
  description: t("giftCards.meta.description"),
  path: "/gift-cards/success",
  noIndex: true,
});

export default function GiftCardSuccessPage() {
  return (
    <Suspense fallback={null}>
      <GiftCardSuccess />
    </Suspense>
  );
}
