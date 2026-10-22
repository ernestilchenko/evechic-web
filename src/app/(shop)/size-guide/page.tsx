import { buildContentPageMetadata, ContentPageView } from "@/features/content";

export function generateMetadata() {
  return buildContentPageMetadata("size-guide");
}

export default function SizeGuidePage() {
  return <ContentPageView slug="size-guide" />;
}
