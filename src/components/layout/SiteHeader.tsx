import Link from "next/link";
import { Suspense } from "react";

import { AccountLink } from "@/features/auth";
import { CartLink } from "@/features/cart";
import { mainNavigation } from "@/data/navigation";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";

import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

const actionClass =
  "inline-flex min-h-11 items-center text-[11px] font-medium tracking-[0.14em] uppercase hover:text-gold";

export function SiteHeader() {
  return (
    <header className="border-line bg-cream sticky top-0 z-50 border-b">
      <div className="container-page grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 lg:h-24">
        <div className="flex items-center">
          <MobileMenu />
          <Link
            href={routes.search}
            aria-label={t("layout.actions.search")}
            className="flex size-11 items-center justify-center sm:hidden"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.4">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m15.5 15.5 5 5" strokeLinecap="round" />
            </svg>
          </Link>
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
          className="-mr-1 flex items-center justify-end gap-5 lg:gap-[26px]"
        >
          <Link href={routes.search} className={cn(actionClass, "hidden sm:inline-flex")}>
            {t("layout.actions.search")}
          </Link>
          <Suspense
            fallback={
              <Link href={routes.login} className={cn(actionClass, "hidden sm:inline-flex")}>
                {t("layout.actions.profile")}
              </Link>
            }
          >
            <AccountLink className={cn(actionClass, "hidden sm:inline-flex")} />
          </Suspense>
          <Suspense fallback={<span className={actionClass}>{t("layout.actions.cart")}</span>}>
            <CartLink className={cn(actionClass, "px-1")} />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
