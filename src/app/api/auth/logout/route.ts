import { NextResponse, type NextRequest } from "next/server";

import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/features/auth/constants/session";
import { backendUrl, clearSessionCookies } from "@/features/auth/server/session";

export async function POST(request: NextRequest) {
  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;

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
