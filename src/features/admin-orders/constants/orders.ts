import type { OrderStatus } from "@/features/admin";

import type { DeliveryMethod, OrderTab, PaymentMethod } from "../types";

export const ORDER_TABS: OrderTab[] = [
  "all",
  "new",
  "packed",
  "shipped",
  "completed",
  "cancelled",
  "return_requested",
  "returned",
];

export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  new: ["packed", "cancelled"],
  packed: ["shipped", "cancelled"],
  shipped: ["completed", "returned"],
  completed: ["return_requested"],
  cancelled: [],
  return_requested: ["returned", "completed"],
  returned: [],
};

export const DESTRUCTIVE_STATUSES: OrderStatus[] = ["cancelled", "returned"];

export const DELIVERY_METHODS: DeliveryMethod[] = ["np_branch", "np_locker", "np_courier", "pickup"];
export const PAYMENT_METHODS: PaymentMethod[] = ["card", "cod"];
export const ORDERS_PAGE_SIZE = 20;

export const orderKeys = {
  all: ["admin", "orders"] as const,
  list: (params: object) => ["admin", "orders", "list", params] as const,
  detail: (number: number) => ["admin", "orders", "detail", number] as const,
  productSearch: (q: string) => ["admin", "orders", "product-search", q] as const,
  productVariants: (id: number) => ["admin", "orders", "product-variants", id] as const,
};
