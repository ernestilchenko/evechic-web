import { t } from "@/lib/i18n";

import { FIELD_LIMITS } from "../constants/options";
import type { CheckoutErrors, CheckoutValues } from "../types";
import { isValidPhone } from "./phone";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function required(value: string, limit?: number, message = t("checkout.validation.required")) {
  const trimmed = value.trim();
  if (!trimmed) return message;
  if (limit && trimmed.length > limit) return t("checkout.validation.tooLong");
  return undefined;
}

export function validateCheckout(values: CheckoutValues): CheckoutErrors {
  const errors: CheckoutErrors = {
    first_name: required(values.first_name, FIELD_LIMITS.first_name),
    last_name: required(values.last_name, FIELD_LIMITS.last_name),
    phone: isValidPhone(values.phone) ? undefined : t("checkout.validation.phone"),
    email: EMAIL_PATTERN.test(values.email.trim()) ? undefined : t("checkout.validation.email"),
  };

  if (values.delivery_method !== "pickup") {
    errors.city = required(values.city, FIELD_LIMITS.city, t("checkout.validation.city"));
  }
  if (values.delivery_method === "np_branch") {
    errors.delivery_point = required(
      values.delivery_point,
      FIELD_LIMITS.delivery_point,
      t("checkout.validation.branch"),
    );
  }
  if (values.delivery_method === "np_locker") {
    errors.delivery_point = required(
      values.delivery_point,
      FIELD_LIMITS.delivery_point,
      t("checkout.validation.locker"),
    );
  }
  if (values.delivery_method === "np_courier") {
    errors.street = required(values.street, FIELD_LIMITS.street, t("checkout.validation.street"));
  }

  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message)) as CheckoutErrors;
}
