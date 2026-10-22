"use client";

import { useQuery } from "@tanstack/react-query";

import { adminKeys, BADGES_POLL_INTERVAL } from "../constants/queryKeys";
import { fetchBadges } from "../services/dashboardService";

export function useBadges() {
  return useQuery({
    queryKey: adminKeys.badges,
    queryFn: fetchBadges,
    refetchInterval: BADGES_POLL_INTERVAL,
    refetchIntervalInBackground: false,
    staleTime: 30_000,
  });
}
