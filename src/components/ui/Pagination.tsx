import Link from "next/link";

import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";

type PaginationProps = {
  page: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
  className?: string;
};

function pageWindow(page: number, totalPages: number) {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages].filter((value) => value >= 1 && value <= totalPages).sort((a, b) => a - b);
  return sorted.flatMap((value, index) =>
    index > 0 && value - sorted[index - 1] > 1 ? (["gap", value] as const) : ([value] as const),
  );
}

const cell = "flex size-11 items-center justify-center border text-[12.5px] font-medium transition-colors";

export function Pagination({ page, totalPages, hrefForPage, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label={t("common.pagination.label")} className={className}>
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {page > 1 ? (
          <li>
            <Link
              href={hrefForPage(page - 1)}
              rel="prev"
              aria-label={t("common.pagination.previous")}
              className={cn(cell, "border-line hover:border-ink")}
            >
              ←
            </Link>
          </li>
        ) : null}
        {pageWindow(page, totalPages).map((value, index) =>
          value === "gap" ? (
            <li key={`gap-${index}`} aria-hidden className="text-muted px-1 text-[12.5px]">
              …
            </li>
          ) : (
            <li key={value}>
              <Link
                href={hrefForPage(value)}
                aria-label={t("common.pagination.page", { page: value })}
                aria-current={value === page ? "page" : undefined}
                className={cn(
                  cell,
                  value === page ? "bg-ink border-ink text-cream" : "border-line hover:border-ink",
                )}
              >
                {value}
              </Link>
            </li>
          ),
        )}
        {page < totalPages ? (
          <li>
            <Link
              href={hrefForPage(page + 1)}
              rel="next"
              aria-label={t("common.pagination.next")}
              className={cn(cell, "border-line hover:border-ink")}
            >
              →
            </Link>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}
