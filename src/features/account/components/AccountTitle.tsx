"use client";

import { usePathname } from "next/navigation";

import { useSession } from "@/features/auth";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";

function useAccountTitle() {
  const pathname = usePathname();
  const { user } = useSession();

  const orderMatch = pathname.match(/^\/account\/orders\/([^/]+)/);
  if (orderMatch) return t("account.orders.number", { number: decodeURIComponent(orderMatch[1]) });
  if (pathname.startsWith(routes.accountFavorites)) return t("account.titles.favorites");
  if (pathname.startsWith(routes.accountProfile)) return t("account.titles.profile");
  if (pathname.startsWith(routes.accountAddresses)) return t("account.titles.addresses");
  if (pathname.startsWith(routes.accountBonuses)) return t("account.titles.bonuses");
  return user?.first_name ? t("account.greeting", { name: user.first_name }) : t("account.greetingAnonymous");
}

export function AccountTitle() {
  return <h1 className="font-serif text-[40px] leading-tight font-light sm:text-5xl">{useAccountTitle()}</h1>;
}
