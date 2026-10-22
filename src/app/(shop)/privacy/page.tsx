import { buildContentPageMetadata, ContentPageView } from "@/features/content";

export function generateMetadata() {
  return buildContentPageMetadata("privacy");
}

export default function PrivacyPage() {
  return <ContentPageView slug="privacy" />;
}
