"use client";

import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { routes } from "@/data/routes";
import { ProductCard } from "@/features/catalog";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";

import { useFavorites } from "../hooks/useFavorites";

type FavoritesGridProps = {
  columns?: 2 | 3 | 4;
  className?: string;
};

const columnClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-3 lg:grid-cols-4",
};

export function FavoritesGrid({ columns = 3, className }: FavoritesGridProps) {
  const { favorites, isLoading, isError, toggle } = useFavorites();
  const gridClass = cn("grid grid-cols-2 gap-x-4 gap-y-10", columnClasses[columns], className);

  if (isLoading) {
    return (
      <ul className={gridClass} aria-busy="true" aria-label={t("favorites.title")}>
        {Array.from({ length: columns }, (_, index) => (
          <li key={index} className="bg-sand aspect-[316/430] animate-pulse" />
        ))}
      </ul>
    );
  }

  if (isError) {
    return <p className="text-sale text-[13px]">{t("favorites.error")}</p>;
  }

  if (favorites.length === 0) {
    return (
      <EmptyState
        title={t("favorites.empty")}
        action={
          <ButtonLink href={routes.catalog} variant="outline">
            {t("favorites.emptyAction")}
          </ButtonLink>
        }
      />
    );
  }

  return (
    <ul className={gridClass} aria-label={t("favorites.title")}>
      {favorites.map((product) => (
        <li key={product.id} className="flex flex-col gap-3">
          <ProductCard product={product} sizes="(min-width: 1024px) 25vw, 50vw" />
          <button
            type="button"
            onClick={() => toggle.mutate({ productId: product.id, active: true })}
            disabled={toggle.isPending && toggle.variables?.productId === product.id}
            className="text-muted hover:text-ink self-start text-xs underline underline-offset-2 disabled:opacity-50"
          >
            {t("favorites.removeItem")}
            <span className="sr-only">: {product.name}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
