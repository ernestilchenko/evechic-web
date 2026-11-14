"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { track } from "../services/track";

const IGNORED_PREFIXES = ["/admin", "/api"];

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || IGNORED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return;
    track("page_view");
  }, [pathname]);

  return null;
}

export function TrackOnMount({
  kind,
  productId,
}: {
  kind: "product_view" | "checkout_start";
  productId?: number;
}) {
  useEffect(() => {
    track(kind, { productId });
  }, [kind, productId]);

  return null;
}
