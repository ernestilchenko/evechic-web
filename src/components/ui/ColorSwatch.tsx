import { cn } from "@/lib/cn";

type ColorSwatchProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  hex: string;
  label: string;
  selected?: boolean;
  size?: "sm" | "md";
};

export function ColorSwatch({
  hex,
  label,
  selected = false,
  size = "sm",
  className,
  ...props
}: ColorSwatchProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={label}
      title={label}
      className={cn(
        "rounded-full transition-shadow disabled:cursor-not-allowed disabled:opacity-40",
        size === "md" ? "size-[30px]" : "size-6",
        selected ? "ring-ink ring-2 ring-inset" : "ring-line hover:ring-ink/60 ring-1 ring-inset",
        className,
      )}
      style={{ backgroundColor: hex }}
      {...props}
    />
  );
}
