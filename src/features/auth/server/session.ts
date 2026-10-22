import "server-only";

import type { NextResponse } from "next/server";

import { env } from "@/lib/env";

import { ACCESS_COOKIE, ACCESS_MAX_AGE, REFRESH_COOKIE, REFRESH_MAX_AGE } from "../constants/session";

export type TokenPair = { access: string; refresh: string };

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export function setSessionCookies(response: NextResponse, tokens: TokenPair) {
  response.cookies.set(ACCESS_COOKIE, tokens.access, { ...cookieOptions, maxAge: ACCESS_MAX_AGE });
  response.cookies.set(REFRESH_COOKIE, tokens.refresh, { ...cookieOptions, maxAge: REFRESH_MAX_AGE });
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.delete(ACCESS_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
}

export function backendUrl(path: string, search = "") {
  return `${env.serverApiUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}${search}`;
}

export async function refreshTokens(refresh: string): Promise<TokenPair | null> {
  const response = await fetch(backendUrl("auth/refresh/"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ refresh }),
    cache: "no-store",
  });
  if (!response.ok) return null;
  const payload = (await response.json()) as { data: TokenPair };
  return payload.data;
}
