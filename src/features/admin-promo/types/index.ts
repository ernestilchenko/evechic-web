import type { components } from "@/lib/api/schema";

type Schemas = components["schemas"];

export type PromoRow = Schemas["PromoCodeList"];
export type PromoDetail = Schemas["PromoCodeDetail"];
export type PromoWrite = Schemas["PromoCodeWriteRequest"];
export type PromoState = Schemas["StateEnum"];
export type DiscountType = Schemas["DiscountTypeEnum"];
export type ActiveFilter = "" | "true" | "false";
