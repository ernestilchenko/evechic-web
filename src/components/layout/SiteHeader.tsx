import Link from "next/link";
import { Suspense } from "react";

import { CartLink } from "@/features/cart";
import { mainNavigation } from "@/data/navigation";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";

import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

const actionClass = "text-[11px] font-medium tracking-[0.14em] uppercase hover:text-gold";

export function SiteHeader() {
  return (
    <header className="border-line bg-cream sticky top-0 z-50 border-b">
      <div className="container-page grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 lg:h-24">
        <div className="flex items-center">
          <MobileMenu />
          <nav aria-label={t("layout.nav.label")} className="hidden lg:block">
            <ul className="flex items-center gap-[30px]">
              {mainNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "hover:text-gold text-[11px] tracking-[0.14em] uppercase",
                      item.accent ? "text-sale font-semibold" : "font-medium",
                    )}
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <Logo />
        <nav
          aria-label={t("layout.actions.label")}
          className="flex items-center justify-end gap-5 lg:gap-[26px]"
        >
          <Link href={routes.search} className={cn(actionClass, "hidden sm:inline")}>
            {t("layout.actions.search")}
          </Link>
          <Link href={routes.account} className={cn(actionClass, "hidden sm:inline")}>
            {t("layout.actions.profile")}
          </Link>
          <Suspense fallback={<span className={actionClass}>{t("layout.actions.cart")}</span>}>
            <CartLink className={actionClass} />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
