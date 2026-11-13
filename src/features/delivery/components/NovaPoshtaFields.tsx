"use client";

import { t } from "@/lib/i18n";

import { useCitySearch, useWarehouseSearch } from "../hooks/useNovaPoshta";
import type { NpWarehouseType } from "../services/novaPoshtaService";
import { Combobox } from "./Combobox";

type StyleProps = {
  inputClassName: string;
  labelClassName: string;
  disabled?: boolean;
};

type CityFieldProps = StyleProps & {
  id?: string;
  label: string;
  placeholder?: string;
  city: string;
  cityRef: string;
  error?: string | null;
  onChange: (value: { city: string; city_ref: string }) => void;
};

export function NovaPoshtaCityField({
  id,
  label,
  placeholder,
  city,
  cityRef,
  error,
  onChange,
  ...style
}: CityFieldProps) {
  const query = useCitySearch(city, !cityRef);
  const cities = query.data ?? [];
  const hint =
    !cityRef && city.trim().length >= 2 && query.isSuccess && cities.length === 0
      ? t("delivery.nothingFound")
      : !cityRef && city.trim().length > 0 && city.trim().length < 2
        ? t("delivery.typeCity")
        : null;

  return (
    <Combobox
      id={id}
      label={label}
      placeholder={placeholder}
      required
      value={city}
      onTextChange={(text) => onChange({ city: text, city_ref: "" })}
      onSelect={(ref) => {
        const match = cities.find((item) => item.ref === ref);
        if (match) onChange({ city: match.name, city_ref: match.ref });
      }}
      options={
        cityRef
          ? []
          : cities.map((item) => ({
              key: item.ref,
              label: item.name,
              detail: [item.type, item.area ? `${item.area} обл.` : ""].filter(Boolean).join(", "),
            }))
      }
      loading={query.isFetching}
      unavailable={query.isError}
      hint={hint}
      error={error}
      {...style}
    />
  );
}

type WarehouseFieldProps = StyleProps & {
  id?: string;
  label: string;
  type: NpWarehouseType;
  cityRef: string;
  deliveryPoint: string;
  warehouseRef: string;
  error?: string | null;
  onChange: (value: { delivery_point: string; warehouse_ref: string }) => void;
};

export function NovaPoshtaWarehouseField({
  id,
  label,
  type,
  cityRef,
  deliveryPoint,
  warehouseRef,
  error,
  onChange,
  ...style
}: WarehouseFieldProps) {
  const query = useWarehouseSearch(cityRef, type, warehouseRef ? "" : deliveryPoint, !warehouseRef);
  const warehouses = query.data ?? [];
  const hint = !cityRef
    ? t("delivery.chooseCityFirst")
    : !warehouseRef && deliveryPoint && query.isSuccess && warehouses.length === 0
      ? t("delivery.nothingFound")
      : !warehouseRef && deliveryPoint && !query.isError
        ? t("delivery.pickFromList")
        : null;

  return (
    <Combobox
      id={id}
      label={label}
      placeholder={t(type === "locker" ? "delivery.lockerSearch" : "delivery.branchSearch")}
      required
      value={deliveryPoint}
      onTextChange={(text) => onChange({ delivery_point: text, warehouse_ref: "" })}
      onSelect={(ref) => {
        const match = warehouses.find((item) => item.ref === ref);
        if (match) onChange({ delivery_point: match.name, warehouse_ref: match.ref });
      }}
      options={warehouseRef ? [] : warehouses.map((item) => ({ key: item.ref, label: item.name }))}
      loading={query.isFetching}
      unavailable={query.isError}
      hint={hint}
      error={error}
      {...style}
      disabled={style.disabled}
    />
  );
}
