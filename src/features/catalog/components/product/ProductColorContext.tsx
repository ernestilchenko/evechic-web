"use client";

import { useSearchParams } from "next/navigation";
import { createContext, useContext, useState } from "react";

import type { ProductImage, ProductVariant } from "@/lib/api/types";

type ProductColorState = {
  colorId: number | null;
  setColorId: (colorId: number) => void;
};

const ProductColorContext = createContext<ProductColorState | null>(null);

export function initialColorId(variants: ProductVariant[], images: ProductImage[] = []) {
  const inStock = variants.filter((variant) => variant.stock > 0);
  const mainColor = images[0]?.color;
  const main = inStock.find((variant) => variant.color.id === mainColor);
  return (main ?? inStock[0] ?? variants[0])?.color.id ?? null;
}

export function ProductColorProvider({
  variants,
  images,
  children,
}: {
  variants: ProductVariant[];
  images: ProductImage[];
  children: React.ReactNode;
}) {
  const requested = Number(useSearchParams().get("color"));
  const [colorId, setColorId] = useState(() =>
    variants.some((variant) => variant.color.id === requested) ? requested : initialColorId(variants, images),
  );
  return <ProductColorContext value={{ colorId, setColorId }}>{children}</ProductColorContext>;
}

export function useProductColor() {
  const context = useContext(ProductColorContext);
  if (!context) throw new Error("useProductColor must be used inside ProductColorProvider");
  return context;
}
