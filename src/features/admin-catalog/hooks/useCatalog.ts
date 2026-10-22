"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getErrorMessage, useAdminToast } from "@/features/admin";
import { t } from "@/lib/i18n";

import { catalogKeys } from "../constants/keys";
import {
  deleteCategory,
  deleteColor,
  fetchCategories,
  fetchColors,
  saveCategory,
  saveColor,
} from "../services/catalogService";
import type { AdminColor, CategoryDraft, ColorWrite } from "../types";

export function useCategories() {
  return useQuery({ queryKey: catalogKeys.categories, queryFn: fetchCategories });
}

export function useColors() {
  return useQuery({ queryKey: catalogKeys.colors, queryFn: fetchColors });
}

export function useSaveCategory() {
  const queryClient = useQueryClient();
  const toast = useAdminToast();
  return useMutation({
    mutationFn: ({ id, draft }: { id: number | null; draft: CategoryDraft }) => saveCategory(id, draft),
    onSuccess: () => toast.success(t("adminCatalog.toast.categorySaved")),
    onSettled: () => queryClient.invalidateQueries({ queryKey: catalogKeys.categories }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const toast = useAdminToast();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => toast.success(t("adminCatalog.toast.categoryDeleted")),
    onError: (error) => toast.error(getErrorMessage(error, t("adminCatalog.toast.deleteFailed"))),
    onSettled: () => queryClient.invalidateQueries({ queryKey: catalogKeys.categories }),
  });
}

export function useSaveColor() {
  const queryClient = useQueryClient();
  const toast = useAdminToast();
  return useMutation({
    mutationFn: ({ id, body }: { id: number | null; body: ColorWrite }) => saveColor(id, body),
    onSuccess: (color) => {
      queryClient.setQueryData<AdminColor[]>(catalogKeys.colors, (list) =>
        list
          ? list.some((item) => item.id === color.id)
            ? list.map((item) => (item.id === color.id ? color : item))
            : [...list, color]
          : list,
      );
      toast.success(t("adminCatalog.toast.colorSaved"));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: catalogKeys.colors }),
  });
}

export function useDeleteColor() {
  const queryClient = useQueryClient();
  const toast = useAdminToast();
  return useMutation({
    mutationFn: deleteColor,
    onSuccess: (_, id) => {
      queryClient.setQueryData<AdminColor[]>(catalogKeys.colors, (list) =>
        list?.filter((item) => item.id !== id),
      );
      toast.success(t("adminCatalog.toast.colorDeleted"));
    },
    onError: (error) => toast.error(getErrorMessage(error, t("adminCatalog.toast.deleteFailed"))),
    onSettled: () => queryClient.invalidateQueries({ queryKey: catalogKeys.colors }),
  });
}
