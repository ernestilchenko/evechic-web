import { SectionHeader } from "@/components/ui/SectionHeader";
import { routes } from "@/data/routes";
import { getProducts, ProductGrid } from "@/features/catalog";
import { t } from "@/lib/i18n";

export async function NewArrivals() {
  const { items } = await getProducts({ sort: "newest", page_size: 4 }).catch(() => ({ items: [] }));

  return (
    <section
      aria-labelledby="new-arrivals-title"
      className="container-page flex flex-col gap-7 pt-16 pb-20 lg:pt-24"
    >
      <SectionHeader
        id="new-arrivals-title"
        title={t("home.newArrivals.title")}
        action={{ href: routes.catalog, label: t("home.newArrivals.cta") }}
      />
      {items.length > 0 ? (
        <ProductGrid products={items} />
      ) : (
        <p className="text-muted">{t("home.newArrivals.empty")}</p>
      )}
    </section>
  );
}
