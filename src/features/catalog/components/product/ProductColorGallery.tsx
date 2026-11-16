"use client";

import { t } from "@/lib/i18n";

import { useProductColor } from "./ProductColorContext";
import { ProductGallery } from "./ProductGallery";

type ColorImage = { url: string; alt: string; color: number | null };

function hasColorPhotos(images: ColorImage[], colorId: number | null) {
  return images.some((image) => image.color === colorId);
}

export function imagesForColor(images: ColorImage[], colorId: number | null) {
  if (!hasColorPhotos(images, colorId)) return images;
  return images.filter((image) => image.color === colorId || image.color === null);
}

function missingColorPhoto(images: ColorImage[], colorId: number | null) {
  return colorId !== null && images.some((image) => image.color !== null) && !hasColorPhotos(images, colorId);
}

export function ProductColorGallery({ images, badge }: { images: ColorImage[]; badge?: React.ReactNode }) {
  const { colorId } = useProductColor();
  return (
    <div className="flex flex-col gap-3">
      <ProductGallery key={colorId ?? "all"} images={imagesForColor(images, colorId)} badge={badge} />
      {missingColorPhoto(images, colorId) ? (
        <p className="bg-sand text-muted px-4 py-3 text-[12.5px] leading-relaxed" role="status">
          {t("productPage.noColorPhoto")}
        </p>
      ) : null}
    </div>
  );
}
