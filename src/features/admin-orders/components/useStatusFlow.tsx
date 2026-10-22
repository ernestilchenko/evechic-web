"use client";

import { useState } from "react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { OrderStatus } from "@/features/admin";
import { t } from "@/lib/i18n";

import { DESTRUCTIVE_STATUSES } from "../constants/orders";
import { useChangeOrderStatus } from "../hooks/useOrders";

type Pending = { number: number; status: OrderStatus } | null;

export function useStatusFlow() {
  const mutation = useChangeOrderStatus();
  const [pending, setPending] = useState<Pending>(null);

  const request = (number: number, status: OrderStatus) => {
    if (DESTRUCTIVE_STATUSES.includes(status)) setPending({ number, status });
    else mutation.mutate({ number, status });
  };

  const dialog = (
    <ConfirmDialog
      open={pending !== null}
      tone="danger"
      title={
        pending
          ? t(`adminOrders.confirm.${pending.status === "cancelled" ? "cancelTitle" : "returnTitle"}`, {
              number: pending.number,
            })
          : ""
      }
      message={
        pending
          ? t(`adminOrders.confirm.${pending.status === "cancelled" ? "cancelText" : "returnText"}`)
          : undefined
      }
      confirmLabel={t("adminOrders.confirm.confirm")}
      cancelLabel={t("adminOrders.confirm.cancel")}
      pending={mutation.isPending}
      onCancel={() => setPending(null)}
      onConfirm={() => {
        if (!pending) return;
        mutation.mutate(pending, { onSettled: () => setPending(null) });
      }}
    />
  );

  return { request, dialog, isPending: mutation.isPending };
}
