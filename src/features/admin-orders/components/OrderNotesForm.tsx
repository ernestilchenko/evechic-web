"use client";

import { useState } from "react";

import { AdminButton, Field, Panel, TextArea, TextInput } from "@/features/admin";
import { t } from "@/lib/i18n";

import { useUpdateOrder } from "../hooks/useOrders";
import type { AdminOrder } from "../types";

export function OrderNotesForm({ order }: { order: AdminOrder }) {
  const mutation = useUpdateOrder(order.number);
  const [tracking, setTracking] = useState(order.tracking_number);
  const [note, setNote] = useState(order.manager_note);
  const dirty = tracking !== order.tracking_number || note !== order.manager_note;

  return (
    <Panel title={t("adminOrders.detail.fulfilment")} titleId="order-fulfilment">
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate({ tracking_number: tracking.trim(), manager_note: note });
        }}
      >
        <Field label={t("adminOrders.field.tracking")} hint={t("adminOrders.field.trackingHint")}>
          {(props) => (
            <TextInput
              {...props}
              value={tracking}
              maxLength={40}
              onChange={(event) => setTracking(event.target.value)}
            />
          )}
        </Field>
        <Field label={t("adminOrders.field.managerNote")} hint={t("adminOrders.field.managerNoteHint")}>
          {(props) => (
            <TextArea {...props} value={note} onChange={(event) => setNote(event.target.value)} rows={3} />
          )}
        </Field>
        {order.comment ? (
          <div className="bg-admin-bg rounded px-3.5 py-3 text-[12px]">
            <p className="text-muted pb-1 text-[11px] font-semibold">{t("adminOrders.field.comment")}</p>
            <p className="whitespace-pre-line">{order.comment}</p>
          </div>
        ) : null}
        <AdminButton type="submit" disabled={!dirty || mutation.isPending} className="self-start">
          {mutation.isPending ? t("adminOrders.saving") : t("adminOrders.save")}
        </AdminButton>
      </form>
    </Panel>
  );
}
