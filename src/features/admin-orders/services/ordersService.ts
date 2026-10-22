import { adminFetch, adminFetchPage } from "@/features/admin";
import type { OrderStatus } from "@/features/admin";

import { ORDERS_PAGE_SIZE } from "../constants/orders";
import type {
  AdminOrder,
  AdminOrderCreate,
  AdminOrderUpdate,
  CheckoutResult,
  OrderListParams,
  OrderListResult,
  ProductDetail,
  ProductRow,
} from "../types";

export function fetchOrders({ status, q, page }: OrderListParams) {
  return adminFetchPage<OrderListResult>("orders", {
    query: { status: status === "all" ? undefined : status, q, page, page_size: ORDERS_PAGE_SIZE },
  });
}

export function fetchOrder(number: number) {
  return adminFetch<AdminOrder>(`orders/${number}`);
}

export function changeOrderStatus(number: number, status: OrderStatus) {
  return adminFetch<AdminOrder>(`orders/${number}/status`, { method: "POST", body: { status } });
}

export function updateOrder(number: number, body: AdminOrderUpdate) {
  return adminFetch<AdminOrder>(`orders/${number}/update`, { method: "PATCH", body });
}

export function createOrder(body: AdminOrderCreate) {
  return adminFetch<CheckoutResult>("orders/create", { method: "POST", body });
}

export async function searchProducts(q: string) {
  const page = await adminFetchPage<{ items: ProductRow[] }>("products", { query: { q, page_size: 8 } });
  return page.data.items;
}

export function fetchProductVariants(id: number) {
  return adminFetch<ProductDetail>(`products/${id}`);
}
