import { PROXY_BASE_URL } from "@/features/auth";
import { routes } from "@/data/routes";
import { apiFetch, apiFetchPaginated, ApiError, type RequestOptions } from "@/lib/api/client";
import type { Pagination } from "@/lib/api/types";

export type AdminPage<T> = { data: T; pagination: Pagination };

function redirectToLogin() {
  if (typeof window === "undefined") return;
  const target = new URL(routes.login, window.location.origin);
  target.searchParams.set("next", `${window.location.pathname}${window.location.search}`);
  window.location.assign(target.toString());
}

async function guard<T>(promise: Promise<T>): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) redirectToLogin();
    throw error;
  }
}

function adminPath(path: string) {
  return `admin/${path.replace(/^\//, "").replace(/\/$/, "")}`;
}

export function adminFetch<T>(path: string, options: RequestOptions = {}) {
  return guard(apiFetch<T>(adminPath(path), { ...options, baseUrl: PROXY_BASE_URL }));
}

export async function adminFetchPage<T>(path: string, options: RequestOptions = {}): Promise<AdminPage<T>> {
  const result = await guard(
    apiFetchPaginated<unknown>(adminPath(path), { ...options, baseUrl: PROXY_BASE_URL }),
  );
  return { data: result.items as unknown as T, pagination: result.pagination };
}
