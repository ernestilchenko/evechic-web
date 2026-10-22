"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type Updates = Record<string, string | number | null | undefined>;

export function useUrlState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const get = useCallback((key: string) => searchParams.get(key) ?? "", [searchParams]);

  const getNumber = useCallback(
    (key: string, fallback: number) => {
      const value = Number(searchParams.get(key));
      return Number.isFinite(value) && value > 0 ? value : fallback;
    },
    [searchParams],
  );

  const set = useCallback(
    (updates: Updates) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") next.delete(key);
        else next.set(key, String(value));
      });
      if (!("page" in updates)) next.delete("page");
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return { get, getNumber, set };
}
