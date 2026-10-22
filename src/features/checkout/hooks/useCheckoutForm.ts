"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { sessionQueryKey, useSession } from "@/features/auth";
import { cartQueryKey } from "@/features/cart";
import { routes } from "@/data/routes";
import type { CheckoutRequest, CheckoutResult } from "@/lib/api/types";

import { FIELD_ORDER, savedAddressesQueryKey } from "../constants/options";
import { fetchSavedAddresses, placeOrder } from "../services/checkoutService";
import type { CheckoutErrors, CheckoutField, CheckoutValues, UnavailableItem } from "../types";
import { addressDeliveryValues, pickDefaultAddress } from "../utils/addresses";
import { parseCheckoutError } from "../utils/apiErrors";
import { rememberLastOrder } from "../utils/lastOrder";
import { formatPhone, normalizePhone } from "../utils/phone";
import { validateCheckout } from "../utils/validate";

const DELIVERY_FIELDS: CheckoutField[] = ["delivery_method", "city", "delivery_point", "street"];

const EMPTY_VALUES: CheckoutValues = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  delivery_method: "np_branch",
  city: "",
  delivery_point: "",
  street: "",
  payment_method: "card",
  comment: "",
  skip_confirmation_call: false,
  use_bonuses: false,
};

export type AddressChoice = number | "new";

export function fieldId(field: CheckoutField) {
  return `checkout-${field.replace(/_/g, "-")}`;
}

function toPayload(values: CheckoutValues, useBonuses: boolean): CheckoutRequest {
  const method = values.delivery_method;
  return {
    first_name: values.first_name.trim(),
    last_name: values.last_name.trim(),
    phone: normalizePhone(values.phone),
    email: values.email.trim(),
    delivery_method: method,
    city: method === "pickup" ? "" : values.city.trim(),
    delivery_point: method === "np_branch" || method === "np_locker" ? values.delivery_point.trim() : "",
    street: method === "np_courier" ? values.street.trim() : "",
    payment_method: values.payment_method,
    comment: values.comment.trim(),
    skip_confirmation_call: values.skip_confirmation_call,
    use_bonuses: useBonuses,
  };
}

export function useCheckoutForm({ canUseBonuses }: { canUseBonuses: boolean }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useSession();

  const addressesQuery = useQuery({
    queryKey: savedAddressesQueryKey,
    queryFn: fetchSavedAddresses,
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
  const addresses = isAuthenticated ? (addressesQuery.data ?? []) : [];

  const [edits, setEdits] = useState<Partial<CheckoutValues>>({});
  const [addressChoice, setAddressChoice] = useState<AddressChoice | null>(null);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [unavailableItems, setUnavailableItems] = useState<UnavailableItem[]>([]);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<CheckoutResult | null>(null);

  const defaultAddress = pickDefaultAddress(addresses);
  const activeChoice: AddressChoice = addressChoice ?? defaultAddress?.id ?? "new";
  const activeAddress =
    activeChoice === "new" ? null : (addresses.find((address) => address.id === activeChoice) ?? null);

  const values: CheckoutValues = {
    ...EMPTY_VALUES,
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    phone: user?.phone ? formatPhone(user.phone) : "",
    email: user?.email ?? "",
    ...(activeAddress ? addressDeliveryValues(activeAddress) : {}),
    ...edits,
  };

  const clearError = (field: CheckoutField) =>
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });

  const setField = <K extends CheckoutField>(field: K, value: CheckoutValues[K]) => {
    setEdits((current) => ({ ...current, [field]: value }));
    clearError(field);
    if (field === "delivery_method") {
      clearError("city");
      clearError("delivery_point");
      clearError("street");
    }
  };

  const chooseAddress = (choice: AddressChoice) => {
    setAddressChoice(choice);
    setEdits((current) => {
      const next = { ...current };
      DELIVERY_FIELDS.forEach((field) => delete next[field]);
      return next;
    });
    setErrors((current) => {
      const next = { ...current };
      DELIVERY_FIELDS.forEach((field) => delete next[field]);
      return next;
    });
  };

  const focusFirstError = (fieldErrors: CheckoutErrors) => {
    const first = FIELD_ORDER.find((field) => fieldErrors[field]);
    if (first) document.getElementById(fieldId(first))?.focus();
  };

  const mutation = useMutation({
    mutationFn: placeOrder,
    onSuccess: (order) => {
      setPlacedOrder(order);
      rememberLastOrder(order);
      queryClient.invalidateQueries({ queryKey: cartQueryKey });
      if (isAuthenticated) queryClient.invalidateQueries({ queryKey: sessionQueryKey });
      if (order.payment_url) window.location.assign(order.payment_url);
      else router.push(routes.checkoutSuccess(order.number));
    },
    onError: (error) => {
      const parsed = parseCheckoutError(error);
      setErrors(parsed.fieldErrors);
      setUnavailableItems(parsed.items);
      setFormMessage(parsed.message);
      if (parsed.items.length) queryClient.invalidateQueries({ queryKey: cartQueryKey });
      focusFirstError(parsed.fieldErrors);
    },
  });

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mutation.isPending || placedOrder) return;
    const validationErrors = validateCheckout(values);
    setErrors(validationErrors);
    setUnavailableItems([]);
    if (Object.keys(validationErrors).length) {
      setFormMessage(null);
      focusFirstError(validationErrors);
      return;
    }
    setFormMessage(null);
    mutation.mutate(toPayload(values, canUseBonuses && values.use_bonuses));
  };

  return {
    values,
    errors,
    setField,
    addresses,
    activeChoice,
    chooseAddress,
    submit,
    isSubmitting: mutation.isPending,
    placedOrder,
    unavailableItems,
    formMessage,
  };
}

export type CheckoutForm = ReturnType<typeof useCheckoutForm>;
