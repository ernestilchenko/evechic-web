import type { DeliveryMethod, PaymentMethod } from "@/lib/api/types";

export const DELIVERY_METHODS: DeliveryMethod[] = ["np_branch", "np_locker", "np_courier"];

export const PAYMENT_METHODS: PaymentMethod[] = ["card"];

export const FIELD_ORDER = [
  "first_name",
  "last_name",
  "phone",
  "email",
  "city",
  "delivery_point",
  "street",
] as const;

export const FIELD_LIMITS = {
  first_name: 100,
  last_name: 100,
  city: 120,
  delivery_point: 255,
  street: 255,
} as const;

export const LAST_ORDER_STORAGE_KEY = "evechic.last-order";

export const savedAddressesQueryKey = ["account", "addresses"] as const;

export const orderQueryKey = (number: number) => ["account", "orders", number] as const;
