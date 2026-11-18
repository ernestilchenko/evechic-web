import "server-only";

import { NextResponse, type NextRequest } from "next/server";

import { backendUrl, clientIpHeaders, setSessionCookies, type TokenPair } from "./session";

type LoginPayload = {
  data: TokenPair & { is_new: boolean; user: unknown };
  message: string;
  status: number;
};

export async function proxyLogin(request: NextRequest, path: string) {
  const body = await request.text();
  const backendResponse = await fetch(backendUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", ...clientIpHeaders(request) },
    body,
    cache: "no-store",
  });
  const payload = (await backendResponse.json().catch(() => null)) as LoginPayload | null;

  if (!backendResponse.ok || !payload) {
    return NextResponse.json(payload ?? { data: null, message: "Login failed", status: 502 }, {
      status: backendResponse.ok ? 502 : backendResponse.status,
    });
  }

  const { access, refresh, ...rest } = payload.data;
  const response = NextResponse.json({ ...payload, data: rest });
  setSessionCookies(response, { access, refresh });
  return response;
}
