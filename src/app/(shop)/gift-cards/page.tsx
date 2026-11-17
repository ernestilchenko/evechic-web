import type { Metadata } from "next";

import { GiftCardsView } from "@/features/gift-cards";
import { t } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: t("giftCards.meta.title"),
  description: t("giftCards.meta.description"),
  path: "/gift-cards",
});

export default function GiftCardsPage() {
  return <GiftCardsView />;
}
