import { analyticsHeaders } from "@/features/analytics";
import { PROXY_BASE_URL } from "@/features/auth";
import { cartTokenHeaders } from "@/features/cart";
import { apiFetch } from "@/lib/api/client";
import type { Address, CheckoutRequest, CheckoutResult, OrderDetail, PaymentLink } from "@/lib/api/types";

export function placeOrder(payload: CheckoutRequest) {
  return apiFetch<CheckoutResult>("orders/checkout/", {
    method: "POST",
    body: payload,
    baseUrl: PROXY_BASE_URL,
    headers: { ...cartTokenHeaders(), ...analyticsHeaders() },
  });
}

export function fetchSavedAddresses() {
  return apiFetch<Address[]>("account/addresses/", { baseUrl: PROXY_BASE_URL });
}

export function fetchAccountOrder(number: number) {
  return apiFetch<OrderDetail>(`account/orders/${number}/`, { baseUrl: PROXY_BASE_URL });
}

export function payOrder(number: number) {
  return apiFetch<PaymentLink>(`orders/${number}/pay/`, { method: "POST", baseUrl: PROXY_BASE_URL });
}
