import { buildContentPageMetadata, ContentPageView } from "@/features/content";

export function generateMetadata() {
  return buildContentPageMetadata("delivery");
}

export default function DeliveryPage() {
  return <ContentPageView slug="delivery" />;
}
