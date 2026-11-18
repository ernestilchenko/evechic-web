import type { NextRequest } from "next/server";

import { proxyLogin } from "@/features/auth/server/proxyLogin";

export function POST(request: NextRequest) {
  return proxyLogin(request, "auth/code/verify/");
}
