import { cacheLife, cacheTag } from "next/cache";

import { apiFetch, isNotFound } from "@/lib/api/client";

import { contentCacheTags } from "../constants/cache";
import type { ContentPage, ContentPageSummary, HomeContent } from "../types";

const emptyHome: HomeContent = { hero: null, lookbook: null, instagram: [] };

export async function getHomeContent(): Promise<HomeContent> {
  "use cache";
  cacheLife("minutes");
  cacheTag(contentCacheTags.home);
  try {
    return await apiFetch<HomeContent>("content/home/");
  } catch {
    return emptyHome;
  }
}

export async function getContentPages(): Promise<ContentPageSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(contentCacheTags.pages);
  try {
    return await apiFetch<ContentPageSummary[]>("content/pages/");
  } catch {
    return [];
  }
}

export async function getContentPage(slug: string): Promise<ContentPage | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(contentCacheTags.pages, contentCacheTags.page(slug));
  try {
    return await apiFetch<ContentPage>(`content/pages/${encodeURIComponent(slug)}/`);
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}
