"use client";

import { useId, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";

export type ComboboxOption = { key: string; label: string; detail?: string };

type ComboboxProps = {
  id?: string;
  label: string;
  value: string;
  onTextChange: (text: string) => void;
  onSelect: (key: string) => void;
  options: ComboboxOption[];
  loading?: boolean;
  unavailable?: boolean;
  hint?: string | null;
  error?: string | null;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  inputClassName: string;
  labelClassName: string;
};

export function Combobox({
  id,
  label,
  value,
  onTextChange,
  onSelect,
  options,
  loading = false,
  unavailable = false,
  hint,
  error,
  placeholder,
  required,
  disabled,
  inputClassName,
  labelClassName,
}: ComboboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listId = `${inputId}-list`;
  const messageId = `${inputId}-message`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showList = open && !disabled && (options.length > 0 || loading);
  const message = error ?? (unavailable ? t("delivery.unavailable") : hint);

  const choose = (option: ComboboxOption) => {
    onSelect(option.key);
    setOpen(false);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((index) => Math.min(index + 1, options.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && showList && options[active]) {
      event.preventDefault();
      choose(options[active]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor={inputId} className={labelClassName}>
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && options[active] ? `${listId}-${active}` : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onChange={(event) => {
            onTextChange(event.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            blurTimer.current = setTimeout(() => setOpen(false), 120);
          }}
          onKeyDown={onKeyDown}
          className={inputClassName}
        />
        {showList ? (
          <ul
            id={listId}
            role="listbox"
            aria-label={label}
            onMouseDown={(event) => {
              event.preventDefault();
              if (blurTimer.current) clearTimeout(blurTimer.current);
            }}
            className="border-line absolute top-full right-0 left-0 z-30 mt-1 max-h-72 overflow-y-auto border bg-white shadow-lg"
          >
            {loading && options.length === 0 ? (
              <li className="text-muted px-4 py-3 text-[12.5px]">{t("delivery.loading")}</li>
            ) : null}
            {options.map((option, index) => (
              <li
                key={option.key}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === active}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(option)}
                className={cn(
                  "flex cursor-pointer flex-col px-4 py-2.5 text-[13px]",
                  index === active && "bg-sand",
                )}
              >
                <span>{option.label}</span>
                {option.detail ? <span className="text-muted text-[11.5px]">{option.detail}</span> : null}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {message ? (
        <p id={messageId} className={cn("text-[11.5px]", error ? "text-sale" : "text-muted")}>
          {message}
        </p>
      ) : null}
    </div>
  );
}
