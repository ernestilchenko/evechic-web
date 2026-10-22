import type { ProductDetail } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";
import { t } from "@/lib/i18n";

export function productDescription(
  product: Pick<ProductDetail, "name" | "description" | "price">,
  limit = 155,
) {
  const text = product.description.replace(/\s+/g, " ").trim();
  if (!text)
    return t("productPage.meta.descriptionTemplate", {
      name: product.name,
      price: formatPrice(product.price),
    });
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 0 ? cut.lastIndexOf(" ") : cut.length)}…`;
}

export function productImages(product: Pick<ProductDetail, "images" | "main_image" | "name">) {
  if (product.images.length)
    return product.images.map((image) => ({ url: image.url, alt: image.alt || product.name }));
  return product.main_image ? [{ url: product.main_image, alt: product.name }] : [];
}
