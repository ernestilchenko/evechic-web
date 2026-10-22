import { formatPrice } from "@/lib/format";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";

type PriceProps = {
  price: string | number;
  oldPrice?: string | number | null;
  size?: "sm" | "lg";
  className?: string;
};

export function Price({ price, oldPrice, size = "sm", className }: PriceProps) {
  return (
    <p className={cn("flex items-baseline gap-2.5 whitespace-nowrap", className)}>
      <span className="sr-only">{t("product.price")}:</span>
      <span className={cn("font-semibold", size === "lg" ? "text-[30px]" : "text-[15px]")}>
        {formatPrice(price)}
      </span>
      {oldPrice ? (
        <>
          <span className="sr-only">{t("product.oldPrice")}:</span>
          <s className={cn("text-muted", size === "lg" ? "text-lg" : "text-[13px]")}>
            {formatPrice(oldPrice)}
          </s>
        </>
      ) : null}
    </p>
  );
}
