"use client";

import { Select } from "@/components/ui/Select";
import { Field, TextInput } from "@/features/admin";
import { t } from "@/lib/i18n";

import { DELIVERY_METHODS } from "../constants/orders";
import type { DeliveryMethod } from "../types";

export type DeliveryValues = {
  delivery_method: DeliveryMethod;
  city: string;
  delivery_point: string;
  street: string;
};

type DeliveryFieldsProps = {
  values: DeliveryValues;
  errors?: Record<string, string>;
  onChange: (values: DeliveryValues) => void;
};

export function DeliveryFields({ values, errors = {}, onChange }: DeliveryFieldsProps) {
  const set = (patch: Partial<DeliveryValues>) => onChange({ ...values, ...patch });
  const courier = values.delivery_method === "np_courier";
  const pickup = values.delivery_method === "pickup";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field
        label={t("adminOrders.field.deliveryMethod")}
        error={errors.delivery_method}
        className="sm:col-span-2"
      >
        {(props) => (
          <Select
            {...props}
            value={values.delivery_method}
            onChange={(event) => set({ delivery_method: event.target.value as DeliveryMethod })}
          >
            {DELIVERY_METHODS.map((method) => (
              <option key={method} value={method}>
                {t(`adminOrders.delivery.${method}`)}
              </option>
            ))}
          </Select>
        )}
      </Field>
      {!pickup ? (
        <Field label={t("adminOrders.field.city")} error={errors.city}>
          {(props) => (
            <TextInput
              {...props}
              value={values.city}
              onChange={(event) => set({ city: event.target.value })}
            />
          )}
        </Field>
      ) : null}
      {courier ? (
        <Field label={t("adminOrders.field.street")} error={errors.street}>
          {(props) => (
            <TextInput
              {...props}
              value={values.street}
              onChange={(event) => set({ street: event.target.value })}
            />
          )}
        </Field>
      ) : null}
      {!courier && !pickup ? (
        <Field label={t("adminOrders.field.deliveryPoint")} error={errors.delivery_point}>
          {(props) => (
            <TextInput
              {...props}
              value={values.delivery_point}
              onChange={(event) => set({ delivery_point: event.target.value })}
            />
          )}
        </Field>
      ) : null}
    </div>
  );
}
