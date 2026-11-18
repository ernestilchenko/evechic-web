import { PROXY_BASE_URL } from "@/features/auth";
import { apiFetch, type RequestOptions } from "@/lib/api/client";
import type { Cart } from "@/lib/api/types";

import { CART_TOKEN_HEADER, CART_TOKEN_STORAGE_KEY } from "../constants/storage";

function cartRequest<T>(path: string, options: RequestOptions = {}) {
  return apiFetch<T>(path, {
    ...options,
    baseUrl: PROXY_BASE_URL,
    headers: { ...cartTokenHeaders(), ...options.headers },
  });
}

function readToken() {
  try {
    return window.localStorage.getItem(CART_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeToken(cart: Cart) {
  try {
    window.localStorage.setItem(CART_TOKEN_STORAGE_KEY, cart.token);
  } catch {}
  return cart;
}

export function cartTokenHeaders(): Record<string, string> {
  const token = readToken();
  return token ? { [CART_TOKEN_HEADER]: token } : {};
}

export async function fetchCart() {
  return storeToken(await cartRequest<Cart>("cart/", {}));
}

export async function addCartItem(variantId: number, quantity = 1) {
  return storeToken(
    await cartRequest<Cart>("cart/items/add/", {
      method: "POST",
      body: { variant_id: variantId, quantity },
    }),
  );
}

export async function updateCartItem(itemId: number, quantity: number) {
  return storeToken(
    await cartRequest<Cart>(`cart/items/${itemId}/update/`, {
      method: "PATCH",
      body: { quantity },
    }),
  );
}

export async function removeCartItem(itemId: number) {
  return storeToken(await cartRequest<Cart>(`cart/items/${itemId}/remove/`, { method: "DELETE" }));
}

export async function applyPromoCode(code: string) {
  return storeToken(await cartRequest<Cart>("cart/promo/apply/", { method: "POST", body: { code } }));
}

export async function removePromoCode() {
  return storeToken(await cartRequest<Cart>("cart/promo/remove/", { method: "DELETE" }));
}

export async function removeGiftCard() {
  return storeToken(await cartRequest<Cart>("cart/gift-card/remove/", { method: "DELETE" }));
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function rememberCheckoutEmail(email: string) {
  const value = email.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(value) || !readToken()) return;
  void cartRequest<null>("cart/email/", { method: "POST", body: { email: value } }).catch(() => undefined);
}

export function adoptCartToken(token: string) {
  if (!UUID_PATTERN.test(token)) return false;
  try {
    window.localStorage.setItem(CART_TOKEN_STORAGE_KEY, token);
  } catch {
    return false;
  }
  return true;
}
