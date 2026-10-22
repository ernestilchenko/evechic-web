import type { Metadata } from "next";

import { LoginForm } from "@/features/auth";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: t("auth.meta.loginTitle"),
  description: t("auth.meta.loginDescription"),
  path: routes.login,
  noIndex: true,
});

export default function LoginPage() {
  return <LoginForm />;
}
