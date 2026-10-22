"use client";

import { useId, useRef, useState } from "react";

import { cn } from "@/lib/cn";

import { SEARCH_DEBOUNCE_MS } from "../constants/queryKeys";

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  className?: string;
  live?: boolean;
};

export function SearchField({
  value,
  onChange,
  label,
  placeholder,
  className,
  live = true,
}: SearchFieldProps) {
  const id = useId();
  const [draft, setDraft] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const schedule = (next: string) => {
    setDraft(next);
    if (!live) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(next.trim()), SEARCH_DEBOUNCE_MS);
  };

  return (
    <div role="search" className={cn("w-full sm:w-[280px]", className)}>
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="search"
        value={draft}
        onChange={(event) => schedule(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== "Enter") return;
          event.preventDefault();
          if (timer.current) clearTimeout(timer.current);
          onChange(draft.trim());
        }}
        placeholder={placeholder}
        className="bg-admin-bg border-admin-line placeholder:text-placeholder focus:border-ink h-10 w-full rounded border px-3.5 text-[12px]"
      />
    </div>
  );
}
