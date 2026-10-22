"use client";

import { useRef } from "react";

import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";

type CodeInputProps = {
  length: number;
  value: string[];
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
  onChange: (digits: string[]) => void;
};

export function CodeInput({ length, value, disabled, invalid, describedBy, onChange }: CodeInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const focus = (index: number) => {
    const target = refs.current[Math.max(0, Math.min(length - 1, index))];
    target?.focus();
    target?.select();
  };

  const fill = (start: number, raw: string) => {
    const incoming = raw.replace(/\D/g, "").split("");
    if (incoming.length === 0) return;
    const next = [...value];
    incoming.slice(0, length - start).forEach((digit, offset) => {
      next[start + offset] = digit;
    });
    onChange(next);
    focus(Math.min(start + incoming.length, length - 1));
  };

  return (
    <div role="group" aria-label={t("auth.code.groupLabel")} className="flex gap-2.5 sm:gap-3.5">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={index === 0 ? length : 1}
          autoFocus={index === 0}
          disabled={disabled}
          value={value[index] ?? ""}
          aria-label={t("auth.code.digitLabel", { index: index + 1, total: length })}
          aria-invalid={invalid ? true : undefined}
          aria-describedby={describedBy}
          onFocus={(event) => event.currentTarget.select()}
          onChange={(event) => {
            const raw = event.target.value;
            if (raw === "") {
              const next = [...value];
              next[index] = "";
              onChange(next);
              return;
            }
            if (raw.replace(/\D/g, "").length >= length) {
              fill(0, raw);
              return;
            }
            fill(index, raw.length > 1 && value[index] ? raw.replace(value[index], "") || raw : raw);
          }}
          onPaste={(event) => {
            event.preventDefault();
            fill(0, event.clipboardData.getData("text"));
          }}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !value[index] && index > 0) {
              event.preventDefault();
              const next = [...value];
              next[index - 1] = "";
              onChange(next);
              focus(index - 1);
            } else if (event.key === "ArrowLeft") {
              event.preventDefault();
              focus(index - 1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              focus(index + 1);
            }
          }}
          className={cn(
            "caret-ink h-[72px] w-full min-w-0 flex-1 border bg-white text-center font-serif text-[40px] font-light transition-colors focus:outline-none sm:h-[84px] sm:max-w-[90px]",
            invalid ? "border-sale" : "border-line focus:border-ink focus:border-[1.5px]",
            "disabled:opacity-60",
          )}
        />
      ))}
    </div>
  );
}
