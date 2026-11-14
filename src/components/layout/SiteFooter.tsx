import { cacheLife } from "next/cache";
import Link from "next/link";

import { footerHelpLinks, footerShopLinks, type NavItem } from "@/data/navigation";
import { routes } from "@/data/routes";
import { siteConfig } from "@/data/site";
import { t } from "@/lib/i18n";

function FooterColumn({ title, links }: { title: string; links: NavItem[] }) {
  return (
    <nav aria-label={title} className="flex flex-col gap-[15px]">
      <h2 className="text-gold text-[10.5px] font-semibold tracking-[0.22em] uppercase">{title}</h2>
      <ul className="flex flex-col gap-1 lg:gap-[15px]">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-footer-text hover:text-cream inline-flex min-h-9 items-center text-[13px] lg:min-h-0"
            >
              {t(link.labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export async function SiteFooter() {
  "use cache";
  cacheLife("days");

  const socials = [
    { href: siteConfig.socials.instagram, label: "Instagram" },
    { href: siteConfig.socials.telegram, label: "Telegram" },
    { href: siteConfig.socials.tiktok, label: "TikTok" },
  ];

  return (
    <footer className="bg-ink text-cream">
      <div className="container-page flex flex-col gap-11 pt-16 pb-8 lg:pt-[84px]">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[360px_1fr_1fr_1fr] lg:gap-14">
          <div className="flex flex-col gap-4">
            <p className="font-serif text-[34px] font-light tracking-[0.32em]">EVECHIC</p>
            <p className="text-gold font-serif text-lg font-light tracking-[0.04em] italic">
              {t("footer.tagline")}
            </p>
            <p className="text-footer-muted max-w-[320px] text-[13px] leading-[1.75]">{t("footer.about")}</p>
            <ul className="flex gap-[22px] pt-1.5">
              {socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold inline-flex min-h-11 items-center text-[10.5px] font-semibold tracking-[0.18em] uppercase lg:min-h-0"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <FooterColumn title={t("footer.shop")} links={footerShopLinks} />
          <FooterColumn title={t("footer.help")} links={footerHelpLinks} />
          <div className="flex flex-col gap-[15px]">
            <h2 className="text-gold text-[10.5px] font-semibold tracking-[0.22em] uppercase">
              {t("footer.contacts")}
            </h2>
            <address className="text-footer-text flex flex-col items-start gap-1 text-[13px] not-italic lg:gap-[15px] [&>a]:inline-flex [&>a]:min-h-9 [&>a]:items-center lg:[&>a]:min-h-0">
              <a href={`tel:${siteConfig.phone}`} className="hover:text-cream">
                {siteConfig.phoneDisplay}
              </a>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-cream">
                {siteConfig.email}
              </a>
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cream"
              >
                {siteConfig.instagramHandle}
              </a>
              <span>{t("footer.workingHours")}</span>
            </address>
          </div>
        </div>
        <div className="bg-footer-line h-px" />
        <div className="text-footer-dim flex flex-col gap-3 text-[11.5px] lg:flex-row lg:items-center lg:gap-6">
          <p className="flex-1">
            {t("footer.copyright", {
              year: new Date().getFullYear(),
              legalName: siteConfig.legalName,
              taxId: siteConfig.taxId,
              city: siteConfig.city,
            })}
          </p>
          <p>{t("footer.payments")}</p>
          <Link href={routes.offer} className="hover:text-cream py-1.5 lg:py-0">
            {t("footer.offer")}
          </Link>
          <Link href={routes.privacy} className="hover:text-cream py-1.5 lg:py-0">
            {t("footer.privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
