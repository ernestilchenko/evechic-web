import { apiFetch } from "@/lib/api/client";

import { AUTH_BASE_URL } from "../constants/auth";
import { PROXY_BASE_URL } from "../constants/session";
import type { SessionUser } from "../types";

export type CodeRequestResult = { email: string; expires_in: number; retry_after: number };

export type VerifyInput = { email: string; code: string; cart_token?: string | null };

export type VerifyResult = { is_new: boolean; user: SessionUser };

export type OnboardingInput = {
  first_name: string;
  preferred_size?: string;
  marketing_consent: boolean;
};

export type OnboardingResult = { user: SessionUser; welcome_promo_sent: boolean };

export function requestLoginCode(email: string) {
  return apiFetch<CodeRequestResult>("auth/code/request/", {
    baseUrl: PROXY_BASE_URL,
    method: "POST",
    body: { email },
  });
}

export function verifyLoginCode(input: VerifyInput) {
  return apiFetch<VerifyResult>("verify", { baseUrl: AUTH_BASE_URL, method: "POST", body: input });
}

export type GoogleLoginInput = { credential: string; cart_token?: string | null };

export function googleLogin(input: GoogleLoginInput) {
  return apiFetch<VerifyResult>("google", { baseUrl: AUTH_BASE_URL, method: "POST", body: input });
}

export function logout() {
  return apiFetch<null>("logout", { baseUrl: AUTH_BASE_URL, method: "POST" });
}

export function completeOnboarding(input: OnboardingInput) {
  return apiFetch<OnboardingResult>("auth/onboarding/", {
    baseUrl: PROXY_BASE_URL,
    method: "POST",
    body: input,
  });
}
