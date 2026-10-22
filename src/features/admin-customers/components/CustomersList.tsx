"use client";

import Link from "next/link";

import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Select";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/Table";
import {
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
import { routes } from "@/data/routes";
import { formatPrice } from "@/lib/format";
import { t, tPlural } from "@/lib/i18n";

import { CUSTOMER_SORTS } from "../constants/customers";
import { useCustomers } from "../hooks/useCustomers";
import type { CustomerSort } from "../types";

export function CustomersList() {
  const url = useUrlState();
  const q = url.get("q");
  const sort = (CUSTOMER_SORTS as string[]).includes(url.get("sort"))
    ? (url.get("sort") as CustomerSort)
    : "recent";
  const page = url.getNumber("page", 1);
  const { data, error, isLoading, isFetching, refetch } = useCustomers({ q, sort, page });
  const rows = data?.data ?? [];

  return (
    <>
      <AdminPageHeader title={t("adminCustomers.title")}>
        <SearchField
          value={q}
          onChange={(value) => url.set({ q: value })}
          label={t("adminCustomers.searchLabel")}
          placeholder={t("adminCustomers.searchPlaceholder")}
        />
        <label className="sr-only" htmlFor="customers-sort">
          {t("adminCustomers.sortLabel")}
        </label>
        <Select
          id="customers-sort"
          value={sort}
          onChange={(event) => url.set({ sort: event.target.value === "recent" ? null : event.target.value })}
        >
          {CUSTOMER_SORTS.map((value) => (
            <option key={value} value={value}>
              {t(`adminCustomers.sort.${value}`)}
            </option>
          ))}
        </Select>
      </AdminPageHeader>
      <AdminPageBody>
        <section
          aria-busy={isFetching}
          aria-label={t("adminCustomers.tableLabel")}
          className="border-admin-line rounded-md border bg-white"
        >
          {isLoading ? <LoadingBlock /> : null}
          {error && !data ? <ErrorBlock error={error} onRetry={() => refetch()} /> : null}
          {data && rows.length === 0 ? <EmptyState title={t("adminCustomers.empty")} /> : null}
          {rows.length > 0 ? (
            <Table>
              <THead>
                <tr>
                  <Th>{t("adminCustomers.col.name")}</Th>
                  <Th>{t("adminCustomers.col.phone")}</Th>
                  <Th>{t("adminCustomers.col.orders")}</Th>
                  <Th>{t("adminCustomers.col.spent")}</Th>
                  <Th>{t("adminCustomers.col.lastOrder")}</Th>
                  <Th>{t("adminCustomers.col.bonus")}</Th>
                  <Th>{t("adminCustomers.col.joined")}</Th>
                  <Th>{t("adminCustomers.col.status")}</Th>
                </tr>
              </THead>
              <TBody>
                {rows.map((row) => (
                  <Tr key={row.id}>
                    <Td className="min-w-[180px]">
                      <Link href={routes.admin.customer(row.id)} className="hover:text-gold font-medium">
                        {row.full_name || row.email}
                      </Link>
                      <span className="text-placeholder block text-[11px]">{row.email}</span>
                    </Td>
                    <Td className="whitespace-nowrap">{row.phone || "—"}</Td>
                    <Td>{row.orders_count}</Td>
                    <Td className="whitespace-nowrap">{formatPrice(row.total_spent)}</Td>
                    <Td className="whitespace-nowrap">{formatShortDate(row.last_order_at)}</Td>
                    <Td className="whitespace-nowrap">{formatPrice(row.bonus_balance)}</Td>
                    <Td className="whitespace-nowrap">{formatShortDate(row.date_joined)}</Td>
                    <Td>
                      <StatusChip tone={row.is_active ? "success" : "danger"}>
                        {row.is_active ? t("adminCustomers.active") : t("adminCustomers.blocked")}
                      </StatusChip>
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
              summary={({ from, to, count }) => tPlural("adminCustomers.summary", count, { from, to })}
            />
          ) : null}
        </section>
      </AdminPageBody>
    </>
  );
}
