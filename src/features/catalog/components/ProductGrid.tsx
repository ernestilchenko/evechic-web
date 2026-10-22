import type { ProductCard as ProductCardData } from "@/lib/api/types";
import { cn } from "@/lib/cn";

import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  products: ProductCardData[];
  columns?: 3 | 4;
  priorityCount?: number;
  className?: string;
};

export function ProductGrid({ products, columns = 4, priorityCount = 0, className }: ProductGridProps) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-10",
        columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3 lg:gap-x-5",
        className,
      )}
    >
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            priority={index < priorityCount}
            sizes={columns === 4 ? "(min-width: 1024px) 25vw, 50vw" : "(min-width: 1024px) 23vw, 50vw"}
          />
        </li>
      ))}
    </ul>
  );
}
