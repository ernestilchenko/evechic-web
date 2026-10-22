import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/features/auth/constants/session";
import { backendUrl, clearSessionCookies, decodeSession } from "@/features/auth/server/session";

export async function POST(request: NextRequest) {
  const session = decodeSession(request.cookies.get(SESSION_COOKIE)?.value);
  const access = session?.access;
  const refresh = session?.refresh;

  if (access && refresh) {
    await fetch(backendUrl("auth/logout/"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
      body: JSON.stringify({ refresh }),
      cache: "no-store",
    }).catch(() => null);
  }

  const response = NextResponse.json({ data: null, message: "Logged out", status: 200 });
  clearSessionCookies(response);
  return response;
}
