"use client";

import { useId, useState } from "react";

import { Checkbox } from "@/components/ui/Checkbox";
import { Dialog } from "@/components/ui/Dialog";
import { TextField, fieldInputClass } from "@/components/ui/TextField";
import type { Address, AddressInput, DeliveryMethod } from "@/lib/api/types";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";

import { deliveryMethods } from "../constants/account";

type AddressDialogProps = {
  open: boolean;
  address: Address | null;
  pending: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (input: AddressInput) => void;
};

function AddressForm({ address, pending, error, onClose, onSubmit }: Omit<AddressDialogProps, "open">) {
  const methodId = useId();
  const [method, setMethod] = useState<DeliveryMethod>(address?.delivery_method ?? "np_branch");
  const [city, setCity] = useState(address?.city ?? "");
  const [point, setPoint] = useState(address?.delivery_point ?? "");
  const [street, setStreet] = useState(address?.street ?? "");
  const [isDefault, setIsDefault] = useState(address?.is_default ?? false);
  const needsPoint = method === "np_branch" || method === "np_locker";
  const needsStreet = method === "np_courier";

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          delivery_method: method,
          city: city.trim(),
          delivery_point: needsPoint ? point.trim() : "",
          street: needsStreet ? street.trim() : "",
          is_default: isDefault,
        });
      }}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor={methodId} className="text-muted text-[11px] tracking-[0.06em]">
          {t("account.addresses.method")}
        </label>
        <span className="relative inline-flex">
          <select
            id={methodId}
            value={method}
            onChange={(event) => setMethod(event.target.value as DeliveryMethod)}
            className={cn(fieldInputClass, "h-[52px] appearance-none pr-10")}
          >
            {deliveryMethods.map((value) => (
              <option key={value} value={value}>
                {t(`account.delivery.methods.${value}`)}
              </option>
            ))}
          </select>
          <span
            aria-hidden
            className="text-muted pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[10px]"
          >
            ▾
          </span>
        </span>
      </div>
      <TextField
        label={t("account.addresses.city")}
        placeholder={t("account.addresses.cityPlaceholder")}
        required
        maxLength={120}
        autoComplete="address-level2"
        value={city}
        onChange={(event) => setCity(event.target.value)}
      />
      {needsPoint ? (
        <TextField
          label={t("account.addresses.deliveryPoint")}
          placeholder={t("account.addresses.deliveryPointPlaceholder")}
          required
          maxLength={255}
          value={point}
          onChange={(event) => setPoint(event.target.value)}
        />
      ) : null}
      {needsStreet ? (
        <TextField
          label={t("account.addresses.street")}
          placeholder={t("account.addresses.streetPlaceholder")}
          required
          maxLength={255}
          autoComplete="street-address"
          value={street}
          onChange={(event) => setStreet(event.target.value)}
        />
      ) : null}
      <Checkbox
        checked={isDefault}
        disabled={address?.is_default}
        onChange={(event) => setIsDefault(event.target.checked)}
        label={t("account.addresses.isDefault")}
      />
      {error ? (
        <p role="alert" className="text-sale text-[12.5px]">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="border-line hover:border-ink border px-[22px] py-3.5 text-[10.5px] font-semibold tracking-[0.16em] uppercase"
        >
          {t("account.addresses.cancel")}
        </button>
        <button
          type="submit"
          disabled={pending}
          className="bg-ink text-cream hover:bg-ink/85 px-[22px] py-3.5 text-[10.5px] font-semibold tracking-[0.16em] uppercase disabled:opacity-60"
        >
          {pending ? t("account.addresses.saving") : t("account.addresses.save")}
        </button>
      </div>
    </form>
  );
}

export function AddressDialog({ open, address, ...props }: AddressDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={props.onClose}
      title={address ? t("account.addresses.dialogEdit") : t("account.addresses.dialogAdd")}
      closeLabel={t("account.addresses.cancel")}
    >
      <AddressForm key={address?.id ?? "new"} address={address} {...props} />
    </Dialog>
  );
}
