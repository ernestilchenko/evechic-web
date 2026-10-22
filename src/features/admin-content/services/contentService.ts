import { adminFetch, adminFetchPage } from "@/features/admin";

import { CONTENT_PAGE_SIZE } from "../constants/content";
import type { AdminBanner, AdminFaq, AdminInstagramPost, AdminPage, AdminPageRow, FormValue } from "../types";

export function toFormData(values: Record<string, FormValue>) {
  const body = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (value instanceof File) body.append(key, value);
    else body.append(key, typeof value === "boolean" ? (value ? "true" : "false") : String(value));
  });
  return body;
}

export async function fetchBanners() {
  return (await adminFetchPage<AdminBanner[]>("content/banners", { query: { page_size: CONTENT_PAGE_SIZE } }))
    .data;
}

export function saveBanner(id: number | null, body: FormData) {
  return id === null
    ? adminFetch<AdminBanner>("content/banners/create", { method: "POST", body })
    : adminFetch<AdminBanner>(`content/banners/${id}/update`, { method: "PATCH", body });
}

export function deleteBanner(id: number) {
  return adminFetch<null>(`content/banners/${id}/delete`, { method: "DELETE" });
}

export async function fetchInstagramPosts() {
  return (
    await adminFetchPage<AdminInstagramPost[]>("content/instagram-posts", {
      query: { page_size: CONTENT_PAGE_SIZE },
    })
  ).data;
}

export function saveInstagramPost(id: number | null, body: FormData) {
  return id === null
    ? adminFetch<AdminInstagramPost>("content/instagram-posts/create", { method: "POST", body })
    : adminFetch<AdminInstagramPost>(`content/instagram-posts/${id}/update`, { method: "PATCH", body });
}

export function deleteInstagramPost(id: number) {
  return adminFetch<null>(`content/instagram-posts/${id}/delete`, { method: "DELETE" });
}

export async function fetchPages(q: string) {
  return (
    await adminFetchPage<AdminPageRow[]>("content/pages", { query: { q, page_size: CONTENT_PAGE_SIZE } })
  ).data;
}

export function fetchPage(id: number) {
  return adminFetch<AdminPage>(`content/pages/${id}`);
}

export function savePage(id: number | null, body: FormData) {
  return id === null
    ? adminFetch<AdminPage>("content/pages/create", { method: "POST", body })
    : adminFetch<AdminPage>(`content/pages/${id}/update`, { method: "PATCH", body });
}

export function deletePage(id: number) {
  return adminFetch<null>(`content/pages/${id}/delete`, { method: "DELETE" });
}

export function saveFaq(pageId: number, faqId: number | null, body: { question: string; answer: string }) {
  return faqId === null
    ? adminFetch<AdminFaq>(`content/pages/${pageId}/faq/create`, { method: "POST", body })
    : adminFetch<AdminFaq>(`content/pages/${pageId}/faq/${faqId}/update`, { method: "PATCH", body });
}

export function deleteFaq(pageId: number, faqId: number) {
  return adminFetch<null>(`content/pages/${pageId}/faq/${faqId}/delete`, { method: "DELETE" });
}

export function reorderFaq(pageId: number, ids: number[]) {
  return adminFetch<AdminFaq[]>(`content/pages/${pageId}/faq/reorder`, { method: "POST", body: { ids } });
}
