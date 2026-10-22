import { useId } from "react";

export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  const id = useId();
  return (
    <fieldset aria-labelledby={id} className="flex min-w-0 flex-col gap-[18px]">
      <legend className="sr-only">{title}</legend>
      <h2 id={id} aria-hidden="true" className="text-[11px] font-semibold tracking-[0.2em] uppercase">
        {title}
      </h2>
      {children}
    </fieldset>
  );
}
