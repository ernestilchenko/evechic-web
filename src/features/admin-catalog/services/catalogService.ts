import { adminFetch } from "@/features/admin";

import type { AdminCategory, AdminColor, CategoryDraft, ColorWrite } from "../types";

export function fetchCategories() {
  return adminFetch<AdminCategory[]>("categories");
}

function categoryForm(draft: CategoryDraft) {
  const body = new FormData();
  body.append("name", draft.name.trim());
  if (draft.slug.trim()) body.append("slug", draft.slug.trim());
  body.append("parent", draft.parent);
  body.append("sort_order", draft.sort_order || "0");
  body.append("is_active", draft.is_active ? "true" : "false");
  if (draft.image) body.append("image", draft.image);
  return body;
}

export function saveCategory(id: number | null, draft: CategoryDraft) {
  return id === null
    ? adminFetch<AdminCategory>("categories/create", { method: "POST", body: categoryForm(draft) })
    : adminFetch<AdminCategory>(`categories/${id}/update`, { method: "PATCH", body: categoryForm(draft) });
}

export function deleteCategory(id: number) {
  return adminFetch<null>(`categories/${id}/delete`, { method: "DELETE" });
}

export function fetchColors() {
  return adminFetch<AdminColor[]>("colors");
}

export function saveColor(id: number | null, body: ColorWrite) {
  return id === null
    ? adminFetch<AdminColor>("colors/create", { method: "POST", body })
    : adminFetch<AdminColor>(`colors/${id}/update`, { method: "PATCH", body });
}

export function deleteColor(id: number) {
  return adminFetch<null>(`colors/${id}/delete`, { method: "DELETE" });
}
