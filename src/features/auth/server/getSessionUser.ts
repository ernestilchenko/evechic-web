import "server-only";

import { cookies } from "next/headers";

import { ACCESS_COOKIE } from "../constants/session";
import type { SessionUser } from "../types";

import { backendUrl } from "./session";

export async function getSessionUser(): Promise<SessionUser | null> {
  const access = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!access) return null;

  const response = await fetch(backendUrl("account/me/"), {
    headers: { Authorization: `Bearer ${access}`, Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) return null;
  return ((await response.json()) as { data: SessionUser }).data;
}
