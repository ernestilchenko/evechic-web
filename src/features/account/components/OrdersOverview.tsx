import { Suspense } from "react";

import { OrdersSection } from "./OrdersSection";
import { SummaryCards } from "./SummaryCards";

export function OrdersOverview() {
  return (
    <div className="flex flex-col gap-[34px]">
      <SummaryCards />
      <Suspense>
        <OrdersSection />
      </Suspense>
    </div>
  );
}
