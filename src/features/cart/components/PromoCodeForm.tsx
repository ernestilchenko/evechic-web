"use client";

import { useId, useState } from "react";

import { Spinner } from "@/components/ui/Spinner";
import type { CartTotals } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";
import { t } from "@/lib/i18n";

import type { useCart } from "../hooks/useCart";
import { cartErrorMessage, translateCartMessage } from "../utils/cartErrorMessage";

type CartMutations = ReturnType<typeof useCart>;

type PromoCodeFormProps = {
  totals: CartTotals;
  applyPromo: CartMutations["applyPromo"];
  removePromo: CartMutations["removePromo"];
  removeGiftCard: CartMutations["removeGiftCard"];
};

function AppliedCode({
  text,
  removeLabel,
  pending,
  disabled,
  onRemove,
}: {
  text: string;
  removeLabel: string;
  pending: boolean;
  disabled: boolean;
  onRemove: () => void;
}) {
  return (
    <div className="border-field flex min-h-[50px] items-center gap-3 border border-dashed px-4">
      <p className="min-w-0 flex-1 text-[12.5px]">{text}</p>
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label={removeLabel}
        className="caps text-gold hover:text-ink inline-flex items-center gap-2 text-[10.5px] disabled:opacity-50"
      >
        {pending ? <Spinner className="size-3" /> : null}
        {t("cart.promo.remove")}
      </button>
    </div>
  );
}

export function PromoCodeForm({ totals, applyPromo, removePromo, removeGiftCard }: PromoCodeFormProps) {
  const [code, setCode] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const inputId = useId();
  const statusId = `${inputId}-status`;

  const busy = applyPromo.isPending || removePromo.isPending || removeGiftCard.isPending;
  const error =
    localError ??
    (applyPromo.error ? cartErrorMessage(applyPromo.error) : null) ??
    (removePromo.error ? cartErrorMessage(removePromo.error) : null) ??
    (totals.promo_error ? translateCartMessage(totals.promo_error) : null) ??
    (totals.gift_card_error ? translateCartMessage(totals.gift_card_error) : null);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = code.trim();
    if (!value) {
      setLocalError(t("cart.promo.required"));
      return;
    }
    setLocalError(null);
    applyPromo.mutate(value, { onSuccess: () => setCode("") });
  };

  return (
    <div className="flex flex-col gap-2">
      {totals.promo_code ? (
        <AppliedCode
          text={t("cart.promo.applied", { code: totals.promo_code })}
          removeLabel={t("cart.promo.removeLabel", { code: totals.promo_code })}
          pending={removePromo.isPending}
          disabled={busy}
          onRemove={() => removePromo.mutate()}
        />
      ) : null}
      {totals.gift_card_code ? (
        <AppliedCode
          text={t("cart.promo.giftCardApplied", {
            code: totals.gift_card_code,
            balance: formatPrice(totals.gift_card_balance),
          })}
          removeLabel={t("cart.promo.removeLabel", { code: totals.gift_card_code })}
          pending={removeGiftCard.isPending}
          disabled={busy}
          onRemove={() => removeGiftCard.mutate()}
        />
      ) : null}
      {totals.promo_code && totals.gift_card_code ? null : (
        <form onSubmit={submit} noValidate className="flex">
          <label htmlFor={inputId} className="sr-only">
            {t("cart.promo.label")}
          </label>
          <input
            id={inputId}
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
              setLocalError(null);
              if (applyPromo.error) applyPromo.reset();
            }}
            placeholder={t("cart.promo.placeholder")}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={40}
            disabled={busy}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? statusId : undefined}
            className="border-field bg-cream placeholder:text-placeholder focus:border-ink aria-[invalid=true]:border-sale h-[50px] min-w-0 flex-1 border border-r-0 px-4 text-[12.5px] uppercase placeholder:normal-case focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={busy}
            className="border-ink hover:bg-ink hover:text-cream inline-flex h-[50px] w-[112px] shrink-0 items-center justify-center gap-2 border text-[10.5px] font-semibold tracking-[0.16em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {applyPromo.isPending ? (
              <Spinner className="size-3" label={t("common.loading")} />
            ) : (
              t("cart.promo.apply")
            )}
          </button>
        </form>
      )}
      <p id={statusId} role="alert" className="text-sale text-[11.5px] empty:hidden">
        {error}
      </p>
    </div>
  );
}
