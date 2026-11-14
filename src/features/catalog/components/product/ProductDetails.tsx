import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Product } from "schema-dts";

import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrackOnMount } from "@/features/analytics";
import { routes } from "@/data/routes";
import { siteConfig } from "@/data/site";
import type { ProductDetail } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { t } from "@/lib/i18n";
import { breadcrumbJsonLd } from "@/lib/structuredData";

import { getProduct } from "../../services/catalogService";
import { productDescription, productImages } from "../../utils/productText";
import { productJsonLd } from "../../utils/structuredData";

import { ProductColorProvider } from "./ProductColorContext";
import { ProductColorGallery } from "./ProductColorGallery";
import { ProductPurchase } from "./ProductPurchase";
import { SimilarProducts } from "./SimilarProducts";

type ProductDetailsProps = {
  params: Promise<{ slug: string }>;
  renderFavorite?: (product: ProductDetail) => React.ReactNode;
  renderReviews?: (product: ProductDetail) => React.ReactNode;
};

const conditions = [
  ["productPage.conditions.delivery", "productPage.conditions.deliveryText"],
  ["productPage.conditions.payment", "productPage.conditions.paymentText"],
  ["productPage.conditions.returns", "productPage.conditions.returnsText"],
] as const;

export async function ProductDetails({ params, renderFavorite, renderReviews }: ProductDetailsProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const category = product.category;
  const crumbs = [
    { label: t("catalog.breadcrumbs.home"), href: routes.home },
    { label: t("catalog.breadcrumbs.catalog"), href: routes.catalog },
    ...category.parents.map((parent) => ({ label: parent.name, href: routes.category(parent.slug) })),
    { label: category.name, href: routes.category(category.slug) },
    { label: product.name, href: routes.product(product.slug) },
  ];
  const images = productImages(product);
  const badge = product.is_new ? <Badge>{t("product.badgeNew")}</Badge> : null;

  return (
    <>
      <JsonLd<Product> data={productJsonLd(product, productDescription(product, 5000))} />
      <TrackOnMount kind="product_view" productId={product.id} />
      <JsonLd data={breadcrumbJsonLd(crumbs.map((crumb) => ({ name: crumb.label, path: crumb.href })))} />
      <div className="container-page">
        <Breadcrumbs
          items={crumbs.map((crumb, index) => (index === crumbs.length - 1 ? { label: crumb.label } : crumb))}
          className="py-6 lg:py-8"
        />
        <ProductColorProvider variants={product.variants}>
          <article className="grid gap-10 pb-6 lg:grid-cols-[minmax(0,658fr)_minmax(0,598fr)] lg:gap-14">
            <div className="lg:sticky lg:top-6 lg:self-start">
              <ProductColorGallery images={images} badge={badge} />
            </div>
            <div className="flex flex-col gap-[22px]">
              <p className="text-gold text-[10.5px] font-medium tracking-[0.2em] uppercase">
                <Link href={routes.category(category.slug)} className="hover:text-ink">
                  {category.name}
                </Link>
                {" · "}
                {t("productPage.sku", { sku: product.sku })}
              </p>
              <h1 className="font-serif text-[36px] leading-[1.1] font-light sm:text-[46px]">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3.5">
                <p className="flex items-baseline gap-3.5">
                  <span className="sr-only">{t("product.price")}:</span>
                  <span className="text-[26px] font-semibold">{formatPrice(product.price)}</span>
                  {product.is_on_sale && product.old_price ? (
                    <>
                      <span className="sr-only">{t("product.oldPrice")}:</span>
                      <s className="text-placeholder text-base">{formatPrice(product.old_price)}</s>
                    </>
                  ) : null}
                </p>
                {product.is_on_sale && product.discount_percent > 0 ? (
                  <Badge tone="sale" className="px-2.5 py-1.5 tracking-[0.12em]">
                    −{product.discount_percent}%
                  </Badge>
                ) : null}
              </div>
              {siteConfig.installments.enabled &&
              Number(product.price) >= siteConfig.installments.minAmount ? (
                <p className="text-[12.5px]">
                  {t("productPage.installments", {
                    parts: siteConfig.installments.parts,
                    amount: formatPrice(Math.ceil(Number(product.price) / siteConfig.installments.parts)),
                  })}
                </p>
              ) : null}
              <p className="text-muted flex items-center gap-2 text-[12.5px]">
                <span
                  aria-hidden
                  className={cn(
                    "size-[7px] rounded-full",
                    product.in_stock ? "bg-success" : "bg-line-strong",
                  )}
                />
                {product.in_stock
                  ? t("productPage.availability.inStock")
                  : t("productPage.availability.outOfStock")}
              </p>

              <ProductPurchase
                productId={product.id}
                productSlug={product.slug}
                fitVerdict={product.rating.fit}
                variants={product.variants}
                sizes={product.sizes}
                favorite={renderFavorite?.(product)}
              />

              <dl
                aria-label={t("productPage.conditions.label")}
                className="bg-sand flex flex-col gap-3 p-[22px]"
              >
                {conditions.map(([term, text]) => (
                  <div key={term} className="flex gap-4">
                    <dt className="w-24 shrink-0 text-[11.5px] font-semibold">{t(term)}</dt>
                    <dd className="text-muted flex-1 text-xs">{t(text)}</dd>
                  </div>
                ))}
              </dl>

              <div className="pt-2.5">
                {product.description ? (
                  <Accordion title={t("productPage.accordion.description")} defaultOpen>
                    <p className="whitespace-pre-line">{product.description}</p>
                  </Accordion>
                ) : null}
                {product.composition_care ? (
                  <Accordion title={t("productPage.accordion.composition")}>
                    <p className="whitespace-pre-line">{product.composition_care}</p>
                  </Accordion>
                ) : null}
                <Accordion title={t("productPage.accordion.delivery")}>
                  <p>{t("productPage.accordion.deliveryText")}</p>
                  <Link href={routes.delivery} className="text-gold hover:text-ink mt-2 inline-block">
                    {t("productPage.accordion.more")} →
                  </Link>
                </Accordion>
                <Accordion title={t("productPage.accordion.returns")} className="border-b">
                  <p>{t("productPage.accordion.returnsText")}</p>
                  <Link href={routes.returns} className="text-gold hover:text-ink mt-2 inline-block">
                    {t("productPage.accordion.more")} →
                  </Link>
                </Accordion>
              </div>
            </div>
          </article>
        </ProductColorProvider>
      </div>
      {renderReviews ? renderReviews(product) : null}
      <Suspense fallback={null}>
        <SimilarProducts slug={product.slug} categorySlug={category.slug} />
      </Suspense>
    </>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="container-page" aria-hidden>
      <div className="bg-sand/70 my-8 h-4 w-72" />
      <div className="grid gap-10 pb-24 lg:grid-cols-[minmax(0,658fr)_minmax(0,598fr)] lg:gap-14">
        <div className="bg-sand aspect-[560/720] animate-pulse" />
        <div className="flex flex-col gap-6">
          <div className="bg-sand/70 h-4 w-48" />
          <div className="bg-sand/70 h-12 w-4/5" />
          <div className="bg-sand/70 h-8 w-40" />
          <div className="bg-sand/70 h-[46px] w-72" />
          <div className="bg-sand h-[58px] w-full" />
        </div>
      </div>
    </div>
  );
}
