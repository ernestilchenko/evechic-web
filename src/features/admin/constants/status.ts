import type { components } from "@/lib/api/schema";

import type { ChipTone } from "../types";

export type OrderStatus = components["schemas"]["OrderStatusEnum"];

export const ORDER_STATUS_TONES: Record<OrderStatus, ChipTone> = {
  new: "info",
  packed: "success",
  shipped: "warn",
  completed: "success",
  cancelled: "danger",
  return_requested: "violet",
  returned: "neutral",
};
