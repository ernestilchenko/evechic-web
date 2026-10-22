import { NextResponse, type NextRequest } from "next/server";

import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/features/auth/constants/session";
import {
  backendUrl,
  clearSessionCookies,
  refreshTokens,
  setSessionCookies,
} from "@/features/auth/server/session";

const FORWARDED_HEADERS = ["accept", "content-type", "x-cart-token"];

async function forward(request: NextRequest, path: string, body: ArrayBuffer | null, access?: string) {
  const headers = new Headers();
  FORWARDED_HEADERS.forEach((name) => {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  });
  if (access) headers.set("Authorization", `Bearer ${access}`);

  return fetch(backendUrl(`${path}/`, request.nextUrl.search), {
    method: request.method,
    headers,
    body: body && body.byteLength > 0 ? body : undefined,
    cache: "no-store",
  });
}

async function handle(request: NextRequest, context: RouteContext<"/api/proxy/[...path]">) {
  const { path } = await context.params;
  const target = path.join("/");
  const body = ["GET", "HEAD"].includes(request.method) ? null : await request.arrayBuffer();
  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;

  let backendResponse = await forward(request, target, body, access);
  let renewed: Awaited<ReturnType<typeof refreshTokens>> = null;

  if (backendResponse.status === 401 && refresh) {
    renewed = await refreshTokens(refresh);
    if (renewed) backendResponse = await forward(request, target, body, renewed.access);
  }

  const response = new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    headers: { "Content-Type": backendResponse.headers.get("Content-Type") ?? "application/json" },
  });

  if (renewed) setSessionCookies(response, renewed);
  else if (backendResponse.status === 401 && refresh) clearSessionCookies(response);
  return response;
}

export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const PUT = handle;
export const DELETE = handle;
