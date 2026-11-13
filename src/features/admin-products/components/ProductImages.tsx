"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Panel } from "@/features/admin";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";

import { useDeleteImage, useReorderImages, useUpdateImage, useUploadImages } from "../hooks/useProductMedia";
import type { Product, ProductImage } from "../types";

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif";

function move(list: ProductImage[], from: number, to: number) {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next.map((image) => image.id);
}

export function ProductImages({ product }: { product: Product }) {
  const upload = useUploadImages(product.id);
  const reorder = useReorderImages(product.id);
  const remove = useDeleteImage(product.id);
  const update = useUpdateImage(product.id);
  const colors = useMemo(() => {
    const unique = new Map<number, { id: number; name: string }>();
    product.variants.forEach((variant) => unique.set(variant.color.id, variant.color));
    return [...unique.values()];
  }, [product.variants]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [toDelete, setToDelete] = useState<ProductImage | null>(null);
  const images = product.images;

  const addFiles = (files: FileList | null) => {
    const list = Array.from(files ?? []).filter((file) => file.type.startsWith("image/"));
    if (list.length > 0) upload.mutate(list);
  };

  return (
    <Panel title={t("adminProducts.images.title")} titleId="product-images">
      <div
        onDragOver={(event) => {
          if (dragIndex !== null) return;
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          if (dragIndex !== null) return;
          event.preventDefault();
          setDragOver(false);
          addFiles(event.dataTransfer.files);
        }}
        className={cn(
          "border-admin-check flex flex-col items-center gap-2 rounded border border-dashed px-4 py-7 text-center",
          dragOver && "border-ink bg-admin-bg",
        )}
      >
        <p className="text-[12.5px]">{t("adminProducts.images.drop")}</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-gold hover:text-ink text-[11px] font-semibold tracking-[0.12em] uppercase"
        >
          {t("adminProducts.images.choose")}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="sr-only"
          aria-label={t("adminProducts.images.choose")}
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <p aria-live="polite" className="text-placeholder text-[11px]">
          {upload.isPending ? t("adminProducts.images.uploading") : t("adminProducts.images.hint")}
        </p>
      </div>
      {images.length > 0 ? (
        <ol className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {images.map((image, index) => (
            <li
              key={image.id}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragEnd={() => setDragIndex(null)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (dragIndex !== null && dragIndex !== index) reorder.mutate(move(images, dragIndex, index));
                setDragIndex(null);
              }}
              className={cn(
                "border-admin-line group flex cursor-grab flex-col overflow-hidden rounded border bg-white",
                dragIndex === index && "opacity-50",
              )}
            >
              <div className="bg-sand relative aspect-[3/4]">
                <Image
                  src={image.url}
                  alt={image.alt || product.name}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
                {index === 0 ? (
                  <span className="bg-ink text-cream absolute top-2 left-2 rounded px-2 py-1 text-[9px] font-semibold tracking-[0.12em] uppercase">
                    {t("adminProducts.images.main")}
                  </span>
                ) : null}
              </div>
              <div className="flex items-center justify-between gap-1 px-2 py-1.5">
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={index === 0 || reorder.isPending}
                    onClick={() => reorder.mutate(move(images, index, index - 1))}
                    aria-label={t("adminProducts.images.moveLeft", { index: index + 1 })}
                    className="hover:bg-admin-bg rounded px-1.5 py-1 text-[12px] disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    disabled={index === images.length - 1 || reorder.isPending}
                    onClick={() => reorder.mutate(move(images, index, index + 1))}
                    aria-label={t("adminProducts.images.moveRight", { index: index + 1 })}
                    className="hover:bg-admin-bg rounded px-1.5 py-1 text-[12px] disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setToDelete(image)}
                  aria-label={t("adminProducts.images.delete", { index: index + 1 })}
                  className="text-sale hover:bg-admin-danger-bg rounded px-1.5 py-1 text-[12px]"
                >
                  ×
                </button>
              </div>
              {colors.length > 1 ? (
                <select
                  value={image.color ?? ""}
                  disabled={update.isPending}
                  onChange={(event) =>
                    update.mutate({
                      imageId: image.id,
                      body: { color: event.target.value ? Number(event.target.value) : null },
                    })
                  }
                  aria-label={t("adminProducts.images.color", { index: index + 1 })}
                  className="border-admin-line mx-2 mb-2 rounded border bg-white px-1.5 py-1 text-[11.5px]"
                >
                  <option value="">{t("adminProducts.images.allColors")}</option>
                  {colors.map((color) => (
                    <option key={color.id} value={color.id}>
                      {color.name}
                    </option>
                  ))}
                </select>
              ) : null}
            </li>
          ))}
        </ol>
      ) : null}
      <ConfirmDialog
        open={toDelete !== null}
        tone="danger"
        title={t("adminProducts.images.confirmTitle")}
        confirmLabel={t("adminProducts.delete")}
        cancelLabel={t("adminProducts.cancel")}
        pending={remove.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate(toDelete.id, { onSettled: () => setToDelete(null) })}
      />
    </Panel>
  );
}
