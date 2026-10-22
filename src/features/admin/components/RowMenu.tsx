"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/cn";

export type RowMenuItem =
  | { label: string; href: string; tone?: "default" | "danger" }
  | { label: string; onSelect: () => void; tone?: "default" | "danger"; disabled?: boolean };

type RowMenuProps = {
  label: string;
  items: RowMenuItem[];
};

export function RowMenu({ label, items }: RowMenuProps) {
  const [position, setPosition] = useState<{ top: number; right: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const open = position !== null;
  const setOpen = (value: boolean) => {
    if (!value || !ref.current) {
      setPosition(null);
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    setPosition({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
  };
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => {
      if (
        event instanceof KeyboardEvent ? event.key === "Escape" : !ref.current?.contains(event.target as Node)
      )
        setPosition(null);
    };
    const dismiss = () => setPosition(null);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
    };
  }, [open]);

  const itemClass = (tone?: "default" | "danger") =>
    cn(
      "block w-full px-4 py-2.5 text-left text-[12px] whitespace-nowrap hover:bg-admin-bg disabled:opacity-40",
      tone === "danger" && "text-sale",
    );

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(!open)}
        className="hover:bg-admin-bg rounded px-2 py-1 text-[14px] leading-none"
      >
        ⋯
      </button>
      {position ? (
        <ul
          id={menuId}
          role="menu"
          style={{ top: position.top, right: position.right }}
          className="border-admin-line fixed z-40 min-w-[190px] overflow-hidden rounded border bg-white py-1 shadow-lg"
        >
          {items.map((item) => (
            <li key={item.label} role="none">
              {"href" in item ? (
                <Link role="menuitem" href={item.href} className={itemClass(item.tone)}>
                  {item.label}
                </Link>
              ) : (
                <button
                  role="menuitem"
                  type="button"
                  disabled={item.disabled}
                  className={itemClass(item.tone)}
                  onClick={() => {
                    setOpen(false);
                    item.onSelect();
                  }}
                >
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
