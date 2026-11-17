import { routes } from "@/data/routes";
import type { MessageKey } from "@/lib/i18n";

export type AdminNavItem = {
  href: string;
  label: MessageKey;
  badge?: "new_orders" | "pending_reviews";
  exact?: boolean;
};

export const adminNavigation: AdminNavItem[] = [
  { href: routes.admin.dashboard, label: "admin.nav.dashboard", exact: true },
  { href: routes.admin.orders, label: "admin.nav.orders", badge: "new_orders" },
  { href: routes.admin.products, label: "admin.nav.products" },
  { href: routes.admin.categories, label: "admin.nav.categories" },
  { href: routes.admin.customers, label: "admin.nav.customers" },
  { href: routes.admin.promoCodes, label: "admin.nav.promoCodes" },
  { href: routes.admin.giftCards, label: "admin.nav.giftCards" },
  { href: routes.admin.reviews, label: "admin.nav.reviews", badge: "pending_reviews" },
  { href: routes.admin.content, label: "admin.nav.content" },
  { href: routes.admin.analytics, label: "admin.nav.analytics" },
];
