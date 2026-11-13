"use client";

import { createContext, useContext, useState } from "react";

import type { ProductVariant } from "@/lib/api/types";

type ProductColorState = {
  colorId: number | null;
  setColorId: (colorId: number) => void;
};

const ProductColorContext = createContext<ProductColorState | null>(null);

export function initialColorId(variants: ProductVariant[]) {
  const inStock = variants.find((variant) => variant.stock > 0);
  return (inStock ?? variants[0])?.color.id ?? null;
}

export function ProductColorProvider({
  variants,
  children,
}: {
  variants: ProductVariant[];
  children: React.ReactNode;
}) {
  const [colorId, setColorId] = useState(() => initialColorId(variants));
  return <ProductColorContext value={{ colorId, setColorId }}>{children}</ProductColorContext>;
}

export function useProductColor() {
  const context = useContext(ProductColorContext);
  if (!context) throw new Error("useProductColor must be used inside ProductColorProvider");
  return context;
}
