"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { useLogout } from "@/features/auth";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";

import { accountNavigation } from "../constants/account";
import { useAccountSummary } from "../hooks/useAccountQueries";

const itemClass = "flex items-center gap-3 px-[18px] py-4 text-[13px] transition-colors";

function isActive(pathname: string, href: string) {
  if (href === routes.account) return pathname === routes.account || pathname.startsWith("/account/orders");
  return pathname.startsWith(href);
}

export function AccountNav() {
  const pathname = usePathname();
  const { data: summary } = useAccountSummary();
  const logout = useLogout();
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!list || !active || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2 });
  }, [pathname]);

  return (
    <nav aria-label={t("account.nav.label")}>
      <ul
        ref={listRef}
        className="relative -mx-4 flex [scrollbar-width:none] gap-1 overflow-x-auto overscroll-x-contain px-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {accountNavigation.map((item) => {
          const active = isActive(pathname, item.href);
          const count =
            item.count === "orders"
              ? summary?.orders_count
              : item.count === "favorites"
                ? summary?.favorites_count
                : undefined;
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  itemClass,
                  "whitespace-nowrap",
                  active ? "bg-ink text-cream font-semibold" : "hover:bg-sand",
                )}
              >
                <span className="flex-1">{t(item.labelKey)}</span>
                {count !== undefined ? (
                  <span
                    className={cn(
                      "text-xs",
                      item.count === "orders"
                        ? "text-gold font-medium"
                        : active
                          ? "text-cream/70"
                          : "text-placeholder",
                    )}
                  >
                    {count}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
        <li className="shrink-0">
          <button
            type="button"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className={cn(itemClass, "hover:bg-sand w-full text-left whitespace-nowrap disabled:opacity-60")}
          >
            {logout.isPending ? t("account.nav.loggingOut") : t("account.nav.logout")}
          </button>
        </li>
      </ul>
    </nav>
  );
}
