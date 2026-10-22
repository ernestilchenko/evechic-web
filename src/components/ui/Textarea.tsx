import { forwardRef, useId } from "react";

import { cn } from "@/lib/cn";

import { fieldInputClass } from "./TextField";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hideLabel?: boolean;
  error?: string | null;
  containerClassName?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hideLabel, error, id, className, containerClassName, rows = 4, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className={cn("flex min-w-0 flex-col gap-2", containerClassName)}>
      <label
        htmlFor={inputId}
        className={cn("text-muted text-[11px] tracking-[0.06em]", hideLabel && "sr-only")}
      >
        {label}
      </label>
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(fieldInputClass, "min-h-[104px] resize-y py-4 leading-normal", className)}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-sale text-[11.5px]">
          {error}
        </p>
      ) : null}
    </div>
  );
});
