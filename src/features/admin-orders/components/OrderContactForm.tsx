"use client";

import { useState } from "react";

import { AdminButton, getFieldErrors, Panel } from "@/features/admin";
import { t } from "@/lib/i18n";

import { useUpdateOrder } from "../hooks/useOrders";
import type { AdminOrder } from "../types";
import { ContactFields, type ContactValues } from "./ContactFields";
import { DeliveryFields, type DeliveryValues } from "./DeliveryFields";

export function OrderContactForm({ order }: { order: AdminOrder }) {
  const mutation = useUpdateOrder(order.number);
  const [contact, setContact] = useState<ContactValues>({
    first_name: order.first_name,
    last_name: order.last_name,
    phone: order.phone,
    email: order.email,
  });
  const [delivery, setDelivery] = useState<DeliveryValues>({
    delivery_method: order.delivery_method,
    city: order.city,
    delivery_point: order.delivery_point,
    street: order.street,
  });
  const errors = getFieldErrors(mutation.error);

  return (
    <Panel title={t("adminOrders.detail.contactDelivery")} titleId="order-contact">
      <form
        className="flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate({ ...contact, ...delivery });
        }}
      >
        <ContactFields values={contact} errors={errors} onChange={setContact} />
        <div className="border-admin-row border-t pt-5">
          <p className="text-muted pb-3 text-[11.5px]">
            {order.admin_delivery_summary || order.delivery_summary}
          </p>
          <DeliveryFields values={delivery} errors={errors} onChange={setDelivery} />
        </div>
        <AdminButton type="submit" disabled={mutation.isPending} className="self-start">
          {mutation.isPending ? t("adminOrders.saving") : t("adminOrders.save")}
        </AdminButton>
      </form>
    </Panel>
  );
}
