"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { mainNavigation } from "@/data/navigation";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? t("layout.actions.closeMenu") : t("layout.actions.openMenu")}
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-10 flex-col items-center justify-center gap-[5px]"
      >
        <span className={cn("bg-ink h-px w-5 transition", open && "translate-y-[3px] rotate-45")} />
        <span className={cn("bg-ink h-px w-5 transition", open && "-translate-y-[3px] -rotate-45")} />
      </button>
      <nav
        id="mobile-menu"
        aria-label={t("layout.nav.label")}
        hidden={!open}
        className="bg-cream fixed inset-x-0 top-[var(--header-offset,138px)] bottom-0 z-40 overflow-y-auto px-6 py-8"
      >
        <ul className="flex flex-col gap-6">
          {mainNavigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn("font-serif text-3xl font-light", item.accent && "text-sale")}
              >
                {t(item.labelKey)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
