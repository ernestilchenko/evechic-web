"use client";

import { useEffect } from "react";

import { siteConfig } from "@/data/site";

type SurveyOptIn = {
  load: (module: "surveyoptin", callback: () => void) => void;
  surveyoptin: { render: (options: Record<string, unknown>) => void };
};

type ReviewsWindow = Window & { gapi?: SurveyOptIn; renderOptIn?: () => void };

const SCRIPT_URL = "https://apis.google.com/js/platform.js?onload=renderOptIn";
const DELIVERY_DAYS = 7;
const SHOWN_PREFIX = "evechic:gcr-optin:";

function deliveryDate() {
  return new Date(Date.now() + DELIVERY_DAYS * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function firstTime(orderNumber: number) {
  const key = `${SHOWN_PREFIX}${orderNumber}`;
  try {
    if (window.localStorage.getItem(key)) return false;
    window.localStorage.setItem(key, "1");
  } catch {}
  return true;
}

export function CustomerReviewsOptIn({ orderNumber, email }: { orderNumber: number; email: string }) {
  useEffect(() => {
    if (!firstTime(orderNumber)) return;
    const reviewsWindow = window as ReviewsWindow;
    reviewsWindow.renderOptIn = () =>
      reviewsWindow.gapi?.load("surveyoptin", () =>
        reviewsWindow.gapi?.surveyoptin.render({
          merchant_id: siteConfig.googleMerchantId,
          order_id: String(orderNumber),
          email,
          delivery_country: "UA",
          estimated_delivery_date: deliveryDate(),
        }),
      );
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    document.body.appendChild(script);
  }, [orderNumber, email]);

  return null;
}
