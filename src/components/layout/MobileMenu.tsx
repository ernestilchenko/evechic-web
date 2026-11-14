"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { footerHelpLinks, mainNavigation } from "@/data/navigation";
import { routes } from "@/data/routes";
import { siteConfig } from "@/data/site";
import { useSession } from "@/features/auth";
import { useCart } from "@/features/cart";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const secondaryLinkClass = "flex min-h-11 items-center text-[14px]";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [top, setTop] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const { isAuthenticated } = useSession();
  const { itemsCount } = useCart();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const header = buttonRef.current?.closest("header");
    const update = () => setTop(header?.getBoundingClientRect().bottom ?? 0);
    update();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("resize", update);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", update);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const [openedOn, setOpenedOn] = useState(pathname);
  if (openedOn !== pathname) {
    setOpenedOn(pathname);
    setOpen(false);
  }

  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? t("layout.actions.closeMenu") : t("layout.actions.openMenu")}
        onClick={() => setOpen((value) => !value)}
        className="-ml-2.5 flex size-11 flex-col items-center justify-center gap-[5px]"
      >
        <span className={cn("bg-ink h-px w-5 transition", open && "translate-y-[3px] rotate-45")} />
        <span className={cn("bg-ink h-px w-5 transition", open && "-translate-y-[3px] -rotate-45")} />
      </button>
      <div
        id="mobile-menu"
        hidden={!open}
        style={{ top }}
        className="bg-cream fixed inset-x-0 bottom-0 z-40 overflow-y-auto overscroll-contain px-6 pt-6 pb-[max(2rem,env(safe-area-inset-bottom))]"
      >
        <form action={routes.search} role="search" onSubmit={close} className="border-ink flex border-b">
          <label htmlFor="mobile-menu-search" className="sr-only">
            {t("layout.actions.search")}
          </label>
          <input
            id="mobile-menu-search"
            type="search"
            name="q"
            enterKeyHint="search"
            placeholder={t("layout.mobile.searchPlaceholder")}
            className="placeholder:text-placeholder h-12 min-w-0 flex-1 bg-transparent text-base outline-none"
          />
          <button type="submit" className="caps px-1">
            {t("layout.actions.search")}
          </button>
        </form>

        <nav aria-label={t("layout.nav.label")} className="pt-6">
          <ul className="flex flex-col">
            {mainNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  className={cn(
                    "flex min-h-14 items-center font-serif text-3xl font-light",
                    item.accent && "text-sale",
                  )}
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-line mt-6 flex flex-col border-t pt-4">
          <Link
            href={isAuthenticated ? routes.account : routes.login}
            onClick={close}
            className={secondaryLinkClass}
          >
            {isAuthenticated ? t("layout.mobile.account") : t("layout.mobile.login")}
          </Link>
          {isAuthenticated ? (
            <Link href={routes.accountFavorites} onClick={close} className={secondaryLinkClass}>
              {t("layout.mobile.favorites")}
            </Link>
          ) : null}
          <Link href={routes.cart} onClick={close} className={secondaryLinkClass}>
            {itemsCount > 0
              ? t("layout.actions.cartWithCount", { count: itemsCount })
              : t("layout.actions.cart")}
          </Link>
        </div>

        <nav aria-label={t("footer.help")} className="border-line mt-4 border-t pt-4">
          <ul className="flex flex-col">
            {footerHelpLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={close} className={cn(secondaryLinkClass, "text-muted")}>
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={`tel:${siteConfig.phone}`}
          className="border-line mt-4 flex min-h-11 items-center border-t pt-4 text-[14px] font-medium"
        >
          {siteConfig.phoneDisplay}
        </a>
      </div>
    </div>
  );
}
