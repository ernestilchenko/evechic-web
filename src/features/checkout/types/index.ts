import type { DeliveryMethod, PaymentMethod, PaymentStatus } from "@/lib/api/types";

export type CheckoutValues = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  delivery_method: DeliveryMethod;
  city: string;
  city_ref: string;
  delivery_point: string;
  warehouse_ref: string;
  street: string;
  payment_method: PaymentMethod;
  comment: string;
  skip_confirmation_call: boolean;
  use_bonuses: boolean;
};

export type CheckoutField = keyof CheckoutValues;

export type CheckoutErrors = Partial<Record<CheckoutField, string>>;

export type UnavailableItem = {
  variant_id: number;
  product_name: string | null;
  color_name: string | null;
  size: string | null;
  requested: number;
  available: number;
  reason: "unavailable" | "out_of_stock";
};

export type LastOrder = {
  number: number;
  email: string;
  total: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  delivery_method: DeliveryMethod;
  skip_confirmation_call: boolean;
  payment_started: boolean;
};
