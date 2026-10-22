import { buildContentPageMetadata, ContentPageView } from "@/features/content";

export function generateMetadata() {
  return buildContentPageMetadata("returns");
}

export default function ReturnsPage() {
  return <ContentPageView slug="returns" />;
}
