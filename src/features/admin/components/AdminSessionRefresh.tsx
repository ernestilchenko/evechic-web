"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { PROXY_BASE_URL } from "@/features/auth";
import { routes } from "@/data/routes";

import { AdminShellFallback } from "./AdminShellFallback";

export function AdminSessionRefresh() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    fetch(`${PROXY_BASE_URL}/account/me`, { headers: { Accept: "application/json" } })
      .then((response) => {
        if (cancelled) return;
        if (response.ok) {
          router.refresh();
          return;
        }
        const target = new URL(routes.login, window.location.origin);
        target.searchParams.set("next", window.location.pathname);
        window.location.replace(target.toString());
      })
      .catch(() => null);
    return () => {
      cancelled = true;
    };
  }, [router]);

  return <AdminShellFallback />;
}
