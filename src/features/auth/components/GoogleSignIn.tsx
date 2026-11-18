"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

import { routes } from "@/data/routes";
import { siteConfig } from "@/data/site";
import { cartQueryKey } from "@/features/cart";
import { ApiError } from "@/lib/api/client";
import { t } from "@/lib/i18n";

import { sessionQueryKey } from "../hooks/useSession";
import { googleLogin } from "../services/authService";
import { forgetCartToken, readGuestCartToken } from "../utils/cartToken";
import { currentNextParam } from "../utils/currentNext";
import { withNext } from "../utils/redirect";

type GoogleIdentity = {
  accounts: {
    id: {
      initialize: (options: {
        client_id: string;
        callback: (response: { credential: string }) => void;
        ux_mode: "popup";
      }) => void;
      renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

const BUTTON_MAX_WIDTH = 400;

export function GoogleSignIn() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const container = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  const mutation = useMutation({
    mutationFn: googleLogin,
    onSuccess: async (result) => {
      const next = currentNextParam();
      forgetCartToken();
      queryClient.setQueryData(sessionQueryKey, result.user);
      await queryClient.invalidateQueries({ queryKey: cartQueryKey });
      router.replace(result.is_new ? withNext(routes.welcome, next) : (next ?? routes.account));
      router.refresh();
    },
  });
  const { mutate } = mutation;

  const render = useCallback(() => {
    const google = window.google;
    const element = container.current;
    if (!google || !element) return;
    google.accounts.id.initialize({
      client_id: siteConfig.googleClientId,
      ux_mode: "popup",
      callback: ({ credential }) => mutate({ credential, cart_token: readGuestCartToken() }),
    });
    google.accounts.id.renderButton(element, {
      type: "standard",
      theme: "outline",
      size: "large",
      shape: "rectangular",
      text: "continue_with",
      logo_alignment: "center",
      locale: "uk",
      width: Math.min(element.offsetWidth || BUTTON_MAX_WIDTH, BUTTON_MAX_WIDTH),
    });
  }, [mutate]);

  useEffect(() => {
    if (loaded || window.google) render();
  }, [loaded, render]);

  const error = mutation.isError
    ? mutation.error instanceof ApiError && mutation.error.status === 403
      ? t("auth.code.errorDisabled")
      : t("auth.google.error")
    : null;

  return (
    <div className="flex flex-col gap-3">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setLoaded(true)}
      />
      <div className="text-placeholder flex items-center gap-3 text-[10.5px] tracking-[0.2em] uppercase">
        <span className="bg-line h-px flex-1" />
        {t("auth.google.divider")}
        <span className="bg-line h-px flex-1" />
      </div>
      <div
        ref={container}
        aria-busy={mutation.isPending || undefined}
        className="flex min-h-[44px] w-full justify-center aria-busy:pointer-events-none aria-busy:opacity-60"
      />
      <p role="alert" className="text-sale text-center text-[12.5px] empty:hidden">
        {error}
      </p>
    </div>
  );
}
