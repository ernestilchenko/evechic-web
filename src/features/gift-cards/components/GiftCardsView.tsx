"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { apiErrorText } from "@/lib/apiMessage";
import { t } from "@/lib/i18n";

import { purchaseGiftCard } from "../services/giftCardsService";
import { GiftCardVisual } from "./GiftCardVisual";

const AMOUNTS = [1000, 2000, 3000];
const inputClass =
  "border-field bg-cream placeholder:text-placeholder focus:border-ink h-[50px] w-full border px-4 text-[13px] focus:outline-none";

export function GiftCardsView() {
  const [amount, setAmount] = useState(2000);
  const [forSomeone, setForSomeone] = useState(true);
  const [form, setForm] = useState({
    buyer_name: "",
    buyer_email: "",
    recipient_name: "",
    recipient_email: "",
    message: "",
  });
  const set = (patch: Partial<typeof form>) => setForm((state) => ({ ...state, ...patch }));
  const purchase = useMutation({
    mutationFn: () =>
      purchaseGiftCard({
        amount: String(amount),
        ...form,
        recipient_name: forSomeone ? form.recipient_name : "",
        recipient_email: forSomeone ? form.recipient_email : "",
      }),
    onSuccess: (data) => window.location.assign(data.payment_url),
  });

  return (
    <div className="container-page grid gap-12 py-12 lg:grid-cols-[1fr_460px] lg:gap-20 lg:py-20">
      <div className="flex flex-col gap-6">
        <p className="text-gold text-[11px] font-medium tracking-[0.22em] uppercase">
          {t("giftCards.eyebrow")}
        </p>
        <h1 className="font-serif text-[44px] leading-[1.05] font-light sm:text-[58px]">
          {t("giftCards.title")}
        </h1>
        <p className="text-muted max-w-[520px] text-[15px] leading-[1.7]">{t("giftCards.text")}</p>
        <ul className="text-muted flex flex-col gap-2 text-[13px]">
          {(["step1", "step2", "step3"] as const).map((step) => (
            <li key={step}>— {t(`giftCards.${step}`)}</li>
          ))}
        </ul>
        <div role="radiogroup" aria-label={t("giftCards.amount")} className="grid gap-4 pt-4 sm:grid-cols-3">
          {AMOUNTS.map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={amount === value}
              onClick={() => setAmount(value)}
              className="text-left"
            >
              <GiftCardVisual amount={value} selected={amount === value} />
            </button>
          ))}
        </div>
      </div>

      <form
        className="bg-sand flex flex-col gap-4 self-start p-6 sm:p-8"
        onSubmit={(event) => {
          event.preventDefault();
          purchase.mutate();
        }}
      >
        <h2 className="text-muted text-[10.5px] font-semibold tracking-[0.22em] uppercase">
          {t("giftCards.formTitle")}
        </h2>
        <input
          className={inputClass}
          required
          maxLength={100}
          placeholder={t("giftCards.buyerName")}
          aria-label={t("giftCards.buyerName")}
          autoComplete="name"
          value={form.buyer_name}
          onChange={(event) => set({ buyer_name: event.target.value })}
        />
        <input
          className={inputClass}
          required
          type="email"
          placeholder={t("giftCards.buyerEmail")}
          aria-label={t("giftCards.buyerEmail")}
          autoComplete="email"
          value={form.buyer_email}
          onChange={(event) => set({ buyer_email: event.target.value })}
        />
        <label className="flex items-center gap-2.5 text-[13px]">
          <input
            type="checkbox"
            className="accent-ink size-4"
            checked={forSomeone}
            onChange={(event) => setForSomeone(event.target.checked)}
          />
          {t("giftCards.forSomeone")}
        </label>
        {forSomeone ? (
          <>
            <input
              className={inputClass}
              maxLength={100}
              placeholder={t("giftCards.recipientName")}
              aria-label={t("giftCards.recipientName")}
              value={form.recipient_name}
              onChange={(event) => set({ recipient_name: event.target.value })}
            />
            <input
              className={inputClass}
              required
              type="email"
              placeholder={t("giftCards.recipientEmail")}
              aria-label={t("giftCards.recipientEmail")}
              value={form.recipient_email}
              onChange={(event) => set({ recipient_email: event.target.value })}
            />
            <textarea
              className={`${inputClass} h-24 py-3`}
              maxLength={300}
              placeholder={t("giftCards.message")}
              aria-label={t("giftCards.message")}
              value={form.message}
              onChange={(event) => set({ message: event.target.value })}
            />
          </>
        ) : null}
        <Button
          type="submit"
          disabled={purchase.isPending || purchase.isSuccess}
          className="h-[56px] w-full py-0"
        >
          {purchase.isPending || purchase.isSuccess
            ? t("giftCards.redirecting")
            : t("giftCards.pay", { amount: amount.toLocaleString("uk-UA") })}
        </Button>
        {purchase.error ? (
          <p className="text-sale text-[12px]" role="alert">
            {apiErrorText(purchase.error, "giftCards.error")}
          </p>
        ) : null}
        <p className="text-muted text-[11.5px] leading-relaxed">{t("giftCards.note")}</p>
      </form>
    </div>
  );
}
