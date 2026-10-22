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

export function buildMetadata({
  title,
  description,
  path,
  images,
  noIndex,
  absoluteTitle,
}: PageMetadataInput): Metadata {
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
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
