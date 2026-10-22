import { notFound } from "next/navigation";

import type { ContentPageSlug } from "../constants/pages";
import { getContentPage } from "../services/contentService";

import { AboutView } from "./AboutView";
import { InfoPageView } from "./InfoPageView";

export async function ContentPageView({ slug }: { slug: ContentPageSlug }) {
  const page = await getContentPage(slug);
  if (!page) notFound();
  return slug === "about" ? <AboutView page={page} /> : <InfoPageView slug={slug} page={page} />;
}
