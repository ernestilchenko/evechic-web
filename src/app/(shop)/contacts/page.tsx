import type { Metadata } from "next";
import Link from "next/link";

import { routes } from "@/data/routes";
import { siteConfig } from "@/data/site";
import { PageBreadcrumbs } from "@/features/content/components/PageBreadcrumbs";
import { t } from "@/lib/i18n";

const TITLE = t("contacts.title");

export const metadata: Metadata = {
  title: TITLE,
  description: t("contacts.description"),
  alternates: { canonical: routes.contacts },
};

const linkClass = "text-ink hover:text-gold underline-offset-4 hover:underline";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-line flex flex-col gap-1.5 border-b py-5 sm:flex-row sm:gap-8">
      <dt className="text-muted w-48 shrink-0 text-[10.5px] font-semibold tracking-[0.2em] uppercase sm:pt-1">
        {label}
      </dt>
      <dd className="text-[15px] leading-[1.75]">{children}</dd>
    </div>
  );
}

export default function ContactsPage() {
  const external = { target: "_blank", rel: "noopener noreferrer", className: linkClass };
  return (
    <article className="container-page pt-8 pb-20 sm:pb-[88px]">
      <PageBreadcrumbs title={TITLE} path={routes.contacts} />
      <header className="flex max-w-[820px] flex-col gap-5 pt-12 pb-10 sm:pt-16 sm:pb-12">
        <h1 className="font-serif text-[36px] leading-[1.1] font-light sm:text-[52px]">{TITLE}</h1>
        <p className="text-muted max-w-[640px] text-[15px] leading-[1.75]">{t("contacts.lead")}</p>
      </header>
      <dl className="border-line flex max-w-[820px] flex-col border-t">
        <Row label={t("contacts.phone")}>
          <a href={`tel:${siteConfig.phone}`} className={linkClass}>
            {siteConfig.phoneDisplay}
          </a>
        </Row>
        <Row label={t("contacts.messengers")}>
          <span className="flex flex-wrap gap-x-6 gap-y-1">
            <a href={siteConfig.socials.telegram} {...external}>
              Telegram
            </a>
            <a href={siteConfig.socials.instagram} {...external}>
              Instagram {siteConfig.instagramHandle}
            </a>
            <a href={siteConfig.socials.tiktok} {...external}>
              TikTok
            </a>
          </span>
        </Row>
        <Row label={t("contacts.email")}>
          <a href={`mailto:${siteConfig.email}`} className={linkClass}>
            {siteConfig.email}
          </a>
        </Row>
        <Row label={t("contacts.hours")}>{t("footer.workingHours")}</Row>
        <Row label={t("contacts.delivery")}>
          {t("contacts.deliveryText")}{" "}
          <Link href={routes.delivery} className={linkClass}>
            {t("contacts.deliveryLink")}
          </Link>
        </Row>
        <Row label={t("contacts.legal")}>
          {siteConfig.legalName}
          <br />
          {t("contacts.taxId", { taxId: siteConfig.taxId })}
          <br />
          {t("contacts.city", { city: siteConfig.city })}
        </Row>
      </dl>
    </article>
  );
}
