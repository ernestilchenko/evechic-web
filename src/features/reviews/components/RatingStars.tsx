import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";

type RatingStarsProps = {
  value: number;
  className?: string;
};

export function RatingStars({ value, className }: RatingStarsProps) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <span
      role="img"
      aria-label={t("reviews.stars", { value: rounded })}
      className={cn("text-gold inline-flex gap-0.5 text-sm leading-none", className)}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} aria-hidden className={index < Math.round(value) ? "" : "text-line-strong"}>
          ★
        </span>
      ))}
    </span>
  );
}
