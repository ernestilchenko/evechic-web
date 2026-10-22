import { cn } from "@/lib/cn";

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: React.ReactNode;
  description?: React.ReactNode;
};

export function Checkbox({ label, description, className, ...props }: CheckboxProps) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3", className)}>
      <input
        type="checkbox"
        className="border-placeholder checked:border-ink checked:bg-ink focus-visible:outline-gold mt-px size-3.5 shrink-0 cursor-pointer appearance-none border bg-white bg-center bg-no-repeat checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2014%2014%22%3E%3Cpath%20d=%22M3%207.5l2.5%202.5L11%204.5%22%20fill=%22none%22%20stroke=%22%23f7f4f0%22%20stroke-width=%221.6%22/%3E%3C/svg%3E')] disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      />
      <span className="flex flex-col gap-1">
        <span className="text-[12.5px] leading-[1.15]">{label}</span>
        {description ? <span className="text-muted text-[11.5px]">{description}</span> : null}
      </span>
    </label>
  );
}
