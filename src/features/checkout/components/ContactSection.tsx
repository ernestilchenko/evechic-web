"use client";

import { TextField } from "@/components/ui/TextField";
import { rememberCheckoutEmail } from "@/features/cart";
import { t } from "@/lib/i18n";

import { fieldId, type CheckoutForm } from "../hooks/useCheckoutForm";
import { formatPhone } from "../utils/phone";
import { FormSection } from "./FormSection";

type ContactSectionProps = Pick<CheckoutForm, "values" | "errors" | "setField"> & { disabled: boolean };

export function ContactSection({ values, errors, setField, disabled }: ContactSectionProps) {
  return (
    <FormSection title={t("checkout.contact.title")}>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id={fieldId("first_name")}
          label={t("checkout.contact.firstName")}
          placeholder={t("checkout.contact.firstNamePlaceholder")}
          autoComplete="given-name"
          required
          maxLength={100}
          value={values.first_name}
          onChange={(event) => setField("first_name", event.target.value)}
          error={errors.first_name}
          disabled={disabled}
        />
        <TextField
          id={fieldId("last_name")}
          label={t("checkout.contact.lastName")}
          placeholder={t("checkout.contact.lastNamePlaceholder")}
          autoComplete="family-name"
          required
          maxLength={100}
          value={values.last_name}
          onChange={(event) => setField("last_name", event.target.value)}
          error={errors.last_name}
          disabled={disabled}
        />
        <TextField
          id={fieldId("phone")}
          label={t("checkout.contact.phone")}
          placeholder={t("checkout.contact.phonePlaceholder")}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          value={values.phone}
          onFocus={() => {
            if (!values.phone) setField("phone", "+380 ");
          }}
          onChange={(event) => setField("phone", formatPhone(event.target.value))}
          error={errors.phone}
          disabled={disabled}
        />
        <TextField
          id={fieldId("email")}
          label={t("checkout.contact.email")}
          placeholder={t("checkout.contact.emailPlaceholder")}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={values.email}
          onChange={(event) => setField("email", event.target.value)}
          onBlur={(event) => rememberCheckoutEmail(event.target.value)}
          error={errors.email}
          disabled={disabled}
        />
      </div>
    </FormSection>
  );
}
