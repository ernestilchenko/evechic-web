import type { CartItem } from "@/lib/api/types";

export const MAX_ITEM_QUANTITY = 99;
export const LOW_STOCK_THRESHOLD = 3;

export function maxQuantity(item: CartItem) {
  return Math.max(1, Math.min(item.stock, MAX_ITEM_QUANTITY));
}

export function hasStockProblem(item: CartItem) {
  return !item.available || item.quantity > item.stock;
}
