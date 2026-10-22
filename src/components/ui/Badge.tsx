import { cn } from "@/lib/cn";

type BadgeProps = {
  children: React.ReactNode;
  tone?: "light" | "sale";
  className?: string;
};

export function Badge({ children, tone = "light", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex px-3 py-[7px] text-[10px] leading-none font-semibold tracking-[0.14em] uppercase",
        tone === "sale" ? "bg-sale text-cream" : "bg-cream text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}
