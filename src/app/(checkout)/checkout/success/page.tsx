import type { Metadata } from "next";
import { Suspense } from "react";

import { routes } from "@/data/routes";
import { OrderSuccess } from "@/features/checkout";
import { t } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    title: t("checkout.meta.successTitle"),
    description: t("checkout.meta.successDescription"),
    path: routes.checkoutSuccess(),
  }),
  robots: { index: false, follow: false },
};

function parseOrderNumber(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const number = Number(raw);
  return Number.isInteger(number) && number > 0 ? number : null;
}

async function SuccessContent({ searchParams }: Pick<PageProps<"/checkout/success">, "searchParams">) {
  const { order, token } = await searchParams;
  const rawToken = Array.isArray(token) ? token[0] : token;
  const safeToken = rawToken && /^[0-9a-f-]{36}$/i.test(rawToken) ? rawToken : null;
  return <OrderSuccess orderNumber={parseOrderNumber(order)} token={safeToken} />;
}

export default function CheckoutSuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  return (
    <Suspense fallback={<OrderSuccess orderNumber={null} />}>
      <SuccessContent searchParams={searchParams} />
    </Suspense>
  );
}
