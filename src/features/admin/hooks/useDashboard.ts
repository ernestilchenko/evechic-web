"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { adminKeys } from "../constants/queryKeys";
import { fetchDashboard } from "../services/dashboardService";

export function useDashboard(days: number) {
  return useQuery({
    queryKey: adminKeys.dashboard(days),
    queryFn: () => fetchDashboard(days),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}
