import "server-only";

import type { NextResponse } from "next/server";

import { env } from "@/lib/env";

import { SESSION_COOKIE, SESSION_MAX_AGE } from "../constants/session";

export type TokenPair = { access: string; refresh: string };

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export function encodeSession(tokens: TokenPair) {
  return Buffer.from(JSON.stringify(tokens)).toString("base64url");
}

export function decodeSession(value: string | undefined): TokenPair | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Partial<TokenPair>;
    return parsed.access && parsed.refresh ? { access: parsed.access, refresh: parsed.refresh } : null;
  } catch {
    return null;
  }
}

export function setSessionCookies(response: NextResponse, tokens: TokenPair) {
  response.cookies.set(SESSION_COOKIE, encodeSession(tokens), { ...cookieOptions, maxAge: SESSION_MAX_AGE });
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.delete(SESSION_COOKIE);
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
