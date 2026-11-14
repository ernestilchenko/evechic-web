"use client";

import { useMutation } from "@tanstack/react-query";
import { useId, useState } from "react";

import { useSession } from "@/features/auth";
import { apiFetch } from "@/lib/api/client";
import { apiErrorText } from "@/lib/apiMessage";
import type { ProductVariant } from "@/lib/api/types";
import { t } from "@/lib/i18n";

type NotifyStockProps = {
  productSlug: string;
  variants: ProductVariant[];
};

export function NotifyStock({ productSlug, variants }: NotifyStockProps) {
  const { user } = useSession();
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [variantId, setVariantId] = useState<number | null>(variants[0]?.id ?? null);
  const [email, setEmail] = useState("");
  const subscribe = useMutation({
    mutationFn: () =>
      apiFetch<null>(`products/${productSlug}/notify-stock/`, {
        method: "POST",
        body: { variant_id: variantId, email: email || user?.email || "" },
      }),
  });

  if (variants.length === 0) return null;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-gold hover:text-ink self-start text-[12px] underline underline-offset-2"
      >
        {t("productPage.notifyStock.open")}
      </button>
    );
  }

  if (subscribe.isSuccess) {
    return <p className="text-success text-[12.5px]">{t("productPage.notifyStock.done")}</p>;
  }

  return (
    <form
      aria-labelledby={`${formId}-title`}
      className="bg-sand flex flex-col gap-3 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        subscribe.mutate();
      }}
    >
      <p id={`${formId}-title`} className="text-[12.5px] font-medium">
        {t("productPage.notifyStock.title")}
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor={`${formId}-size`}>
          {t("productPage.size")}
        </label>
        <select
          id={`${formId}-size`}
          value={variantId ?? ""}
          onChange={(event) => setVariantId(Number(event.target.value))}
          className="border-line h-11 border bg-white px-3 text-[13px]"
        >
          {variants.map((variant) => (
            <option key={variant.id} value={variant.id}>
              {variant.size}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor={`${formId}-email`}>
          Email
        </label>
        <input
          id={`${formId}-email`}
          type="email"
          required={!user?.email}
          placeholder={user?.email ?? "your@email.com"}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="border-line h-11 flex-1 border bg-white px-3 text-[13px]"
        />
        <button
          type="submit"
          disabled={subscribe.isPending}
          className="bg-ink text-cream h-11 px-5 text-[10.5px] font-semibold tracking-[0.14em] uppercase disabled:opacity-60"
        >
          {t("productPage.notifyStock.submit")}
        </button>
      </div>
      {subscribe.isError ? (
        <p className="text-sale text-[12px]">
          {apiErrorText(subscribe.error, "productPage.notifyStock.error")}
        </p>
      ) : null}
    </form>
  );
}
