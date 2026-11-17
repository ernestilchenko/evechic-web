import { translateApiMessage } from "@/lib/apiMessage";
import { ApiError } from "@/lib/api/client";
import { t, type MessageKey } from "@/lib/i18n";

const knownMessages: Record<string, MessageKey> = {
  "Promo code not found.": "cart.apiErrors.promoNotFound",
  "This gift card is not paid yet.": "cart.apiErrors.giftCardNotPaid",
  "This gift card is no longer valid.": "cart.apiErrors.giftCardInactive",
  "This gift card has expired.": "cart.apiErrors.giftCardExpired",
  "This gift card has no balance left.": "cart.apiErrors.giftCardEmpty",
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
  return key ? t(key) : (translateApiMessage(message) ?? t("cart.apiErrors.generic"));
}

export function cartErrorMessage(error: unknown) {
  if (error instanceof ApiError) return translateCartMessage(error.message);
  return t("cart.apiErrors.generic");
}
