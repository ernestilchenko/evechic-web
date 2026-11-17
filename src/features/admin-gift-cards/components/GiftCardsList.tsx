"use client";

import { useState } from "react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Select";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/Table";
import {
  type ChipTone,
  AdminButton,
  AdminPageBody,
  AdminPageHeader,
  ErrorBlock,
  formatShortDate,
  LoadingBlock,
  Pagination,
  SearchField,
  StatusChip,
  useUrlState,
} from "@/features/admin";
import { formatPrice } from "@/lib/format";
import { t, tPlural } from "@/lib/i18n";

import { type AdminGiftCard, type GiftCardFilter, useGiftCards, useRefundGiftCard } from "../api";

const TONES: Record<AdminGiftCard["status"], ChipTone> = {
  pending: "neutral",
  active: "success",
  cancelled: "danger",
};
const FILTERS: GiftCardFilter[] = ["", "active", "pending", "cancelled"];

export function GiftCardsList() {
  const url = useUrlState();
  const q = url.get("q");
  const status = (
    FILTERS.includes(url.get("status") as GiftCardFilter) ? url.get("status") : ""
  ) as GiftCardFilter;
  const page = url.getNumber("page", 1);
  const { data, error, isLoading, isFetching, refetch } = useGiftCards({ q, status, page });
  const refund = useRefundGiftCard();
  const [toRefund, setToRefund] = useState<AdminGiftCard | null>(null);
  const rows = data?.data ?? [];

  return (
    <>
      <AdminPageHeader title={t("adminGiftCards.title")}>
        <SearchField
          value={q}
          onChange={(value) => url.set({ q: value })}
          label={t("adminGiftCards.searchLabel")}
          placeholder={t("adminGiftCards.searchPlaceholder")}
        />
        <label className="sr-only" htmlFor="gift-status">
          {t("adminGiftCards.filterLabel")}
        </label>
        <Select id="gift-status" value={status} onChange={(event) => url.set({ status: event.target.value })}>
          {FILTERS.map((value) => (
            <option key={value} value={value}>
              {t(`adminGiftCards.filter.${value || "all"}`)}
            </option>
          ))}
        </Select>
      </AdminPageHeader>
      <AdminPageBody>
        <section
          aria-busy={isFetching}
          aria-label={t("adminGiftCards.title")}
          className="border-admin-line rounded-md border bg-white"
        >
          {isLoading ? <LoadingBlock /> : null}
          {error && !data ? <ErrorBlock error={error} onRetry={() => refetch()} /> : null}
          {data && rows.length === 0 ? <EmptyState title={t("adminGiftCards.empty")} /> : null}
          {rows.length > 0 ? (
            <Table>
              <THead>
                <tr>
                  <Th>{t("adminGiftCards.col.code")}</Th>
                  <Th>{t("adminGiftCards.col.balance")}</Th>
                  <Th>{t("adminGiftCards.col.buyer")}</Th>
                  <Th>{t("adminGiftCards.col.recipient")}</Th>
                  <Th>{t("adminGiftCards.col.dates")}</Th>
                  <Th>{t("adminGiftCards.col.status")}</Th>
                  <Th>
                    <span className="sr-only">{t("adminGiftCards.col.actions")}</span>
                  </Th>
                </tr>
              </THead>
              <TBody>
                {rows.map((row) => (
                  <Tr key={row.id}>
                    <Td className="min-w-[160px]">
                      <span className="font-semibold tracking-[0.06em]">{row.code}</span>
                      <span className="text-placeholder block text-[11px]">№ {row.number}</span>
                    </Td>
                    <Td className="whitespace-nowrap">
                      <span className="font-semibold">{formatPrice(row.balance)}</span>
                      <span className="text-muted block text-[11px]">
                        {t("adminGiftCards.of", { amount: formatPrice(row.amount) })}
                        {row.orders_count > 0
                          ? ` · ${tPlural("adminGiftCards.orders", row.orders_count)}`
                          : ""}
                      </span>
                    </Td>
                    <Td>
                      {row.buyer_name}
                      <span className="text-muted block text-[11px]">{row.buyer_email}</span>
                    </Td>
                    <Td>
                      {row.recipient_email ? (
                        <>
                          {row.recipient_name || "—"}
                          <span className="text-muted block text-[11px]">{row.recipient_email}</span>
                        </>
                      ) : (
                        <span className="text-muted">{t("adminGiftCards.self")}</span>
                      )}
                    </Td>
                    <Td className="text-[11.5px] whitespace-nowrap">
                      {formatShortDate(row.paid_at ?? row.created_at)}
                      {row.expires_at ? (
                        <span className="text-muted block">
                          {t("adminGiftCards.until", { date: formatShortDate(row.expires_at) })}
                        </span>
                      ) : null}
                    </Td>
                    <Td>
                      <StatusChip tone={TONES[row.status]}>
                        {t(`adminGiftCards.status.${row.status}`)}
                      </StatusChip>
                    </Td>
                    <Td className="text-right">
                      {row.can_refund ? (
                        <AdminButton variant="outline" onClick={() => setToRefund(row)}>
                          {t("adminGiftCards.refund")}
                        </AdminButton>
                      ) : null}
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
              summary={({ from, to, count }) => tPlural("adminGiftCards.summary", count, { from, to })}
            />
          ) : null}
        </section>
      </AdminPageBody>
      <ConfirmDialog
        open={toRefund !== null}
        tone="danger"
        title={t("adminGiftCards.confirmRefund", {
          code: toRefund?.code ?? "",
          amount: toRefund ? formatPrice(toRefund.amount) : "",
        })}
        confirmLabel={t("adminGiftCards.refund")}
        cancelLabel={t("adminGiftCards.cancel")}
        pending={refund.isPending}
        onCancel={() => setToRefund(null)}
        onConfirm={() => toRefund && refund.mutate(toRefund.id, { onSettled: () => setToRefund(null) })}
      />
    </>
  );
}
