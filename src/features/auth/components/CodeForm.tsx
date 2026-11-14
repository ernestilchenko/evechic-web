"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { cartQueryKey } from "@/features/cart";
import { routes } from "@/data/routes";
import { ApiError } from "@/lib/api/client";
import { t } from "@/lib/i18n";

import { LOGIN_CODE_LENGTH } from "../constants/auth";
import { useCountdown } from "../hooks/useCountdown";
import { useLoginFlow } from "../hooks/useLoginFlow";
import { sessionQueryKey } from "../hooks/useSession";
import { requestLoginCode, verifyLoginCode } from "../services/authService";
import { forgetCartToken, readGuestCartToken } from "../utils/cartToken";
import { formatCountdown } from "../utils/formatCountdown";
import { clearLoginFlow, updateLoginFlow } from "../utils/loginFlow";
import { withNext } from "../utils/redirect";

import { AuthHeading } from "./AuthHeading";
import { CodeInput } from "./CodeInput";

const emptyDigits = () => Array.from({ length: LOGIN_CODE_LENGTH }, () => "");

function verifyErrorMessage(error: unknown) {
  if (!(error instanceof ApiError)) return t("auth.code.errorGeneric");
  if (error.status === 403) return t("auth.code.errorDisabled");
  if (error.status !== 400) return t("auth.code.errorGeneric");
  const attemptsLeft = (error.data as { attempts_left?: number } | null)?.attempts_left;
  if (attemptsLeft === 0) return t("auth.code.errorExhausted");
  if (typeof attemptsLeft === "number") return t("auth.code.errorAttempts", { count: attemptsLeft });
  return t("auth.code.errorInvalid");
}

export function CodeForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const statusId = useId();
  const { flow, isReady } = useLoginFlow();
  const [digits, setDigits] = useState(emptyDigits);
  const [notice, setNotice] = useState<string | null>(null);
  const signedIn = useRef(false);
  const resend = useCountdown(flow?.resendAt ?? null);
  const expiry = useCountdown(flow?.expiresAt ?? null);

  useEffect(() => {
    if (isReady && !flow && !signedIn.current) router.replace(routes.login);
  }, [isReady, flow, router]);

  const verify = useMutation({
    mutationFn: verifyLoginCode,
    onSuccess: async (result) => {
      const next = flow?.next ?? null;
      signedIn.current = true;
      forgetCartToken();
      queryClient.setQueryData(sessionQueryKey, result.user);
      await queryClient.invalidateQueries({ queryKey: cartQueryKey });
      clearLoginFlow();
      router.replace(result.is_new ? withNext(routes.welcome, next) : (next ?? routes.account));
      router.refresh();
    },
    onError: () => setDigits(emptyDigits()),
  });

  const resendMutation = useMutation({
    mutationFn: requestLoginCode,
    onSuccess: (result) => {
      const now = Date.now();
      updateLoginFlow({
        resendAt: now + result.retry_after * 1000,
        expiresAt: now + result.expires_in * 1000,
      });
      verify.reset();
      setDigits(emptyDigits());
      setNotice(t("auth.code.resent"));
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 429) {
        const retryAfter = (error.data as { retry_after?: number } | null)?.retry_after ?? 60;
        updateLoginFlow({ resendAt: Date.now() + retryAfter * 1000 });
      }
    },
  });

  const submit = (code: string[]) => {
    if (!flow || verify.isPending || code.some((digit) => !digit)) return;
    setNotice(null);
    verify.mutate({ email: flow.email, code: code.join(""), cart_token: readGuestCartToken() });
  };

  const error = verify.isError
    ? verifyErrorMessage(verify.error)
    : resendMutation.isError &&
        !(resendMutation.error instanceof ApiError && resendMutation.error.status === 429)
      ? t("auth.login.errorGeneric")
      : expiry.isDone
        ? t("auth.code.expired")
        : null;

  return (
    <>
      <Link
        href={flow?.next ? withNext(routes.login, flow.next) : routes.login}
        onClick={() => clearLoginFlow()}
        className="text-muted hover:text-ink self-start text-[10.5px] font-semibold tracking-[0.18em] uppercase"
      >
        {t("auth.code.back")}
      </Link>
      <AuthHeading
        title={t("auth.code.title")}
        lead={flow ? t("auth.code.lead", { email: flow.email }) : null}
      />
      <form
        className="flex flex-col gap-5 pt-2.5"
        onSubmit={(event) => {
          event.preventDefault();
          submit(digits);
        }}
      >
        <CodeInput
          length={LOGIN_CODE_LENGTH}
          value={digits}
          disabled={!flow || verify.isPending || verify.isSuccess}
          invalid={verify.isError}
          describedBy={statusId}
          onChange={(next) => {
            setDigits(next);
            if (verify.isError) verify.reset();
            if (next.every(Boolean)) submit(next);
          }}
        />
        <div className="min-h-5 text-[12.5px]">
          {resend.seconds !== null && !resend.isDone ? (
            <p className="flex gap-1.5">
              <span className="text-placeholder">{t("auth.code.resendIn")}</span>
              <span className="font-semibold tabular-nums">{formatCountdown(resend.seconds)}</span>
            </p>
          ) : resend.isDone && flow ? (
            <button
              type="button"
              disabled={resendMutation.isPending}
              onClick={() => resendMutation.mutate(flow.email)}
              className="text-gold hover:text-ink font-semibold disabled:opacity-60"
            >
              {t("auth.code.resend")}
            </button>
          ) : null}
        </div>
        <p id={statusId} role="status" aria-live="polite" className="-mt-2 text-[12.5px] empty:hidden">
          {error ? (
            <span className="text-sale">{error}</span>
          ) : verify.isSuccess ? (
            <span className="text-success">{t("auth.code.success")}</span>
          ) : notice ? (
            <span className="text-muted">{notice}</span>
          ) : null}
        </p>
        <button
          type="submit"
          disabled={!flow || verify.isPending || verify.isSuccess || digits.some((digit) => !digit)}
          className="bg-ink text-cream hover:bg-ink/85 h-[58px] w-full text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors disabled:opacity-60"
        >
          {verify.isPending ? t("auth.code.submitting") : t("auth.code.submit")}
        </button>
      </form>
    </>
  );
}
