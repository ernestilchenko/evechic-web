import { env } from "@/lib/env";

import type { ApiEnvelope, Paginated } from "./types";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly data: unknown = null,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type QueryValue = string | number | boolean | null | undefined | Array<string | number>;

export type RequestOptions = Omit<RequestInit, "body"> & {
  query?: Record<string, QueryValue>;
  body?: unknown;
  baseUrl?: string;
};

function buildUrl(baseUrl: string, path: string, query?: Record<string, QueryValue>) {
  const url = new URL(
    `${baseUrl.replace(/\/$/, "")}/${baseUrl.startsWith("/") ? path.replace(/^\/|\/$/g, "") : path.replace(/^\//, "")}`,
    typeof window === "undefined" ? env.siteUrl : window.location.origin,
  );
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "" || value === false) return;
    url.searchParams.set(key, Array.isArray(value) ? value.join(",") : String(value));
  });
  return url.toString();
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<ApiEnvelope<T>> {
  const { query, body, baseUrl, headers, ...init } = options;
  const isServer = typeof window === "undefined";
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const response = await fetch(
    buildUrl(baseUrl ?? (isServer ? env.serverApiUrl : env.publicApiUrl), path, query),
    {
      ...init,
      headers: {
        Accept: "application/json",
        ...(body !== undefined && !isFormData ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
    },
  );

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!response.ok || payload === null) {
    throw new ApiError(payload?.message ?? response.statusText, response.status, payload?.data ?? null);
  }
  return payload;
}

export async function apiFetch<T>(path: string, options?: RequestOptions): Promise<T> {
  return (await request<T>(path, options)).data;
}

export async function apiFetchPaginated<T>(path: string, options?: RequestOptions): Promise<Paginated<T>> {
  const payload = await request<T[]>(path, options);
  return {
    items: payload.data,
    pagination: payload.pagination ?? {
      count: payload.data.length,
      page: 1,
      page_size: payload.data.length,
      total_pages: 1,
    },
  };
}

export function isNotFound(error: unknown) {
  return error instanceof ApiError && error.status === 404;
}
