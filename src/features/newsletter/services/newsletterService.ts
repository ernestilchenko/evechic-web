import { apiFetch } from "@/lib/api/client";

export function subscribeToNewsletter(email: string) {
  return apiFetch<{ email: string; welcome_promo_sent: boolean }>("newsletter/subscribe/", {
    method: "POST",
    body: { email },
  });
}

export function unsubscribeFromNewsletter(token: string) {
  return apiFetch<{ email: string }>("newsletter/unsubscribe/", { method: "POST", body: { token } });
}
