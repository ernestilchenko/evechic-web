import { cn } from "@/lib/cn";

import type { ChipTone } from "../types";

const tones: Record<ChipTone, string> = {
  info: "bg-admin-info-bg text-admin-info",
  warn: "bg-admin-warn-bg text-admin-warn",
  success: "bg-admin-success-bg text-admin-success",
  danger: "bg-admin-danger-bg text-admin-danger",
  violet: "bg-admin-violet-bg text-admin-violet",
  neutral: "bg-admin-neutral-bg text-muted",
};

type StatusChipProps = {
  tone: ChipTone;
  children: React.ReactNode;
  className?: string;
};

export function StatusChip({ tone, children, className }: StatusChipProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1.5 text-[9.5px] leading-none font-semibold tracking-[0.12em] whitespace-nowrap uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
