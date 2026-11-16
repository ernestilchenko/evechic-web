"use client";

import { useState } from "react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { AdminButton, Field, formatDateTime, Panel, TextInput } from "@/features/admin";
import { t } from "@/lib/i18n";

import { useWaybill } from "../hooks/useOrders";
import type { AdminOrder } from "../types";

const DEFAULT_WEIGHT = "0.5";
const NOT_HANDED_OVER = [null, 1];

function SupplierNotice({ order }: { order: AdminOrder }) {
  const supplierCount = order.supplier_item_ids.length;
  if (supplierCount === 0) return null;
  const all = supplierCount === order.items.length;
  return (
    <p className="bg-admin-warn-bg text-admin-warn mb-4 rounded-md px-3.5 py-2.5 text-[12px] leading-relaxed">
      {t(all ? "adminOrders.waybill.supplierAll" : "adminOrders.waybill.supplierPart")}
    </p>
  );
}

export function OrderWaybill({ order }: { order: AdminOrder }) {
  const waybill = useWaybill(order.number);
  const [weight, setWeight] = useState(DEFAULT_WEIGHT);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (order.delivery_method === "pickup") return null;

  const canDelete =
    Boolean(order.np_document_ref) && NOT_HANDED_OVER.includes(order.tracking_status_code ?? null);
  const pending = waybill.isPending;

  return (
    <Panel title={t("adminOrders.waybill.title")} titleId="order-waybill">
      <SupplierNotice order={order} />
      {order.tracking_number ? (
        <div className="flex flex-col gap-4 text-[12.5px]">
          <dl className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <dt className="text-muted text-[11px] font-semibold">{t("adminOrders.waybill.number")}</dt>
              <dd className="flex items-center gap-3 font-medium tabular-nums">
                {order.tracking_number}
                {order.tracking_url ? (
                  <a
                    href={order.tracking_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gold hover:text-ink text-[11.5px] font-normal"
                  >
                    {t("adminOrders.waybill.track")} ↗
                  </a>
                ) : null}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted text-[11px] font-semibold">{t("adminOrders.waybill.status")}</dt>
              <dd>
                {order.tracking_status || (order.np_document_ref ? t("adminOrders.waybill.notSent") : "—")}
                {order.tracking_updated_at ? (
                  <span className="text-muted block pt-1 text-[11px]">
                    {t("adminOrders.waybill.updated", { time: formatDateTime(order.tracking_updated_at) })}
                  </span>
                ) : null}
              </dd>
            </div>
          </dl>
          <p className="text-muted text-[11.5px]">{t("adminOrders.waybill.autoStatus")}</p>
          <div className="flex flex-wrap gap-2">
            <AdminButton
              variant="outline"
              disabled={pending}
              onClick={() => waybill.mutate({ kind: "refresh" })}
            >
              {t("adminOrders.waybill.refresh")}
            </AdminButton>
            {canDelete ? (
              <AdminButton variant="danger" disabled={pending} onClick={() => setConfirmDelete(true)}>
                {t("adminOrders.waybill.delete")}
              </AdminButton>
            ) : null}
          </div>
        </div>
      ) : order.can_create_waybill ? (
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            waybill.mutate({ kind: "create", weight });
          }}
        >
          <Field label={t("adminOrders.waybill.weight")} hint={t("adminOrders.waybill.weightHint")}>
            {(props) => (
              <TextInput
                {...props}
                type="number"
                inputMode="decimal"
                min="0.1"
                max="30"
                step="0.1"
                required
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
              />
            )}
          </Field>
          <AdminButton type="submit" disabled={pending} className="self-start">
            {pending ? t("adminOrders.waybill.creating") : t("adminOrders.waybill.create")}
          </AdminButton>
        </form>
      ) : (
        <p className="text-muted text-[12px]">
          {order.delivery_method === "np_courier"
            ? t("adminOrders.waybill.manualOnly")
            : t("adminOrders.waybill.needRefs")}
        </p>
      )}
      {order.return_tracking_number ? (
        <div className="border-admin-row mt-5 flex flex-col gap-1 border-t pt-4 text-[12.5px]">
          <p className="text-muted text-[11px] font-semibold">{t("adminOrders.waybill.returnTitle")}</p>
          <p className="font-medium tabular-nums">{order.return_tracking_number}</p>
          <p>{order.return_tracking_status || "—"}</p>
          {order.return_tracking_updated_at ? (
            <p className="text-muted text-[11px]">
              {t("adminOrders.waybill.updated", { time: formatDateTime(order.return_tracking_updated_at) })}
            </p>
          ) : null}
        </div>
      ) : null}
      <ConfirmDialog
        open={confirmDelete}
        tone="danger"
        title={t("adminOrders.waybill.confirmDelete")}
        message={t("adminOrders.waybill.confirmDeleteText")}
        confirmLabel={t("adminOrders.waybill.delete")}
        cancelLabel={t("adminOrders.confirm.cancel")}
        pending={pending}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => waybill.mutate({ kind: "delete" }, { onSettled: () => setConfirmDelete(false) })}
      />
    </Panel>
  );
}
