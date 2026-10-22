import { NextResponse, type NextRequest } from "next/server";

import { routes } from "@/data/routes";
import { REFRESH_COOKIE } from "@/features/auth/constants/session";
import { env } from "@/lib/env";

const EXISTENCE_TTL_MS = 5 * 60 * 1000;
const NOT_FOUND_REWRITE = "/__not-found";
const existenceCache = new Map<string, { exists: boolean; expiresAt: number }>();

const protectedPrefixes = ["/account", "/welcome", "/admin"];

function apiUrl(path: string) {
  return `${env.serverApiUrl.replace(/\/$/, "")}/${path}`;
}

async function productExists(slug: string) {
  const response = await fetch(apiUrl(`products/${encodeURIComponent(slug)}/`), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  }).catch(() => null);
  return !response || response.status >= 500 ? true : response.ok;
}

async function categoryExists(slug: string) {
  const response = await fetch(apiUrl("categories/"), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  }).catch(() => null);
  if (!response?.ok) return true;
  const payload = (await response.json()) as { data: { slug: string; children: { slug: string }[] }[] };
  return payload.data.some(
    (category) => category.slug === slug || category.children.some((child) => child.slug === slug),
  );
}

const resourceRoutes = [
  { kind: "product", pattern: /^\/product\/([^/]+)\/?$/, check: productExists },
  { kind: "category", pattern: /^\/catalog\/([^/]+)\/?$/, check: categoryExists },
];

async function resourceExists(kind: string, slug: string, check: (slug: string) => Promise<boolean>) {
  const key = `${kind}:${slug}`;
  const cached = existenceCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.exists;
  const exists = await check(slug);
  existenceCache.set(key, { exists, expiresAt: Date.now() + EXISTENCE_TTL_MS });
  return exists;
}

function redirectToLogin(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const loginUrl = new URL(routes.login, request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return request.cookies.has(REFRESH_COOKIE) ? NextResponse.next() : redirectToLogin(request);
  }

  for (const route of resourceRoutes) {
    const match = pathname.match(route.pattern);
    if (match && !(await resourceExists(route.kind, decodeURIComponent(match[1]), route.check))) {
      return NextResponse.rewrite(new URL(NOT_FOUND_REWRITE, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/welcome", "/admin/:path*", "/product/:slug", "/catalog/:slug"],
};
