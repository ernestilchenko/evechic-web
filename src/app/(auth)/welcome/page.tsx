import type { Metadata } from "next";

import { OnboardingForm } from "@/features/auth";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: t("auth.meta.welcomeTitle"),
  description: t("auth.meta.welcomeDescription"),
  path: routes.welcome,
  noIndex: true,
});

export default function WelcomePage() {
  return <OnboardingForm />;
}
