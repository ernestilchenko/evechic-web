"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Table, TBody, Td, Th, THead, Tr } from "@/components/ui/Table";
import {
  AdminButton,
  AdminPageBody,
  AdminPageHeader,
  ErrorBlock,
  LoadingBlock,
  RowMenu,
  StatusChip,
} from "@/features/admin";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";

import { useCategories, useDeleteCategory } from "../hooks/useCatalog";
import type { AdminCategory, CategoryNode } from "../types";
import { CategoryDialog } from "./CategoryDialog";
import { ColorsPanel } from "./ColorsPanel";

function buildTree(categories: AdminCategory[]): CategoryNode[] {
  const walk = (parent: number | null, depth: number): CategoryNode[] =>
    categories
      .filter((category) => category.parent === parent)
      .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name))
      .flatMap((category) => [{ ...category, depth }, ...walk(category.id, depth + 1)]);
  return walk(null, 0);
}

export function CategoriesManager() {
  const { data: categories, error, isLoading, refetch } = useCategories();
  const remove = useDeleteCategory();
  const [editing, setEditing] = useState<AdminCategory | null | undefined>(undefined);
  const [toDelete, setToDelete] = useState<AdminCategory | null>(null);
  const nodes = buildTree(categories ?? []);

  return (
    <>
      <AdminPageHeader title={t("adminCatalog.title")}>
        <AdminButton onClick={() => setEditing(null)}>+ {t("adminCatalog.categories.add")}</AdminButton>
      </AdminPageHeader>
      <AdminPageBody>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
          <section
            aria-labelledby="categories-title"
            className="border-admin-line rounded-md border bg-white"
          >
            <h2 id="categories-title" className="px-5 pt-6 pb-5 text-[14px] font-semibold sm:px-[22px]">
              {t("adminCatalog.categories.title")}
            </h2>
            {isLoading ? <LoadingBlock /> : null}
            {error ? <ErrorBlock error={error} onRetry={() => refetch()} /> : null}
            {categories && nodes.length === 0 ? (
              <EmptyState title={t("adminCatalog.categories.empty")} />
            ) : null}
            {nodes.length > 0 ? (
              <Table>
                <THead>
                  <tr>
                    <Th>{t("adminCatalog.categories.name")}</Th>
                    <Th>{t("adminCatalog.categories.slug")}</Th>
                    <Th>{t("adminCatalog.categories.products")}</Th>
                    <Th>{t("adminCatalog.categories.sortOrder")}</Th>
                    <Th>{t("adminCatalog.categories.status")}</Th>
                    <Th>
                      <span className="sr-only">{t("adminCatalog.actions")}</span>
                    </Th>
                  </tr>
                </THead>
                <TBody>
                  {nodes.map((node) => {
                    const deletable = node.products_count === 0 && node.children_count === 0;
                    return (
                      <Tr key={node.id}>
                        <Td className="py-3">
                          <div className="flex items-center gap-3" style={{ paddingLeft: node.depth * 24 }}>
                            <span className="bg-sand relative block h-11 w-9 shrink-0 overflow-hidden rounded-[3px]">
                              {node.image ? (
                                <Image
                                  src={node.image}
                                  alt=""
                                  fill
                                  sizes="36px"
                                  className="object-cover object-top"
                                />
                              ) : null}
                            </span>
                            <span className="font-medium">
                              {node.depth > 0 ? <span className="text-placeholder">↳ </span> : null}
                              {node.name}
                            </span>
                          </div>
                        </Td>
                        <Td className="text-muted py-3">{node.slug}</Td>
                        <Td className="py-3">
                          <Link
                            href={`${routes.admin.products}?category=${node.id}`}
                            className="hover:text-gold"
                          >
                            {node.products_count}
                          </Link>
                        </Td>
                        <Td className="py-3">{node.sort_order}</Td>
                        <Td className="py-3">
                          <StatusChip tone={node.is_active ? "success" : "neutral"}>
                            {node.is_active
                              ? t("adminCatalog.categories.activeChip")
                              : t("adminCatalog.categories.hiddenChip")}
                          </StatusChip>
                        </Td>
                        <Td className="py-3 text-right">
                          <RowMenu
                            label={t("adminCatalog.rowActions", { name: node.name })}
                            items={[
                              { label: t("adminCatalog.edit"), onSelect: () => setEditing(node) },
                              {
                                label: deletable
                                  ? t("adminCatalog.delete")
                                  : t("adminCatalog.categories.notEmpty"),
                                tone: "danger",
                                disabled: !deletable,
                                onSelect: () => setToDelete(node),
                              },
                            ]}
                          />
                        </Td>
                      </Tr>
                    );
                  })}
                </TBody>
              </Table>
            ) : null}
          </section>
          <ColorsPanel />
        </div>
      </AdminPageBody>
      {editing !== undefined ? (
        <CategoryDialog category={editing} nodes={nodes} onClose={() => setEditing(undefined)} />
      ) : null}
      <ConfirmDialog
        open={toDelete !== null}
        tone="danger"
        title={t("adminCatalog.categories.confirmDelete", { name: toDelete?.name ?? "" })}
        confirmLabel={t("adminCatalog.delete")}
        cancelLabel={t("adminCatalog.cancel")}
        pending={remove.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate(toDelete.id, { onSettled: () => setToDelete(null) })}
      />
    </>
  );
}
