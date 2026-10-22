import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import { t } from "@/lib/i18n";

export function UpdatedAt({ value, className }: { value: string; className?: string }) {
  return (
    <p className={cn("text-placeholder text-[12px]", className)}>
      <time dateTime={value}>{t("contentPages.updated", { date: formatDate(value) })}</time>
    </p>
  );
}
