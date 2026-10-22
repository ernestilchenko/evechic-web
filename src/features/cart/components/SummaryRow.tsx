import { cn } from "@/lib/cn";

type SummaryRowProps = {
  label: React.ReactNode;
  value: React.ReactNode;
  tone?: "default" | "discount" | "total";
};

export function SummaryRow({ label, value, tone = "default" }: SummaryRowProps) {
  const isTotal = tone === "total";
  return (
    <div className={cn("flex items-center gap-4", isTotal ? "font-semibold" : "text-[13px]")}>
      <dt className={cn("min-w-0 flex-1", isTotal ? "text-sm" : "text-muted")}>{label}</dt>
      <dd
        className={cn(
          "whitespace-nowrap",
          isTotal ? "text-xl" : "font-medium",
          tone === "discount" && "text-sale",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
