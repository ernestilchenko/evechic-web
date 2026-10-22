import "server-only";

import { cookies } from "next/headers";

import { SESSION_COOKIE } from "../constants/session";
import type { SessionUser } from "../types";

import { backendUrl, decodeSession } from "./session";

export async function getSessionUser(): Promise<SessionUser | null> {
  const access = decodeSession((await cookies()).get(SESSION_COOKIE)?.value)?.access;
  if (!access) return null;

  const response = await fetch(backendUrl("account/me/"), {
    headers: { Authorization: `Bearer ${access}`, Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) return null;
  return ((await response.json()) as { data: SessionUser }).data;
}
