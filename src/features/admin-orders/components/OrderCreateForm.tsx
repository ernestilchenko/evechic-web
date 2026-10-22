"use client";

import Link from "next/link";
import { useState } from "react";

import { Select } from "@/components/ui/Select";
import {
  AdminButton,
  AdminButtonLink,
  AdminPageBody,
  AdminPageHeader,
  Checkbox,
  Field,
  getErrorMessage,
  getFieldErrors,
  Panel,
  TextArea,
  TextInput,
} from "@/features/admin";
import { routes } from "@/data/routes";
import { formatPrice } from "@/lib/format";
import { t } from "@/lib/i18n";

import { PAYMENT_METHODS } from "../constants/orders";
import { useCreateOrder } from "../hooks/useCreateOrder";
import type { CheckoutResult, DraftLine, PaymentMethod } from "../types";
import { ContactFields, type ContactValues } from "./ContactFields";
import { DeliveryFields, type DeliveryValues } from "./DeliveryFields";
import { ProductPicker } from "./ProductPicker";

function CreatedOrder({ result }: { result: CheckoutResult }) {
  return (
    <Panel className="flex flex-col items-start gap-4">
      <h2 className="text-[16px] font-semibold">{t("adminOrders.new.created", { number: result.number })}</h2>
      <p className="text-muted text-[12.5px]">
        {t("adminOrders.new.createdTotal", { total: formatPrice(result.total) })}
      </p>
      {result.payment_url ? (
        <div className="bg-admin-bg flex w-full flex-col gap-2 rounded px-4 py-3">
          <p className="text-[12px] font-semibold">{t("adminOrders.new.paymentLink")}</p>
          <a
            href={result.payment_url}
            target="_blank"
            rel="noreferrer"
            className="text-gold text-[12px] break-all"
          >
            {result.payment_url}
          </a>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <AdminButtonLink href={routes.admin.order(result.number)}>
          {t("adminOrders.new.openOrder")}
        </AdminButtonLink>
        <AdminButtonLink href={routes.admin.orders} variant="outline">
          {t("adminOrders.title")}
        </AdminButtonLink>
      </div>
    </Panel>
  );
}

export function OrderCreateForm() {
  const mutation = useCreateOrder();
  const [lines, setLines] = useState<DraftLine[]>([]);
  const [contact, setContact] = useState<ContactValues>({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });
  const [delivery, setDelivery] = useState<DeliveryValues>({
    delivery_method: "np_branch",
    city: "",
    delivery_point: "",
    street: "",
  });
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [promo, setPromo] = useState("");
  const [comment, setComment] = useState("");
  const [skipCall, setSkipCall] = useState(false);
  const errors = getFieldErrors(mutation.error);
  const subtotal = lines.reduce((sum, line) => sum + Number(line.price) * line.quantity, 0);
  const back = { href: routes.admin.orders, label: t("adminOrders.title") };

  if (mutation.data) {
    return (
      <>
        <AdminPageHeader title={t("adminOrders.new.title")} back={back} />
        <AdminPageBody>
          <CreatedOrder result={mutation.data} />
        </AdminPageBody>
      </>
    );
  }

  const updateLine = (variantId: number, quantity: number) =>
    setLines((list) => list.map((line) => (line.variantId === variantId ? { ...line, quantity } : line)));

  return (
    <>
      <AdminPageHeader title={t("adminOrders.new.title")} back={back} />
      <AdminPageBody>
        <form
          className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate({
              ...contact,
              ...delivery,
              payment_method: payment,
              comment,
              skip_confirmation_call: skipCall,
              promo_code: promo.trim(),
              items: lines.map((line) => ({ variant_id: line.variantId, quantity: line.quantity })),
            });
          }}
        >
          <div className="flex min-w-0 flex-col gap-4">
            <Panel title={t("adminOrders.new.products")} titleId="new-order-products">
              <ProductPicker lines={lines} onAdd={(line) => setLines((list) => [...list, line])} />
              {lines.length > 0 ? (
                <ul className="mt-5 flex flex-col">
                  {lines.map((line) => (
                    <li
                      key={line.variantId}
                      className="border-admin-row flex flex-wrap items-center gap-3 border-t py-3"
                    >
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="text-[12.5px] font-medium">{line.productName}</span>
                        <span className="text-placeholder text-[11px]">
                          {line.sku} · {line.color} · {line.size}
                        </span>
                      </div>
                      <label className="sr-only" htmlFor={`qty-${line.variantId}`}>
                        {t("adminOrders.new.quantity")}
                      </label>
                      <TextInput
                        id={`qty-${line.variantId}`}
                        type="number"
                        min={1}
                        max={line.stock}
                        value={line.quantity}
                        onChange={(event) =>
                          updateLine(
                            line.variantId,
                            Math.min(line.stock, Math.max(1, Number(event.target.value) || 1)),
                          )
                        }
                        className="w-20"
                      />
                      <span className="w-[90px] text-right text-[12.5px] font-semibold">
                        {formatPrice(Number(line.price) * line.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setLines((list) => list.filter((item) => item.variantId !== line.variantId))
                        }
                        className="text-sale text-[11px] hover:underline"
                      >
                        {t("adminOrders.new.remove")}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-placeholder mt-4 text-[12px]">{t("adminOrders.new.emptyLines")}</p>
              )}
              {errors.items ? <p className="text-sale mt-2 text-[11px]">{errors.items}</p> : null}
            </Panel>
            <Panel title={t("adminOrders.detail.contactDelivery")} titleId="new-order-contact">
              <div className="flex flex-col gap-5">
                <ContactFields values={contact} errors={errors} onChange={setContact} />
                <div className="border-admin-row border-t pt-5">
                  <DeliveryFields values={delivery} errors={errors} onChange={setDelivery} />
                </div>
              </div>
            </Panel>
          </div>
          <div className="flex min-w-0 flex-col gap-4">
            <Panel title={t("adminOrders.new.summary")} titleId="new-order-summary">
              <div className="flex flex-col gap-4">
                <Field label={t("adminOrders.detail.paymentMethod")} error={errors.payment_method}>
                  {(props) => (
                    <Select
                      {...props}
                      value={payment}
                      onChange={(event) => setPayment(event.target.value as PaymentMethod)}
                    >
                      {PAYMENT_METHODS.map((method) => (
                        <option key={method} value={method}>
                          {t(`adminOrders.payment.${method}`)}
                        </option>
                      ))}
                    </Select>
                  )}
                </Field>
                <Field label={t("adminOrders.field.promo")} error={errors.promo_code}>
                  {(props) => (
                    <TextInput
                      {...props}
                      value={promo}
                      onChange={(event) => setPromo(event.target.value.toUpperCase())}
                    />
                  )}
                </Field>
                <Field label={t("adminOrders.field.comment")} error={errors.comment}>
                  {(props) => (
                    <TextArea
                      {...props}
                      rows={3}
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                    />
                  )}
                </Field>
                <Checkbox
                  label={t("adminOrders.field.skipCall")}
                  checked={skipCall}
                  onChange={(event) => setSkipCall(event.target.checked)}
                />
                <dl className="border-admin-row flex justify-between border-t pt-4 text-[14px] font-semibold">
                  <dt>{t("adminOrders.new.subtotal")}</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </dl>
                <p className="text-placeholder text-[11px]">{t("adminOrders.new.totalsHint")}</p>
                <div aria-live="polite">
                  {mutation.error ? (
                    <p role="alert" className="text-sale text-[12px]">
                      {getErrorMessage(mutation.error, t("adminOrders.toast.createFailed"))}
                    </p>
                  ) : null}
                </div>
                <AdminButton type="submit" disabled={lines.length === 0 || mutation.isPending}>
                  {mutation.isPending ? t("adminOrders.saving") : t("adminOrders.new.submit")}
                </AdminButton>
                <Link
                  href={routes.admin.orders}
                  className="text-muted hover:text-ink text-center text-[11px]"
                >
                  {t("adminOrders.confirm.cancel")}
                </Link>
              </div>
            </Panel>
          </div>
        </form>
      </AdminPageBody>
    </>
  );
}
