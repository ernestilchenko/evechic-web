"use client";

import { Select } from "@/components/ui/Select";
import { Field, inputClass, TextInput } from "@/features/admin";
import { NovaPoshtaCityField, NovaPoshtaWarehouseField } from "@/features/delivery";
import { t } from "@/lib/i18n";

import { DELIVERY_METHODS } from "../constants/orders";
import type { DeliveryMethod } from "../types";

export type DeliveryValues = {
  delivery_method: DeliveryMethod;
  city: string;
  city_ref: string;
  delivery_point: string;
  warehouse_ref: string;
  street: string;
};

const labelClassName = "text-muted text-[11px] font-semibold tracking-[0.06em]";

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
            onChange={(event) =>
              set({
                delivery_method: event.target.value as DeliveryMethod,
                delivery_point: "",
                warehouse_ref: "",
              })
            }
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
        <NovaPoshtaCityField
          label={t("adminOrders.field.city")}
          city={values.city}
          cityRef={values.city_ref}
          error={errors.city}
          inputClassName={inputClass}
          labelClassName={labelClassName}
          onChange={(city) =>
            set(city.city_ref !== values.city_ref ? { ...city, delivery_point: "", warehouse_ref: "" } : city)
          }
        />
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
        <NovaPoshtaWarehouseField
          key={values.delivery_method}
          label={t("adminOrders.field.deliveryPoint")}
          type={values.delivery_method === "np_locker" ? "locker" : "branch"}
          cityRef={values.city_ref}
          deliveryPoint={values.delivery_point}
          warehouseRef={values.warehouse_ref}
          error={errors.delivery_point}
          inputClassName={inputClass}
          labelClassName={labelClassName}
          onChange={set}
        />
      ) : null}
    </div>
  );
}
