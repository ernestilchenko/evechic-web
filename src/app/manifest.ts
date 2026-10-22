import type { MetadataRoute } from "next";

import { siteConfig } from "@/data/site";
import { t } from "@/lib/i18n";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: t("home.meta.description"),
    start_url: "/",
    display: "standalone",
    background_color: "#f7f4f0",
    theme_color: "#17150f",
    lang: siteConfig.language,
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
