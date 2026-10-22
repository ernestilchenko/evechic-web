"use client";

import { Textarea } from "@/components/ui/Textarea";
import { formatPrice } from "@/lib/format";
import { t } from "@/lib/i18n";

import { fieldId, type CheckoutForm } from "../hooks/useCheckoutForm";
import { Checkbox } from "./Checkbox";
import { FormSection } from "./FormSection";

type CommentSectionProps = Pick<CheckoutForm, "values" | "errors" | "setField"> & {
  bonuses: { available: number; spend: number } | null;
  disabled: boolean;
};

export function CommentSection({ values, errors, setField, bonuses, disabled }: CommentSectionProps) {
  return (
    <FormSection title={t("checkout.comment.title")}>
      <Textarea
        id={fieldId("comment")}
        label={t("checkout.comment.label")}
        hideLabel
        placeholder={t("checkout.comment.placeholder")}
        value={values.comment}
        onChange={(event) => setField("comment", event.target.value)}
        error={errors.comment}
        maxLength={1000}
        disabled={disabled}
      />
      <Checkbox
        checked={values.skip_confirmation_call}
        onChange={(event) => setField("skip_confirmation_call", event.target.checked)}
        disabled={disabled}
        label={t("checkout.comment.skipCall")}
      />
      {bonuses ? (
        <Checkbox
          checked={values.use_bonuses}
          onChange={(event) => setField("use_bonuses", event.target.checked)}
          disabled={disabled}
          label={t("checkout.bonuses.use")}
          description={t("checkout.bonuses.available", {
            amount: formatPrice(bonuses.available),
            spend: formatPrice(bonuses.spend),
          })}
        />
      ) : null}
    </FormSection>
  );
}
