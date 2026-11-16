import type { Metadata } from "next";

import { siteConfig } from "@/data/site";

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  images?: { url: string; alt?: string }[];
  noIndex?: boolean;
  absoluteTitle?: boolean;
};

const DEFAULT_IMAGES = [{ url: "/opengraph-image", alt: siteConfig.name }];

export function buildMetadata({
  title,
  description,
  path,
  images,
  noIndex,
  absoluteTitle,
}: PageMetadataInput): Metadata {
  const shareImages = images?.length ? images : DEFAULT_IMAGES;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: shareImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: shareImages.map((image) => image.url),
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
