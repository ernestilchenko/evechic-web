"use client";

import { useRef } from "react";

import { cn } from "@/lib/cn";

export type TabItem<T extends string> = {
  value: T;
  label: string;
  count?: number;
};

type TabsProps<T extends string> = {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  controls?: string;
  className?: string;
};

export function Tabs<T extends string>({ items, value, onChange, label, controls, className }: TabsProps<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusTab = (index: number) => {
    const next = (index + items.length) % items.length;
    refs.current[next]?.focus();
    onChange(items[next].value);
  };

  return (
    <div role="tablist" aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item, index) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={controls}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") focusTab(index + 1);
              if (event.key === "ArrowLeft") focusTab(index - 1);
            }}
            className={cn(
              "inline-flex items-center gap-2 rounded border px-4 py-[11px] text-[11.5px] leading-none transition-colors",
              selected
                ? "bg-ink border-ink text-cream font-semibold"
                : "border-admin-line text-ink hover:border-ink bg-white font-medium",
            )}
          >
            {item.label}
            {item.count !== undefined ? (
              <span className={cn("text-[11px] font-normal", selected ? "text-gold" : "text-placeholder")}>
                {item.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
