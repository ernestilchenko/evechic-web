import { PROXY_BASE_URL } from "@/features/auth/constants/session";

import { currentSession, peekSessionId, visitorId } from "../utils/ids";

export type TrackKind = "page_view" | "product_view" | "add_to_cart" | "checkout_start";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;

export function track(kind: TrackKind, options: { productId?: number } = {}) {
  if (typeof window === "undefined") return;
  try {
    const session = currentSession();
    const params = new URLSearchParams(window.location.search);
    const body: Record<string, unknown> = {
      session_id: session.id,
      visitor_id: visitorId(),
      kind,
      path: window.location.pathname,
      product_id: options.productId ?? null,
    };
    if (session.isNew) {
      body.referrer = document.referrer;
      UTM_KEYS.forEach((key) => {
        const value = params.get(key);
        if (value) body[key] = value;
      });
    }
    void fetch(`${PROXY_BASE_URL}/analytics/collect`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => undefined);
  } catch {}
}

export function analyticsHeaders(): Record<string, string> {
  const id = peekSessionId();
  return id ? { "X-Analytics-Session": id } : {};
}
