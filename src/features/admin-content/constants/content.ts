import type { BannerPlacement, ContentTab } from "../types";

export const CONTENT_TABS: ContentTab[] = ["banners", "instagram", "pages"];
export const BANNER_PLACEMENTS: BannerPlacement[] = ["hero", "lookbook"];
export const CONTENT_PAGE_SIZE = 50;
export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/avif";

export const contentKeys = {
  all: ["admin", "content"] as const,
  banners: ["admin", "content", "banners"] as const,
  instagram: ["admin", "content", "instagram"] as const,
  pages: (q: string) => ["admin", "content", "pages", q] as const,
  page: (id: number) => ["admin", "content", "page", id] as const,
};
