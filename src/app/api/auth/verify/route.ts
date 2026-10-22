import { NextResponse, type NextRequest } from "next/server";

import { backendUrl, setSessionCookies, type TokenPair } from "@/features/auth/server/session";

type VerifyPayload = {
  data: TokenPair & { is_new: boolean; user: unknown };
  message: string;
  status: number;
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const backendResponse = await fetch(backendUrl("auth/code/verify/"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body,
    cache: "no-store",
  });
  const payload = (await backendResponse.json().catch(() => null)) as VerifyPayload | null;

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
