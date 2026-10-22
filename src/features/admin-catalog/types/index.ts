import type { components } from "@/lib/api/schema";

type Schemas = components["schemas"];

export type AdminCategory = Schemas["AdminCategory"];
export type AdminColor = Schemas["AdminColor"];
export type ColorWrite = Schemas["ColorWriteRequest"];

export type CategoryDraft = {
  name: string;
  slug: string;
  parent: string;
  sort_order: string;
  is_active: boolean;
  image: File | null;
};

export type CategoryNode = AdminCategory & { depth: number };
