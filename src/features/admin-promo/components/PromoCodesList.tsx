"use client";

import { useState } from "react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Select";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/Table";
import {
  AdminButton,
  AdminPageBody,
  AdminPageHeader,
  ErrorBlock,
  formatShortDate,
  LoadingBlock,
  Pagination,
  RowMenu,
  SearchField,
  StatusChip,
  useUrlState,
} from "@/features/admin";
import { formatPrice } from "@/lib/format";
import { t, tPlural } from "@/lib/i18n";

import { PROMO_STATE_TONES } from "../constants/promo";
import { useDeletePromoCode, usePromoCodes } from "../hooks/usePromoCodes";
import type { ActiveFilter, PromoRow } from "../types";
import { PromoDialog } from "./PromoDialog";

function discountLabel(row: PromoRow) {
  return row.discount_type === "percent" ? `−${Number(row.value)}%` : `−${formatPrice(row.value)}`;
}

export function PromoCodesList() {
  const url = useUrlState();
  const q = url.get("q");
  const active = (["true", "false"].includes(url.get("active")) ? url.get("active") : "") as ActiveFilter;
  const page = url.getNumber("page", 1);
  const { data, error, isLoading, isFetching, refetch } = usePromoCodes({ q, active, page });
  const remove = useDeletePromoCode();
  const [editing, setEditing] = useState<number | null | undefined>(undefined);
  const [toDelete, setToDelete] = useState<PromoRow | null>(null);
  const rows = data?.data ?? [];

  return (
    <>
      <AdminPageHeader title={t("adminPromo.title")}>
        <SearchField
          value={q}
          onChange={(value) => url.set({ q: value })}
          label={t("adminPromo.searchLabel")}
          placeholder={t("adminPromo.searchPlaceholder")}
        />
        <label className="sr-only" htmlFor="promo-active">
          {t("adminPromo.filterLabel")}
        </label>
        <Select
          id="promo-active"
          value={active}
          onChange={(event) => url.set({ active: event.target.value })}
        >
          <option value="">{t("adminPromo.filter.all")}</option>
          <option value="true">{t("adminPromo.filter.active")}</option>
          <option value="false">{t("adminPromo.filter.inactive")}</option>
        </Select>
        <AdminButton onClick={() => setEditing(null)}>+ {t("adminPromo.add")}</AdminButton>
      </AdminPageHeader>
      <AdminPageBody>
        <section
          aria-busy={isFetching}
          aria-label={t("adminPromo.tableLabel")}
          className="border-admin-line rounded-md border bg-white"
        >
          {isLoading ? <LoadingBlock /> : null}
          {error && !data ? <ErrorBlock error={error} onRetry={() => refetch()} /> : null}
          {data && rows.length === 0 ? <EmptyState title={t("adminPromo.empty")} /> : null}
          {rows.length > 0 ? (
            <Table>
              <THead>
                <tr>
                  <Th>{t("adminPromo.col.code")}</Th>
                  <Th>{t("adminPromo.col.discount")}</Th>
                  <Th>{t("adminPromo.col.minOrder")}</Th>
                  <Th>{t("adminPromo.col.period")}</Th>
                  <Th>{t("adminPromo.col.usage")}</Th>
                  <Th>{t("adminPromo.col.state")}</Th>
                  <Th>
                    <span className="sr-only">{t("adminPromo.col.actions")}</span>
                  </Th>
                </tr>
              </THead>
              <TBody>
                {rows.map((row) => (
                  <Tr key={row.id}>
                    <Td className="min-w-[180px]">
                      <button
                        type="button"
                        onClick={() => setEditing(row.id)}
                        className="hover:text-gold font-semibold tracking-[0.06em]"
                      >
                        {row.code}
                      </button>
                      {row.description ? (
                        <span className="text-placeholder block text-[11px]">{row.description}</span>
                      ) : null}
                      {row.first_order_only || row.issued_to_email ? (
                        <span className="text-muted block text-[10.5px]">
                          {[row.first_order_only ? t("adminPromo.firstOrder") : "", row.issued_to_email]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      ) : null}
                    </Td>
                    <Td className="font-semibold whitespace-nowrap">{discountLabel(row)}</Td>
                    <Td className="whitespace-nowrap">
                      {Number(row.min_order_amount) > 0 ? formatPrice(row.min_order_amount) : "—"}
                    </Td>
                    <Td className="whitespace-nowrap">
                      {row.starts_at || row.ends_at
                        ? `${formatShortDate(row.starts_at)} – ${formatShortDate(row.ends_at)}`
                        : t("adminPromo.noPeriod")}
                    </Td>
                    <Td className="whitespace-nowrap">
                      {row.used_count}
                      {row.usage_limit !== null ? ` / ${row.usage_limit}` : ""}
                    </Td>
                    <Td>
                      <StatusChip tone={PROMO_STATE_TONES[row.state]}>
                        {t(`adminPromo.state.${row.state}`)}
                      </StatusChip>
                    </Td>
                    <Td className="text-right">
                      <RowMenu
                        label={t("adminPromo.rowActions", { code: row.code })}
                        items={[
                          { label: t("adminPromo.edit"), onSelect: () => setEditing(row.id) },
                          {
                            label:
                              row.orders_count > 0 ? t("adminPromo.usedInOrders") : t("adminPromo.delete"),
                            tone: "danger",
                            disabled: row.orders_count > 0,
                            onSelect: () => setToDelete(row),
                          },
                        ]}
                      />
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          ) : null}
          {data && data.pagination.count > 0 ? (
            <Pagination
              pagination={data.pagination}
              onChange={(next) => url.set({ page: next === 1 ? null : next })}
              summary={({ from, to, count }) => tPlural("adminPromo.summary", count, { from, to })}
            />
          ) : null}
        </section>
      </AdminPageBody>
      {editing !== undefined ? <PromoDialog id={editing} onClose={() => setEditing(undefined)} /> : null}
      <ConfirmDialog
        open={toDelete !== null}
        tone="danger"
        title={t("adminPromo.confirmDelete", { code: toDelete?.code ?? "" })}
        confirmLabel={t("adminPromo.delete")}
        cancelLabel={t("adminPromo.cancel")}
        pending={remove.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate(toDelete.id, { onSettled: () => setToDelete(null) })}
      />
    </>
  );
}
