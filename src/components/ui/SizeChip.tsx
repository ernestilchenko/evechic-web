import { cn } from "@/lib/cn";

type SizeChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
  size?: "sm" | "md";
};

export function SizeChip({ selected = false, size = "sm", className, children, ...props }: SizeChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "flex items-center justify-center border px-2 font-medium tracking-[0.06em] transition-colors",
        size === "md" ? "h-[46px] min-w-[52px] text-xs" : "h-[38px] min-w-10 text-[11.5px]",
        selected ? "bg-ink border-ink text-cream" : "border-line text-ink hover:border-ink",
        "disabled:border-line disabled:text-line-strong disabled:cursor-not-allowed disabled:bg-transparent disabled:line-through",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
