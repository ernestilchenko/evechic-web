"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui/Dialog";
import { Select } from "@/components/ui/Select";
import {
  AdminButton,
  Checkbox,
  Field,
  fromDateTimeLocal,
  getErrorMessage,
  getFieldErrors,
  LoadingBlock,
  TextInput,
  toDateTimeLocal,
} from "@/features/admin";
import { formatPrice } from "@/lib/format";
import { t } from "@/lib/i18n";

import { usePromoCode, useSavePromoCode } from "../hooks/usePromoCodes";
import type { DiscountType, PromoDetail } from "../types";

type Draft = {
  code: string;
  description: string;
  discount_type: DiscountType;
  value: string;
  min_order_amount: string;
  starts_at: string;
  ends_at: string;
  usage_limit: string;
  first_order_only: boolean;
  issued_to_email: string;
  is_active: boolean;
};

function toDraft(promo: PromoDetail | null): Draft {
  return {
    code: promo?.code ?? "",
    description: promo?.description ?? "",
    discount_type: promo?.discount_type ?? "percent",
    value: promo?.value ?? "",
    min_order_amount: promo?.min_order_amount ?? "0",
    starts_at: toDateTimeLocal(promo?.starts_at),
    ends_at: toDateTimeLocal(promo?.ends_at),
    usage_limit:
      promo?.usage_limit === null || promo?.usage_limit === undefined ? "" : String(promo.usage_limit),
    first_order_only: promo?.first_order_only ?? false,
    issued_to_email: promo?.issued_to_email ?? "",
    is_active: promo?.is_active ?? true,
  };
}

function PromoForm({ promo, onClose }: { promo: PromoDetail | null; onClose: () => void }) {
  const mutation = useSavePromoCode();
  const [draft, setDraft] = useState<Draft>(() => toDraft(promo));
  const errors = getFieldErrors(mutation.error);
  const set = (patch: Partial<Draft>) => setDraft((state) => ({ ...state, ...patch }));
  const formId = "promo-form";

  return (
    <Dialog
      open
      size="lg"
      onClose={onClose}
      title={promo ? t("adminPromo.editTitle", { code: promo.code }) : t("adminPromo.createTitle")}
      description={
        promo
          ? t("adminPromo.stats", {
              orders: promo.orders_count,
              discount: formatPrice(promo.total_discount),
              used: promo.used_count,
            })
          : undefined
      }
      closeLabel={t("adminPromo.cancel")}
      footer={
        <>
          <AdminButton variant="outline" onClick={onClose}>
            {t("adminPromo.cancel")}
          </AdminButton>
          <AdminButton type="submit" form={formId} disabled={mutation.isPending}>
            {mutation.isPending ? t("adminPromo.saving") : t("adminPromo.save")}
          </AdminButton>
        </>
      }
    >
      <form
        id={formId}
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate(
            {
              id: promo?.id ?? null,
              body: {
                code: draft.code.trim().toUpperCase(),
                description: draft.description,
                discount_type: draft.discount_type,
                value: draft.value,
                min_order_amount: draft.min_order_amount || "0",
                starts_at: fromDateTimeLocal(draft.starts_at),
                ends_at: fromDateTimeLocal(draft.ends_at),
                usage_limit: draft.usage_limit ? Number(draft.usage_limit) : null,
                first_order_only: draft.first_order_only,
                issued_to_email: draft.issued_to_email.trim(),
                is_active: draft.is_active,
              },
            },
            { onSuccess: onClose },
          );
        }}
      >
        <Field label={t("adminPromo.field.code")} error={errors.code}>
          {(props) => (
            <TextInput
              {...props}
              required
              maxLength={40}
              value={draft.code}
              onChange={(event) => set({ code: event.target.value.toUpperCase() })}
            />
          )}
        </Field>
        <Field label={t("adminPromo.field.description")} error={errors.description}>
          {(props) => (
            <TextInput
              {...props}
              maxLength={255}
              value={draft.description}
              onChange={(event) => set({ description: event.target.value })}
            />
          )}
        </Field>
        <Field label={t("adminPromo.field.type")} error={errors.discount_type}>
          {(props) => (
            <Select
              {...props}
              value={draft.discount_type}
              onChange={(event) => set({ discount_type: event.target.value as DiscountType })}
            >
              <option value="percent">{t("adminPromo.type.percent")}</option>
              <option value="fixed">{t("adminPromo.type.fixed")}</option>
            </Select>
          )}
        </Field>
        <Field label={t("adminPromo.field.value")} error={errors.value}>
          {(props) => (
            <TextInput
              {...props}
              required
              type="number"
              min={0}
              max={draft.discount_type === "percent" ? 100 : undefined}
              step="0.01"
              value={draft.value}
              onChange={(event) => set({ value: event.target.value })}
            />
          )}
        </Field>
        <Field label={t("adminPromo.field.minOrder")} error={errors.min_order_amount}>
          {(props) => (
            <TextInput
              {...props}
              type="number"
              min={0}
              step="0.01"
              value={draft.min_order_amount}
              onChange={(event) => set({ min_order_amount: event.target.value })}
            />
          )}
        </Field>
        <Field
          label={t("adminPromo.field.usageLimit")}
          hint={t("adminPromo.field.usageLimitHint")}
          error={errors.usage_limit}
        >
          {(props) => (
            <TextInput
              {...props}
              type="number"
              min={1}
              value={draft.usage_limit}
              onChange={(event) => set({ usage_limit: event.target.value })}
            />
          )}
        </Field>
        <Field label={t("adminPromo.field.startsAt")} error={errors.starts_at}>
          {(props) => (
            <TextInput
              {...props}
              type="datetime-local"
              value={draft.starts_at}
              onChange={(event) => set({ starts_at: event.target.value })}
            />
          )}
        </Field>
        <Field label={t("adminPromo.field.endsAt")} error={errors.ends_at}>
          {(props) => (
            <TextInput
              {...props}
              type="datetime-local"
              value={draft.ends_at}
              onChange={(event) => set({ ends_at: event.target.value })}
            />
          )}
        </Field>
        <Field
          label={t("adminPromo.field.email")}
          hint={t("adminPromo.field.emailHint")}
          error={errors.issued_to_email}
          className="sm:col-span-2"
        >
          {(props) => (
            <TextInput
              {...props}
              type="email"
              value={draft.issued_to_email}
              onChange={(event) => set({ issued_to_email: event.target.value })}
            />
          )}
        </Field>
        <div className="flex flex-wrap gap-6 sm:col-span-2">
          <Checkbox
            label={t("adminPromo.field.firstOrderOnly")}
            checked={draft.first_order_only}
            onChange={(event) => set({ first_order_only: event.target.checked })}
          />
          <Checkbox
            label={t("adminPromo.field.active")}
            checked={draft.is_active}
            onChange={(event) => set({ is_active: event.target.checked })}
          />
        </div>
        {mutation.error && Object.keys(errors).length === 0 ? (
          <p role="alert" className="text-sale text-[12px] sm:col-span-2">
            {getErrorMessage(mutation.error, t("adminPromo.toast.saveFailed"))}
          </p>
        ) : null}
      </form>
    </Dialog>
  );
}

export function PromoDialog({ id, onClose }: { id: number | null; onClose: () => void }) {
  const { data, isLoading } = usePromoCode(id);
  if (id !== null && (isLoading || !data)) {
    return (
      <Dialog
        open
        onClose={onClose}
        title={t("adminPromo.loading")}
        closeLabel={t("adminPromo.cancel")}
        size="sm"
      >
        <LoadingBlock />
      </Dialog>
    );
  }
  return <PromoForm promo={id === null ? null : (data ?? null)} onClose={onClose} />;
}
