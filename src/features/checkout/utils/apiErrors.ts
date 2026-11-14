import { translateApiMessage } from "@/lib/apiMessage";
import { ApiError } from "@/lib/api/client";
import { t, type MessageKey } from "@/lib/i18n";

import type { CheckoutErrors, CheckoutField, UnavailableItem } from "../types";

const knownMessages: Record<string, MessageKey> = {
  "Cart is empty.": "checkout.apiErrors.cartEmpty",
  "Enter the name in Ukrainian letters, as in your documents: Nova Poshta requires it.":
    "checkout.apiErrors.nameCyrillic",
  "Enter a Ukrainian phone number in the format +380XXXXXXXXX.": "checkout.apiErrors.phoneInvalid",
  "Branch or locker is required.": "checkout.apiErrors.deliveryPoint",
  "Street address is required for courier delivery.": "checkout.apiErrors.street",
  "City is required.": "checkout.apiErrors.city",
  "Delivery method is required.": "checkout.apiErrors.deliveryMethod",
  "Address not found.": "checkout.apiErrors.addressNotFound",
  "Promo code not found.": "checkout.apiErrors.promo",
  "Promo code is not active.": "checkout.apiErrors.promo",
  "Promo code is not active yet.": "checkout.apiErrors.promo",
  "Promo code has expired.": "checkout.apiErrors.promo",
  "Promo code usage limit reached.": "checkout.apiErrors.promo",
  "Order amount is too low for this promo code.": "checkout.apiErrors.promo",
  "Promo code is valid for the first order only.": "checkout.apiErrors.promo",
  "Payment service is unavailable. Please try again later.": "checkout.apiErrors.paymentFailed",
};

const FORM_FIELDS = new Set<CheckoutField>([
  "first_name",
  "last_name",
  "phone",
  "email",
  "delivery_method",
  "city",
  "delivery_point",
  "street",
  "payment_method",
  "comment",
]);

export function translateCheckoutMessage(message: string | null | undefined) {
  if (!message) return t("checkout.apiErrors.generic");
  const key = knownMessages[message];
  return key ? t(key) : (translateApiMessage(message) ?? t("checkout.apiErrors.generic"));
}

export type ParsedCheckoutError = {
  fieldErrors: CheckoutErrors;
  items: UnavailableItem[];
  message: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseCheckoutError(error: unknown): ParsedCheckoutError {
  if (!(error instanceof ApiError) || error.status >= 500) {
    return { fieldErrors: {}, items: [], message: t("checkout.apiErrors.generic") };
  }

  const data = isRecord(error.data) ? error.data : {};
  const items = Array.isArray(data.items) ? (data.items as UnavailableItem[]) : [];
  const fieldErrors: CheckoutErrors = {};
  const otherMessages: string[] = [];

  if (isRecord(data.errors)) {
    Object.entries(data.errors).forEach(([field, value]) => {
      const first = Array.isArray(value) ? value[0] : value;
      const message = translateCheckoutMessage(typeof first === "string" ? first : null);
      if (field === "address_id") fieldErrors.city = message;
      else if (FORM_FIELDS.has(field as CheckoutField)) fieldErrors[field as CheckoutField] = message;
      else otherMessages.push(message);
    });
  }

  const hasDetails = items.length > 0 || Object.keys(fieldErrors).length > 0;
  const message = otherMessages[0] ?? (hasDetails && !items.length ? t("checkout.validation.summary") : null);

  return {
    fieldErrors,
    items,
    message: hasDetails || otherMessages.length ? message : translateCheckoutMessage(error.message),
  };
}

export function checkoutErrorMessage(error: unknown) {
  return translateCheckoutMessage(error instanceof ApiError ? error.message : null);
}
