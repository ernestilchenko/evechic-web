import type { components } from "@/lib/api/schema";

type Schemas = components["schemas"];

export type AdminOrderRow = Schemas["AdminOrderList"];
export type AdminOrder = Schemas["AdminOrderDetail"];
export type AdminOrderUpdate = Schemas["PatchedAdminOrderUpdateRequest"];
export type AdminOrderCreate = Schemas["AdminOrderCreateRequest"];
export type CheckoutResult = Schemas["CheckoutResult"];
export type MonobankInvoice = Schemas["MonobankInvoice"];
export type DeliveryMethod = Schemas["DeliveryMethodEnum"];
export type PaymentMethod = Schemas["PaymentMethodEnum"];
export type PaymentStatus = Schemas["PaymentStatusEnum"];
export type InvoiceStatus = Schemas["InvoiceStatusEnum"];
export type ProductRow = Schemas["AdminProductRow"];
export type ProductDetail = Schemas["AdminProductDetail"];

export type OrderTab =
  "all" | "new" | "packed" | "shipped" | "completed" | "cancelled" | "return_requested" | "returned";

export type OrderListResult = {
  items: AdminOrderRow[];
  counts: Partial<Record<OrderTab, number>>;
};

export type OrderListParams = {
  status: OrderTab;
  q: string;
  page: number;
};

export type DraftLine = {
  variantId: number;
  productName: string;
  sku: string;
  color: string;
  size: string;
  price: string;
  stock: number;
  quantity: number;
};
