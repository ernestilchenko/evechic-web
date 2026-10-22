import { apiFetch } from "@/lib/api/client";

export function subscribeToNewsletter(email: string) {
  return apiFetch<{ welcome_promo_sent?: boolean }>("newsletter/subscribe/", {
    method: "POST",
    body: { email },
  });
}
