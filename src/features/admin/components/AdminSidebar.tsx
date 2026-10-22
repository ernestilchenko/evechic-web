"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";

import { adminNavigation } from "../constants/navigation";
import { useBadges } from "../hooks/useBadges";
import type { AdminUser } from "../types";
import { LogoutButton } from "./LogoutButton";

type AdminSidebarProps = {
  user: AdminUser;
  onNavigate?: () => void;
  className?: string;
};

export function AdminSidebar({ user, onNavigate, className }: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: badges } = useBadges();

  return (
    <div className={cn("bg-ink flex flex-col gap-1.5 overflow-y-auto px-[18px] py-[30px]", className)}>
      <Link
        href={routes.admin.dashboard}
        onClick={onNavigate}
        className="flex flex-col gap-1.5 pb-[30px] pl-3"
      >
        <span className="text-cream font-serif text-[24px] leading-none font-light tracking-[0.3em]">
          EVECHIC
        </span>
        <span className="text-gold text-[8.5px] font-semibold tracking-[0.24em] uppercase">
          {t("admin.brand.panel")}
        </span>
      </Link>
      <nav aria-label={t("admin.nav.label")}>
        <ul className="flex flex-col gap-1.5">
          {adminNavigation.map((item) => {
            const path = item.href.split("?")[0];
            const active =
              !item.href.includes("?") && (item.exact ? pathname === path : pathname.startsWith(path));
            const count = item.badge ? (badges?.[item.badge] ?? 0) : 0;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center rounded px-3.5 py-[13px] text-[12.5px] transition-colors",
                    active
                      ? "bg-admin-nav-active text-cream font-semibold"
                      : "text-admin-nav hover:bg-admin-nav-active/60 hover:text-cream",
                  )}
                >
                  <span className="flex-1">{t(item.label)}</span>
                  {count > 0 ? (
                    <span className="bg-gold text-ink rounded-full px-2 py-[3px] text-[9.5px] leading-none font-semibold">
                      <span className="sr-only">{t("admin.nav.badgeLabel")}: </span>
                      {count}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="min-h-6 flex-1" />
      <div className="border-admin-nav-active flex items-center gap-3 border-t pt-[18px] pl-3">
        <span
          aria-hidden
          className="bg-gold text-ink flex size-[34px] shrink-0 items-center justify-center rounded-full text-[13px] font-semibold"
        >
          {user.name.charAt(0).toUpperCase()}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <span className="text-cream truncate text-[12px] font-semibold">{user.name}</span>
          <span className="text-admin-nav-muted text-[10.5px]">{t(`admin.roles.${user.role}`)}</span>
        </div>
        <LogoutButton className="text-admin-nav hover:text-cream" />
      </div>
    </div>
  );
}
