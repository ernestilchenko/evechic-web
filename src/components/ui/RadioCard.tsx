import { cn } from "@/lib/cn";

type RadioCardProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  description?: React.ReactNode;
  aside?: React.ReactNode;
};

export function RadioCard({
  label,
  description,
  aside,
  className,
  checked,
  disabled,
  ...props
}: RadioCardProps) {
  return (
    <label
      className={cn(
        "has-[:focus-visible]:outline-gold flex cursor-pointer items-center gap-3.5 border px-[18px] py-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
        checked ? "border-ink bg-sand" : "border-line hover:border-field",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <input type="radio" className="peer sr-only" checked={checked} disabled={disabled} {...props} />
      <span
        aria-hidden="true"
        className={cn(
          "flex size-[15px] shrink-0 items-center justify-center rounded-full border",
          checked ? "border-ink" : "border-placeholder",
        )}
      >
        {checked ? <span className="bg-ink size-[9px] rounded-full" /> : null}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-[13px] font-medium">{label}</span>
        {description ? <span className="text-muted text-[11.5px]">{description}</span> : null}
      </span>
      {aside}
    </label>
  );
}
