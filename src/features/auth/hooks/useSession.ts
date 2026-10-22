"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchSessionUser } from "../services/sessionService";

export const sessionQueryKey = ["session"] as const;

export function useSession() {
  const query = useQuery({ queryKey: sessionQueryKey, queryFn: fetchSessionUser, staleTime: 60_000 });
  const user = query.data ?? null;

  return {
    user,
    isLoading: query.isLoading,
    isAuthenticated: user !== null,
    isStaff: user?.role === "manager" || user?.role === "owner",
    refetch: query.refetch,
  };
}
