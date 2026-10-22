"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { OrderDetail } from "@/lib/api/types";
import { formatDate } from "@/lib/format";
import { t } from "@/lib/i18n";

import { accountQueryKeys } from "../constants/account";
import { cancelOrder, payOrder, requestOrderReturn } from "../services/accountService";

import { RepeatOrderButton } from "./RepeatOrderButton";
import { ReturnDialog } from "./ReturnDialog";

const secondaryClass =
  "border-line hover:border-ink border px-[22px] py-3.5 text-[10.5px] leading-none font-semibold tracking-[0.16em] whitespace-nowrap uppercase transition-colors disabled:opacity-60";

export function OrderActions({ order }: { order: OrderDetail }) {
  const queryClient = useQueryClient();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  const onUpdated = (updated: OrderDetail) => {
    queryClient.setQueryData(accountQueryKeys.order(String(order.number)), updated);
    void queryClient.invalidateQueries({ queryKey: ["account", "orders"] });
    void queryClient.invalidateQueries({ queryKey: accountQueryKeys.summary });
  };
  const onError = () => setMessage({ tone: "error", text: t("account.order.error") });

  const cancel = useMutation({
    mutationFn: () => cancelOrder(order.number),
    onSuccess: (updated) => {
      setConfirmCancel(false);
      onUpdated(updated);
    },
    onError: () => {
      setConfirmCancel(false);
      onError();
    },
  });

  const requestReturn = useMutation({
    mutationFn: (reason: string) => requestOrderReturn(order.number, reason),
    onSuccess: (updated) => {
      setReturnOpen(false);
      setMessage({ tone: "success", text: t("account.order.returnSent") });
      onUpdated(updated);
    },
  });

  const pay = useMutation({
    mutationFn: () => payOrder(order.number),
    onSuccess: (link) => window.location.assign(link.payment_url),
    onError,
  });

  const canPay =
    order.payment_method === "card" &&
    (order.payment_status === "pending" || order.payment_status === "failed") &&
    order.status !== "cancelled" &&
    Number(order.total) > 0;

  return (
    <section aria-labelledby="order-actions-title" className="flex flex-col gap-3">
      <h2 id="order-actions-title" className="sr-only">
        {t("account.order.actions")}
      </h2>
      <div className="flex flex-wrap gap-3">
        {canPay ? (
          <button
            type="button"
            onClick={() => pay.mutate()}
            disabled={pay.isPending}
            className="bg-gold text-cream hover:bg-gold/85 px-[22px] py-3.5 text-[10.5px] leading-none font-semibold tracking-[0.16em] uppercase disabled:opacity-60"
          >
            {pay.isPending ? t("account.order.paying") : t("account.order.pay")}
          </button>
        ) : null}
        <RepeatOrderButton number={order.number} onError={(text) => setMessage({ tone: "error", text })} />
        {order.can_return ? (
          <button
            type="button"
            onClick={() => {
              requestReturn.reset();
              setReturnOpen(true);
            }}
            className={secondaryClass}
          >
            {t("account.order.returnRequest")}
          </button>
        ) : null}
        {order.can_cancel ? (
          <button type="button" onClick={() => setConfirmCancel(true)} className={secondaryClass}>
            {t("account.order.cancel")}
          </button>
        ) : null}
      </div>
      {order.can_return && order.return_deadline ? (
        <p className="text-muted text-xs">
          {t("account.order.returnDeadline", { date: formatDate(order.return_deadline) })}
        </p>
      ) : null}
      <p role="status" aria-live="polite" className="text-[12.5px] empty:hidden">
        {message ? (
          <span className={message.tone === "error" ? "text-sale" : "text-success"}>{message.text}</span>
        ) : null}
      </p>
      <ConfirmDialog
        open={confirmCancel}
        title={t("account.order.cancelConfirm", { number: order.number })}
        confirmLabel={cancel.isPending ? t("account.order.cancelling") : t("account.order.cancel")}
        cancelLabel={t("account.order.returnClose")}
        tone="danger"
        pending={cancel.isPending}
        onConfirm={() => cancel.mutate()}
        onCancel={() => setConfirmCancel(false)}
      />
      <ReturnDialog
        open={returnOpen}
        pending={requestReturn.isPending}
        error={requestReturn.isError ? t("account.order.error") : null}
        onClose={() => setReturnOpen(false)}
        onSubmit={(reason) => requestReturn.mutate(reason)}
      />
    </section>
  );
}
