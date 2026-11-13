"use client";

import { useProductColor } from "./ProductColorContext";
import { ProductGallery } from "./ProductGallery";

type ColorImage = { url: string; alt: string; color: number | null };

export function imagesForColor(images: ColorImage[], colorId: number | null) {
  if (colorId === null || !images.some((image) => image.color !== null)) return images;
  const matching = images.filter((image) => image.color === colorId || image.color === null);
  return matching.some((image) => image.color === colorId) ? matching : images;
}

export function ProductColorGallery({ images, badge }: { images: ColorImage[]; badge?: React.ReactNode }) {
  const { colorId } = useProductColor();
  return <ProductGallery key={colorId ?? "all"} images={imagesForColor(images, colorId)} badge={badge} />;
}
