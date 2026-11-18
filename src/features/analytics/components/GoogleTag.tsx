import Script from "next/script";

import { siteConfig } from "@/data/site";

export function GoogleTag() {
  const { tagId } = siteConfig.googleAds;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtm.js?id=${siteConfig.googleMerchantTagId}`}
        strategy="afterInteractive"
      />
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${tagId}`} strategy="afterInteractive" />
      <Script id="google-tag" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${tagId}');`}
      </Script>
    </>
  );
}
