"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { ColorSwatch } from "@/components/ui/ColorSwatch";
import { SizeChip } from "@/components/ui/SizeChip";
import { routes } from "@/data/routes";
import { useCart } from "@/features/cart";
import { ApiError } from "@/lib/api/client";
import type { Color, ProductVariant } from "@/lib/api/types";
import { t } from "@/lib/i18n";

type ProductPurchaseProps = {
  variants: ProductVariant[];
  sizes: string[];
  favorite?: React.ReactNode;
};

type Feedback = { tone: "error" | "success"; text: string } | null;

function uniqueColors(variants: ProductVariant[]) {
  const colors = new Map<number, Color>();
  variants.forEach((variant) => colors.set(variant.color.id, variant.color));
  return [...colors.values()];
}

export function ProductPurchase({ variants, sizes, favorite }: ProductPurchaseProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const sizeLabelId = useId();
  const colors = useMemo(() => uniqueColors(variants), [variants]);
  const initialColor =
    colors.find((color) => variants.some((variant) => variant.color.id === color.id && variant.stock > 0)) ??
    colors[0];
  const [colorId, setColorId] = useState(initialColor?.id ?? null);
  const [size, setSize] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [redirecting, setRedirecting] = useState(false);

  const selectedColor = colors.find((color) => color.id === colorId) ?? null;
  const colorVariants = variants.filter((variant) => variant.color.id === colorId);
  const sizeOrder = sizes.length ? sizes : colorVariants.map((variant) => variant.size);
  const sizeVariants = sizeOrder
    .map((value) => colorVariants.find((variant) => variant.size === value))
    .filter((variant): variant is ProductVariant => Boolean(variant));
  const selectedVariant = sizeVariants.find((variant) => variant.size === size) ?? null;
  const soldOut = !variants.some((variant) => variant.stock > 0);
  const busy = addItem.isPending || redirecting;

  const add = async (checkout: boolean) => {
    if (!selectedVariant || selectedVariant.stock <= 0) {
      setFeedback({ tone: "error", text: t("productPage.messages.selectSize") });
      return;
    }
    setFeedback(null);
    try {
      await addItem.mutateAsync({ variantId: selectedVariant.id });
      if (checkout) {
        setRedirecting(true);
        router.push(routes.checkout);
        return;
      }
      setFeedback({ tone: "success", text: t("productPage.messages.added") });
    } catch (error) {
      setFeedback({
        tone: "error",
        text: error instanceof ApiError && error.message ? error.message : t("productPage.messages.error"),
      });
    }
  };

  return (
    <div className="flex flex-col gap-[22px]">
      {colors.length > 0 ? (
        <div className="flex flex-col gap-3 pt-1.5">
          <p className="text-muted text-[10.5px] font-semibold tracking-[0.2em] uppercase" aria-live="polite">
            {selectedColor
              ? t("productPage.colorSelected", { name: selectedColor.name })
              : t("productPage.color")}
          </p>
          <div role="group" aria-label={t("productPage.color")} className="flex flex-wrap gap-2.5">
            {colors.map((color) => (
              <ColorSwatch
                key={color.id}
                size="md"
                hex={color.hex}
                label={color.name}
                selected={color.id === colorId}
                onClick={() => {
                  setColorId(color.id);
                  setFeedback(null);
                  const match = variants.find(
                    (variant) => variant.color.id === color.id && variant.size === size,
                  );
                  if (!match || match.stock <= 0) setSize(null);
                }}
              />
            ))}
          </div>
        </div>
      ) : null}

      {sizeVariants.length > 0 ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline">
            <p
              id={sizeLabelId}
              className="text-muted flex-1 text-[10.5px] font-semibold tracking-[0.2em] uppercase"
            >
              {t("productPage.size")}
            </p>
            <Link href={routes.sizeGuide} className="text-gold hover:text-ink -my-2 py-2 text-[12px]">
              {t("productPage.sizeGuide")}
            </Link>
          </div>
          <div role="group" aria-labelledby={sizeLabelId} className="flex flex-wrap gap-2">
            {sizeVariants.map((variant) => (
              <SizeChip
                key={variant.id}
                size="md"
                selected={variant.size === size}
                disabled={variant.stock <= 0}
                aria-label={
                  variant.stock <= 0 ? t("productPage.sizeUnavailable", { size: variant.size }) : undefined
                }
                onClick={() => {
                  setSize(variant.size);
                  setFeedback(null);
                }}
              >
                {variant.size}
              </SizeChip>
            ))}
          </div>
          {selectedVariant?.stock_state === "low" ? (
            <p className="text-sale text-xs">{t("productPage.availability.low")}</p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <Button
          className="h-[58px] w-full py-0 sm:w-auto sm:flex-1"
          onClick={() => add(false)}
          disabled={soldOut || busy}
          aria-describedby="purchase-feedback"
        >
          {addItem.isPending && !redirecting
            ? t("productPage.actions.adding")
            : t("productPage.actions.addToCart")}
        </Button>
        <div className="flex gap-3 sm:flex-1">
          <Button
            variant="outline"
            className="h-[58px] flex-1 py-0"
            onClick={() => add(true)}
            disabled={soldOut || busy}
            aria-describedby="purchase-feedback"
          >
            {t("productPage.actions.buyNow")}
          </Button>
          {favorite}
        </div>
      </div>
      <div id="purchase-feedback" aria-live="polite" className="-mt-2 min-h-5 text-[12.5px]">
        {feedback ? (
          <p className={feedback.tone === "error" ? "text-sale" : "text-success"}>
            {feedback.text}
            {feedback.tone === "success" ? (
              <>
                {" · "}
                <Link href={routes.cart} className="text-ink underline underline-offset-2">
                  {t("productPage.actions.goToCart")}
                </Link>
              </>
            ) : null}
          </p>
        ) : null}
      </div>
    </div>
  );
}
