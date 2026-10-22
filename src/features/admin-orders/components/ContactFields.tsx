"use client";

import { Field, TextInput } from "@/features/admin";
import { t } from "@/lib/i18n";

export type ContactValues = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
};

type ContactFieldsProps = {
  values: ContactValues;
  errors?: Record<string, string>;
  onChange: (values: ContactValues) => void;
};

export function ContactFields({ values, errors = {}, onChange }: ContactFieldsProps) {
  const set = (patch: Partial<ContactValues>) => onChange({ ...values, ...patch });
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label={t("adminOrders.field.firstName")} error={errors.first_name}>
        {(props) => (
          <TextInput
            {...props}
            required
            value={values.first_name}
            onChange={(event) => set({ first_name: event.target.value })}
          />
        )}
      </Field>
      <Field label={t("adminOrders.field.lastName")} error={errors.last_name}>
        {(props) => (
          <TextInput
            {...props}
            required
            value={values.last_name}
            onChange={(event) => set({ last_name: event.target.value })}
          />
        )}
      </Field>
      <Field label={t("adminOrders.field.phone")} error={errors.phone}>
        {(props) => (
          <TextInput
            {...props}
            required
            type="tel"
            autoComplete="off"
            value={values.phone}
            onChange={(event) => set({ phone: event.target.value })}
          />
        )}
      </Field>
      <Field label={t("adminOrders.field.email")} error={errors.email}>
        {(props) => (
          <TextInput
            {...props}
            required
            type="email"
            autoComplete="off"
            value={values.email}
            onChange={(event) => set({ email: event.target.value })}
          />
        )}
      </Field>
    </div>
  );
}
