import { buildContentPageMetadata, ContentPageView } from "@/features/content";

export function generateMetadata() {
  return buildContentPageMetadata("care");
}

export default function CarePage() {
  return <ContentPageView slug="care" />;
}
