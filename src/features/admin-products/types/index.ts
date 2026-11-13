import type { components } from "@/lib/api/schema";

type Schemas = components["schemas"];

export type ProductRow = Schemas["AdminProductRow"];
export type ProductTabCounts = Schemas["AdminProductTabCounts"];
export type Product = Schemas["AdminProductDetail"];
export type ProductImage = Schemas["AdminProductImage"];
export type ProductImageUpdate = Schemas["PatchedProductImageUpdateRequest"];
export type ProductVariant = Schemas["ProductVariant"];
export type ProductWrite = Schemas["ProductWriteRequest"];
export type ProductStatus = Schemas["ProductStatusEnum"];
export type StockState = Schemas["StockStateEnum"];
export type VariantWrite = Schemas["VariantWriteRequest"];
export type BulkStatusResult = Schemas["BulkStatusResult"];
export type AdminCategory = Schemas["AdminCategory"];
export type AdminColor = Schemas["AdminColor"];

export type ProductTab = keyof ProductTabCounts;

export type ProductListParams = {
  tab: ProductTab;
  q: string;
  category: number | null;
  page: number;
};

export type ProductListResult = {
  items: ProductRow[];
  counts: ProductTabCounts;
};
