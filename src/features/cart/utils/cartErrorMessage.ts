import { ApiError } from "@/lib/api/client";
import { t, type MessageKey } from "@/lib/i18n";

const knownMessages: Record<string, MessageKey> = {
  "Promo code not found.": "cart.apiErrors.promoNotFound",
  "Promo code is not active.": "cart.apiErrors.promoInactive",
  "Promo code is not active yet.": "cart.apiErrors.promoNotStarted",
  "Promo code has expired.": "cart.apiErrors.promoExpired",
  "Promo code usage limit reached.": "cart.apiErrors.promoLimit",
  "Order amount is too low for this promo code.": "cart.apiErrors.promoMinAmount",
  "Promo code is valid for the first order only.": "cart.apiErrors.promoFirstOrder",
  "This size is out of stock.": "cart.apiErrors.outOfStock",
  "Not enough items in stock.": "cart.apiErrors.notEnoughStock",
  "Cart item not found.": "cart.apiErrors.itemNotFound",
  "Product variant not found.": "cart.apiErrors.variantNotFound",
};

export function translateCartMessage(message: string | null | undefined) {
  if (!message) return t("cart.apiErrors.generic");
  const key = knownMessages[message];
  return key ? t(key) : message;
}

export function cartErrorMessage(error: unknown) {
  if (error instanceof ApiError) return translateCartMessage(error.message);
  return t("cart.apiErrors.generic");
}
