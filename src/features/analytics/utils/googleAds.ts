import { siteConfig } from "@/data/site";

type Gtag = (...args: unknown[]) => void;
type TagWindow = Window & { gtag?: Gtag; dataLayer?: unknown[] };

const REPORTED_PREFIX = "evechic:gads-purchase:";

export function reportPurchase(orderNumber: number, total: string | number) {
  if (typeof window === "undefined") return;
  const tagWindow = window as TagWindow;
  const gtag: Gtag =
    tagWindow.gtag ??
    function queue() {
      tagWindow.dataLayer = tagWindow.dataLayer ?? [];
      // eslint-disable-next-line prefer-rest-params
      tagWindow.dataLayer.push(arguments);
    };
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
