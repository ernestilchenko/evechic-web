import { useId } from "react";

import { cn } from "@/lib/cn";

export const inputClass =
  "border-admin-line text-ink placeholder:text-placeholder h-10 w-full rounded border bg-white px-3.5 text-[12.5px] focus:border-ink aria-[invalid=true]:border-sale disabled:bg-admin-bg disabled:opacity-70";

type FieldProps = {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: (props: { id: string; "aria-invalid"?: boolean; "aria-describedby"?: string }) => React.ReactNode;
};

export function Field({ label, error, hint, className, children }: FieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error || hint;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-muted text-[11px] font-semibold tracking-[0.06em]">
        {label}
      </label>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": message ? messageId : undefined,
      })}
      {message ? (
        <p id={messageId} className={cn("text-[11px]", error ? "text-sale" : "text-placeholder")}>
          {message}
        </p>
      ) : null}
    </div>
  );
}

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & { ref?: React.Ref<HTMLInputElement> };

export function TextInput({ className, ...props }: TextInputProps) {
  return <input className={cn(inputClass, className)} {...props} />;
}

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextArea({ className, rows = 4, ...props }: TextAreaProps) {
  return (
    <textarea rows={rows} className={cn(inputClass, "h-auto py-2.5 leading-relaxed", className)} {...props} />
  );
}

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & { label: React.ReactNode };

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-2.5 text-[12.5px]", className)}>
      <input type="checkbox" className="accent-ink border-admin-check size-[15px] rounded-[3px]" {...props} />
      {label}
    </label>
  );
}
