import { routes } from "@/data/routes";

const ORIGIN = "http://evechic.local";

export function safeNextPath(value: string | null | undefined): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return null;
  try {
    const url = new URL(value, ORIGIN);
    if (url.origin !== ORIGIN) return null;
    if (url.pathname === routes.login || url.pathname.startsWith(`${routes.login}/`)) return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

export function withNext(path: string, next: string | null | undefined) {
  const safe = safeNextPath(next);
  return safe ? `${path}?next=${encodeURIComponent(safe)}` : path;
}

export function loginPath(next?: string | null) {
  return withNext(routes.login, next);
}
