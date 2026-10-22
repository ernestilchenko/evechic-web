"use client";

import { Select } from "@/components/ui/Select";

import type { AdminCategory } from "../types";

type Option = { id: number; label: string; depth: number };

export function categoryOptions(categories: AdminCategory[]): Option[] {
  const byParent = new Map<number | null, AdminCategory[]>();
  categories.forEach((category) => {
    const list = byParent.get(category.parent) ?? [];
    list.push(category);
    byParent.set(category.parent, list);
  });
  const walk = (parent: number | null, depth: number): Option[] =>
    (byParent.get(parent) ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .flatMap((category) => [
        { id: category.id, label: category.name, depth },
        ...walk(category.id, depth + 1),
      ]);
  return walk(null, 0);
}

type CategorySelectProps = Omit<React.ComponentProps<typeof Select>, "children"> & {
  categories: AdminCategory[];
  emptyLabel: string;
};

export function CategorySelect({ categories, emptyLabel, ...props }: CategorySelectProps) {
  return (
    <Select {...props}>
      <option value="">{emptyLabel}</option>
      {categoryOptions(categories).map((option) => (
        <option key={option.id} value={option.id}>
          {`${"— ".repeat(option.depth)}${option.label}`}
        </option>
      ))}
    </Select>
  );
}
