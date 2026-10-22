"use client";

import Link from "next/link";

import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";

import { useCart } from "../hooks/useCart";

export function CartLink({ className }: { className?: string }) {
  const { itemsCount } = useCart();

  return (
    <Link href={routes.cart} className={className}>
      {itemsCount > 0 ? t("layout.actions.cartWithCount", { count: itemsCount }) : t("layout.actions.cart")}
    </Link>
  );
}
