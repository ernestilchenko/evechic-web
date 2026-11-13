"use client";

import Link from "next/link";

import { routes } from "@/data/routes";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";

import { useCart } from "../hooks/useCart";

export function CartLink({ className }: { className?: string }) {
  const { itemsCount } = useCart();

  return (
    <Link href={routes.cart} className={cn("whitespace-nowrap", className)}>
      {t("layout.actions.cart")}
      {itemsCount > 0 ? (
        <>
          <span className="sr-only"> ({itemsCount})</span>
          <span
            aria-hidden
            className="bg-ink text-cream ml-1.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] tracking-normal"
          >
            {itemsCount}
          </span>
        </>
      ) : null}
    </Link>
  );
}
