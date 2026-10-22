import { buildContentPageMetadata, ContentPageView } from "@/features/content";

export function generateMetadata() {
  return buildContentPageMetadata("offer");
}

export default function OfferPage() {
  return <ContentPageView slug="offer" />;
}
