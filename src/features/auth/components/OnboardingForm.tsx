"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Checkbox } from "@/components/ui/Checkbox";
import { SizeChip } from "@/components/ui/SizeChip";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";

import { SIZE_OPTIONS } from "../constants/auth";
import { sessionQueryKey, useSession } from "../hooks/useSession";
import { completeOnboarding } from "../services/authService";
import { currentNextParam } from "../utils/currentNext";

import { AuthHeading } from "./AuthHeading";

const labelClass = "text-muted text-[9.5px] font-semibold tracking-[0.2em] uppercase";
const optionalClass = "text-placeholder text-[9.5px] tracking-[0.2em] uppercase";

export function OnboardingForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useSession();
  const [name, setName] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [consent, setConsent] = useState(true);

  const firstName = name ?? user?.first_name ?? "";
  const selectedSize = size ?? user?.preferred_size ?? "";

  const mutation = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: (result) => {
      queryClient.setQueryData(sessionQueryKey, result.user);
      router.replace(currentNextParam() ?? routes.catalog);
    },
  });

  return (
    <>
      <AuthHeading
        eyebrow={t("auth.welcome.eyebrow")}
        title={t("auth.welcome.title")}
        lead={t("auth.welcome.lead")}
      />
      <form
        className="flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate({
            first_name: firstName.trim(),
            preferred_size: selectedSize,
            marketing_consent: consent,
          });
        }}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="onboarding-name" className={labelClass}>
            {t("auth.welcome.nameLabel")}
          </label>
          <input
            id="onboarding-name"
            name="first_name"
            required
            maxLength={150}
            autoComplete="given-name"
            autoFocus
            value={firstName}
            onChange={(event) => setName(event.target.value)}
            placeholder={t("auth.welcome.namePlaceholder")}
            className="border-line placeholder:text-placeholder focus:border-ink h-14 w-full border bg-white px-[18px] text-sm focus:outline-none"
          />
        </div>
        <fieldset className="flex flex-col gap-2.5">
          <legend className="mb-2.5 flex w-full">
            <span className={`${labelClass} flex-1`}>{t("auth.welcome.sizeLabel")}</span>
            <span className={optionalClass}>{t("auth.welcome.optional")}</span>
          </legend>
          <div className="grid grid-cols-5 gap-2">
            {SIZE_OPTIONS.map((option) => (
              <SizeChip
                key={option}
                size="md"
                selected={selectedSize === option}
                onClick={() => setSize(selectedSize === option ? "" : option)}
                className="h-12 text-[12.5px]"
              >
                {option}
              </SizeChip>
            ))}
          </div>
        </fieldset>
        <Checkbox
          name="marketing_consent"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          label={t("auth.welcome.newsletter")}
          className="pt-1 text-[12.5px]"
        />
        <p className="bg-sand text-muted px-[18px] py-4 text-xs leading-[1.65]">{t("auth.welcome.promo")}</p>
        <p role="alert" className="text-sale text-[12.5px] empty:hidden">
          {mutation.isError ? t("auth.welcome.errorGeneric") : null}
        </p>
        <button
          type="submit"
          disabled={mutation.isPending || !firstName.trim()}
          className="bg-ink text-cream hover:bg-ink/85 h-[58px] w-full text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors disabled:opacity-60"
        >
          {mutation.isPending ? t("auth.welcome.submitting") : t("auth.welcome.submit")}
        </button>
        <button
          type="button"
          onClick={() => router.replace(currentNextParam() ?? routes.catalog)}
          className="text-muted hover:text-ink text-center text-[12.5px] font-semibold"
        >
          {t("auth.welcome.skip")}
        </button>
      </form>
    </>
  );
}
