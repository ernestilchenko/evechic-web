"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getErrorMessage, useAdminToast } from "@/features/admin";
import { t } from "@/lib/i18n";

import { contentKeys } from "../constants/content";
import {
  deleteBanner,
  deleteFaq,
  deleteInstagramPost,
  deletePage,
  fetchBanners,
  fetchInstagramPosts,
  fetchPage,
  fetchPages,
  reorderFaq,
  saveBanner,
  saveFaq,
  saveInstagramPost,
  savePage,
} from "../services/contentService";
import type { AdminPage } from "../types";

export function useBanners() {
  return useQuery({ queryKey: contentKeys.banners, queryFn: fetchBanners });
}

export function useInstagramPosts() {
  return useQuery({ queryKey: contentKeys.instagram, queryFn: fetchInstagramPosts });
}

export function usePages(q: string) {
  return useQuery({ queryKey: contentKeys.pages(q), queryFn: () => fetchPages(q) });
}

export function usePage(id: number | null) {
  return useQuery({
    queryKey: contentKeys.page(id ?? 0),
    queryFn: () => fetchPage(id ?? 0),
    enabled: id !== null,
  });
}

function useContentMutation<V, R>(
  mutationFn: (variables: V) => Promise<R>,
  success: string,
  failure: string,
) {
  const queryClient = useQueryClient();
  const toast = useAdminToast();
  return useMutation({
    mutationFn,
    onSuccess: () => toast.success(success),
    onError: (error) => toast.error(getErrorMessage(error, failure)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: contentKeys.all }),
  });
}

export function useSaveBanner() {
  return useContentMutation(
    ({ id, body }: { id: number | null; body: FormData }) => saveBanner(id, body),
    t("adminContent.toast.saved"),
    t("adminContent.toast.saveFailed"),
  );
}

export function useDeleteBanner() {
  return useContentMutation(
    deleteBanner,
    t("adminContent.toast.deleted"),
    t("adminContent.toast.deleteFailed"),
  );
}

export function useSaveInstagramPost() {
  return useContentMutation(
    ({ id, body }: { id: number | null; body: FormData }) => saveInstagramPost(id, body),
    t("adminContent.toast.saved"),
    t("adminContent.toast.saveFailed"),
  );
}

export function useDeleteInstagramPost() {
  return useContentMutation(
    deleteInstagramPost,
    t("adminContent.toast.deleted"),
    t("adminContent.toast.deleteFailed"),
  );
}

export function useSavePage() {
  return useContentMutation(
    ({ id, body }: { id: number | null; body: FormData }) => savePage(id, body),
    t("adminContent.toast.saved"),
    t("adminContent.toast.saveFailed"),
  );
}

export function useDeletePage() {
  return useContentMutation(
    deletePage,
    t("adminContent.toast.deleted"),
    t("adminContent.toast.deleteFailed"),
  );
}

export function useSaveFaq(pageId: number) {
  return useContentMutation(
    ({ faqId, body }: { faqId: number | null; body: { question: string; answer: string } }) =>
      saveFaq(pageId, faqId, body),
    t("adminContent.toast.faqSaved"),
    t("adminContent.toast.saveFailed"),
  );
}

export function useDeleteFaq(pageId: number) {
  return useContentMutation(
    (faqId: number) => deleteFaq(pageId, faqId),
    t("adminContent.toast.deleted"),
    t("adminContent.toast.deleteFailed"),
  );
}

export function useReorderFaq(pageId: number) {
  const queryClient = useQueryClient();
  const toast = useAdminToast();
  const key = contentKeys.page(pageId);
  return useMutation({
    mutationFn: (ids: number[]) => reorderFaq(pageId, ids),
    onMutate: (ids) => {
      const previous = queryClient.getQueryData<AdminPage>(key);
      queryClient.setQueryData<AdminPage>(key, (page) =>
        page
          ? {
              ...page,
              faq: ids
                .map((id) => page.faq.find((item) => item.id === id))
                .filter((item) => item !== undefined),
            }
          : page,
      );
      return { previous };
    },
    onError: (error, _, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
      toast.error(getErrorMessage(error, t("adminContent.toast.saveFailed")));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}
