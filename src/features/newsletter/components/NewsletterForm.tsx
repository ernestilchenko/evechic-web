"use client";

import { useMutation } from "@tanstack/react-query";
import { useId, useState } from "react";

import { ApiError } from "@/lib/api/client";
import { t } from "@/lib/i18n";

import { subscribeToNewsletter } from "../services/newsletterService";

export function NewsletterForm() {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const mutation = useMutation({ mutationFn: subscribeToNewsletter });

  const status = mutation.isSuccess
    ? t("newsletter.success")
    : mutation.error instanceof ApiError
      ? t("newsletter.error")
      : null;

  return (
    <form
      className="flex w-full flex-col gap-3 lg:w-auto"
      onSubmit={(event) => {
        event.preventDefault();
        mutation.mutate(email);
      }}
    >
      <div className="flex w-full flex-col sm:flex-row">
        <label htmlFor={inputId} className="sr-only">
          {t("newsletter.emailLabel")}
        </label>
        <input
          id={inputId}
          type="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t("newsletter.placeholder")}
          className="border-field bg-cream placeholder:text-placeholder focus:border-ink h-14 w-full border px-5 text-[13.5px] focus:outline-none sm:w-[300px]"
        />
        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-ink text-cream hover:bg-ink/85 h-14 px-8 text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors disabled:opacity-60 sm:w-[190px]"
        >
          {mutation.isPending ? t("newsletter.submitting") : t("newsletter.submit")}
        </button>
      </div>
      <p role="status" aria-live="polite" className="text-muted min-h-5 text-[13px]">
        {status}
      </p>
    </form>
  );
}
