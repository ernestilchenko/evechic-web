"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId, useState } from "react";

import { TextField, fieldInputClass } from "@/components/ui/TextField";
import { SIZE_OPTIONS, sessionQueryKey, useSession, type SessionUser } from "@/features/auth";
import { ApiError } from "@/lib/api/client";
import type { ProfileUpdate } from "@/lib/api/types";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";

import { updateProfile } from "../services/accountService";

type FieldErrors = Partial<Record<keyof ProfileUpdate, string>>;

function fieldErrors(error: unknown): FieldErrors {
  if (!(error instanceof ApiError) || !error.data || typeof error.data !== "object") return {};
  return Object.fromEntries(
    Object.entries(error.data as Record<string, unknown>).map(([key, value]) => [
      key,
      Array.isArray(value) ? String(value[0]) : String(value),
    ]),
  );
}

function ProfileFields({ user }: { user: SessionUser }) {
  const queryClient = useQueryClient();
  const sizeId = useId();
  const [values, setValues] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone,
    birth_date: user.birth_date ?? "",
    preferred_size: user.preferred_size,
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updated) => queryClient.setQueryData(sessionQueryKey, updated),
  });
  const errors = mutation.isError ? fieldErrors(mutation.error) : {};

  const bind = (name: keyof typeof values) => ({
    name,
    value: values[name],
    error: errors[name],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((current) => ({ ...current, [name]: event.target.value }));
      if (mutation.isSuccess) mutation.reset();
    },
  });

  return (
    <form
      className="border-line flex flex-col gap-[22px] border bg-white px-5 py-6 sm:px-[30px] sm:py-7"
      aria-labelledby="profile-section-title"
      onSubmit={(event) => {
        event.preventDefault();
        mutation.mutate({
          first_name: values.first_name.trim(),
          last_name: values.last_name.trim(),
          phone: values.phone.replace(/[\s()-]/g, ""),
          birth_date: values.birth_date || null,
          preferred_size: values.preferred_size,
        });
      }}
    >
      <h2 id="profile-section-title" className="text-[11px] font-semibold tracking-[0.2em] uppercase">
        {t("account.profile.sectionTitle")}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label={t("account.profile.firstName")}
          required
          maxLength={150}
          autoComplete="given-name"
          {...bind("first_name")}
        />
        <TextField
          label={t("account.profile.lastName")}
          maxLength={150}
          autoComplete="family-name"
          {...bind("last_name")}
        />
        <TextField
          label={t("account.profile.phone")}
          type="tel"
          autoComplete="tel"
          placeholder={t("account.profile.phonePlaceholder")}
          hint={t("account.profile.phoneHint")}
          {...bind("phone")}
        />
        <TextField
          label={t("account.profile.email")}
          type="email"
          value={user.email}
          readOnly
          aria-readonly
          hint={t("account.profile.emailHint")}
          className="bg-cream text-muted"
        />
        <TextField
          label={t("account.profile.birthDate")}
          type="date"
          autoComplete="bday"
          {...bind("birth_date")}
        />
        <div className="flex min-w-0 flex-col gap-2">
          <label htmlFor={sizeId} className="text-muted text-[11px] tracking-[0.06em]">
            {t("account.profile.size")}
          </label>
          <span className="relative inline-flex">
            <select
              id={sizeId}
              name="preferred_size"
              value={values.preferred_size}
              onChange={(event) =>
                setValues((current) => ({ ...current, preferred_size: event.target.value }))
              }
              className={cn(fieldInputClass, "h-[52px] appearance-none pr-10")}
            >
              <option value="">{t("account.profile.sizeNone")}</option>
              {SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
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
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-ink text-cream hover:bg-ink/85 px-[30px] py-4 text-[10.5px] leading-none font-semibold tracking-[0.16em] uppercase disabled:opacity-60"
        >
          {mutation.isPending ? t("account.profile.saving") : t("account.profile.save")}
        </button>
        <p role="status" aria-live="polite" className="text-[12.5px] empty:hidden">
          {mutation.isSuccess ? (
            <span className="text-success">{t("account.profile.saved")}</span>
          ) : mutation.isError ? (
            <span className="text-sale">{t("account.profile.error")}</span>
          ) : null}
        </p>
      </div>
    </form>
  );
}

export function ProfileForm() {
  const { user } = useSession();
  if (!user) return null;
  return <ProfileFields key={user.id} user={user} />;
}
