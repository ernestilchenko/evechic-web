"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { AdminButton, AdminPageBody, AdminPageHeader, ErrorBlock, LoadingBlock } from "@/features/admin";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";

import { useDeleteProduct, useProduct, usePublishProduct } from "../hooks/useProducts";
import type { Product } from "../types";
import { ProductForm } from "./ProductForm";
import { ProductImages } from "./ProductImages";
import { ProductStatusChip } from "./ProductStatusChip";
import { ProductVariants } from "./ProductVariants";

function ExistingProduct({ product }: { product: Product }) {
  const router = useRouter();
  const publish = usePublishProduct(product.id);
  const remove = useDeleteProduct();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const canPublish = product.images.length > 0 && product.variants.length > 0;

  return (
    <>
      <AdminPageHeader
        title={product.name}
        back={{ href: routes.admin.products, label: t("adminProducts.title") }}
        meta={<ProductStatusChip status={product.status} stock={product.stock_state} />}
      >
        {product.status === "published" ? (
          <>
            <Link
              href={routes.product(product.slug)}
              target="_blank"
              className="text-gold hover:text-ink text-[11px]"
            >
              {t("adminProducts.viewOnSite")} ↗
            </Link>
            <AdminButton variant="outline" disabled={publish.isPending} onClick={() => publish.mutate(false)}>
              {t("adminProducts.unpublish")}
            </AdminButton>
          </>
        ) : (
          <AdminButton
            disabled={publish.isPending || !canPublish}
            title={canPublish ? undefined : t("adminProducts.publishHint")}
            onClick={() => publish.mutate(true)}
          >
            {t("adminProducts.publish")}
          </AdminButton>
        )}
        <AdminButton variant="danger" onClick={() => setConfirmDelete(true)}>
          {t("adminProducts.delete")}
        </AdminButton>
      </AdminPageHeader>
      <AdminPageBody>
        {!canPublish && product.status !== "published" ? (
          <p role="note" className="bg-admin-warn-bg text-admin-warn rounded px-4 py-3 text-[12.5px]">
            {t("adminProducts.publishHint")}
          </p>
        ) : null}
        <div className="grid gap-4 2xl:grid-cols-2">
          <ProductForm key={product.updated_at} product={product} />
          <div className="flex min-w-0 flex-col gap-4">
            <ProductImages product={product} />
            <ProductVariants product={product} />
          </div>
        </div>
      </AdminPageBody>
      <ConfirmDialog
        open={confirmDelete}
        tone="danger"
        title={t("adminProducts.confirmDelete.title", { name: product.name })}
        message={t("adminProducts.confirmDelete.text")}
        confirmLabel={t("adminProducts.delete")}
        cancelLabel={t("adminProducts.cancel")}
        pending={remove.isPending}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() =>
          remove.mutate(product.id, {
            onSuccess: () => router.replace(routes.admin.products),
            onSettled: () => setConfirmDelete(false),
          })
        }
      />
    </>
  );
}

export function ProductEditor({ id }: { id: number | null }) {
  const { data: product, error, isLoading, refetch } = useProduct(id);
  const back = { href: routes.admin.products, label: t("adminProducts.title") };

  if (id === null) {
    return (
      <>
        <AdminPageHeader title={t("adminProducts.newTitle")} back={back} />
        <AdminPageBody>
          <p className="text-muted text-[12.5px]">{t("adminProducts.newHint")}</p>
          <ProductForm product={null} />
        </AdminPageBody>
      </>
    );
  }

  if (isLoading || !product) {
    return (
      <>
        <AdminPageHeader title={t("adminProducts.editTitle")} back={back} />
        <AdminPageBody>
          {error ? <ErrorBlock error={error} onRetry={() => refetch()} /> : <LoadingBlock />}
        </AdminPageBody>
      </>
    );
  }

  return <ExistingProduct product={product} />;
}
