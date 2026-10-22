import { buildContentPageMetadata, ContentPageView } from "@/features/content";

export function generateMetadata() {
  return buildContentPageMetadata("about");
}

export default function AboutPage() {
  return <ContentPageView slug="about" />;
}
