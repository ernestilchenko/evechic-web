"use client";

import { RadioCard } from "@/components/ui/RadioCard";
import { fieldInputClass, TextField } from "@/components/ui/TextField";
import { NovaPoshtaCityField, NovaPoshtaWarehouseField } from "@/features/delivery";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { t } from "@/lib/i18n";

import { DELIVERY_METHODS } from "../constants/options";
import { fieldId, type CheckoutForm } from "../hooks/useCheckoutForm";
import { addressSummary } from "../utils/addresses";
import { FormSection } from "./FormSection";

type DeliverySectionProps = Pick<
  CheckoutForm,
  "values" | "errors" | "setField" | "setFields" | "addresses" | "activeChoice" | "chooseAddress"
> & {
  freeDeliveryThreshold: string;
  disabled: boolean;
};

export function DeliverySection({
  values,
  errors,
  setField,
  setFields,
  addresses,
  activeChoice,
  chooseAddress,
  freeDeliveryThreshold,
  disabled,
}: DeliverySectionProps) {
  const inputClassName = cn(fieldInputClass, "h-[52px]");
  const labelClassName = "text-muted text-[11px] tracking-[0.06em]";
  const method = values.delivery_method;
  const threshold = formatPrice(freeDeliveryThreshold);

  return (
    <FormSection title={t("checkout.delivery.title")}>
      {addresses.length > 0 ? (
        <div role="radiogroup" aria-label={t("checkout.delivery.saved")} className="flex flex-col gap-3">
          <p className="text-muted text-[11px] tracking-[0.06em]">{t("checkout.delivery.saved")}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {addresses.map((address) => (
              <RadioCard
                key={address.id}
                name="saved-address"
                value={address.id}
                checked={activeChoice === address.id}
                onChange={() => chooseAddress(address.id)}
                disabled={disabled}
                label={t(`checkout.delivery.methods.${address.delivery_method ?? "np_branch"}`)}
                description={addressSummary(address)}
                aside={
                  address.is_default ? (
                    <span className="text-gold self-start text-[10px] font-semibold tracking-[0.14em] uppercase">
                      {t("checkout.delivery.savedDefault")}
                    </span>
                  ) : null
                }
              />
            ))}
            <RadioCard
              name="saved-address"
              value="new"
              checked={activeChoice === "new"}
              onChange={() => chooseAddress("new")}
              disabled={disabled}
              label={t("checkout.delivery.savedNew")}
              description={t("checkout.delivery.savedNewHint")}
            />
          </div>
        </div>
      ) : null}

      <div role="radiogroup" aria-label={t("checkout.delivery.title")} className="flex flex-col gap-3">
        {DELIVERY_METHODS.map((option) => (
          <RadioCard
            key={option}
            name="delivery_method"
            value={option}
            checked={method === option}
            onChange={() => setField("delivery_method", option)}
            disabled={disabled}
            label={t(`checkout.delivery.methods.${option}`)}
            description={t(`checkout.delivery.hints.${option}`, { threshold })}
          />
        ))}
      </div>

      {method === "pickup" ? (
        <p className="text-muted text-[12.5px]">{t("checkout.delivery.pickupNote")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <NovaPoshtaCityField
            id={fieldId("city")}
            label={t("checkout.delivery.city")}
            placeholder={t("checkout.delivery.cityPlaceholder")}
            city={values.city}
            cityRef={values.city_ref}
            error={errors.city}
            disabled={disabled}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
            onChange={(city) =>
              setFields(
                city.city_ref !== values.city_ref ? { ...city, delivery_point: "", warehouse_ref: "" } : city,
              )
            }
          />
          {method === "np_courier" ? (
            <TextField
              id={fieldId("street")}
              label={t("checkout.delivery.street")}
              placeholder={t("checkout.delivery.streetPlaceholder")}
              autoComplete="street-address"
              required
              maxLength={255}
              value={values.street}
              onChange={(event) => setField("street", event.target.value)}
              error={errors.street}
              disabled={disabled}
            />
          ) : (
            <NovaPoshtaWarehouseField
              key={method}
              id={fieldId("delivery_point")}
              label={t(method === "np_locker" ? "checkout.delivery.locker" : "checkout.delivery.branch")}
              type={method === "np_locker" ? "locker" : "branch"}
              cityRef={values.city_ref}
              deliveryPoint={values.delivery_point}
              warehouseRef={values.warehouse_ref}
              error={errors.delivery_point}
              disabled={disabled}
              inputClassName={inputClassName}
              labelClassName={labelClassName}
              onChange={setFields}
            />
          )}
        </div>
      )}
    </FormSection>
  );
}
