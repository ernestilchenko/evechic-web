import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: t("errors.notFound.title"),
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <p className="text-gold font-serif text-[120px] leading-none font-light">404</p>
      <h1 className="font-serif text-4xl font-light">{t("errors.notFound.title")}</h1>
      <p className="text-muted max-w-md">{t("errors.notFound.text")}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <ButtonLink href={routes.home}>{t("errors.notFound.cta")}</ButtonLink>
        <ButtonLink href={routes.catalog} variant="outline">
          {t("errors.notFound.catalogCta")}
        </ButtonLink>
      </div>
    </main>
  );
}
