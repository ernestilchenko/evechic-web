import { loginPath, PROXY_BASE_URL } from "@/features/auth";
import { ApiError, apiFetch, apiFetchPaginated, type RequestOptions } from "@/lib/api/client";
import type {
  AccountOrder,
  AccountSummary,
  Address,
  AddressInput,
  OrderDetail,
  OrderRepeatResult,
  PaymentLink,
  ProfileUpdate,
  User,
} from "@/lib/api/types";

import { ORDERS_PAGE_SIZE, type OrderPeriod } from "../constants/account";

function redirectToLogin() {
  if (typeof window === "undefined") return;
  window.location.assign(loginPath(`${window.location.pathname}${window.location.search}`));
}

async function guarded<T>(request: Promise<T>) {
  try {
    return await request;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirectToLogin();
    throw error;
  }
}

function accountFetch<T>(path: string, options: RequestOptions = {}) {
  return guarded(apiFetch<T>(path, { ...options, baseUrl: PROXY_BASE_URL }));
}

export function fetchAccountSummary() {
  return accountFetch<AccountSummary>("account/summary/");
}

export function fetchOrders(period: OrderPeriod, page: number) {
  return guarded(
    apiFetchPaginated<AccountOrder>("account/orders/", {
      baseUrl: PROXY_BASE_URL,
      query: { period, page, page_size: ORDERS_PAGE_SIZE },
    }),
  );
}

export function fetchOrder(number: string) {
  return accountFetch<OrderDetail>(`account/orders/${encodeURIComponent(number)}/`);
}

export function repeatOrder(number: number | string) {
  return accountFetch<OrderRepeatResult>(`account/orders/${number}/repeat/`, { method: "POST" });
}

export function cancelOrder(number: number | string) {
  return accountFetch<OrderDetail>(`account/orders/${number}/cancel/`, { method: "POST" });
}

export function requestOrderReturn(number: number | string, reason: string) {
  return accountFetch<OrderDetail>(`account/orders/${number}/return/`, {
    method: "POST",
    body: { reason },
  });
}

export function payOrder(number: number | string) {
  return accountFetch<PaymentLink>(`orders/${number}/pay/`, { method: "POST" });
}

export function updateProfile(input: ProfileUpdate) {
  return accountFetch<User>("account/me/update/", { method: "PATCH", body: input });
}

export function fetchAddresses() {
  return accountFetch<Address[]>("account/addresses/");
}

export function createAddress(input: AddressInput) {
  return accountFetch<Address>("account/addresses/create/", { method: "POST", body: input });
}

export function updateAddress(id: number, input: Partial<AddressInput>) {
  return accountFetch<Address>(`account/addresses/${id}/update/`, { method: "PATCH", body: input });
}

export function deleteAddress(id: number) {
  return accountFetch<null>(`account/addresses/${id}/delete/`, { method: "DELETE" });
}

export function makeDefaultAddress(id: number) {
  return accountFetch<Address>(`account/addresses/${id}/make-default/`, { method: "POST" });
}
