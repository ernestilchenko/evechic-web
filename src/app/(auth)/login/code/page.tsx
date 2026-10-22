import type { Metadata } from "next";

import { CodeForm } from "@/features/auth";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: t("auth.meta.codeTitle"),
  description: t("auth.meta.codeDescription"),
  path: routes.loginCode,
  noIndex: true,
});

export default function LoginCodePage() {
  return <CodeForm />;
}
