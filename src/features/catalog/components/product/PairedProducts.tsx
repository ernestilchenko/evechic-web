import { SectionHeader } from "@/components/ui/SectionHeader";
import { t } from "@/lib/i18n";

import { getPairedProducts } from "../../services/catalogService";
import { ProductGrid } from "../ProductGrid";

export async function PairedProducts({ slug }: { slug: string }) {
  const products = await getPairedProducts(slug).catch(() => []);
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="paired-title" className="container-page flex flex-col gap-7 pt-[72px]">
      <SectionHeader id="paired-title" title={t("productPage.paired.title")} />
      <ProductGrid products={products.slice(0, 4)} />
    </section>
  );
}
