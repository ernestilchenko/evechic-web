"use client";

import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";

import type { Pagination as PaginationData } from "@/lib/api/types";

type PaginationProps = {
  pagination: PaginationData;
  summary: (range: { from: number; to: number; count: number }) => string;
  onChange: (page: number) => void;
};

function pageList(current: number, total: number): Array<number | "gap"> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((page) => pages.add(page));
  if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((page) => pages.add(page));
  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  return sorted.flatMap((page, index) =>
    index > 0 && page - sorted[index - 1] > 1 ? ["gap" as const, page] : [page],
  );
}

const cell = "inline-flex size-[34px] items-center justify-center rounded text-[11.5px] font-medium";

export function Pagination({ pagination, summary, onChange }: PaginationProps) {
  const { page, page_size: pageSize, count, total_pages: totalPages } = pagination;
  const from = count === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, count);

  return (
    <nav
      aria-label={t("admin.pagination.label")}
      className="border-admin-row flex flex-wrap items-center gap-2 border-t px-5 py-[18px] sm:px-[22px]"
    >
      <p className="text-placeholder flex-1 text-[11.5px]">{summary({ from, to, count })}</p>
      {totalPages > 1 ? (
        <ul className="flex flex-wrap items-center gap-2">
          <li>
            <button
              type="button"
              className={cn(cell, "border-admin-line border disabled:opacity-40")}
              onClick={() => onChange(page - 1)}
              disabled={page <= 1}
              aria-label={t("admin.pagination.previous")}
            >
              ←
            </button>
          </li>
          {pageList(page, totalPages).map((item, index) =>
            item === "gap" ? (
              <li key={`gap-${index}`} aria-hidden className={cell}>
                …
              </li>
            ) : (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => onChange(item)}
                  aria-current={item === page ? "page" : undefined}
                  aria-label={t("admin.pagination.page", { page: item })}
                  className={cn(
                    cell,
                    item === page ? "bg-ink text-cream" : "border-admin-line hover:border-ink border",
                  )}
                >
                  {item}
                </button>
              </li>
            ),
          )}
          <li>
            <button
              type="button"
              className={cn(cell, "border-admin-line border disabled:opacity-40")}
              onClick={() => onChange(page + 1)}
              disabled={page >= totalPages}
              aria-label={t("admin.pagination.next")}
            >
              →
            </button>
          </li>
        </ul>
      ) : null}
    </nav>
  );
}
