import Link from "next/link";

import { Logo } from "@/components/layout/Logo";
import { routes } from "@/data/routes";
import { siteConfig } from "@/data/site";
import { t } from "@/lib/i18n";

const linkClass = "text-muted hover:text-ink text-[10.5px] font-semibold tracking-[0.16em] uppercase";

export function CheckoutHeader() {
  return (
    <header className="border-line border-b">
      <div className="container-page grid h-[72px] grid-cols-[1fr_auto_1fr] items-center gap-4 sm:h-24">
        <Link href={routes.cart} className={linkClass}>
          <span aria-hidden="true">← </span>
          <span className="hidden sm:inline">{t("checkout.header.backToCart")}</span>
          <span className="sm:hidden">{t("checkout.header.backShort")}</span>
        </Link>
        <Logo />
        <a
          href={`tel:${siteConfig.phone}`}
          aria-label={t("checkout.header.helpLabel", { phone: siteConfig.phoneDisplay })}
          className={`${linkClass} justify-self-end text-right`}
        >
          <span className="hidden md:inline">{t("checkout.header.help")} · </span>
          <span className="hidden sm:inline">{siteConfig.phoneDisplay}</span>
          <span className="sm:hidden">{t("checkout.header.help")}</span>
        </a>
      </div>
    </header>
  );
}
