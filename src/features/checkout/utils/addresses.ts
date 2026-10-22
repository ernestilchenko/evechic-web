import type { Address, DeliveryMethod } from "@/lib/api/types";

import type { CheckoutValues } from "../types";

export function addressDeliveryValues(address: Address): Partial<CheckoutValues> {
  return {
    delivery_method: (address.delivery_method ?? "np_branch") as DeliveryMethod,
    city: address.city,
    delivery_point: address.delivery_point ?? "",
    street: address.street ?? "",
  };
}

export function addressSummary(address: Address) {
  return [address.city, address.delivery_point || address.street].filter(Boolean).join(", ");
}

export function pickDefaultAddress(addresses: Address[]) {
  return addresses.find((address) => address.is_default) ?? addresses[0] ?? null;
}
