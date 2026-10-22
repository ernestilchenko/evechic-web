import type { CheckoutResult } from "@/lib/api/types";

import { LAST_ORDER_STORAGE_KEY } from "../constants/options";
import type { LastOrder } from "../types";

export function rememberLastOrder(order: CheckoutResult) {
  const value: LastOrder = {
    number: order.number,
    email: order.email,
    total: order.total,
    payment_method: order.payment_method,
    payment_status: order.payment_status,
    delivery_method: order.delivery_method,
    skip_confirmation_call: order.skip_confirmation_call,
    payment_started: Boolean(order.payment_url),
  };
  try {
    window.sessionStorage.setItem(LAST_ORDER_STORAGE_KEY, JSON.stringify(value));
  } catch {}
}

export function readLastOrderRaw() {
  try {
    return window.sessionStorage.getItem(LAST_ORDER_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function parseLastOrder(raw: string | null, number: number | null): LastOrder | null {
  if (!raw || number === null) return null;
  try {
    const value = JSON.parse(raw) as LastOrder;
    return value.number === number ? value : null;
  } catch {
    return null;
  }
}
