import { ApiError } from "@/lib/api/client";
import { t, type MessageKey } from "@/lib/i18n";

const knownMessages: Record<string, MessageKey> = {
  "Not enough items in stock.": "errors.api.notEnoughStock",
  "This size is out of stock.": "errors.api.outOfStock",
  "This size is in stock, you can order it now.": "errors.api.sizeInStock",
  "Size not found.": "errors.api.sizeNotFound",
  "Product variant not found.": "errors.api.variantNotFound",
  "You have already reviewed this product.": "errors.api.reviewExists",
  "Each photo must be smaller than 8 MB.": "errors.api.photoTooLarge",
  "A return waybill can be added only after the return is requested.": "errors.api.returnTrackingNotAllowed",
  "Return is available only for completed orders.": "errors.api.returnNotAllowed",
  "The return period for this order has expired.": "errors.api.returnExpired",
  "Only new orders can be cancelled.": "errors.api.cannotCancel",
  "The card payment could not be refunded right now. The order was not changed, please try again later.":
    "errors.api.refundFailed",
  "Payment service is unavailable. Please try again later.": "errors.api.paymentFailed",
  "This order cannot be paid online.": "errors.api.paymentNotAvailable",
  "Monobank installments are not available for this order.": "errors.api.partsNotAvailable",
  "Confirm the installment request in the monobank app.": "errors.api.partsPending",
  "Order is already paid.": "errors.api.alreadyPaid",
  "Pickup is not available, please choose Nova Poshta delivery.": "errors.api.pickupUnavailable",
  "Order not found.": "errors.api.orderNotFound",
  "Request was throttled.": "errors.api.throttled",
  "Too many failed attempts for this email. Try again in an hour.": "errors.api.tooManyLogin",
};

function firstFieldMessage(data: unknown): string | null {
  const errors = (data as { errors?: Record<string, unknown> } | null)?.errors;
  if (!errors || typeof errors !== "object") return null;
  for (const value of Object.values(errors)) {
    const first = Array.isArray(value) ? value[0] : value;
    if (typeof first === "string" && knownMessages[first]) return first;
  }
  return null;
}

export function translateApiMessage(message: string | null | undefined): string | null {
  if (!message) return null;
  if (message.startsWith("Request was throttled")) return t("errors.api.throttled");
  const key = knownMessages[message];
  return key ? t(key) : null;
}

export function apiErrorText(error: unknown, fallback: MessageKey): string {
  if (error instanceof ApiError) {
    if (error.status === 429) return t("errors.api.throttled");
    return (
      translateApiMessage(error.message) ?? translateApiMessage(firstFieldMessage(error.data)) ?? t(fallback)
    );
  }
  return t(fallback);
}
