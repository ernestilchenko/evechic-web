import { apiFetch, ApiError } from "@/lib/api/client";

import { PROXY_BASE_URL } from "../constants/session";
import type { SessionUser } from "../types";

export async function fetchSessionUser(): Promise<SessionUser | null> {
  try {
    return await apiFetch<SessionUser>("account/me/", { baseUrl: PROXY_BASE_URL });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}
