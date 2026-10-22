import { cn } from "@/lib/cn";

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: React.ReactNode;
  trailing?: React.ReactNode;
};

export function Checkbox({ label, trailing, className, ...props }: CheckboxProps) {
  return (
    <label className={cn("group flex cursor-pointer items-center gap-3 text-[13px]", className)}>
      <input type="checkbox" className="peer sr-only" {...props} />
      <span
        aria-hidden
        className="border-line-strong peer-checked:bg-ink peer-checked:border-ink peer-focus-visible:outline-gold flex size-3.5 shrink-0 items-center justify-center border peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-disabled:opacity-40"
      >
        <svg viewBox="0 0 10 10" className="text-cream hidden size-2.5 group-has-[:checked]:block">
          <path d="M1.5 5.2 4 7.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </span>
      <span className="flex-1">{label}</span>
      {trailing !== undefined ? <span className="text-placeholder text-xs">{trailing}</span> : null}
    </label>
  );
}
