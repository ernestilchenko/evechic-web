import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { GoogleTag } from "@/features/analytics";
import { NewsletterPopup } from "@/features/newsletter";

export default function ShopLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <NewsletterPopup />
      <GoogleTag />
    </>
  );
}
