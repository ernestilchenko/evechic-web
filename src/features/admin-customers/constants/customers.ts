import type { CustomerSort } from "../types";

export const CUSTOMER_SORTS: CustomerSort[] = ["recent", "orders", "spent"];
export const CUSTOMERS_PAGE_SIZE = 20;

export const customerKeys = {
  all: ["admin", "customers"] as const,
  list: (params: object) => ["admin", "customers", "list", params] as const,
  detail: (id: number) => ["admin", "customers", "detail", id] as const,
};
