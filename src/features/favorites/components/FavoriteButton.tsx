"use client";

import Link from "next/link";

import { routes } from "@/data/routes";
import { useHydrated } from "@/hooks/useHydrated";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";

import { useFavorites } from "../hooks/useFavorites";

type FavoriteButtonProps = {
  productId: number;
  productSlug: string;
  className?: string;
};

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-5">
      <path
        d="M12 20.5s-7.5-4.6-7.5-10.1A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.8c0 5.5-7.5 10.1-7.5 10.1Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const base =
  "border-ink text-ink hover:bg-ink hover:text-cream flex h-[58px] w-[58px] shrink-0 items-center justify-center border transition-colors disabled:opacity-50";

export function FavoriteButton({ productId, productSlug, className }: FavoriteButtonProps) {
  const hydrated = useHydrated();
  const { isAuthenticated, isLoading: isSessionLoading, isFavorite, toggle } = useFavorites();
  const isLoading = !hydrated || isSessionLoading;

  if (!isLoading && !isAuthenticated) {
    return (
      <Link
        href={`${routes.login}?next=${encodeURIComponent(routes.product(productSlug))}`}
        aria-label={t("favorites.loginToAdd")}
        title={t("favorites.loginToAdd")}
        className={cn(base, className)}
      >
        <Heart filled={false} />
      </Link>
    );
  }

  const active = hydrated && isFavorite(productId);
  const label = active ? t("favorites.remove") : t("favorites.add");

  return (
    <button
      type="button"
      disabled={isLoading}
      aria-pressed={active}
      aria-label={label}
      title={label}
      onClick={() => toggle.mutate({ productId, active })}
      className={cn(base, active && "text-sale hover:text-cream", className)}
    >
      <Heart filled={active} />
    </button>
  );
}
