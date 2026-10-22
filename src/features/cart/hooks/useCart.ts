"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Cart } from "@/lib/api/types";

import { cartQueryKey } from "../constants/storage";
import {
  addCartItem,
  applyPromoCode,
  fetchCart,
  removeCartItem,
  removePromoCode,
  updateCartItem,
} from "../services/cartService";

export function useCart() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: cartQueryKey, queryFn: fetchCart, staleTime: 30_000 });

  const onSuccess = (cart: Cart) => queryClient.setQueryData(cartQueryKey, cart);

  const addItem = useMutation({
    mutationFn: ({ variantId, quantity }: { variantId: number; quantity?: number }) =>
      addCartItem(variantId, quantity),
    onSuccess,
  });
  const updateItem = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      updateCartItem(itemId, quantity),
    onSuccess,
  });
  const removeItem = useMutation({ mutationFn: removeCartItem, onSuccess });
  const applyPromo = useMutation({ mutationFn: applyPromoCode, onSuccess });
  const removePromo = useMutation({ mutationFn: removePromoCode, onSuccess });

  return {
    cart: query.data ?? null,
    isLoading: query.isLoading,
    itemsCount: query.data?.totals.items_count ?? 0,
    addItem,
    updateItem,
    removeItem,
    applyPromo,
    removePromo,
  };
}
