"use client";

import { useQuery } from "@tanstack/react-query";

import { useHydrated } from "@/hooks/useHydrated";

import { fetchSessionUser } from "../services/sessionService";

export const sessionQueryKey = ["session"] as const;

export function useSession() {
  const hydrated = useHydrated();
  const query = useQuery({ queryKey: sessionQueryKey, queryFn: fetchSessionUser, staleTime: 60_000 });
  const user = hydrated ? (query.data ?? null) : null;

  return {
    user,
    isLoading: !hydrated || query.isLoading,
    isAuthenticated: user !== null,
    isStaff: user?.role === "manager" || user?.role === "owner",
    refetch: query.refetch,
  };
}
