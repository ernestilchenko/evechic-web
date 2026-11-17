"use client";

import { useMutation } from "@tanstack/react-query";
import { useId, useState } from "react";

import { apiErrorText } from "@/lib/apiMessage";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";

import { subscribeToNewsletter } from "../services/newsletterService";

export const SUBSCRIBED_KEY = "evechic:newsletter-subscribed";

export function rememberSubscribed() {
  try {
    window.localStorage.setItem(SUBSCRIBED_KEY, "1");
  } catch {}
}

export function NewsletterForm({ tone = "light", onDone }: { tone?: "light" | "dark"; onDone?: () => void }) {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const subscribe = useMutation({
    mutationFn: () => subscribeToNewsletter(email.trim()),
    onSuccess: () => {
      rememberSubscribed();
      onDone?.();
    },
  });

  if (subscribe.isSuccess) {
    return (
      <p
        className={cn("text-[12.5px] leading-relaxed", tone === "dark" ? "text-cream" : "text-success")}
        role="status"
      >
        {subscribe.data.welcome_promo_sent ? t("newsletter.done") : t("newsletter.already")}
      </p>
    );
  }

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        subscribe.mutate();
      }}
    >
      <div className="flex">
        <label htmlFor={inputId} className="sr-only">
          {t("newsletter.email")}
        </label>
        <input
          id={inputId}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t("newsletter.email")}
          className={cn(
            "h-[48px] min-w-0 flex-1 border border-r-0 px-4 text-[13px] focus:outline-none",
            tone === "dark"
              ? "border-footer-line text-cream placeholder:text-footer-dim focus:border-cream bg-transparent"
              : "border-field bg-cream placeholder:text-placeholder focus:border-ink",
          )}
        />
        <button
          type="submit"
          disabled={subscribe.isPending}
          className={cn(
            "h-[48px] shrink-0 border px-5 text-[10.5px] font-semibold tracking-[0.16em] uppercase transition-colors disabled:opacity-50",
            tone === "dark"
              ? "border-cream text-cream hover:bg-cream hover:text-ink"
              : "border-ink bg-ink text-cream hover:bg-ink/85",
          )}
        >
          {t("newsletter.submit")}
        </button>
      </div>
      {subscribe.error ? (
        <p className="text-sale text-[11.5px]" role="alert">
          {apiErrorText(subscribe.error, "newsletter.error")}
        </p>
      ) : null}
    </form>
  );
}
