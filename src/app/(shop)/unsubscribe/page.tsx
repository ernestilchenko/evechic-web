import type { Metadata } from "next";
import { Suspense } from "react";

import { UnsubscribeView } from "@/features/newsletter";
import { t } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: t("newsletter.unsubscribe.title"),
  description: t("newsletter.unsubscribe.title"),
  path: "/unsubscribe",
  noIndex: true,
});

export default function UnsubscribePage() {
  return (
    <Suspense fallback={null}>
      <UnsubscribeView />
    </Suspense>
  );
}
