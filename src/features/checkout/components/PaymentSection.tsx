"use client";

import { useEffect } from "react";

import Link from "next/link";

import { RadioCard } from "@/components/ui/RadioCard";
import { routes } from "@/data/routes";
import { partsAvailable } from "@/features/payments/paymentOptions";
import { usePaymentOptions } from "@/features/payments/usePaymentOptions";
import type { PaymentMethod } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";
import { t } from "@/lib/i18n";

import { PAYMENT_METHODS } from "../constants/options";
import type { CheckoutForm } from "../hooks/useCheckoutForm";
import { FormSection } from "./FormSection";

type PaymentSectionProps = Pick<CheckoutForm, "values" | "setField"> & { disabled: boolean; payable: number };

export function PaymentSection({ values, setField, disabled, payable }: PaymentSectionProps) {
  const options = usePaymentOptions();
  const showParts = partsAvailable(options.data, payable);
  const methods: PaymentMethod[] = showParts ? [...PAYMENT_METHODS, "parts"] : PAYMENT_METHODS;
  const parts = options.data?.parts;
  const partsSelectedButHidden = values.payment_method === "parts" && !showParts && !options.isLoading;
  useEffect(() => {
    if (partsSelectedButHidden) setField("payment_method", "card");
  }, [partsSelectedButHidden, setField]);
  const description = (option: PaymentMethod) => {
    if (option === "parts" && parts) {
      return t("checkout.payment.partsHint", {
        min: formatPrice(parts.min_amount),
        counts: parts.counts.join("/"),
      });
    }
    return t(`checkout.payment.${option}Hint` as "checkout.payment.cardHint");
  };
  return (
    <FormSection title={t("checkout.payment.title")}>
      <div role="radiogroup" aria-label={t("checkout.payment.title")} className="flex flex-col gap-3">
        {methods.map((option) => (
          <RadioCard
            key={option}
            name="payment_method"
            value={option}
            checked={values.payment_method === option}
            onChange={() => setField("payment_method", option)}
            disabled={disabled}
            label={t(`checkout.payment.${option}`)}
            description={description(option)}
          />
        ))}
      </div>
      {values.payment_method === "parts" ? (
        <p className="text-muted text-[12px]">
          {t("checkout.payment.partsPhoneNote")}{" "}
          <Link href={routes.installments} target="_blank" className="text-ink underline underline-offset-2">
            {t("checkout.payment.partsTerms")}
          </Link>
        </p>
      ) : null}
    </FormSection>
  );
}
