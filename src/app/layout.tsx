import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { JsonLd } from "@/components/seo/JsonLd";
import { AnalyticsTracker } from "@/features/analytics";
import { siteConfig } from "@/data/site";
import { t } from "@/lib/i18n";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structuredData";
import { AppProviders } from "@/providers/AppProviders";

import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: t("home.meta.title"), template: `%s — ${siteConfig.name}` },
  description: t("home.meta.description"),
  applicationName: siteConfig.name,
  formatDetection: { telephone: false },
  openGraph: { siteName: siteConfig.name, locale: siteConfig.locale, type: "website" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { "max-image-preview": "large" } },
};

export const viewport: Viewport = {
  themeColor: "#f7f4f0",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={siteConfig.language} className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="focus:bg-ink focus:text-cream sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2"
        >
          {t("layout.skipToContent")}
        </a>
        <AppProviders>{children}</AppProviders>
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
