import { siteConfig } from "@/data/site";

type Gtag = (...args: unknown[]) => void;
type TagWindow = Window & { gtag?: Gtag; dataLayer?: unknown[] };

const REPORTED_PREFIX = "evechic:gads-purchase:";

function tagFunction(): Gtag {
  const tagWindow = window as TagWindow;
  return (
    tagWindow.gtag ??
    function queue() {
      tagWindow.dataLayer = tagWindow.dataLayer ?? [];
      // eslint-disable-next-line prefer-rest-params
      tagWindow.dataLayer.push(arguments);
    }
  );
}

export function feedItemId(sku: string, variantId: number) {
  return `${sku}-${variantId}`;
}

function reportItems(event: "view_item" | "add_to_cart", ids: string[], price: string | number) {
  if (typeof window === "undefined" || ids.length === 0) return;
  tagFunction()("event", event, {
    send_to: siteConfig.googleAds.tagId,
    value: Number(price),
    currency: "UAH",
    items: ids.map((id) => ({ id, google_business_vertical: "retail" })),
  });
}

export function reportViewItem(ids: string[], price: string | number) {
  reportItems("view_item", ids, price);
}

export function reportAddToCart(id: string, price: string | number) {
  reportItems("add_to_cart", [id], price);
}

export function reportPurchase(orderNumber: number, total: string | number) {
  if (typeof window === "undefined") return;
  const gtag = tagFunction();
  const key = `${REPORTED_PREFIX}${orderNumber}`;
  try {
    if (window.localStorage.getItem(key)) return;
    window.localStorage.setItem(key, "1");
  } catch {}
  gtag("event", "conversion", {
    send_to: siteConfig.googleAds.purchaseLabel,
    value: Number(total),
    currency: "UAH",
    transaction_id: String(orderNumber),
  });
}
