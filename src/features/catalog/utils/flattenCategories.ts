import type { CategoryTree } from "@/lib/api/types";

export function flattenCategories(tree: CategoryTree[]) {
  return tree.flatMap((category) => [category, ...category.children]);
}

export function findCategory(tree: CategoryTree[], slug: string) {
  return flattenCategories(tree).find((category) => category.slug === slug) ?? null;
}
