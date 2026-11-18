"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { routes } from "@/data/routes";
import { ApiError } from "@/lib/api/client";
import { t } from "@/lib/i18n";

import { requestLoginCode } from "../services/authService";
import { saveLoginFlow } from "../utils/loginFlow";
import { currentNextParam } from "../utils/currentNext";

import { AuthHeading } from "./AuthHeading";
import { GoogleSignIn } from "./GoogleSignIn";

function retryAfterFrom(error: unknown) {
  if (!(error instanceof ApiError) || error.status !== 429) return null;
  const value = (error.data as { retry_after?: number } | null)?.retry_after;
  return typeof value === "number" ? value : 60;
}

export function LoginForm() {
  const inputId = useId();
  const errorId = useId();
  const router = useRouter();
  const [email, setEmail] = useState("");

  const mutation = useMutation({
    mutationFn: requestLoginCode,
    onSuccess: (result, submittedEmail) => {
      const now = Date.now();
      saveLoginFlow({
        email: result.email || submittedEmail,
        next: currentNextParam(),
        resendAt: now + result.retry_after * 1000,
        expiresAt: now + result.expires_in * 1000,
      });
      router.push(routes.loginCode);
    },
    onError: (error, submittedEmail) => {
      const retryAfter = retryAfterFrom(error);
      if (retryAfter === null) return;
      saveLoginFlow({
        email: submittedEmail,
        next: currentNextParam(),
        resendAt: Date.now() + retryAfter * 1000,
        expiresAt: null,
      });
      router.push(routes.loginCode);
    },
  });

  const error =
    mutation.isError && retryAfterFrom(mutation.error) === null
      ? mutation.error instanceof ApiError && mutation.error.status === 400
        ? t("auth.login.errorInvalidEmail")
        : t("auth.login.errorGeneric")
      : null;

  return (
    <>
      <AuthHeading
        eyebrow={t("auth.login.eyebrow")}
        title={t("auth.login.title")}
        lead={t("auth.login.lead")}
      />
      <form
        className="flex flex-col gap-5 pt-2.5"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate(email.trim().toLowerCase());
        }}
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor={inputId}
            className="text-muted text-[9.5px] font-semibold tracking-[0.2em] uppercase"
          >
            {t("auth.login.emailLabel")}
          </label>
          <input
            id={inputId}
            type="email"
            name="email"
            required
            autoComplete="email"
            inputMode="email"
            autoFocus
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t("auth.login.emailPlaceholder")}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className="border-line placeholder:text-placeholder focus:border-ink aria-[invalid=true]:border-sale h-[58px] w-full border bg-white px-[18px] text-sm focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-ink text-cream hover:bg-ink/85 h-[58px] w-full text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors disabled:opacity-60"
        >
          {mutation.isPending ? t("auth.login.submitting") : t("auth.login.submit")}
        </button>
        <p id={errorId} role="alert" className="text-sale -mt-2 min-h-5 text-[12.5px] empty:hidden">
          {error}
        </p>
      </form>
      <GoogleSignIn />
      <p className="flex flex-wrap justify-center gap-2 pt-2 text-[12.5px]">
        <span className="text-muted">{t("auth.login.guestPrompt")}</span>
        <Link href={routes.checkout} className="text-gold hover:text-ink font-semibold">
          {t("auth.login.guestLink")}
        </Link>
      </p>
      <p className="text-placeholder text-center text-[11px] leading-[1.68]">
        {t("auth.login.legalStart")}{" "}
        <Link href={routes.offer} className="hover:text-ink underline underline-offset-2">
          {t("auth.login.legalOffer")}
        </Link>{" "}
        {t("auth.login.legalAnd")}{" "}
        <Link href={routes.privacy} className="hover:text-ink underline underline-offset-2">
          {t("auth.login.legalPrivacy")}
        </Link>
        .
      </p>
    </>
  );
}
