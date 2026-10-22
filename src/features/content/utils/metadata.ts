import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { buildMetadata } from "@/lib/seo";

import { contentPagePaths, type ContentPageSlug } from "../constants/pages";
import { getContentPage } from "../services/contentService";

export async function buildContentPageMetadata(slug: ContentPageSlug): Promise<Metadata> {
  const page = await getContentPage(slug);
  if (!page) notFound();
  return buildMetadata({
    title: page.meta_title || page.title,
    description: page.meta_description || page.lead,
    path: contentPagePaths[slug],
    absoluteTitle: Boolean(page.meta_title),
    images: page.image ? [{ url: page.image, alt: page.image_alt || page.title }] : undefined,
  });
}
