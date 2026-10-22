import type { MetadataRoute } from "next";

import { routes } from "@/data/routes";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [routes.cart, routes.checkout, routes.account, routes.login, "/admin", routes.search],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
