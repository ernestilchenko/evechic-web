"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { t } from "@/lib/i18n";

import { unsubscribeFromNewsletter } from "../services/newsletterService";

export function UnsubscribeView() {
  const token = useSearchParams().get("token") ?? "";
  const result = useQuery({
    queryKey: ["newsletter-unsubscribe", token],
    queryFn: () => unsubscribeFromNewsletter(token),
    enabled: Boolean(token),
    retry: false,
    staleTime: Infinity,
  });

  let text = t("newsletter.unsubscribe.loading");
  if (!token || result.isError) text = t("newsletter.unsubscribe.error");
  else if (result.isSuccess) text = t("newsletter.unsubscribe.done");

  return (
    <section className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <h1 className="font-serif text-[40px] font-light">{t("newsletter.unsubscribe.title")}</h1>
      <p className="text-muted max-w-[460px] text-[14px] leading-relaxed" role="status">
        {text}
      </p>
    </section>
  );
}
