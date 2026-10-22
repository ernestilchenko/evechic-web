import { routes } from "@/data/routes";
import type { MessageKey } from "@/lib/i18n";
import type { DeliveryMethod, OrderStatus } from "@/lib/api/types";

export const ORDERS_PAGE_SIZE = 10;

export const ORDER_PERIODS = ["all", "30d", "6m", "1y"] as const;
export type OrderPeriod = (typeof ORDER_PERIODS)[number];

export const accountQueryKeys = {
  all: ["account"] as const,
  summary: ["account", "summary"] as const,
  orders: (period: OrderPeriod) => ["account", "orders", period] as const,
  order: (number: string) => ["account", "order", number] as const,
  addresses: ["account", "addresses"] as const,
};

export const orderStatusTone: Record<OrderStatus, string> = {
  new: "border-ink text-ink",
  packed: "border-muted text-muted",
  shipped: "border-gold text-gold",
  completed: "border-success text-success",
  cancelled: "border-placeholder text-placeholder",
  return_requested: "border-sale text-sale",
  returned: "border-sale text-sale",
};

export const deliveryMethods: DeliveryMethod[] = ["np_branch", "np_locker", "np_courier", "pickup"];

export type AccountNavItem = {
  href: string;
  labelKey: MessageKey;
  count?: "orders" | "favorites";
};

export const accountNavigation: AccountNavItem[] = [
  { href: routes.account, labelKey: "account.nav.orders", count: "orders" },
  { href: routes.accountFavorites, labelKey: "account.nav.favorites", count: "favorites" },
  { href: routes.accountProfile, labelKey: "account.nav.profile" },
  { href: routes.accountAddresses, labelKey: "account.nav.addresses" },
  { href: routes.accountBonuses, labelKey: "account.nav.bonuses" },
];
