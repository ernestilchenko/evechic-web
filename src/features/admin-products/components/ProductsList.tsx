"use client";

import Link from "next/link";
import { useState } from "react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/Table";
import { Tabs } from "@/components/ui/Tabs";
import {
  AdminButton,
  AdminButtonLink,
  AdminPageBody,
  AdminPageHeader,
  ErrorBlock,
  LoadingBlock,
  Pagination,
  RowMenu,
  SearchField,
  Thumb,
  useUrlState,
} from "@/features/admin";
import { routes } from "@/data/routes";
import { formatPrice } from "@/lib/format";
import { t, tPlural } from "@/lib/i18n";

import { BULK_STATUSES, PRODUCT_TABS } from "../constants/products";
import { useBulkStatus, useCategoriesOptions, useDeleteProduct, useProducts } from "../hooks/useProducts";
import type { ProductRow, ProductTab } from "../types";
import { CategorySelect } from "./CategorySelect";
import { ProductStatusChip } from "./ProductStatusChip";

export function ProductsList() {
  const url = useUrlState();
  const tab = (PRODUCT_TABS as string[]).includes(url.get("tab")) ? (url.get("tab") as ProductTab) : "all";
  const q = url.get("q");
  const category = url.getNumber("category", 0) || null;
  const page = url.getNumber("page", 1);
  const { data, error, isLoading, isFetching, refetch } = useProducts({ tab, q, category, page });
  const { data: categories = [] } = useCategoriesOptions();
  const bulk = useBulkStatus();
  const remove = useDeleteProduct();
  const [selected, setSelected] = useState<number[]>([]);
  const [toDelete, setToDelete] = useState<ProductRow | null>(null);
  const rows = data?.data.items ?? [];
  const allSelected = rows.length > 0 && rows.every((row) => selected.includes(row.id));

  const toggle = (id: number) =>
    setSelected((list) => (list.includes(id) ? list.filter((item) => item !== id) : [...list, id]));

  return (
    <>
      <AdminPageHeader title={t("adminProducts.title")}>
        <SearchField
          value={q}
          onChange={(value) => url.set({ q: value })}
          label={t("adminProducts.searchLabel")}
          placeholder={t("adminProducts.searchPlaceholder")}
        />
        <AdminButtonLink href={routes.admin.productNew}>+ {t("adminProducts.add")}</AdminButtonLink>
      </AdminPageHeader>
      <AdminPageBody>
        <div className="flex flex-wrap items-center gap-3">
          <Tabs
            className="flex-1"
            label={t("adminProducts.tabsLabel")}
            controls="products-table"
            value={tab}
            onChange={(value) => {
              setSelected([]);
              url.set({ tab: value === "all" ? null : value });
            }}
            items={PRODUCT_TABS.map((value) => ({
              value,
              label: t(`adminProducts.tabs.${value}`),
              count: data?.data.counts[value],
            }))}
          />
          <label className="sr-only" htmlFor="products-category">
            {t("adminProducts.filterCategory")}
          </label>
          <CategorySelect
            id="products-category"
            categories={categories}
            emptyLabel={t("adminProducts.allCategories")}
            value={category ?? ""}
            onChange={(event) => url.set({ category: event.target.value || null })}
          />
        </div>
        {selected.length > 0 ? (
          <div
            role="region"
            aria-label={t("adminProducts.bulk.label")}
            className="bg-ink text-cream flex flex-wrap items-center gap-3 rounded-md px-5 py-3"
          >
            <span className="flex-1 text-[12px]">
              {tPlural("adminProducts.bulk.selected", selected.length)}
            </span>
            {BULK_STATUSES.map((status) => (
              <AdminButton
                key={status}
                variant="outline"
                disabled={bulk.isPending}
                onClick={() => bulk.mutate({ ids: selected, status }, { onSuccess: () => setSelected([]) })}
              >
                {t(`adminProducts.bulk.${status}`)}
              </AdminButton>
            ))}
            <button type="button" className="text-[11px] underline" onClick={() => setSelected([])}>
              {t("adminProducts.bulk.clear")}
            </button>
          </div>
        ) : null}
        <section
          id="products-table"
          aria-busy={isFetching}
          aria-label={t("adminProducts.tableLabel")}
          className="border-admin-line rounded-md border bg-white"
        >
          {isLoading ? <LoadingBlock /> : null}
          {error && !data ? <ErrorBlock error={error} onRetry={() => refetch()} /> : null}
          {data && rows.length === 0 ? (
            <EmptyState
              title={t("adminProducts.empty")}
              action={
                <AdminButtonLink href={routes.admin.productNew}>+ {t("adminProducts.add")}</AdminButtonLink>
              }
            />
          ) : null}
          {rows.length > 0 ? (
            <Table>
              <THead>
                <tr>
                  <Th className="w-10">
                    <input
                      type="checkbox"
                      className="accent-ink size-[15px]"
                      aria-label={t("adminProducts.selectAll")}
                      checked={allSelected}
                      onChange={() => setSelected(allSelected ? [] : rows.map((row) => row.id))}
                    />
                  </Th>
                  <Th className="w-14">
                    <span className="sr-only">{t("adminProducts.col.image")}</span>
                  </Th>
                  <Th>{t("adminProducts.col.name")}</Th>
                  <Th>{t("adminProducts.col.sku")}</Th>
                  <Th>{t("adminProducts.col.category")}</Th>
                  <Th>{t("adminProducts.col.price")}</Th>
                  <Th>{t("adminProducts.col.stock")}</Th>
                  <Th>{t("adminProducts.col.status")}</Th>
                  <Th>
                    <span className="sr-only">{t("adminProducts.col.actions")}</span>
                  </Th>
                </tr>
              </THead>
              <TBody>
                {rows.map((row) => (
                  <Tr key={row.id}>
                    <Td className="py-3">
                      <input
                        type="checkbox"
                        className="accent-ink size-[15px]"
                        aria-label={t("adminProducts.select", { name: row.name })}
                        checked={selected.includes(row.id)}
                        onChange={() => toggle(row.id)}
                      />
                    </Td>
                    <Td className="py-3">
                      <Thumb src={row.main_image} alt={row.name} />
                    </Td>
                    <Td className="min-w-[180px] py-3 font-medium">
                      <Link href={routes.admin.product(row.id)} className="hover:text-gold">
                        {row.name}
                      </Link>
                    </Td>
                    <Td className="py-3 whitespace-nowrap">{row.sku}</Td>
                    <Td className="py-3">{row.category_name}</Td>
                    <Td className="py-3 whitespace-nowrap">
                      {formatPrice(row.price)}
                      {row.old_price ? (
                        <s className="text-placeholder block text-[10.5px]">{formatPrice(row.old_price)}</s>
                      ) : null}
                    </Td>
                    <Td className="py-3 whitespace-nowrap">
                      {t("admin.dashboard.pieces", { count: row.total_stock })}
                    </Td>
                    <Td className="py-3">
                      <ProductStatusChip status={row.status} stock={row.stock_state} />
                    </Td>
                    <Td className="py-3 text-right">
                      <RowMenu
                        label={t("adminProducts.rowActions", { name: row.name })}
                        items={[
                          { label: t("adminProducts.edit"), href: routes.admin.product(row.id) },
                          {
                            label:
                              row.status === "published"
                                ? t("adminProducts.unpublish")
                                : t("adminProducts.publish"),
                            onSelect: () =>
                              bulk.mutate({
                                ids: [row.id],
                                status: row.status === "published" ? "draft" : "published",
                              }),
                          },
                          {
                            label: t("adminProducts.delete"),
                            tone: "danger",
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
              summary={({ from, to, count }) => tPlural("adminProducts.summary", count, { from, to })}
            />
          ) : null}
        </section>
      </AdminPageBody>
      <ConfirmDialog
        open={toDelete !== null}
        tone="danger"
        title={t("adminProducts.confirmDelete.title", { name: toDelete?.name ?? "" })}
        message={t("adminProducts.confirmDelete.text")}
        confirmLabel={t("adminProducts.delete")}
        cancelLabel={t("adminProducts.cancel")}
        pending={remove.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate(toDelete.id, { onSettled: () => setToDelete(null) })}
      />
    </>
  );
}
