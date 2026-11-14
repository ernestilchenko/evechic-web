"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { adminFetch } from "@/features/admin";

import type { AnalyticsOverview } from "./types";

export function useAnalytics(days: number) {
  return useQuery({
    queryKey: ["admin", "analytics", days],
    queryFn: () => adminFetch<AnalyticsOverview>("analytics", { query: { days } }),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}
