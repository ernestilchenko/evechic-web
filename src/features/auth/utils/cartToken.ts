import { CART_TOKEN_STORAGE_KEY } from "@/features/cart";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function readGuestCartToken() {
  try {
    const token = window.localStorage.getItem(CART_TOKEN_STORAGE_KEY);
    return token && UUID_PATTERN.test(token) ? token : null;
  } catch {
    return null;
  }
}

export function forgetCartToken() {
  try {
    window.localStorage.removeItem(CART_TOKEN_STORAGE_KEY);
  } catch {}
}
