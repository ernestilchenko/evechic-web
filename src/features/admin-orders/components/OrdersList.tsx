"use client";

import Link from "next/link";

import { EmptyState } from "@/components/ui/EmptyState";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/Table";
import { Tabs } from "@/components/ui/Tabs";
import {
  AdminButtonLink,
  AdminPageBody,
  AdminPageHeader,
  ErrorBlock,
  formatShortDate,
  LoadingBlock,
  OrderStatusChip,
  Pagination,
  RowMenu,
  SearchField,
  useUrlState,
} from "@/features/admin";
import { routes } from "@/data/routes";
import { formatPrice } from "@/lib/format";
import { t, tPlural } from "@/lib/i18n";

import { ORDER_TABS, ORDER_TRANSITIONS } from "../constants/orders";
import { useOrders } from "../hooks/useOrders";
import type { OrderTab } from "../types";
import { useStatusFlow } from "./useStatusFlow";

export function OrdersList() {
  const url = useUrlState();
  const tab = (ORDER_TABS as string[]).includes(url.get("status")) ? (url.get("status") as OrderTab) : "all";
  const q = url.get("q");
  const page = url.getNumber("page", 1);
  const { data, error, isLoading, isFetching, refetch } = useOrders({ status: tab, q, page });
  const statusFlow = useStatusFlow();
  const counts = data?.data.counts ?? {};
  const orders = data?.data.items ?? [];

  return (
    <>
      <AdminPageHeader title={t("adminOrders.title")}>
        <SearchField
          value={q}
          onChange={(value) => url.set({ q: value })}
          label={t("adminOrders.searchLabel")}
          placeholder={t("adminOrders.searchPlaceholder")}
        />
        <AdminButtonLink href={routes.admin.orderNew}>+ {t("adminOrders.create")}</AdminButtonLink>
      </AdminPageHeader>
      <AdminPageBody>
        <Tabs
          label={t("adminOrders.tabsLabel")}
          controls="orders-table"
          value={tab}
          onChange={(value) => url.set({ status: value === "all" ? null : value })}
          items={ORDER_TABS.map((value) => ({
            value,
            label: t(`adminOrders.tabs.${value}`),
            count: counts[value],
          }))}
        />
        <section
          id="orders-table"
          aria-busy={isFetching}
          aria-label={t("adminOrders.tableLabel")}
          className="border-admin-line rounded-md border bg-white"
        >
          {isLoading ? <LoadingBlock /> : null}
          {error && !data ? <ErrorBlock error={error} onRetry={() => refetch()} /> : null}
          {data && orders.length === 0 ? (
            <EmptyState title={t("adminOrders.empty")} text={q ? t("adminOrders.emptySearch") : undefined} />
          ) : null}
          {orders.length > 0 ? (
            <Table>
              <THead>
                <tr>
                  <Th>{t("adminOrders.col.number")}</Th>
                  <Th>{t("adminOrders.col.date")}</Th>
                  <Th>{t("adminOrders.col.customer")}</Th>
                  <Th>{t("adminOrders.col.phone")}</Th>
                  <Th>{t("adminOrders.col.qty")}</Th>
                  <Th>{t("adminOrders.col.total")}</Th>
                  <Th>{t("adminOrders.col.payment")}</Th>
                  <Th>{t("adminOrders.col.delivery")}</Th>
                  <Th>{t("adminOrders.col.status")}</Th>
                  <Th>
                    <span className="sr-only">{t("adminOrders.col.actions")}</span>
                  </Th>
                </tr>
              </THead>
              <TBody>
                {orders.map((order) => (
                  <Tr key={order.number}>
                    <Td className="font-semibold">
                      <Link href={routes.admin.order(order.number)} className="hover:text-gold">
                        {order.number}
                      </Link>
                    </Td>
                    <Td className="whitespace-nowrap">{formatShortDate(order.created_at)}</Td>
                    <Td className="min-w-[140px]">{order.customer_name}</Td>
                    <Td className="whitespace-nowrap">{order.phone}</Td>
                    <Td>{order.items_count}</Td>
                    <Td className="whitespace-nowrap">{formatPrice(order.total)}</Td>
                    <Td className="whitespace-nowrap">
                      {t(`adminOrders.payment.${order.payment_method}`)}
                      {order.payment_status === "paid" ? (
                        <span className="text-admin-success block text-[10.5px]">
                          {t("adminOrders.paymentStatus.paid")}
                        </span>
                      ) : null}
                    </Td>
                    <Td className="min-w-[140px]">{order.delivery_summary}</Td>
                    <Td>
                      <OrderStatusChip status={order.status} />
                    </Td>
                    <Td className="text-right">
                      <RowMenu
                        label={t("adminOrders.rowActions", { number: order.number })}
                        items={[
                          { label: t("adminOrders.open"), href: routes.admin.order(order.number) },
                          ...ORDER_TRANSITIONS[order.status].map((status) => ({
                            label: t(`adminOrders.transition.${status}`),
                            tone:
                              status === "cancelled" || status === "returned"
                                ? ("danger" as const)
                                : ("default" as const),
                            onSelect: () => statusFlow.request(order.number, status),
                          })),
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
              summary={({ from, to, count }) => tPlural("adminOrders.summary", count, { from, to })}
            />
          ) : null}
        </section>
      </AdminPageBody>
      {statusFlow.dialog}
    </>
  );
}
