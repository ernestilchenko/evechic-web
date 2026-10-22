import { adminFetch, adminFetchPage } from "@/features/admin";

import { CUSTOMERS_PAGE_SIZE } from "../constants/customers";
import type { CustomerDetail, CustomerRow, CustomerSort, CustomerUpdate } from "../types";

export function fetchCustomers(params: { q: string; sort: CustomerSort; page: number }) {
  return adminFetchPage<CustomerRow[]>("customers", { query: { ...params, page_size: CUSTOMERS_PAGE_SIZE } });
}

export function fetchCustomer(id: number) {
  return adminFetch<CustomerDetail>(`customers/${id}`);
}

export function updateCustomer(id: number, body: CustomerUpdate) {
  return adminFetch<CustomerRow>(`customers/${id}/update`, { method: "PATCH", body });
}
