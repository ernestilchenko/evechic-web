import { forwardRef, useId } from "react";

import { cn } from "@/lib/cn";

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string | null;
  hint?: string;
  containerClassName?: string;
};

export const fieldInputClass =
  "w-full border border-line bg-white px-4 text-[13px] text-ink transition-colors placeholder:text-placeholder hover:border-field focus:border-ink focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-sale";

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, hint, id, className, containerClassName, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ");

  return (
    <div className={cn("flex min-w-0 flex-col gap-2", containerClassName)}>
      <label htmlFor={inputId} className="text-muted text-[11px] tracking-[0.06em]">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={cn(fieldInputClass, "h-[52px]", className)}
        {...props}
      />
      {hint && !error ? (
        <p id={hintId} className="text-muted text-[11.5px]">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sale text-[11.5px]">
          {error}
        </p>
      ) : null}
    </div>
  );
});
