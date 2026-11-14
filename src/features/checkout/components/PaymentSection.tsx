"use client";

import { RadioCard } from "@/components/ui/RadioCard";
import { siteConfig } from "@/data/site";
import { t } from "@/lib/i18n";

import { PAYMENT_METHODS } from "../constants/options";
import type { CheckoutForm } from "../hooks/useCheckoutForm";
import { FormSection } from "./FormSection";

type PaymentSectionProps = Pick<CheckoutForm, "values" | "setField"> & { disabled: boolean };

export function PaymentSection({ values, setField, disabled }: PaymentSectionProps) {
  return (
    <FormSection title={t("checkout.payment.title")}>
      <div role="radiogroup" aria-label={t("checkout.payment.title")} className="flex flex-col gap-3">
        {PAYMENT_METHODS.map((option) => (
          <RadioCard
            key={option}
            name="payment_method"
            value={option}
            checked={values.payment_method === option}
            onChange={() => setField("payment_method", option)}
            disabled={disabled}
            label={t(`checkout.payment.${option}`)}
            description={
              option === "card" && siteConfig.installments.enabled
                ? t("checkout.payment.cardHintInstallments")
                : t(`checkout.payment.${option}Hint`)
            }
          />
        ))}
      </div>
    </FormSection>
  );
}
