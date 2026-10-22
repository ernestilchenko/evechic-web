"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adminKeys } from "@/features/admin";

import { orderKeys } from "../constants/orders";
import { createOrder, fetchProductVariants, searchProducts } from "../services/ordersService";

export function useProductSearch(q: string) {
  return useQuery({
    queryKey: orderKeys.productSearch(q),
    queryFn: () => searchProducts(q),
    enabled: q.length >= 2,
    staleTime: 30_000,
  });
}

export function useProductVariants(id: number | null) {
  return useQuery({
    queryKey: orderKeys.productVariants(id ?? 0),
    queryFn: () => fetchProductVariants(id ?? 0),
    enabled: id !== null,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: adminKeys.badges });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}
