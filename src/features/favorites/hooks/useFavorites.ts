"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import { useSession } from "@/features/auth";
import type { ProductCard } from "@/lib/api/types";

import { favoritesQueryKey } from "../constants/query";
import { addFavorite, fetchFavorites, removeFavorite } from "../services/favoritesService";

type ToggleInput = { productId: number; active: boolean };

export function useFavorites() {
  const queryClient = useQueryClient();
  const session = useSession();
  const query = useQuery({
    queryKey: favoritesQueryKey,
    queryFn: fetchFavorites,
    enabled: session.isAuthenticated,
    staleTime: 60_000,
  });

  const ids = useMemo(() => new Set((query.data ?? []).map((product) => product.id)), [query.data]);

  const toggle = useMutation({
    mutationFn: ({ productId, active }: ToggleInput) =>
      active ? removeFavorite(productId) : addFavorite(productId),
    onSuccess: (_, { productId, active }) => {
      if (active) {
        queryClient.setQueryData<ProductCard[]>(favoritesQueryKey, (current) =>
          current?.filter((product) => product.id !== productId),
        );
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: favoritesQueryKey }),
  });

  const pending = toggle.isPending ? toggle.variables : undefined;

  return {
    favorites: query.data ?? [],
    isLoading: session.isLoading || (session.isAuthenticated && query.isLoading),
    isError: query.isError,
    isAuthenticated: session.isAuthenticated,
    isFavorite: (productId: number) =>
      pending?.productId === productId ? !pending.active : ids.has(productId),
    toggle,
  };
}
