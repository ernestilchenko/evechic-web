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
export type Cart = Schemas["Cart"];
export type CartItem = Schemas["CartItem"];
export type CartTotals = Schemas["CartTotals"];
