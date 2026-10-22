import type { components } from "./schema";

type Schemas = components["schemas"];

export type ApiEnvelope<T> = {
  data: T;
  message: string;
  status: number;
  pagination?: Pagination;
};

export type Pagination = {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
};

export type Paginated<T> = {
  items: T[];
  pagination: Pagination;
};

export type ProductCard = Schemas["ProductCard"];
export type ProductDetail = Schemas["ProductDetail"];
export type ProductFilters = Schemas["ProductFilters"];
export type CategoryTree = Schemas["CategoryTree"];
export type Color = Schemas["Color"];
export type ProductVariant = Schemas["ProductVariant"];
export type ProductImage = Schemas["ProductImage"];
export type CategoryFacet = Schemas["CategoryFacet"];
export type ProductReview = Schemas["ProductReview"];
export type ProductReviewList = Schemas["ProductReviewList"];
export type ReviewSummary = Schemas["ReviewSummary"];
export type ReviewCreateRequest = Schemas["ReviewCreateRequest"];
export type Cart = Schemas["Cart"];
export type CartItem = Schemas["CartItem"];
export type CartTotals = Schemas["CartTotals"];
export type User = Schemas["User"];
export type ProfileUpdate = Schemas["PatchedProfileUpdateRequest"];
export type AccountSummary = Schemas["AccountSummary"];
export type AccountOrder = Schemas["AccountOrderList"];
export type OrderDetail = Schemas["OrderDetail"];
export type OrderItem = Schemas["OrderItem"];
export type OrderStatus = Schemas["OrderStatusEnum"];
export type OrderRepeatResult = Schemas["OrderRepeatResult"];
export type PaymentLink = Schemas["PaymentLink"];
export type Address = Schemas["Address"];
export type AddressInput = Schemas["AddressRequest"];
export type DeliveryMethod = Schemas["DeliveryMethodEnum"];
export type PaymentMethod = Schemas["PaymentMethodEnum"];
export type PaymentStatus = Schemas["PaymentStatusEnum"];
export type CheckoutRequest = Schemas["CheckoutRequest"];
export type CheckoutResult = Schemas["CheckoutResult"];
