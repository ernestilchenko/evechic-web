"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getErrorMessage, useAdminToast } from "@/features/admin";
import { t } from "@/lib/i18n";

import { productKeys } from "../constants/products";
import {
  bulkStatus,
  createProduct,
  deleteProduct,
  fetchCategories,
  fetchColors,
  fetchProduct,
  fetchProducts,
  publishProduct,
  updateProduct,
} from "../services/productsService";
import type { Product, ProductListParams, ProductStatus, ProductWrite } from "../types";

export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => fetchProducts(params),
    placeholderData: keepPreviousData,
  });
}

export function useProduct(id: number | null) {
  return useQuery({
    queryKey: productKeys.detail(id ?? 0),
    queryFn: () => fetchProduct(id ?? 0),
    enabled: id !== null,
  });
}

export function useCategoriesOptions() {
  return useQuery({ queryKey: productKeys.categories, queryFn: fetchCategories, staleTime: 60_000 });
}

export function useColorsOptions() {
  return useQuery({ queryKey: productKeys.colors, queryFn: fetchColors, staleTime: 60_000 });
}

function useInvalidateProducts() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: productKeys.all });
    queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
  };
}

export function useSaveProduct(id: number | null) {
  const queryClient = useQueryClient();
  const toast = useAdminToast();
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: (body: ProductWrite) => (id === null ? createProduct(body) : updateProduct(id, body)),
    onSuccess: (product: Product) => {
      queryClient.setQueryData(productKeys.detail(product.id), product);
      invalidate();
      toast.success(id === null ? t("adminProducts.toast.created") : t("adminProducts.toast.saved"));
    },
    onError: (error) => toast.error(getErrorMessage(error, t("adminProducts.toast.saveFailed"))),
  });
}

export function usePublishProduct(id: number) {
  const queryClient = useQueryClient();
  const toast = useAdminToast();
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: (publish: boolean) => publishProduct(id, publish),
    onSuccess: (product) => {
      queryClient.setQueryData(productKeys.detail(id), product);
      invalidate();
      toast.success(
        product.status === "published"
          ? t("adminProducts.toast.published")
          : t("adminProducts.toast.unpublished"),
      );
    },
    onError: (error) => toast.error(getErrorMessage(error, t("adminProducts.toast.publishFailed"))),
  });
}

export function useDeleteProduct() {
  const toast = useAdminToast();
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      invalidate();
      toast.success(t("adminProducts.toast.deleted"));
    },
    onError: (error) => toast.error(getErrorMessage(error, t("adminProducts.toast.deleteFailed"))),
  });
}

export function useBulkStatus() {
  const toast = useAdminToast();
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: ProductStatus }) => bulkStatus(ids, status),
    onSuccess: (result) => {
      invalidate();
      toast.success(t("adminProducts.toast.bulkDone", { count: result.updated_ids.length }));
      if (result.skipped_ids.length > 0)
        toast.error(t("adminProducts.toast.bulkSkipped", { count: result.skipped_ids.length }));
    },
    onError: (error) => toast.error(getErrorMessage(error, t("adminProducts.toast.saveFailed"))),
  });
}
