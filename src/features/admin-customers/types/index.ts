import type { components } from "@/lib/api/schema";

type Schemas = components["schemas"];

export type CustomerRow = Schemas["CustomerList"];
export type CustomerDetail = Schemas["CustomerDetail"];
export type CustomerUpdate = Schemas["PatchedCustomerUpdateRequest"];
export type CustomerSort = "recent" | "orders" | "spent";
