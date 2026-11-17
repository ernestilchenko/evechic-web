"use client";

import { useEffect, useState } from "react";

import { useSession } from "@/features/auth";
import { t } from "@/lib/i18n";

import { NewsletterForm, SUBSCRIBED_KEY } from "./NewsletterForm";

const DISMISSED_KEY = "evechic:newsletter-dismissed";
const SHOW_AFTER_MS = 20_000;
const DISMISS_DAYS = 14;

function shouldShow() {
  try {
    if (window.localStorage.getItem(SUBSCRIBED_KEY)) return false;
    const dismissed = Number(window.localStorage.getItem(DISMISSED_KEY) || 0);
    return Date.now() - dismissed > DISMISS_DAYS * 86_400_000;
  } catch {
    return false;
  }
}

export function NewsletterPopup() {
  const { isAuthenticated } = useSession();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) return;
    const timer = window.setTimeout(() => {
      if (shouldShow()) setOpen(true);
    }, SHOW_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, [isAuthenticated]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function dismiss() {
    try {
      window.localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {}
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="newsletter-popup-title"
      className="bg-cream border-line fixed right-4 bottom-4 left-4 z-50 flex flex-col gap-4 border p-6 shadow-2xl sm:left-auto sm:w-[400px]"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label={t("newsletter.close")}
        className="text-muted hover:text-ink absolute top-3 right-4 text-xl leading-none"
      >
        ×
      </button>
      <p className="text-gold text-[10.5px] font-semibold tracking-[0.2em] uppercase">
        {t("newsletter.eyebrow")}
      </p>
      <h2 id="newsletter-popup-title" className="font-serif text-[30px] leading-[1.1] font-light">
        {t("newsletter.title")}
      </h2>
      <p className="text-muted text-[13px] leading-relaxed">{t("newsletter.text")}</p>
      <NewsletterForm onDone={() => window.setTimeout(() => setOpen(false), 4000)} />
      <button
        type="button"
        onClick={dismiss}
        className="text-muted hover:text-ink self-start text-[11.5px] underline"
      >
        {t("newsletter.noThanks")}
      </button>
    </div>
  );
}
