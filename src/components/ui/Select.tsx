import { cn } from "@/lib/cn";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  ref?: React.Ref<HTMLSelectElement>;
};

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <span className="relative inline-flex">
      <select
        className={cn(
          "border-admin-line text-ink focus:border-ink h-10 w-full appearance-none rounded border bg-white py-0 pr-9 pl-3.5 text-[12px] disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <span
        aria-hidden
        className="text-muted pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[10px]"
      >
        ▾
      </span>
    </span>
  );
}
