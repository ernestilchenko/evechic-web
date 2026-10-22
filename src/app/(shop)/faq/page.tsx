import { buildContentPageMetadata, ContentPageView } from "@/features/content";

export function generateMetadata() {
  return buildContentPageMetadata("faq");
}

export default function FaqPage() {
  return <ContentPageView slug="faq" />;
}
