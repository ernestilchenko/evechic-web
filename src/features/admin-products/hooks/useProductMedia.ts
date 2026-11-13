"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getErrorMessage, useAdminToast } from "@/features/admin";
import { t } from "@/lib/i18n";

import { productKeys } from "../constants/products";
import {
  createVariant,
  deleteImage,
  deleteVariant,
  reorderImages,
  updateImage,
  updateVariant,
  uploadImage,
} from "../services/productsService";
import type { Product, ProductImageUpdate, VariantWrite } from "../types";

function useProductCache(id: number) {
  const queryClient = useQueryClient();
  const key = productKeys.detail(id);
  return {
    get: () => queryClient.getQueryData<Product>(key),
    set: (updater: (product: Product) => Product) =>
      queryClient.setQueryData<Product>(key, (product) => (product ? updater(product) : product)),
    refresh: () => {
      queryClient.invalidateQueries({ queryKey: key });
      queryClient.invalidateQueries({ queryKey: [...productKeys.all, "list"] });
    },
  };
}

export function useUploadImages(id: number) {
  const cache = useProductCache(id);
  const toast = useAdminToast();
  return useMutation({
    mutationFn: async (files: File[]) => {
      for (const file of files) {
        const image = await uploadImage(id, file, "");
        cache.set((product) => ({ ...product, images: [...product.images, image] }));
      }
      return files.length;
    },
    onSuccess: (count) => toast.success(t("adminProducts.toast.imagesUploaded", { count })),
    onError: (error) => toast.error(getErrorMessage(error, t("adminProducts.toast.uploadFailed"))),
    onSettled: cache.refresh,
  });
}

export function useUpdateImage(id: number) {
  const cache = useProductCache(id);
  const toast = useAdminToast();
  return useMutation({
    mutationFn: ({ imageId, body }: { imageId: number; body: ProductImageUpdate }) =>
      updateImage(id, imageId, body),
    onSuccess: (image) => {
      cache.set((product) => ({
        ...product,
        images: product.images.map((item) => (item.id === image.id ? image : item)),
      }));
      toast.success(t("adminProducts.toast.imageUpdated"));
    },
    onError: (error) => toast.error(getErrorMessage(error, t("adminProducts.toast.saveFailed"))),
    onSettled: cache.refresh,
  });
}

export function useDeleteImage(id: number) {
  const cache = useProductCache(id);
  const toast = useAdminToast();
  return useMutation({
    mutationFn: (imageId: number) => deleteImage(id, imageId),
    onSuccess: (_, imageId) => {
      cache.set((product) => ({
        ...product,
        images: product.images.filter((image) => image.id !== imageId),
      }));
      toast.success(t("adminProducts.toast.imageDeleted"));
    },
    onError: (error) => toast.error(getErrorMessage(error, t("adminProducts.toast.saveFailed"))),
    onSettled: cache.refresh,
  });
}

export function useReorderImages(id: number) {
  const cache = useProductCache(id);
  const toast = useAdminToast();
  return useMutation({
    mutationFn: (ids: number[]) => reorderImages(id, ids),
    onMutate: (ids) => {
      const previous = cache.get();
      cache.set((product) => ({
        ...product,
        images: ids
          .map((imageId) => product.images.find((image) => image.id === imageId))
          .filter((image) => image !== undefined),
      }));
      return { previous };
    },
    onError: (error, _, context) => {
      if (context?.previous) cache.set(() => context.previous as Product);
      toast.error(getErrorMessage(error, t("adminProducts.toast.saveFailed")));
    },
    onSettled: cache.refresh,
  });
}

export function useSaveVariant(id: number) {
  const cache = useProductCache(id);
  const toast = useAdminToast();
  return useMutation({
    mutationFn: ({ variantId, body }: { variantId: number | null; body: VariantWrite }) =>
      variantId === null ? createVariant(id, body) : updateVariant(id, variantId, body),
    onSuccess: (variant, { variantId }) => {
      cache.set((product) => ({
        ...product,
        variants:
          variantId === null
            ? [...product.variants, variant]
            : product.variants.map((item) => (item.id === variantId ? variant : item)),
      }));
      toast.success(t("adminProducts.toast.variantSaved"));
    },
    onError: (error) => toast.error(getErrorMessage(error, t("adminProducts.toast.saveFailed"))),
    onSettled: cache.refresh,
  });
}

export function useDeleteVariant(id: number) {
  const cache = useProductCache(id);
  const toast = useAdminToast();
  return useMutation({
    mutationFn: (variantId: number) => deleteVariant(id, variantId),
    onSuccess: (_, variantId) => {
      cache.set((product) => ({
        ...product,
        variants: product.variants.filter((item) => item.id !== variantId),
      }));
      toast.success(t("adminProducts.toast.variantDeleted"));
    },
    onError: (error) => toast.error(getErrorMessage(error, t("adminProducts.toast.deleteFailed"))),
    onSettled: cache.refresh,
  });
}
