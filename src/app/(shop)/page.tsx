import type { Metadata } from "next";

import { HomeContent } from "@/features/home";
import { t } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: t("home.meta.title"),
  description: t("home.meta.description"),
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return <HomeContent />;
}
