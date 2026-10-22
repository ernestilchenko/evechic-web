import { cn } from "@/lib/cn";

type AccordionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  variant?: "caps" | "plain";
};

const variants = {
  caps: {
    summary: "py-5",
    title: "text-[11px] font-semibold tracking-[0.18em] uppercase",
    icon: "text-[15px]",
    body: "pb-5 text-[13px] leading-[1.75]",
  },
  plain: {
    summary: "py-[22px]",
    title: "text-[15px] leading-[1.5] font-medium",
    icon: "text-base",
    body: "-mt-2 max-w-[820px] pb-[22px] text-[13.5px] leading-[1.75]",
  },
} as const;

export function Accordion({
  title,
  children,
  defaultOpen = false,
  className,
  variant = "caps",
}: AccordionProps) {
  const styles = variants[variant];
  return (
    <details open={defaultOpen} className={cn("group border-line border-t", className)}>
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center gap-4 [&::-webkit-details-marker]:hidden",
          styles.summary,
        )}
      >
        <span className={cn("flex-1", styles.title)}>{title}</span>
        <span aria-hidden className={cn("text-muted leading-none group-open:hidden", styles.icon)}>
          +
        </span>
        <span aria-hidden className={cn("text-muted hidden leading-none group-open:inline", styles.icon)}>
          −
        </span>
      </summary>
      <div className={cn("text-muted", styles.body)}>{children}</div>
    </details>
  );
}
