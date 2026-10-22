import { SectionHeader } from "@/components/ui/SectionHeader";
import { routes } from "@/data/routes";
import { t } from "@/lib/i18n";

import { getSimilarProducts } from "../../services/catalogService";
import { ProductGrid } from "../ProductGrid";

export async function SimilarProducts({ slug, categorySlug }: { slug: string; categorySlug: string }) {
  const products = await getSimilarProducts(slug).catch(() => []);
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="similar-title" className="container-page flex flex-col gap-7 pt-[72px] pb-24">
      <SectionHeader
        id="similar-title"
        title={t("productPage.similar.title")}
        action={{ href: routes.category(categorySlug), label: t("productPage.similar.cta") }}
      />
      <ProductGrid products={products.slice(0, 4)} />
    </section>
  );
}
